"use client";

import Link from "next/link";
import { Arrow } from "@/components/ui/Button";
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

/** Poptávka. Posílá se na /api/kontakt; bez nastaveného e-mailu nabídne přímé kanály. */
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
      <div className="border-t border-(--line-strong) pt-8" role="status">
        <p className="display display-md">Děkuji, ozvu se.</p>
        <p className="mt-4 max-w-md text-(--muted)">
          Zprávu mám. Odpovídám {SITE.responseTime}. Pokud to spěchá, zavolejte na{" "}
          <a href={SITE.phoneHref} className="text-(--fg) underline underline-offset-4">
            {SITE.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-7 sm:grid-cols-2">
      <div>
        <label htmlFor={`${id}-name`} className="label-xs">
          Jméno a příjmení
        </label>
        <input id={`${id}-name`} name="name" required minLength={2} maxLength={100} autoComplete="name" className="field" />
      </div>
      <div>
        <label htmlFor={`${id}-phone`} className="label-xs">
          Telefon
        </label>
        <input id={`${id}-phone`} name="phone" type="tel" required autoComplete="tel" inputMode="tel" className="field" />
      </div>
      <div>
        <label htmlFor={`${id}-email`} className="label-xs">
          E-mail
        </label>
        <input id={`${id}-email`} name="email" type="email" required autoComplete="email" className="field" />
      </div>
      <div>
        <label htmlFor={`${id}-topic`} className="label-xs">
          Co řešíte
        </label>
        <select id={`${id}-topic`} name="topic" defaultValue={defaultTopic ?? TOPICS[0]} className="field">
          {TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${id}-message`} className="label-xs">
          Situace v pár větách
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={4}
          maxLength={3000}
          placeholder="Kolik nemovitostí vlastníte, jaké úvěry máte, co chcete koupit nebo změnit."
          className="field resize-y"
        />
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${id}-web`}>Web</label>
        <input id={`${id}-web`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="flex items-start gap-3 text-[0.85rem] text-(--muted) sm:col-span-2">
        <input type="checkbox" name="consent" required className="mt-0.5 size-5 shrink-0 accent-(--accent)" />
        <span>
          Souhlasím se zpracováním osobních údajů za účelem vyřízení poptávky.{" "}
          <Link href="/ochrana-osobnich-udaju" className="underline underline-offset-4 hover:text-(--fg)">
            Jak s údaji nakládám
          </Link>
          .
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-6 sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="label-sm group inline-flex h-12 items-center gap-3 bg-(--btn-bg) px-7 text-(--btn-fg) transition-colors hover:bg-(--accent) disabled:opacity-60"
        >
          {status === "sending" ? "Odesílám" : "Odeslat"}
          <Arrow />
        </button>
        <p className="text-[0.85rem] text-(--muted)">Odpovídám {SITE.responseTime}.</p>
      </div>

      {(status === "unavailable" || status === "error") && (
        <p role="alert" className="border-l border-(--accent) pl-4 text-[0.9rem] text-(--muted) sm:col-span-2">
          {status === "unavailable"
            ? "Formulář teď zprávy neodesílá. Napište mi prosím rovnou: "
            : "Zprávu se nepodařilo odeslat. Zkuste to znovu, nebo mi napište rovnou: "}
          <a href={`mailto:${SITE.email}`} className="text-(--fg) underline underline-offset-4">
            {SITE.email}
          </a>
          {" nebo "}
          <a href={SITE.whatsapp} className="text-(--fg) underline underline-offset-4" target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          .
        </p>
      )}
    </form>
  );
}
