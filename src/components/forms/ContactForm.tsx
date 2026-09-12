"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { SITE } from "@/lib/site";

const TOPICS = [
  "Investiční hypotéka",
  "Hypotéka na vlastní bydlení",
  "Refinancování / konec fixace",
  "Financování portfolia",
  "Financování přes s.r.o.",
  "Hypotéka pro podnikatele / OSVČ",
  "Bytový dům / developerský projekt",
  "Workshop",
  "Jiné",
];

type Status = "idle" | "sending" | "sent" | "unavailable" | "error";

/** Lead form. Posts to /api/kontakt; when e-mail delivery is not configured it points to direct channels. */
export function ContactForm({ defaultTopic }: { defaultTopic?: string }) {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else if (res.status === 503) {
        setStatus("unavailable");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-(--line) p-8" role="status">
        <p className="display display-sm">Díky, ozvu se.</p>
        <p className="mt-4 max-w-md text-(--muted)">
          Zprávu mám. Odpovídám {SITE.responseTime}. Pokud to spěchá, zavolejte na{" "}
          <a href={SITE.phoneHref} className="text-(--fg) underline underline-offset-4">{SITE.phone}</a>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2" noValidate={false}>
      <div className="sm:col-span-1">
        <label htmlFor={`${id}-name`} className="eyebrow">Jméno a příjmení</label>
        <input id={`${id}-name`} name="name" required minLength={2} maxLength={100} autoComplete="name" className="field" />
      </div>
      <div className="sm:col-span-1">
        <label htmlFor={`${id}-phone`} className="eyebrow">Telefon</label>
        <input id={`${id}-phone`} name="phone" type="tel" required autoComplete="tel" inputMode="tel" className="field" />
      </div>
      <div className="sm:col-span-1">
        <label htmlFor={`${id}-email`} className="eyebrow">E-mail</label>
        <input id={`${id}-email`} name="email" type="email" required autoComplete="email" className="field" />
      </div>
      <div className="sm:col-span-1">
        <label htmlFor={`${id}-topic`} className="eyebrow">Co řešíte</label>
        <select id={`${id}-topic`} name="topic" defaultValue={defaultTopic ?? TOPICS[0]} className="field">
          {TOPICS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${id}-message`} className="eyebrow">Situace v pár větách</label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={5}
          maxLength={3000}
          placeholder="Kolik nemovitostí vlastníte, jaké úvěry máte, co chcete koupit nebo změnit. Konkrétní čísla pomohou, ale nejsou podmínkou."
          className="field resize-y"
        />
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${id}-web`}>Web</label>
        <input id={`${id}-web`} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="flex items-start gap-3 text-[0.85rem] text-(--muted) sm:col-span-2">
        <input type="checkbox" name="consent" required className="mt-1 size-4 accent-(--accent)" />
        <span>
          Souhlasím se zpracováním osobních údajů za účelem vyřízení poptávky.{" "}
          <Link href="/ochrana-osobnich-udaju" className="underline underline-offset-4 hover:text-(--fg)">
            Jak s údaji nakládám
          </Link>
          .
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex h-14 items-center gap-3 rounded-[2px] bg-(--btn-bg) px-8 font-medium text-(--btn-fg) transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {status === "sending" ? "Odesílám…" : "Odeslat"}
          <span aria-hidden="true">→</span>
        </button>
        <p className="text-[0.85rem] text-(--muted)">Odpovídám {SITE.responseTime}.</p>
      </div>

      {(status === "unavailable" || status === "error") && (
        <p role="alert" className="border-l-2 border-(--accent) pl-4 text-[0.9rem] text-(--muted) sm:col-span-2">
          {status === "unavailable"
            ? "Formulář teď zprávy neodesílá. Napište mi prosím rovnou: "
            : "Zprávu se nepodařilo odeslat. Zkuste to znovu, nebo mi napište rovnou: "}
          <a href={`mailto:${SITE.email}`} className="text-(--fg) underline underline-offset-4">{SITE.email}</a>
          {" nebo "}
          <a href={SITE.whatsapp} className="text-(--fg) underline underline-offset-4" target="_blank" rel="noopener noreferrer">WhatsApp</a>.
        </p>
      )}
    </form>
  );
}
