import { SITE } from "@/lib/site";
import {
  addDays,
  daySlots,
  firstFree,
  formatIsoWithOffset,
  localParts,
  localToInstant,
  parseTimeRange,
  parseWeekdays,
  type Interval,
  type WorkingHoursConfig,
} from "@/lib/workingHours";

/**
 * Raynet CRM: z poptávky z webu založí lead (předmět = jméno a příjmení) a
 * k němu naplánuje telefonát na nejbližší volnou pracovní hodinu vlastníka.
 * Když už poptávající v Raynetu je jako klient (Company), lead se nezakládá:
 * vznikne obchodní případ na klienta a úkol, obojí vždy na vlastníka z
 * RAYNET_OWNER_ID (Adam) – klient sám (kategorie, vlastník) zůstává beze změny.
 *
 * REST API v2 (https://app.raynetcrm.com/api/doc/index-en.html):
 * basic auth uživatel + API klíč, hlavička X-Instance-Name, časy jako ISO 8601
 * s posunem zóny, seznamy filtrované zápisem `atribut[OPERATOR]=hodnota`.
 */

/** Poptávka z formuláře po validaci v /api/kontakt. */
export type Inquiry = {
  name: string;
  phone: string;
  email: string;
  topic: string;
  message: string;
  /** Cesta stránky, ze které formulář odešel, např. "/kontakt". */
  page?: string;
};

export type RaynetActivityType = "phoneCall" | "task";

export type RaynetConfig = {
  apiUrl: string;
  instanceName: string;
  username: string;
  apiKey: string;
  /** ID uživatele (kontaktní osoby), který lead i aktivitu vlastní. */
  ownerId: number;
  /** Číselník LeadCategory (u Evergreen = tipař). */
  leadCategoryId?: number;
  /** Číselník ContactSource, např. „web/poptávka“. */
  contactSourceId?: number;
  activityType: RaynetActivityType;
  hours: WorkingHoursConfig;
};

export type RaynetSyncResult =
  | { status: "skipped" }
  | {
      status: "created";
      leadId: number;
      activityId: number;
      slot: Interval;
      calendarFull: boolean;
      /** Víc klientů se stejným e-mailem/telefonem – lead založen s upozorněním. */
      possibleDuplicates?: number[];
    }
  | {
      status: "existingClient";
      companyId: number;
      businessCaseId: number;
      /** Opakované odeslání do 24 h: jen doplněný popis otevřeného OP, bez nového úkolu. */
      repeated: boolean;
      activityId?: number;
      slot?: Interval;
      calendarFull?: boolean;
    }
  | {
      status: "failed";
      step: "config" | "lead" | "businessCase" | "calendar" | "activity";
      message: string;
      leadId?: number;
      companyId?: number;
      businessCaseId?: number;
    };

export type RaynetConfigResult =
  | { kind: "off" }
  | { kind: "invalid"; message: string }
  | { kind: "ok"; config: RaynetConfig };

export const RAYNET_DEFAULTS = {
  apiUrl: "https://app.raynet.cz/api/v2",
  timeZone: "Europe/Prague",
  /** 9:00–17:00 v minutách od půlnoci; poslední 15minutový slot začíná v 16:45. */
  workHours: [9 * 60, 17 * 60] as const,
  /** Pracovní dny pondělí–pátek (ISO 1–7). */
  workDays: [1, 2, 3, 4, 5] as const,
  slotMinutes: 15,
  /**
   * Kolik dní dopředu se hledá volný slot; každý den = jeden dotaz na kalendář.
   * Když se nic nenajde, plánuje se první slot následujícího pracovního dne po přijetí poptávky.
   */
  lookaheadDays: 30,
  /** Opakované odeslání formuláře od existujícího klienta v tomhle okně nezakládá druhý OP. */
  repeatSubmissionMs: 24 * 3600 * 1000,
  /** Společný limit pro celou synchronizaci (lead + kalendář + aktivita). */
  timeoutMs: 8_000,
  /** Slot musí začínat aspoň takhle dlouho po přijetí poptávky. */
  minNoticeMinutes: 5,
} as const;

const ENV_KEYS = ["RAYNET_API_KEY", "RAYNET_USERNAME", "RAYNET_INSTANCE_NAME", "RAYNET_OWNER_ID"] as const;

function parseId(v: string | undefined): number | undefined {
  if (!v?.trim()) return undefined;
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : undefined;
}

/**
 * Konfigurace z prostředí. `off` když není nastavená žádná RAYNET_* proměnná
 * (CRM se přeskočí), `invalid` když je nastavená jen část nebo špatně – to se
 * hlásí v e-mailu, aby se překlep v konfiguraci neztratil.
 */
export function raynetConfigFromEnv(env: NodeJS.ProcessEnv = process.env): RaynetConfigResult {
  const present = ENV_KEYS.filter((k) => env[k]?.trim());
  if (present.length === 0) return { kind: "off" };
  const missing = ENV_KEYS.filter((k) => !env[k]?.trim());
  if (missing.length) return { kind: "invalid", message: `chybí ${missing.join(", ")}` };

  const ownerId = parseId(env.RAYNET_OWNER_ID);
  if (!ownerId) return { kind: "invalid", message: "RAYNET_OWNER_ID musí být kladné celé číslo" };

  const activityType = env.RAYNET_ACTIVITY_TYPE?.trim() || "phoneCall";
  if (activityType !== "phoneCall" && activityType !== "task") {
    return { kind: "invalid", message: "RAYNET_ACTIVITY_TYPE musí být phoneCall nebo task" };
  }

  const hours = env.RAYNET_WORK_HOURS?.trim() ? parseTimeRange(env.RAYNET_WORK_HOURS) : RAYNET_DEFAULTS.workHours;
  if (!hours) return { kind: "invalid", message: "RAYNET_WORK_HOURS musí mít tvar 9-17 nebo 9:00-16:45" };

  const days = env.RAYNET_WORK_DAYS?.trim() ? parseWeekdays(env.RAYNET_WORK_DAYS) : new Set(RAYNET_DEFAULTS.workDays);
  if (!days) return { kind: "invalid", message: "RAYNET_WORK_DAYS musí mít tvar 1-5 nebo 1,2,3 (1 = pondělí, 7 = neděle)" };

  const slotMinutes = env.RAYNET_SLOT_MINUTES?.trim() ? parseId(env.RAYNET_SLOT_MINUTES) : RAYNET_DEFAULTS.slotMinutes;
  if (!slotMinutes || slotMinutes > 24 * 60) return { kind: "invalid", message: "RAYNET_SLOT_MINUTES musí být kladné celé číslo" };

  return {
    kind: "ok",
    config: {
      apiUrl: (env.RAYNET_API_URL?.trim() || RAYNET_DEFAULTS.apiUrl).replace(/\/+$/, ""),
      instanceName: env.RAYNET_INSTANCE_NAME!.trim(),
      username: env.RAYNET_USERNAME!.trim(),
      apiKey: env.RAYNET_API_KEY!.trim(),
      ownerId,
      leadCategoryId: parseId(env.RAYNET_LEAD_CATEGORY_ID),
      contactSourceId: parseId(env.RAYNET_CONTACT_SOURCE_ID),
      activityType,
      hours: { timeZone: RAYNET_DEFAULTS.timeZone, startMinute: hours[0], endMinute: hours[1], days, slotMinutes },
    },
  };
}

/** "Ing. Jan Novák" → titul, jméno, příjmení. Jediné slovo je příjmení. */
export function splitName(full: string): { firstName?: string; lastName: string; titleBefore?: string } {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  const titles: string[] = [];
  while (parts.length > 1 && parts[0].endsWith(".")) titles.push(parts.shift()!);
  const titleBefore = titles.length ? titles.join(" ") : undefined;
  if (parts.length <= 1) return { lastName: parts[0] ?? "", titleBefore };
  return { firstName: parts[0], lastName: parts.slice(1).join(" "), titleBefore };
}

const HTML_ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
}

/** Poznámka k leadu a zadání telefonátu – Raynet ji zobrazuje jako HTML, proto `<br>` a escapování.
 *  `extra` = upozornění pro tým (např. možný duplicitní klient), jde hned pod hlavičku. */
export function buildNote(inquiry: Inquiry, extra?: string): string {
  const lines = [
    `Nový lead z webu ${SITE.domain}`,
    "Typ: klientská poptávka",
    `Tipař: ${SITE.name}`,
    extra ?? null,
    inquiry.page ? `Stránka: ${inquiry.page}` : null,
    `Téma: ${inquiry.topic || "neuvedeno"}`,
    `Telefon: ${inquiry.phone}`,
    `E-mail: ${inquiry.email}`,
    "",
    `Zpráva: ${inquiry.message || "(bez zprávy)"}`,
  ];
  return lines
    .filter((l): l is string => l !== null)
    .map((l) => escapeHtml(l).replace(/\r?\n/g, "<br>"))
    .join("<br>");
}

class RaynetApiError extends Error {}

type RaynetEnvelope = { success?: boolean; message?: string; translatedMessage?: string };

type RaynetActivityRow = { status?: string; scheduledFrom?: string | null; scheduledTill?: string | null };

type RaynetContactInfo = { email?: string | null; email2?: string | null; tel1?: string | null; tel2?: string | null };

export type RaynetCompanyRow = {
  id: number;
  primaryAddress?: { contactInfo?: RaynetContactInfo | null } | null;
  addresses?: { contactInfo?: RaynetContactInfo | null }[] | null;
};

type RaynetBusinessCaseRow = {
  id: number;
  name?: string;
  company?: { id: number } | null;
  rowInfo?: { createdAt?: string | null } | null;
};

/** Typ OP „Úvěrový proces“ (jediný v číselníku) a kategorie „hypoteční úvěr“ – ověřeno v Raynetu 24. 10. 2026. */
const BUSINESS_CASE_TYPE_LOAN = 64;
const BUSINESS_CASE_CATEGORY_MORTGAGE = 116;

/** Telefon na posledních 9 číslic – "+420 777 123 456", "00420777123456" i "777123456" vyjdou stejně. */
export function normalizePhone(v?: string | null): string | null {
  const digits = (v ?? "").replace(/\D/g, "");
  return digits.length >= 9 ? digits.slice(-9) : null;
}

function contactInfos(row: RaynetCompanyRow): RaynetContactInfo[] {
  return [row.primaryAddress?.contactInfo, ...(row.addresses ?? []).map((a) => a.contactInfo)].filter(
    (ci): ci is RaynetContactInfo => !!ci,
  );
}

function rowHasEmail(row: RaynetCompanyRow, email: string): boolean {
  const e = email.trim().toLowerCase();
  return contactInfos(row).some((ci) => [ci.email, ci.email2].some((x) => x?.trim().toLowerCase() === e));
}

function rowHasPhone(row: RaynetCompanyRow, phone: string): boolean {
  return contactInfos(row).some((ci) => [ci.tel1, ci.tel2].some((x) => normalizePhone(x) === phone));
}

/** Název OP pro poptávku existujícího klienta; běžná pomlčka "-", ne "–". Podle názvu se pozná i opakované odeslání. */
export function businessCaseName(inquiry: Inquiry): string {
  return `Web poptávka - ${inquiry.topic || "kontakt"} (${SITE.domain})`;
}

/** Hypoteční témata formuláře (ContactForm TOPICS) → kategorie OP „hypoteční úvěr“. */
function businessCaseCategory(topic: string): number | undefined {
  return /hypoték|refinanc/i.test(topic) ? BUSINESS_CASE_CATEGORY_MORTGAGE : undefined;
}

/** Raynet vrací ISO 8601 s posunem (při dateFormat=ISO8601), jinak `yyyy-MM-dd HH:mm` v zóně uživatele API. */
export function parseRaynetDateTime(value: string, timeZone: string): number {
  const local = value.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/);
  if (local) return localToInstant(timeZone, +local[1], +local[2], +local[3], +local[4], +local[5]);
  return Date.parse(value);
}

function createClient(cfg: RaynetConfig, fetchImpl: typeof fetch, signal: AbortSignal) {
  const authorization = `Basic ${Buffer.from(`${cfg.username}:${cfg.apiKey}`).toString("base64")}`;

  async function call<T>(method: "GET" | "PUT" | "POST", path: string, query?: Record<string, string>, body?: unknown): Promise<T> {
    const url = `${cfg.apiUrl}/${path}${query ? `?${new URLSearchParams(query)}` : ""}`;
    const res = await fetchImpl(url, {
      method,
      headers: {
        Authorization: authorization,
        "X-Instance-Name": cfg.instanceName,
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
    const json = (await res.json().catch(() => null)) as (RaynetEnvelope & T) | null;
    if (!res.ok || !json?.success) {
      const detail = json?.translatedMessage || json?.message;
      throw new RaynetApiError(`${method} ${path}: HTTP ${res.status}${detail ? ` – ${detail}` : ""}`);
    }
    return json;
  }

  return {
    /** PUT = založení záznamu; vrací ID. */
    async insert(path: string, body: Record<string, unknown>): Promise<number> {
      const json = await call<{ data?: { id?: number } }>("PUT", path, undefined, body);
      const id = json.data?.id;
      if (typeof id !== "number") throw new RaynetApiError(`PUT ${path}: odpověď bez ID záznamu`);
      return id;
    },

    /** POST = úprava existujícího záznamu. */
    async update(path: string, body: Record<string, unknown>): Promise<void> {
      await call("POST", path, undefined, body);
    },

    /**
     * Existující klienti (Company) se stejným e-mailem, a když e-mail nic nevrátí, se stejným
     * telefonem. Každý výsledek se v odpovědi znovu ověří (shoda adresy): fulltext vrací i
     * částečné shody a selhává na e-mailech s „+“, proto napřed přesný filtr na e-mail
     * primární adresy a fulltext až potom.
     */
    async findClients(email: string, phone: string): Promise<RaynetCompanyRow[]> {
      const search = async (query: Record<string, string>) =>
        (await call<{ data?: RaynetCompanyRow[] }>("GET", "company/", { ...query, limit: "20" })).data ?? [];
      const found = new Map<number, RaynetCompanyRow>();

      const mail = email.trim();
      const emailQueries: Record<string, string>[] = [{ "primaryAddress.contactInfo.email": mail }, { fulltext: mail }];
      for (const query of mail ? emailQueries : []) {
        // Neznámý filtr Raynet odmítne – pak rozhodne fulltext.
        const rows = await search(query).catch((e) => (e instanceof RaynetApiError ? [] : Promise.reject(e)));
        for (const row of rows) if (rowHasEmail(row, mail)) found.set(row.id, row);
        if (found.size) return [...found.values()];
      }

      const tel = normalizePhone(phone);
      if (tel) {
        // Fulltext páruje celá slova a telefon bývá uložený různě – několik podob, shoda po normalizaci.
        for (const v of new Set([phone.trim(), tel, `${tel.slice(0, 3)} ${tel.slice(3, 6)} ${tel.slice(6)}`])) {
          for (const row of await search({ fulltext: v })) if (rowHasPhone(row, tel)) found.set(row.id, row);
        }
      }
      return [...found.values()];
    },

    /** Otevřený OP klienta se stejným názvem založený v posledních 24 h (opakované odeslání). */
    async recentBusinessCase(companyId: number, name: string, now: number): Promise<number | undefined> {
      const json = await call<{ data?: RaynetBusinessCaseRow[] }>("GET", "businessCase/", {
        company: String(companyId),
        status: "B_ACTIVE",
        sortColumn: "id",
        sortDirection: "DESC",
        limit: "20",
        dateFormat: "ISO8601",
      });
      const since = now - RAYNET_DEFAULTS.repeatSubmissionMs;
      return (json.data ?? []).find((bc) => {
        const created = bc.rowInfo?.createdAt ? parseRaynetDateTime(bc.rowInfo.createdAt, cfg.hours.timeZone) : NaN;
        return (bc.company?.id ?? companyId) === companyId && bc.name === name && created >= since;
      })?.id;
    },

    /** Obsazené intervaly vlastníka (jako účastníka) překrývající okno – bez zrušených a realizovaných aktivit. */
    async busy(from: number, till: number): Promise<Interval[]> {
      const tz = cfg.hours.timeZone;
      const json = await call<{ data?: RaynetActivityRow[] }>("GET", "activity/", {
        personFilter: String(cfg.ownerId),
        "scheduledFrom[LT]": formatIsoWithOffset(till, tz),
        "scheduledTill[GT]": formatIsoWithOffset(from, tz),
        "status[NE]": "CANCELLED",
        sortColumn: "scheduledFrom",
        sortDirection: "ASC",
        limit: "1000",
        dateFormat: "ISO8601",
      });
      const intervals: Interval[] = [];
      for (const row of json.data ?? []) {
        if (row.status === "COMPLETED" || !row.scheduledFrom || !row.scheduledTill) continue;
        const interval = { from: parseRaynetDateTime(row.scheduledFrom, tz), till: parseRaynetDateTime(row.scheduledTill, tz) };
        if (Number.isFinite(interval.from) && Number.isFinite(interval.till)) intervals.push(interval);
      }
      return intervals;
    },
  };
}

type Client = ReturnType<typeof createClient>;

async function findSlot(api: Client, hours: WorkingHoursConfig, now: number): Promise<{ slot: Interval; calendarFull: boolean }> {
  const notBefore = now + RAYNET_DEFAULTS.minNoticeMinutes * 60_000;
  const today = localParts(now, hours.timeZone);
  for (let offset = 0; offset < RAYNET_DEFAULTS.lookaheadDays; offset++) {
    const slots = daySlots(hours, addDays(today, offset), notBefore);
    if (slots.length === 0) continue;
    const busy = await api.busy(slots[0].from, slots[slots.length - 1].till);
    const free = firstFree(slots, busy);
    if (free) return { slot: free, calendarFull: false };
  }
  // Kalendář je plný: první slot následujícího pracovního dne po přijetí poptávky, i když koliduje.
  for (let offset = 1; offset <= 7; offset++) {
    const slots = daySlots(hours, addDays(today, offset), notBefore);
    if (slots.length > 0) return { slot: slots[0], calendarFull: true };
  }
  throw new RaynetApiError("pracovní doba neobsahuje žádný slot");
}

function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.name === "TimeoutError" ? `časový limit ${RAYNET_DEFAULTS.timeoutMs / 1000} s` : e.message;
  return String(e);
}

export type SyncOptions = {
  env?: NodeJS.ProcessEnv;
  /** Instant přijetí poptávky (výchozí teď). */
  now?: number;
  fetch?: typeof fetch;
};

/**
 * Založí lead a naplánuje k němu aktivitu. Nikdy nevyhazuje – každý krok
 * vrací stav, aby /api/kontakt mohl výsledek napsat do e-mailu.
 */
export async function syncInquiryToRaynet(inquiry: Inquiry, options: SyncOptions = {}): Promise<RaynetSyncResult> {
  const configured = raynetConfigFromEnv(options.env);
  if (configured.kind === "off") return { status: "skipped" };
  if (configured.kind === "invalid") return { status: "failed", step: "config", message: configured.message };

  const cfg = configured.config;
  const now = options.now ?? Date.now();
  const api = createClient(cfg, options.fetch ?? fetch, AbortSignal.timeout(RAYNET_DEFAULTS.timeoutMs));
  const fullName = inquiry.name.trim().replace(/\s+/g, " ");

  // Výpadek hledání klienta nesmí poptávku shodit – pak lead jako dřív.
  let clients: RaynetCompanyRow[] = [];
  try {
    clients = await api.findClients(inquiry.email, inquiry.phone);
  } catch (e) {
    console.error(`[raynet] hledání existujícího klienta: ${errorMessage(e)}`);
  }
  if (clients.length === 1) return syncToExistingClient(api, cfg, inquiry, clients[0].id, now);
  const possibleDuplicates = clients.length > 1 ? clients.map((c) => c.id) : undefined;
  const note = buildNote(
    inquiry,
    possibleDuplicates ? `Možný duplicitní klient: ${possibleDuplicates.map((id) => `ID ${id}`).join(", ")}` : undefined,
  );

  let leadId: number;
  try {
    const { firstName, lastName, titleBefore } = splitName(fullName);
    leadId = await api.insert("lead/", {
      // Předmět leadu = jméno a příjmení, stejně jako u ostatních webových leadů v instanci.
      topic: fullName,
      priority: "DEFAULT",
      companyName: fullName,
      firstName,
      lastName,
      titleBefore,
      owner: cfg.ownerId,
      category: cfg.leadCategoryId,
      contactSource: cfg.contactSourceId,
      contactInfo: { email: inquiry.email, tel1: inquiry.phone },
      notice: note,
      tags: SITE.domain,
    });
  } catch (e) {
    return { status: "failed", step: "lead", message: errorMessage(e) };
  }

  let slot: Interval;
  let calendarFull: boolean;
  try {
    ({ slot, calendarFull } = await findSlot(api, cfg.hours, now));
  } catch (e) {
    return { status: "failed", step: "calendar", message: errorMessage(e), leadId };
  }

  try {
    const tz = cfg.hours.timeZone;
    const activity = {
      priority: "DEFAULT",
      owner: cfg.ownerId,
      lead: leadId,
      scheduledFrom: formatIsoWithOffset(slot.from, tz),
      scheduledTill: formatIsoWithOffset(slot.till, tz),
      description: note,
    };
    const activityId =
      cfg.activityType === "task"
        ? await api.insert("task/", { ...activity, title: `Ozvat se: ${fullName}`, resolver: cfg.ownerId, deadline: activity.scheduledTill })
        : await api.insert("phoneCall/", { ...activity, title: `Zavolat: ${fullName}` });
    return { status: "created", leadId, activityId, slot, calendarFull, ...(possibleDuplicates ? { possibleDuplicates } : {}) };
  } catch (e) {
    return { status: "failed", step: "activity", message: errorMessage(e), leadId };
  }
}

/** Místní datum "yyyy-MM-dd" v zóně pracovní doby (validFrom OP). */
function localDate(t: number, timeZone: string): string {
  const p = localParts(t, timeZone);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}

/**
 * Poptávka od existujícího klienta (právě jedna shoda): místo leadu OP na klienta + úkol
 * navázaný na klienta i OP. Vlastník OP i úkolu je vždy RAYNET_OWNER_ID (na tomhle webu
 * Adam), na Company se nic neposílá – kategorie (tipař) ani vlastník klienta se nemění.
 */
async function syncToExistingClient(
  api: Client,
  cfg: RaynetConfig,
  inquiry: Inquiry,
  companyId: number,
  now: number,
): Promise<RaynetSyncResult> {
  const tz = cfg.hours.timeZone;
  const note = buildNote(inquiry);
  const name = businessCaseName(inquiry);

  let businessCaseId: number;
  try {
    const repeated = await api.recentBusinessCase(companyId, name, now);
    if (repeated) {
      await api.update(`businessCase/${repeated}/`, { description: note });
      return { status: "existingClient", companyId, businessCaseId: repeated, repeated: true };
    }
    const category = businessCaseCategory(inquiry.topic);
    businessCaseId = await api.insert("businessCase/", {
      name,
      company: companyId,
      owner: cfg.ownerId,
      businessCaseType: BUSINESS_CASE_TYPE_LOAN,
      ...(category ? { category } : {}),
      ...(cfg.contactSourceId ? { source: cfg.contactSourceId } : {}),
      validFrom: localDate(now, tz),
      description: note,
    });
  } catch (e) {
    return { status: "failed", step: "businessCase", message: errorMessage(e), companyId };
  }

  let slot: Interval;
  let calendarFull: boolean;
  try {
    ({ slot, calendarFull } = await findSlot(api, cfg.hours, now));
  } catch (e) {
    return { status: "failed", step: "calendar", message: errorMessage(e), companyId, businessCaseId };
  }

  try {
    // Deadline = konec téhož pracovního dne (nejdřív konec slotu).
    const p = localParts(slot.from, tz);
    const endOfDay = localToInstant(tz, p.year, p.month, p.day, Math.floor(cfg.hours.endMinute / 60), cfg.hours.endMinute % 60);
    const activityId = await api.insert("task/", {
      title: `Kontaktovat klienta - poptávka z webu (${SITE.domain})`,
      priority: "DEFAULT",
      owner: cfg.ownerId,
      resolver: cfg.ownerId,
      company: companyId,
      businessCase: businessCaseId,
      scheduledFrom: formatIsoWithOffset(slot.from, tz),
      scheduledTill: formatIsoWithOffset(slot.till, tz),
      deadline: formatIsoWithOffset(Math.max(endOfDay, slot.till), tz),
      description: note,
    });
    return { status: "existingClient", companyId, businessCaseId, repeated: false, activityId, slot, calendarFull };
  } catch (e) {
    return { status: "failed", step: "activity", message: errorMessage(e), companyId, businessCaseId };
  }
}

/** "pondělí 14. 9. 2026 17:00–18:00" */
export function formatSlot(slot: Interval, timeZone = RAYNET_DEFAULTS.timeZone): string {
  const day = new Intl.DateTimeFormat("cs-CZ", { timeZone, weekday: "long", day: "numeric", month: "numeric", year: "numeric" });
  const time = new Intl.DateTimeFormat("cs-CZ", { timeZone, hour: "numeric", minute: "2-digit" });
  return `${day.format(slot.from)} ${time.format(slot.from)}–${time.format(slot.till)}`;
}

/** Jednořádkové shrnutí do e-mailu s poptávkou; null když je CRM vypnuté. */
export function describeRaynetResult(result: RaynetSyncResult, activityType: RaynetActivityType = "phoneCall"): string | null {
  const activity = activityType === "task" ? "úkol" : "telefonát";
  const calendarFullNote = ` Pozor: v kalendáři nebyl ${RAYNET_DEFAULTS.lookaheadDays} dní žádný volný slot, termín je první slot následujícího pracovního dne a koliduje s jinou aktivitou.`;
  switch (result.status) {
    case "skipped":
      return null;
    case "created":
      return (
        `Raynet: lead #${result.leadId} založen, ${activity} naplánován na ${formatSlot(result.slot)}.` +
        (result.calendarFull ? calendarFullNote : "") +
        (result.possibleDuplicates
          ? ` Pozor: možný duplicitní klient (${result.possibleDuplicates.map((id) => `ID ${id}`).join(", ")}), zkontrolujte a případně lead převeďte ručně.`
          : "")
      );
    case "existingClient":
      if (result.repeated) {
        return `Raynet: existující klient #${result.companyId}, opakovaná poptávka – doplněn popis otevřeného OP #${result.businessCaseId}, nový úkol se nezakládal.`;
      }
      return (
        `Raynet: existující klient #${result.companyId} – lead se nezakládal, založen OP #${result.businessCaseId}` +
        (result.slot ? ` a úkol naplánovaný na ${formatSlot(result.slot)}.` : ".") +
        (result.calendarFull ? calendarFullNote : "")
      );
    case "failed":
      if (result.step === "config") return `Raynet: přeskočeno, neplatná konfigurace (${result.message}).`;
      if (result.companyId !== undefined) {
        return result.businessCaseId === undefined
          ? `Raynet: existující klient #${result.companyId}, ale OP se nepodařilo založit (${result.message}). Založte ho prosím ručně.`
          : `Raynet: existující klient #${result.companyId}, OP #${result.businessCaseId} založen, ale úkol se nepodařilo naplánovat (${result.message}). Naplánujte ho prosím ručně.`;
      }
      if (result.leadId === undefined) return `Raynet: lead se nepodařilo založit (${result.message}). Založte ho prosím ručně.`;
      return `Raynet: lead #${result.leadId} založen, ale ${activity} se nepodařilo naplánovat (${result.message}). Naplánujte ho prosím ručně.`;
  }
}
