"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Arrow } from "@/components/ui/Button";

export type Slide = { id: string; label: string; content: ReactNode };

/** Rychlost přechodu mezi sekcemi (ms) — shodná s CSS přechodem snímků. */
const DURATION = 850;
/** Podíl šířky, po kterém tah prstem přepne na další sekci. */
const SWIPE_THRESHOLD = 0.18;

/**
 * Sekce 1)–8) úvodní stránky jako vodorovný carousel. Aktivní snímek je v toku
 * dokumentu (výška se řídí jeho obsahem), ostatní leží absolutně vedle něj
 * a při přechodu odjíždějí doleva a doprava. Ovládání: záložky 1)–8), šipky,
 * klávesnice, tah prstem a odkaz s #kotvou (např. /#kontakt).
 * Bez JS se sekce vykreslí pod sebou (CSS v globals.css, [data-js]).
 */
export function SectionCarousel({ slides }: { slides: Slide[] }) {
  const [active, setActive] = useState(0);
  const [drag, setDrag] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number; axis: "x" | "y" | null } | null>(null);
  const baseId = useId();
  const count = slides.length;

  const go = useCallback(
    (next: number, opts: { scroll?: boolean; hash?: boolean } = {}) => {
      const i = Math.max(0, Math.min(count - 1, next));
      setActive(i);
      if (opts.hash !== false) history.replaceState(null, "", `#${slides[i].id}`);
      // Když je čtenář níž než začátek carouselu, vrátí ho na začátek nové sekce.
      const root = rootRef.current;
      if (opts.scroll !== false && root && root.getBoundingClientRect().top < 0) {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        root.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }
    },
    [count, slides],
  );

  // Kotva v adrese: #<id snímku> nebo id prvku uvnitř snímku (#kontakt).
  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (!id) return;
      const bySlide = slides.findIndex((s) => s.id === id);
      const el = bySlide < 0 ? document.getElementById(id) : null;
      const idx = bySlide >= 0 ? bySlide : Number(el?.closest<HTMLElement>("[data-slide]")?.dataset.slide ?? -1);
      if (idx < 0) return;
      setActive(idx);
      requestAnimationFrame(() => rootRef.current?.scrollIntoView({ block: "start" }));
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [slides]);

  // Aktivní záložka vždy viditelná v posuvném pásu (mobil).
  useEffect(() => {
    const tab = tabsRef.current?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    const strip = tabsRef.current;
    if (!tab || !strip) return;
    strip.scrollTo({ left: tab.offsetLeft - strip.clientWidth / 2 + tab.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  const onTabKey = (e: React.KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: count - 1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = Math.max(0, Math.min(count - 1, keys[e.key]));
    go(next, { scroll: false });
    tabsRef.current?.querySelector<HTMLElement>(`[data-tab="${next}"]`)?.focus();
  };

  // Tah prstem: jen vodorovný pohyb, svislé posouvání stránky zůstává volné.
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY, axis: null };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const s = touch.current;
    if (!s) return;
    const t = e.touches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (!s.axis && Math.hypot(dx, dy) > 10) s.axis = Math.abs(dx) > Math.abs(dy) * 1.2 ? "x" : "y";
    if (s.axis !== "x") return;
    // Na okrajích odpor, ať je vidět, že dál už nic není.
    const edge = (active === 0 && dx > 0) || (active === count - 1 && dx < 0);
    setDrag(edge ? dx * 0.25 : dx);
  };
  const onTouchEnd = () => {
    const s = touch.current;
    touch.current = null;
    if (s?.axis !== "x") return setDrag(0);
    const width = rootRef.current?.clientWidth ?? 1;
    const ratio = drag / width;
    setDrag(0);
    if (ratio < -SWIPE_THRESHOLD) go(active + 1);
    else if (ratio > SWIPE_THRESHOLD) go(active - 1);
  };

  const prev = active > 0 ? slides[active - 1] : null;
  const next = active < count - 1 ? slides[active + 1] : null;

  return (
    <div ref={rootRef} className="carousel scroll-mt-16 lg:scroll-mt-[4.75rem]" aria-roledescription="carousel" aria-label="Obsah úvodní stránky">
      {/* Navigace 1)–8): lepí se pod hlavičku. */}
      <div data-theme="paper" className="carousel-nav themed sticky top-16 z-40 border-y border-(--line) lg:top-[4.75rem]">
        <div className="container-x flex items-center gap-3">
          <NavArrow dir="prev" disabled={!prev} onClick={() => go(active - 1)} label={prev ? `Předchozí: ${prev.label}` : "Předchozí"} />
          <div
            ref={tabsRef}
            role="tablist"
            aria-label="Sekce"
            onKeyDown={onTabKey}
            className="no-scrollbar relative flex min-w-0 flex-1 gap-1 overflow-x-auto lg:justify-between"
          >
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                data-tab={i}
                id={`${baseId}-tab-${i}`}
                aria-selected={i === active}
                aria-controls={`${baseId}-panel-${i}`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => go(i)}
                className={`group flex shrink-0 items-baseline gap-2 whitespace-nowrap px-2.5 py-4 transition-colors duration-300 ${
                  i === active ? "text-(--fg)" : "text-(--muted) hover:text-(--fg)"
                }`}
              >
                <span className="label-sm tabular text-(--accent)">{i + 1})</span>
                <span className="text-[0.82rem] tracking-[0.04em]">{s.label}</span>
              </button>
            ))}
          </div>
          <NavArrow dir="next" disabled={!next} onClick={() => go(active + 1)} label={next ? `Další: ${next.label}` : "Další"} />
        </div>
        {/* Postup jako rytá linka. */}
        <div aria-hidden="true" className="absolute inset-x-0 -bottom-px h-px">
          <div
            className="h-full origin-left bg-(--accent) transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ transform: `scaleX(${(active + 1) / count})` }}
          />
        </div>
      </div>

      <div
        className="carousel-viewport relative overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        {slides.map((s, i) => {
          const offset = i - active;
          const isActive = offset === 0;
          return (
            <div
              key={s.id}
              data-slide={i}
              id={`${baseId}-panel-${i}`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${i}`}
              aria-roledescription="snímek"
              aria-hidden={!isActive}
              inert={!isActive}
              className={`carousel-slide w-full ${isActive ? "relative" : "absolute inset-x-0 top-0"}`}
              style={{
                transform: `translate3d(calc(${offset * 100}% + ${drag}px), 0, 0)`,
                transition: drag ? "none" : `transform ${DURATION}ms cubic-bezier(0.65, 0, 0.2, 1)`,
              }}
            >
              {s.content}
            </div>
          );
        })}
      </div>

      {/* Pokračování na konci sekce — čtenář nemusí zpět nahoru k záložkám. */}
      <div data-theme="paper" className="carousel-pager themed border-t border-(--line)">
        <div className="container-x flex items-stretch justify-between gap-4">
          {prev ? (
            <button type="button" onClick={() => go(active - 1)} className="group flex items-center gap-3 py-6 text-left">
              <span className="rotate-180 text-(--accent)">
                <Arrow />
              </span>
              <span>
                <span className="label-xs block">Zpět</span>
                <span className="display text-xl">
                  {active}) {prev.label}
                </span>
              </span>
            </button>
          ) : (
            <span />
          )}
          {next && (
            <button type="button" onClick={() => go(active + 1)} className="group flex items-center gap-3 py-6 text-right">
              <span>
                <span className="label-xs block">Pokračovat</span>
                <span className="display text-xl">
                  {active + 2}) {next.label}
                </span>
              </span>
              <span className="text-(--accent) transition-transform duration-300 group-hover:translate-x-1">
                <Arrow />
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function NavArrow({ dir, disabled, onClick, label }: { dir: "prev" | "next"; disabled: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-11 shrink-0 place-items-center rounded-full border border-(--line-strong) text-(--accent) transition-opacity duration-300 hover:border-(--accent) disabled:opacity-25"
    >
      <span className={dir === "prev" ? "rotate-180" : ""}>
        <Arrow />
      </span>
    </button>
  );
}
