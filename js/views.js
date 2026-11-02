'use strict';

const IC_PREV = '<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>';
const IC_CHEV = '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>';
const IC_TICK = '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

function stripHtml(pl) {
  return `<div class="strip" role="group" aria-label="Weeks">${pl.weeks.map(({ m, days }) => {
    const s = days.filter(d => d.type !== 'rest'), n = s.filter(d => (window.S.done || {})[d.id]).length;
    return `<button data-act="wkset" data-v="${m.w}" class="${m.w === window.S.wk ? 'cur' : ''}${n === s.length ? ' full' : ''}" aria-pressed="${m.w === window.S.wk}">${m.w}</button>`;
  }).join('')}</div>`;
}

function todayHtml(wk, cw) {
  if (window.S.wk !== cw) return '';
  const d = wk.days[(new Date().getDay() + 6) % 7];
  if (d.type === 'rest') return `<div class="today"><b>Today is a rest day</b><span class="small muted">${d.items[0]}</span></div>`;
  return `<div class="today"><span class="small muted">Today, ${d.day}</span><b>${d.title}, ${d.mins} min</b><div class="row2"><button class="btn" data-act="tm">Open timers</button><button class="btn ghost" data-act="todone" data-id="${d.id}">${(window.S.done || {})[d.id] ? 'Undo done' : 'Mark done'}</button></div></div>`;
}

window.renderEligibilityCard = function(P, b) {
  const el = window.checkEligibility(P, b);
  return `<div class="note ${el.allOk ? 'ok' : ''}" id="elig-box">
    <b>${el.allOk ? '✓ You meet the primary eligibility criteria' : '⚠ Eligibility Check Notice'}</b>
    <div style="margin-top:4px" class="small">${el.reqText}</div>
    <div class="badge-row">
      <span class="status-pill ${el.eduOk ? 'ok' : 'warn'}">${el.eduOk ? '✓ Education & % Met' : `✗ Needs required degree & ${el.reqPct}%+`}</span>
      <span class="status-pill ${el.ageOk ? 'ok' : 'warn'}">${el.ageOk ? `✓ Age (${el.minA}–${el.maxA} yrs)` : `✗ Age limit: ${el.minA}–${el.maxA} yrs`}</span>
      <span class="status-pill ${el.hOk ? 'ok' : 'warn'}">${el.hOk ? `✓ Height (${el.minH}+ cm)` : `✗ Min Height: ${el.minH} cm`}</span>
    </div>
  </div>`;
};

// 1. Home Defense Dashboard
window.viewHome = function() {
  const fl = window.S.filter || 'All';
  const cats = ['All', 'Agniveer', 'Officer entry', 'Police and paramilitary'];
  const activeExam = window.EXAMS.find(e => e.id === window.S.examId);
  let resumeHtml = '';

  if (window.S.P && Object.keys(window.S.P.base || {}).length > 0 && window.S.start && activeExam) {
    resumeHtml = `<div class="today" style="margin-bottom:18px; display:flex; align-items:center; justify-content:space-between; gap:12px;">
      <div><span class="small muted">Active Training Plan</span><b>${activeExam.name}${window.S.subId ? ' • ' + window.S.subId : ''}</b></div>
      <button class="btn" style="width:auto; padding:10px 22px;" data-act="nav-resume">Resume</button>
    </div>`;
  }

  return `
  ${resumeHtml}
  <div class="hero">
    <h1>Train for the uniform</h1>
    <p class="muted" style="margin-top:6px">Official physical standards, stage-wise cutoffs, medical check & improvement plans, and tactical conditioning.</p>
    <div class="stats">
      <div><b>12</b><span>Forces</span></div>
      <div><b>4-Stage</b><span>Cutoffs</span></div>
      <div><b>10-Point</b><span>Medical Check</span></div>
    </div>
  </div>
  <div class="fchips" role="group">
    ${cats.map(c => `<button data-act="flt" data-v="${c}" aria-pressed="${fl === c}">${c}</button>`).join('')}
  </div>
  <div class="cards-grid">
    ${window.EXAMS.filter(x => fl === 'All' || x.grp === fl).map(x => {
      const sampleEv = (x.branches ? x.branches[0].ev.M : x.ev.M) || [];
      return `<button class="xc" data-act="exam" data-id="${x.id}">
        <span class="tile" style="background:${x.color}">${window.LOGOS[x.id]}</span>
        <div style="flex:1;min-width:0">
          <b>${x.name}</b>
          <span class="small muted">${x.grp}${x.branches ? ` • ${x.branches.length} Branches` : ''}</span>
          <div>${sampleEv.map(e => `<span class="pill">${window.shortStd(e)}</span>`).join('')}</div>
        </div>
        <span class="xc-chev">${IC_CHEV}</span>
      </button>`;
    }).join('')}
  </div>`;
};

// 2. Branch & Sub-Branch Selection
window.viewBranchPick = function() {
  const ex = window.EXAMS.find(e => e.id === window.S.examId);
  return `<div class="page-col">
    <button class="link small" data-act="back-home">← All Forces</button>
    <h1 style="margin-top:8px">${ex.name}</h1>
    <p class="muted small">Select your entry branch to load its education, cutoff, physical & medical standards.</p>
    <div style="margin-top:16px; display:flex; flex-direction:column; gap:10px;">
      ${ex.branches.map(b => `<button class="xc" data-act="branch" data-id="${b.id}">
        <span class="tile" style="background:${ex.color}">${window.LOGOS[ex.id]}</span>
        <div style="flex:1">
          <b>${b.name}</b>
          <span class="small muted" style="display:block">${b.desc}</span>
          <span class="pill">${b.edu ? b.edu.req.split('with')[0] : 'Check Eligibility'}</span>
        </div>
        <span class="xc-chev">${IC_CHEV}</span>
      </button>`).join('')}
    </div>
  </div>`;
};

window.viewSubPick = function() {
  const ex = window.EXAMS.find(e => e.id === window.S.examId);
  const b = ex.branches.find(br => br.id === window.S.branchId);
  return `<div class="page-col">
    <button class="link small" data-act="back-branch">← Back to Branches</button>
    <h1 style="margin-top:8px">${b.name}</h1>
    <p class="muted small">Choose your sub-trait specialization:</p>
    <div style="margin-top:16px; display:flex; flex-direction:column; gap:10px;">
      ${b.sub.map(s => `<button class="xc" data-act="sub" data-v="${s}">
        <div style="flex:1"><b>${s}</b><span class="small muted">${ex.name}</span></div>
        <span class="xc-chev">${IC_CHEV}</span>
      </button>`).join('')}
    </div>
  </div>`;
};

// 3. Setup Wizard with Educational Qualification Check
window.viewSetup = function() {
  const ex = window.EXAMS.find(e => e.id === window.S.examId);
  const b = ex.branches ? (ex.branches.find(br => br.id === window.S.branchId) || ex.branches[0]) : ex;
  const st = window.S.step, P = window.S.P;
  const evs = b.ev[P.g] && b.ev[P.g].length ? b.ev[P.g] : b.ev.M;

  evs.forEach(e => { if (P.base[e.id] == null) P.base[e.id] = window.defBase(e); });

  const sec = (i, c) => `<section ${st === i ? '' : 'hidden'}>${c}</section>`;
  const seg = (act, cur, opts) => `<div class="seg" role="group">${opts.map(([v, l]) => `<button type="button" data-act="${act}" data-v="${v}" aria-pressed="${String(v) === String(cur)}">${l}</button>`).join('')}</div>`;

  return `<div class="page-col">
    <button class="link small" data-act="${window.S.subId ? 'back-sub' : (ex.branches ? 'back-branch' : 'back-home')}">← Change selection</button>
    <h1 style="margin-top:8px">${b.name}${window.S.subId ? ` (${window.S.subId})` : ''}</h1>
    <div class="steps">${[0, 1, 2].map(i => `<i class="${i <= st ? 'on' : ''}"></i>`).join('')}</div>
    <p class="muted small">Step ${st + 1} of 3: ${['Eligibility, Education & Body', 'Where you are today', 'Timeline and food'][st]}</p>

    ${sec(0, `
      <div class="field"><span class="lbl">Gender</span>${seg('g', P.g, [['M', 'Male'], ['F', 'Female']])}</div>
      <div class="g3 field">
        <div><label class="lbl">Age</label><input type="number" data-k="age" value="${P.age}"></div>
        <div><label class="lbl">Height (cm)</label><input type="number" data-k="h" value="${P.h}"></div>
        <div><label class="lbl">Weight (kg)</label><input type="number" data-k="w" value="${P.w}"></div>
      </div>
      <div class="g2 field">
        <div>
          <label class="lbl">Highest Education</label>
          <select data-k="eduLevel">
            ${Object.entries(window.EDU_RANKS).map(([k, o]) => `<option value="${k}" ${P.eduLevel === k ? 'selected' : ''}>${o.label}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="lbl">Aggregate Marks (%)</label>
          <input type="number" min="30" max="100" data-k="eduPct" value="${P.eduPct || 65}">
        </div>
      </div>
      <div id="elig-wrap">${window.renderEligibilityCard(P, b)}</div>
    `)}

    ${sec(1, `<p class="muted small" style="margin-top:8px">The plan builds from your current numbers to the test standard.</p>` +
      evs.map(e => {
        const v = P.base[e.id];
        if (e.t === 'run') {
          return `<div class="field"><span class="lbl">Your ${e.label} time today</span>
            <div class="g2">
              <div><input type="number" data-b="run" data-p="m" value="${Math.floor(v / 60)}"><div class="help">minutes</div></div>
              <div><input type="number" data-b="run" data-p="s" value="${Math.round(v % 60)}"><div class="help">seconds</div></div>
            </div>
          </div>`;
        }
        return `<div class="field"><label class="lbl">Current ${e.label}${e.t === 'jump' ? ' (feet)' : ''}</label><input type="number" step="${e.t === 'jump' ? 0.25 : 1}" data-b="${e.id}" value="${v}"></div>`;
      }).join('')
    )}

    ${sec(2, `
      <div class="field"><label class="lbl">Weeks until your test: <span id="wk-out">${P.weeks}</span></label><input type="range" min="4" max="26" step="1" data-k="weeks" value="${P.weeks}"></div>
      <div class="field"><span class="lbl">Training days per week</span>${seg('days', P.days, [[3, '3'], [4, '4'], [5, '5'], [6, '6']])}</div>
      <div class="field"><span class="lbl">What do you eat?</span>${seg('diet', P.diet, [['veg', 'Vegetarian'], ['egg', 'With eggs'], ['nonveg', 'Non-veg']])}</div>
    `)}

    <div class="row2" style="margin-top:24px;">
      ${st ? '<button class="btn ghost" data-act="prev">Back</button>' : ''}
      <button class="btn" data-act="${st === 2 ? 'build' : 'next'}">${st === 2 ? 'Build my plan' : 'Next'}</button>
    </div>
  </div>`;
};

// 4. Plan View
window.viewPlan = function() {
  const pl = window.ensurePlan(), W = window.S.P.weeks;
  const wkIdx = window.clamp(window.S.wk || 1, 1, W) - 1;
  const wk = pl.weeks[wkIdx], m = wk.m, cw = window.currentWeek();
  const rv = pl.valAt(pl.rEv, m.w);
  const others = pl.evs.filter(e => e !== pl.rEv);
  const sess = wk.days.filter(d => d.type !== 'rest'), dn = sess.filter(d => (window.S.done || {})[d.id]).length;

  return `<div class="page-col">
    <div class="hero">
      <div class="pager">
        <button data-act="wk" data-v="-1" aria-label="Previous week" ${window.S.wk <= 1 ? 'disabled' : ''}>${IC_PREV}</button>
        <div class="mid">
          <h1>Week ${m.w} of ${W}</h1>
          <span class="tag${m.w === cw ? ' hi' : ''}">${m.phase}${m.w === cw ? ', this week' : ''}</span>
        </div>
        <button data-act="wk" data-v="1" aria-label="Next week" ${window.S.wk >= W ? 'disabled' : ''} style="transform:scaleX(-1)">${IC_PREV}</button>
      </div>
      <div style="margin-top:18px">
        <div class="clock">${window.fmt(rv)}</div>
        <div class="muted small">${pl.rEv.label} target this week. Plan goal ${window.fmt(pl.goals.run)}, test standard ${window.fmt(pl.rEv.qual)}.</div>
      </div>
      ${others.length ? `<div class="stats">${others.map(e => `<div><b>${window.showVal(e, pl.valAt(e, m.w))}</b><span>${e.label}, goal ${window.showVal(e, pl.goals[e.id])}</span></div>`).join('')}</div>` : ''}
    </div>

    ${stripHtml(pl)}
    ${todayHtml(wk, cw)}

    ${m.deload ? '<div class="note">Lighter week. Volume drops so your body absorbs the training.</div>' : ''}
    ${m.bench ? `<div class="note">${m.last ? 'Test week: one benchmark, light sessions, then rest.' : 'Benchmark week: your Monday session is a test. Log the results in Progress.'}</div>` : ''}

    <h2 id="sess-hdr">Sessions, ${dn} of ${sess.length} done</h2>
    <div id="days">
      ${wk.days.map(d => `<details class="day t-${d.type}">
        <summary>
          <span class="dn">${d.day}</span>
          <span class="dt"><b class="${d.type === 'rest' ? 'rest' : ''}">${d.title}</b><span>${d.mins} min</span></span>
          ${d.type !== 'rest' ? `<button class="chk${(window.S.done || {})[d.id] ? ' on' : ''}" data-act="done" data-id="${d.id}" aria-pressed="${!!(window.S.done || {})[d.id]}">${IC_TICK}</button>` : ''}
        </summary>
        <ul>${d.items.map(i => `<li>${i}</li>`).join('')}</ul>
      </details>`).join('')}
    </div>
  </div>`;
};

// 5. Run View
window.viewRun = function() {
  const lbl = { idle: 'Start run', run: 'Pause', pause: 'Resume' }[window.RUN.st];
  const runs = window.S.runs || [];
  const km7 = runs.filter(r => Date.now() - new Date(r.at) < 7 * 864e5).reduce((a, r) => a + r.km, 0);

  return `<div class="page-col">
    <div class="hero">
      <h1>Daily run</h1>
      <div class="stats">
        <div><b>${runs.length}</b><span>Total runs</span></div>
        <div><b>${km7.toFixed(1)}</b><span>km, last 7 days</span></div>
      </div>
    </div>
    <div class="mapbox"><div id="rmap">${window.mapSvg(window.RUN.pts, 0)}</div><div class="gps" id="rg">GPS off</div></div>
    <div class="rstats">
      <div><b id="rt">0:00</b><span>Time</span></div>
      <div><b id="rd">0.00</b><span>km</span></div>
      <div><b id="rp">--:--</b><span>min per km</span></div>
    </div>
    <div class="row2">
      <button class="btn" data-act="rgo">${lbl}</button>
      ${window.RUN.st === 'pause' ? '<button class="btn ghost" data-act="rfin">Finish & submit</button>' : ''}
    </div>
    ${window.RUN.st === 'pause' ? '<button class="link small" style="margin-top:12px" data-act="rdisc">Discard this run</button>' : ''}

    <h2>No GPS? Submit manually</h2>
    <div class="g3">
      <div><label class="lbl">Distance (km)</label><input id="mr-km" type="number" step="0.01"></div>
      <div><label class="lbl">Min</label><input id="mr-m" type="number"></div>
      <div><label class="lbl">Sec</label><input id="mr-s" type="number"></div>
    </div>
    <button class="btn ghost" style="margin-top:12px" data-act="rman">Submit run</button>

    <h2>Your runs</h2>
    ${runs.length ? runs.map((r, i) => `<div class="run">
      <div class="rth">${window.mapSvg(r.route || [], 1)}</div>
      <div style="flex:1"><b>${r.km.toFixed(2)} km in ${window.hms(r.s)}</b><span class="small muted">${window.pc(r.km, r.s)}/km • ${new Date(r.at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span></div>
      <button class="link small" data-act="rdel" data-i="${i}">Delete</button>
    </div>`).join('') : '<p class="muted small">No runs logged yet.</p>'}
  </div>`;
};

// 6. Diet View
window.viewDiet = function() {
  const d = window.dietCalc(window.S.P);
  const mode = { gain: 'Gaining lean weight', lose: 'Losing fat slowly', hold: 'Holding weight' }[d.mode];
  return `<div class="page-col">
    <div class="hero">
      <h1>Daily fuel</h1>
      <div style="margin-top:14px"><div class="clock">${d.kcal}</div><div class="muted small">calories a day • ${mode} • BMI ${d.bmi.toFixed(1)}</div></div>
    </div>
    <div class="macros">
      <div><b>${d.protein}g</b><span>Protein</span></div>
      <div><b>${d.carbs}g</b><span>Carbs</span></div>
      <div><b>${d.fat}g</b><span>Fat</span></div>
      <div><b>${d.water}L</b><span>Water</span></div>
    </div>
    <h2>A sample day</h2>
    ${d.meals.map(m => `<div class="meal">
      <header><h3>${m.n} <span class="muted small" style="font-weight:400">${m.t}</span></h3><span class="small muted">${m.kcal} kcal</span></header>
      <ul>${m.rows.map(r => `<li><span>${r.name}</span><span>${r.q} ${r.unit}</span></li>`).join('')}</ul>
    </div>`).join('')}
  </div>`;
};

// 7. Standards, Cutoffs, Education & Medical Checklist View
window.viewStd = function() {
  const ex = window.EXAMS.find(e => e.id === window.S.examId);
  const b = ex.branches ? (ex.branches.find(br => br.id === window.S.branchId) || ex.branches[0]) : ex;
  const evs = b.ev[window.S.P.g] && b.ev[window.S.P.g].length ? b.ev[window.S.P.g] : b.ev.M;
  const subTab = window.S.stdTab || 'cutoffs';
  const cf = b.cutoffs || ex.cutoffs || {};
  const medMap = window.S.med || {};

  const fitCount = window.MED_CHECKLIST.filter(m => medMap[m.id] === 'fit').length;
  const fixItems = window.MED_CHECKLIST.filter(m => medMap[m.id] === 'fix');

  return `<div class="page-col">
    <h1>${b.name}</h1>
    <p class="muted small" style="margin-top:4px">${ex.name}${window.S.subId ? ` • ${window.S.subId}` : ''}</p>

    <div class="seg" style="margin-top:14px">
      <button type="button" data-act="stdtab" data-v="cutoffs" aria-pressed="${subTab === 'cutoffs'}">Cutoffs, Edu & PFT</button>
      <button type="button" data-act="stdtab" data-v="medical" aria-pressed="${subTab === 'medical'}">Medical Checklist (${fitCount}/10)</button>
    </div>

    ${subTab === 'cutoffs' ? `
      <h2>Educational & Age Eligibility</h2>
      ${window.renderEligibilityCard(window.S.P, b)}

      <h2>4-Stage Cutoff & Selection Breakdown</h2>
      <div class="cutoff-grid">
        <div class="cutoff-card">
          <span class="stage">1. Written Cutoff</span>
          <b>${cf.written || 'Check Notice'}</b>
          <p>Safe target score based on recent cycles.</p>
        </div>
        <div class="cutoff-card">
          <span class="stage">2. Physical (PFT/PET)</span>
          <b>${cf.physical || 'Qualifying'}</b>
          <p>Field endurance & strength threshold.</p>
        </div>
        <div class="cutoff-card">
          <span class="stage">3. Medical Standard</span>
          <b>${cf.medical || 'SHAPE-1 Fit'}</b>
          <p>Required medical classification.</p>
        </div>
        <div class="cutoff-card">
          <span class="stage">4. Interview / Merit</span>
          <b>${cf.interview || 'Written Merit'}</b>
          <p>SSB / Adaptability / Final selection weightage.</p>
        </div>
      </div>

      <h2>Physical fitness test</h2>
      ${evs.map(e => `<div class="trow">
        <div><b>${e.label}</b><span class="small muted" style="display:block">${window.stdText(e)}</span></div>
        <div style="text-align:right"><b>${window.showVal(e, window.goalOf(e))}</b><span class="small muted" style="display:block">your goal</span></div>
      </div>`).join('')}

      <h2>Body measurements</h2>
      <div class="trow"><p class="small">${b.pmt[window.S.P.g] || b.pmt.M}</p></div>

      <h2>Good to know</h2>
      <ul style="padding-left:20px" class="small muted">${(b.notes || ex.notes).map(n => `<li style="margin:6px 0">${n}</li>`).join('')}</ul>
    ` : `
      <div class="hero" style="margin-top:14px">
        <h1>Medical Readiness</h1>
        <div class="stats">
          <div><b>${fitCount} / 10</b><span>Cleared Fit</span></div>
          <div><b>${fixItems.length}</b><span>Marked for Improvement</span></div>
        </div>
      </div>

      ${fixItems.length ? `
        <h2>Your Medical Improvement Action Plan</h2>
        <div class="note">
          <b>Focus on these ${fixItems.length} area(s) before your Medical Board:</b>
          <ul style="padding-left:18px; margin-top:8px">
            ${fixItems.map(item => `<li style="margin-bottom:6px"><b>${item.title}:</b> ${item.fix[0]}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <h2>10-Point Defense Medical Checklist</h2>
      <p class="small muted">Tap each parameter to inspect the standard, self-test at home, and mark as <b>Fit</b> or <b>Needs Work</b>.</p>

      <div>
        ${window.MED_CHECKLIST.map((m, idx) => {
          const st = medMap[m.id];
          const cls = st === 'fit' ? 't-test' : st === 'fix' ? 't-fix' : '';
          const badge = st === 'fit' ? 'FIT' : st === 'fix' ? 'FIX' : `#${idx + 1}`;
          return `<details class="day ${cls}">
            <summary>
              <span class="dn">${badge}</span>
              <span class="dt">
                <b>${m.title}</b>
                <span>${m.cat} • ${st === 'fit' ? 'Cleared' : st === 'fix' ? 'Needs improvement' : 'Tap to verify'}</span>
              </span>
            </summary>
            <ul>
              <li><b>Official Standard:</b> ${m.std}</li>
              <li><b>Self-Check:</b> ${m.check}</li>
              ${m.fix.map(f => `<li><b>Improvement Tip:</b> ${f}</li>`).join('')}
            </ul>
            <div class="med-actions">
              <button type="button" class="med-btn ${st === 'fit' ? 'fit-on' : ''}" data-act="medset" data-id="${m.id}" data-v="fit">✓ Mark Fit</button>
              <button type="button" class="med-btn ${st === 'fix' ? 'fix-on' : ''}" data-act="medset" data-id="${m.id}" data-v="fix">⚠ Needs Work (Add to Plan)</button>
            </div>
          </details>`;
        }).join('')}
      </div>
    `}
  </div>`;
};

// 8. Progress View
window.viewProg = function() {
  const pl = window.ensurePlan(), ex = window.EXAMS.find(e => e.id === window.S.examId);
  const all = pl.weeks.flatMap(w => w.days).filter(d => d.type !== 'rest');
  const dn = all.filter(d => (window.S.done || {})[d.id]).length;
  const pct = all.length ? Math.round(dn / all.length * 100) : 0;

  const rows = pl.evs.map(e => {
    const b = window.S.P.base[e.id], g = pl.goals[e.id], c = window.latest(e.id) ?? b;
    const p = e.t === 'run' ? (b <= g ? 1 : (b - c) / (b - g)) : (b >= g ? 1 : (c - b) / (g - b));
    const pp = Math.round(window.clamp(p, 0, 1) * 100);
    return `<div class="trow" style="display:block">
      <div style="display:flex;justify-content:space-between"><b>${e.label}</b><span><b>${window.showVal(e, c)}</b> <span class="muted small">of ${window.showVal(e, g)}</span></span></div>
      <div class="lane"><i style="width:${pp}%"></i></div>
    </div>`;
  }).join('');

  const form = pl.evs.map(e => e.t === 'run'
    ? `<div class="field"><span class="lbl">${e.label}</span><div class="g2"><input type="number" id="lg-run-m" placeholder="min"><input type="number" id="lg-run-s" placeholder="sec"></div></div>`
    : `<div class="field"><label class="lbl">${e.label}</label><input type="number" id="lg-${e.id}"></div>`).join('');

  return `<div class="page-col">
    <div class="hero">
      <h1>Progress</h1>
      <div style="margin-top:14px"><div class="clock">${pct}%</div><div class="muted small">${dn} of ${all.length} sessions completed</div></div>
    </div>
    <h2>Readiness for ${ex.name}</h2>
    ${rows}
    <h2>Log a benchmark</h2>
    ${form}
    <button class="btn" data-act="log">Save results</button>
    <h2>Plan settings</h2>
    <button class="btn ghost" data-act="reset">Start over with a new exam</button>
  </div>`;
};