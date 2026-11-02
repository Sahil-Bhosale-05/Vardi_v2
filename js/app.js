'use strict';

const app = document.querySelector('#app');
const nav = document.querySelector('#tabs');
const tabsInner = document.querySelector('#tabs-inner');
const whoWrap = document.querySelector('#who-wrap');
const whoLabel = document.querySelector('#who');
const whoCode = document.querySelector('#who-code');
const tmBtn = document.querySelector('#tm');

window.S = { screen: 'home', examId: null, branchId: null, subId: null, step: 0, tab: 'plan', stdTab: 'cutoffs', wk: 1, P: null, done: {}, med: {}, logs: [], runs: [] };
window.PLAN = null;
window.RUN = { st: 'idle', acc: 0, t0: 0, pts: [], dist: 0, wid: null, accy: null, msg: '', wl: null };
const TM = { mode: 'sw', acc: 0, t0: 0, on: false, end: 0, fin: 0 };

const defaultP = () => ({ g: 'M', age: 20, h: 170, w: 62, eduLevel: '12th_pcm', eduPct: 65, days: 4, weeks: 12, diet: 'veg', goalMode: 'auto', base: {} });

function save() { try { localStorage.setItem('vardi:state', JSON.stringify(window.S)); } catch (e) {} }
function load() {
  try {
    const r = localStorage.getItem('vardi:state');
    if (r) window.S = Object.assign(window.S, JSON.parse(r));
    const th = localStorage.getItem('vardi:theme');
    if (th) document.documentElement.dataset.theme = th;
  } catch (e) {}
  window.S.done = window.S.done || {};
  window.S.med = window.S.med || {};
  window.S.logs = window.S.logs || [];
  window.S.runs = window.S.runs || [];
  if (window.S.P) {
    window.S.P.eduLevel = window.S.P.eduLevel || '12th_pcm';
    window.S.P.eduPct = window.S.P.eduPct || 65;
  }
  if (!window.S.examId || !window.S.P || !window.S.start) window.S.screen = 'home';
}

window.ensurePlan = () => {
  if (!window.PLAN) {
    const ex = window.EXAMS.find(e => e.id === window.S.examId);
    const b = ex.branches ? (ex.branches.find(br => br.id === window.S.branchId) || ex.branches[0]) : ex;
    const evs = b.ev[window.S.P.g] && b.ev[window.S.P.g].length ? b.ev[window.S.P.g] : b.ev.M;
    window.PLAN = window.buildPlan(window.S.P, evs, ex.id);
  }
  return window.PLAN;
};
window.currentWeek = () => window.clamp(Math.floor((Date.now() - new Date(window.S.start).getTime()) / (7 * 864e5)) + 1, 1, window.S.P.weeks);
window.latest = id => { for (let i = window.S.logs.length - 1; i >= 0; i--) if (window.S.logs[i].v[id] != null) return window.S.logs[i].v[id]; return null; };

function render() {
  try {
    const S = window.S;
    const activeExam = window.EXAMS.find(e => e.id === S.examId);

    if (['home', 'branch', 'sub', 'setup'].includes(S.screen) || !activeExam) {
      nav.hidden = true;
      whoWrap.hidden = true;
      tmBtn.hidden = true;
      if (S.screen === 'branch' && activeExam) app.innerHTML = window.viewBranchPick();
      else if (S.screen === 'sub' && activeExam) app.innerHTML = window.viewSubPick();
      else if (S.screen === 'setup' && activeExam) app.innerHTML = window.viewSetup();
      else { S.screen = 'home'; app.innerHTML = window.viewHome(); }
    } else {
      nav.hidden = false;
      whoWrap.hidden = false;
      tmBtn.hidden = false;
      whoCode.textContent = activeExam.code || 'VD';
      whoLabel.textContent = activeExam.name.split(' (')[0];

      app.innerHTML = { plan: window.viewPlan, run: window.viewRun, diet: window.viewDiet, std: window.viewStd, prog: window.viewProg }[S.tab]();

      tabsInner.innerHTML = [
        ['plan', 'Plan', '<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/></svg>'],
        ['run', 'Run', '<svg viewBox="0 0 24 24"><path d="M12 21s-6-5.2-6-10a6 6 0 0 1 12 0c0 4.8-6 10-6 10z"/><circle cx="12" cy="11" r="2"/></svg>'],
        ['diet', 'Diet', '<svg viewBox="0 0 24 24"><path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M8 7c0-1.5 1.5-1.5 1.5-3M13 7c0-1.5 1.5-1.5 1.5-3"/></svg>'],
        ['std', 'Standards', '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8"/></svg>'],
        ['prog', 'Progress', '<svg viewBox="0 0 24 24"><path d="M4 19V5M4 19h16M8 15l4-4 3 3 5-6"/></svg>']
      ].map(([k, l, icon]) => `<button data-act="tab" data-v="${k}" ${S.tab === k ? 'aria-current="page"' : ''}>${icon}${l}</button>`).join('');
    }
    window.scrollTo(0, 0);
  } catch (err) {
    console.error(err);
    window.S.screen = 'home';
    app.innerHTML = window.viewHome();
  }
}

// Timers Sheet Logic
const swNow = () => TM.acc + (TM.on ? Date.now() - TM.t0 : 0);
const tmText = () => TM.mode === 'sw' ? (s => Math.floor(s / 60) + ':' + (s % 60).toFixed(1).padStart(4, '0'))(swNow() / 1000) : TM.fin ? 'Go!' : window.fmt(TM.end ? Math.max(0, Math.ceil((TM.end - Date.now()) / 1000)) : 0);

function tmShow(open) {
  const sh = document.querySelector('#sheet');
  sh.hidden = !open;
  if (!open) return;
  sh.innerHTML = `<div class="card" role="dialog" aria-label="Timers">
    <div class="seg">
      <button data-act="tmmode" data-v="sw" aria-pressed="${TM.mode === 'sw'}">Stopwatch</button>
      <button data-act="tmmode" data-v="rest" aria-pressed="${TM.mode === 'rest'}">Rest timer</button>
    </div>
    <div class="clock" id="tmv">${tmText()}</div>
    ${TM.mode === 'sw'
      ? `<div class="row2"><button class="btn" data-act="swgo">${TM.on ? 'Stop' : 'Start'}</button><button class="btn ghost" data-act="swreset">Reset</button></div>`
      : `<div class="chips">${[30, 60, 90, 120].map(s => `<button class="btn" data-act="rest" data-v="${s}">${s}s</button>`).join('')}</div>`}
    <button class="btn ghost" style="margin-top:12px" data-act="tmx">Close</button>
  </div>`;
}
setInterval(() => {
  const e = document.getElementById('tmv');
  if (!e) return;
  if (TM.mode === 'rest' && TM.end && Date.now() >= TM.end) { TM.end = 0; TM.fin = 1; if (navigator.vibrate) navigator.vibrate([200, 100, 200]); }
  e.textContent = tmText();
}, 100);

// GPS Tracker
const rEl = () => window.RUN.acc + (window.RUN.st === 'run' ? Date.now() - window.RUN.t0 : 0);
const hav = (a, b) => { const R = 6371000, r = Math.PI / 180, q = Math.sin((b.la - a.la) * r / 2) ** 2 + Math.cos(a.la * r) * Math.cos(b.la * r) * Math.sin((b.lo - a.lo) * r / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(q)); };

function paintGPS() {
  const e = document.getElementById('rt');
  if (!e || window.S.tab !== 'run') return;
  const s = rEl() / 1000;
  e.textContent = window.hms(s);
  document.getElementById('rd').textContent = window.RUN.dist.toFixed(2);
  document.getElementById('rp').textContent = window.pc(window.RUN.dist, s);
  const rg = document.getElementById('rg');
  if (rg) rg.textContent = window.RUN.msg || (window.RUN.st === 'idle' ? 'GPS off' : window.RUN.accy == null ? 'Searching GPS...' : `GPS ±${window.RUN.accy}m`);
  const rmap = document.getElementById('rmap');
  if (rmap) rmap.innerHTML = window.mapSvg(window.RUN.pts, 0);
}
setInterval(paintGPS, 500);

function watch() {
  if (!navigator.geolocation) { window.RUN.msg = 'No GPS available'; return; }
  window.RUN.wid = navigator.geolocation.watchPosition(p => {
    const c = p.coords; window.RUN.accy = Math.round(c.accuracy); window.RUN.msg = '';
    if (window.RUN.st !== 'run' || c.accuracy > 35) return paintGPS();
    const n = { la: c.latitude, lo: c.longitude, t: p.timestamp }, l = window.RUN.pts[window.RUN.pts.length - 1];
    if (l) { const m = hav(l, n), dt = (n.t - l.t) / 1000; if (m < 3 || dt <= 0 || m / dt > 12) return paintGPS(); window.RUN.dist += m / 1000; }
    window.RUN.pts.push(n); paintGPS();
  }, () => { window.RUN.msg = 'Waiting for GPS signal...'; paintGPS(); }, { enableHighAccuracy: true });
}
function unwatch() { try { if (window.RUN.wid != null) navigator.geolocation.clearWatch(window.RUN.wid); } catch (e) {} window.RUN.wid = null; }

// Click Events
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]');
  const menu = document.getElementById('main-menu');
  if (menu && !menu.classList.contains('hidden') && (!t || t.dataset.act !== 'menu')) menu.classList.add('hidden');
  if (!t) return;

  const a = t.dataset.act, v = t.dataset.v, S = window.S;

  if (a === 'menu') { menu.classList.toggle('hidden'); return; }
  if (a === 'theme') {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('vardi:theme', root.dataset.theme); } catch (er) {}
    return;
  }
  if (a === 'nav-home') { S.screen = 'home'; render(); return; }
  if (a === 'nav-resume') { S.screen = 'app'; render(); return; }
  if (a === 'nav-prog') { if (S.P && S.start) { S.tab = 'prog'; S.screen = 'app'; render(); } else alert('Select an exam and build your plan first.'); return; }
  if (a === 'nav-acct') { alert('Cadet Profile: All training and medical checklist data is stored locally on your device.'); return; }
  if (a === 'nav-faq') { alert('Vardi FAQ: Cutoffs, educational criteria, and medical checklists are compiled from official defense recruitment notifications.'); return; }

  // Timers
  if (a === 'tm') { tmShow(true); return; }
  if (a === 'tmx') { tmShow(false); return; }
  if (a === 'tmmode') { TM.mode = v; tmShow(true); return; }
  if (a === 'swgo') { if (TM.on) { TM.acc += Date.now() - TM.t0; TM.on = false; } else { TM.t0 = Date.now(); TM.on = true; } tmShow(true); return; }
  if (a === 'swreset') { TM.acc = 0; TM.on = false; tmShow(true); return; }
  if (a === 'rest') { TM.end = Date.now() + v * 1000; TM.fin = 0; tmShow(true); return; }

  // Navigation & Setup
  if (a === 'flt') { S.filter = v; render(); return; }
  if (a === 'tab') { S.tab = v; save(); render(); return; }
  if (a === 'stdtab') { S.stdTab = v; save(); render(); return; }
  if (a === 'medset') {
    const id = t.dataset.id;
    S.med[id] = S.med[id] === v ? null : v;
    save(); render(); return;
  }

  if (a === 'exam') {
    S.examId = t.dataset.id; S.branchId = null; S.subId = null; S.P = defaultP();
    const ex = window.EXAMS.find(x => x.id === S.examId);
    S.screen = ex.branches ? 'branch' : 'setup'; S.step = 0; render(); return;
  }
  if (a === 'branch') {
    S.branchId = t.dataset.id; S.subId = null;
    const ex = window.EXAMS.find(x => x.id === S.examId);
    const b = ex.branches.find(br => br.id === S.branchId);
    S.screen = b.sub ? 'sub' : 'setup'; S.step = 0; render(); return;
  }
  if (a === 'sub') { S.subId = v; S.screen = 'setup'; S.step = 0; render(); return; }
  if (a === 'back-home') { S.screen = 'home'; render(); return; }
  if (a === 'back-branch') { S.screen = 'branch'; render(); return; }
  if (a === 'back-sub') { S.screen = 'sub'; render(); return; }
  if (a === 'next') { S.step++; render(); return; }
  if (a === 'prev') { S.step--; render(); return; }
  if (a === 'g') { S.P.g = v; S.P.base = {}; render(); return; }
  if (a === 'days') { S.P.days = +v; render(); return; }
  if (a === 'diet') { S.P.diet = v; render(); return; }

  if (a === 'build') {
    window.PLAN = null; S.screen = 'app'; S.tab = 'plan'; S.start = new Date().toISOString(); S.wk = 1; S.done = {}; S.logs = [];
    save(); render(); return;
  }

  // Plan & Progress Actions
  if (a === 'wk') { S.wk = window.clamp(S.wk + +v, 1, S.P.weeks); save(); render(); return; }
  if (a === 'wkset') { S.wk = +v; save(); render(); return; }
  if (a === 'done') {
    e.preventDefault();
    const id = t.dataset.id; S.done[id] = !S.done[id];
    t.classList.toggle('on', !!S.done[id]);
    t.setAttribute('aria-pressed', !!S.done[id]);
    const wk = window.ensurePlan().weeks[S.wk - 1], ss = wk.days.filter(d => d.type !== 'rest');
    const hdr = document.getElementById('sess-hdr');
    if (hdr) hdr.textContent = `Sessions, ${ss.filter(d => S.done[d.id]).length} of ${ss.length} done`;
    save(); return;
  }
  if (a === 'todone') { S.done[t.dataset.id] = !S.done[t.dataset.id]; save(); render(); return; }

  // Run Tracker
  if (a === 'rgo') {
    if (window.RUN.st === 'idle') { Object.assign(window.RUN, { acc: 0, pts: [], dist: 0, accy: null, msg: '', t0: Date.now(), st: 'run' }); watch(); }
    else if (window.RUN.st === 'run') { window.RUN.acc += Date.now() - window.RUN.t0; window.RUN.st = 'pause'; }
    else { window.RUN.t0 = Date.now(); window.RUN.st = 'run'; }
    render(); return;
  }
  if (a === 'rfin') {
    if (window.RUN.st === 'run') window.RUN.acc += Date.now() - window.RUN.t0;
    const s = Math.round(window.RUN.acc / 1000), km = +window.RUN.dist.toFixed(2), route = window.RUN.pts; unwatch();
    Object.assign(window.RUN, { st: 'idle', acc: 0, pts: [], dist: 0 });
    if (km >= 0.05 && s >= 20) { S.runs.unshift({ km, s, route, at: new Date().toISOString() }); save(); }
    render(); return;
  }
  if (a === 'rdisc') { unwatch(); Object.assign(window.RUN, { st: 'idle', acc: 0, pts: [], dist: 0 }); render(); return; }
  if (a === 'rman') {
    const km = parseFloat(document.getElementById('mr-km').value), s = (+(document.getElementById('mr-m').value) || 0) * 60 + (+(document.getElementById('mr-s').value) || 0);
    if (km >= 0.1 && s >= 20) { S.runs.unshift({ km: +km.toFixed(2), s, route: [], at: new Date().toISOString() }); save(); render(); }
    return;
  }
  if (a === 'rdel') { S.runs.splice(+t.dataset.i, 1); save(); render(); return; }

  if (a === 'log') {
    const pl = window.ensurePlan(), vals = {};
    pl.evs.forEach(ev => {
      if (ev.t === 'run') { const m = document.getElementById('lg-run-m').value, s = document.getElementById('lg-run-s').value; if (m || s) vals.run = (+m || 0) * 60 + (+s || 0); }
      else { const r = document.getElementById('lg-' + ev.id).value; if (r) vals[ev.id] = +r; }
    });
    if (Object.keys(vals).length) { S.logs.push({ d: new Date().toLocaleDateString('en-IN'), v: vals }); save(); render(); }
    return;
  }
  if (a === 'reset') {
    if (confirm('Erase your current plan and start over?')) {
      window.PLAN = null;
      window.S = { screen: 'home', examId: null, branchId: null, subId: null, step: 0, tab: 'plan', stdTab: 'cutoffs', wk: 1, P: null, done: {}, med: {}, logs: [], runs: [] };
      save(); render();
    }
  }
});

// Live Input & Eligibility Updates
document.addEventListener('input', e => {
  const t = e.target;
  if (t.dataset.k) {
    window.S.P[t.dataset.k] = t.dataset.k === 'eduLevel' ? t.value : (parseFloat(t.value) || 0);
    if (t.dataset.k === 'weeks') {
      const out = document.getElementById('wk-out');
      if (out) out.textContent = t.value;
    }
    const eligWrap = document.getElementById('elig-wrap');
    if (eligWrap && window.S.examId) {
      const ex = window.EXAMS.find(x => x.id === window.S.examId);
      const b = ex.branches ? (ex.branches.find(br => br.id === window.S.branchId) || ex.branches[0]) : ex;
      eligWrap.innerHTML = window.renderEligibilityCard(window.S.P, b);
    }
  }
  if (t.dataset.b) {
    if (t.dataset.b === 'run') {
      const m = parseFloat(document.querySelector('[data-b="run"][data-p="m"]')?.value) || 0;
      const s = parseFloat(document.querySelector('[data-b="run"][data-p="s"]')?.value) || 0;
      window.S.P.base.run = m * 60 + s;
    } else {
      window.S.P.base[t.dataset.b] = parseFloat(t.value) || 0;
    }
  }
});

load();
render();