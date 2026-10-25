/**
 * Vygeneruje rytinové motivy do public/engraving jako statické SVG.
 *
 * Proč ne inline v komponentě: guilloché má tisíce bodů a Next by je serializoval
 * dvakrát (HTML + RSC payload) do každé stránky. Statický soubor se stáhne jednou
 * a dál se bere z cache. Spouští se ručně: npm run engraving
 */
import { mkdirSync, writeFileSync } from "node:fs";

const round = (n) => Number(n.toFixed(1));

function guilloche(R, r, d, turns, steps) {
  const pts = [];
  const k = (R - r) / r;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * turns * Math.PI * 2;
    pts.push(`${round((R - r) * Math.cos(t) + d * Math.cos(k * t))} ${round((R - r) * Math.sin(t) - d * Math.sin(k * t))}`);
  }
  return `M${pts.join("L")}`;
}

function rosette(R, r, d, turns, steps) {
  const pts = [];
  const k = (R + r) / r;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * turns * Math.PI * 2;
    pts.push(`${round((R + r) * Math.cos(t) - d * Math.cos(k * t))} ${round((R + r) * Math.sin(t) - d * Math.sin(k * t))}`);
  }
  return `M${pts.join("L")}`;
}

function wave(width, y, amplitude, frequency, phase, steps) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width;
    const p = (x / width) * Math.PI * 2;
    pts.push(
      `${round(x)} ${round(y + Math.sin(p * frequency + phase) * amplitude + Math.sin(p * frequency * 2.37 + phase * 1.6) * amplitude * 0.28)}`,
    );
  }
  return `M${pts.join("L")}`;
}

const svg = (viewBox, body, stroke) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none" stroke="${stroke}">${body}</svg>`;

const TONES = { gold: "#b08a50", brown: "#80533f", ink: "#211d1a", paper: "#f1e7d0" };

mkdirSync("public/engraving", { recursive: true });

const guillocheBody =
  `<path stroke-width="0.4" d="${guilloche(120, 37, 30, 37, 1500)}"/>` +
  `<path stroke-width="0.35" d="${guilloche(92, 23, 19, 23, 1000)}"/>` +
  `<circle r="122" stroke-width="0.6"/><circle r="117" stroke-width="0.3"/><circle r="34" stroke-width="0.4"/>`;

const wavesBody = Array.from({ length: 20 }, (_, i) => {
  const t = i / 19;
  return `<path stroke-width="0.5" d="${wave(600, t * 400, 6 + Math.sin(t * Math.PI) * 16, 2 + t * 1.5, t * 3.1, 140)}"/>`;
}).join("");

const rosetteBody = `<path stroke-width="0.5" d="${rosette(38, 8, 15, 8, 520)}"/><circle r="53" stroke-width="0.45"/>`;

const cornerBody =
  `<path stroke-width="0.8" d="M0 20 L0 4 Q0 0 4 0 L20 0"/>` +
  `<path stroke-width="0.5" d="M6 24 L6 9 Q6 6 9 6 L24 6"/>` +
  `<path stroke-width="0.45" d="M12 12 Q20 12 22 20 Q24 28 32 30"/>` +
  `<circle cx="12" cy="12" r="2.4" stroke-width="0.5"/>`;

/* ---------- Bankovkový tisk ---------- */

/** Prstenec z modulovaných kružnic (r = R + A·sin(nθ + φ)) — „copánek“ rozety bankovky. */
function braid(R, A, n, lines, spread, steps = 720) {
  return Array.from({ length: lines }, (_, k) => {
    const phase = (k / lines) * spread;
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      const r = R + A * Math.sin(n * t + phase);
      pts.push(`${round(r * Math.cos(t))} ${round(r * Math.sin(t))}`);
    }
    return `M${pts.join("L")}Z`;
  });
}

/** Okvětní lístky: r = R0 + A·|sin(nθ/2)|^p, několik soustředných obrysů. */
function petals(R0, A, n, lines, gap, power = 0.7, steps = 900) {
  return Array.from({ length: lines }, (_, k) => {
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      const r = R0 - k * gap + (A - k * gap * 0.6) * Math.abs(Math.sin((n * t) / 2)) ** power;
      pts.push(`${round(r * Math.cos(t))} ${round(r * Math.sin(t))}`);
    }
    return `M${pts.join("L")}Z`;
  });
}

/** Velká rozeta — vrstvená jako na českých bankovkách: hvězda, lístky, copánky, perlovec. */
function grandRosette() {
  const p = (d, w) => `<path stroke-width="${w}" d="${d}"/>`;
  const parts = [
    p(guilloche(60, 17, 24, 17, 1400), 0.32),
    ...petals(96, 30, 24, 6, 3.2).map((d) => p(d, 0.32)),
    ...braid(138, 7, 48, 9, Math.PI * 2).map((d) => p(d, 0.28)),
    ...braid(170, 10, 30, 7, Math.PI).map((d) => p(d, 0.3)),
    p(rosette(150, 4, 9, 4, 2600), 0.22),
    ...braid(206, 5, 96, 5, Math.PI * 2, 1100).map((d) => p(d, 0.26)),
    `<circle r="58" stroke-width="0.5"/><circle r="186" stroke-width="0.45"/><circle r="214" stroke-width="0.6"/><circle r="218" stroke-width="0.3"/>`,
    // perlovec po obvodu
    Array.from({ length: 120 }, (_, i) => {
      const t = (i / 120) * Math.PI * 2;
      return `<circle cx="${round(226 * Math.cos(t))}" cy="${round(226 * Math.sin(t))}" r="2.2" stroke-width="0.35"/>`;
    }).join(""),
  ];
  return parts.join("");
}

/**
 * Podtisk (ochranná síť) jako dlaždice: dvě rodiny jemných vln se kříží a vytváří moaré.
 * Perioda vln = šířka dlaždice a rozestup řádků dělí výšku, takže se dlaždice napojuje beze švu.
 */
function lattice(W, H, gap, amp) {
  const lines = [];
  for (const dir of [1, -1]) {
    for (let y0 = -2 * gap; y0 <= H + 2 * gap; y0 += gap) {
      const pts = [];
      for (let i = 0; i <= 96; i++) {
        const x = (i / 96) * W;
        const p = (x / W) * Math.PI * 2;
        pts.push(`${round(x)} ${round(y0 + dir * (amp * Math.sin(p) + amp * 0.35 * Math.sin(3 * p + (dir > 0 ? 0 : 1.3))))}`);
      }
      lines.push(`<path stroke-width="${dir > 0 ? 0.45 : 0.3}" d="M${pts.join("L")}"/>`);
    }
  }
  return lines.join("");
}

/** Lemový pás (bordura) — opletené vlny, dlaždice napojitelná vodorovně. */
function borderBand(W, H, lines) {
  const out = [];
  for (let k = 0; k < lines; k++) {
    const phase = (k / lines) * Math.PI * 2;
    const pts = [];
    for (let i = 0; i <= 120; i++) {
      const x = (i / 120) * W;
      const p = (x / W) * Math.PI * 2;
      pts.push(`${round(x)} ${round(H / 2 + (H / 2 - 2) * Math.sin(2 * p + phase))}`);
    }
    out.push(`<path stroke-width="0.4" d="M${pts.join("L")}"/>`);
  }
  out.push(`<path stroke-width="0.6" d="M0 0.5H${W}M0 ${H - 0.5}H${W}"/>`);
  return out.join("");
}

const files = [
  ["rosette-grand-gold.svg", svg("-232 -232 464 464", grandRosette(), TONES.gold)],
  ["rosette-grand-brown.svg", svg("-232 -232 464 464", grandRosette(), TONES.brown)],
  // Masky: barvu dodá CSS (duhový tisk), proto černý tah.
  ["lattice-mask.svg", svg("0 0 240 96", lattice(240, 96, 6, 9), "#000")],
  ["border-mask.svg", svg("0 0 160 22", borderBand(160, 22, 7), "#000")],
  ["guilloche-gold.svg", svg("-130 -130 260 260", guillocheBody, TONES.gold)],
  ["waves-brown.svg", svg("0 0 600 400", wavesBody, TONES.brown)],
  ["waves-paper.svg", svg("0 0 600 400", wavesBody, TONES.paper)],
  ["rosette-gold.svg", svg("-56 -56 112 112", rosetteBody, TONES.gold)],
  ["corner-gold.svg", svg("0 0 64 64", cornerBody, TONES.gold)],
];

for (const [name, content] of files) {
  writeFileSync(`public/engraving/${name}`, content);
  console.log(name, `${Math.round(content.length / 1024)} KB`);
}

