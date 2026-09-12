/**
 * Generátor rytinových křivek inspirovaný guilloché strojem, kterým se
 * kreslí ochranné vzory na bankovkách. Vše je deterministické (žádný Math.random),
 * takže se server i klient shodnou a cesty se spočítají jednou při importu.
 */

/** Hypotrochoida (spirograf): základ guilloché rozety. */
export function guillochePath(R: number, r: number, d: number, turns = 24, steps = 1200): string {
  const pts: string[] = [];
  const k = (R - r) / r;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * turns * Math.PI * 2;
    const x = (R - r) * Math.cos(t) + d * Math.cos(k * t);
    const y = (R - r) * Math.sin(t) - d * Math.sin(k * t);
    pts.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return `M ${pts.join(" L ")}`;
}

/** Epitrochoida: vnější rozeta s ostřejšími hroty (rámečky, rohové ornamenty). */
export function rosettePath(R: number, r: number, d: number, turns = 12, steps = 900): string {
  const pts: string[] = [];
  const k = (R + r) / r;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * turns * Math.PI * 2;
    const x = (R + r) * Math.cos(t) - d * Math.cos(k * t);
    const y = (R + r) * Math.sin(t) - d * Math.sin(k * t);
    pts.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return `M ${pts.join(" L ")}`;
}

/**
 * Vlnovka pro linkovaná pozadí: sinusovka se dvěma frekvencemi,
 * jaká vzniká při rytí strojem s dvojitým převodem.
 */
export function wavePath(
  width: number,
  y: number,
  amplitude: number,
  frequency: number,
  phase = 0,
  steps = 220,
): string {
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width;
    const p = (x / width) * Math.PI * 2;
    const yy =
      y +
      Math.sin(p * frequency + phase) * amplitude +
      Math.sin(p * frequency * 2.37 + phase * 1.6) * amplitude * 0.28;
    pts.push(`${x.toFixed(2)} ${yy.toFixed(2)}`);
  }
  return `M ${pts.join(" L ")}`;
}

/** Soustava vlnovek přes celou plochu — jemná "vodoznaková" vrstva. */
export function waveField(width: number, height: number, lines: number): string[] {
  return Array.from({ length: lines }, (_, i) => {
    const t = i / (lines - 1);
    return wavePath(width, t * height, 6 + Math.sin(t * Math.PI) * 16, 2 + t * 1.5, t * 3.1);
  });
}
