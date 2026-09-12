"use client";

import { useId, useState } from "react";
import { WORKSHOP_TOPICS } from "@/lib/workshops";

/** Interactive map of workshop topics: hover or tap a term to read what it means in practice. */
export function WorkshopTopics({ className = "" }: { className?: string }) {
  const [active, setActive] = useState(0);
  const panelId = useId();
  const topic = WORKSHOP_TOPICS[active];

  return (
    <div className={`grid gap-8 lg:grid-cols-12 ${className}`}>
      <ul className="grid grid-cols-2 gap-px border border-(--line) bg-(--line) sm:grid-cols-5 lg:col-span-7" aria-label="Témata workshopu">
        {WORKSHOP_TOPICS.map((t, i) => {
          const isActive = i === active;
          return (
            <li key={t.term} className="bg-(--bg)">
              <button
                type="button"
                aria-pressed={isActive}
                aria-controls={panelId}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`flex min-h-20 w-full flex-col items-start justify-between gap-3 p-4 text-left transition-colors sm:min-h-24 ${
                  isActive ? "bg-(--fg) text-(--bg)" : "hover:bg-(--surface)"
                }`}
              >
                <span className={`font-mono text-[0.6rem] tracking-[0.14em] ${isActive ? "opacity-70" : "text-(--muted)"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="display text-[1.05rem] sm:text-[1.15rem]">{t.term}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div id={panelId} aria-live="polite" className="border-t border-(--line) pt-6 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
        <p className="mono-label text-(--accent)">{topic.term}</p>
        <p className="display display-sm mt-3">{topic.title}</p>
        <p className="mt-4 max-w-md text-(--muted)">{topic.text}</p>
      </div>
    </div>
  );
}
