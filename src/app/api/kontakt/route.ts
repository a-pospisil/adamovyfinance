import { describeRaynetResult, raynetConfigFromEnv, syncInquiryToRaynet, type Inquiry } from "@/lib/raynet";
import { SITE } from "@/lib/site";

/** Raynet (lead + hledání volného slotu) a Resend se musí vejít do limitu funkce. */
export const maxDuration = 30;

type Payload = Inquiry & { consent: string; website?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PATH_RE = /^\/[a-z0-9/_-]*$/i;

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** Cesta stránky s formulářem; cokoli jiného než interní cesta se zahodí. */
function pagePath(v: unknown): string | undefined {
  const path = clean(v, 100);
  return PATH_RE.test(path) ? path : undefined;
}

/**
 * Lead endpoint. Poptávku založí jako lead v Raynetu (s naplánovaným
 * telefonátem) a pošle e-mailem přes Resend; výsledek CRM je v e-mailu.
 * Bez konfigurace obou kanálů odpovídá 503, aby formulář nabídl přímé
 * kanály místo tichého selhání.
 */
export async function POST(request: Request) {
  const raw = (await request.json().catch(() => null)) as Partial<Payload> | null;
  if (!raw) return Response.json({ ok: false, reason: "bad-request" }, { status: 400 });

  // Honeypot filled in by bots.
  if (clean(raw.website, 10)) return Response.json({ ok: true });

  const inquiry: Inquiry = {
    name: clean(raw.name, 100).replace(/\s+/g, " "),
    phone: clean(raw.phone, 40),
    email: clean(raw.email, 120),
    topic: clean(raw.topic, 80),
    message: clean(raw.message, 3000),
    page: pagePath(raw.page),
  };

  if (inquiry.name.length < 2 || !EMAIL_RE.test(inquiry.email) || inquiry.phone.length < 6 || raw.consent !== "on") {
    return Response.json({ ok: false, reason: "invalid" }, { status: 422 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL;
  const emailConfigured = Boolean(resendKey && to);
  const raynet = raynetConfigFromEnv();
  if (!emailConfigured && raynet.kind === "off") {
    return Response.json({ ok: false, reason: "not-configured" }, { status: 503 });
  }

  const crm = await syncInquiryToRaynet(inquiry);
  if (crm.status === "failed") console.error(`[raynet] ${crm.step}: ${crm.message}`);
  const crmDelivered = crm.status === "created" || (crm.status === "failed" && crm.leadId !== undefined);

  let emailed = false;
  if (emailConfigured) {
    const activityType = raynet.kind === "ok" ? raynet.config.activityType : "phoneCall";
    emailed = await sendEmail(inquiry, describeRaynetResult(crm, activityType), resendKey!, to!);
    if (!emailed) console.error("[resend] delivery failed");
  }

  if (!emailed && !crmDelivered) return Response.json({ ok: false, reason: "delivery-failed" }, { status: 502 });
  return Response.json({ ok: true });
}

async function sendEmail(inquiry: Inquiry, crmSummary: string | null, apiKey: string, to: string): Promise<boolean> {
  const from = process.env.LEAD_FROM_EMAIL ?? `Web ${SITE.domain} <web@${SITE.domain}>`;
  const text = [
    `Jméno: ${inquiry.name}`,
    `Telefon: ${inquiry.phone}`,
    `E-mail: ${inquiry.email}`,
    `Téma: ${inquiry.topic}`,
    ...(inquiry.page ? [`Stránka: ${inquiry.page}`] : []),
    "",
    inquiry.message || "(bez zprávy)",
    ...(crmSummary ? ["", "—", crmSummary] : []),
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: inquiry.email,
        subject: `Poptávka z webu: ${inquiry.topic} – ${inquiry.name}`,
        text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
