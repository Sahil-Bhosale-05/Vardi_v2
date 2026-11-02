'use strict';

window.clamp = (x, a, b) => Math.max(a, Math.min(b, x));
window.half = x => Math.round(x * 2) / 2;
window.fmt = s => { s = Math.round(s); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
window.ft = v => { const f = Math.floor(v + 1e-6), i = Math.round((v - f) * 12); return i ? `${f} ft ${i} in` : `${f} ft`; };
window.hms = s => { s = Math.floor(s); const h = Math.floor(s / 3600); return (h ? h + ':' : '') + String(Math.floor(s % 3600 / 60)).padStart(h ? 2 : 1, '0') + ':' + String(s % 60).padStart(2, '0'); };
window.pc = (km, s) => km > .01 ? window.fmt(s / km) : '--:--';

// Education Level Hierarchy for Eligibility Check
window.EDU_RANKS = {
  '10th': { rank: 1, label: '10th Pass (Matric)' },
  '12th_any': { rank: 2, label: '12th Pass (Arts / Commerce / Any)' },
  '12th_pcm': { rank: 3, label: '12th Pass (Physics, Chem, Maths)' },
  'grad_any': { rank: 4, label: 'Graduate (B.A / B.Com / B.Sc / Any)' },
  'grad_tech': { rank: 5, label: 'B.E. / B.Tech (Engineering)' }
};

// Comprehensive Defense Medical Checklist & Improvement Plan
window.MED_CHECKLIST = [
  {
    id: 'vision',
    cat: 'Vision & ENT',
    title: 'Visual Acuity & Color Vision',
    std: '6/6 to 6/9 distant vision. Color Vision: CP-I (Flying) or CP-II/CP-III (Ground/Police). LASIK allowed in select Officer/Police entries if axial length < 25.5 mm & corneal thickness > 450 microns.',
    check: 'Read small text at 6 meters and test with an Ishihara color blindness plate chart.',
    fix: [
      'Follow the 20-20-20 rule to eliminate ciliary muscle spasm (pseudo-myopia) before medicals.',
      'Ensure 8 hours of sleep and zero screen time 24 hours prior to your eye examination.',
      'If wearing spectacles, verify your prescription is updated and stable for at least 6 months.'
    ]
  },
  {
    id: 'knock_knees',
    cat: 'Musculoskeletal',
    title: 'Knock Knees (Genu Valgum)',
    std: 'Inter-malleolar (ankle) distance must be less than 5 cm when standing upright with knees lightly touching.',
    check: 'Stand straight, bring knees together, and measure the gap between your inner ankle bones.',
    fix: [
      'Perform side-lying clam shells and resistance-band lateral monster walks (3 sets × 15 reps daily) to strengthen hip abductors.',
      'Practice daily butterfly stretches (hold 60s × 3) and sleep with a firm pillow or rolled towel between your knees.',
      'Avoid pronated footwear; use arch-support insoles during road runs.'
    ]
  },
  {
    id: 'flat_feet',
    cat: 'Musculoskeletal',
    title: 'Flat Feet (Pes Planus)',
    std: 'Rigid flat feet are a rejection. Flexible arches that form when standing on toes are cleared.',
    check: 'Wet the soles of your feet and step onto a dry newspaper. A complete rectangular footprint without an inner curve indicates flat feet.',
    fix: [
      'Do towel scrunches/curls with your toes for 5 minutes every morning and evening.',
      'Practice barefoot single-leg balance and slow eccentric calf raises on a stair edge (3 × 15 reps).',
      'Roll a tennis or golf ball under your plantar fascia for 3 minutes post-run.'
    ]
  },
  {
    id: 'carrying_angle',
    cat: 'Musculoskeletal',
    title: 'Elbow Carrying Angle (Cubitus Valgus)',
    std: 'Carrying angle of the elbow must be between 10° and 15° (up to 18° for females). Hyperextension > 10° is disqualifying.',
    check: 'Extend your arms fully at your sides with palms facing forward; check if forearms angle outward excessively.',
    fix: [
      'Strengthen forearm flexors, brachioradialis, and biceps via hammer curls and neutral-grip pull-ups.',
      'Never lock or hyperextend your elbows during push-ups; keep a micro-bend at the top of each rep.'
    ]
  },
  {
    id: 'sweaty_palms',
    cat: 'General & Skin',
    title: 'Palmar Hyperhidrosis (Sweaty Palms)',
    std: 'Hands must remain dry during inspection. Excessive dripping sweat on palms can draw a temporary rejection (TR).',
    check: 'Hold your hands out palm-up for 3 minutes under mild stress or warmth to check for moisture beads.',
    fix: [
      'Use an over-the-counter Aluminum Chloride (20%) antiperspirant lotion on palms at night for 2 weeks before medicals.',
      'Soak hands in warm black tea (tannic acid contracts sweat pores) for 15 minutes daily.',
      'Practice box breathing (4s inhale - 4s hold - 4s exhale) during medical line-up to lower sympathetic nervous sweat.'
    ]
  },
  {
    id: 'dental',
    cat: 'Vision & ENT',
    title: 'Dental Points & Oral Hygiene',
    std: 'Minimum 14 dental points required (out of 22). No severe pyorrhea, un-restored cavities, or severe malocclusion.',
    check: 'Count healthy, opposing molar and incisor pairs; inspect for tartar build-up or cavities.',
    fix: [
      'Get professional ultrasonic dental scaling, polishing, and permanent tooth-colored fillings 3–4 weeks before medicals.',
      'Extract decayed third molars (wisdom teeth) at least 1 month prior so gums heal completely.'
    ]
  },
  {
    id: 'ent_ear',
    cat: 'Vision & ENT',
    title: 'Ear Wax, Tympanic Membrane & DNS',
    std: 'Clear view of intact tympanic membrane (eardrum), free whisper hearing at 600 cm, and no severe Deviated Nasal Septum (DNS).',
    check: 'Check if both nostrils have unobstructed airflow and ensure no impacted ear wax.',
    fix: [
      'Visit an ENT specialist 10–14 days before medicals for safe suction/syringing of ear wax (impacted wax is the #1 cause of unnecessary Temporary Rejections).',
      'Never use cotton buds/earbuds, which push wax deeper against the eardrum.',
      'Do daily steam inhalation if you have mild sinus congestion.'
    ]
  },
  {
    id: 'veins',
    cat: 'General & Skin',
    title: 'Varicose Veins, Hydrocele & Varicocele',
    std: 'No tortuous/dilated varicose veins in calves, no scrotal swelling (hydrocele/varicocele), and no hemorrhoids.',
    check: 'Stand for 10 minutes after a run and inspect the back of your calves for bulging, rope-like veins.',
    fix: [
      'Elevate your legs against a wall for 15 minutes after every long run to assist venous return.',
      'Wear graduated compression calf sleeves during high-volume running weeks.',
      'Maintain high fiber and 3L+ water intake daily to prevent hemorrhoids/piles.'
    ]
  },
  {
    id: 'bmi_blood',
    cat: 'General & Skin',
    title: 'BMI, Weight-for-Height & Hemoglobin',
    std: 'Weight within ±10% of ideal military age/height chart. Hemoglobin: 13–17 g/dL (Men), 12–15 g/dL (Women). BP < 140/90.',
    check: 'Check your BMI (aim for 19.5–23.5) and get a basic CBC & Urine routine lab test 3 weeks prior.',
    fix: [
      'For low Hemoglobin: combine iron-rich foods (spinach, dates, jaggery, roasted chana, lean meat) with Vitamin C (lemon/amla) and avoid tea/coffee around meals.',
      'Avoid energy drinks, pre-workout supplements, and excess salt 5 days before medicals to keep Blood Pressure and liver enzymes normal.'
    ]
  },
  {
    id: 'tattoo',
    cat: 'General & Skin',
    title: 'Tattoos, Keloids & Surgical Scars',
    std: 'Permitted only on the inner forearm (from inside of elbow to wrist) or reverse of palm for Forces. Strict zero-tattoo policy in many entries.',
    check: 'Inspect your body for any visible tattoos, chronic fungal infections (ringworm), or large keloid scars.',
    fix: [
      'Start Q-switched laser tattoo removal at least 4–6 months in advance so skin heals without raw scarring.',
      'Treat any groin/foot fungal infections (jock itch / athlete’s foot) completely with antifungal cream 3 weeks prior.'
    ]
  }
];

window.mapSvg = (pts, thumb) => {
  const W = 320, H = 180, g = `<defs><pattern id="gr" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="currentColor" opacity="0.1"/></pattern></defs><rect width="${W}" height="${H}" fill="url(#gr)"/>`;
  if (!pts || pts.length < 2) return `<svg viewBox="0 0 ${W} ${H}" style="display:block;width:100%;height:auto;">${g}${thumb ? '' : `<text x="160" y="95" text-anchor="middle" fill="currentColor" opacity="0.5" font-size="13">Your route appears here</text>`}</svg>`;
  const k = Math.cos(pts[0].la * Math.PI / 180), xy = pts.map(p => [p.lo * k, -p.la]), xs = xy.map(a => a[0]), ys = xy.map(a => a[1]);
  const x0 = Math.min(...xs), y0 = Math.min(...ys), dx = Math.max(Math.max(...xs) - x0, 1e-5), dy = Math.max(Math.max(...ys) - y0, 1e-5), s = Math.min((W - 50) / dx, (H - 50) / dy), ox = (W - dx * s) / 2, oy = (H - dy * s) / 2;
  const P = xy.map(a => [(a[0] - x0) * s + ox, (a[1] - y0) * s + oy]), e = P[P.length - 1];
  return `<svg viewBox="0 0 ${W} ${H}" style="display:block;width:100%;height:auto;">${g}<polyline fill="none" stroke="var(--accent)" stroke-width="${thumb ? 6 : 4}" stroke-linecap="round" stroke-linejoin="round" points="${P.map(a => a[0].toFixed(1) + ',' + a[1].toFixed(1)).join(' ')}"/><circle cx="${P[0][0]}" cy="${P[0][1]}" r="${thumb ? 7 : 5}" fill="#10B981"/><circle cx="${e[0]}" cy="${e[1]}" r="${thumb ? 7 : 5}" fill="var(--surface)" stroke="var(--accent)" stroke-width="3"/></svg>`;
};

const run = (km, qual, top) => ({ id: 'run', t: 'run', km, qual, top, label: (km < 1 ? Math.round(km * 1000) + ' m' : km + ' km') + ' run' });
const reps = (id, label, qual, top) => ({ id, t: 'reps', label, qual, top });
const jump = (id, label, qual) => ({ id, t: 'jump', label, qual });

window.EXAMS = [
  { id: 'army', code: 'AR', grp: 'Agniveer', name: 'Army Agniveer', color: 'linear-gradient(135deg, #3E7B27, #689F38)',
    branches: [
      { id: 'gd', name: 'General Duty (GD)', desc: 'Combat roles and general arms.',
        minH: { M: 170, F: 162 }, age: [17.5, 21],
        edu: { req: '10th / Matric pass with 45% aggregate and minimum 33% in each subject.', minRank: 1, minPct: 45 },
        cutoffs: { written: '50–60 / 100 marks (CEE Online)', physical: '100 Marks (Group-I Run 60m + 10 Pull-ups 40m). Target 88+.', medical: 'SHAPE-1 / COPE-1 Fit', interview: 'No interview. Final merit out of 200 (CEE + PFT).' },
        pmt: { M: 'Height 170 cm (region relaxations apply). Chest 77 cm (+5 cm expansion).', F: 'Height 162 cm.' },
        ev: { M: [run(1.6, 345, 330), reps('pullup', 'Pull-ups', 6, 10)], F: [run(1.6, 480, 450)] } },
      { id: 'tech', name: 'Technical', desc: 'Aviation, Signals, Engineers.',
        minH: { M: 170, F: 162 }, age: [17.5, 21],
        edu: { req: '12th pass in Science (Physics, Chemistry, Maths & English) with 50% aggregate and 40% in each subject.', minRank: 3, minPct: 50 },
        cutoffs: { written: '110–130 / 200 marks (Technical CEE)', physical: 'Qualifying (1.6 km within 5:45 & min 6 pull-ups)', medical: 'SHAPE-1 Fit (Normal color vision CP-II)', interview: 'No interview. Merit based on Written CEE + Bonus marks.' },
        pmt: { M: 'Height 170 cm. Chest 77 cm (+5 cm).', F: 'Height 162 cm.' },
        ev: { M: [run(1.6, 345, 330), reps('pullup', 'Pull-ups', 6, 10)], F: [run(1.6, 480, 450)] } },
      { id: 'clerk', name: 'Clerk / Store Keeper', desc: 'Administrative and inventory management.',
        minH: { M: 162, F: 157 }, age: [17.5, 21],
        edu: { req: '12th pass (any stream) with 60% aggregate and min 50% in each subject (English & Maths/Accounts mandatory).', minRank: 2, minPct: 60 },
        cutoffs: { written: '135–155 / 200 marks + Typing Test (30 WPM English)', physical: 'Qualifying (1.6 km in 5:45 & 6 pull-ups)', medical: 'SHAPE-1 Fit', interview: 'Typing Test is qualifying; merit based on Written CEE.' },
        pmt: { M: 'Height 162 cm. Chest 77 cm (+5 cm).', F: 'Height 157 cm.' },
        ev: { M: [run(1.6, 345, 330), reps('pullup', 'Pull-ups', 6, 10)], F: [run(1.6, 480, 450)] } }
    ],
    notes: ['Run and pull-ups earn marks in GD. Men finishing 1.6 km by 5:30 get 60 marks; 5:31 to 5:45 gets 48.', '9 ft ditch jump and zig-zag balance beam are qualifying across all branches.']
  },
  { id: 'iaf', code: 'AF', grp: 'Agniveer', name: 'Air Force Agniveervayu (Group X & Y)', color: 'linear-gradient(135deg, #1565C0, #42A5F5)',
    minH: { M: 152.5, F: 152 }, age: [17.5, 21],
    edu: { req: 'Science (Group X): 12th with Maths, Physics & English (min 50% agg & 50% in English). Other (Group Y): 12th any stream with 50% agg & 50% in English.', minRank: 2, minPct: 50 },
    cutoffs: { written: 'Science (X): ~35–42 / 70 | Non-Science (Y): ~34–38 / 50', physical: 'Qualifying PFT (1.6 km in 7:00 M / 8:00 F + Push-ups, Sit-ups, Squats)', medical: 'A1G1 / A4G1 Medical Standard (6/6 or 6/12 vision)', interview: 'Adaptability Test-I (SRT) & Test-II (Group Discussion) — Qualifying' },
    pmt: { M: 'Height 152.5 cm, Chest 5 cm expansion.', F: 'Height 152 cm.' },
    ev: { M: [run(1.6, 420), reps('pushup', 'Push-ups', 10), reps('situp', 'Sit-ups', 10), reps('squat', 'Squats', 20)], F: [run(1.6, 480), reps('situp', 'Sit-ups', 10), reps('squat', 'Squats', 15)] },
    notes: ['Push-ups, sit-ups and squats are each timed at 1 minute.', 'Order: run first, then push-ups after a 10 minute break.']
  },
  { id: 'navy', code: 'NV', grp: 'Agniveer', name: 'Navy Agniveer (SSR & MR)', color: 'linear-gradient(135deg, #0D47A1, #26C6DA)',
    branches: [
      { id: 'ssr', name: 'Senior Secondary Recruit (SSR)', desc: 'Operational and technical vessel roles.',
        minH: { M: 157, F: 152 }, age: [17.5, 21],
        edu: { req: '12th pass with Mathematics & Physics and at least one of Chemistry / Biology / Computer Science (min 50% aggregate).', minRank: 3, minPct: 50 },
        cutoffs: { written: 'INET Stage-I: ~45–58 / 100 (varies by state)', physical: 'Qualifying PFT (1.6 km in 6:30 M / 8:00 F + Squats & Push-ups/Sit-ups)', medical: 'S1A1 Navy Medical Standard (6/6 vision without glasses for Seaman)', interview: 'Stage-II Offline Written Exam determines final merit.' },
        pmt: { M: 'Height 157 cm.', F: 'Height 152 cm.' },
        ev: { M: [run(1.6, 390), reps('squat', 'Squats', 20), reps('pushup', 'Push-ups', 12)], F: [run(1.6, 480), reps('squat', 'Squats', 15), reps('situp', 'Sit-ups', 10)] } },
      { id: 'mr', name: 'Matric Recruit (MR)', desc: 'Culinary, Stewards, and Hygienists.',
        minH: { M: 157, F: 152 }, age: [17.5, 21],
        edu: { req: '10th / Matric pass with minimum 50% aggregate marks from a recognized board.', minRank: 1, minPct: 50 },
        cutoffs: { written: 'INET Stage-I: ~28–38 / 50 (varies by state)', physical: 'Qualifying PFT (1.6 km in 6:30 M / 8:00 F + Squats & Push-ups/Sit-ups)', medical: 'S1A1 Navy Medical Standard', interview: 'Stage-II Written Exam determines final merit.' },
        pmt: { M: 'Height 157 cm.', F: 'Height 152 cm.' },
        ev: { M: [run(1.6, 390), reps('squat', 'Squats', 20), reps('pushup', 'Push-ups', 12)], F: [run(1.6, 480), reps('squat', 'Squats', 15), reps('situp', 'Sit-ups', 10)] } }
    ],
    notes: ['The PFT is qualifying. Merit comes from the Stage-II written exam.']
  },
  { id: 'afcat', code: 'AC', grp: 'Officer entry', name: 'AFCAT (Air Force Officer)', color: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
    branches: [
      { id: 'flying', name: 'Flying Branch', desc: 'Fighter, Transport, and Helicopter pilots.',
        minH: { M: 162.5, F: 162.5 }, age: [20, 24],
        edu: { req: '12th with min 50% each in Maths & Physics + Graduation (any discipline) with min 60% OR B.E./B.Tech with min 60%.', minRank: 4, minPct: 60 },
        cutoffs: { written: 'AFCAT Written: ~155–165 / 300', physical: 'AFSB Advisory (1.6 km in 10:00, 10 Push-ups, 3 Chin-ups, Rope Climb)', medical: 'A1G1 Flying Medical (6/6 vision, CP-I color vision, Leg length 99–120 cm)', interview: '5-Day AFSB (300 Marks) + PABT/CPSS (Pilot Aptitude Test) — Final cutoff ~355 / 600' },
        pmt: { M: 'Height 162.5 cm, Sitting height 81.5–96 cm, Leg length 99–120 cm.', F: 'Height 162.5 cm, Leg length 99–120 cm.' },
        ev: { M: [run(1.6, 600), reps('pushup', 'Push-ups', 10), reps('chinup', 'Chin-ups', 3)], F: [run(1.6, 600), reps('pushup', 'Push-ups', 10)] } },
      { id: 'gd_tech', name: 'Ground Duty (Technical)', sub: ['Aeronautical (Electronics)', 'Aeronautical (Mechanical)'], desc: 'Engineering and aircraft maintenance.',
        minH: { M: 157.5, F: 152 }, age: [20, 26],
        edu: { req: '12th with min 50% each in Physics & Maths + 4-year B.E./B.Tech degree with minimum 60% marks.', minRank: 5, minPct: 60 },
        cutoffs: { written: 'AFCAT (~155–165 / 300) + EKT (~18–30 / 150)', physical: 'AFSB Outdoor Tasks (1.6 km run, Individual Obstacles, Group Obstacles)', medical: 'A4G1 Medical Standard (Myopia up to -3.5D allowed)', interview: '5-Day AFSB Interview (300 Marks) — Final merit combines AFCAT + AFSB (~330+)' },
        pmt: { M: 'Height 157.5 cm.', F: 'Height 152 cm.' },
        ev: { M: [run(1.6, 600), reps('pushup', 'Push-ups', 10), reps('chinup', 'Chin-ups', 3)], F: [run(1.6, 600), reps('pushup', 'Push-ups', 10)] } },
      { id: 'gd_nontech', name: 'Ground Duty (Non-Technical)', sub: ['Administration', 'Logistics', 'Accounts', 'Education'], desc: 'Operations, logistics, accounts & management.',
        minH: { M: 157.5, F: 152 }, age: [20, 26],
        edu: { req: 'Graduate (3-year degree) in any discipline with minimum 60% marks (B.Com with 60% required for Accounts).', minRank: 4, minPct: 60 },
        cutoffs: { written: 'AFCAT Written: ~155–165 / 300', physical: 'AFSB Outdoor Tasks (1.6 km in 10:00, 10 Push-ups, 3 Chin-ups)', medical: 'A4G1 Medical Standard (6/6 corrected vision, CP-II/III)', interview: '5-Day AFSB Interview (300 Marks) — Final merit ~350–365 / 600' },
        pmt: { M: 'Height 157.5 cm.', F: 'Height 152 cm.' },
        ev: { M: [run(1.6, 600), reps('pushup', 'Push-ups', 10), reps('chinup', 'Chin-ups', 3)], F: [run(1.6, 600), reps('pushup', 'Push-ups', 10)] } }
    ],
    notes: ['The five-day AFSB selection board includes Individual Obstacles (10 obstacles in 3 mins) and Snake Race, so general stamina helps well beyond these minimums.']
  },
  { id: 'icg', code: 'CG', grp: 'Agniveer', name: 'Indian Coast Guard', color: 'linear-gradient(135deg, #00695C, #26A69A)',
    branches: [
      { id: 'navik_gd', name: 'Navik (General Duty)', desc: 'Maritime security and sea operations.',
        minH: { M: 157, F: 152 }, age: [18, 22],
        edu: { req: '12th pass with Maths and Physics from an education board recognized by COBSE.', minRank: 3, minPct: 50 },
        cutoffs: { written: 'Section I + II: ~78–86 / 110 (UR)', physical: 'Qualifying PFT (1.6 km in 7:00, 20 Squats, 10 Push-ups without break)', medical: 'Coast Guard S1A1 Medical (6/6 / 6/9 vision)', interview: 'Document Verification & Final Medical at INS Chilka' },
        pmt: { M: 'Height 157 cm, Chest +5 cm expansion.', F: 'Height 152 cm.' },
        ev: { M: [run(1.6, 420), reps('squat', 'Squats', 20), reps('pushup', 'Push-ups', 10)], F: [run(1.6, 480), reps('squat', 'Squats', 15)] } },
      { id: 'navik_db', name: 'Navik (Domestic Branch)', desc: 'Stewards and Cooks.',
        minH: { M: 157, F: 152 }, age: [18, 22],
        edu: { req: '10th / Matric pass from an education board recognized by COBSE.', minRank: 1, minPct: 50 },
        cutoffs: { written: 'Section I: ~50–54 / 60 (UR)', physical: 'Qualifying PFT (1.6 km in 7:00, 20 Squats, 10 Push-ups)', medical: 'S1A1 Medical Standard', interview: 'Merit based purely on Section-I Written Score' },
        pmt: { M: 'Height 157 cm.', F: 'Height 152 cm.' },
        ev: { M: [run(1.6, 420), reps('squat', 'Squats', 20), reps('pushup', 'Push-ups', 10)], F: [run(1.6, 480), reps('squat', 'Squats', 15)] } },
      { id: 'yantrik', name: 'Yantrik', desc: 'Technical Mechanical, Electrical & Electronics.',
        minH: { M: 157, F: 152 }, age: [18, 22],
        edu: { req: '10th pass + 3-year Engineering Diploma in Electrical / Mechanical / Electronics & Telecom.', minRank: 2, minPct: 50 },
        cutoffs: { written: 'Section I + Trade Section: ~82–92 / 110', physical: 'Qualifying PFT (1.6 km in 7:00, 20 Squats, 10 Push-ups)', medical: 'S1A1 Medical Standard', interview: 'Merit based on combined Written Score' },
        pmt: { M: 'Height 157 cm.', F: 'Height 152 cm.' },
        ev: { M: [run(1.6, 420), reps('squat', 'Squats', 20), reps('pushup', 'Push-ups', 10)], F: [run(1.6, 480), reps('squat', 'Squats', 15)] } }
    ],
    notes: ['All three PFT exercises are performed back-to-back without break.']
  },
  { id: 'capf_ac', code: 'CA', grp: 'Officer entry', name: 'UPSC CAPF (Asst. Commandant)', color: 'linear-gradient(135deg, #2E7D32, #66BB6A)',
    minH: { M: 165, F: 157 }, age: [20, 25],
    edu: { req: 'Bachelor’s degree (Graduation) in any discipline from a recognized university.', minRank: 4, minPct: 45 },
    cutoffs: { written: 'Paper I: ~125–138 / 250 | Paper I + II: ~205–222 / 450', physical: 'Qualifying PET (100m in 16sM/18sF, 800m in 3:45M/4:45F, Long Jump, Shot Put)', medical: 'SHAPE-1 CAPF Gazetted Officer Medical (LASIK allowed within limits)', interview: 'UPSC Personality Test (150 Marks) — Final cutoff ~325–345 / 600' },
    pmt: { M: 'Height 165 cm, Chest 81 cm (+5 cm expansion), Weight 50 kg.', F: 'Height 157 cm, Weight 46 kg.' },
    ev: { M: [run(0.8, 225), jump('lj', 'Long jump', 11.5)], F: [run(0.8, 285), jump('lj', 'Long jump', 9.8)] },
    notes: ['Covers Group-A Gazetted Officer entry into BSF, CRPF, CISF, ITBP, and SSB. Also includes a 100m sprint (16s Men / 18s Women) and 7.26 kg Shot Put (4.5 m).']
  },
  { id: 'ssc_cpo', code: 'CP', grp: 'Officer entry', name: 'SSC CPO (Sub-Inspector)', color: 'linear-gradient(135deg, #6A1B9A, #AB47BC)',
    minH: { M: 170, F: 157 }, age: [20, 25],
    edu: { req: 'Bachelor’s degree in any discipline + valid LMV (Motorcycle & Car) Driving License for Delhi Police SI (Men).', minRank: 4, minPct: 45 },
    cutoffs: { written: 'Tier-I: ~135–145 / 200 | Final (Tier I + II): ~330–355 / 400 (DP SI)', physical: 'Qualifying PET (1.6km in 6:30, 100m in 16s, Long Jump 12ft, High Jump 3.9ft, Shot Put)', medical: 'SHAPE-1 CAPF Medical (6/6 and 6/9 distant vision WITHOUT glasses)', interview: 'No interview. Merit is Tier-I (200) + Tier-II English (200) = 400 Marks.' },
    pmt: { M: 'Height 170 cm, Chest 80–85 cm.', F: 'Height 157 cm.' },
    ev: { M: [run(1.6, 390), jump('lj', 'Long jump', 12), jump('hj', 'High jump', 3.9)], F: [run(0.8, 240), jump('lj', 'Long jump', 9), jump('hj', 'High jump', 3)] },
    notes: ['Sub-Inspector entry for Delhi Police and CAPFs. Vision must be 6/6 and 6/9 without spectacles.']
  },
  { id: 'ssc_gd', code: 'SG', grp: 'Police and paramilitary', name: 'SSC GD (CAPF, NIA, SSF, Rifleman)', color: 'linear-gradient(135deg, #4527A0, #7E57C2)',
    minH: { M: 170, F: 157 }, age: [18, 23],
    edu: { req: '10th / Matriculation pass from a recognized board.', minRank: 1, minPct: 35 },
    cutoffs: { written: 'CBT: ~130–145 / 160 (High cutoff states) | ~95–115 / 160 (Other states)', physical: 'Qualifying PET (5 km in 24:00 Men / 1.6 km in 8:30 Women)', medical: 'CAPF Detailed Medical Exam (DME) — 6/6 & 6/9 vision without glasses', interview: 'No interview. Final merit is 100% CBT Written + NCC Bonus marks.' },
    pmt: { M: 'Height 170 cm, Chest 80–85 cm.', F: 'Height 157 cm.' },
    ev: { M: [run(5, 1440)], F: [run(1.6, 510)] },
    notes: ['The race is qualifying. Ranking comes from the 160-mark Computer Based Test.']
  },
  { id: 'crpf', code: 'CR', grp: 'Police and paramilitary', name: 'CRPF (Constable & Tradesman)', color: 'linear-gradient(135deg, #AD1457, #EC407A)',
    minH: { M: 170, F: 157 }, age: [18, 23],
    edu: { req: '10th / Matric pass + proficiency in respective trade (HMV License for Driver, ITI for Motor Mechanic).', minRank: 1, minPct: 35 },
    cutoffs: { written: 'CBT: ~70–82 / 100 marks', physical: 'Qualifying PET (5 km in 24:00 GD/Driver; 1.6 km in 10:00 Cook/Tradesman)', medical: 'SHAPE-1 Medical Fitness', interview: 'Trade Test (50 Marks — Qualifying, min 20 marks required)' },
    pmt: { M: 'Height 170 cm, Chest 80–85 cm.', F: 'Height 157 cm.' },
    ev: { M: [run(5, 1440)], F: [run(1.6, 510)] },
    notes: ['Endurance-focused 5 km run for General Duty / Technical roles.']
  },
  { id: 'delhi', code: 'DP', grp: 'Police and paramilitary', name: 'Delhi Police Constable (Executive)', color: 'linear-gradient(135deg, #B71C1C, #EF5350)',
    minH: { M: 170, F: 157 }, age: [18, 25],
    edu: { req: '12th (10+2) pass from a recognized board + valid LMV Driving License (Car/Bike) for Male candidates.', minRank: 2, minPct: 35 },
    cutoffs: { written: 'CBT: ~75–82 / 100 (Men UR) | ~65–72 / 100 (Women UR)', physical: 'Qualifying PE&MT (1.6 km in 6:00, 14 ft Long Jump, 3\'9" High Jump for Men)', medical: '6/12 vision without glasses, free from color blindness & deformities', interview: 'No interview. Merit is 100% based on the 100-mark CBT.' },
    pmt: { M: 'Height 170 cm, Chest 81–85 cm.', F: 'Height 157 cm.' },
    ev: { M: [run(1.6, 360), jump('lj', 'Long jump', 14), jump('hj', 'High jump', 3.75)], F: [run(0.8, 300), jump('lj', 'Long jump', 10), jump('hj', 'High jump', 3)] },
    notes: ['You run first. Only qualifiers move on to the jumps, with 3 attempts in each.']
  },
  { id: 'up', code: 'UP', grp: 'Police and paramilitary', name: 'UP Police (Constable & SI)', color: 'linear-gradient(135deg, #E65100, #FFA726)',
    minH: { M: 168, F: 152 }, age: [18, 25],
    edu: { req: 'Constable: 12th pass (any stream). Sub-Inspector (SI): Graduation degree in any stream.', minRank: 2, minPct: 35 },
    cutoffs: { written: 'Constable: ~210–225 / 300 | SI: ~305–320 / 400', physical: 'Qualifying PET (Men: 4.8 km in 25:00 Constable / 28:00 SI; Women: 2.4 km in 14:00)', medical: 'UPPRPB Medical Board (Knock-knee, flat-foot, 6/6 or 6/9 vision, color vision)', interview: 'No interview. Final merit is determined by Written Exam marks.' },
    pmt: { M: 'Height 168 cm, Chest 79–84 cm.', F: 'Height 152 cm (min weight 40 kg).' },
    ev: { M: [run(4.8, 1500)], F: [run(2.4, 840)] },
    notes: ['Uses strict constable timings: men 4.8 km in 25:00, women 2.4 km in 14:00.']
  },
  { id: 'mahapolice', code: 'MP', grp: 'Police and paramilitary', name: 'Maharashtra Police Constable', color: 'linear-gradient(135deg, #D84315, #FF7043)',
    minH: { M: 165, F: 155 }, age: [18, 28],
    edu: { req: '12th (HSC) pass from Maharashtra State Board or equivalent.', minRank: 2, minPct: 35 },
    cutoffs: { written: 'Written Exam: ~85–92 / 100 marks (Requires min 50% in Physical to qualify for Written)', physical: '50 Marks (1600m/800m: 20m, 100m Sprint: 15m, Shot Put: 15m). Target 42+/50.', medical: 'State Police Medical Fitness (Vision, Hearing, Joint Alignment)', interview: 'No interview. Final Merit = Physical (50) + Written (100) = ~130+ / 150.' },
    pmt: { M: 'Height 165 cm, Chest 79–84 cm.', F: 'Height 155 cm.' },
    ev: { M: [run(1.6, 390, 310)], F: [run(0.8, 210, 170)] },
    notes: ['Physical test carries 50 marks and happens FIRST. Finishing 1.6 km in 5:10 or less earns full 20 marks.']
  }
];

window.LOGOS = {
  army: '<svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.4-6.3-4.8-6.3 4.8 2.3-7.4-6-4.6h7.6z"/></svg>',
  iaf: '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2L16 11l5-5c1-1 1-2 0-3s-2-1-3 0l-5 5-8.2-1.8-2 2 6 4.5-4 4-2.5-.5-1.5 1.5 3.5 1.5 1.5 3.5 1.5-1.5-.5-2.5 4-4 4.5 6 2-2z"/></svg>',
  navy: '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><path d="M12 22V8m-4 4h8M4 15c0 4.4 3.6 8 8 8s8-3.6 8-8m-14 0l2-2m10 2l-2-2"/></svg>',
  afcat: '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2L16 11l5-5c1-1 1-2 0-3s-2-1-3 0l-5 5-8.2-1.8-2 2 6 4.5-4 4-2.5-.5-1.5 1.5 3.5 1.5 1.5 3.5 1.5-1.5-.5-2.5 4-4 4.5 6 2-2z"/></svg>',
  icg: '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><path d="M12 22V8m-5 4h10M5 15c0 3.9 3.1 7 7 7s7-3.1 7-7"/></svg>',
  capf_ac: '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8l1.5 3 3 .5-2 2 .5 3-3-1.5-3 1.5.5-3-2-2 3-.5z"/></svg>',
  ssc_cpo: '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-7z"/></svg>',
  ssc_gd: '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4l3 3"/></svg>',
  crpf: '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M8 12h8M12 8v8"/></svg>',
  delhi: '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="11" r="3"/></svg>',
  up: '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 11h6M12 8v6"/></svg>',
  mahapolice: '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.4-6.3-4.8-6.3 4.8 2.3-7.4-6-4.6h7.6z"/></svg>'
};

window.goalOf = e => {
  if (e.top != null) return e.top;
  if (e.t === 'run') return Math.round(e.qual * .95 / 5) * 5;
  if (e.t === 'jump') return Math.round(e.qual * 1.06 * 4) / 4;
  return Math.max(e.qual + 2, Math.ceil(e.qual * 1.25));
};
window.defBase = e => e.t === 'run' ? Math.round(window.goalOf(e) * 1.3 / 5) * 5 : e.t === 'jump' ? Math.round(e.qual * .85 * 4) / 4 : Math.max(0, Math.round(window.goalOf(e) * .4));
window.stdText = e => e.t === 'run' ? `Finish within ${window.fmt(e.qual)}` + (e.top ? `, full marks at ${window.fmt(e.top)}` : '') : e.t === 'jump' ? `Clear ${window.ft(e.qual)}` : `${e.qual} reps` + (e.top ? `, full marks at ${e.top}` : '');
window.shortStd = e => e.t === 'run' ? `${e.label.replace(' run', '')} in ${window.fmt(e.qual)}` : e.t === 'jump' ? `${e.label.toLowerCase()} ${window.ft(e.qual)}` : `${e.qual} ${e.label.toLowerCase()}`;
window.showVal = (e, v) => e.t === 'run' ? window.fmt(v) : e.t === 'jump' ? window.ft(v) : String(v);

// Eligibility & Educational Qualification Evaluator
window.checkEligibility = (P, b) => {
  const userRank = (window.EDU_RANKS[P.eduLevel || '12th_pcm'] || { rank: 3 }).rank;
  const reqRank = (b.edu && b.edu.minRank) || 1;
  const reqPct = (b.edu && b.edu.minPct) || 35;
  const minH = (b.minH && b.minH[P.g]) || 155;
  const [minA, maxA] = b.age || [17.5, 26];

  const eduOk = userRank >= reqRank && (P.eduPct || 60) >= reqPct;
  const ageOk = P.age >= minA && P.age <= maxA;
  const hOk = P.h >= minH;

  return {
    eduOk, ageOk, hOk,
    allOk: eduOk && ageOk && hOk,
    reqText: (b.edu && b.edu.req) || 'As per official notification.',
    minH, minA, maxA, reqPct
  };
};

// Training Plan Generator
window.buildPlan = (P, evs, examId) => {
  const W = P.weeks || 12, D = P.days || 4;
  const goals = {}; evs.forEach(e => goals[e.id] = window.goalOf(e));
  const nb = Math.ceil(.35 * (W - 1)), nbu = Math.ceil(.45 * (W - 1));
  const meta = []; let cum = 0;
  for (let w = 1; w <= W; w++) {
    const last = w === W, deload = W >= 8 && w % 4 === 0 && w < W - 1;
    if (!last && !deload) cum++;
    meta.push({ w, last, deload, bench: last || w % 4 === 0, phase: last ? 'Test week' : w <= nb ? 'Base' : w <= nb + nbu ? 'Build' : 'Peak', cum });
  }
  const n = meta.filter(m => !m.last && !m.deload).length || 1;
  meta.forEach(m => m.f = m.last ? 1 : Math.min(.97, m.cum / n * .97));

  const valAt = (e, w) => {
    const wkIdx = window.clamp(w - 1, 0, meta.length - 1);
    const f = meta[wkIdx].f, b = P.base[e.id] ?? window.defBase(e), g = goals[e.id];
    if (e.t === 'run') return b <= g ? b : b - (b - g) * f;
    if (e.t === 'jump') return b >= g ? b : Math.round((b + (g - b) * f) * 4) / 4;
    return b >= g ? b : Math.round(b + (g - b) * f);
  };

  const has = id => evs.find(e => e.id === id);
  const rEv = evs.find(e => e.t === 'run') || evs[0];
  const dist = rEv.km || 1.6;
  const walkRun = (P.base.run || window.defBase(rEv)) / goals.run > 1.5;
  const lrPeak = dist <= 1 ? 3 : dist <= 2.5 ? 4 : window.half(dist * 1.4);
  const lrStart = Math.max(1.5, window.half(lrPeak * .45));
  const pace = m => valAt(rEv, m.w) / dist;
  const longD = m => { let d = window.half(lrStart + (lrPeak - lrStart) * m.f); return m.deload ? window.half(d * .7) : d; };

  const WU = 'Warm-up: 5 min easy jog, leg swings, hip circles, 3 short strides.';
  const CD = 'Cool-down: 5 min walk, then 5 min stretching (calves, hamstrings, hips, shoulders).';

  function quality(m) {
    const p = pace(m), dl = m.deload ? .6 : 1, short = dist <= 2.5;
    if (m.bench) {
      const it = [WU, `Run the full ${rEv.label} at test effort. Log your time in Progress.`];
      evs.filter(e => e !== rEv).forEach(e => it.push(e.t === 'jump' ? `${e.label}: 3 attempts, log your best.` : `${e.label}: one all-out set after a 5 min rest.`));
      it.push(CD);
      return { type: 'test', title: 'Benchmark test', mins: 50, items: it };
    }
    if (m.phase === 'Base') {
      const k = Math.round((6 + m.f * 4) * dl);
      return { type: 'run', title: 'Fartlek and strides', mins: 35, items: [WU, `Fartlek: ${k} × (1 min fast, 1 min easy jog).`, '4 × 80 m relaxed strides, walking back to recover.', CD] };
    }
    if (m.phase === 'Build') {
      const rd = short ? .4 : 1, k = Math.max(3, Math.round((short ? 4 + m.f * 4 : 3 + m.f * 3) * dl)), rest = short ? 90 : 120;
      return { type: 'run', title: 'Interval run', mins: 45, items: [WU, `${k} × ${Math.round(rd * 1000)} m at ${window.fmt(p * rd)} per rep (race pace ${window.fmt(p)}/km).`, `Rest ${rest} s of walking between reps.`, CD] };
    }
    const tm = Math.round((20 + 10 * m.f) * dl);
    return { type: 'run', title: 'Tempo run', mins: tm + 25, items: [WU, `${tm} min steady at ${window.fmt(p + 15)}/km.`, `Then 2 × 1 km at race pace (${window.fmt(p)}/km), rest 2 min.`, CD] };
  }
  function longRun(m) {
    if (m.last) return { type: 'run', title: 'Easy shake-out run', mins: 20, items: [`Easy ${window.half(lrPeak * .4)} km with 3 strides at the end.`, 'Rest fully for the last 2 days before your real test.'] };
    const d = longD(m), ep = pace(m) * 1.35;
    const it = walkRun && m.f < .5 ? [`${d} km as run-walk: run 3 min, walk 1 min, repeat.`, 'Keep it easy enough to talk.'] : [`${d} km easy at about ${window.fmt(ep)}/km.`, 'You should be able to speak in full sentences.'];
    return { type: 'run', title: 'Long easy run', mins: Math.round(d * ep / 60) + 5, items: it };
  }
  function easyRun(m) {
    const d = Math.max(2, window.half(longD(m) * .6)), ep = pace(m) * 1.35;
    return { type: 'run', title: 'Easy run', mins: Math.round(d * ep / 60) + 5, items: [walkRun && m.f < .5 ? `${d} km as run-walk: run 2 min, walk 1 min.` : `${d} km easy at about ${window.fmt(ep)}/km.`, '4 × 80 m strides at the end.'] };
  }
  function upper(m, lite) {
    const s = x => lite ? 2 : x, it = [WU];
    const pu = has('pullup') || has('chinup'), ps = has('pushup');
    if (pu) {
      const v = valAt(pu, m.w);
      if (v < 2) it.push(`Dead hang: ${s(4)} × 20 to 30 s.`, `Slow negatives (jump up, lower over 5 s): ${s(4)} × 3.`, `Towel or table rows: ${s(3)} × 10.`);
      else it.push(`${pu.label}: ${s(5)} sets of ${Math.max(1, Math.ceil(v * .6))}, rest 90 s.`, 'One set to near failure, leaving 1 rep in the tank.', `Slow negatives: ${s(3)} × 3.`);
    }
    const pv = ps ? valAt(ps, m.w) : 12;
    it.push(`Push-ups: ${s(4)} × ${Math.max(5, Math.ceil(pv * .65))}, rest 60 s.`, `Wide and close-grip push-ups: ${s(3)} × 8.`, CD);
    return { type: 'strength', title: pu ? 'Upper body and pull strength' : 'Upper body strength', mins: 40, items: it };
  }
  function lower(m, lite) {
    const s = x => lite ? 2 : x, it = [WU], sq = has('squat'), su = has('situp'), jp = has('lj') || has('hj');
    if (sq) { const v = valAt(sq, m.w); it.push(`Squats (uthak-baithak): ${s(4)} × ${Math.ceil(v * .7)}, then one timed set of ${v} in 60 s.`); }
    else it.push(`Bodyweight squats: ${s(4)} × 20.`);
    if (su) it.push(`Sit-ups: ${s(4)} × ${Math.ceil(valAt(su, m.w) * .7)}.`);
    it.push(`Lunges: ${s(3)} × 10 per leg.`, `Plank: ${s(3)} × 45 s.`, `Glute bridge: ${s(3)} × 12.`, `Calf raises: ${s(3)} × 15.`);
    if (jp) it.push(`Broad jumps: ${s(5)} × 5, full recovery.`, `Step-up jumps: ${s(4)} × 6.`);
    it.push(CD);
    return { type: 'strength', title: jp ? 'Legs, core and jump power' : 'Legs and core', mins: 40, items: it };
  }
  function full(m, lite) {
    const a = upper(m, lite).items.slice(1, -1).slice(0, 3), b = lower(m, lite).items.slice(1, -1).slice(0, 4);
    return { type: 'strength', title: 'Full-body strength', mins: 45, items: [WU, ...a, ...b, CD] };
  }
  function skill(m) {
    const it = [WU];
    if (examId === 'army') it.push('Balance beam or zig-zag walk: 6 passes.', 'Ditch clearance: run up and jump, 6 attempts.');
    evs.filter(e => e !== rEv).forEach(e => it.push(e.t === 'jump' ? `${e.label}: 5 attempts, rest fully between.` : `${e.label}: one practice set with clean, full-range reps.`));
    it.push('Rehearse the test order and rest gaps from the Standards tab.', CD);
    return { type: 'strength', title: 'Event practice', mins: 35, items: it };
  }

  const ORDER = {
    3: { days: [0, 2, 5], b: ['q', 'f', 'l'] },
    4: { days: [0, 1, 3, 5], b: ['q', 'u', 'w', 'l'] },
    5: { days: [0, 1, 2, 4, 5], b: ['q', 'u', 'e', 'w', 'l'] },
    6: { days: [0, 1, 2, 3, 4, 5], b: ['q', 'u', 'e', 'w', 's', 'l'] }
  }[D] || { days: [0, 1, 3, 5], b: ['q', 'u', 'w', 'l'] };

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const REST = { type: 'rest', title: 'Rest and mobility', mins: 20, items: ['Rest, or a 20 to 30 min easy walk.', '10 min mobility: hips, hamstrings, shoulders.'] };

  const weeks = meta.map(m => {
    const lite = m.last, days = [];
    for (let i = 0; i < 7; i++) {
      const k = ORDER.days.indexOf(i); let s = null;
      if (k >= 0) {
        const c = ORDER.b[k];
        s = c === 'q' ? quality(m) : c === 'u' ? upper(m, lite) : c === 'f' ? full(m, lite) : c === 'w' ? lower(m, lite) : c === 'e' ? easyRun(m) : c === 'l' ? longRun(m) : (lite ? REST : skill(m));
      }
      if (!s) s = i === 6 ? { ...REST, title: 'Full rest day', items: ['No training. Sleep 7 to 9 hours.', 'Prepare food for the week.'] } : REST;
      days.push({ ...s, id: `w${m.w}-${i}`, day: DAYS[i] });
    }
    return { m, days };
  });
  return { evs, goals, meta, weeks, valAt, rEv, dist };
};

// Diet Engine
const FOOD = { almonds: ['Soaked almonds', 'pcs', 7, .25, 1], banana: ['Banana', 'pc', 105, 1.3, 1], dates: ['Dates', 'pcs', 23, .2, 1], milk: ['Toned milk', 'ml', .6, .032, 25], curd: ['Curd', 'g', .6, .035, 10], chilla: ['Besan chilla', 'pc', 130, 7, 1], roti: ['Whole-wheat roti', 'pc', 100, 3, 1], dal: ['Dal', 'katori', 150, 8, .5], rice: ['Cooked rice', 'katori', 170, 3.5, .5], paneer: ['Paneer', 'g', 2.65, .18, 10], sabzi: ['Mixed vegetable sabzi', 'katori', 90, 2.5, .5], salad: ['Salad', 'bowl', 40, 2, 1], sprouts: ['Sprouts chaat', 'katori', 130, 9, .5], soy: ['Soya chunks', 'g', 3.45, .52, 10], rajma: ['Rajma or chole', 'katori', 190, 10, .5], egg: ['Egg (boiled)', 'pc', 78, 6.3, 1], bread: ['Brown bread', 'slice', 70, 2.5, 1], chicken: ['Chicken (cooked)', 'g', 1.8, .28, 10], fish: ['Fish (cooked)', 'g', 1.5, .22, 10], chaas: ['Buttermilk (chaas)', 'glass', 40, 2, 1] };
const MEALS = {
  veg: [['On waking', '6:00', [['almonds', 10], ['milk', 200]]], ['Breakfast', '8:30', [['chilla', 3], ['curd', 150], ['banana', 1]]], ['Lunch', '1:00', [['roti', 3], ['dal', 1], ['paneer', 100], ['rice', 1], ['salad', 1]]], ['Pre-workout', '4:30', [['banana', 1], ['dates', 3]]], ['Post-workout', '7:00', [['sprouts', 1], ['soy', 40]]], ['Dinner', '9:00', [['roti', 3], ['rajma', 1], ['sabzi', 1], ['chaas', 1]]], ['Before bed', '10:30', [['milk', 250]]]],
  egg: [['On waking', '6:00', [['almonds', 10], ['milk', 200]]], ['Breakfast', '8:30', [['egg', 3], ['bread', 2], ['banana', 1]]], ['Lunch', '1:00', [['roti', 3], ['dal', 1], ['sabzi', 1], ['rice', 1], ['egg', 2], ['salad', 1]]], ['Pre-workout', '4:30', [['banana', 1], ['dates', 3]]], ['Post-workout', '7:00', [['egg', 2], ['sprouts', 1]]], ['Dinner', '9:00', [['roti', 3], ['dal', 1], ['sabzi', 1], ['chaas', 1]]], ['Before bed', '10:30', [['milk', 250]]]],
  nonveg: [['On waking', '6:00', [['almonds', 10], ['milk', 200]]], ['Breakfast', '8:30', [['egg', 3], ['bread', 2], ['banana', 1]]], ['Lunch', '1:00', [['roti', 3], ['rice', 1], ['chicken', 150], ['dal', .5], ['salad', 1]]], ['Pre-workout', '4:30', [['banana', 1], ['dates', 3]]], ['Post-workout', '7:00', [['egg', 2], ['sprouts', 1]]], ['Dinner', '9:00', [['roti', 3], ['fish', 150], ['sabzi', 1], ['chaas', 1]]], ['Before bed', '10:30', [['milk', 250]]]]
};

window.dietCalc = (P) => {
  const w = P.w || 62, h = P.h || 170, age = P.age || 20;
  const bmi = w / ((h / 100) ** 2);
  const bmr = 10 * w + 6.25 * h - 5 * age + (P.g === 'M' ? 5 : -161);
  const tdee = bmr * ({ 3: 1.45, 4: 1.55, 5: 1.65, 6: 1.72 }[P.days] || 1.55);
  let mode = P.goalMode || 'auto';
  if (mode === 'auto') mode = bmi < 18.5 ? 'gain' : bmi >= 25 ? 'lose' : 'hold';
  const adj = mode === 'gain' ? 350 : mode === 'lose' ? -350 : 0;
  const kcal = Math.max(Math.round((tdee + adj) / 50) * 50, P.g === 'M' ? 1800 : 1500);
  const protein = Math.round(w * (mode === 'lose' ? 2 : mode === 'gain' ? 1.8 : 1.7));
  const fat = Math.round(kcal * .25 / 9), carbs = Math.round((kcal - protein * 4 - fat * 9) / 4);
  const water = (w * 35 / 1000 + .5).toFixed(1);
  const base = MEALS[P.diet] || MEALS.veg, total = base.reduce((a, m) => a + m[2].reduce((sum, [f, q]) => sum + FOOD[f][2] * q, 0), 0);
  const sc = window.clamp(kcal / total, .6, 1.7);
  
  const meals = base.map(([n, t, items]) => {
    const rows = items.map(([f, q]) => { const [name, unit, , , step] = FOOD[f]; return { f, name, unit, q: Math.max(step, Math.round(q * sc / step) * step) }; });
    return { n, t, rows, kcal: Math.round(rows.reduce((a, r) => a + FOOD[r.f][2] * r.q, 0)), pr: Math.round(rows.reduce((a, r) => a + FOOD[r.f][3] * r.q, 0)) };
  });
  return { bmi, mode, kcal, protein, fat, carbs, water, meals };
};