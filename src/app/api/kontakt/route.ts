import { SITE } from "@/lib/site";

type Lead = {
  name: string;
  phone: string;
  email: string;
  topic: string;
  message: string;
  consent: string;
  website?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/**
 * Lead endpoint. Delivers the message by e-mail through Resend when
 * RESEND_API_KEY and LEAD_TO_EMAIL are set; otherwise answers 503 so the
 * form can point people to direct channels instead of failing silently.
 */
export async function POST(request: Request) {
  const raw = (await request.json().catch(() => null)) as Partial<Lead> | null;
  if (!raw) return Response.json({ ok: false, reason: "bad-request" }, { status: 400 });

  // Honeypot filled in by bots.
  if (clean(raw.website, 10)) return Response.json({ ok: true });

  const lead = {
    name: clean(raw.name, 100),
    phone: clean(raw.phone, 40),
    email: clean(raw.email, 120),
    topic: clean(raw.topic, 80),
    message: clean(raw.message, 3000),
  };

  if (lead.name.length < 2 || !EMAIL_RE.test(lead.email) || lead.phone.length < 6 || raw.consent !== "on") {
    return Response.json({ ok: false, reason: "invalid" }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL;
  if (!apiKey || !to) return Response.json({ ok: false, reason: "not-configured" }, { status: 503 });

  const from = process.env.LEAD_FROM_EMAIL ?? `Web ${SITE.domain} <web@${SITE.domain}>`;
  const text = [
    `Jméno: ${lead.name}`,
    `Telefon: ${lead.phone}`,
    `E-mail: ${lead.email}`,
    `Téma: ${lead.topic}`,
    "",
    lead.message || "(bez zprávy)",
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], reply_to: lead.email, subject: `Poptávka z webu: ${lead.topic} – ${lead.name}`, text }),
  });

  if (!res.ok) return Response.json({ ok: false, reason: "delivery-failed" }, { status: 502 });
  return Response.json({ ok: true });
}
