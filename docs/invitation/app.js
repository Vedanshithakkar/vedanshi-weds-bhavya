/* Vedanshi & Bhavya — classic invitation */
const CONFIG = {
  couple: 'Vedanshi & Bhavya',
  venue: 'Vihan Party Plot',
  mapUrl: 'https://share.google/gQN76AYlFFuV5BoQN',
  // WhatsApp number for RSVPs, country code, no + or spaces (e.g. '919876543210').
  // Empty: WhatsApp lets the guest choose who to send it to.
  rsvpWhatsApp: '',
  weddingStart: '2027-02-28T19:00:00+05:30',
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const params = new URLSearchParams(location.search);

/* ---------- Personal greeting: ?to=Name ---------- */
const guest = (params.get('to') || '').trim().slice(0, 60);
if (guest) {
  $('#dearName').textContent = guest;
  $('#dear').hidden = false;
  $('#rsvpName').value = guest;
  document.title = `${guest}, you're invited · ${CONFIG.couple}`;
}

/* ---------- Envelope ---------- */
const intro = $('#intro');
function openEnvelope() {
  if (intro.classList.contains('opening')) return;
  intro.classList.add('opening');
  setTimeout(() => {
    intro.classList.add('gone');
    $('#main').focus?.();
  }, reduceMotion ? 0 : 1700);
}
$('#openBtn').addEventListener('click', openEnvelope);
$('#envelope').addEventListener('click', openEnvelope);
if (params.has('open')) { intro.classList.add('opening', 'gone'); }

/* ---------- Countdown ---------- */
const target = new Date(CONFIG.weddingStart).getTime();
const pad = n => String(n).padStart(2, '0');
function tick() {
  let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
  const d = Math.floor(s / 86400); s %= 86400;
  const h = Math.floor(s / 3600); s %= 3600;
  const m = Math.floor(s / 60); s %= 60;
  $('#cdD').textContent = d; $('#cdH').textContent = pad(h); $('#cdM').textContent = pad(m); $('#cdS').textContent = pad(s);
}
tick(); setInterval(tick, 1000);

/* ---------- Calendar ---------- */
const utc = iso => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const events = $$('.ev').map(li => ({
  title: li.dataset.title, start: li.dataset.start, end: li.dataset.end,
  details: $('.ev-body p:not(.ev-gu):not(.dress)', li)?.textContent.trim() || '',
  link: $('.cal', li),
}));
for (const e of events) {
  const u = new URL('https://calendar.google.com/calendar/render');
  u.searchParams.set('action', 'TEMPLATE');
  u.searchParams.set('text', e.title);
  u.searchParams.set('dates', `${utc(e.start)}/${utc(e.end)}`);
  u.searchParams.set('location', CONFIG.venue);
  u.searchParams.set('details', `${e.details}\n\nDirections: ${CONFIG.mapUrl}`);
  e.link.href = u.toString();
}
$('#allCal').addEventListener('click', () => {
  const esc = s => s.replace(/[\\,;]/g, m => '\\' + m).replace(/\n/g, '\\n');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Vedanshi & Bhavya//Invitation//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
  events.forEach((e, i) => lines.push('BEGIN:VEVENT', `UID:vb-2027-${i}@vedanshi-weds-bhavya`, `DTSTAMP:${utc(new Date().toISOString())}`,
    `DTSTART:${utc(e.start)}`, `DTEND:${utc(e.end)}`, `SUMMARY:${esc(e.title)}`, `LOCATION:${esc(CONFIG.venue)}`,
    `DESCRIPTION:${esc(e.details + '\n\nDirections: ' + CONFIG.mapUrl)}`, 'END:VEVENT'));
  lines.push('END:VCALENDAR');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar' }));
  a.download = 'Vedanshi-Bhavya-wedding.ics';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
});

/* ---------- Venue ---------- */
$('#mapBtn').href = CONFIG.mapUrl;

/* ---------- Gallery lightbox (native <dialog>) ---------- */
const lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap');
const shots = $$('#grid .ph img').map(img => ({ src: img.getAttribute('src').replace('.webp', '-full.webp'), alt: img.alt }));
let cur = 0;
function show(i) {
  cur = (i + shots.length) % shots.length;
  lbImg.src = shots[cur].src; lbImg.alt = shots[cur].alt; lbCap.textContent = shots[cur].alt;
}
$$('#grid .ph').forEach((b, i) => b.addEventListener('click', () => { show(i); lb.showModal(); }));
$('#lbPrev').addEventListener('click', () => show(cur - 1));
$('#lbNext').addEventListener('click', () => show(cur + 1));
lb.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') show(cur - 1);
  if (e.key === 'ArrowRight') show(cur + 1);
});
// swipe
let x0 = null;
lb.addEventListener('pointerdown', e => { x0 = e.clientX; });
lb.addEventListener('pointerup', e => {
  if (x0 === null) return;
  const dx = e.clientX - x0; x0 = null;
  if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
});
// light dismiss where closedby is not supported (Safari): press and release outside the photo
if (!('closedBy' in HTMLDialogElement.prototype)) {
  const outside = e => {
    const r = lbImg.getBoundingClientRect();
    return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  };
  let pressedOutside = false;
  lb.addEventListener('pointerdown', e => { pressedOutside = e.target === lb || e.target.tagName === 'FIGURE' ? outside(e) : false; });
  lb.addEventListener('pointerup', e => { if (pressedOutside && outside(e) && (e.target === lb || e.target.tagName === 'FIGURE')) lb.close(); });
}

/* ---------- RSVP via WhatsApp ---------- */
const form = $('#rsvpForm');
function syncAttend() {
  const yes = form.attend.value === 'yes';
  $('#countFld').hidden = !yes; $('#whichFld').hidden = !yes;
}
form.addEventListener('change', syncAttend); syncAttend();
form.addEventListener('submit', e => {
  e.preventDefault();
  // read the input directly: form.name is the <form>'s own name attribute, not the field
  const nameEl = $('#rsvpName'), name = nameEl.value.trim();
  if (!name) { nameEl.focus(); return; }
  const yes = form.attend.value === 'yes';
  const which = $$('input[name=ev]:checked', form).map(i => i.value);
  const msg = form.msg.value.trim();
  const text = [
    `RSVP · ${CONFIG.couple} wedding`,
    `Name: ${name}`,
    yes ? `Attending: Yes, ${form.count.value} guest(s)` : 'Attending: Sorry, we will bless you from afar',
    yes && which.length ? `Celebrations: ${which.join(', ')}` : '',
    msg ? `Message: ${msg}` : '',
  ].filter(Boolean).join('\n');
  const base = CONFIG.rsvpWhatsApp ? `https://wa.me/${CONFIG.rsvpWhatsApp}` : 'https://wa.me/';
  window.open(`${base}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
});
