// Like sample.cjs, but picks every photo whose DSC number falls in the given ranges.
// usage: node sample-range.cjs <outDir> <folder> <from-to> [<from-to> ...]
const sharp = require('C:/Users/Newen Guest/wedding-photos/tools/node_modules/sharp');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const base = 'C:/Users/Newen Guest/OneDrive - Newen Systems/Desktop/gol dhana';
const [out, d, ...ranges] = process.argv.slice(2);
const rs = ranges.map(r => r.split('-').map(Number));
const files = fs.readdirSync(path.join(base, d)).filter(f => {
  const n = Number((f.match(/(\d+)\.jpe?g$/i) || [])[1]);
  return rs.some(([a, b]) => n >= a && n <= b);
});
(async () => {
  const queue = [...files];
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const f = queue.shift(), src = path.join(base, d, f), dst = path.join(out, `${d}-${f.replace(/\.JPG$/i, '.jpg')}`);
      if (fs.existsSync(dst)) continue;
      try {
        await sharp(src).rotate().resize(1600, 1600, { fit: 'inside' }).jpeg({ quality: 86 }).toFile(dst);
        try { execFileSync('attrib', ['+U', '-P', path.win32.normalize(src)]); } catch {}
        console.log('ok', f);
      } catch (e) { console.log('fail', f, e.message); }
    }
  }));
  console.log('DONE', files.length);
})();
