import { guillochePath, rosettePath, waveField } from "@/components/engraving/patterns";

/* Cesty se spočítají jednou při načtení modulu, ne při každém renderu. */
/* Hodnoty d jsou zvolené tak, aby křivka tvořila prstenec a nezaplnila střed. */
const GUILLOCHE_OUTER = guillochePath(120, 37, 30, 37, 2400);
const GUILLOCHE_INNER = guillochePath(92, 23, 19, 23, 1600);
const ROSETTE_SMALL = rosettePath(38, 8, 15, 8, 700);
const WAVES = waveField(600, 400, 26);

type Tone = "gold" | "ink" | "paper" | "burgundy" | "brown";

const stroke: Record<Tone, string> = {
  gold: "var(--color-gold)",
  ink: "var(--color-ink)",
  paper: "var(--color-paper)",
  burgundy: "var(--color-burgundy)",
  brown: "var(--color-brown)",
};

/** Guilloché rozeta — ochranný vzor bankovky. Dekorace, proto aria-hidden. */
export function Guilloche({
  className = "",
  tone = "gold",
  opacity = 0.14,
}: {
  className?: string;
  tone?: Tone;
  opacity?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="-130 -130 260 260"
      className={className}
      style={{ opacity }}
      fill="none"
      stroke={stroke[tone]}
      strokeWidth="0.4"
      vectorEffect="non-scaling-stroke"
    >
      <path d={GUILLOCHE_OUTER} />
      <path d={GUILLOCHE_INNER} strokeWidth="0.35" />
      <circle r="122" strokeWidth="0.6" />
      <circle r="117" strokeWidth="0.3" />
      <circle r="34" strokeWidth="0.4" />
    </svg>
  );
}

/** Malá rozeta do rohů a mezi sekce. */
export function Rosette({
  className = "",
  tone = "gold",
  opacity = 0.35,
}: {
  className?: string;
  tone?: Tone;
  opacity?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="-56 -56 112 112"
      className={className}
      style={{ opacity }}
      fill="none"
      stroke={stroke[tone]}
      strokeWidth="0.5"
      vectorEffect="non-scaling-stroke"
    >
      <path d={ROSETTE_SMALL} />
      <circle r="53" strokeWidth="0.45" />
    </svg>
  );
}

/** Linkované vlnové pozadí — „vodoznak“ pod obsahem sekce. */
export function WaveField({
  className = "",
  tone = "ink",
  opacity = 0.07,
}: {
  className?: string;
  tone?: Tone;
  opacity?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 600 400"
      preserveAspectRatio="none"
      className={className}
      style={{ opacity }}
      fill="none"
      stroke={stroke[tone]}
      strokeWidth="0.5"
      vectorEffect="non-scaling-stroke"
    >
      {WAVES.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

/** Ornamentální roh tištěného rámečku. */
export function CornerOrnament({
  className = "",
  tone = "gold",
  opacity = 0.5,
  flipX = false,
  flipY = false,
}: {
  className?: string;
  tone?: Tone;
  opacity?: number;
  flipX?: boolean;
  flipY?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      className={className}
      style={{ opacity, transform: `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})` }}
      fill="none"
      stroke={stroke[tone]}
      strokeWidth="0.8"
      vectorEffect="non-scaling-stroke"
    >
      <path d="M0 20 L0 4 Q0 0 4 0 L20 0" />
      <path d="M6 24 L6 9 Q6 6 9 6 L24 6" strokeWidth="0.5" />
      <path d="M12 12 Q20 12 22 20 Q24 28 32 30" strokeWidth="0.45" />
      <circle cx="12" cy="12" r="2.4" strokeWidth="0.5" />
    </svg>
  );
}

/** Obrovské nominální číslo na pozadí — grafický motiv, ne skutečná bankovka. */
export function Numeral({
  value,
  className = "",
  tone = "ink",
  opacity = 0.06,
}: {
  value: string;
  className?: string;
  tone?: Tone;
  opacity?: number;
}) {
  return (
    <span
      aria-hidden="true"
      className={`nominal pointer-events-none select-none ${className}`}
      style={{ color: stroke[tone], opacity }}
    >
      {value}
    </span>
  );
}

/** Opakovaná mikrotypografie — pásek u okraje sekce. */
export function MicroStrip({
  text,
  repeat = 8,
  className = "",
}: {
  text: string;
  repeat?: number;
  className?: string;
}) {
  /* width:0 + min-width:100% — pásek se nikdy nepodílí na šířce gridu, jen vyplní hotový sloupec. */
  return (
    <p aria-hidden="true" className={`microtype w-0 min-w-full truncate ${className}`}>
      {Array.from({ length: repeat }, () => text).join("  ·  ")}
    </p>
  );
}
