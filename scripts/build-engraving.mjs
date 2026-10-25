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

/* ---------- Blueprint: celé patro bytového domu (maska) ----------
   Typické podlaží činžovního domu: osový rastr s popisy, obvodové a nosné zdi,
   schodiště s výtahem a chodbou, čtyři byty (3+kk, 2+kk, 1+kk, 3+kk) s příčkami,
   dveřmi, okny a balkony, kótovací řetězce a rozpiska. Pozadí sekce s recenzemi;
   barvu dodá CSS. */
{
  const W = 1600, H = 1000, L = [];
  const line = (d, w = 0.8) => L.push(`<path stroke-width="${w}" d="${d}"/>`);
  const text = (x, y, s, size = 12, anchor = "middle") =>
    L.push(`<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" fill="#000" stroke="none" font-family="Arial, Helvetica, sans-serif" letter-spacing="1.5">${s}</text>`);
  const wall = (x1, y1, x2, y2, t) => {
    // zeď jako dvojitá linka tloušťky t (vodorovná nebo svislá)
    if (y1 === y2) line(`M${x1} ${y1 - t / 2}H${x2}M${x1} ${y1 + t / 2}H${x2}`, t > 10 ? 1.4 : 0.9);
    else line(`M${x1 - t / 2} ${y1}V${y2}M${x1 + t / 2} ${y1}V${y2}`, t > 10 ? 1.4 : 0.9);
  };
  const door = (x, y, r, a0, sweep = 1) => {
    const a1 = a0 + 90 * sweep, rad = (a) => (a * Math.PI) / 180;
    const p0 = [x + r * Math.cos(rad(a0)), y + r * Math.sin(rad(a0))], p1 = [x + r * Math.cos(rad(a1)), y + r * Math.sin(rad(a1))];
    line(`M${x} ${y}L${p0[0].toFixed(1)} ${p0[1].toFixed(1)}A${r} ${r} 0 0 ${sweep > 0 ? 1 : 0} ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`, 0.6);
  };
  const winH = (x, y, w) => line(`M${x} ${y - 7}H${x + w}M${x} ${y}H${x + w}M${x} ${y + 7}H${x + w}M${x} ${y - 7}V${y + 7}M${x + w} ${y - 7}V${y + 7}`, 0.6);
  const winV = (x, y, h) => line(`M${x - 7} ${y}V${y + h}M${x} ${y}V${y + h}M${x + 7} ${y}V${y + h}M${x - 7} ${y}H${x + 7}M${x - 7} ${y + h}H${x + 7}`, 0.6);

  // jemný rastr přes celý list
  for (let x = 0; x <= W; x += 25) line(`M${x} 0V${H}`, x % 100 === 0 ? 0.3 : 0.12);
  for (let y = 0; y <= H; y += 25) line(`M0 ${y}H${W}`, y % 100 === 0 ? 0.3 : 0.12);

  // osový rastr s bublinami
  const ax = [200, 480, 800, 1120, 1400], ay = [220, 500, 780];
  ax.forEach((x, i) => { line(`M${x} 120V880`, 0.4); line(`M${x} 96m-16 0a16 16 0 1 0 32 0a16 16 0 1 0 -32 0`, 0.7); text(x, 101, String(i + 1), 13); });
  ay.forEach((y, i) => { line(`M110 ${y}H1490`, 0.4); line(`M86 ${y}m-16 0a16 16 0 1 0 32 0a16 16 0 1 0 -32 0`, 0.7); text(86, y + 5, "ABC"[i], 13); });

  // obvodové zdi (tloušťka 18)
  wall(200, 220, 1400, 220, 18); wall(200, 780, 1400, 780, 18);
  wall(200, 220, 200, 780, 18); wall(1400, 220, 1400, 780, 18);
  // střední nosná zeď a chodba
  wall(200, 470, 700, 470, 14); wall(900, 470, 1400, 470, 14);
  wall(200, 530, 700, 530, 14); wall(900, 530, 1400, 530, 14);
  // jádro: schodiště a výtah
  wall(700, 220, 700, 780, 14); wall(900, 220, 900, 780, 14);
  for (let y = 250; y < 440; y += 16) line(`M712 ${y}H788`, 0.5);   // stupně rameno 1
  for (let y = 250; y < 440; y += 16) line(`M812 ${y}H888`, 0.5);   // rameno 2
  line("M800 240V450M712 450H888", 0.7); line("M750 440L750 260M745 270L750 258L755 270", 0.6); text(800, 238, "SCHODIŠTĚ", 10);
  line("M720 560H880V700H720ZM720 560L880 700M880 560L720 700", 0.7); text(800, 720, "VÝTAH", 10);
  text(800, 505, "CHODBA 1.1", 10);

  // byty: příčky (8)
  // byt 1 (vlevo nahoře) 3+kk
  wall(420, 220, 420, 470, 8); wall(200, 360, 420, 360, 8); wall(560, 220, 560, 470, 8);
  // byt 2 (vpravo nahoře) 2+kk
  wall(1120, 220, 1120, 470, 8); wall(1120, 350, 1400, 350, 8);
  // byt 3 (vlevo dole) 1+kk
  wall(470, 530, 470, 780, 8); wall(470, 650, 700, 650, 8);
  // byt 4 (vpravo dole) 3+kk
  wall(1080, 530, 1080, 780, 8); wall(1240, 530, 1240, 780, 8); wall(900, 660, 1080, 660, 8);

  // vstupní dveře z chodby a vnitřní dveře
  door(640, 470, 34, 180, -1); door(960, 470, 34, 0, 1); door(640, 530, 34, 180, 1); door(960, 530, 34, 0, -1);
  door(420, 300, 30, 270, 1); door(560, 330, 30, 90, 1); door(330, 360, 30, 0, -1);
  door(1120, 300, 30, 270, -1); door(1250, 350, 30, 180, 1);
  door(470, 600, 30, 90, -1); door(560, 650, 30, 0, 1);
  door(1080, 600, 30, 90, 1); door(1240, 610, 30, 270, -1); door(990, 660, 30, 180, -1);

  // okna
  [[240, 120], [450, 80], [600, 80], [960, 120], [1160, 80], [1300, 80]].forEach(([x, w]) => winH(x, 220, w));
  [[240, 160], [500, 140], [940, 110], [1110, 110], [1270, 100]].forEach(([x, w]) => winH(x, 780, w));
  [[260, 80], [380, 70], [580, 150], [660, 90]].forEach(([y, h]) => { winV(200, y, h); winV(1400, y, h); });

  // balkony
  line("M260 780V840H420V780M266 780V834H414V780", 0.7);
  line("M1110 780V840H1290V780M1116 780V834H1284V780", 0.7);

  // popisy místností s plochami
  [[310, 300, "POKOJ", "16,8"], [490, 300, "KOUPELNA", "5,2"], [630, 330, "LOŽNICE", "13,4"], [310, 420, "OBÝVACÍ POKOJ + KK", "31,6"],
   [1010, 330, "OBÝVACÍ POKOJ + KK", "27,9"], [1260, 285, "LOŽNICE", "14,1"], [1260, 415, "KOUPELNA", "6,0"],
   [335, 660, "POKOJ + KK", "24,3"], [585, 600, "KOUPELNA", "4,8"], [585, 720, "PŘEDSÍŇ", "5,1"],
   [990, 610, "KOUPELNA", "5,5"], [990, 725, "POKOJ", "12,7"], [1160, 660, "LOŽNICE", "15,2"], [1320, 660, "OBÝVACÍ POKOJ + KK", "28,8"]]
    .forEach(([x, y, n, a]) => { text(x, y, n, 11); text(x, y + 16, `${a} m²`, 10); });
  [[380, 470 - 22, "BYT 1.01 · 3+KK"], [1260, 470 - 22, "BYT 1.02 · 2+KK"], [330, 530 + 30, "BYT 1.03 · 1+KK"], [1200, 530 + 30, "BYT 1.04 · 3+KK"]]
    .forEach(([x, y, n]) => text(x, y, n, 10));

  // kótovací řetězce
  line("M200 160H1400", 0.6); ax.forEach((x) => line(`M${x - 6} 166L${x + 6} 154`, 0.8));
  [[340, "5 600"], [640, "6 400"], [960, "6 400"], [1260, "5 600"]].forEach(([x, t]) => text(x, 152, t, 11));
  line("M200 920H1400M200 914V926M1400 914V926", 0.6); text(800, 912, "48 000", 12);
  line("M1460 220V780", 0.6); ay.forEach((y) => line(`M1454 ${y + 6}L1466 ${y - 6}`, 0.8));
  text(1476, 365, "11 200", 11, "start"); text(1476, 645, "11 200", 11, "start");

  // sever
  line("M1520 120m-24 0a24 24 0 1 0 48 0a24 24 0 1 0 -48 0M1520 92V148M1512 108L1520 92L1528 108", 0.7); text(1520, 172, "S", 12);

  // rozpiska
  line("M1180 930H1580V990H1180ZM1180 960H1580M1380 930V990", 0.8);
  text(1280, 950, "PŮDORYS 2.NP", 11); text(1480, 950, "M 1:100", 11);
  text(1280, 980, "BYTOVÝ DŮM · PRAHA", 10); text(1480, 980, "LIST 04 / D.1.1", 10);

  writeFileSync("public/engraving/plans-mask.svg", svg(`0 0 ${W} ${H}`, L.join(""), "#000"));
  console.log("plans-mask.svg");
}
