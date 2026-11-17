// Pull a sample of the cloud-only camera photos down at web size, then hand the originals back to the cloud.
// usage: node sample.cjs <outDir> <folder>:<step> [<folder>:<step> ...]
const sharp = require('C:/Users/Newen Guest/wedding-photos/tools/node_modules/sharp');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const base = 'C:/Users/Newen Guest/OneDrive - Newen Systems/Desktop/gol dhana';
const [out, ...plans] = process.argv.slice(2);
const jobs = [];
for (const p of plans) {
  const [d, step] = p.split(':');
  const files = fs.readdirSync(path.join(base, d)).filter(f => /\.jpe?g$/i.test(f)).sort();
  for (let i = 0; i < files.length; i += Number(step)) jobs.push([d, files[i]]);
}
async function one([d, f]) {
  const src = path.join(base, d, f);
  const dst = path.join(out, `${d}-${f.replace(/\.JPG$/i, '.jpg')}`);
  if (fs.existsSync(dst)) return;
  try {
    await sharp(src).rotate().resize(1600, 1600, { fit: 'inside' }).jpeg({ quality: 86 }).toFile(dst);
    try { execFileSync('attrib', ['+U', '-P', path.win32.normalize(src)]); } catch {}
    console.log('ok', d, f);
  } catch (e) { console.log('fail', d, f, e.message); }
}
(async () => {
  const queue = [...jobs];
  await Promise.all(Array.from({ length: 5 }, async () => { while (queue.length) await one(queue.shift()); }));
  console.log('DONE');
})();
