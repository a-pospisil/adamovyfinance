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

/* ---------- Bankovková rozeta v duhovém tisku ----------
   Vícebarevná rozeta jako v hlubotisku: hvězda, soustružená síť, dvě vrstvy
   okvětí, kosočtverečný copánek, vlnový pás a perlovec. Linky pod 0,2 px. */
{
  const r1 = (n) => Number(n.toFixed(1));
  const path = (fn, steps, close = true) => {
    const p = [];
    for (let i = 0; i <= steps; i++) {
      const [x, y] = fn((i / steps) * Math.PI * 2);
      p.push(`${r1(x)} ${r1(y)}`);
    }
    return `M${p.join("L")}${close ? "Z" : ""}`;
  };
  const out = [];
  const add = (d, color, w) => out.push(`<path d="${d}" stroke="${color}" stroke-width="${w}"/>`);
  const C = { violet: "#66506b", brown: "#80533f", burgundy: "#633c48", green: "#536b58", gold: "#9c7a44" };

  // 1) střed: jemná epitrochoida (hvězda)
  for (let k = 0; k < 3; k++) {
    const R = 22, r = 2.2, d = 9 + k * 2.2, kk = (R + r) / r;
    add(path((t) => [(R + r) * Math.cos(t) - d * Math.cos(kk * t), (R + r) * Math.sin(t) - d * Math.sin(kk * t)], 1400), C.burgundy, 0.18);
  }
  // 2) prstenec hypotrochoid (soustružená síť)
  for (let k = 0; k < 4; k++) {
    const R = 60, r = 60 / 23, d = 22 + k * 1.6, kk = (R - r) / r, rot = (k * Math.PI) / 46;
    add(path((t) => { const x = (R - r) * Math.cos(t) + d * Math.cos(kk * t), y = (R - r) * Math.sin(t) - d * Math.sin(kk * t); return [x * Math.cos(rot) - y * Math.sin(rot), x * Math.sin(rot) + y * Math.cos(rot)]; }, 1500), k % 2 ? C.violet : C.brown, 0.16);
  }
  // 3) okvětí: dvě vrstvy vnořených lístků (16 + 16 pootočených), duhový přechod barev
  const petalCols = [C.brown, C.burgundy, C.violet, C.violet, C.green, C.brown, C.burgundy, C.violet, C.violet, C.green];
  for (let k = 0; k < 10; k++) {
    const s = 1 - k * 0.045;
    add(path((t) => { const r = s * (66 + 46 * Math.abs(Math.sin(8 * t)) ** 0.75); return [r * Math.cos(t), r * Math.sin(t)]; }, 900), petalCols[k], 0.17);
    add(path((t) => { const tt = t + Math.PI / 16, r = s * (58 + 30 * Math.abs(Math.sin(8 * t)) ** 0.75); return [r * Math.cos(tt), r * Math.sin(tt)]; }, 900), petalCols[(k + 3) % 10], 0.14);
  }
  // 4) copánek: 10 modulovaných kružnic, kosočtverce
  for (let k = 0; k < 10; k++) {
    const ph = (k / 10) * Math.PI;
    add(path((t) => { const r = 138 + 10 * Math.sin(36 * t + ph); return [r * Math.cos(t), r * Math.sin(t)]; }, 1100), k % 2 ? C.violet : C.brown, 0.16);
    add(path((t) => { const r = 138 + 10 * Math.sin(-36 * t + ph); return [r * Math.cos(t), r * Math.sin(t)]; }, 1100), k % 2 ? C.burgundy : C.violet, 0.14);
  }
  // 5) vnější vlnový pás: dvě protiběžné rodiny
  for (let k = 0; k < 9; k++) {
    const ph = (k / 9) * Math.PI;
    add(path((t) => { const r = 168 + 9 * Math.sin(30 * t + ph) * Math.cos(6 * t); return [r * Math.cos(t), r * Math.sin(t)]; }, 1200), C.violet, 0.13);
    add(path((t) => { const r = 168 + 9 * Math.sin(-30 * t + ph) * Math.cos(6 * t); return [r * Math.cos(t), r * Math.sin(t)]; }, 1200), C.brown, 0.13);
  }
  // 6) soustředné linky a perlovec
  for (const [r, w, c] of [[100, 0.3, C.brown], [126, 0.35, C.burgundy], [124, 0.15, C.brown], [154, 0.3, C.brown], [122, 0.15, C.violet], [182, 0.45, C.burgundy], [186, 0.2, C.brown]]) out.push(`<circle r="${r}" stroke="${c}" stroke-width="${w}"/>`);
  for (let i = 0; i < 160; i++) { const t = (i / 160) * Math.PI * 2; out.push(`<circle cx="${r1(193 * Math.cos(t))}" cy="${r1(193 * Math.sin(t))}" r="1.6" stroke="${C.brown}" stroke-width="0.25"/>`); }
  // 7) radiální „soustruh" mezi 100 a 126
  for (let i = 0; i < 180; i++) { const t = (i / 180) * Math.PI * 2; out.push(`<path d="M${r1(102 * Math.cos(t))} ${r1(102 * Math.sin(t))}L${r1(124 * Math.cos(t + 0.05))} ${r1(124 * Math.sin(t + 0.05))}" stroke="${C.violet}" stroke-width="0.12"/>`); }

  writeFileSync(
    "public/engraving/rosette-banknote.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-200 -200 400 400" fill="none" stroke-linecap="round">${out.join("")}</svg>`,
  );
  console.log("rosette-banknote.svg");
}

/* ---------- Cihlová vazba a svislá bordura (masky) ---------- */
writeFileSync(
  "public/engraving/bricks-mask.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 60" fill="none" stroke="#000" stroke-width="0.8"><path d="M0 0.4H120M0 30.4H120M30 0.4V30.4M90 0.4V30.4M0 30.4V60M60 30.4V60M120 30.4V60"/><path stroke-width="0.35" d="M4 8H24M36 14H70M96 6H114M10 40H40M66 46H100M74 22H86"/></svg>`,
);
{
  const W = 22, H = 160, lines = 7, out = [];
  for (let k = 0; k < lines; k++) {
    const phase = (k / lines) * Math.PI * 2, pts = [];
    for (let i = 0; i <= 120; i++) {
      const y = (i / 120) * H;
      pts.push(`${Number((W / 2 + (W / 2 - 2) * Math.sin(2 * (y / H) * Math.PI * 2 + phase)).toFixed(1))} ${Number(y.toFixed(1))}`);
    }
    out.push(`<path stroke-width="0.4" d="M${pts.join("L")}"/>`);
  }
  out.push(`<path stroke-width="0.6" d="M0.5 0V${H}M${W - 0.5} 0V${H}"/>`);
  writeFileSync("public/engraving/border-mask-v.svg", svg(`0 0 ${W} ${H}`, out.join(""), "#000"));
}
console.log("bricks-mask.svg, border-mask-v.svg");

/* ---------- Stavební výkresy (maska) ----------
   Půdorys bytu s dveřmi, okny a kótami, pohled na činžovní dům a rozpiska jako
   na stavebním plánu. Pozadí sekce s recenzemi; barvu dodá CSS. */
{
  const L = [];
  const line = (d, w = 0.8) => L.push(`<path stroke-width="${w}" d="${d}"/>`);
  const text = (x, y, s, size = 11, anchor = "middle") =>
    L.push(`<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" fill="#000" stroke="none" font-family="Arial, Helvetica, sans-serif" letter-spacing="1.5">${s}</text>`);
  // rastr
  for (let x = 0; x <= 1200; x += 40) line(`M${x} 0V720`, 0.15);
  for (let y = 0; y <= 720; y += 40) line(`M0 ${y}H1200`, 0.15);
  // půdorys: obvodové zdi
  line("M60 80H620V620H60Z", 1.6);
  line("M72 92H608V608H72Z", 0.9);
  // vnitřní příčky
  line("M300 92V250M300 290V400M306 92V250M306 290V400", 0.9);
  line("M72 400H200M240 400H608M72 406H200M240 406H608", 0.9);
  line("M460 406V520M460 560V608M466 406V520M466 560V608", 0.9);
  line("M306 250H560M306 256H560", 0.9);
  // dveře s křídly
  for (const [x, y, r, a0, a1] of [[300, 250, 40, 0, 90], [200, 406, 40, 270, 360], [460, 520, 40, 180, 270]]) {
    const p = (a) => [x + r * Math.cos((a * Math.PI) / 180), y + r * Math.sin((a * Math.PI) / 180)].map((v) => v.toFixed(1));
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    line(`M${x} ${y}L${x0} ${y0}A${r} ${r} 0 0 1 ${x1} ${y1}`, 0.6);
  }
  // okna v obvodové zdi
  for (const x of [120, 220, 380, 500]) line(`M${x} 80H${x + 60}M${x} 86H${x + 60}M${x} 92H${x + 60}`, 0.6);
  for (const y of [180, 470]) line(`M608 ${y}V${y + 70}M614 ${y}V${y + 70}M620 ${y}V${y + 70}`, 0.6);
  // kóty
  line("M60 50H620M60 44V56M620 44V56M300 44V56", 0.6);
  text(180, 42, "6 000"); text(460, 42, "8 000");
  line("M30 80V620M24 80H36M24 620H36M24 400H36", 0.6);
  text(22, 245, "8 200", 11, "end"); text(22, 515, "5 400", 11, "end");
  // popisy místností
  text(186, 240, "OBÝVACÍ POKOJ"); text(186, 258, "28,4 m²", 10);
  text(456, 170, "LOŽNICE"); text(456, 188, "14,2 m²", 10);
  text(456, 330, "KUCHYŇ"); text(456, 348, "9,8 m²", 10);
  text(260, 510, "PŘEDSÍŇ"); text(260, 528, "7,1 m²", 10);
  text(536, 510, "KOUPELNA"); text(536, 528, "5,6 m²", 10);
  // pohled na dům
  line("M700 640H1160", 1.2);
  line("M740 640V200H1120V640", 1.2);
  line("M728 200H1132M734 192H1126", 0.9);
  line("M800 192L930 112L1060 192", 1);
  for (const y of [300, 400, 500]) line(`M740 ${y}H1120`, 0.5);
  for (const fy of [220, 320, 420]) for (const wx of [770, 840, 910, 980, 1050]) line(`M${wx} ${fy}h40v56h-40zM${wx + 20} ${fy}v56M${wx} ${fy + 24}h40`, 0.55);
  line("M915 640V560Q930 540 945 560V640", 0.9);
  for (let y = 520; y < 640; y += 12) line(`M740 ${y}H900M960 ${y}H1120`, 0.3);
  // výšková kóta
  line("M1160 200V640M1154 200H1166M1154 640H1166", 0.6);
  text(1172, 424, "+18,600", 11, "start");
  // rozpiska
  line("M860 668H1180V712H860ZM860 690H1180M1040 668V712", 0.8);
  text(950, 684, "PŮDORYS 2.NP", 10); text(1110, 684, "M 1:100", 10);
  text(950, 706, "BYT 3+KK · PRAHA", 9); text(1110, 706, "LIST 04", 9);
  writeFileSync("public/engraving/plans-mask.svg", svg("0 0 1200 720", L.join(""), "#000"));
  console.log("plans-mask.svg");
}
