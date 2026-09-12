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
