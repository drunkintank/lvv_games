'use strict';
/* Office Sniper — LVV Games. Throw paper balls through a moving obstacle into the bin,
   annoy the boss by hitting the target on his bald spot, smash the office with the tape bomb. */
const $ = id => document.getElementById(id);
const rand = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.random() * a.length | 0];
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, k) => a + (b - a) * k;

// ---------- language ----------
const I18N = {
  ru: {
    title: 'Офисный снайпер', titleHtml: 'Офисный<br>снайпер',
    intro: 'Рабочий день тянется вечно. Скомкай отчёт и закинь его в корзину — через стеклянные перегородки, флипчарты, лампы и голубей. Только не разбуди шефа.',
    r1h: 'Корзина', r1: 'Веди пальцем: пунктир покажет полёт с учётом ветра и оборвётся там, где шарик во что-то врежется. Отпусти — бросок.',
    zone: { ok: 'до корзины', short: 'ближний бросок', long: 'перелёт' },
    r2h: 'Лысина шефа', r2: 'Попади шефу в лысину — получишь очки. Но шеф злится.',
    r3h: 'Разнос', r3: 'Серия попаданий заряжает скотч-бомбу: она пробивает преграды и крушит офис.',
    start: 'В бой', best: n => `Рекорд: ${n}`, score: 'Очки', bestShort: n => `рекорд ${n}`,
    wind: 'Ветер', calm: 'штиль', pause: 'Пауза', resume: 'Продолжить', menu: 'Меню',
    coach: 'Свайпни вверх в сторону корзины',
    smash: 'РАЗ-<br>НОС', smashArmed: 'ГОТОВ',
    pu: { calm: 'Штиль', aim: 'Аимлок', freeze: 'Стоп', fan: 'Веер' },
    effCalm: n => `Штиль ×${n}`, effAim: n => `Аимлок ×${n}`, effFreeze: n => `Стоп ×${n}`, effFan: 'Веер готов', effHeavy: 'Скотч-бомба готова',
    noCoins: 'Не хватает монет', bought: 'Куплено',
    clean: 'ЧИСТО!', rim: 'С ДУЖКИ', bull: 'В ЯБЛОЧКО!', head: 'ПО ЛЫСИНЕ', miss: 'МИМО', bonus: 'ПРЕМИЯ!',
    smashHit: 'РАЗНОС!', smashGlass: 'ВДРЕБЕЗГИ', newLoc: 'Новая локация', life: '+1 жизнь', loop: n => `Круг ${n}: ветер сильнее`,
    rageT: 'ШЕФ В ЯРОСТИ', rageS: 'Ответка прилетела: −1 жизнь',
    over: 'Уволен!', overText: (loc) => `Дошёл до локации «${loc}».`, again: 'Ещё раз', share: 'Поделиться', copied: 'Ссылка скопирована',
    newBest: 'Новый рекорд!', sBaskets: 'Корзина', sHeads: 'Лысина', sBroke: 'Разбито',
    shareText: n => `Мой рекорд в «Офисном снайпере»: ${n}. Побьёшь?`,
    friendsH: 'Рекорды друзей', player: 'Игрок', friendsEmpty: 'Поделись результатом с друзьями — их рекорды появятся здесь.',
    target: (n, s) => `Цель: ${n} — ${s}`, targetDone: n => `${n} позади!`, beat: n => `${n} позади! Рекорд друга побит.`,
    boss: ['Эй!', 'Кто это?!', 'Я всё вижу!', 'Ещё раз — и встану!', 'Мой отчёт!', 'Совещание через 5 минут!', 'Это что, бумага?!', 'Лишу премии!'],
    bossLook: ['Так-так…', 'Работаем?', 'Хм…'],
    locs: ['Опенспейс', 'Переговорка', 'Кухня', 'Склад', 'Крыша'],
  },
  en: {
    title: 'Office Sniper', titleHtml: 'Office<br>sniper',
    intro: 'The workday drags on forever. Crumple the report and land it in the bin — past glass walls, flipcharts, lamps and pigeons. Just don’t wake the boss.',
    r1h: 'The bin', r1: 'Drag your finger: the dotted line shows the flight with wind and stops where the ball would hit something. Let go to throw.',
    zone: { ok: 'to the bin', short: 'short lob', long: 'overshoot' },
    r2h: 'Boss’s bald spot', r2: 'Hit the boss’s bald spot for points. But he gets angry.',
    r3h: 'Smash', r3: 'A streak charges the tape bomb: it breaks through obstacles and wrecks the office.',
    start: 'Let’s go', best: n => `Best: ${n}`, score: 'Score', bestShort: n => `best ${n}`,
    wind: 'Wind', calm: 'calm', pause: 'Paused', resume: 'Resume', menu: 'Menu',
    coach: 'Swipe up toward the bin',
    smash: 'SMA-<br>SH', smashArmed: 'READY',
    pu: { calm: 'Calm', aim: 'Aim lock', freeze: 'Freeze', fan: 'Fan' },
    effCalm: n => `Calm ×${n}`, effAim: n => `Aim lock ×${n}`, effFreeze: n => `Freeze ×${n}`, effFan: 'Fan ready', effHeavy: 'Tape bomb ready',
    noCoins: 'Not enough coins', bought: 'Bought',
    clean: 'CLEAN!', rim: 'OFF THE RIM', bull: 'BULLSEYE!', head: 'BALD SPOT', miss: 'MISS', bonus: 'BONUS!',
    smashHit: 'SMASH!', smashGlass: 'SHATTERED', newLoc: 'New location', life: '+1 life', loop: n => `Lap ${n}: stronger wind`,
    rageT: 'BOSS IS FURIOUS', rageS: 'He threw it back: −1 life',
    over: 'Fired!', overText: (loc) => `You made it to “${loc}”.`, again: 'Again', share: 'Share', copied: 'Link copied',
    newBest: 'New record!', sBaskets: 'Baskets', sHeads: 'Bald hits', sBroke: 'Smashed',
    shareText: n => `My Office Sniper record is ${n} points. Can you beat it?`,
    friendsH: 'Friends\' records', player: 'Player', friendsEmpty: 'Share your result with friends — their records will show up here.',
    target: (n, s) => `Target: ${n} — ${s}`, targetDone: n => `${n} is behind you!`, beat: n => `${n} is behind you! Friend\'s record beaten.`,
    boss: ['Hey!', 'Who did that?!', 'I see everything!', 'Once more and I stand up!', 'My report!', 'Meeting in 5 minutes!', 'Is that paper?!', 'No bonus for you!'],
    bossLook: ['Well, well…', 'Working hard?', 'Hmm…'],
    locs: ['Open space', 'Meeting room', 'Kitchen', 'Warehouse', 'Rooftop'],
  },
};
const pickLang = code => String(code || '').toLowerCase().startsWith('ru') ? 'ru' : 'en';
let LANG = pickLang(navigator.language), L = I18N[LANG];

// ---------- Telegram ----------
const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
const tgv = v => { try { return !!tg && tg.isVersionAtLeast(v); } catch (e) { return false; } };
const inTelegram = !!(tg && tg.initData);
// After /newapp in @BotFather (short name "office") this link opens the game directly.
const TG_APP_LINK = 'https://t.me/lvv_game/office';
const CLOUD_KEYS = ['office.best', 'office.coins', 'office.pu', 'office.muted', 'office.coached', 'arena.lang', 'office.friends', 'arena.uid'];
const cloudOK = inTelegram && tgv('6.9');
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) {
    try { localStorage.setItem(k, v); } catch (e) {}
    if (cloudOK && CLOUD_KEYS.includes(k)) try { tg.CloudStorage.setItem(k, String(v)); } catch (e) {}
  },
};
let cloudInit = Promise.resolve();
if (tg) {
  try { tg.ready(); tg.expand(); } catch (e) {}
  if (tgv('7.7')) try { tg.disableVerticalSwipes(); } catch (e) {} // swiping up to throw must not close the app
  if (tgv('6.1')) try { tg.setHeaderColor('#10122a'); tg.setBackgroundColor('#10122a'); } catch (e) {}
  if (tgv('6.1') && /[?&]from=hub\b/.test(location.search)) try { tg.BackButton.show(); tg.BackButton.onClick(() => { location.href = '../'; }); } catch (e) {}
  const u = tg.initDataUnsafe && tg.initDataUnsafe.user;
  if (u && u.language_code) LANG = pickLang(u.language_code);
  if (cloudOK) cloudInit = new Promise(res => {
    try {
      tg.CloudStorage.getItems(CLOUD_KEYS, (err, vals) => {
        if (!err && vals) for (const k of CLOUD_KEYS) if (vals[k]) try { localStorage.setItem(k, vals[k]); } catch (e) {}
        res();
      });
    } catch (e) { res(); }
    setTimeout(res, 1500);
  });
  if (tgv('8.0')) ['activated', 'deactivated'].forEach(ev => { try { tg.onEvent(ev, () => onFocusChange(ev === 'deactivated')); } catch (e) {} });
}
const haptic = kind => {
  if (!tgv('6.1')) return;
  try { const h = tg.HapticFeedback; if (kind === 'error' || kind === 'success' || kind === 'warning') h.notificationOccurred(kind); else h.impactOccurred(kind); } catch (e) {}
};

// ---------- sound (all synthesized) ----------
let actx = null, muted = false;
function ac() {
  if (muted) return null;
  if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
  if (actx.state === 'suspended') actx.resume().catch(() => {});
  return actx;
}
function tone(freq, dur, type = 'sine', vol = .2, slide = 0, delay = 0) {
  const a = ac(); if (!a) return;
  const t = a.currentTime + delay, o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
  o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + .02);
}
let noiseBuf = null;
function noise(dur, vol = .2, hp = 600, lp = 8000, delay = 0) {
  const a = ac(); if (!a) return;
  if (!noiseBuf) { noiseBuf = a.createBuffer(1, a.sampleRate, a.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
  const t = a.currentTime + delay, s = a.createBufferSource(), g = a.createGain(), h = a.createBiquadFilter(), l = a.createBiquadFilter();
  s.buffer = noiseBuf; h.type = 'highpass'; h.frequency.value = hp; l.type = 'lowpass'; l.frequency.value = lp;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
  s.connect(h).connect(l).connect(g).connect(a.destination); s.start(t, Math.random() * .5); s.stop(t + dur + .02);
}
const SFX = {
  throw() { noise(.22, .14, 1200, 5000); },
  bin() { tone(150, .18, 'sine', .35, -70); noise(.1, .18, 200, 1500); },
  rim() { tone(1250, .3, 'triangle', .1); tone(1870, .22, 'sine', .05); },
  thud() { tone(95, .12, 'sine', .25, -40); noise(.05, .08, 300, 1200); },
  glass() { for (let i = 0; i < 7; i++) noise(.16, .16, 2500, 12000, i * .035); tone(2400, .4, 'sine', .04, -800); },
  smash() { noise(.45, .35, 80, 2500); tone(70, .4, 'sine', .4, -30); },
  coin() { tone(988, .07, 'square', .05); tone(1480, .12, 'square', .05, 0, .06); },
  boss() { tone(170, .28, 'sawtooth', .1, -60); tone(120, .3, 'square', .04, -40, .05); },
  rage() { tone(100, .7, 'sawtooth', .16, 120); noise(.5, .1, 100, 900); },
  splat() { noise(.35, .35, 100, 1800); tone(80, .3, 'sine', .3, -40); },
  level() { [523, 659, 784, 1047].forEach((f, i) => tone(f, .16, 'triangle', .12, 0, i * .09)); },
  miss() { tone(260, .3, 'triangle', .12, -140); },
  click() { tone(660, .05, 'square', .04); },
};

// ---------- canvas + projection ----------
const cv = $('game'); let ctx = cv.getContext('2d'); let bgDirty = true;
let W = 0, H = 0, DPR = 1, F = 600, HY = 300;
const CAMY = 1.45, RW = 2.0, CEIL = 3.0, ZB = 7.5, Z0 = 0.9, Y0 = 1.02, TH = 52 * Math.PI / 180, G = 9.8, BIN_H = 0.6;
function resize() {
  // never zero: a 0-size canvas makes drawImage throw and would stop the frame loop (Telegram webviews can report 0 while opening)
  W = Math.max(1, innerWidth); H = Math.max(1, innerHeight); DPR = Math.min(2, devicePixelRatio || 1);
  cv.width = W * DPR | 0; cv.height = H * DPR | 0;
  F = Math.min(W * 1.2, H * 0.7);
  HY = H * 0.41;
  bgDirty = true;
}
function P(x, y, z) { z = Math.max(z, .12); const s = F / z; return [W / 2 + x * s, HY - (y - CAMY) * s, s]; }
function path(pts) { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); }
function poly3(pts, fill, stroke, lw = 1) {
  path(pts.map(p => P(p[0], p[1], p[2])));
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
}
// a rectangle standing in the plane z
function face(x0, x1, y0, y1, z, fill, stroke, lw) { poly3([[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]], fill, stroke, lw); }
// axis-aligned box: only faces the camera can see, back to front
function box(x0, x1, y0, y1, z0, z1, c) {
  if (x0 > 0) poly3([[x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1]], c.s);
  if (x1 < 0) poly3([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], c.s);
  if (y1 < CAMY) poly3([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], c.t);
  else if (y0 > CAMY) poly3([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], c.b || c.s);
  face(x0, x1, y0, y1, z0, c.f);
}
function hex(c) { c = c.replace('#', ''); if (c.length === 3) c = c.split('').map(x => x + x).join(''); const n = parseInt(c, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function sh(c, k) { const [r, g, b] = hex(c); const f = v => clamp(Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k), 0, 255); return `rgb(${f(r)},${f(g)},${f(b)})`; }
const tint = c => ({ f: c, t: sh(c, .18), s: sh(c, -.22), b: sh(c, -.35) });
function sphere(x, y, z, r, c1, c2) {
  const [sx, sy, s] = P(x, y, z), R = r * s;
  const g = ctx.createRadialGradient(sx - R * .35, sy - R * .4, R * .1, sx, sy, R);
  g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx, sy, R, 0, 7); ctx.fill();
  return [sx, sy, R];
}
// circle lying flat at height y (projected as a polygon, so perspective is exact)
function ring(cx, y, cz, R, a0 = 0, a1 = Math.PI * 2, n = 28) {
  const pts = [];
  for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; pts.push(P(cx + Math.cos(a) * R, y, cz + Math.sin(a) * R)); }
  return pts;
}
function lineTo3(a, b, color, lw) {
  const p = P(...a), q = P(...b);
  ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
}

// ---------- props ----------
// every prop: { t:type, x, z, ...}; breakables carry hit:{x,y,z,r} and shard colors
const PROPS = {
  desk(o) {
    const { x, z, w = 1.3, d = .7, c = '#c9a77c' } = o, cc = tint(c), leg = tint('#5b5f6b');
    for (const lx of [x - w / 2 + .04, x + w / 2 - .08]) for (const lz of [z + d / 2 - .06, z - d / 2 + .02]) box(lx, lx + .04, 0, .72, lz, lz + .04, leg);
    box(x - w / 2, x + w / 2, .72, .76, z - d / 2, z + d / 2, cc);
  },
  table(o) { PROPS.desk({ ...o, c: o.c || '#8b5a3c' }); },
  cabinet(o) {
    const { x, z, w = .5, h = 1.1, c = '#8d96a6' } = o, cc = tint(c);
    box(x - w / 2, x + w / 2, 0, h, z - .3, z + .3, cc);
    for (let i = 1; i < 3; i++) { const y = h * i / 3; lineTo3([x - w / 2, y, z - .3], [x + w / 2, y, z - .3], sh(c, -.4), 1.5); }
    for (let i = 0; i < 3; i++) { const y = h * (i + .5) / 3; face(x - .07, x + .07, y - .015, y + .015, z - .301, '#3b3f48'); }
  },
  monitor(o) {
    const { x, z, y = .76, back = true } = o;
    box(x - .04, x + .04, y, y + .1, z - .02, z + .02, tint('#2a2d36'));
    box(x - .3, x + .3, y + .1, y + .45, z - .03, z + .03, tint('#262a34'));
    if (!back) { face(x - .27, x + .27, y + .13, y + .42, z - .031, '#4fa9e8'); face(x - .27, x + .05, y + .3, y + .42, z - .032, 'rgba(255,255,255,.25)'); }
    else face(x - .05, x + .05, y + .2, y + .3, z - .031, '#3a3f4c');
  },
  mug(o) {
    const { x, z, y = .76, c = '#ff6b6b' } = o;
    box(x - .06, x + .06, y, y + .14, z - .06, z + .06, tint(c));
    poly3(ring(x, y + .14, z, .06), '#3a2416');
    face(x + .06, x + .1, y + .03, y + .1, z, null, sh(c, -.2), 3);
  },
  plant(o) {
    const { x, z, y = 0, s = 1 } = o;
    poly3([[x - .2 * s, y, z], [x + .2 * s, y, z], [x + .25 * s, y + .38 * s, z], [x - .25 * s, y + .38 * s, z]], '#c96f3c');
    face(x - .27 * s, x + .27 * s, y + .34 * s, y + .42 * s, z - .001, '#b55f30');
    const L = [[0, .75, .26], [-.2, .62, .2], [.2, .6, .2], [-.1, .9, .18], [.12, .88, .17], [0, 1.02, .14]];
    for (const [dx, dy, r] of L) sphere(x + dx * s, y + dy * s, z - .01, r * s, '#7fd36b', '#2f7a3a');
  },
  cooler(o) {
    const { x, z } = o;
    box(x - .2, x + .2, 0, .95, z - .2, z + .2, tint('#e9eef3'));
    face(x - .08, x + .08, .6, .7, z - .201, '#3f86c8');
    const [sx, sy, s] = P(x, 1.27, z);
    ctx.fillStyle = 'rgba(110,190,255,.75)'; ctx.beginPath(); ctx.ellipse(sx, sy, .19 * s, .3 * s, 0, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.beginPath(); ctx.ellipse(sx - .08 * s, sy - .08 * s, .04 * s, .16 * s, 0, 0, 7); ctx.fill();
  },
  trophy(o) {
    const { x, z, y = .76 } = o;
    box(x - .1, x + .1, y, y + .06, z - .1, z + .1, tint('#4b3426'));
    box(x - .025, x + .025, y + .06, y + .2, z - .02, z + .02, tint('#d6a632'));
    sphere(x, y + .3, z, .13, '#fff2a8', '#c48e14');
  },
  boxes(o) {
    const { x, z, n = 2, w = .6, c = '#c99a5e' } = o;
    for (let i = 0; i < n; i++) {
      const y = i * w * .85, dx = (i % 2 ? .06 : -.04);
      box(x - w / 2 + dx, x + w / 2 + dx, y, y + w * .85, z - w / 2, z + w / 2, tint(c));
      face(x - .06 + dx, x + .06 + dx, y, y + w * .85, z - w / 2 - .001, 'rgba(240,220,170,.6)');
    }
  },
  shelf(o) {
    const { x, z, w = 1.6, h = 2.6 } = o, frame = tint('#e07a2e');
    for (const lx of [x - w / 2, x + w / 2 - .06]) box(lx, lx + .06, 0, h, z - .3, z - .24, frame);
    for (let i = 0; i < 4; i++) {
      const y = .05 + i * h / 4;
      box(x - w / 2, x + w / 2, y, y + .05, z - .3, z + .3, tint('#3f6aa8'));
      if (i < 3) for (let j = 0; j < 3; j++) { const bx = x - w / 2 + .1 + j * w / 3; box(bx, bx + w / 3 - .15, y + .05, y + .05 + h / 4 * .7, z - .2, z + .25, tint(j % 2 ? '#c99a5e' : '#b98a50')); }
    }
  },
  fridge(o) {
    const { x, z } = o;
    box(x - .35, x + .35, 0, 1.9, z - .35, z + .35, tint('#e8ecef'));
    lineTo3([x - .35, 1.25, z - .351], [x + .35, 1.25, z - .351], '#b8bfc6', 2);
    face(x + .22, x + .26, 1.35, 1.7, z - .352, '#9aa3ad'); face(x + .22, x + .26, .8, 1.15, z - .352, '#9aa3ad');
  },
  coffee(o) {
    const { x, z, y = .8 } = o;
    box(x - .17, x + .17, y, y + .42, z - .17, z + .17, tint('#2b2b33'));
    face(x - .1, x + .1, y + .25, y + .36, z - .171, '#ff8a3d');
    box(x - .05, x + .05, y + .02, y + .12, z - .25, z - .17, tint('#f2f2f2'));
  },
  microwave(o) {
    const { x, z, y = .8 } = o;
    box(x - .3, x + .3, y, y + .32, z - .2, z + .2, tint('#d4d8dd'));
    face(x - .26, x + .1, y + .05, y + .27, z - .201, '#252a33');
    face(x + .14, x + .26, y + .2, y + .26, z - .201, '#4fe08a');
  },
  barrel(o) {
    const { x, z, c = '#2f6fd0' } = o;
    const top = ring(x, 1.0, z, .3), bot = ring(x, 0, z, .3);
    path([...top.slice(14), ...bot.slice(14).reverse()]); ctx.fillStyle = c; ctx.fill();
    path(top); ctx.fillStyle = sh(c, .25); ctx.fill();
    for (const y of [.3, .7]) { const r = ring(x, y, z, .305, Math.PI, Math.PI * 2, 14); ctx.strokeStyle = sh(c, -.35); ctx.lineWidth = 2; ctx.beginPath(); r.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); }
  },
  dish(o) {
    const { x, z } = o;
    box(x - .03, x + .03, 0, .9, z - .03, z + .03, tint('#9aa3ad'));
    const [sx, sy, s] = P(x, 1.15, z);
    ctx.fillStyle = '#e9eef3'; ctx.beginPath(); ctx.ellipse(sx, sy, .4 * s, .32 * s, -.4, 0, 7); ctx.fill();
    ctx.strokeStyle = '#9aa3ad'; ctx.lineWidth = Math.max(1, .02 * s); ctx.stroke();
    ctx.fillStyle = '#c4ccd4'; ctx.beginPath(); ctx.ellipse(sx, sy, .25 * s, .2 * s, -.4, 0, 7); ctx.fill();
  },
  vent(o) {
    const { x, z, h = 1.0 } = o;
    box(x - .35, x + .35, 0, h, z - .35, z + .35, tint('#a3abb3'));
    for (let i = 1; i < 5; i++) lineTo3([x - .3, h * i / 5, z - .351], [x + .3, h * i / 5, z - .351], '#7a838c', 2);
  },
  chair(o) {
    const { x, z, c = '#3d4150' } = o;
    box(x - .02, x + .02, 0, .45, z - .02, z + .02, tint('#2a2d36'));
    box(x - .24, x + .24, .45, .52, z - .22, z + .22, tint(c));
    box(x - .23, x + .23, .52, 1.0, z + .2, z + .25, tint(c));
  },
  sofa(o) {
    const { x, z, w = 1.6, c = '#5b6fa8' } = o, cc = tint(c);
    box(x - w / 2, x + w / 2, 0, .45, z - .4, z + .4, cc);
    box(x - w / 2, x + w / 2, .45, .9, z + .25, z + .4, cc);
    box(x - w / 2, x - w / 2 + .15, .45, .65, z - .4, z + .25, cc); box(x + w / 2 - .15, x + w / 2, .45, .65, z - .4, z + .25, cc);
  },
  pot(o) { PROPS.plant({ ...o, s: .7 }); },
};

// ---------- locations ----------
// cy (height of the passage in the obstacle) is derived from the bin, so the opening always sits on a good arc
const LOCS = [
  { // open space
    wall: '#dfe6ee', side: '#cbd5e1', floor: '#3d5a8c', floor2: '#36507e', ceil: '#eef2f6', pattern: 'carpet',
    binZ: 4.6, binX: .7, binC: '#8f99a8', mesh: true, wind: 1.6, obst: 'glass', oz: 3.0, gust: 0,
    boss: { x: -.6, z: 2.25 }, env: 'ac',
    wallDecor: [{ t: 'window', x0: -1.9, x1: -.4, y0: 1.0, y1: 2.4 }, { t: 'window', x0: .3, x1: 1.8, y0: 1.0, y1: 2.4 }, { t: 'clock', x: -.05, y: 2.55 }],
    props: [
      { t: 'desk', x: 1.75, z: 3.9 }, { t: 'monitor', x: 1.75, z: 4.05, back: false, brk: 1, hit: [1.75, 1.05, 4.05, .32], col: '#262a34' },
      { t: 'mug', x: 1.35, z: 3.75, brk: 1, hit: [1.35, .85, 3.75, .2], col: '#ff6b6b' },
      { t: 'chair', x: 1.75, z: 3.3 },
      { t: 'cooler', x: -2.15, z: 4.4, brk: 1, hit: [-2.15, 1.15, 4.4, .38], col: '#6ebeff' },
      { t: 'plant', x: 2.15, z: 6.0, brk: 1, hit: [2.15, .7, 6.0, .4], col: '#4caf50' },
      { t: 'cabinet', x: -2.1, z: 6.6 }, { t: 'cabinet', x: -1.55, z: 6.6 },
      { t: 'desk', x: -.2, z: 7.6, w: 1.6 }, { t: 'monitor', x: -.2, z: 7.75, back: false },
    ],
  },
  { // meeting room
    wall: '#ece3d4', side: '#dccfb9', floor: '#9a6a45', floor2: '#8a5d3c', ceil: '#f4efe6', pattern: 'parquet',
    binZ: 5.0, binX: .75, binC: '#2f3542', wind: 2.0, obst: 'flip', oz: 3.15, gust: 0,
    boss: { x: .6, z: 2.3 }, env: 'ac',
    wallDecor: [{ t: 'screen', x0: -1.3, x1: 1.3, y0: 1.1, y1: 2.5 }, { t: 'clock', x: 1.9, y: 2.4 }],
    props: [
      { t: 'table', x: -1.85, z: 4.6, w: 1.0, d: 1.6, c: '#6a4430' },
      { t: 'trophy', x: -1.85, z: 4.3, brk: 1, hit: [-1.85, 1.05, 4.3, .3], col: '#e8b730' },
      { t: 'trophy', x: -1.85, z: 5.0, brk: 1, hit: [-1.85, 1.05, 5.0, .3], col: '#e8b730' },
      { t: 'plant', x: 2.15, z: 5.4, brk: 1, hit: [2.15, .7, 5.4, .4], col: '#4caf50' },
      { t: 'sofa', x: 1.4, z: 7.8 },
      { t: 'cooler', x: -2.15, z: 7.0, brk: 1, hit: [-2.15, 1.15, 7.0, .38], col: '#6ebeff' },
    ],
  },
  { // kitchen
    wall: '#d4efe4', side: '#bfe3d5', floor: '#d9d2c4', floor2: '#a9a092', ceil: '#f2f7f5', pattern: 'checker',
    binZ: 4.8, binX: .7, binC: '#3fa66b', wind: 2.4, obst: 'kitchen', oz: 2.95, gust: 0,
    boss: { x: -.6, z: 2.2 }, env: 'hood',
    wallDecor: [{ t: 'window', x0: -.8, x1: .8, y0: 1.2, y1: 2.3 }, { t: 'tiles', y0: .9, y1: 1.6 }],
    props: [
      { t: 'fridge', x: 2.1, z: 6.8 },
      { t: 'coffee', x: 1.9, z: 4.6, y: .9, brk: 1, hit: [1.9, 1.1, 4.6, .32], col: '#2b2b33' },
      { t: 'desk', x: 1.9, z: 4.7, w: .9, d: .7, c: '#e6e1d8' },
      { t: 'microwave', x: -2.0, z: 5.3, y: .9, brk: 1, hit: [-2.0, 1.05, 5.3, .35], col: '#d4d8dd' },
      { t: 'desk', x: -2.0, z: 5.3, w: .9, d: .7, c: '#e6e1d8' },
      { t: 'pot', x: -.9, z: 7.9 },
    ],
  },
  { // warehouse
    wall: '#a7b0b9', side: '#97a0aa', floor: '#80858b', floor2: '#6f747a', ceil: '#5c636b', pattern: 'concrete',
    binZ: 5.3, binX: .75, binC: '#2f6fd0', wind: 2.8, obst: 'conveyor', oz: 3.25, gust: .15,
    boss: { x: .6, z: 2.35 }, env: 'fan',
    wallDecor: [{ t: 'door', x0: -1.2, x1: 1.2, y0: 0, y1: 2.6 }],
    props: [
      { t: 'shelf', x: -1.75, z: 7.5 }, { t: 'shelf', x: 1.75, z: 7.5 },
      { t: 'boxes', x: -2.0, z: 4.6, n: 3, brk: 1, hit: [-2.0, .9, 4.6, .55], col: '#c99a5e' },
      { t: 'boxes', x: 2.0, z: 5.2, n: 2, brk: 1, hit: [2.0, .6, 5.2, .5], col: '#c99a5e' },
      { t: 'barrel', x: -1.2, z: 6.3, c: '#d64545', brk: 1, hit: [-1.2, .6, 6.3, .4], col: '#d64545' },
    ],
  },
  { // rooftop
    outdoor: true, floor: '#6c6863', floor2: '#5d5a56', pattern: 'gravel',
    binZ: 5.5, binX: .8, binC: '#ff8a3d', wind: 3.3, obst: 'roof', oz: 3.35, gust: .45,
    boss: { x: -.6, z: 2.4 }, env: 'sky',
    props: [
      { t: 'dish', x: 2.1, z: 5.0, brk: 1, hit: [2.1, 1.1, 5.0, .45], col: '#e9eef3' },
      { t: 'vent', x: -2.0, z: 6.6 },
      { t: 'pot', x: -2.1, z: 4.4, brk: 1, hit: [-2.1, .5, 4.4, .35], col: '#c96f3c' },
      { t: 'pot', x: 2.2, z: 7.4, brk: 1, hit: [2.2, .5, 7.4, .35], col: '#c96f3c' },
    ],
  },
];

// ---------- trajectory helpers ----------
const needV = (D, drop) => Math.sqrt(G * D * D / (2 * Math.cos(TH) ** 2 * (D * Math.tan(TH) + drop)));
function yAt(z) {
  const D = S.bin.z - Z0, v = needV(D, Y0 - BIN_H), d = z - Z0;
  return Y0 + d * Math.tan(TH) - G * d * d / (2 * v * v * Math.cos(TH) ** 2);
}
let seed = 1; const srand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

// ---------- room background (pre-rendered once per location / resize) ----------
const bg = document.createElement('canvas');
function drawWallDecor(d, z) {
  if (d.t === 'window') {
    face(d.x0, d.x1, d.y0, d.y1, z, '#f4f7fa');
    const g = ctx.createLinearGradient(0, P(0, d.y1, z)[1], 0, P(0, d.y0, z)[1]);
    g.addColorStop(0, '#7cc4ef'); g.addColorStop(1, '#cfeaf7');
    face(d.x0 + .06, d.x1 - .06, d.y0 + .06, d.y1 - .06, z, g);
    seed = 7; for (let x = d.x0 + .08; x < d.x1 - .2; x += .22) { const h = .15 + srand() * .5; face(x, x + .18, d.y0 + .06, d.y0 + .06 + h, z, 'rgba(90,120,160,.45)'); }
    const mx = (d.x0 + d.x1) / 2; face(mx - .025, mx + .025, d.y0, d.y1, z, '#f4f7fa');
  } else if (d.t === 'clock') {
    const [sx, sy, s] = P(d.x, d.y, z); const R = .2 * s;
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#2b2f3a'; ctx.lineWidth = .03 * s; ctx.beginPath(); ctx.arc(sx, sy, R, 0, 7); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx, sy - R * .7); ctx.moveTo(sx, sy); ctx.lineTo(sx + R * .5, sy + R * .2); ctx.stroke();
  } else if (d.t === 'screen') {
    face(d.x0, d.x1, d.y0, d.y1, z, '#fbfbfb', '#9aa3ad', 2);
    const bars = [.3, .55, .45, .8, .65];
    bars.forEach((h, i) => { const x = d.x0 + .3 + i * .42; face(x, x + .26, d.y0 + .15, d.y0 + .15 + h * (d.y1 - d.y0 - .4), z, i === 3 ? '#ff8a3d' : '#5fa8ff'); });
  } else if (d.t === 'tiles') {
    for (let x = -RW; x < RW; x += .3) for (let y = d.y0; y < d.y1; y += .3) face(x + .01, x + .29, y + .01, y + .29, z, (Math.round(x / .3 + y / .3) % 2) ? '#e8f7f1' : '#c4e8da');
  } else if (d.t === 'door') {
    face(d.x0, d.x1, d.y0, d.y1, z, '#7d8792');
    for (let y = .2; y < d.y1; y += .25) face(d.x0, d.x1, y, y + .03, z, '#6b747e');
    face(d.x0, d.x0 + .12, d.y0, d.y1, z, '#f2c94c'); face(d.x1 - .12, d.x1, d.y0, d.y1, z, '#f2c94c');
  }
}
function renderBg() {
  bg.width = cv.width; bg.height = cv.height;
  const main = ctx; ctx = bg.getContext('2d'); ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const Lc = LOC();
  if (Lc.outdoor) {
    const g = ctx.createLinearGradient(0, 0, 0, HY + 40); g.addColorStop(0, '#5fb3ee'); g.addColorStop(1, '#ffe2b8');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255,240,190,.9)'; ctx.beginPath(); ctx.arc(W * .78, HY - H * .2, H * .05, 0, 7); ctx.fill();
    seed = 3;
    for (let i = 0; i < 4; i++) { const x = srand() * W, y = HY - H * (.12 + srand() * .2); ctx.fillStyle = 'rgba(255,255,255,.75)'; for (let j = 0; j < 4; j++) { ctx.beginPath(); ctx.arc(x + j * 22, y + (j % 2) * 6, 18 + srand() * 10, 0, 7); ctx.fill(); } }
    for (let layer = 0; layer < 2; layer++) {
      const zz = layer ? 26 : 40;
      for (let x = -40; x < 40; x += 2 + srand() * 3) {
        const w = 2 + srand() * 3, h = -18 + srand() * (layer ? 26 : 34);
        face(x, x + w, -30, h, zz, layer ? '#7d8fb3' : '#a7b5cf');
        if (layer) for (let wy = -28; wy < h - 1; wy += 2.2) face(x + .5, x + w - .5, wy, wy + .9, zz - .01, 'rgba(255,240,180,.25)');
      }
    }
    poly3([[-5, 0, .3], [5, 0, .3], [5, 0, ZB + .3], [-5, 0, ZB + .3]], Lc.floor);
    for (let i = 0; i < 260; i++) { const x = (srand() * 2 - 1) * 4, z = .8 + srand() * ZB; const [sx, sy, s] = P(x, 0, z); ctx.fillStyle = srand() < .5 ? Lc.floor2 : '#7c7873'; ctx.fillRect(sx, sy, Math.max(1, .05 * s), Math.max(1, .025 * s)); }
    box(-5, 5, 0, .7, ZB, ZB + .3, tint('#b5a597'));
    box(-5, -3.9, 0, .7, .3, ZB, tint('#b5a597')); box(3.9, 5, 0, .7, .3, ZB, tint('#b5a597'));
  } else {
    poly3([[-RW, CEIL, .2], [RW, CEIL, .2], [RW, CEIL, ZB], [-RW, CEIL, ZB]], Lc.ceil);
    for (let z = 2; z < ZB; z += 2.2) for (const x of [-1.1, .5]) poly3([[x, CEIL - .001, z], [x + .6, CEIL - .001, z], [x + .6, CEIL - .001, z + 1.1], [x, CEIL - .001, z + 1.1]], 'rgba(255,255,255,.95)');
    face(-RW, RW, 0, CEIL, ZB, Lc.wall);
    poly3([[-RW, 0, .2], [-RW, CEIL, .2], [-RW, CEIL, ZB], [-RW, 0, ZB]], Lc.side);
    poly3([[RW, 0, .2], [RW, CEIL, .2], [RW, CEIL, ZB], [RW, 0, ZB]], sh(Lc.side, -.06));
    poly3([[-RW, 0, .2], [RW, 0, .2], [RW, 0, ZB], [-RW, 0, ZB]], Lc.floor);
    ctx.save(); path([P(-RW, 0, .2), P(RW, 0, .2), P(RW, 0, ZB), P(-RW, 0, ZB)]); ctx.clip();
    if (Lc.pattern === 'checker') {
      for (let z = .5; z < ZB; z += .5) for (let x = -RW; x < RW; x += .5) if ((Math.round(x * 2) + Math.round(z * 2)) % 2) poly3([[x, 0, z], [x + .5, 0, z], [x + .5, 0, z + .5], [x, 0, z + .5]], Lc.floor2);
    } else if (Lc.pattern === 'parquet') {
      for (let x = -RW; x < RW; x += .18) lineTo3([x, 0, .2], [x, 0, ZB], Lc.floor2, 1.2);
      for (let z = 1; z < ZB; z += .9) for (let x = -RW; x < RW; x += .36) lineTo3([x + (Math.round(z) % 2) * .18, 0, z], [x + .18 + (Math.round(z) % 2) * .18, 0, z], Lc.floor2, 1);
    } else if (Lc.pattern === 'carpet') {
      for (let z = 1; z < ZB; z += .5) lineTo3([-RW, 0, z], [RW, 0, z], Lc.floor2, 1);
    } else if (Lc.pattern === 'concrete') {
      for (let z = 1; z < ZB; z += 1.5) lineTo3([-RW, 0, z], [RW, 0, z], Lc.floor2, 1.5);
      for (const x of [-1.6, 1.6]) poly3([[x - .06, 0, .2], [x + .06, 0, .2], [x + .06, 0, ZB], [x - .06, 0, ZB]], '#f2c94c');
    }
    ctx.restore();
    face(-RW, RW, 0, .08, ZB - .001, sh(Lc.wall, -.25));
    for (const d of (Lc.wallDecor || [])) drawWallDecor({ ...d, x: d.x * .77, x0: d.x0 * .77, x1: d.x1 * .77 }, ZB - .002);
    // wind source on the wall: AC unit / hood / big fan
    if (Lc.env === 'ac' || Lc.env === 'hood') { box(-RW + .02, -RW + .3, 2.3, 2.65, 3.6, 4.6, tint('#f2f4f7')); }
    if (Lc.env === 'fan') { const [sx, sy, s] = P(-RW + .05, 2.1, 4.5); ctx.fillStyle = '#3b4048'; ctx.beginPath(); ctx.ellipse(sx, sy, .12 * s, .55 * s, 0, 0, 7); ctx.fill(); }
  }
  ctx = main; bgDirty = false;
}

// ---------- obstacles: a plane at z with solid parts ----------
function makeObst(type, z) {
  const o = { type, z, t: rand(0, 10), broken: false };
  const cy = () => yAt(z);
  const top = () => cy() + .45;
  o.parts = () => { // moving pieces as rects {x0,x1,y0,y1} or circles {cx,cy,r}
    const t = o.t, c = cy(), out = [];
    if (type === 'glass') { /* handled as an opening */ }
    if (type === 'flip') { const off = Math.sin(t * .6) * .7; for (const bx of [-1.3, 0, 1.3]) out.push({ x0: bx + off - .34, x1: bx + off + .34, y0: .85, y1: top() }); }
    if (type === 'kitchen') [-.8, 0, .8].forEach((px, i) => { const a = .8 * Math.sin(t * 1.7 + i * 2.1); out.push({ cx: px + Math.sin(a) * .5, cy: top() + .05 - Math.cos(a) * .5, r: .2, px, py: top() + .05 }); });
    if (type === 'conveyor') for (let i = 0; i < 4; i++) { const x = ((t * .7 + i * 1.2) % 4.8 + 4.8) % 4.8 - 2.4; out.push({ x0: x - .3, x1: x + .3, y0: c - .45, y1: c + .32 }); }
    if (type === 'roof') [[-.25, .9, 0], [.12, -.7, 2], [.32, 1.2, 4]].forEach(([dy, sp, ph]) => { const x = ((t * sp * .8 + ph) % 4 + 4) % 4 - 2; out.push({ cx: x, cy: c + dy, r: .16, dir: Math.sign(sp) }); });
    return out;
  };
  o.gap = () => ({ x: Math.sin(o.t * .7) * .9, w: .9 });
  o.solid = (x, y, r) => {
    if (o.broken) return false;
    const c = cy();
    if (type === 'glass') { const g = o.gap(); return y < 2.5 + r && !(Math.abs(x - g.x) < g.w / 2 - r); }
    if (type !== 'roof' && y > top() - r) return true;
    if (type === 'kitchen' && (y < .8 + r || Math.abs(x) > 1.35 - r)) return true;
    if (type === 'roof' && Math.abs(x) > 1.25 - r && y < 2.7) return true;
    for (const p of o.parts()) {
      if (p.r) { if (Math.hypot(x - p.cx, y - p.cy) < p.r + r) return true; }
      else if (x > p.x0 - r && x < p.x1 + r && y > p.y0 - r && y < p.y1 + r) return true;
    }
    return false;
  };
  o.shardColor = { glass: 'rgba(200,235,255,.9)', flip: '#ffffff', kitchen: '#ffd166', conveyor: '#c99a5e', roof: '#9aa3ad' }[type];
  o.draw = () => {
    const c = cy(), parts = o.parts();
    if (type === 'glass') {
      // two sliding glass doors on a ceiling rail; the gap between them drifts left and right
      face(-RW, RW, 2.5, CEIL, z, sh(LOC().wall, -.08));
      box(-RW, RW, 2.5, 2.58, z - .05, z + .05, tint('#c8d0da'));
      if (o.broken) return;
      const g = o.gap(), P0 = [[-RW, g.x - g.w / 2], [g.x + g.w / 2, RW]];
      P0.forEach(([x0, x1], side) => {
        if (x1 - x0 < .05) return;
        face(x0, x1, 0, 2.5, z, 'rgba(190,225,245,.32)');
        face(x0, x1, 1.0, 1.25, z, 'rgba(255,255,255,.5)');
        face(x0, x1, 0, .08, z, '#c8d0da'); face(x0, x1, 2.42, 2.5, z, '#c8d0da');
        face(x0, x0 + .05, 0, 2.5, z, '#c8d0da'); face(x1 - .05, x1, 0, 2.5, z, '#c8d0da');
        const hx = side ? x0 + .12 : x1 - .14; face(hx, hx + .03, .9, 1.35, z, '#8d96a6');
        const [sx, sy, sc] = P(x0 + .25, 2.15, z); ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = Math.max(1.5, .025 * sc);
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + .3 * sc, sy - .3 * sc); ctx.moveTo(sx + .1 * sc, sy + .2 * sc); ctx.lineTo(sx + .45 * sc, sy - .15 * sc); ctx.stroke();
      });
      return;
    }
    if (type === 'flip') {
      face(-RW, RW, top(), CEIL, z, '#2c3140');
      for (let x = -RW + .3; x < RW; x += .3) face(x, x + .02, top(), CEIL, z, '#3a4052');
      if (o.broken) return;
      for (const p of parts) {
        const mx = (p.x0 + p.x1) / 2;
        lineTo3([p.x0 + .1, 0, z], [mx, p.y0, z], '#5b5f6b', 3); lineTo3([p.x1 - .1, 0, z], [mx, p.y0, z], '#5b5f6b', 3);
        face(p.x0, p.x1, p.y0, p.y1, z, '#fafafa', '#9aa3ad', 2);
        face(p.x0, p.x1, p.y1 - .08, p.y1, z, '#5b5f6b');
        const [a] = [P(p.x0 + .1, p.y0 + .2, z)], b2 = P(p.x0 + .35, p.y0 + .45, z), c2 = P(p.x0 + .55, p.y0 + .3, z), d2 = P(p.x1 - .1, p.y1 - .25, z);
        ctx.strokeStyle = '#ff5d6c'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b2[0], b2[1]); ctx.lineTo(c2[0], c2[1]); ctx.lineTo(d2[0], d2[1]); ctx.stroke();
      }
      return;
    }
    if (type === 'kitchen') {
      box(-RW, RW, 0, .8, z - .15, z + .15, tint('#e6e1d8'));
      box(-RW, RW, .8, .84, z - .18, z + .15, tint('#59616d'));
      box(-RW, -1.35, .84, top(), z - .15, z + .15, tint('#cdd5dc')); box(1.35, RW, .84, top(), z - .15, z + .15, tint('#cdd5dc'));
      box(-RW, RW, top(), CEIL, z - .15, z + .15, tint('#f0ebe2'));
      for (let x = -RW + .55; x < RW; x += .65) face(x, x + .03, top() + .1, CEIL - .1, z - .151, '#d6cfc3');
      if (o.broken) return;
      for (const p of parts) {
        lineTo3([p.px, p.py, z], [p.cx, p.cy, z], '#2b2f3a', 2);
        const [sx, sy, s] = P(p.cx, p.cy, z), R = p.r * s;
        ctx.fillStyle = 'rgba(255,220,120,.18)'; ctx.beginPath(); ctx.arc(sx, sy + R * .4, R * 1.8, 0, 7); ctx.fill();
        ctx.fillStyle = '#ff8a3d'; ctx.beginPath(); ctx.moveTo(sx - R * .4, sy - R * .7); ctx.lineTo(sx + R * .4, sy - R * .7); ctx.lineTo(sx + R, sy + R * .45); ctx.lineTo(sx - R, sy + R * .45); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#fff6c8'; ctx.beginPath(); ctx.ellipse(sx, sy + R * .45, R * .9, R * .25, 0, 0, 7); ctx.fill();
      }
      return;
    }
    if (type === 'conveyor') {
      face(-RW, RW, top(), CEIL, z, '#4a5058');
      for (let x = -RW; x < RW; x += .5) { lineTo3([x, top(), z], [x + .5, CEIL, z], '#5d646d', 2); }
      box(-RW, RW, top() - .02, top() + .1, z - .06, z + .06, tint('#f2c94c'));
      if (o.broken) return;
      for (const p of parts) {
        const mx = (p.x0 + p.x1) / 2;
        lineTo3([mx, top(), z], [mx, p.y1, z], '#2b2f3a', 2);
        box(p.x0, p.x1, p.y0, p.y1, z - .3, z + .3, tint('#c99a5e'));
        face(mx - .06, mx + .06, p.y0, p.y1, z - .301, 'rgba(240,220,170,.6)');
      }
      return;
    }
    if (type === 'roof') {
      const brick = tint('#b35a3f');
      box(-3.9, -1.25, 0, 2.7, z - .3, z + .3, brick); box(1.25, 3.9, 0, 2.7, z - .3, z + .3, brick);
      for (let y = .25; y < 2.7; y += .25) { lineTo3([-3.9, y, z - .301], [-1.25, y, z - .301], '#94472f', 1); lineTo3([1.25, y, z - .301], [3.9, y, z - .301], '#94472f', 1); }
      if (o.broken) return;
      for (const p of parts) {
        const [sx, sy, s] = P(p.cx, p.cy, z), R = p.r * s, flap = Math.sin(o.t * 14 + p.cx * 3);
        ctx.fillStyle = '#8e95a3'; ctx.beginPath(); ctx.ellipse(sx, sy, R, R * .6, 0, 0, 7); ctx.fill();
        ctx.fillStyle = '#6d7482'; ctx.beginPath(); ctx.moveTo(sx - R * .3, sy); ctx.lineTo(sx, sy - R * (1.1 * flap)); ctx.lineTo(sx + R * .4, sy); ctx.fill();
        ctx.fillStyle = '#7a8291'; ctx.beginPath(); ctx.arc(sx + p.dir * R * .85, sy - R * .3, R * .38, 0, 7); ctx.fill();
        ctx.fillStyle = '#ffb347'; ctx.beginPath(); ctx.moveTo(sx + p.dir * R * 1.2, sy - R * .35); ctx.lineTo(sx + p.dir * R * 1.5, sy - R * .25); ctx.lineTo(sx + p.dir * R * 1.2, sy - R * .15); ctx.fill();
      }
    }
  };
  return o;
}

// ---------- game state ----------
const PU_KEYS = ['calm', 'aim', 'freeze', 'fan'], PRICE = 30, STEPS = 6, BIN_R = .34, BALL_R = .075;
const S = {
  mode: 'menu', score: 0, best: 0, coins: 0, lives: 3, streak: 0, loc: 0, lap: 0, prog: 0,
  baskets: 0, heads: 0, broke: 0, smash: 0, heavyArmed: false, fanArmed: false,
  eff: { calm: 0, aim: 0, freeze: 0 }, pu: { calm: 2, aim: 2, freeze: 2, fan: 2 },
  wind: 0, balls: [], litter: [], parts: [], floats: [], env: null, throwN: 0,
  bin: { x: 0, z: 5 }, binPile: 0, props: [], obst: null, boss: null, res: null, lock: 0, shake: 0, time: 0,
};
const LOC = () => LOCS[S.loc];
const diff = () => 1 + S.lap * .25;
const multOf = s => s >= 10 ? 4 : s >= 6 ? 3 : s >= 3 ? 2 : 1;

function setupLocation() {
  const Lc = LOC();
  S.bin = { x: rand(-Lc.binX, Lc.binX) * .6, z: Lc.binZ };
  const KX = .77, KZ = .82;
  S.props = Lc.props.map(p => ({ ...p, x: p.x * KX, z: p.z * KZ, hit: p.hit && [p.hit[0] * KX, p.hit[1], p.hit[2] * KZ, p.hit[3]] }));
  const b = Lc.boss;
  if (!Lc.outdoor) {
    S.props.push({ t: 'desk', x: b.x, z: b.z + .48, w: .9, d: .4 });
    S.props.push({ t: 'monitor', x: b.x, z: b.z + .55, back: true, brk: 1, hit: [b.x, 1.0, b.z + .55, .3], col: '#262a34' });
    S.props.push({ t: 'mug', x: b.x + .34 * Math.sign(-b.x), z: b.z + .4, c: '#5fa8ff', brk: 1, hit: [b.x + .34 * Math.sign(-b.x), .85, b.z + .4, .18], col: '#5fa8ff' });
  }
  S.boss = { x: b.x, z: b.z, anger: 0, look: 0, lookCd: rand(10, 16), rage: 0, stand: 0, face: 0, bubble: null, flash: 0, wob: 0 };
  S.obst = makeObst(Lc.obst, Lc.oz);
  S.litter = []; S.binPile = 0; S.env = null;
  bgDirty = true;
  newWind();
}
function newWind() {
  const Lc = LOC();
  S.wind = Math.random() < .12 ? 0 : Math.round(rand(-1, 1) * Lc.wind * diff() * 10) / 10;
  if (Math.abs(S.wind) < .3) S.wind = 0;
}
const effWind = () => S.eff.calm > 0 ? 0 : S.wind;

// ---------- balls ----------
function makeCreases() { const c = []; for (let i = 0; i < 6; i++) { const a = rand(0, 7), r = rand(.2, .9); c.push([Math.cos(a) * r, Math.sin(a) * r, Math.cos(a + rand(1, 2.5)) * rand(.2, .9), Math.sin(a + rand(1, 2.5)) * rand(.2, .9)]); } return c; }
// Aiming: the finger picks a spot at bin-rim height; the guide shows the true flight with wind (aim lock homes in on the bin).
function aimAt(sx, sy) {
  const dx = (sx - W / 2) / F, dy = -(sy - HY) / F;
  const z = clamp(dy < -1e-3 ? (BIN_H - CAMY) / dy : ZB, Z0 + .8, ZB - .3);
  return { x: clamp(dx * z, -RW + .1, RW - .1), y: BIN_H, z };
}
function solveThrow(t) {
  const fz = t.z - Z0, D = Math.max(.5, Math.hypot(t.x, fz));
  return { phi: Math.atan2(t.x, fz), v: needV(D, Y0 - t.y) };
}
// True flight of a throw released right now, integrated like stepBall (1/240 s, gusts timed from the release,
// bounces off side walls and ceiling indoors). With `objects` the path stops at the first thing the ball would hit:
// the obstacle as it will be when the ball gets there, the boss, a breakable, the bin, or the floor.
// `land` is where it comes down at rim height, `hit` names what stopped it.
function simPath(phi, v, heavy, objects) {
  const Lc = LOC(), O = S.obst, B = S.boss, r = heavy ? .1 : BALL_R, vh = v * Math.cos(TH), dt = 1 / 240;
  const obstRate = S.eff.freeze > 0 ? 0 : diff();
  let x = 0, y = Y0, z = Z0, vx = vh * Math.sin(phi), vy = v * Math.sin(TH), vz = vh * Math.cos(phi), tau = 0, land = null;
  const pts = [];
  for (let i = 0; i < 1600; i++) {
    const gust = Lc.gust ? 1 + Lc.gust * Math.sin((S.time + tau) * 6 + tau * 9) : 1;
    const px = x, py = y, pz = z;
    vx += effWind() * .9 * gust * (heavy ? .35 : 1) * dt; vy -= G * dt;
    x += vx * dt; y += vy * dt; z += vz * dt; tau += dt;
    if (!Lc.outdoor) {
      if (Math.abs(x) > RW - r) { x = Math.sign(x) * (RW - r); vx = -vx * .3; }
      if (y > CEIL - r) { y = CEIL - r; vy = -Math.abs(vy) * .3; }
    }
    pts.push([x, y, z]);
    if (objects) {
      if (!heavy && !O.broken && ((pz < O.z && z >= O.z) || (pz > O.z && z <= O.z))) {
        const k = (O.z - pz) / (z - pz), cx = lerp(px, x, k), cy = lerp(py, y, k), t0 = O.t;
        O.t = t0 + tau * obstRate; const blocked = O.solid(cx, cy, r); O.t = t0;
        if (blocked) { pts[pts.length - 1] = [cx, cy, O.z]; return { pts, land, hit: 'obst' }; }
      }
      const hy = 1.3 + B.stand * .35;
      if (Math.hypot(x - B.x, y - hy, z - B.z) < .16 + r) return { pts, land, hit: 'head' };
      if (Math.abs(x - B.x) < .28 + r && y < 1.14 + B.stand * .35 && y > .3 && Math.abs(z - B.z) < .26 + r) return { pts, land, hit: 'boss' };
      if (!heavy) for (const pr of S.props) {
        if (!pr.hit || pr.broken) continue;
        if (Math.hypot(x - pr.hit[0], y - pr.hit[1], z - pr.hit[2]) < pr.hit[3] + r) return { pts, land, hit: 'prop' };
      }
    }
    if (!land && vy < 0 && y <= BIN_H) {
      land = { x, y: BIN_H, z };
      if (!objects || inBin(land)) return { pts, land, hit: objects ? 'bin' : null };
    }
    if (y <= r) return { pts, land, hit: 'floor' };
    if (z > ZB || (Lc.outdoor && Math.abs(x) > 3.9)) break;
  }
  return { pts, land, hit: null };
}
// Throw that lands on the point t despite the wind: shift the aim by the miss until it converges.
function solveComp(t, heavy) {
  let ax = t.x, az = t.z, sol = solveThrow(t);
  for (let k = 0; k < 6; k++) {
    const land = simPath(sol.phi, sol.v, heavy).land;
    if (!land) break;
    const ex = t.x - land.x, ez = t.z - land.z;
    if (Math.abs(ex) + Math.abs(ez) < .005) break;
    ax += ex; az = clamp(az + ez, Z0 + .8, ZB - .3);
    sol = solveThrow({ x: ax, y: t.y, z: az });
  }
  return sol;
}
const aimLock = () => S.eff.aim > 0;
// what a release right now would throw: aim lock homes in on the bin, otherwise the finger's spot as is
function plannedThrow() {
  if (aimLock()) return solveComp({ x: S.bin.x, y: BIN_H, z: S.bin.z }, S.heavyArmed);
  return drag ? solveThrow(aimAt(drag.x, drag.y)) : null;
}
const inBin = p => !!p && Math.hypot(p.x - S.bin.x, p.z - S.bin.z) < BIN_R - BALL_R * .5;
function ring3(x, y, z, r, color, lw) {
  ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.beginPath();
  for (let i = 0; i <= 32; i++) { const a = i / 32 * Math.PI * 2, q = P(x + Math.cos(a) * r, y, z + Math.sin(a) * r); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }
  ctx.stroke();
}
function throwBall(phi, v) {
  const heavy = S.heavyArmed;
  const angles = S.fanArmed ? [phi - .11, phi, phi + .11] : [phi];
  S.res = { baskets: 0, special: false, heavy, usedCalm: S.eff.calm > 0, usedAim: S.eff.aim > 0, usedFreeze: S.eff.freeze > 0 };
  for (const a of angles) {
    const vh = v * Math.cos(TH);
    S.balls.push({ x: 0, y: Y0, z: Z0, vx: vh * Math.sin(a), vy: v * Math.sin(TH), vz: vh * Math.cos(a), r: heavy ? .1 : BALL_R, heavy, state: 'fly', t: 0, rim: false, rot: 0, spin: rand(-12, 12), cr: makeCreases(), hitBoss: false, broke: new Set() });
  }
  if (heavy) { S.heavyArmed = false; S.smash = 0; }
  S.fanArmed = false; S.throwN++;
  SFX.throw(); haptic('light');
  if (!coached) { coached = true; store.set('office.coached', '1'); $('coach').hidden = true; }
  updateHud();
}
function pointsAt(text, x, y, z, color = '#fff', size = 22) { const [sx, sy] = P(x, y, z); S.floats.push({ text, x: sx, y: sy, t: 0, color, size }); }
function burst(x, y, z, color, n = 14, spd = 2.5, kind = 'shard') {
  for (let i = 0; i < n; i++) S.parts.push({ x, y, z, vx: rand(-1, 1) * spd, vy: rand(.2, 1.4) * spd, vz: rand(-1, 1) * spd, life: rand(.7, 1.3), t: 0, c: color, sz: rand(.025, .06), kind, rot: rand(0, 6) });
}
function addScore(n) { S.score += n; updateHud(); }
function addCoins(n) { S.coins += n; store.set('office.coins', S.coins); updateHud(); }

function scoreBasket(b) {
  S.streak++; S.baskets++; S.res.baskets++;
  const m = multOf(S.streak), clean = !b.rim;
  const pts = 10 * m * (b.heavy ? 2 : 1) + (clean ? 5 : 0);
  addScore(pts); addCoins(m);
  S.smash = Math.min(100, S.smash + 20);
  pointsAt('+' + pts, S.bin.x, 1.0, S.bin.z, '#ffd166', 26);
  pointsAt(b.rim ? L.rim : L.clean, S.bin.x, 1.35, S.bin.z, clean ? '#7dff8a' : '#5fd6ff', 16);
  burst(S.bin.x, BIN_H + .1, S.bin.z, '#ffffff', 10, 1.6, 'paper');
  burst(S.bin.x, BIN_H + .1, S.bin.z, '#ffc83d', 5, 1.8, 'coin');
  SFX.bin(); setTimeout(SFX.coin, 120); haptic('medium');
  $('mult').classList.add('pop'); setTimeout(() => $('mult').classList.remove('pop'), 160);
}
function hitHead(b, hx, hy, hz) {
  const B = S.boss, bull = b.y > hy + .055;
  if (b.hitBoss) return; b.hitBoss = true;
  S.res.special = true; S.heads++;
  const pts = b.heavy ? 60 : bull ? 30 : 15;
  addScore(pts); addCoins(2); S.smash = Math.min(100, S.smash + 10);
  B.anger += b.heavy ? 70 : bull ? 40 : 30;
  if (B.look > 0) B.anger = 100;
  B.flash = .5; B.wob = 1;
  B.bubble = { text: pick(L.boss), t: 2.2 };
  pointsAt('+' + pts, hx, hy + .35, hz, '#ffd166', 24);
  pointsAt(bull ? L.bull : L.head, hx, hy + .6, hz, bull ? '#ff8a3d' : '#5fd6ff', 16);
  SFX.boss(); haptic('heavy');
  if (B.anger >= 100 && !B.rage) B.rage = .001;
}
function breakProp(pr, b) {
  pr.broken = true; S.broke++; S.res.special = true;
  addScore(20); addCoins(3);
  const [x, y, z] = pr.hit;
  burst(x, y, z, pr.col || '#ccc', 22, 3);
  pointsAt('+20', x, y + .3, z, '#ffd166', 22);
  SFX.smash(); S.shake = .35; haptic('heavy');
}
function collectEnv() {
  const e = S.env; S.env = null; S.res.special = true;
  const k = pick(PU_KEYS); S.pu[k]++; savePu();
  addCoins(10);
  pointsAt(L.bonus + ' +' + L.pu[k], e.x, e.y + .3, e.z, '#7dff8a', 18);
  burst(e.x, e.y, e.z, '#ffd166', 12, 2, 'coin');
  SFX.coin(); SFX.level(); haptic('success');
}

function stepBall(b, dt) {
  const B = S.boss, Lc = LOC();
  b.t += dt; b.rot += b.spin * dt;
  if (b.state === 'in') {
    b.vy -= G * dt; b.y += b.vy * dt;
    b.x = lerp(b.x, S.bin.x, .15); b.z = lerp(b.z, S.bin.z, .15);
    if (b.y < .15 + Math.min(.3, S.binPile * .02)) { b.state = 'gone'; S.binPile++; }
    return;
  }
  if (b.state !== 'fly') return;
  const px = b.x, py = b.y, pz = b.z;
  const gust = Lc.gust ? 1 + Lc.gust * Math.sin(S.time * 6 + b.t * 9) : 1;
  b.vx += effWind() * .9 * gust * (b.heavy ? .35 : 1) * dt;
  b.vy -= G * dt;
  b.x += b.vx * dt; b.y += b.vy * dt; b.z += b.vz * dt;
  // obstacle plane
  const O = S.obst;
  if (!O.broken && ((pz < O.z && b.z >= O.z) || (pz > O.z && b.z <= O.z))) {
    const k = (O.z - pz) / (b.z - pz), cx = lerp(px, b.x, k), cy = lerp(py, b.y, k);
    if (O.solid(cx, cy, b.r)) {
      if (b.heavy) {
        O.broken = true; S.res.special = true; addScore(25);
        burst(cx, cy, O.z, O.shardColor, 34, 3.2);
        pointsAt(L.smashGlass + ' +25', cx, cy + .4, O.z, '#ff8a3d', 20);
        O.type === 'glass' ? SFX.glass() : SFX.smash(); S.shake = .45; haptic('heavy');
        b.vx *= .85; b.vz *= .85;
      } else {
        b.z = O.z - Math.sign(b.vz || 1) * (b.r + .01); b.vz = -b.vz * .3; b.vx *= .5; b.vy *= .6;
        SFX.thud(); haptic('rigid');
      }
    }
  }
  // boss head + body
  const hy = 1.3 + B.stand * .35, d = Math.hypot(b.x - B.x, b.y - hy, b.z - B.z);
  if (d < .16 + b.r) {
    const nx = (b.x - B.x) / d, ny = (b.y - hy) / d, nz = (b.z - B.z) / d, vn = b.vx * nx + b.vy * ny + b.vz * nz;
    hitHead(b, B.x, hy, B.z);
    if (vn < 0) { b.vx -= 1.5 * vn * nx; b.vy -= 1.5 * vn * ny; b.vz -= 1.5 * vn * nz; }
    b.x = B.x + nx * (.15 + b.r); b.y = hy + ny * (.15 + b.r); b.z = B.z + nz * (.15 + b.r);
  } else if (Math.abs(b.x - B.x) < .28 + b.r && b.y < 1.14 + B.stand * .35 && b.y > .3 && Math.abs(b.z - B.z) < .26 + b.r && b.vz > 0) {
    b.vz = -b.vz * .3; b.vx *= .6; SFX.thud();
    if (!b.hitBoss) { b.hitBoss = true; B.anger += 12; B.wob = .6; B.bubble = { text: pick(L.boss), t: 1.6 }; if (B.anger >= 100 && !B.rage) B.rage = .001; }
  }
  // breakables
  for (const pr of S.props) {
    if (!pr.hit || pr.broken) continue;
    const [hx, hy2, hz, hr] = pr.hit, dd = Math.hypot(b.x - hx, b.y - hy2, b.z - hz);
    if (dd < hr + b.r) {
      if (b.heavy) breakProp(pr, b);
      else if (!b.broke.has(pr)) { b.broke.add(pr); b.vz = -Math.abs(b.vz) * .25; b.vx *= .5; SFX.thud(); }
    }
  }
  // bonus envelope
  if (S.env && Math.hypot(b.x - S.env.x, b.y - S.env.y, b.z - S.env.z) < .26 + b.r) collectEnv();
  // bin
  const dx = b.x - S.bin.x, dz = b.z - S.bin.z, dh = Math.hypot(dx, dz) || 1e-4;
  if (py >= BIN_H && b.y < BIN_H && dh < BIN_R + b.r) {
    if (dh < BIN_R - b.r * .3) { b.state = 'in'; b.vy = Math.min(b.vy, -1); scoreBasket(b); return; }
    b.y = BIN_H + .001; b.vy = Math.abs(b.vy) * .45; b.vx += dx / dh * .9 * (dh > BIN_R ? 1 : -1); b.vz += dz / dh * .9 * (dh > BIN_R ? 1 : -1);
    b.rim = true; SFX.rim();
  } else if (b.y < BIN_H && dh < BIN_R + b.r && dh > BIN_R - .06) {
    const nx = dx / dh, nz = dz / dh, vn = b.vx * nx + b.vz * nz;
    if (vn < 0) { b.vx -= 1.4 * vn * nx; b.vz -= 1.4 * vn * nz; SFX.thud(); }
    b.x = S.bin.x + nx * (BIN_R + b.r); b.z = S.bin.z + nz * (BIN_R + b.r);
  }
  // room
  if (Lc.outdoor) {
    if (b.z > ZB - b.r && b.y < .7) { b.z = ZB - b.r; b.vz = -Math.abs(b.vz) * .3; }
    if (Math.abs(b.x) > 3.9 || b.z > ZB + .5) { b.state = 'gone'; return; }
  } else {
    if (Math.abs(b.x) > RW - b.r) { b.x = Math.sign(b.x) * (RW - b.r); b.vx = -b.vx * .3; }
    if (b.z > ZB - b.r) { b.z = ZB - b.r; b.vz = -Math.abs(b.vz) * .3; }
    if (b.y > CEIL - b.r) { b.y = CEIL - b.r; b.vy = -Math.abs(b.vy) * .3; }
  }
  if (b.y < b.r) {
    b.y = b.r;
    if (b.vy < -1.2) { b.vy = -b.vy * .28; if (b.vy > .6) SFX.thud(); } else b.vy = 0;
    b.vx *= .94; b.vz *= .94; b.spin *= .9;
    if (Math.hypot(b.vx, b.vz) < .35 && Math.abs(b.vy) < .1) b.state = 'rest';
  }
  if (b.t > 5 || b.z < .3) b.state = 'rest';
}

function resolveThrow() {
  const r = S.res; S.res = null;
  for (const b of S.balls) if (b.state === 'rest' && b.z > .5) { S.litter.push({ x: b.x, z: b.z, r: b.r, rot: b.rot, cr: b.cr, heavy: b.heavy }); if (S.litter.length > 16) S.litter.shift(); }
  S.balls = [];
  if (r.usedCalm) S.eff.calm = Math.max(0, S.eff.calm - 1);
  if (r.usedAim) S.eff.aim = Math.max(0, S.eff.aim - 1);
  if (r.usedFreeze) S.eff.freeze = Math.max(0, S.eff.freeze - 1);
  S.obst.broken = false;
  if (!r.baskets) {
    S.streak = 0;
    if (!r.special && !r.heavy) {
      S.lives--; SFX.miss(); haptic('error');
      pointsAt(L.miss, 0, 1.9, 4, '#ff5d6c', 22);
      if (S.lives <= 0) { updateHud(); S.lock = 1.2; setTimeout(gameOver, 900); return; }
    }
  } else {
    S.prog += r.baskets;
    if (S.prog >= STEPS) { nextLocation(); updateHud(); return; }
    S.bin.x = rand(-LOC().binX, LOC().binX);
  }
  newWind();
  if (!S.env && S.throwN > 1 && Math.random() < .3) S.env = { ph: rand(0, 6), x: 0, y: 0, z: 0 };
  updateHud();
}
function nextLocation() {
  S.prog = 0; S.loc++;
  let loopMsg = '';
  if (S.loc >= LOCS.length) { S.loc = 0; S.lap++; loopMsg = L.loop(S.lap + 1); }
  const gained = S.lives < 3; S.lives = Math.min(3, S.lives + 1);
  setupLocation();
  SFX.level(); haptic('success');
  toast(L.newLoc + ': ' + L.locs[S.loc], [gained ? L.life : '', loopMsg].filter(Boolean).join(' · '), '#5fd6ff');
}

// ---------- boss ----------
function updateBoss(dt) {
  const B = S.boss;
  B.flash = Math.max(0, B.flash - dt); B.wob = Math.max(0, B.wob - dt * 2);
  if (B.bubble) { B.bubble.t -= dt; if (B.bubble.t <= 0) B.bubble = null; }
  if (B.rage) {
    const t0 = B.rage; B.rage += dt;
    B.stand = clamp(B.rage / .5, 0, 1); B.face = clamp(B.rage / .4, 0, 1);
    if (t0 < .05 && B.rage >= .05) { SFX.rage(); haptic('warning'); B.bubble = { text: '!!!', t: 1 }; toast(L.rageT, '', '#ff5d6c'); }
    if (t0 < .75 && B.rage >= .75) S.incoming = { t: 0 };
    if (t0 < 2.9 && B.rage >= 2.9) { B.rage = 0; B.anger = 0; B.look = 0; B.lookCd = rand(12, 18); }
    return;
  }
  B.stand = Math.max(0, B.stand - dt * 2);
  B.anger = Math.max(0, B.anger - dt * 2.2);
  if (B.look > 0) { B.look -= dt; B.face = Math.min(1, B.face + dt * 5); }
  else {
    B.face = Math.max(0, B.face - dt * 4);
    if (B.anger > 25) { B.lookCd -= dt; if (B.lookCd <= 0) { B.look = 2.6; B.lookCd = rand(9, 15); B.bubble = { text: pick(L.bossLook), t: 1.8 }; } }
  }
}
function updateIncoming(dt) {
  const I = S.incoming; if (!I) return;
  I.t += dt;
  if (I.t >= .45 && !I.hit) {
    I.hit = true; SFX.splat(); haptic('error'); S.shake = .6;
    S.lives--; S.streak = 0; updateHud(); showSplat();
    toast(L.rageT, L.rageS, '#ff5d6c');
    if (S.lives <= 0) { S.lock = 2; setTimeout(gameOver, 1500); }
  }
  if (I.t > .6) S.incoming = null;
}

// ---------- drawing the dynamic scene ----------
function drawBall(x, y, z, r, rot, cr, heavy, shadow = true) {
  if (shadow && y > r * 1.2) { const [sx, sy, s] = P(x, 0, z); ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(sx, sy, r * s, r * s * .35, 0, 0, 7); ctx.fill(); }
  const [sx, sy, R] = sphere(x, y, z, r, heavy ? '#fff0a8' : '#ffffff', heavy ? '#d9a12a' : '#bfc6d2');
  ctx.save(); ctx.translate(sx, sy); ctx.rotate(rot);
  ctx.strokeStyle = heavy ? 'rgba(120,80,10,.7)' : 'rgba(110,120,140,.55)'; ctx.lineWidth = Math.max(1, R * .07);
  for (const [a, b2, c, d] of cr) { ctx.beginPath(); ctx.moveTo(a * R, b2 * R); ctx.lineTo((a + c) * R * .5 + R * .1, (b2 + d) * R * .5); ctx.lineTo(c * R, d * R); ctx.stroke(); }
  if (heavy) { ctx.strokeStyle = 'rgba(200,200,210,.85)'; ctx.lineWidth = R * .28; ctx.beginPath(); ctx.moveTo(-R, -R * .2); ctx.lineTo(R, R * .3); ctx.moveTo(-R * .3, -R); ctx.lineTo(R * .1, R); ctx.stroke(); }
  ctx.restore();
}
function drawBinBack() {
  const { x, z } = S.bin, Lc = LOC();
  const top = ring(x, BIN_H, z, BIN_R);
  path(top); ctx.fillStyle = sh(Lc.binC, -.55); ctx.fill();
  if (S.binPile) { const k = Math.min(1, S.binPile / 14); const pile = ring(x, .1 + k * .38, z, BIN_R * .92); path(pile); ctx.fillStyle = '#e3e7ee'; ctx.fill(); }
  ctx.strokeStyle = sh(Lc.binC, .25); ctx.lineWidth = Math.max(1.5, .02 * P(x, BIN_H, z)[2]);
  ctx.beginPath(); top.slice(0, 15).forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
}
function drawBinFront() {
  const { x, z } = S.bin, Lc = LOC();
  const top = ring(x, BIN_H, z, BIN_R).slice(14), bot = ring(x, 0, z, BIN_R * .78).slice(14);
  const pl = P(x - BIN_R, .3, z), pr = P(x + BIN_R, .3, z);
  const g = ctx.createLinearGradient(pl[0], 0, pr[0], 0);
  g.addColorStop(0, sh(Lc.binC, -.25)); g.addColorStop(.35, sh(Lc.binC, .25)); g.addColorStop(1, sh(Lc.binC, -.4));
  path([...top, ...bot.reverse()]); ctx.fillStyle = Lc.mesh ? 'rgba(60,70,85,.35)' : g; ctx.fill();
  if (Lc.mesh) {
    ctx.strokeStyle = g; ctx.lineWidth = 1.4;
    for (let i = 0; i <= 14; i++) { const a = top[i], b2 = bot[bot.length - 1 - i]; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b2[0], b2[1]); ctx.stroke(); }
    for (const y of [.2, .4]) { const rr = ring(x, y, z, BIN_R * (.78 + .22 * y / BIN_H)).slice(14); ctx.beginPath(); rr.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); }
  }
  ctx.strokeStyle = sh(Lc.binC, .35); ctx.lineWidth = Math.max(2, .03 * P(x, BIN_H, z)[2]);
  ctx.beginPath(); top.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
}
function drawBoss() {
  const B = S.boss, outdoor = LOC().outdoor, wob = Math.sin(S.time * 30) * B.wob * .03;
  const hy = 1.3 + B.stand * .35, bx = B.x + wob, bz = B.z;
  const shirt = outdoor ? '#ffd166' : '#f4f6fa';
  // torso + arms
  const sy0 = hy - .17, wy = .52 + B.stand * .3;
  poly3([[bx - .27, sy0, bz], [bx + .27, sy0, bz], [bx + .21, wy, bz], [bx - .21, wy, bz]], shirt);
  poly3([[bx - .27, sy0, bz], [bx - .33, sy0 - .35, bz - .05], [bx - .26, sy0 - .38, bz - .05], [bx - .2, sy0 - .05, bz]], sh(shirt, -.12));
  poly3([[bx + .27, sy0, bz], [bx + .33, sy0 - .35, bz - .05], [bx + .26, sy0 - .38, bz - .05], [bx + .2, sy0 - .05, bz]], sh(shirt, -.12));
  if (B.face > .5) { poly3([[bx - .03, sy0, bz - .01], [bx + .03, sy0, bz - .01], [bx + .04, sy0 - .3, bz - .01], [bx, sy0 - .36, bz - .01], [bx - .04, sy0 - .3, bz - .01]], '#d64545'); }
  // head
  const ang = clamp(B.anger / 100, 0, 1), skin = `rgb(${lerp(241, 232, ang) | 0},${lerp(199, 96, ang) | 0},${lerp(165, 86, ang) | 0})`;
  const [sx, sy, s] = P(bx, hy, bz), R = .14 * s;
  ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(sx - R * .95, sy + R * .1, R * .22, 0, 7); ctx.arc(sx + R * .95, sy + R * .1, R * .22, 0, 7); ctx.fill();
  sphere(bx, hy, bz, .14, B.flash > 0 ? '#ffffff' : sh(skin.replace(/rgb\((\d+),(\d+),(\d+)\)/, (m, r, g, b2) => '#' + [r, g, b2].map(v => (+v).toString(16).padStart(2, '0')).join('')), .25), skin);
  ctx.strokeStyle = '#4a3426'; ctx.lineWidth = R * .32; ctx.lineCap = 'round';
  ctx.beginPath(); B.face > .5 ? ctx.arc(sx, sy, R * .92, Math.PI * .95, Math.PI * 1.15) : ctx.arc(sx, sy, R * .9, Math.PI * .08, Math.PI * .92); ctx.stroke();
  if (B.face > .5) { ctx.beginPath(); ctx.arc(sx, sy, R * .92, -Math.PI * .15, Math.PI * .05); ctx.stroke(); }
  ctx.lineCap = 'butt';
  // target sticker on the bald spot
  const tx = sx, ty = sy - R * .5;
  [['#e8344a', .44], ['#fff', .33], ['#e8344a', .22], ['#fff', .11]].forEach(([c, k]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(tx, ty, R * k * 1.0, R * k * .62, 0, 0, 7); ctx.fill(); });
  ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.ellipse(sx - R * .45, sy - R * .45, R * .14, R * .08, -.6, 0, 7); ctx.fill();
  if (B.face > .5) {
    const e = R * .16, ey = sy + R * .05;
    for (const k of [-1, 1]) {
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(sx + k * R * .36, ey, e, 0, 7); ctx.fill();
      ctx.fillStyle = '#1b1d26'; ctx.beginPath(); ctx.arc(sx + k * R * .36, ey + e * .2, e * .5, 0, 7); ctx.fill();
      ctx.strokeStyle = '#3a2416'; ctx.lineWidth = R * .1; ctx.beginPath(); ctx.moveTo(sx + k * R * .55, ey - e * (1.6 + ang)); ctx.lineTo(sx + k * R * .15, ey - e * (1.5 - ang * 1.2)); ctx.stroke();
    }
    ctx.fillStyle = '#4a3426'; ctx.beginPath(); ctx.ellipse(sx, sy + R * .45, R * .38, R * .12, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = '#7a2a2a'; ctx.lineWidth = R * .08; ctx.beginPath(); ctx.arc(sx, sy + R * (ang > .5 ? .85 : .6), R * .2, ang > .5 ? Math.PI * 1.15 : .2, ang > .5 ? Math.PI * 1.85 : Math.PI - .2); ctx.stroke();
  }
  // chair in front of him (he sits with his back to us)
  if (B.stand < .5) {
    const c = outdoor ? '#ff8a3d' : '#56607a';
    box(bx - .22, bx + .22, .48, .86, bz - .27, bz - .22, tint(c));
    if (outdoor) for (let y = .55; y < .85; y += .1) face(bx - .25, bx + .25, y, y + .05, bz - .271, '#ffffff');
  }
  box(bx - .24, bx + .24, .42, .48, bz - .22, bz + .2, tint(outdoor ? '#d06a2a' : '#2f323d'));
  box(bx - .025, bx + .025, 0, .42, bz - .02, bz + .02, tint('#2a2d36'));
  // anger meter + speech bubble (screen space)
  const top = P(bx, hy + .3, bz);
  if (B.anger > 2 && !B.rage) {
    const w = 64, h = 7, x0 = top[0] - w / 2, y0 = top[1] - 6;
    ctx.fillStyle = 'rgba(16,18,38,.75)'; roundRect(x0 - 3, y0 - 3, w + 6, h + 6, 6); ctx.fill();
    const gg = ctx.createLinearGradient(x0, 0, x0 + w, 0); gg.addColorStop(0, '#ffd166'); gg.addColorStop(1, '#ff3d4f');
    ctx.fillStyle = gg; roundRect(x0, y0, w * ang, h, 3); ctx.fill();
    if (B.look > 0) { ctx.fillStyle = '#ff5d6c'; ctx.font = '22px "Russo One",sans-serif'; ctx.textAlign = 'center'; ctx.fillText('👀', top[0], y0 - 10); }
  }
  if (B.bubble) {
    ctx.font = '600 13px Onest,sans-serif'; const tw = ctx.measureText(B.bubble.text).width + 18;
    const bx0 = clamp(top[0] - tw / 2, 8, W - tw - 8), by0 = top[1] - 52;
    ctx.globalAlpha = clamp(B.bubble.t * 3, 0, 1);
    ctx.fillStyle = '#fff'; roundRect(bx0, by0, tw, 26, 9); ctx.fill();
    ctx.beginPath(); ctx.moveTo(top[0] - 6, by0 + 25); ctx.lineTo(top[0], by0 + 34); ctx.lineTo(top[0] + 6, by0 + 25); ctx.fill();
    ctx.fillStyle = '#14162e'; ctx.textAlign = 'left'; ctx.fillText(B.bubble.text, bx0 + 9, by0 + 17.5);
    ctx.globalAlpha = 1;
  }
}
function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function drawEnvelope() {
  const e = S.env; const [sx, sy, s] = P(e.x, e.y, e.z), w = .3 * s, h = .2 * s, bob = Math.sin(S.time * 4) * .04 * s;
  ctx.save(); ctx.translate(sx, sy + bob); ctx.rotate(Math.sin(S.time * 2) * .15);
  ctx.fillStyle = 'rgba(255,209,102,.35)'; ctx.beginPath(); ctx.arc(0, 0, w * 1.1, 0, 7); ctx.fill();
  ctx.fillStyle = '#fff8e6'; ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.strokeStyle = '#d9b26a'; ctx.lineWidth = 1.5; ctx.strokeRect(-w / 2, -h / 2, w, h);
  ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(0, h * .1); ctx.lineTo(w / 2, -h / 2); ctx.stroke();
  ctx.fillStyle = '#e8344a'; ctx.beginPath(); ctx.arc(0, h * .1, h * .18, 0, 7); ctx.fill();
  ctx.restore();
}
function drawAimGuide() {
  const lock = aimLock();
  if (!drag && !lock) return;
  if (lock) { // lock-on marker over the bin
    const pulse = 1 + Math.sin(S.time * 7) * .06;
    ring3(S.bin.x, BIN_H + .01, S.bin.z, (BIN_R + .1) * pulse, 'rgba(95,214,255,.9)', 3);
  }
  const sol = drag && plannedThrow();
  if (!sol) return;
  // the dotted path runs exactly as far as the ball would fly: it stops at the obstacle, the boss, a prop, the bin or the floor
  const { pts, land, hit } = simPath(sol.phi, sol.v, S.heavyArmed, true);
  ctx.fillStyle = lock ? 'rgba(95,214,255,.95)' : 'rgba(255,255,255,.85)';
  for (let i = 12; i < pts.length; i += 14) { const q = P(pts[i][0], pts[i][1], pts[i][2]); ctx.beginPath(); ctx.arc(q[0], q[1], Math.max(2, .028 * q[2]), 0, 7); ctx.fill(); }
  // the last dot shows the point of impact when something is in the way
  if (hit === 'obst' || hit === 'boss' || hit === 'prop') {
    const e = pts[pts.length - 1], q = P(e[0], e[1], e[2]);
    ctx.fillStyle = '#ff5d6c'; ctx.beginPath(); ctx.arc(q[0], q[1], Math.max(4, .045 * q[2]), 0, 7); ctx.fill();
  }
  // landing ring only with aim lock
  if (lock && land) { const good = inBin(land); ring3(land.x, BIN_H + .01, land.z, .1, good ? '#7dff8a' : 'rgba(255,255,255,.9)', good ? 4 : 2.5); }
}
function drawWindStreaks(dt) {
  const w = effWind();
  if (!w) return;
  ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 1.5;
  for (const st of streaks) {
    st.x += w * st.sp * dt * 40; if (st.x > W + 60) st.x = -60; if (st.x < -60) st.x = W + 60;
    ctx.globalAlpha = .25 + .35 * Math.abs(Math.sin(S.time * 2 + st.ph));
    ctx.beginPath(); ctx.moveTo(st.x, st.y); ctx.lineTo(st.x - Math.sign(w) * st.len, st.y); ctx.stroke();
  }
  ctx.globalAlpha = 1;
}
const streaks = Array.from({ length: 22 }, () => ({ x: Math.random() * 1200, y: 0, len: rand(20, 60), sp: rand(.6, 1.4), ph: rand(0, 6), fy: rand(.18, .62) }));

function render(dt) {
  if (bgDirty) renderBg();
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.save();
  if (S.shake > 0) ctx.translate(rand(-1, 1) * S.shake * 14, rand(-1, 1) * S.shake * 14);
  ctx.drawImage(bg, 0, 0, W, H);
  for (const st of streaks) st.y = H * st.fy;
  drawWindStreaks(dt);
  const items = [];
  for (const pr of S.props) if (!pr.broken) items.push({ z: pr.z + (pr.t === 'desk' || pr.t === 'table' ? .4 : 0), fn: () => PROPS[pr.t](pr) });
  items.push({ z: S.obst.z, fn: S.obst.draw });
  items.push({ z: S.bin.z + BIN_R, fn: drawBinBack });
  items.push({ z: S.bin.z - BIN_R, fn: drawBinFront });
  items.push({ z: S.boss.z - .28, fn: drawBoss });
  if (S.env) items.push({ z: S.env.z, fn: drawEnvelope });
  for (const l of S.litter) items.push({ z: l.z, fn: () => drawBall(l.x, l.r, l.z, l.r, l.rot, l.cr, l.heavy, false) });
  for (const b of S.balls) if (b.state !== 'gone') items.push({ z: b.state === 'in' ? S.bin.z : b.z, fn: () => drawBall(b.x, b.y, b.z, b.r, b.rot, b.cr, b.heavy) });
  items.sort((a, b) => b.z - a.z);
  for (const it of items) it.fn();
  // particles
  for (const p of S.parts) {
    const [sx, sy, s] = P(p.x, p.y, p.z), sz = Math.max(2, p.sz * s);
    ctx.globalAlpha = clamp(1 - p.t / p.life, 0, 1);
    ctx.save(); ctx.translate(sx, sy); ctx.rotate(p.rot);
    if (p.kind === 'coin') { ctx.fillStyle = '#ffc83d'; ctx.beginPath(); ctx.ellipse(0, 0, sz, sz * Math.abs(Math.cos(p.rot * 2)) + 1, 0, 0, 7); ctx.fill(); }
    else { ctx.fillStyle = p.c; ctx.fillRect(-sz, -sz * .6, sz * 2, sz * 1.2); }
    ctx.restore();
  }
  ctx.globalAlpha = 1;
  // the ball in hand
  if (S.mode === 'play' && canThrow()) {
    const bob = Math.sin(S.time * 3) * .01;
    if (S.heavyArmed) { const [sx, sy, s] = P(0, Y0, Z0); ctx.fillStyle = 'rgba(255,138,61,.3)'; ctx.beginPath(); ctx.arc(sx, sy, .16 * s + Math.sin(S.time * 8) * 4, 0, 7); ctx.fill(); }
    drawBall(0, Y0 + bob, Z0, S.heavyArmed ? .1 : BALL_R, 0, handCreases, S.heavyArmed, false);
    if (S.fanArmed) { for (const k of [-1, 1]) { const [sx, sy, s] = P(k * .14, Y0 - .02, Z0 + .05); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.arc(sx, sy, .05 * s, 0, 7); ctx.fill(); } }
    drawAimGuide();
  }
  ctx.restore();
  // floating texts
  ctx.textAlign = 'center';
  for (const f of S.floats) {
    const k = f.t / 1.3;
    ctx.globalAlpha = clamp(1.4 - k * 1.4, 0, 1);
    ctx.font = `${f.size}px "Russo One",sans-serif`;
    ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(16,18,38,.8)'; ctx.strokeText(f.text, f.x, f.y - k * 50);
    ctx.fillStyle = f.color; ctx.fillText(f.text, f.x, f.y - k * 50);
  }
  ctx.globalAlpha = 1;
  // the boss throws one back
  if (S.incoming) {
    const k = clamp(S.incoming.t / .45, 0, 1), B = S.boss, [hx, hy] = P(B.x, 1.7, B.z);
    const x = lerp(hx, W / 2, k), y = lerp(hy, H * .45, k), R = lerp(10, Math.max(W, H) * .5, k * k);
    ctx.fillStyle = '#f2f4f7'; ctx.beginPath(); ctx.arc(x, y, R, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(110,120,140,.5)'; ctx.lineWidth = Math.max(1, R * .04);
    for (const [a, b2, c, d] of handCreases) { ctx.beginPath(); ctx.moveTo(x + a * R, y + b2 * R); ctx.lineTo(x + c * R, y + d * R); ctx.stroke(); }
  }
}
const handCreases = makeCreases();

function update(dt) {
  S.time += dt;
  S.shake = Math.max(0, S.shake - dt);
  S.lock = Math.max(0, S.lock - dt);
  if (S.eff.freeze <= 0) S.obst.t += dt * diff();
  if (S.env) { const e = S.env; e.z = (S.obst.z + S.bin.z) / 2; e.x = Math.sin(S.time * .9 + e.ph) * 1.4; e.y = yAt(e.z) + .1; }
  updateBoss(dt); updateIncoming(dt);
  const sub = 4;
  for (const b of S.balls) for (let i = 0; i < sub; i++) stepBall(b, dt / sub);
  if (S.res && S.balls.length && S.balls.every(b => b.state === 'rest' || b.state === 'gone')) resolveThrow();
  for (const p of S.parts) { p.t += dt; p.vy -= G * .6 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; p.rot += dt * 6; if (p.y < .02) { p.y = .02; p.vy = 0; p.vx *= .8; p.vz *= .8; } }
  S.parts = S.parts.filter(p => p.t < p.life);
  for (const f of S.floats) f.t += dt;
  S.floats = S.floats.filter(f => f.t < 1.3);
}

// ---------- input ----------
let drag = null, coached = false;
const canThrow = () => S.mode === 'play' && !paused && !S.balls.length && !S.boss.rage && !S.incoming && S.lock <= 0 && S.lives > 0;
cv.addEventListener('pointerdown', e => {
  ac();
  if (!canThrow()) return;
  drag = { x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, id: e.pointerId };
  try { cv.setPointerCapture(e.pointerId); } catch (er) {}
});
cv.addEventListener('pointermove', e => { if (drag && e.pointerId === drag.id) { drag.x = e.clientX; drag.y = e.clientY; } });
const endDrag = e => {
  if (!drag || e.pointerId !== drag.id) return;
  const sol = plannedThrow(); drag = null;
  if (!canThrow() || !sol) return;
  throwBall(sol.phi, sol.v);
};
cv.addEventListener('pointerup', endDrag);
cv.addEventListener('pointercancel', () => { drag = null; });

// ---------- HUD ----------
function savePu() { store.set('office.pu', JSON.stringify(S.pu)); }
function updateHud() {
  $('score').textContent = S.score;
  if (target && !targetBeaten && S.score > target.s) { targetBeaten = true; renderTarget(); haptic('success'); toast(L.targetDone(target.n), '', '#7dff8a'); }
  $('bestLine').textContent = L.bestShort(Math.max(S.best, S.score));
  $('coins').textContent = S.coins;
  $('locName').textContent = L.locs[S.loc] + (S.lap ? ` · ${S.lap + 1}` : '');
  $('dots').innerHTML = Array.from({ length: STEPS }, (_, i) => `<i class="${i < S.prog ? 'on' : ''}"></i>`).join('');
  $('lives').innerHTML = Array.from({ length: 3 }, (_, i) => i < S.lives ? '<b>♥</b>' : '<s>♥</s>').join('');
  const m = multOf(S.streak);
  $('mult').textContent = 'x' + m + (S.streak ? ` · ${S.streak}` : '');
  $('mult').classList.toggle('hot', m > 1);
  const w = effWind(); const wv = $('windVal');
  wv.textContent = w ? (w < 0 ? '← ' : '') + Math.abs(w).toFixed(1) + (w > 0 ? ' →' : '') : L.calm;
  wv.classList.toggle('calm', !w);
  const sm = $('smash'); sm.style.setProperty('--p', S.heavyArmed ? 100 : S.smash);
  sm.classList.toggle('ready', S.smash >= 100 && !S.heavyArmed); sm.classList.toggle('armed', S.heavyArmed);
  $('smashTxt').innerHTML = S.heavyArmed ? L.smashArmed : S.smash >= 100 ? L.smash : Math.floor(S.smash) + '%';
  document.querySelectorAll('.pu').forEach(b => {
    const k = b.dataset.k, n = S.pu[k], on = k === 'fan' ? S.fanArmed : S.eff[k] > 0;
    const badge = b.querySelector('.n');
    badge.textContent = n > 0 ? n : PRICE; badge.classList.toggle('price', n <= 0);
    b.classList.toggle('on', on); b.classList.toggle('off', n <= 0 && S.coins < PRICE);
    b.setAttribute('aria-label', L.pu[k] + (n > 0 ? ` (${n})` : ` (${PRICE})`)); b.title = L.pu[k];
  });
  const eff = [];
  if (S.eff.calm) eff.push(L.effCalm(S.eff.calm)); if (S.eff.aim) eff.push(L.effAim(S.eff.aim)); if (S.eff.freeze) eff.push(L.effFreeze(S.eff.freeze));
  if (S.fanArmed) eff.push(L.effFan); if (S.heavyArmed) eff.push(L.effHeavy);
  $('effects').innerHTML = eff.map(t => `<span>${t}</span>`).join('');
}
document.querySelectorAll('.pu').forEach(btn => btn.addEventListener('click', () => {
  if (S.mode !== 'play' || paused) return;
  const k = btn.dataset.k;
  if (k === 'fan' ? S.fanArmed : S.eff[k] > 0) return;
  if (S.pu[k] <= 0) {
    if (S.coins < PRICE) { btn.classList.remove('shake'); void btn.offsetWidth; btn.classList.add('shake'); toast(L.noCoins, '', '#ff5d6c'); haptic('error'); return; }
    addCoins(-PRICE); S.pu[k]++;
  }
  S.pu[k]--; savePu();
  if (k === 'fan') S.fanArmed = true; else S.eff[k] += 3;
  SFX.click(); haptic('light'); updateHud();
}));
$('smash').addEventListener('click', () => {
  if (S.mode !== 'play' || paused || S.balls.length) return;
  if (S.heavyArmed) { S.heavyArmed = false; }
  else if (S.smash >= 100) { S.heavyArmed = true; SFX.rage(); haptic('medium'); }
  updateHud();
});
let toastTimer = 0;
function toast(title, sub, color = '#fff') {
  const t = $('toast'); t.innerHTML = `<b style="color:${color}">${title}</b>${sub ? `<span>${sub}</span>` : ''}`;
  t.style.opacity = 1; clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.style.opacity = 0; }, 1800);
}
function showSplat() {
  const c = $('splat'); c.width = W * DPR; c.height = H * DPR; const g = c.getContext('2d'); g.setTransform(DPR, 0, 0, DPR, 0, 0);
  for (let i = 0; i < 9; i++) {
    const x = W * rand(.1, .9), y = H * rand(.15, .85), r = Math.min(W, H) * rand(.14, .28);
    g.fillStyle = i % 2 ? '#f2f4f7' : '#e3e7ee'; g.beginPath();
    for (let a = 0; a < 7; a += .5) { const rr = r * rand(.75, 1.1); a ? g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : g.moveTo(x + rr, y); }
    g.closePath(); g.fill(); g.strokeStyle = 'rgba(110,120,140,.45)'; g.lineWidth = 2;
    for (let j = 0; j < 4; j++) { g.beginPath(); g.moveTo(x + rand(-r, r) * .7, y + rand(-r, r) * .7); g.lineTo(x + rand(-r, r) * .7, y + rand(-r, r) * .7); g.stroke(); }
  }
  c.style.transition = 'none'; c.style.opacity = 1;
  setTimeout(() => { c.style.transition = 'opacity .9s'; c.style.opacity = 0; }, 1300);
}

// ---------- flow ----------
let paused = false;
function setPaused(on) { paused = on; $('pauseOv').hidden = !on; drag = null; }
function onFocusChange(lost) { if (lost && S.mode === 'play') setPaused(true); if (actx) { try { lost ? actx.suspend() : (!muted && actx.resume()); } catch (e) {} } }
document.addEventListener('visibilitychange', () => onFocusChange(document.hidden));
function startGame() {
  Object.assign(S, { mode: 'play', score: 0, lives: 3, streak: 0, loc: 0, lap: 0, prog: 0, baskets: 0, heads: 0, broke: 0, smash: 0, heavyArmed: false, fanArmed: false, eff: { calm: 0, aim: 0, freeze: 0 }, balls: [], parts: [], floats: [], throwN: 0, res: null, incoming: null, lock: 0 });
  setupLocation();
  target = pickTarget(); targetBeaten = false; renderTarget();
  document.body.classList.add('playing');
  $('menu').hidden = true; $('over').hidden = true; setPaused(false);
  $('coach').hidden = true;
  updateHud(); toast(L.locs[0], '', '#5fd6ff');
}
function gameOver() {
  if (S.mode !== 'play') return;
  S.mode = 'over'; document.body.classList.remove('playing');
  const isBest = S.score > S.best;
  if (isBest) { S.best = S.score; store.set('office.best', S.best); }
  updateSelf();
  const beat = !!target && S.score > target.s;
  $('beatLine').hidden = !beat;
  if (beat) $('beatLine').textContent = L.beat(target.n);
  renderFriends();
  $('finalScore').textContent = S.score;
  $('overText').textContent = L.overText(L.locs[S.loc]);
  $('newBest').hidden = !isBest || !S.score; $('newBest').textContent = L.newBest;
  $('sBaskets').textContent = S.baskets; $('sHeads').textContent = S.heads; $('sBroke').textContent = S.broke;
  $('over').hidden = false; $('coach').hidden = true;
}
function toMenu() { S.mode = 'menu'; document.body.classList.remove('playing'); setPaused(false); $('over').hidden = true; $('menu').hidden = false; applyLang(); }
$('startBtn').onclick = () => { ac(); startGame(); };
$('againBtn').onclick = () => { ac(); startGame(); };
$('resumeBtn').onclick = () => setPaused(false);
$('quitBtn').onclick = toMenu;
$('pauseBtn').onclick = () => setPaused(true);
$('shareBtn').onclick = () => {
  updateSelf();
  const text = L.shareText(Math.max(S.best, S.score));
  const url = (inTelegram ? TG_APP_LINK : location.origin + location.pathname) + '?startapp=' + encodeBoard();
  if (tgv('6.1')) { try { tg.openTelegramLink('https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text)); return; } catch (e) {} }
  if (navigator.share) { navigator.share({ title: L.title, text, url }).catch(() => {}); return; }
  const btn = $('shareBtn'), done = () => { btn.textContent = L.copied; setTimeout(() => { btn.textContent = L.share; }, 1800); };
  try { navigator.clipboard.writeText(text + ' ' + url).then(done, done); } catch (e) { done(); }
};
const SOUND_ON = 'M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z';
const SOUND_OFF = 'M3 9v6h4l5 5V4L7 9H3zm13.6 3l2.7-2.7-1.4-1.4-2.7 2.7-2.7-2.7-1.4 1.4 2.7 2.7-2.7 2.7 1.4 1.4 2.7-2.7 2.7 2.7 1.4-1.4z';
function drawSound() { $('soundIcon').setAttribute('d', muted ? SOUND_OFF : SOUND_ON); }
$('soundBtn').onclick = () => { muted = !muted; store.set('office.muted', muted ? '1' : '0'); if (actx) muted ? actx.suspend() : actx.resume(); drawSound(); };
$('langBtn').onclick = () => { LANG = LANG === 'ru' ? 'en' : 'ru'; store.set('arena.lang', LANG); applyLang(); };
function applyLang() {
  L = I18N[LANG]; document.documentElement.lang = LANG; document.title = L.title;
  $('mTitle').innerHTML = L.titleHtml; $('mIntro').textContent = L.intro;
  for (const k of ['r1h', 'r1', 'r2h', 'r2', 'r3h', 'r3']) $(k).textContent = L[k];
  $('startBtn').textContent = L.start; $('mBest').textContent = S.best ? L.best(S.best) : '';
  $('scoreLbl').textContent = L.score; $('windLbl').textContent = L.wind;
  $('pauseT').textContent = L.pause; $('resumeBtn').textContent = L.resume; $('quitBtn').textContent = L.menu;
  $('oTitle').textContent = L.over; $('againBtn').textContent = L.again; $('shareBtn').textContent = L.share;
  $('sBasketsL').textContent = L.sBaskets; $('sHeadsL').textContent = L.sHeads; $('sBrokeL').textContent = L.sBroke;
  $('coachText').textContent = L.coach;
  $('langBtn').innerHTML = LANG === 'ru' ? '<b>RU</b>·EN' : 'RU·<b>EN</b>';
  $('friendsH').textContent = L.friendsH;
  if (typeof renderTarget === 'function'){ renderTarget(); if (!$('over').hidden) renderFriends(); }
  if (S.boss) updateHud();
}

// ---------- friends: records travel inside the share link, no server needed ----------
const ME_ID = (() => {
  const u = tg && tg.initDataUnsafe && tg.initDataUnsafe.user;
  if (u && u.id) return 't' + Number(u.id).toString(36);
  let id = store.get('arena.uid'); // same player id as in the other LVV games
  if (!id) { id = 'l' + Math.random().toString(36).slice(2, 9); store.set('arena.uid', id); }
  return id;
})();
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
let friends = {}, target = null, targetBeaten = false, challenger = null;
const myName = () => { const u = tg && tg.initDataUnsafe && tg.initDataUnsafe.user; return String((u && (u.first_name || u.username)) || L.player).slice(0, 14); };
function loadFriends() { try { const f = JSON.parse(store.get('office.friends') || '{}'); friends = f && typeof f === 'object' ? f : {}; } catch (e) { friends = {}; } }
function saveFriends() {
  friends = Object.fromEntries(Object.entries(friends).sort((a, b) => b[1].s - a[1].s).slice(0, 30));
  store.set('office.friends', JSON.stringify(friends));
}
function addFriend(id, name, score) {
  if (typeof id !== 'string' || !/^[a-z0-9]{2,16}$/.test(id) || !(score >= 0)) return;
  const n = String(name || '?').slice(0, 14), s = Math.floor(Math.min(score, 1e8)), cur = friends[id];
  if (!cur || s > cur.s) friends[id] = { n, s }; else if (n !== '?') cur.n = n;
}
const b64u = {
  enc(str) { let bin = ''; new TextEncoder().encode(str).forEach(b => bin += String.fromCharCode(b)); return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); },
  dec(s) { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; return new TextDecoder().decode(Uint8Array.from(atob(s), c => c.charCodeAt(0))); },
};
// sharer first, then the strongest friends, trimmed to Telegram's 512-character start parameter
function encodeBoard() {
  const me = friends[ME_ID] || { n: myName(), s: S.best };
  let list = [[ME_ID, me.s, me.n], ...Object.entries(friends).filter(([id]) => id !== ME_ID).sort((a, b) => b[1].s - a[1].s).map(([id, f]) => [id, f.s, f.n])].slice(0, 8);
  let out = 'b' + b64u.enc(JSON.stringify(list));
  while (out.length > 500 && list.length > 1) { list = list.slice(0, -1); out = 'b' + b64u.enc(JSON.stringify(list)); }
  return out;
}
function decodeBoard(p) {
  try {
    if (!p || p[0] !== 'b') return null;
    const list = JSON.parse(b64u.dec(p.slice(1)));
    return Array.isArray(list) ? list.filter(e => Array.isArray(e) && typeof e[0] === 'string' && typeof e[1] === 'number').slice(0, 10) : null;
  } catch (e) { return null; }
}
function takeIncomingBoard() {
  let p = null;
  try { p = (tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param) || new URLSearchParams(location.search).get('startapp'); } catch (e) {}
  const list = decodeBoard(p);
  if (!list) return;
  for (const [id, s, n] of list) if (id !== ME_ID) addFriend(id, n, s);
  if (list[0] && list[0][0] !== ME_ID) challenger = list[0][0];
  saveFriends();
}
function updateSelf() {
  friends[ME_ID] = { n: myName(), s: Math.max(S.best, friends[ME_ID] ? friends[ME_ID].s : 0) };
  saveFriends();
}
// next friend record to beat: whoever sent the link if still ahead, otherwise the closest friend above you
function pickTarget() {
  const ahead = Object.entries(friends).filter(([id, f]) => id !== ME_ID && f.s > S.best);
  if (!ahead.length) return null;
  const [id, f] = ahead.find(([i]) => i === challenger) || ahead.sort((a, b) => a[1].s - b[1].s)[0];
  return { id, n: f.n, s: f.s };
}
function renderTarget() {
  const el = $('target');
  if (!target) { el.hidden = true; return; }
  el.hidden = false;
  el.textContent = targetBeaten ? L.targetDone(target.n) : L.target(target.n, target.s);
}
function renderFriends() {
  const list = Object.entries(friends).sort((a, b) => b[1].s - a[1].s);
  if (!list.some(([id]) => id !== ME_ID)) { $('friendsTable').innerHTML = `<tr><td class="empty">${esc(L.friendsEmpty)}</td></tr>`; return; }
  const me = list.findIndex(([id]) => id === ME_ID);
  const row = ([id, f], i) => `<tr class="${id === ME_ID ? 'me' : ''}"><td>${i + 1}</td><td>${esc(f.n)}</td><td>${f.s}</td></tr>`;
  $('friendsTable').innerHTML = list.slice(0, 5).map(row).join('') + (me >= 5 ? row(list[me], me) : '');
}

// ---------- boot ----------
addEventListener('resize', resize);
resize();
setupLocation(); // menu backdrop
let last = performance.now();
function frame(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  if (!paused && S.mode === 'play') update(dt);
  else if (S.mode !== 'play') { S.time += dt; S.obst.t += dt; }
  render(dt);
  requestAnimationFrame(frame);
}
cloudInit.then(() => {
  const lg = store.get('arena.lang'); if (I18N[lg]) LANG = lg;
  S.best = +store.get('office.best') || 0;
  loadFriends(); takeIncomingBoard(); updateSelf();
  S.coins = +store.get('office.coins') || 0;
  try { const pu = JSON.parse(store.get('office.pu') || 'null'); if (pu) for (const k of PU_KEYS) S.pu[k] = Math.max(0, +pu[k] || 0); } catch (e) {}
  muted = store.get('office.muted') === '1';
  coached = store.get('office.coached') === '1';
  drawSound(); applyLang();
  requestAnimationFrame(frame);
});
window.__S = S; // debug hook for testing
