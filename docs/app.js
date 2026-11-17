/* Vedanshi & Bhavya — wedding invitation
   Everything you are likely to edit lives in CONFIG. */
const CONFIG = {
  couple: 'Vedanshi & Bhavya',
  // Times of each ceremony live on the event cards in index.html (data-start / data-end).
  venue: {
    name: '',      // e.g. 'Rajpath Club'
    address: '',   // e.g. 'S.G. Highway, Ahmedabad'
    mapUrl: '',    // a Google Maps link
  },
  // WhatsApp number that receives RSVPs, with country code and no + or spaces (e.g. '919876543210').
  // Leave empty and WhatsApp lets the guest pick who to send it to.
  rsvpWhatsApp: '',
  hashtag: '#VedanshiWedsBhavya',
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- Personal greeting (?to=Name) ---------------- */
const params = new URLSearchParams(location.search);
const guest = (params.get('to') || '').trim().slice(0, 60);
if (guest) {
  $('#dearName').textContent = guest;
  $('#dear').hidden = false;
  $('#rsvpName').value = guest;
  document.title = `${guest} — you're invited · ${CONFIG.couple}`;
}

/* ---------------- Decorative SVG builders ---------------- */
function buildToran() {
  const W = 480, n = 15, step = W / n;
  const ropeY = x => 6 + 10 * Math.sin((x / W) * Math.PI); // gentle sag
  const flower = (x, y, r, i) => {
    const c = i % 2 ? '#ffb81c' : '#f07c0a';
    const d = i % 2 ? '#e08a00' : '#c4570a';
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="${d}" stroke-width="2.2" stroke-dasharray="1.6 1.4"/><circle cx="${x - r * .3}" cy="${y - r * .3}" r="${r * .35}" fill="#fff3" />`;
  };
  let leaves = '', swags = '', strands = '';
  // mango leaves hanging from the rope
  for (let i = 0; i < n * 2; i++) {
    const x = i * step / 2 + step / 4, y = ropeY(x);
    const g = i % 2 ? '#2f7d32' : '#3f9a43';
    leaves += `<path d="M${x} ${y} q7 12 0 30 q-7 -18 0 -30z" fill="${g}"/><path d="M${x} ${y + 2} v25" stroke="#a5d6a7" stroke-width=".8" opacity=".7"/>`;
  }
  // swags of marigold between strand points
  for (let i = 0; i < n; i++) {
    const x0 = i * step, x1 = x0 + step;
    const y0 = ropeY(x0) + 2, y1 = ropeY(x1) + 2, sag = 26;
    for (let k = 1; k < 8; k++) {
      const t = k / 8;
      const x = x0 + (x1 - x0) * t;
      const y = y0 + (y1 - y0) * t + sag * 4 * t * (1 - t);
      swags += flower(x, y, 5, k + i);
    }
  }
  // hanging strands with a bell
  for (let i = 0; i <= n; i++) {
    const x = i * step, y = ropeY(x);
    const len = i % 2 ? 4 : 7;
    let s = `<path d="M${x} ${y} v${len * 11 + 6}" stroke="#a0522d" stroke-width="1"/>`;
    for (let k = 0; k < len; k++) s += flower(x, y + 8 + k * 11, 5.5, k + i);
    const by = y + len * 11 + 6;
    s += `<path d="M${x - 5} ${by + 9} q0 -10 5 -10 q5 0 5 10 z" fill="#d4a017" stroke="#8a6420" stroke-width=".8"/><circle cx="${x}" cy="${by + 10}" r="1.6" fill="#8a6420"/>`;
    strands += `<g class="strand" style="animation-delay:${(-i * 0.37).toFixed(2)}s">${s}</g>`;
  }
  const rope = `<path d="M0 6 Q${W / 2} 26 ${W} 6" stroke="#8b4513" stroke-width="2.5" fill="none"/>`;
  $('#toran').innerHTML = `<svg viewBox="0 -2 ${W} 110" preserveAspectRatio="xMidYMin meet">${leaves}${rope}${swags}${strands}</svg>`;
}

function buildMandala() {
  const C = 200;
  let out = '';
  const petal = (r0, r1, w) => `M0 ${-r0} C${w} ${-(r0 + r1) / 2} ${w * .6} ${-r1} 0 ${-r1} C${-w * .6} ${-r1} ${-w} ${-(r0 + r1) / 2} 0 ${-r0}Z`;
  const rings = [
    { n: 12, r0: 28, r1: 62, w: 14 },
    { n: 16, r0: 64, r1: 100, w: 13 },
    { n: 24, r0: 104, r1: 140, w: 10 },
    { n: 36, r0: 146, r1: 176, w: 7 },
  ];
  rings.forEach(({ n, r0, r1, w }, ri) => {
    const d = petal(r0, r1, w);
    for (let i = 0; i < n; i++) {
      const a = (360 / n) * i + (ri % 2 ? 180 / n : 0);
      out += `<path d="${d}" transform="rotate(${a})"/>`;
    }
    out += `<circle r="${r1 + 3}"/>`;
  });
  for (let i = 0; i < 48; i++) {
    const a = (Math.PI * 2 * i) / 48;
    out += `<circle cx="${(186 * Math.cos(a)).toFixed(1)}" cy="${(186 * Math.sin(a)).toFixed(1)}" r="2.4" class="dot"/>`;
  }
  $('#mandala').innerHTML = `<svg viewBox="${-C} ${-C} ${C * 2} ${C * 2}"><g fill="none" stroke="#c9a24a" stroke-width="1.1">${out}</g><style>.dot{fill:#c9a24a;stroke:none}</style></svg>`;
}

function buildKalash() {
  $('#kalash').innerHTML = `<svg viewBox="0 0 50 56" fill="none" stroke="#a3121f" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
    <path d="M25 4c-4 0-6 3-6 6s3 5 6 5 6-2 6-5-2-6-6-6z" fill="#c9a24a" stroke="#8a6420"/>
    <path d="M19 12c-6-3-11-2-14 1 5 1 9 2 13 3M31 12c6-3 11-2 14 1-5 1-9 2-13 3M20 14c-4 1-7 4-8 7 4-1 7-3 9-5M30 14c4 1 7 4 8 7-4-1-7-3-9-5" stroke="#2f7d32" fill="#3f9a43"/>
    <path d="M16 17h18l-2 4h-14z" fill="#f2c94c"/>
    <path d="M18 21c-8 4-11 10-11 16 0 9 8 15 18 15s18-6 18-15c0-6-3-12-11-16z" fill="#f29f05"/>
    <path d="M9 33h32M10 40h30" stroke="#a3121f"/>
    <circle cx="25" cy="36.5" r="2.4" fill="#a3121f" stroke="none"/>
    <path d="M18 52h14l-2 3h-10z" fill="#c9a24a"/>
  </svg>`;
}

function buildNightSky() {
  const stars = $('#stars');
  let html = '';
  for (let i = 0; i < 60; i++) {
    const s = Math.random() < .2 ? 3 : 2;
    html += `<i style="left:${(Math.random() * 100).toFixed(1)}%;top:${(Math.random() * 85).toFixed(1)}%;width:${s}px;height:${s}px;animation-delay:${(-Math.random() * 3).toFixed(2)}s;animation-duration:${(2 + Math.random() * 3).toFixed(1)}s"></i>`;
  }
  stars.innerHTML = html;
  // keep the sunset band right where the morning block ends
  const skies = $('#skies'), morning = $('.morning', skies);
  new ResizeObserver(() => skies.style.setProperty('--me', `${morning.offsetHeight}px`)).observe(morning);
  if (reduceMotion) return;
  const lanterns = $('#lanterns');
  let l = '';
  for (let i = 0; i < 9; i++) {
    l += `<span class="lantern" style="left:${(6 + Math.random() * 86).toFixed(1)}%;--t:${(14 + Math.random() * 10).toFixed(1)}s;--delay:${(-Math.random() * 20).toFixed(1)}s;--s:${(.6 + Math.random() * .7).toFixed(2)};--sway:${(Math.random() * 50 - 25).toFixed(0)}px"></span>`;
  }
  lanterns.innerHTML = l;
}

/* ---------------- Photos ---------------- */
const PHOTOS = window.GALLERY || { reel: [], grid: [] };
function buildPhotos() {
  const reel = $('#reel');
  PHOTOS.reel.forEach((p, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'polaroid';
    b.setAttribute('aria-label', `Open photo ${i + 1}`);
    b.innerHTML = `<img src="${p.src}" alt="" loading="lazy" width="${p.w}" height="${p.h}">`;
    b.addEventListener('click', () => Lightbox.open(PHOTOS.reel, i));
    reel.append(b);
  });
  const grid = $('#masonry');
  PHOTOS.grid.forEach((p, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'reveal';
    b.setAttribute('aria-label', `Open photo ${i + 1} of ${PHOTOS.grid.length}`);
    b.innerHTML = `<img src="${p.src}" alt="" loading="lazy" width="${p.w}" height="${p.h}">`;
    b.addEventListener('click', () => Lightbox.open(PHOTOS.grid, i));
    grid.append(b);
  });
}

const Lightbox = (() => {
  const dlg = $('#lightbox'), img = $('img', dlg), count = $('.lb-count', dlg);
  let list = [], idx = 0, x0 = null;
  const show = () => {
    const p = list[idx];
    img.src = p.full || p.src;
    count.textContent = `${idx + 1} / ${list.length}`;
  };
  const go = d => { idx = (idx + d + list.length) % list.length; show(); };
  $('.lb-close', dlg).onclick = () => dlg.close();
  $('.lb-prev', dlg).onclick = () => go(-1);
  $('.lb-next', dlg).onclick = () => go(1);
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') go(-1); if (e.key === 'ArrowRight') go(1); });
  img.addEventListener('pointerdown', e => { x0 = e.clientX; });
  img.addEventListener('pointerup', e => {
    if (x0 == null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  });
  return { open(l, i) { list = l; idx = i; show(); dlg.showModal(); } };
})();

/* ---------------- Falling petals ---------------- */
const Petals = (() => {
  const cv = $('#petals'), ctx = cv.getContext('2d');
  const colors = ['#c2185b', '#e53958', '#f06292', '#f29f05', '#ffb703', '#d81b60', '#ff8a65'];
  let W = 0, H = 0, dpr = 1, list = [], ambient = 0, raf = 0;
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const make = (x, y, vx, vy, burst) => ({
    x, y, vx, vy, burst,
    r: 5 + Math.random() * 6,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - .5) * .08,
    flip: Math.random() * Math.PI * 2,
    sway: Math.random() * Math.PI * 2,
    c: colors[(Math.random() * colors.length) | 0],
    life: 1,
  });
  const spawnAmbient = () => make(Math.random() * W, -20 - Math.random() * H * .5, 0, .5 + Math.random() * .8, false);
  const draw = p => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.scale(1, .35 + .65 * Math.abs(Math.sin(p.flip)));
    ctx.globalAlpha = Math.min(1, p.life) * .9;
    const r = p.r;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.bezierCurveTo(r, -r * .6, r * .8, r * .7, 0, r);
    ctx.bezierCurveTo(-r * .8, r * .7, -r, -r * .6, 0, -r);
    ctx.fillStyle = p.c;
    ctx.fill();
    ctx.globalAlpha *= .35;
    ctx.beginPath(); ctx.moveTo(0, -r * .7); ctx.lineTo(0, r * .7);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = .8; ctx.stroke();
    ctx.restore();
  };
  const tick = () => {
    ctx.clearRect(0, 0, W, H);
    for (let i = list.length - 1; i >= 0; i--) {
      const p = list[i];
      p.sway += .02; p.flip += .05; p.rot += p.vr;
      if (p.burst) { p.vx *= .985; p.vy = p.vy * .985 + .06; p.life -= .006; }
      p.x += p.vx + Math.sin(p.sway) * .6;
      p.y += p.vy;
      draw(p);
      const gone = p.y > H + 30 || p.life <= 0;
      if (gone) { if (!p.burst && list.length <= ambient + 400) list[i] = spawnAmbient(); else list.splice(i, 1); }
    }
    raf = list.length ? requestAnimationFrame(tick) : 0;
  };
  const run = () => { if (!raf && !document.hidden) raf = requestAnimationFrame(tick); };
  addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else run();
  });
  resize();
  return {
    ambient(n) {
      if (reduceMotion) return;
      ambient = n;
      for (let i = 0; i < n; i++) list.push(spawnAmbient());
      run();
    },
    burst(x, y, n = 70) {
      if (reduceMotion) return;
      const rect = cv.getBoundingClientRect();
      x -= rect.left;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, s = 2 + Math.random() * 6;
        list.push(make(x, y, Math.cos(a) * s, Math.sin(a) * s - 3, true));
      }
      run();
    },
  };
})();

/* ---------------- Music: a soft santoor & tanpura in Raag Bhoopali, made live with Web Audio ---------------- */
const Music = (() => {
  let ac, master, delayIn, playing = false, timer = 0, nextT = 0, step = 0, droneT = 0;
  const SA = 293.66; // D4
  const ratio = { S: 1, R: 9 / 8, G: 5 / 4, P: 3 / 2, D: 5 / 3 };
  const note = n => { // e.g. "G", ".D" (lower), "S'" (upper)
    let f = SA * ratio[n.replace(/[.']/g, '')];
    if (n.startsWith('.')) f /= 2;
    if (n.endsWith("'")) f *= 2;
    return f;
  };
  // phrase: [note, beats]  — '-' is a rest
  const tune = [
    ['G', 1], ['R', 1], ['S', 1], ['.D', 1], ['S', 1], ['R', 1], ['G', 2],
    ['P', 1], ['G', 1], ['D', 1], ['P', 1], ['G', 1], ['R', 1], ['S', 2],
    ['G', 1], ['P', 1], ['D', 1], ["S'", 2], ['D', 1], ['P', 1], ['G', 1],
    ['R', 1], ['G', 1], ['P', 1], ['G', 1], ['R', 1], ['S', 1], ['.D', 1], ['S', 3], ['-', 1],
  ];
  const beat = 60 / 72;

  const init = () => {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    master = ac.createGain(); master.gain.value = 0;
    const comp = ac.createDynamicsCompressor();
    master.connect(comp).connect(ac.destination);
    // echo for a sense of space
    delayIn = ac.createGain(); delayIn.gain.value = .28;
    const d = ac.createDelay(1); d.delayTime.value = beat * .75;
    const fb = ac.createGain(); fb.gain.value = .32;
    const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400;
    delayIn.connect(d); d.connect(lp); lp.connect(fb); fb.connect(d); lp.connect(master);
  };
  const pluck = (f, t, gain = .16, decay = 1.6) => {
    const g = ac.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + .004);
    g.gain.exponentialRampToValueAtTime(.0001, t + decay);
    const lp = ac.createBiquadFilter(); lp.type = 'lowpass';
    lp.frequency.setValueAtTime(f * 9, t); lp.frequency.exponentialRampToValueAtTime(f * 2.5, t + .4);
    [[1, 'triangle', 1], [2, 'sine', .35], [3.01, 'sine', .12]].forEach(([m, type, a]) => {
      const o = ac.createOscillator(); o.type = type; o.frequency.value = f * m;
      const og = ac.createGain(); og.gain.value = a;
      o.connect(og).connect(lp); o.start(t); o.stop(t + decay + .05);
    });
    lp.connect(g); g.connect(master); g.connect(delayIn);
  };
  const tanpura = (f, t) => {
    const g = ac.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(.05, t + .08);
    g.gain.exponentialRampToValueAtTime(.0001, t + 3.6);
    const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; lp.Q.value = 3;
    const o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f;
    const o2 = ac.createOscillator(); o2.type = 'sawtooth'; o2.frequency.value = f * 1.003;
    o.connect(lp); o2.connect(lp); lp.connect(g); g.connect(master);
    o.start(t); o2.start(t); o.stop(t + 3.7); o2.stop(t + 3.7);
  };
  const schedule = () => {
    const ahead = ac.currentTime + .6;
    while (nextT < ahead) {
      const [n, b] = tune[step % tune.length];
      if (n !== '-') {
        const f = note(n);
        pluck(f, nextT);
        if (b >= 2) for (let k = 1; k < b * 3; k++) pluck(f, nextT + k * beat / 3, .05 * (1 - k / (b * 3)), .5); // santoor tremolo
      }
      nextT += b * beat;
      step++;
    }
    while (droneT < ahead) {
      const seq = [SA * .75 / 2, SA / 2, SA / 2, SA / 4];
      seq.forEach((f, i) => tanpura(f, droneT + i * 1.2));
      droneT += 4.8;
    }
  };
  const start = () => {
    if (!ac) init();
    ac.resume();
    playing = true;
    nextT = droneT = ac.currentTime + .1;
    master.gain.cancelScheduledValues(ac.currentTime);
    master.gain.linearRampToValueAtTime(.55, ac.currentTime + 2);
    clearInterval(timer);
    timer = setInterval(schedule, 150);
    schedule();
    btn.setAttribute('aria-pressed', 'true');
    btn.setAttribute('aria-label', 'Pause music');
  };
  const stop = () => {
    playing = false;
    if (!ac) return;
    master.gain.cancelScheduledValues(ac.currentTime);
    master.gain.setValueAtTime(master.gain.value, ac.currentTime);
    master.gain.linearRampToValueAtTime(0, ac.currentTime + .6);
    clearInterval(timer);
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', 'Play music');
  };
  const btn = $('#musicBtn');
  btn.addEventListener('click', () => (playing ? stop() : start()));
  document.addEventListener('visibilitychange', () => {
    if (!ac) return;
    if (document.hidden) ac.suspend(); else if (playing) ac.resume();
  });
  return { start, stop };
})();

/* ---------------- Cover doors ---------------- */
function openInvite() {
  const gate = $('#gate');
  if (gate.classList.contains('open')) return;
  gate.classList.add('open');
  document.body.classList.remove('locked');
  document.body.classList.add('opened');
  const seal = $('#openBtn').getBoundingClientRect();
  Petals.burst(seal.left + seal.width / 2, seal.top + seal.height / 2, 90);
  setTimeout(() => Petals.ambient(12), 1800);
  try { Music.start(); } catch { /* audio unavailable */ }
  setTimeout(() => gate.remove(), 2600);
}
$('#openBtn').addEventListener('click', openInvite);

/* ---------------- Scratch card ---------------- */
function initScratch() {
  const wrap = $('#scratch'), cv = $('canvas', wrap);
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  let w, h, down = false, last = null, moves = 0, done = false, painted = false;

  const paint = () => {
    // offsetWidth ignores the reveal animation's scale, so the canvas matches the card's real size
    if (!wrap.offsetWidth) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = wrap.offsetWidth; h = wrap.offsetHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#8a6420'); g.addColorStop(.25, '#e8c873'); g.addColorStop(.45, '#fff3c4');
    g.addColorStop(.6, '#c9a24a'); g.addColorStop(.85, '#f8e6a8'); g.addColorStop(1, '#8a6420');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    // foil grain
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = Math.random() < .5 ? 'rgba(255,255,255,.35)' : 'rgba(120,80,20,.18)';
      ctx.fillRect(Math.random() * w, Math.random() * h, 1.2, 1.2);
    }
    // little paisley dots border
    ctx.strokeStyle = 'rgba(122,18,34,.45)'; ctx.setLineDash([2, 5]); ctx.lineWidth = 1.5;
    ctx.strokeRect(10, 10, w - 20, h - 20); ctx.setLineDash([]);
    ctx.fillStyle = '#5a0b18';
    ctx.textAlign = 'center';
    ctx.font = '600 15px Cinzel, serif';
    ctx.fillText('SCRATCH TO REVEAL', w / 2, h / 2 - 6);
    ctx.font = '30px "Great Vibes", cursive';
    ctx.fillText('our wedding date', w / 2, h / 2 + 26);
    painted = true;
  };
  const scratch = (x, y) => {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = '#000'; // must be opaque, or each stroke only half-erases the foil
    ctx.lineCap = ctx.lineJoin = 'round';
    ctx.lineWidth = 38;
    ctx.beginPath();
    ctx.moveTo(last ? last.x : x, last ? last.y : y);
    ctx.lineTo(x, y);
    ctx.stroke();
    last = { x, y };
    if (++moves % 10 === 0) check();
  };
  const check = () => {
    const { data } = ctx.getImageData(0, 0, cv.width, cv.height);
    let clear = 0, total = 0;
    for (let i = 3; i < data.length; i += 4 * 24) { total++; if (data[i] < 40) clear++; }
    if (clear / total > .45) reveal();
  };
  const pos = e => {
    const r = cv.getBoundingClientRect();
    return [(e.clientX - r.left) * (w / r.width), (e.clientY - r.top) * (h / r.height)];
  };
  cv.addEventListener('pointerdown', e => {
    down = true; last = null;
    try { cv.setPointerCapture(e.pointerId); } catch { /* not every pointer can be captured */ }
    scratch(...pos(e));
  });
  cv.addEventListener('pointermove', e => { if (down && !done) scratch(...pos(e)); });
  const up = () => { down = false; last = null; };
  cv.addEventListener('pointerup', up);
  cv.addEventListener('pointercancel', up);

  function reveal() {
    if (done) return;
    done = true;
    wrap.classList.add('revealed');
    const r = wrap.getBoundingClientRect();
    Petals.burst(r.left + r.width / 2, r.top + r.height / 2, 80);
    navigator.vibrate?.(40);
  }
  $('#scratchSkip').addEventListener('click', reveal);
  // fonts affect the canvas text, so paint once they are ready
  document.fonts.ready.then(paint);
  addEventListener('resize', () => { if (!done && painted && Math.abs(wrap.offsetWidth - w) > 2) paint(); });
}

/* ---------------- Countdown ---------------- */
function initCountdown() {
  const target = new Date($('.event.wedding').dataset.start).getTime();
  const els = Object.fromEntries($$('[data-cd]').map(el => [el.dataset.cd, el]));
  const set = (k, v) => {
    const s = String(v).padStart(2, '0');
    if (els[k].textContent !== s) {
      els[k].textContent = s;
      els[k].classList.remove('tick'); void els[k].offsetWidth; els[k].classList.add('tick');
    }
  };
  const tick = () => {
    let ms = target - Date.now();
    if (ms <= 0) {
      $('#countdown').innerHTML = '<p class="lead" style="grid-column:1/-1;margin:0">We\'re married! Thank you for your blessings 💛</p>';
      return clearInterval(t);
    }
    const d = Math.floor(ms / 864e5); ms -= d * 864e5;
    const h = Math.floor(ms / 36e5); ms -= h * 36e5;
    const m = Math.floor(ms / 6e4); ms -= m * 6e4;
    set('d', d); set('h', h); set('m', m); set('s', Math.floor(ms / 1e3));
  };
  const t = setInterval(tick, 1000);
  tick();
}

/* ---------------- Calendar ---------------- */
const Cal = (() => {
  const dlg = $('#calDialog');
  let current = [];
  const stamp = d => new Date(d).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const where = () => [CONFIG.venue.name, CONFIG.venue.address].filter(Boolean).join(', ');
  const fromCard = li => ({
    title: li.dataset.title,
    start: li.dataset.start,
    end: li.dataset.end,
    desc: `${$('.ev-desc', li).textContent.trim()}\n\n${location.origin}${location.pathname}`,
  });
  const ics = evs => {
    const esc = s => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Vedanshi & Bhavya//Wedding//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
    evs.forEach((e, i) => lines.push(
      'BEGIN:VEVENT',
      `UID:vb-wedding-${stamp(e.start)}-${i}@vedanshi-weds-bhavya`,
      `DTSTAMP:${stamp(Date.now())}`,
      `DTSTART:${stamp(e.start)}`,
      `DTEND:${stamp(e.end)}`,
      `SUMMARY:${esc(e.title)}`,
      `DESCRIPTION:${esc(e.desc)}`,
      ...(where() ? [`LOCATION:${esc(where())}`] : []),
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${esc(e.title)} is tomorrow`, 'END:VALARM',
      'END:VEVENT'));
    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  };
  const google = e => {
    const u = new URL('https://calendar.google.com/calendar/render');
    u.searchParams.set('action', 'TEMPLATE');
    u.searchParams.set('text', e.title);
    u.searchParams.set('dates', `${stamp(e.start)}/${stamp(e.end)}`);
    u.searchParams.set('details', e.desc);
    u.searchParams.set('ctz', 'Asia/Kolkata');
    if (where()) u.searchParams.set('location', where());
    return u.toString();
  };
  const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  $('#calIcs').addEventListener('click', () => {
    const text = ics(current);
    if (isIOS) {
      location.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(text);
    } else {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([text], { type: 'text/calendar' }));
      a.download = current.length > 1 ? 'vedanshi-bhavya-wedding.ics' : `${current[0].title.split(' ·')[0].toLowerCase().replace(/\W+/g, '-')}.ics`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    }
    dlg.close();
  });
  const open = evs => {
    current = evs;
    $('#calSub').textContent = evs.length > 1 ? 'All wedding-day celebrations' : evs[0].title.split(' ·')[0];
    const g = $('#calGoogle');
    if (evs.length === 1) { g.hidden = false; g.href = google(evs[0]); } else { g.hidden = false; g.href = google({ ...evs[0], title: 'Wedding of Vedanshi & Bhavya (all day)', start: evs[0].start, end: evs[evs.length - 1].end }); }
    dlg.showModal();
  };
  $('#calGoogle').addEventListener('click', () => setTimeout(() => dlg.close(), 100));
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-cal]');
    if (!b) return;
    if (b.dataset.cal === 'all') open($$('.event').map(fromCard));
    else open([fromCard(b.closest('.event'))]);
  });
})();

/* ---------------- Venue ---------------- */
function initVenue() {
  const v = CONFIG.venue;
  if (v.name) $('#venueName').textContent = v.name;
  if (v.address) $('#venueAddr').textContent = v.address;
  if (v.mapUrl) { const a = $('#venueMap'); a.href = v.mapUrl; a.hidden = false; }
}

/* ---------------- RSVP via WhatsApp ---------------- */
function initRsvp() {
  const form = $('#rsvpForm'), out = $('#guestCount');
  let n = 2;
  $$('[data-step]', form).forEach(b => b.addEventListener('click', () => {
    n = Math.max(1, Math.min(20, n + Number(b.dataset.step)));
    out.textContent = n;
  }));
  form.addEventListener('change', () => form.classList.toggle('declined', form.attend.value === 'no'));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim();
    if (!name) { form.name.focus(); toast('Please add your name 🙂'); return; }
    const yes = form.attend.value === 'yes';
    const evs = $$('input[name="events"]:checked', form).map(i => i.value);
    const msg = form.msg.value.trim();
    let text = `💛 RSVP — ${CONFIG.couple}'s wedding (28 Feb 2027)\n\nName: ${name}\n`;
    text += yes ? `Attending: Yes 🎉\nGuests: ${n}\nCelebrations: ${evs.join(', ') || '—'}\n` : `Attending: Sorry, can't make it 🙏\n`;
    if (msg) text += `\nBlessings: ${msg}\n`;
    const url = `https://wa.me/${CONFIG.rsvpWhatsApp}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
  });
}

/* ---------------- Share ---------------- */
function toast(t) {
  const el = $('#toast');
  el.textContent = t;
  el.classList.add('show');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => el.classList.remove('show'), 2400);
}
$('#shareBtn').addEventListener('click', async () => {
  const url = location.origin + location.pathname;
  const data = { title: `${CONFIG.couple} · Wedding`, text: `You're invited to the wedding of ${CONFIG.couple} on 28 February 2027 💛`, url };
  if (navigator.share) {
    try { await navigator.share(data); } catch { /* cancelled */ }
    return;
  }
  try { await navigator.clipboard.writeText(url); toast('Link copied ✨'); }
  catch { window.open(`https://wa.me/?text=${encodeURIComponent(data.text + '\n' + url)}`, '_blank', 'noopener'); }
});

/* ---------------- Dock highlight ---------------- */
function initDock() {
  const links = $$('.dock a');
  const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const extra = { invite: 'home', story: 'date', venue: 'rsvp' };
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const id = map.has(en.target.id) ? en.target.id : extra[en.target.id];
      links.forEach(a => a.classList.toggle('active', a === map.get(id)));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main > section').forEach(s => io.observe(s));
}

/* ---------------- Scroll reveal fallback ---------------- */
function initReveal() {
  const native = CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
  if (native || reduceMotion || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('io-reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  $$('.reveal').forEach(el => io.observe(el));
}

/* ---------------- Boot ---------------- */
buildToran();
buildMandala();
buildKalash();
buildNightSky();
buildPhotos();
initReveal();
initScratch();
initCountdown();
initVenue();
initRsvp();
initDock();
$('#openBtn').focus({ preventScroll: true });
