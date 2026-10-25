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

/* ---------- Blueprint: patro velkého bytového domu (maska) ----------
   Typické podlaží: šest bytů (tři na sever, tři na jih), dvě jádra se schodištěm
   a výtahem, středová chodba, osový rastr, kótovací řetězce, šrafované nosné zdi,
   poznámky s odkazovými čarami a rozpiska. Kreslí se zmenšeně, aby byl vidět celý
   dům „z dálky“. Pozadí sekce s recenzemi; barvu dodá CSS. */
{
  const W = 2600, H = 1500, L = [];
  const f = (n) => Number(n.toFixed(1));
  const line = (d, w = 0.8) => L.push(`<path stroke-width="${w}" d="${d}"/>`);
  const text = (x, y, s, size = 12, anchor = "middle", rot = 0) =>
    L.push(`<text x="${f(x)}" y="${f(y)}" font-size="${size}" text-anchor="${anchor}"${rot ? ` transform="rotate(${rot} ${f(x)} ${f(y)})"` : ""} fill="#000" stroke="none" font-family="Arial, Helvetica, sans-serif" letter-spacing="1.2">${s}</text>`);
  const wallH = (x1, x2, y, t) => line(`M${x1} ${y - t / 2}H${x2}M${x1} ${y + t / 2}H${x2}`, t > 12 ? 1.5 : 0.9);
  const wallV = (x, y1, y2, t) => line(`M${x - t / 2} ${y1}V${y2}M${x + t / 2} ${y1}V${y2}`, t > 12 ? 1.5 : 0.9);
  const hatch = (x, y, w, h, step = 9) => {
    for (let k = -h; k < w; k += step) {
      const x0 = Math.max(x, x + k), y0 = y + Math.max(0, -k), x1 = Math.min(x + w, x + k + h), y1 = y0 + (x1 - x0);
      if (x1 > x0) line(`M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}`, 0.3);
    }
  };
  const door = (x, y, r, a0, sweep = 1) => {
    const rad = (a) => (a * Math.PI) / 180, a1 = a0 + 90 * sweep;
    line(`M${x} ${y}L${f(x + r * Math.cos(rad(a0)))} ${f(y + r * Math.sin(rad(a0)))}A${r} ${r} 0 0 ${sweep > 0 ? 1 : 0} ${f(x + r * Math.cos(rad(a1)))} ${f(y + r * Math.sin(rad(a1)))}`, 0.55);
  };
  const winH = (x, y, w) => line(`M${x} ${y - 9}H${x + w}M${x} ${y}H${x + w}M${x} ${y + 9}H${x + w}M${x} ${y - 9}V${y + 9}M${x + w} ${y - 9}V${y + 9}`, 0.55);
  const winV = (x, y, h) => line(`M${x - 9} ${y}V${y + h}M${x} ${y}V${y + h}M${x + 9} ${y}V${y + h}M${x - 9} ${y}H${x + 9}M${x - 9} ${y + h}H${x + 9}`, 0.55);
  const note = (x, y, tx, ty, s) => { line(`M${x} ${y}L${tx} ${ty}H${tx + (tx > x ? 1 : -1) * 150}`, 0.45); L.push(`<circle cx="${x}" cy="${y}" r="3" fill="#000" stroke="none"/>`); text(tx + (tx > x ? 4 : -4), ty - 6, s, 11, tx > x ? "start" : "end"); };

  // rastr listu je zvlášť (plans-grid.svg), aby se opakoval přes celou sekci bez okrajů

  const X0 = 300, X1 = 2300, Y0 = 380, Y1 = 1140, CY0 = 740, CY1 = 790;
  // osy
  const ax = [300, 520, 760, 900, 1160, 1440, 1700, 1840, 2080, 2300];
  const ay = [380, 560, 765, 960, 1140];
  ax.forEach((x, i) => { line(`M${x} 250V1270`, 0.35); line(`M${x} 215m-18 0a18 18 0 1 0 36 0a18 18 0 1 0 -36 0`, 0.7); text(x, 220, String(i + 1), 14); });
  ay.forEach((y, i) => { line(`M190 ${y}H2410`, 0.35); line(`M160 ${y}m-18 0a18 18 0 1 0 36 0a18 18 0 1 0 -36 0`, 0.7); text(160, y + 5, "ABCDE"[i], 14); });

  // obvod (tl. 22) se šrafou nosného zdiva v rozích
  wallH(X0, X1, Y0, 22); wallH(X0, X1, Y1, 22); wallV(X0, Y0, Y1, 22); wallV(X1, Y0, Y1, 22);
  for (const [x, y] of [[X0 - 11, Y0 - 11], [X1 - 40, Y0 - 11], [X0 - 11, Y1 - 40], [X1 - 40, Y1 - 40]]) hatch(x, y, 51, 51, 7);
  // chodba
  wallH(X0, 760, CY0, 16); wallH(900, 1700, CY0, 16); wallH(1840, X1, CY0, 16);
  wallH(X0, 760, CY1, 16); wallH(900, 1700, CY1, 16); wallH(1840, X1, CY1, 16);
  text(1300, 770, "CHODBA 2.01 · 46,5 m²", 12);
  // dvě jádra: schodiště + výtah, šrafované stěny
  for (const cx of [760, 1700]) {
    wallV(cx, Y0, Y1, 16); wallV(cx + 140, Y0, Y1, 16);
    hatch(cx - 8, Y0, 16, Y1 - Y0, 10); hatch(cx + 132, Y0, 16, Y1 - Y0, 10);
    for (let y = 420; y < 700; y += 18) line(`M${cx + 10} ${y}H${cx + 66}M${cx + 74} ${y}H${cx + 130}`, 0.45);
    line(`M${cx + 70} 410V705M${cx + 38} 690V430M${cx + 32} 444L${cx + 38} 428L${cx + 44} 444`, 0.55);
    text(cx + 70, 405, "SCHODIŠTĚ", 10);
    line(`M${cx + 15} 830H${cx + 125}V990H${cx + 15}ZM${cx + 15} 830L${cx + 125} 990M${cx + 125} 830L${cx + 15} 990`, 0.6);
    text(cx + 70, 1010, "VÝTAH 1000 kg", 10);
    line(`M${cx + 15} 1030H${cx + 125}V1110H${cx + 15}Z`, 0.5); text(cx + 70, 1075, "INSTALAČNÍ ŠACHTA", 8);
  }

  // šest bytů: [x1, x2, sever?, typ, číslo]
  const flats = [
    [X0, 760, true, "3+KK", "2.01"], [900, 1700, true, "4+KK", "2.02"], [1840, X1, true, "3+KK", "2.03"],
    [X0, 760, false, "2+KK", "2.04"], [900, 1700, false, "4+KK", "2.05"], [1840, X1, false, "2+KK", "2.06"],
  ];
  for (const [x1, x2, north, type, no] of flats) {
    const yo = north ? Y0 : CY1, yi = north ? CY0 : Y1; // vnější a vnitřní hrana
    const top = Math.min(yo, yi), bot = Math.max(yo, yi), w = x2 - x1, mid = (top + bot) / 2;
    // příčky: koupelna + WC u chodby, ložnice po stranách, obývák s KK
    const bx = x1 + w * 0.36, rx = x1 + w * 0.68;
    wallV(bx, top, bot, 10);
    if (w > 600) wallV(rx, top, bot, 10);
    const sy = north ? bot - 130 : top + 130; // pás koupelen u chodby
    wallH(x1, bx, sy, 10); wallV(x1 + (bx - x1) * 0.55, north ? sy : top, north ? bot : sy, 8);
    // dveře
    door(bx - 40, north ? bot : top, 36, north ? 270 : 90, 1);
    door(bx, mid, 32, north ? 90 : 270, 1);
    if (w > 600) door(rx, mid + 40, 32, 0, -1);
    door(x1 + 60, sy, 30, north ? 0 : 180, 1);
    // okna na fasádě a balkony na jih
    for (let x = x1 + 50; x < x2 - 120; x += 170) winH(x, yo, 110);
    if (!north) { line(`M${x1 + 60} ${Y1}V${Y1 + 70}H${x2 - 60}V${Y1}M${x1 + 66} ${Y1}V${Y1 + 64}H${x2 - 66}V${Y1}`, 0.6); text((x1 + x2) / 2, Y1 + 92, `BALKON ${(((x2 - x1 - 120) * 0.07) / 10).toFixed(1).replace(".", ",")} m²`, 10); }
    // popisy
    const area = (w * 0.5 * (bot - top) / 2000).toFixed(1).replace(".", ",");
    text((x1 + x2) / 2, north ? top + 40 : bot - 30, `BYT ${no} · ${type} · ${area} m²`, 13);
    text((x1 + bx) / 2, north ? sy - 90 : sy + 110, "LOŽNICE", 11);
    text((x1 + bx) / 2, north ? sy - 74 : sy + 126, `${(((bx - x1) * 120) / 2000).toFixed(1).replace(".", ",")} m²`, 10);
    text((x1 + (bx - x1) * 0.27), north ? sy + 70 : sy - 60, "KOUPELNA", 10);
    text((x1 + (bx - x1) * 0.78), north ? sy + 70 : sy - 60, "WC", 10);
    text(((w > 600 ? rx : x2) + bx) / 2, mid, "OBÝVACÍ POKOJ + KK", 11);
    if (w > 600) { text((rx + x2) / 2, mid - 8, "POKOJ", 11); text((rx + x2) / 2, mid + 8, `${(((x2 - rx) * 140) / 2000).toFixed(1).replace(".", ",")} m²`, 10); }
  }

  // kótovací řetězce nahoře a dole, vpravo
  const chain = (y, xs) => { line(`M${xs[0]} ${y}H${xs[xs.length - 1]}`, 0.5); xs.forEach((x) => line(`M${x - 6} ${y + 6}L${x + 6} ${y - 6}`, 0.8)); xs.slice(1).forEach((x, i) => text((x + xs[i]) / 2, y - 8, String(Math.round((x - xs[i]) * 12)).replace(/\B(?=(\d{3})+(?!\d))/g, " "), 10)); };
  chain(300, ax); chain(280 - 40, [X0, X1]); chain(1270, ax); chain(1300, [X0, X1]);
  line(`M2370 ${Y0}V${Y1}`, 0.5); ay.forEach((y) => line(`M2364 ${y + 6}L2376 ${y - 6}`, 0.8));
  ay.slice(1).forEach((y, i) => text(2390, (y + ay[i]) / 2, String(Math.round((y - ay[i]) * 12)).replace(/\B(?=(\d{3})+(?!\d))/g, " "), 10, "middle", 90));

  // poznámky s odkazovými čarami
  note(X0, 520, 120, 470, "OBVODOVÉ ZDIVO 440 + ETICS 160");
  note(760, 600, 560, 120, "ŽB STĚNA JÁDRA TL. 200");
  note(1300, 765, 1450, 120, "PODLAHA: VINYL 5 / ANHYDRIT 50 / KROČEJ. IZOLACE 30");
  note(2300, 900, 2440, 860, "OKNO 1500 × 1600, Uw ≤ 0,9");
  note(1000, Y1 + 60, 960, 1380, "ZÁBRADLÍ BALKONU H = 1000 mm");
  note(1770, 920, 2000, 1380, "VÝTAH 8 OSOB, BEZBARIÉROVÝ");
  note(560, 1030, 420, 1380, "SDK PŘÍČKA 100, 2× IMPREG.");

  // sever a měřítko
  line("M2470 230m-34 0a34 34 0 1 0 68 0a34 34 0 1 0 -68 0M2470 190V270M2458 212L2470 190L2482 212", 0.8); text(2470, 292, "S", 14);
  line("M300 1440H700M300 1432V1448M400 1436V1444M500 1432V1448M600 1436V1444M700 1432V1448", 0.7); text(500, 1426, "0     5     10 m", 11);
  // rozpiska
  line("M1880 1360H2560V1480H1880ZM1880 1400H2560M1880 1440H2560M2220 1360V1480", 0.8);
  text(2050, 1386, "BYTOVÝ DŮM · PRAHA", 12); text(2390, 1386, "STAVEBNÍ ČÁST", 11);
  text(2050, 1426, "PŮDORYS TYPICKÉHO PODLAŽÍ 2.–6.NP", 11); text(2390, 1426, "M 1:100", 12);
  text(2050, 1466, "6 BYTŮ · 2 JÁDRA", 11); text(2390, 1466, "D.1.1.04", 12);

  writeFileSync("public/engraving/plans-mask.svg", svg(`0 0 ${W} ${H}`, L.join(""), "#000"));
  // milimetrový rastr jako dlaždice 100 × 100
  const G = [];
  for (let k = 0; k < 100; k += 25) G.push(`<path stroke-width="${k === 0 ? 0.6 : 0.25}" d="M${k + 0.25} 0V100M0 ${k + 0.25}H100"/>`);
  writeFileSync("public/engraving/plans-grid.svg", svg("0 0 100 100", G.join(""), "#000"));
  console.log("plans-mask.svg, plans-grid.svg");
}

/* ---------- Blueprint: řez A-A bytovým domem (maska) ----------
   Svislý řez: 1.PP až 6.NP, šrafované stropní desky, schodiště v řezu, okna,
   plochá střecha s atikou, výškové kóty podlaží a terén. Šev sekcí 4|5. */
{
  const W = 2200, H = 1500, L = [];
  const f = (n) => Number(n.toFixed(1));
  const line = (d, w = 0.8) => L.push(`<path stroke-width="${w}" d="${d}"/>`);
  const text = (x, y, s, size = 12, anchor = "middle") =>
    L.push(`<text x="${f(x)}" y="${f(y)}" font-size="${size}" text-anchor="${anchor}" fill="#000" stroke="none" font-family="Arial, Helvetica, sans-serif" letter-spacing="1.2">${s}</text>`);
  const X0 = 300, X1 = 1900, FH = 150, GROUND = 1200;
  const levels = [-1, 0, 1, 2, 3, 4, 5, 6]; // úrovně podlah: 1.PP … střecha
  const yOf = (lvl) => GROUND - lvl * FH;
  // terén
  line(`M80 ${GROUND + 18}H2120`, 1.2);
  for (let x = 90; x < 2120; x += 22) line(`M${x} ${GROUND + 18}l-14 14`, 0.4);
  // obvodové stěny
  line(`M${X0} ${yOf(-1) + 30}V${yOf(6) - 40}M${X0 + 22} ${yOf(-1) + 30}V${yOf(6)}M${X1} ${yOf(-1) + 30}V${yOf(6) - 40}M${X1 - 22} ${yOf(-1) + 30}V${yOf(6)}`, 1.4);
  // stropní desky se šrafou
  for (const lvl of levels) {
    const y = yOf(lvl);
    line(`M${X0} ${y}H${X1}M${X0} ${y + 22}H${X1}`, 1.1);
    for (let x = X0 + 6; x < X1; x += 10) line(`M${x} ${y + 22}l12 -22`, 0.25);
    if (lvl < 6) {
      const name = lvl < 0 ? "1.PP" : lvl === 0 ? "1.NP" : `${lvl + 1}.NP`;
      const elev = lvl * 3.15;
      text(X0 - 40, y - 6, `${elev >= 0 ? "+" : ""}${elev.toFixed(3).replace(".", ",")}`, 11, "end");
      line(`M${X0 - 120} ${y}H${X0 - 10}M${X0 - 30} ${y}l-8 -10h16z`, 0.5);
      text(X1 + 60, y - FH / 2 + 4, name, 12, "start");
      // okna v podlaží
      if (lvl >= 0) for (let x = X0 + 90; x < X1 - 200; x += 240) {
        if (x > 900 && x < 1240) continue;
        line(`M${x} ${y - 30}V${y - 110}H${x + 120}V${y - 30}ZM${x + 60} ${y - 30}V${y - 110}M${x} ${y - 70}H${x + 120}`, 0.5);
      }
    }
  }
  // atika a střecha
  line(`M${X0} ${yOf(6) - 40}H${X0 + 22}M${X1 - 22} ${yOf(6) - 40}H${X1}`, 1.2);
  text((X0 + X1) / 2, yOf(6) - 18, "PLOCHÁ STŘECHA · ATIKA +19,450", 11);
  // schodiště v řezu (lomená ramena)
  for (let lvl = -1; lvl < 6; lvl++) {
    const yb = yOf(lvl), yt = yOf(lvl + 1), xa = 980, xb = 1180;
    line(`M${xa} ${yb}L${xb} ${(yb + yt) / 2 + 11}L${xa} ${yt + 22}`, 0.7);
    for (let k = 0; k < 9; k++) {
      const x = xa + (k * (xb - xa)) / 9, y = yb - (k * (yb - (yb + yt) / 2)) / 9;
      line(`M${f(x)} ${f(y)}h${f((xb - xa) / 9)}v${f(-(yb - (yb + yt) / 2) / 9)}`, 0.35);
    }
  }
  line(`M960 ${yOf(-1)}V${yOf(6)}M1200 ${yOf(-1)}V${yOf(6)}`, 0.9);
  text(1080, yOf(6) + 60, "SCHODIŠTĚ", 10);
  // výškový kótovací řetězec
  line(`M${X1 + 30} ${yOf(-1)}V${yOf(6)}`, 0.5);
  for (const lvl of levels) line(`M${X1 + 24} ${yOf(lvl) + 6}L${X1 + 36} ${yOf(lvl) - 6}`, 0.8);
  // popis řezu
  line("M1080 120m-40 0a40 40 0 1 0 80 0a40 40 0 1 0 -80 0M1040 120H1120", 0.8);
  text(1080, 112, "A", 16); text(1080, 146, "A", 16);
  text(1080, 210, "ŘEZ A-A · M 1:100", 14);
  line(`M${X0} 1330H${X1}M${X0} 1322V1338M${X1} 1322V1338`, 0.5); text((X0 + X1) / 2, 1320, "19 200", 12);
  writeFileSync("public/engraving/section-mask.svg", svg(`0 0 ${W} ${H}`, L.join(""), "#000"));
  console.log("section-mask.svg");
}
