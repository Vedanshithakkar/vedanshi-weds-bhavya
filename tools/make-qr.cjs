// Makes the venue QR code for the site, plus a shareable/printable QR card.
// usage: node tools/make-qr.cjs "<map link>" "<venue name>"
// Writes docs/img/venue-qr.svg (shown on the page) and docs/img/venue-qr-card.png (1080x1350, for WhatsApp/printing).
const req = require('module').createRequire('C:/Users/Newen Guest/wedding-photos/tools/');
const QRCode = req('qrcode');
const sharp = req('sharp');
const fs = require('fs'), path = require('path');

const [url, venue = 'Venue'] = process.argv.slice(2);
if (!url) { console.error('usage: node tools/make-qr.cjs "<map link>" "<venue name>"'); process.exit(1); }
const out = path.join(__dirname, '..', 'docs', 'img');
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

(async () => {
  // High error correction, so the small seal drawn over the centre on the page can't break scanning
  const opts = { errorCorrectionLevel: 'H', margin: 1, color: { dark: '#4a0a14', light: '#fff9ef' } };
  fs.writeFileSync(path.join(out, 'venue-qr.svg'), await QRCode.toString(url, { ...opts, type: 'svg' }));

  const qr = await QRCode.toBuffer(url, { ...opts, type: 'png', width: 640 });
  const seal = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><defs><radialGradient id="w" cx="35%" cy="30%"><stop offset="0" stop-color="#e0464f"/><stop offset=".6" stop-color="#a3121f"/><stop offset="1" stop-color="#6a0812"/></radialGradient></defs><circle cx="60" cy="60" r="58" fill="#fff9ef"/><circle cx="60" cy="60" r="50" fill="url(#w)"/><circle cx="60" cy="60" r="42" fill="none" stroke="#f8e6a8" stroke-width="2" stroke-dasharray="4 4"/><text x="60" y="73" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="36" fill="#f8e6a8">V&amp;B</text></svg>`);
  const card = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7a1222"/><stop offset="1" stop-color="#3a0610"/></linearGradient>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c9a24a"/><stop offset=".5" stop-color="#fff3c4"/><stop offset="1" stop-color="#c9a24a"/></linearGradient>
      <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="13" cy="13" r="1.8" fill="#f8e6a8" fill-opacity=".12"/></pattern>
    </defs>
    <rect width="1080" height="1350" fill="url(#bg)"/>
    <rect width="1080" height="1350" fill="url(#dots)"/>
    <rect x="40" y="40" width="1000" height="1270" rx="28" fill="none" stroke="#c9a24a" stroke-width="3"/>
    <rect x="56" y="56" width="968" height="1238" rx="20" fill="none" stroke="#c9a24a" stroke-opacity=".45" stroke-width="1.5"/>
    <g text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" fill="#f8e6a8">
      <text x="540" y="150" font-size="34" letter-spacing="10">THE WEDDING OF</text>
      <text x="540" y="245" font-size="84" font-style="italic" fill="url(#gold)">Vedanshi &amp; Bhavya</text>
      <text x="540" y="305" font-size="34" letter-spacing="8">SUNDAY · 28 · 02 · 2027</text>
      <rect x="210" y="350" width="660" height="660" rx="30" fill="#fff9ef"/>
      <text x="540" y="1095" font-size="30" letter-spacing="10" fill="#e8c873">VENUE</text>
      <text x="540" y="1168" font-size="62" font-style="italic" fill="url(#gold)">${esc(venue)}</text>
      <text x="540" y="1240" font-size="30" letter-spacing="4">Scan for directions</text>
    </g>
  </svg>`;
  await sharp(Buffer.from(card))
    .composite([{ input: qr, left: 220, top: 360 }, { input: seal, left: 480, top: 620 }])
    .png({ compressionLevel: 9 }).toFile(path.join(out, 'venue-qr-card.png'));
  console.log('wrote venue-qr.svg and venue-qr-card.png for', url);
})();
