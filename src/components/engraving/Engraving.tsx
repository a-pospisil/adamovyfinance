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
export function GrandRosette({ className = "", opacity = 0.2, tone = "brown" }: Props & { tone?: "brown" | "gold" }) {
  return <Motif src={`/engraving/rosette-grand-${tone}.svg`} className={className} opacity={opacity} />;
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

/** Rytina pražského činžovního domu s cihlovou bosáží v přízemí. Barvu bere z `currentColor`. */
export function Townhouse({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 280" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" aria-hidden="true" className={className}>
      <path d="M10 276H350M40 276V64H320V276M30 64H330M34 58H326M40 70H320M120 58L180 18L240 58Z" />
      <ellipse cx="180" cy="44" rx="10" ry="7" />
      <path d="M40 216H320M40 212H320" />
      <path strokeWidth="0.45" d="M40 228H320M40 240H320M40 252H320M40 264H320M70 216V228M110 216V228M150 216V228M210 216V228M250 216V228M290 216V228M90 228V240M130 228V240M230 228V240M270 228V240M70 240V252M110 240V252M250 240V252M290 240V252M90 252V264M130 252V264M230 252V264M270 252V264M70 264V276M110 264V276M250 264V276M290 264V276" />
      <path d="M164 276V246Q180 228 196 246V276M74 84h22v28H74zM112 84h22v28h-22zM226 84h22v28h-22zM264 84h22v28h-22zM169 84h22v28h-22zM74 136h22v28H74zM112 136h22v28h-22zM226 136h22v28h-22zM264 136h22v28h-22zM169 136h22v28h-22z" />
      <path strokeWidth="0.6" d="M72 84Q85 75 98 84M110 84Q123 75 136 84M224 84Q237 75 250 84M262 84Q275 75 288 84M167 84Q180 74 193 84M70 186H100M108 186H138M222 186H252M260 186H290M165 186H195" />
    </svg>
  );
}
