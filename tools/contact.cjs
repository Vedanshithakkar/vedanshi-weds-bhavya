// Make a labelled contact sheet of every image in a folder (for picking photos)
const sharp = require('C:/Users/Newen Guest/wedding-photos/tools/node_modules/sharp');
const fs = require('fs'), path = require('path');
const [dir, out, cols = 6, cell = 260] = process.argv.slice(2);
(async () => {
  const files = fs.readdirSync(dir).filter(f => /\.(jpe?g|png)$/i.test(f)).sort();
  const C = +cols, S = +cell, rows = Math.ceil(files.length / C);
  const comps = [];
  for (let i = 0; i < files.length; i++) {
    let buf;
    try {
      buf = await sharp(path.join(dir, files[i])).rotate().resize(S, S, { fit: 'contain', background: '#222' }).jpeg().toBuffer();
    } catch (e) { console.error('skip', files[i], e.message); continue; }
    const x = (i % C) * S, y = Math.floor(i / C) * (S + 22);
    comps.push({ input: buf, left: x, top: y });
    const label = Buffer.from(`<svg width="${S}" height="22"><rect width="100%" height="100%" fill="#000"/><text x="4" y="16" font-size="15" fill="#ff0" font-family="Arial">${i}</text></svg>`);
    comps.push({ input: label, left: x, top: y + S });
  }
  await sharp({ create: { width: C * S, height: rows * (S + 22), channels: 3, background: '#111' } }).composite(comps).jpeg({ quality: 80 }).toFile(out);
  files.forEach((f, i) => console.log(i, f));
})();
