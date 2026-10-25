/**
 * Rytinové motivy inspirované guilloché strojem, kterým se kreslí ochranné
 * vzory na bankovkách. Křivky jsou předgenerované do statických SVG
 * (`npm run engraving`, zdroj scripts/build-engraving.mjs) a vkládají se jako
 * obrázek — inline by tisíce bodů zvětšily každou stránku o stovky kilobajtů.
 * Vše je dekorace, proto aria-hidden a prázdný alt.
 */

type Props = { className?: string; opacity?: number };

function Motif({ src, className, opacity, style }: Props & { src: string; style?: React.CSSProperties }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- statické SVG, optimalizace by ho jen zvětšila
    <img src={src} alt="" aria-hidden="true" loading="lazy" decoding="async" className={className} style={{ opacity, ...style }} />
  );
}

/** Guilloché rozeta — ochranný vzor bankovky. */
export function Guilloche({ className = "", opacity = 0.14 }: Props) {
  return <Motif src="/engraving/guilloche-gold.svg" className={className} opacity={opacity} />;
}

/** Malá rozeta mezi sekcemi. */
export function Rosette({ className = "", opacity = 0.35 }: Props) {
  return <Motif src="/engraving/rosette-gold.svg" className={className} opacity={opacity} />;
}

/** Linkované vlnové pozadí — „vodoznak“ pod obsahem sekce. */
export function WaveField({ className = "", opacity = 0.07, tone = "brown" }: Props & { tone?: "brown" | "paper" }) {
  return (
    <Motif
      src={`/engraving/waves-${tone}.svg`}
      className={className}
      opacity={opacity}
      style={{ objectFit: "fill" }}
    />
  );
}

/** Ornamentální roh tištěného rámečku. */
export function CornerOrnament({
  className = "",
  opacity = 0.5,
  flipX = false,
  flipY = false,
}: Props & { flipX?: boolean; flipY?: boolean }) {
  return (
    <Motif
      src="/engraving/corner-gold.svg"
      className={className}
      opacity={opacity}
      style={{ transform: `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})` }}
    />
  );
}

/** Obrovské nominální číslo na pozadí — grafický motiv, ne skutečná bankovka. */
export function Numeral({
  value,
  className = "",
  tone = "brown",
  opacity = 0.06,
}: {
  value: string;
  className?: string;
  tone?: "brown" | "gold" | "ink";
  opacity?: number;
}) {
  const color = { brown: "var(--color-brown)", gold: "var(--color-gold)", ink: "var(--color-ink)" }[tone];
  // Ornament, ne obsah: číslice se vykresluje přes ::before, takže nevzniká textový uzel.
  return (
    <span
      aria-hidden="true"
      data-numeral={value}
      className={`nominal pointer-events-none select-none before:content-[attr(data-numeral)] ${className}`}
      style={{ color, opacity }}
    />
  );
}

/** Opakovaná mikrotypografie — pásek u okraje sekce. */
export function MicroStrip({ text, repeat = 8, className = "" }: { text: string; repeat?: number; className?: string }) {
  return (
    <p aria-hidden="true" className={`microtype w-0 min-w-full truncate ${className}`}>
      {Array.from({ length: repeat }, () => text).join("  ·  ")}
    </p>
  );
}

/** Velká vrstvená rozeta — hvězda, okvětí, copánky a perlovec jako na českých bankovkách. */
export function GrandRosette({ className = "", opacity = 0.2, tone = "brown", style }: Props & { tone?: "brown" | "gold"; style?: React.CSSProperties }) {
  return <Motif src={`/engraving/rosette-grand-${tone}.svg`} className={className} opacity={opacity} style={style} />;
}

/**
 * Bankovkový podtisk celé sekce: ochranná síť v duhovém tisku a lemová bordura nahoře.
 * Barvy bere z tématu sekce (viz .bn-ground v globals.css).
 */
export function BanknoteGround({ border = true }: { border?: boolean }) {
  return <span aria-hidden="true" className={`bn-ground ${border ? "" : "bn-ground--plain"}`} />;
}

/** Bankovková rozeta v duhovém tisku (fialová, hnědá, vínová, zelená) — jemné linky jako v hlubotisku. */
export function BanknoteRosette({ className = "", opacity = 1, style }: Props & { style?: React.CSSProperties }) {
  return <Motif src="/engraving/rosette-banknote.svg" className={className} opacity={opacity} style={style} />;
}

/* ---------- Rytina činžovního domu ----------
   Symetrická fasáda (520 × 460): mansardová střecha s vikýři a šrafurou, korunní
   římsa se zubořezem, pilastry, tři patra oken (frontony, oblouky, rovné nadpraží),
   balkon s kuželkami, kordonová římsa a bosované přízemí s cihlovou vazbou a portálem.
   Osa souměrnosti je x = 260, takže dům jde rozdělit na švu dvou sekcí. */
const TH_COLS = [96, 150, 204, 260, 316, 370, 424];
const TH_FLOORS = [
  { y: 152, h: 50, head: "pediment" },
  { y: 228, h: 46, head: "arch" },
  { y: 298, h: 40, head: "flat" },
] as const;

function townhousePaths() {
  const fine: string[] = [];
  const main: string[] = [];
  // střecha: lichoběžník a vodorovná šrafura
  main.push("M64 120L112 62H408L456 120");
  for (let y = 66; y < 118; y += 4) {
    const k = (y - 62) / 58;
    fine.push(`M${112 - 48 * k} ${y}H${408 + 48 * k}`);
  }
  // vikýře
  for (const x of [170, 260, 350]) {
    main.push(`M${x - 14} 116V84Q${x} 70 ${x + 14} 84V116`, `M${x - 18} 84H${x + 18}`);
    fine.push(`M${x} 74V116M${x - 14} 98H${x + 14}`);
  }
  // korunní římsa se zubořezem
  main.push("M52 120H468M56 126H464M60 132H460M60 142H460");
  for (let x = 62; x < 460; x += 8) fine.push(`M${x} 132v8`);
  // tělo, pilastry s hlavicemi
  main.push("M60 142V352M460 142V352");
  for (const x of [72, 448]) main.push(`M${x - 8} 142V352M${x + 8} 142V352`, `M${x - 11} 146H${x + 11}M${x - 11} 150H${x + 11}`);
  // okna
  for (const f of TH_FLOORS) {
    for (const cx of TH_COLS) {
      const x = cx - 13, w = 26, y = f.y, h = f.h;
      main.push(`M${x} ${y}h${w}v${h}h${-w}z`);
      fine.push(`M${x + 3} ${y + 3}h${w - 6}v${h - 6}h${-(w - 6)}z`, `M${cx} ${y + 3}V${y + h - 3}M${x + 3} ${y + h * 0.42}H${x + w - 3}`);
      main.push(`M${x - 4} ${y + h + 3}H${x + w + 4}`);
      if (f.head === "pediment") main.push(`M${x - 5} ${y - 4}L${cx} ${y - 16}L${x + w + 5} ${y - 4}Z`);
      if (f.head === "arch") main.push(`M${x - 3} ${y - 2}Q${cx} ${y - 16} ${x + w + 3} ${y - 2}`);
      if (f.head === "flat") main.push(`M${x - 4} ${y - 4}H${x + w + 4}`);
    }
  }
  // balkon v prvním patře uprostřed
  main.push("M224 206H296M224 214H296M224 206V214M296 206V214");
  for (let x = 228; x <= 292; x += 4) fine.push(`M${x} 207v7`);
  // kordonová římsa
  main.push("M56 352H464M56 357H464");
  // bosované přízemí s cihlovou vazbou
  for (let y = 366, row = 0; y <= 452; y += 9, row++) {
    fine.push(`M60 ${y}H460`);
    for (let x = 60 + (row % 2 ? 0 : 14); x < 460; x += 28) fine.push(`M${x} ${y - 9}V${y}`);
  }
  // portál s oblouky a nadsvětlíkem, výkladce
  main.push("M236 456V402Q260 374 284 402V456", "M240 456V404Q260 380 280 404V456");
  for (let a = 0; a <= 6; a++) {
    const t = Math.PI + (a / 6) * Math.PI;
    fine.push(`M260 404L${(260 + 18 * Math.cos(t)).toFixed(1)} ${(404 + 18 * Math.sin(t)).toFixed(1)}`);
  }
  for (const cx of [130, 390]) main.push(`M${cx - 36} 456V398Q${cx} 376 ${cx + 36} 398V456`, `M${cx - 36} 420H${cx + 36}`);
  // zem
  main.push("M24 456H496M40 460H480");
  return { main: main.join(""), fine: fine.join("") };
}

const TH = townhousePaths();

/** Rytina pražského činžovního domu (520 × 460). Barvu bere z `currentColor`. */
export function Townhouse({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 520 464" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden="true" className={className} style={style}>
      <path d={TH.main} strokeWidth="0.9" />
      <path d={TH.fine} strokeWidth="0.45" />
    </svg>
  );
}

/**
 * Razítko „VYPRODÁNO“ — gumové razítko v modrém inkoustu, otištěné našikmo.
 * Realismus dělá SVG filtr: roztřepený okraj (posun šumem) a místa bez inkoustu
 * (maska z nízkofrekvenčního šumu). Jen jedno na stránce (pevné id filtru).
 */
export function SoldOutStamp({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 900 300" role="img" aria-label="Vyprodáno" className={className} style={style}>
      <defs>
        <filter id="stamp-ink" x="-4%" y="-8%" width="108%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="4" result="grain" />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="2.5" xChannelSelector="R" yChannelSelector="G" result="rough" />
          <feTurbulence type="fractalNoise" baseFrequency="0.028 0.06" numOctaves="4" seed="11" result="blot" />
          <feColorMatrix in="blot" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.8 2.15" result="ink" />
          <feComposite in="rough" in2="ink" operator="in" />
        </filter>
      </defs>
      <g filter="url(#stamp-ink)" fill="none" stroke="#1d3461">
        <rect x="12" y="12" width="876" height="276" rx="22" strokeWidth="11" />
        <rect x="34" y="34" width="832" height="232" rx="12" strokeWidth="4" />
        <g fill="#1d3461" stroke="none" fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif" fontWeight="900" textAnchor="middle">
          <text x="450" y="84" fontSize="26" letterSpacing="9">WORKSHOP · PRAHA</text>
          <text x="450" y="198" fontSize="136" letterSpacing="6">VYPRODÁNO</text>
          <text x="450" y="248" fontSize="24" letterSpacing="9">ADAMOVY FINANCE</text>
        </g>
      </g>
    </svg>
  );
}
