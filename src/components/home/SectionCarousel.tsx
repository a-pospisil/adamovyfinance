"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Arrow } from "@/components/ui/Button";
import { BanknoteRosette, GrandRosette, Townhouse } from "@/components/engraving/Engraving";

/** `dark`: sekce na tmavém podkladu (ink, cocoa) — rozeta na švu je pak zlatá. */
export type Slide = { id: string; label: string; content: ReactNode; dark?: boolean };

/** Od této šířky mají všechny sekce stejnou výšku (švy se pak potkají i dole). */
const UNIFORM_QUERY = "(min-width: 1024px)";

/**
 * Sekce 1)–8) úvodní stránky jako vodorovný carousel. Stránka se scrolluje normálně
 * dolů; mezi sekcemi se přechází šipkami, záložkami, tažením prstem nebo vodorovným
 * gestem na trackpadu. Posun dělá nativní vodorovný scroll s přichycením (scroll-snap),
 * takže je plynulý v každém prohlížeči a funguje i bez JavaScriptu.
 */
export function SectionCarousel({ slides }: { slides: Slide[] }) {
  const count = slides.length;
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef = useRef(0);

  /** Posune carousel na sekci i; při kliknutí vrátí stránku na začátek carouselu. */
  const go = useCallback(
    (i: number, opts: { smooth?: boolean; toTop?: boolean } = {}) => {
      const track = trackRef.current;
      const root = rootRef.current;
      if (!track || !root) return;
      const idx = Math.max(0, Math.min(count - 1, i));
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const behavior: ScrollBehavior = opts.smooth === false || reduce ? "auto" : "smooth";
      track.scrollTo({ left: idx * track.clientWidth, behavior });
      if (opts.toTop !== false && root.getBoundingClientRect().top < 0) root.scrollIntoView({ behavior, block: "start" });
    },
    [count],
  );

  // Aktivní sekce podle vodorovné polohy; výška carouselu podle aktivní sekce (mobil).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const panels = panelRefs.current.filter((p): p is HTMLDivElement => !!p);
    const fit = () => {
      panels.forEach((p) => (p.style.minHeight = ""));
      if (window.matchMedia(UNIFORM_QUERY).matches) {
        const max = Math.max(...panels.map((p) => p.offsetHeight));
        panels.forEach((p) => (p.style.minHeight = `${max}px`));
        track.style.height = "";
      } else {
        track.style.height = `${panels[activeRef.current]?.offsetHeight ?? 0}px`;
      }
    };
    const onScroll = () => {
      const now = Math.round(track.scrollLeft / track.clientWidth);
      if (now !== activeRef.current) {
        activeRef.current = now;
        setActive(now);
        if (!window.matchMedia(UNIFORM_QUERY).matches) fit();
      }
    };
    const ro = new ResizeObserver(fit);
    panels.forEach((p) => ro.observe(p));
    fit();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", fit);
    };
  }, []);

  // Kotva v adrese: #<id sekce> nebo id prvku uvnitř sekce (#kontakt).
  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (!id) return;
      const bySlide = slides.findIndex((s) => s.id === id);
      const el = bySlide < 0 ? document.getElementById(id) : null;
      const idx = bySlide >= 0 ? bySlide : Number(el?.closest<HTMLElement>("[data-slide]")?.dataset.slide ?? -1);
      if (idx < 0) return;
      requestAnimationFrame(() => {
        go(idx, { smooth: false, toTop: false });
        rootRef.current?.scrollIntoView({ block: "start" });
      });
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [slides, go]);

  // Aktivní záložka vždy viditelná v posuvném pásu (mobil).
  useEffect(() => {
    const strip = tabsRef.current;
    const tab = strip?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    if (!tab || !strip) return;
    strip.scrollTo({ left: tab.offsetLeft - strip.clientWidth / 2 + tab.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  const onTabKey = (e: React.KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: count - 1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = Math.max(0, Math.min(count - 1, keys[e.key]));
    go(next, { toTop: false });
    tabsRef.current?.querySelector<HTMLElement>(`[data-tab="${next}"]`)?.focus();
  };

  const prev = active > 0 ? slides[active - 1] : null;
  const next = active < count - 1 ? slides[active + 1] : null;

  return (
    <div ref={rootRef} className="carousel relative scroll-mt-16 lg:scroll-mt-[4.75rem]" aria-roledescription="carousel" aria-label="Obsah úvodní stránky">
      <nav data-theme="paper" aria-label="Sekce" className="carousel-nav themed sticky top-16 z-30 border-y border-(--line) lg:top-[4.75rem]">
        <div className="container-x flex items-center gap-3">
          <NavArrow dir="prev" disabled={!prev} onClick={() => go(active - 1)} label={prev ? `Předchozí: ${prev.label}` : "Předchozí"} />
          <div ref={tabsRef} role="tablist" aria-label="Sekce" onKeyDown={onTabKey} className="no-scrollbar relative flex min-w-0 flex-1 gap-1 overflow-x-auto lg:justify-between">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                data-tab={i}
                aria-selected={i === active}
                aria-controls={`sekce-${s.id}`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => go(i)}
                className={`flex shrink-0 items-baseline gap-2 whitespace-nowrap px-2.5 py-4 transition-colors duration-300 ${
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
        <div aria-hidden="true" className="absolute inset-x-0 -bottom-px h-px">
          <div
            className="h-full origin-left bg-(--accent) motion-safe:transition-transform motion-safe:duration-500"
            style={{ transform: `scaleX(${(active + 1) / count})` }}
          />
        </div>
      </nav>

      <div
        ref={trackRef}
        className="carousel-track no-scrollbar flex snap-x snap-mandatory items-start overflow-x-auto overflow-y-hidden overscroll-x-contain motion-safe:transition-[height] motion-safe:duration-300"
      >
        {slides.map((s, i) => (
          <div
            key={s.id}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            data-slide={i}
            id={`sekce-${s.id}`}
            role="tabpanel"
            aria-roledescription="snímek"
            aria-label={`${i + 1}) ${s.label}`}
            inert={i !== active}
            className="carousel-slide relative w-full shrink-0 snap-start snap-always"
          >
            {s.content}
            <Seams dark={s.dark} left={SEAMS[i - 1]} right={SEAMS[i]} />
          </div>
        ))}
      </div>

      {/* Pokračování na konci sekce — čtenář nemusí zpět nahoru k záložkám. */}
      <div data-theme="paper" className="themed border-t border-(--line)">
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
              <span className="text-(--accent)">
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

/** Motiv na švu mezi dvěma sekcemi; každá sekce nese jeho polovinu. */
type SeamMotif =
  | { kind: "rosette"; size: number }
  | { kind: "townhouse"; width: number }
  /** Výkres (půdorys nebo řez): `split` = podíl šířky v levé (odcházející) sekci. */
  | { kind: "plan"; drawing: "plans" | "section"; width: number; split: number };

/**
 * Švy 1|2 … 7|8. Různé velikosti rozet, aby přechody nepůsobily šablonovitě;
 * mezi Vlastní investicí a Jak přemýšlím stojí činžovní dům a recenze přecházejí do
 * workshopu výkresy bytového domu: řez ze Zkušenosti, půdorys patra do Workshopu.
 */
const SEAMS: SeamMotif[] = [
  { kind: "rosette", size: 220 },
  { kind: "townhouse", width: 560 },
  { kind: "rosette", size: 320 },
  { kind: "plan", drawing: "section", width: 1700, split: 0.42 },
  { kind: "plan", drawing: "plans", width: 1900, split: 0.6 },
  { kind: "rosette", size: 380 },
  { kind: "rosette", size: 190 },
];

const TOWNHOUSE_RATIO = 464 / 520;
const PLAN_RATIO = { plans: 1500 / 2600, section: 1500 / 2200 };

/**
 * Švy mezi sekcemi: svislá bordura na obou okrajích a polovina motivu přesně na švu.
 * Sousední sekce stojí v carouselu vedle sebe zarovnané nahoře a na desktopu mají
 * stejnou výšku, takže se poloviny při posunu potkají. Rozeta a výkresy sedí uprostřed
 * výšky, dům stojí na spodní hraně.
 */
function Seams({ dark, left, right }: { dark?: boolean; left?: SeamMotif; right?: SeamMotif }) {
  return (
    <div aria-hidden="true" className="seams pointer-events-none absolute inset-0 overflow-hidden">
      <span className="seam seam--l" />
      <span className="seam seam--r" />
      {left && <SeamHalf motif={left} side="l" dark={dark} />}
      {right && <SeamHalf motif={right} side="r" dark={dark} />}
    </div>
  );
}

function SeamHalf({ motif, side, dark }: { motif: SeamMotif; side: "l" | "r"; dark?: boolean }) {
  if (motif.kind === "townhouse") {
    const w = motif.width;
    const h = Math.round(w * TOWNHOUSE_RATIO);
    return (
      <Townhouse
        className={`seam-motif hidden lg:block ${dark ? "text-gold-300 opacity-40" : "text-brown opacity-45"}`}
        style={{
          width: w,
          height: h,
          [side === "l" ? "left" : "right"]: -w / 2,
          bottom: 0,
        }}
      />
    );
  }
  if (motif.kind === "plan") {
    const w = motif.width;
    const h = Math.round(w * PLAN_RATIO[motif.drawing]);
    const mask = `url("/engraving/${motif.drawing === "plans" ? "plans" : "section"}-mask.svg")`;
    // Levá sekce nese levou část výkresu (podíl `split`), pravá zbytek; na švu navazují.
    const offset = side === "r" ? -w * (1 - motif.split) : -w * motif.split;
    return (
      <div
        className={`seam-motif seam-plan hidden -translate-y-1/2 lg:block ${dark ? "bg-paper opacity-20" : "bg-brown opacity-25"}`}
        style={{
          width: w,
          height: h,
          [side === "l" ? "left" : "right"]: offset,
          top: "50%",
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
    );
  }
  const size = motif.size;
  const Rosette = dark ? GrandRosette : BanknoteRosette;
  const extra = dark ? { tone: "gold" as const, opacity: 0.55 } : { opacity: 0.9 };
  return (
    <Rosette
      className="seam-motif hidden -translate-y-1/2 lg:block"
      style={{
        width: size,
        height: size,
        [side === "l" ? "left" : "right"]: -size / 2,
        top: "50%",
      }}
      {...extra}
    />
  );
}
