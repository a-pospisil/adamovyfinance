"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Arrow } from "@/components/ui/Button";
import { BanknoteRosette, GrandRosette, Townhouse } from "@/components/engraving/Engraving";

/** `dark`: sekce na tmavém podkladu (ink, cocoa) — rozeta na švu je pak zlatá. */
export type Slide = { id: string; label: string; content: ReactNode; dark?: boolean };

/** Od této šířky mají všechny sekce stejnou výšku (= stejně dlouhý scroll). */
const UNIFORM_QUERY = "(min-width: 1024px)";
/** Kolik výšky „pódia“ se odscrolluje během jednoho vodorovného přejezdu. */
const TRANSITION_RATIO = 0.9;

type Layout = {
  stageH: number;
  starts: number[]; // scroll pozice, kde začíná čtení sekce i
  reads: number[]; // kolik se sekce i posune svisle, než je dočtená
  transition: number;
  total: number;
};

/** Plynulý náběh a doběh přejezdu, aby sekce „dosedla“. */
const ease = (t: number) => t * t * (3 - 2 * t);

/**
 * Sekce 1)–8) úvodní stránky jako carousel ovládaný scrollem. Obal má výšku
 * celé „trasy“, uvnitř je přilepené pódium. Při scrollu se aktuální sekce
 * nejdřív dočte svisle a pak odjede doleva a zprava přijede další.
 * Záložky 1)–8) a šipky jen posunou stránku na začátek dané sekce.
 * Bez JS se sekce vykreslí pod sebou (CSS v globals.css, [data-js]).
 */
export function SectionCarousel({ slides }: { slides: Slide[] }) {
  const count = slides.length;
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const layout = useRef<Layout | null>(null);
  const activeRef = useRef(0);

  const headerH = () => document.querySelector("header")?.getBoundingClientRect().height ?? 0;

  /** Aktuální scroll uvnitř trasy carouselu (0 … total). */
  const trackScroll = useCallback(() => {
    const root = rootRef.current;
    const l = layout.current;
    if (!root || !l) return 0;
    return Math.max(0, Math.min(l.total, headerH() - root.getBoundingClientRect().top));
  }, []);

  const render = useCallback(() => {
    const l = layout.current;
    if (!l) return;
    const s = trackScroll();
    let i = 0;
    while (i < count - 1 && l.starts[i + 1] <= s) i++;
    const local = s - l.starts[i];
    const t = i < count - 1 && local > l.reads[i] ? ease(Math.min(1, (local - l.reads[i]) / l.transition)) : 0;
    const pos = i + t;

    panelRefs.current.forEach((panel, j) => {
      if (!panel) return;
      const y = j < i ? l.reads[j] : j === i ? Math.min(local, l.reads[i]) : 0;
      const dx = j - pos;
      panel.style.transform = `translate3d(${dx * 100}%, ${-y}px, 0)`;
      panel.style.visibility = Math.abs(dx) >= 1 ? "hidden" : "visible";
    });
    if (progressRef.current) progressRef.current.style.transform = `scaleX(${(pos + 1) / count})`;

    const now = Math.round(pos);
    if (now !== activeRef.current) {
      activeRef.current = now;
      setActive(now);
    }
  }, [count, trackScroll]);

  const measure = useCallback(() => {
    const root = rootRef.current;
    const nav = navRef.current;
    const stage = stageRef.current;
    const probe = probeRef.current;
    if (!root || !nav || !stage || !probe) return;
    // Výška pódia z 100svh, ať se na mobilu nehýbe s lištou prohlížeče.
    const stageH = Math.max(320, probe.getBoundingClientRect().height - headerH() - nav.offsetHeight);
    stage.style.height = `${stageH}px`;
    // Švy se kotví k výšce pódia, aby se půlky rozety a bordury na přechodu potkaly.
    root.style.setProperty("--stage-h", `${stageH}px`);
    // Sjednocená délka: na desktopu mají všechny sekce výšku nejdelší z nich (obsah na střed),
    // na mobilu by to u krátkých sekcí nechalo prázdné obrazovky, tam vyplní aspoň pódium.
    const panels = panelRefs.current.filter((p): p is HTMLDivElement => !!p);
    panels.forEach((p) => (p.style.minHeight = ""));
    const natural = panels.map((p) => p.offsetHeight);
    const uniform = window.matchMedia(UNIFORM_QUERY).matches ? Math.max(stageH, ...natural) : stageH;
    panels.forEach((p) => (p.style.minHeight = `${uniform}px`));
    const reads = panels.map((p) => Math.max(0, p.offsetHeight - stageH));
    const transition = Math.round(stageH * TRANSITION_RATIO);
    const starts = reads.map((_, i) => reads.slice(0, i).reduce((a, r) => a + r + transition, 0));
    const total = starts[count - 1] + reads[count - 1];
    layout.current = { stageH, starts, reads, transition, total };
    root.style.height = `${nav.offsetHeight + stageH + total}px`;
    render();
  }, [count, render]);

  /** Posune stránku tak, aby byla sekce i (případně místo v ní) na pódiu. */
  const scrollToSlide = useCallback(
    (i: number, offsetInPanel = 0, smooth = true) => {
      const root = rootRef.current;
      const l = layout.current;
      if (!root || !l) return;
      const idx = Math.max(0, Math.min(count - 1, i));
      const within = Math.min(l.reads[idx], Math.max(0, offsetInPanel));
      const top = window.scrollY + root.getBoundingClientRect().top - headerH() + l.starts[idx] + within;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top, behavior: smooth && !reduce ? "smooth" : "auto" });
    },
    [count],
  );

  useEffect(() => {
    // Překreslit hned v události scrollu, ne až v dalším snímku: se zpožděním o snímek
    // obsah při každém kroku kolečka chvíli stál a pak dorovnal (viditelné poskakování).
    const onScroll = () => render();
    let lastW = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === lastW && layout.current) return render();
      lastW = window.innerWidth;
      measure();
    };
    const ro = new ResizeObserver(() => measure());
    panelRefs.current.forEach((p) => p && ro.observe(p));
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [measure, render]);

  // Kotva v adrese: #<id snímku> nebo id prvku uvnitř sekce (#kontakt).
  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (!id) return;
      const bySlide = slides.findIndex((s) => s.id === id);
      const el = bySlide < 0 ? document.getElementById(id) : null;
      const panel = el?.closest<HTMLElement>("[data-slide]");
      const idx = bySlide >= 0 ? bySlide : Number(panel?.dataset.slide ?? -1);
      if (idx < 0) return;
      const offset = el && panel ? el.getBoundingClientRect().top - panel.getBoundingClientRect().top : 0;
      requestAnimationFrame(() => scrollToSlide(idx, offset, false));
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [slides, scrollToSlide]);

  // Fokus z klávesnice v jiné sekci (Tab) — dorolovat na ni, jinak by byl fokus mimo pódium.
  const onFocus = (e: React.FocusEvent) => {
    const panel = (e.target as HTMLElement).closest<HTMLElement>("[data-slide]");
    const l = layout.current;
    if (!panel || !l) return;
    const idx = Number(panel.dataset.slide);
    const offset = (e.target as HTMLElement).getBoundingClientRect().top - panel.getBoundingClientRect().top;
    const y = trackScroll() - l.starts[idx];
    const visible = idx === activeRef.current && offset - y >= 0 && offset - y < l.stageH - 40;
    if (!visible) scrollToSlide(idx, offset - l.stageH / 3, false);
  };

  // Aktivní záložka vždy viditelná v posuvném pásu (mobil).
  useEffect(() => {
    const strip = tabsRef.current;
    const tab = strip?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    if (!tab || !strip) return;
    strip.scrollTo({ left: tab.offsetLeft - strip.clientWidth / 2 + tab.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  const prev = active > 0 ? slides[active - 1] : null;
  const next = active < count - 1 ? slides[active + 1] : null;

  return (
    <div ref={rootRef} className="carousel relative" aria-label="Obsah úvodní stránky">
      <div ref={probeRef} aria-hidden="true" className="pointer-events-none invisible absolute h-svh w-px" />
      <div className="carousel-sticky sticky top-16 lg:top-[4.75rem]">
        {/* Navigace 1)–8). */}
        <nav ref={navRef} data-theme="paper" aria-label="Sekce" className="carousel-nav themed relative z-10 border-y border-(--line)">
          <div className="container-x flex items-center gap-3">
            <NavArrow dir="prev" disabled={!prev} onClick={() => scrollToSlide(active - 1)} label={prev ? `Předchozí: ${prev.label}` : "Předchozí"} />
            <div ref={tabsRef} className="no-scrollbar relative flex min-w-0 flex-1 gap-1 overflow-x-auto lg:justify-between">
              {slides.map((s, i) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  data-tab={i}
                  aria-current={i === active ? "true" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    history.replaceState(null, "", `#${s.id}`);
                    scrollToSlide(i);
                  }}
                  className={`flex shrink-0 items-baseline gap-2 whitespace-nowrap px-2.5 py-4 transition-colors duration-300 ${
                    i === active ? "text-(--fg)" : "text-(--muted) hover:text-(--fg)"
                  }`}
                >
                  <span className="label-sm tabular text-(--accent)">{i + 1})</span>
                  <span className="text-[0.82rem] tracking-[0.04em]">{s.label}</span>
                </a>
              ))}
            </div>
            <NavArrow dir="next" disabled={!next} onClick={() => scrollToSlide(active + 1)} label={next ? `Další: ${next.label}` : "Další"} />
          </div>
          {/* Postup jako rytá linka. */}
          <div aria-hidden="true" className="absolute inset-x-0 -bottom-px h-px">
            <div ref={progressRef} className="h-full origin-left bg-(--accent)" style={{ transform: `scaleX(${1 / count})` }} />
          </div>
        </nav>

        <div ref={stageRef} className="carousel-stage relative overflow-clip" onFocus={onFocus}>
          {slides.map((s, i) => (
            <div
              key={s.id}
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              data-slide={i}
              id={`sekce-${s.id}`}
              role="group"
              aria-roledescription="snímek"
              aria-label={`${i + 1}) ${s.label}`}
              className="carousel-slide absolute inset-x-0 top-0 will-change-transform"
              style={{ transform: `translate3d(${i * 100}%, 0, 0)` }}
            >
              {s.content}
              <Seams dark={s.dark} left={SEAMS[i - 1]} right={SEAMS[i]} />
            </div>
          ))}
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
type SeamMotif = { kind: "rosette"; size: number } | { kind: "townhouse"; width: number };

/**
 * Švy 1|2 … 7|8. Různé velikosti rozet, aby přechody nepůsobily šablonovitě;
 * mezi Vlastní investicí a Jak přemýšlím stojí místo rozety činžovní dům.
 */
const SEAMS: SeamMotif[] = [
  { kind: "rosette", size: 220 },
  { kind: "townhouse", width: 560 },
  { kind: "rosette", size: 320 },
  { kind: "rosette", size: 150 },
  { kind: "rosette", size: 260 },
  { kind: "rosette", size: 380 },
  { kind: "rosette", size: 190 },
];

const TOWNHOUSE_RATIO = 464 / 520;

/**
 * Švy mezi sekcemi: svislá bordura na obou okrajích a polovina motivu přesně na švu.
 * Odcházející sekce je při přejezdu dočtená dolů, přicházející začíná nahoře, proto se
 * levá polovina kotví k hornímu okraji pódia a pravá k jeho poslední výšce (--stage-h).
 * Rozeta sedí uprostřed pódia, dům stojí na jeho spodní hraně.
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
          top: side === "l" ? `calc(var(--stage-h, 100%) - ${h}px)` : `calc(100% - ${h}px)`,
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
        top: side === "l" ? "calc(var(--stage-h, 200%) / 2)" : "calc(100% - var(--stage-h, 200%) / 2)",
      }}
      {...extra}
    />
  );
}
