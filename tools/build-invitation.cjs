// Build images for the classic invitation (docs/invitation/img).
// Only everyday / function photos — no pre-wedding shoot pictures.
const sharp = require('C:/Users/Newen Guest/wedding-photos/tools/node_modules/sharp');
const fs = require('fs'), path = require('path');

const WA = 'C:/Users/Newen Guest/OneDrive - Newen Systems/Desktop/gol dhana/me and bhavya/WhatsApp Image 2026-11-05 at ';
const SRC = path.join(__dirname, '..', 'source') + '/';
const OUT = path.join(__dirname, '..', 'docs', 'invitation', 'img');
fs.mkdirSync(OUT, { recursive: true });

const grade = s => s.modulate({ brightness: 1.03, saturation: 1.05 }).linear(1.04, -3);

const gallery = [
  // [file, alt]
  [WA + '10.50.58 AM (2).jpeg', 'Vedanshi and Bhavya in navy, in a grand hall'],
  [WA + '10.50.57 AM (1).jpeg', 'Sitting together on a marble staircase'],
  [WA + '10.50.56 AM (1).jpeg', 'Vedanshi in a lilac gown with Bhavya'],
  [SRC + '1-DSC_1017.JPG', 'At the gol dhana ceremony'],
  [SRC + '2-DSC_1144.jpg', 'Cutting the cake at gol dhana'],
  [WA + '10.51.01 AM.jpeg', 'The pooja with family'],
  [WA + '10.51.03 AM.jpeg', 'In yellow and orange at a family function'],
  [WA + '11.30.23 AM.jpeg', 'By the lake'],
  [WA + '11.30.25 AM (1).jpeg', 'Bhavya carrying Vedanshi by the lake'],
  [WA + '7.28.37 PM.jpeg', 'In front of a Warli art wall'],
  [WA + '7.28.38 PM.jpeg', 'A garba night'],
  [WA + '11.30.24 AM (2).jpeg', 'A walk in the park'],
];

(async () => {
  // hero (portrait) + social preview
  const HERO = WA + '10.50.58 AM.jpeg';
  for (const w of [900, 1600]) {
    await grade(sharp(HERO).rotate().resize(w)).webp({ quality: 82 }).toFile(`${OUT}/hero-${w}.webp`);
  }
  // wide hero for desktop: crop the middle band around the couple
  const hm = await sharp(HERO).rotate().metadata();
  await grade(sharp(HERO).rotate().extract({ left: 0, top: Math.round(hm.height * 0.10), width: hm.width, height: Math.round(hm.width * 0.95) }).resize(1800))
    .webp({ quality: 80 }).toFile(`${OUT}/hero-wide.webp`);
  await grade(sharp(HERO).rotate().extract({ left: 0, top: Math.round(hm.height * 0.30), width: hm.width, height: Math.round(hm.width * 630 / 1200) }).resize(1200, 630))
    .jpeg({ quality: 84 }).toFile(`${OUT}/og.jpg`);

  const list = [];
  for (let i = 0; i < gallery.length; i++) {
    const [file, alt] = gallery[i];
    const n = String(i + 1).padStart(2, '0');
    const m = await sharp(file).rotate().metadata();
    const portrait = (m.orientation >= 5 ? m.width > m.height : m.height > m.width);
    const thumbW = 720, fullW = Math.min(1600, portrait ? Math.round(1600 * (m.orientation >= 5 ? m.height / m.width : m.width / m.height)) : 1600);
    const t = await grade(sharp(file).rotate().resize(thumbW)).webp({ quality: 78 }).toFile(`${OUT}/m-${n}.webp`);
    await grade(sharp(file).rotate().resize({ width: fullW, withoutEnlargement: true })).webp({ quality: 82 }).toFile(`${OUT}/m-${n}-full.webp`);
    list.push({ n, alt, w: t.width, h: t.height });
  }
  fs.writeFileSync(path.join(OUT, 'gallery.json'), JSON.stringify(list, null, 1));
  console.log(list.map(x => `${x.n} ${x.w}x${x.h} ${x.alt}`).join('\n'));
})();
