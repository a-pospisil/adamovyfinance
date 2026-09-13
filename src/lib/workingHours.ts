/**
 * Pracovní hodiny v pevné časové zóně bez knihoven. Instant (epoch ms) se na
 * místní čas převádí přes Intl, takže výsledek nezávisí na časové zóně serveru
 * (Vercel běží v UTC). Modul je čistý – žádné importy, žádný přístup k síti –
 * aby se dal testovat samostatně.
 */

/** Půlotevřený interval [from, till) v epoch ms. */
export type Interval = { from: number; till: number };

export type LocalDate = { year: number; month: number; day: number; weekday: number };

export type LocalDateTime = LocalDate & { hour: number; minute: number; second: number };

export type WorkingHoursConfig = {
  /** IANA zóna, např. "Europe/Prague". */
  timeZone: string;
  /** Začátek pracovní doby (celá hodina, 0–23). */
  startHour: number;
  /** Konec pracovní doby (celá hodina, 1–24), exkluzivně. */
  endHour: number;
  /** Pracovní dny jako ISO čísla: 1 = pondělí … 7 = neděle. */
  days: ReadonlySet<number>;
  /** Délka slotu v minutách; sloty na sebe navazují od začátku pracovní doby. */
  slotMinutes: number;
};

const WEEKDAYS: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };

const formatters = new Map<string, Intl.DateTimeFormat>();

function formatter(timeZone: string): Intl.DateTimeFormat {
  let f = formatters.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      weekday: "short",
    });
    formatters.set(timeZone, f);
  }
  return f;
}

/** Místní kalendářní složky instantu v dané zóně. */
export function localParts(t: number, timeZone: string): LocalDateTime {
  const parts: Record<string, string> = {};
  for (const p of formatter(timeZone).formatToParts(new Date(t))) parts[p.type] = p.value;
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour) % 24,
    minute: Number(parts.minute),
    second: Number(parts.second),
    weekday: WEEKDAYS[parts.weekday],
  };
}

/** Posun zóny vůči UTC v minutách v daném instantu (Praha v létě +120, v zimě +60). */
export function utcOffsetMinutes(t: number, timeZone: string): number {
  const p = localParts(t, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return Math.round((asUtc - Math.floor(t / 1000) * 1000) / 60_000);
}

/** Místní čas (nástěnné hodiny v zóně) → instant. Dvě iterace kvůli přechodu letního času. */
export function localToInstant(timeZone: string, year: number, month: number, day: number, hour = 0, minute = 0): number {
  const naive = Date.UTC(year, month - 1, day, hour, minute);
  const guess = naive - utcOffsetMinutes(naive, timeZone) * 60_000;
  return naive - utcOffsetMinutes(guess, timeZone) * 60_000;
}

/** Instant → ISO 8601 s milisekundami a posunem zóny, tak jak ho čte Raynet: 2026-09-14T09:00:00.000+02:00 */
export function formatIsoWithOffset(t: number, timeZone: string): string {
  const p = localParts(t, timeZone);
  const offset = utcOffsetMinutes(t, timeZone);
  const abs = Math.abs(offset);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}:${pad(p.second)}.000` +
    `${offset < 0 ? "-" : "+"}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`
  );
}

/** Kalendářní posun o n dní (počítá se nad UTC složkami, takže nezávisí na zóně). */
export function addDays(date: LocalDate, n: number): LocalDate {
  const d = new Date(Date.UTC(date.year, date.month - 1, date.day + n));
  const weekday = d.getUTCDay();
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(), weekday: weekday === 0 ? 7 : weekday };
}

/** Sloty pracovní doby daného dne, které začínají nejdřív v `notBefore`. Mimo pracovní dny prázdné. */
export function daySlots(cfg: WorkingHoursConfig, date: LocalDate, notBefore: number): Interval[] {
  if (!cfg.days.has(date.weekday)) return [];
  const dayStart = localToInstant(cfg.timeZone, date.year, date.month, date.day, cfg.startHour);
  const dayEnd = localToInstant(cfg.timeZone, date.year, date.month, date.day, cfg.endHour);
  const step = cfg.slotMinutes * 60_000;
  const slots: Interval[] = [];
  for (let from = dayStart; from + step <= dayEnd; from += step) {
    if (from >= notBefore) slots.push({ from, till: from + step });
  }
  return slots;
}

export function overlaps(a: Interval, b: Interval): boolean {
  return a.from < b.till && b.from < a.till;
}

/** První slot, který se nepřekrývá s žádnou obsazenou dobou. Navazující aktivity nevadí. */
export function firstFree(slots: readonly Interval[], busy: readonly Interval[]): Interval | undefined {
  return slots.find((slot) => !busy.some((b) => overlaps(slot, b)));
}

/** "9-18" → [9, 18]; neplatný zápis → undefined. */
export function parseHourRange(spec: string): [number, number] | undefined {
  const m = spec.trim().match(/^(\d{1,2})\s*-\s*(\d{1,2})$/);
  if (!m) return undefined;
  const start = Number(m[1]);
  const end = Number(m[2]);
  return start >= 0 && end <= 24 && start < end ? [start, end] : undefined;
}

/** "1-5", "1,2,3", "1-5,7" → množina ISO dnů v týdnu; neplatný zápis → undefined. */
export function parseWeekdays(spec: string): Set<number> | undefined {
  const days = new Set<number>();
  for (const part of spec.split(",")) {
    const m = part.trim().match(/^([1-7])(?:\s*-\s*([1-7]))?$/);
    if (!m) return undefined;
    const a = Number(m[1]);
    const b = m[2] ? Number(m[2]) : a;
    for (let d = Math.min(a, b); d <= Math.max(a, b); d++) days.add(d);
  }
  return days.size ? days : undefined;
}
