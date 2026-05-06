/* eslint-disable */
import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { AdmissionsDashboard } from "./AdmissionsDashboard";

// ─── FIREBASE CONFIG ─────────────────────────────────────────────────────────
// Get these values from: console.firebase.google.com
//   → Your Project → ⚙️ Settings → Your apps → </> Web → Register → copy config
const firebaseConfig = {
  apiKey: "AIzaSyA18GxWg2WNCj4tcj31PsanrtCeBE8ZDVw",
  authDomain: "comeback-os.firebaseapp.com",
  projectId: "comeback-os",
  storageBucket: "comeback-os.firebasestorage.app",
  messagingSenderId: "536594041438",
  appId: "1:536594041438:web:39f3763fe00631215b82cf"
};
// ─────────────────────────────────────────────────────────────────────────────

const fbApp    = initializeApp(firebaseConfig);
const db       = getFirestore(fbApp);
const USER_DOC = doc(db, "users", "rudra");

async function loadState() {
  // Firebase first (source of truth across all devices)
  try {
    const snap = await getDoc(USER_DOC);
    if (snap.exists()) {
      const d = snap.data();
      try { localStorage.setItem("comeback_os", JSON.stringify(d)); } catch {}
      return d;
    }
  } catch {}
  // Offline fallback
  try { const s = localStorage.getItem("comeback_os"); if (s) return JSON.parse(s); } catch {}
  return null;
}

let _saveTimer = null;
function saveState(s) {
  // Instant local write
  try { localStorage.setItem("comeback_os", JSON.stringify(s)); } catch {}
  // Debounced Firebase write (3 s)
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(async () => {
    try { await setDoc(USER_DOC, s); } catch (e) { console.warn("Firebase save failed:", e.message); }
  }, 3000);
}

const GSTYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#020408;}
  ::-webkit-scrollbar{width:3px;height:3px;}
  ::-webkit-scrollbar-track{background:#030810;}
  ::-webkit-scrollbar-thumb{background:#00ff8855;border-radius:2px;}
  @keyframes fadeUp{0%{opacity:0;transform:translateY(14px)}100%{opacity:1;transform:translateY(0)}}
  @keyframes popIn{0%{transform:scale(.6);opacity:0}80%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
  @keyframes xpToast{0%{opacity:0;transform:translateY(20px) scale(.8)}20%{opacity:1;transform:translateY(0) scale(1)}80%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-20px) scale(.8)}}
  @keyframes badgePop{0%{transform:scale(0) rotate(-20deg);opacity:0}60%{transform:scale(1.2) rotate(3deg)}100%{transform:scale(1) rotate(0deg);opacity:1}}
  @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
  @keyframes battlePulse{0%,100%{box-shadow:0 0 0 0 #ff006e22}50%{box-shadow:0 0 20px 4px #ff006e33}}
  @keyframes quoteFade{0%{opacity:0;transform:translateY(6px)}100%{opacity:1;transform:translateY(0)}}
  @keyframes slideUp{0%{opacity:0;transform:translateY(100%)}100%{opacity:1;transform:translateY(0)}}
  @keyframes slideDown{0%{opacity:0;transform:translateY(-20px)}100%{opacity:1;transform:translateY(0)}}
  @keyframes scoreCount{0%{transform:scale(1)}50%{transform:scale(1.15)}100%{transform:scale(1)}}
  @keyframes burnout{0%,100%{border-color:#ff224444}50%{border-color:#ff2244aa}}
  @keyframes challengePulse{0%,100%{box-shadow:0 0 0 0 #ffd70022}50%{box-shadow:0 0 16px 4px #ffd70033}}
  @keyframes fab{0%{transform:scale(0) rotate(-180deg)}100%{transform:scale(1) rotate(0deg)}}
  @keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
  @keyframes clockPulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes tickerSlide{0%{transform:translateX(100%)}100%{transform:translateX(-100%)}}
  @keyframes glowPulse{0%,100%{box-shadow:0 0 0 0 #00ff8822}50%{box-shadow:0 0 16px 4px #00ff8833}}
  @keyframes progressFill{0%{width:0%}100%{width:var(--w)}}
  @keyframes breathe{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.04);opacity:1}}
  .btn-tap:active{transform:scale(.95);}
  .hovlift:hover{transform:translateY(-2px);transition:transform .2s;}
  .tabitem:hover{background:#00ff8808;}
  input,textarea,select{outline:none;font-family:inherit;}
  input::placeholder,textarea::placeholder{color:#1a3a2a;}
  select option{background:#0a1520;color:#a8d8c0;}
`;

const T = {
  bg:"#020408",bg1:"#060d12",bg2:"#0a1520",bg3:"#0d1e2e",
  border:"#0d2030",border2:"#1a3040",
  green:"#00ff88",blue:"#00b4ff",orange:"#ff8800",
  pink:"#ff006e",gold:"#ffd700",red:"#ff2244",cyan:"#00ffff",
  dim:"#2a5a3a",muted:"#3a6a5a",text:"#a8d8c0",bright:"#e8f8f0",
};
const orb={fontFamily:"'Orbitron',monospace"};
const mono={fontFamily:"'Share Tech Mono',monospace"};
const raj={fontFamily:"'Rajdhani',sans-serif"};

// ─── PROFILE ───
const PROFILE = {
  name:"Peash Rudra",title:"CS Engineer · Researcher · Musician · Athlete · 007",
  university:"Northern University of Business and Technology, Bangladesh (NUBTK)",
  degree:"B.Sc. Computer Science & Engineering",
  thesis:"xAI-Driven Evolutionary Feature Selection for Multi-Omics Cancer Classification: A CRO and SHAP Integrated Framework",
  supervisor:"Mr. Riaz Mohammed — CRO Expert, 2–3 Published Papers",
  height:"5'10\" (177 cm)", startWeight:50, targetWeight:60,
  academics:[
    {level:"PSC",gpa:"5.0 / 5.0",year:"2012",badge:"🏅 SCHOLARSHIP"},
    {level:"JSC",gpa:"5.0 / 5.0",year:"2015",badge:"🏅 SCHOLARSHIP"},
    {level:"SSC",gpa:"5.0 / 5.0",year:"2018",badge:"🏅 GOLDEN A+"},
    {level:"HSC",gpa:"5.0 / 5.0",year:"2020",badge:"🏅 GOLDEN A+"},
    {level:"BSc CSE",gpa:"3.95 / 4.00",year:"2026",badge:"🎓 TOP OF BATCH"},
  ],
  skills:[
    {name:"Debate",level:99,icon:"🎤",note:"National Champion 2018"},
    {name:"Music & Singing",level:90,icon:"🎵",note:"Performer & Champion"},
    {name:"Flutter / Dart",level:85,icon:"📱",note:"Mobile Dev"},
    {name:"Machine Learning",level:62,icon:"🤖",note:"Research Level"},
    {name:"Python",level:55,icon:"🐍",note:"Intermediate"},
    {name:"Competitive Gamer",level:80,icon:"🏆",note:"National Level"},
    {name:"Research Writing",level:65,icon:"📄",note:"Thesis Author"},
    {name:"Git / GitHub",level:58,icon:"💻",note:"Active User"},
    {name:"Leadership",level:92,icon:"🧭",note:"Club Sec · Event Head"},
    {name:"Archery",level:85,icon:"🏹",note:"School Champion"},
    {name:"Football (GK)",level:80,icon:"🧤",note:"College Team Captain GK"},
    {name:"Cricket",level:82,icon:"🏏",note:"Multi-level Champion"},
  ],
  dreams:[
    {icon:"🏍️",dream:"Own a Motorcycle",tag:"Near term"},
    {icon:"🚗",dream:"Own a Car",tag:"Mid term"},
    {icon:"👨‍👩‍👧",dream:"Contribute to Family",tag:"Active"},
    {icon:"💑",dream:"Settle with Partner",tag:"Heart goal"},
    {icon:"🏠",dream:"Build Duplex House",tag:"Long term"},
    {icon:"🌍",dream:"Study / Work Abroad",tag:"Long term"},
    {icon:"💰",dream:"Financial Freedom",tag:"Ultimate"},
    {icon:"🏆",dream:"Top 0.1% Life",tag:"Legacy"},
  ],
  targets:[
    {uni:"BUET MSc CSE",status:"Applying 2027",color:T.blue},
    {uni:"KUET MSc CSE",status:"Applying 2026",color:T.green},
    {uni:"KU MSc CSE",status:"Applying Nov 2026",color:T.orange},
    {uni:"DU CSE MSc",status:"Applying Jul 2026",color:"#a855f7"},
  ],
  achievements:[
    {year:"2018",title:"National Debate Champion",org:"National Level",icon:"🎤",color:"#ffd700"},
    {year:"2018",title:"SSC Golden A+",org:"National Board",icon:"📜",color:"#00ff88"},
    {year:"2018",title:"Singing Champion",org:"School Level",icon:"🎵",color:"#00b4ff"},
    {year:"2018",title:"Archery Champion",org:"School Level",icon:"🏹",color:"#ff8800"},
    {year:"2018",title:"Quiz Champion",org:"School Level",icon:"🧠",color:"#a855f7"},
    {year:"2018",title:"Map Reading Champion",org:"School Level",icon:"🗺️",color:"#00ffff"},
    {year:"2018–2020",title:"College Football — Main Goalkeeper",org:"College Team",icon:"🧤",color:"#00ff88"},
    {year:"2020",title:"HSC Golden A+",org:"National Board",icon:"📜",color:"#00ff88"},
    {year:"2023",title:"Intra Dept Cricket Champion",org:"NUBTK CSE",icon:"🏏",color:"#ff8800"},
    {year:"2024",title:"Inter Dept Debate Champion + Best Debater",org:"NUBTK",icon:"🏆",color:"#ffd700"},
    {year:"2024",title:"Intra CSE Football Champion",org:"NUBTK CSE",icon:"⚽",color:"#00b4ff"},
    {year:"2022–2025",title:"Cultural Programs Organizing Head",org:"NUBTK",icon:"🎭",color:"#ff006e"},
    {year:"2023–2024",title:"Ex. General Secretary — CISC",org:"NUBTK Computer Informatics Science Club",icon:"💻",color:"#00ffff"},
    {year:"2026",title:"BSc CSE — 3.95/4.00 CGPA",org:"NUBTK — Top of Batch",icon:"🎓",color:"#00ff88"},
  ],
  story:[
    {year:"2012–2018",event:"Scholarship holder from PSC to JSC. Dominated academics while winning school-level Singing, Archery, Quiz and Map Reading championships simultaneously.",type:"win"},
    {year:"2018",event:"Became National Debate Champion — top of Bangladesh. Same year scored SSC Golden A+ 5.0/5.0. The kid who could win anything.",type:"win"},
    {year:"2018–2020",event:"College years: main goalkeeper for the football team, debate rep, singer. Everything pointed upward. HSC Golden A+ in 2020.",type:"win"},
    {year:"2020",event:"Scored 32/100 in GST national exam — the most public fall from grace after 8 years of unbroken excellence. Society delivered its verdict fast.",type:"fall"},
    {year:"2020",event:"Friends laughed. Family went quiet. Society labelled him a failure. Private university. As if everything before never happened.",type:"fall"},
    {year:"2020",event:"Made a quiet decision in the silence: no announcements, no drama. Just work. Prove it on paper, not in words.",type:"rise"},
    {year:"2021–2023",event:"Started building again. First intra-department Cricket Championship at NUBTK. Became the go-to person for organizing cultural programs university-wide.",type:"rise"},
    {year:"2023–2024",event:"Elected General Secretary of CISC — the Computer Science club. Leading, organizing, representing. The old Peash Rudra back in charge.",type:"win"},
    {year:"2024",event:"Inter-department Debate Champion AND Best Debater at NUBTK — 4 years after the fall, he walked back onto the debate stage and took the top prize again.",type:"win"},
    {year:"2024",event:"Intra CSE Football Champion. Still the goalkeeper. Still unbeatable when it matters.",type:"win"},
    {year:"2026",event:"Graduated 3.95/4.00 CGPA. Top of batch. The private university they mocked him for became the stage for his return.",type:"win"},
    {year:"2026",event:"Thesis: AI-powered cancer classification with CRO and SHAP — publishable research alongside a 3.95. Not a backup plan. A statement.",type:"win"},
    {year:"2026 →",event:"MSc campaign begins. The public verdict is coming. Every university that sees his file will see a National Champion, a 3.95, and a researcher. The 32 was the opening act.",type:"rise"},
  ],
  quotes:[
    "The people who mocked you at 32/100 haven't seen what you score when you're angry.",
    "A 3.95 GPA after they wrote you off isn't luck. It's a statement.",
    "Every Golden A+ was evidence. The private university was a detour, not the destination.",
    "The comeback isn't just about getting in. It's about showing them who was wrong.",
    "You didn't survive all of that to be ordinary. The machine is warmed up now.",
    "They saw the 32. They didn't see the 3.95 coming. Let them be surprised again.",
    "National Debate Champion. 3.95 GPA. Cancer research thesis. Tell me again how you failed.",
    "Your dreams — the bike, the house, the life abroad — none of them are impossible for who you actually are.",
    "The fall was public. The comeback will be louder.",
    "You are not the 32. You are the 3.95 that followed it.",
    "They gave you a private university and called it a punishment. You turned it into a podium.",
    "Goalkeeper. Debate champion. Archery champion. Researcher. The question was never if you were talented. It was whether you'd survive long enough to show them.",
    "The 32 broke the version of you that needed their approval. What came after didn't need it.",
    "General Secretary. Organizing head. Team captain. You've been leading rooms your whole life — the MSc hall is just the next one.",
    "Some people peaked in school. You fell in school and built something better in the silence that followed.",
    "You won debates before they knew your name. You'll win admissions before they know your score.",
    "Cricket champion. Football champion. Debate champion. Research author. There is no version of your story where you are ordinary.",
    "The people who wrote you off in 2020 will read your thesis title and not understand a single word of it. That's the point.",
    "You came back to the debate stage in 2024 and took Best Debater. That wasn't a win. That was a message.",
    "3.95 in the university they said was beneath you. What will you do in the one they said was above you?",
  ],
};

// ─── WEEKS ───
const WEEKS=[
  {week:1,dates:"Mar 20–26",phase:1,thesis:["📁 Explore BRCA dataset — df.info(), df.describe(), check nulls","📚 Read supervisor Mr. Reaj Mohammed's 2–3 CRO papers","🤝 Book + attend supervisor meeting — ask which CRO variant","📂 Create GitHub repo /data /src /results /thesis — push first commit"],csprep:["📖 Arrays, Linked Lists, Stack, Queue — theory + complexity","💻 Solve 3 easy LeetCode DSA problems","📝 Write 1-page revision summary"],ielts:["🔤 10 new academic words daily","📖 1 IELTS reading passage for understanding"],admission:["🔍 Bookmark: pgadmission.buet.ac.bd, kuet.ac.bd/pgadmission, msadmission.cse.du.ac.bd, ku.ac.bd/discipline/cse","📋 KUET min CGPA 2.75 — you have 3.95 ✅"],blocker:"CRITICAL: Supervisor meeting THIS week. Everything flows from this one action.",milestone:"✅ Supervisor aligned + GitHub live + Dataset explored + First workout done"},
  {week:2,dates:"Mar 27–Apr 2",phase:1,thesis:["🧹 Handle missing values per omics layer","📊 Normalize: log2 gene expression, scale methylation 0–1","🔗 Align samples by patient ID across all omics layers","💾 Save clean dataset as preprocessed.pkl"],csprep:["📖 Binary Trees, BST, Heap — theory + complexity","💻 Implement max-heap from scratch in Python","🃏 3 tree problems on LeetCode"],ielts:["🔤 10 words/day — use each in a sentence","✍️ Write 1 paragraph about your thesis in English"],admission:["📌 Check BUET pgadmission.buet.ac.bd — note next MSc intake date","🗂️ Collect SSC/HSC/BSc certificates + transcripts"],blocker:"Dataset must be clean before any algorithm work. No shortcuts here.",milestone:"✅ Clean preprocessed.pkl saved. Eating 3 meals + 2 snacks consistently."},
  {week:3,dates:"Apr 3–9",phase:1,thesis:["📝 Literature review: 15 papers (5 CRO + 5 SHAP + 5 multi-omics cancer)","🔍 Understand binary CRO: molecule = 0/1 feature vector encoding","📊 EDA: correlation heatmaps, class distribution, feature counts","📁 Create literature_notes.md — track all references"],csprep:["📖 Graphs: BFS, DFS, Dijkstra, Bellman-Ford — theory + code","💻 Implement BFS + DFS in Python","🃏 3 graph problems on LeetCode"],ielts:["🔤 10 words/day","🎙️ Speak 2 minutes: 'Technology in healthcare'"],admission:["📖 BUET past exam questions — list weak topics honestly","📋 Which CS subjects feel rusty? Write them down"],blocker:"GitHub commits every 2–3 days. Build the discipline now.",milestone:"✅ Lit notes done. EDA plots generated. Weak exam topics identified."},
  {week:4,dates:"Apr 10–16",phase:2,thesis:["⚗️ Implement CRO: molecules class, energy function, decomposition reaction","🔢 Binary encoding: molecule = np.array of 0s and 1s","✅ Test CRO on toy dataset (10 features, 50 samples)","📨 Send CRO skeleton code to supervisor for review"],csprep:["📖 Sorting: QuickSort, MergeSort, HeapSort complexity","💻 Implement QuickSort + MergeSort in Python","📝 Write complexity comparison table"],ielts:["✍️ Task 2: 'Technology changes how people work'","📖 Cambridge IELTS Practice Tests — download and start"],admission:["📊 One table comparing BUET vs KUET vs KU vs DU exam format","🎯 Decide primary target university — commit to it today"],blocker:"BUET MSc circular may open April–May — check cse.buet.ac.bd TODAY.",milestone:"✅ CRO skeleton runs without errors. Supervisor reviewed. Weight +1kg."},
  {week:5,dates:"Apr 17–23",phase:2,thesis:["⚗️ Add fitness function: f(molecule) = cross-validation RF accuracy","🔄 Run CRO on BRCA subset (start with 100 samples)","📉 Plot convergence curve: energy vs iterations","🐛 Debug — consult supervisor if stuck more than 2 hours"],csprep:["📖 Dynamic Programming: Knapsack, LCS, Coin Change","💻 Fibonacci memoization + 0/1 Knapsack implementation","🃏 2 DP problems"],ielts:["✍️ Task 2: 'Education should be free for all'","📊 Self-assess: grammar, coherence, task response"],admission:["🔎 Check ku.ac.bd/discipline/cse — KU MSc CSE Nov–Dec 2026 intake","📧 Draft email to KU CSE department about intake schedule"],blocker:"CRO on full dataset is slow — use 100 samples + 200 features max first.",milestone:"✅ CRO selects feature subset. Convergence curve plotted. Smoking ≤3/day."},
  {week:6,dates:"Apr 24–30",phase:2,thesis:["🤖 Train Random Forest on CRO-selected features — record Acc, F1, AUC","🤖 Train SVM (RBF kernel) on same features — record metrics","🤖 Train XGBoost on same features — record all metrics","📊 Build results table: Features | Acc | F1 | AUC"],csprep:["📖 SQL: SELECT, JOIN, GROUP BY, subqueries, triggers","💻 Write 8 SQL queries of increasing complexity","🃏 3 SQL problems"],ielts:["🔤 10 words/day","📖 Timed reading: 1 passage in 20 minutes"],admission:["📅 CHECK cse.buet.ac.bd for MSc 2026 circular — April–May window!","🗂️ All documents scanned as PDF and ready to upload"],blocker:"BUET circular may be LIVE right now — check today urgently.",milestone:"✅ 3 classifiers trained. Results table populated. QUIT SMOKING WEEK."},
  {week:7,dates:"May 1–7",phase:2,thesis:["📦 pip install shap — run SHAP on trained XGBoost model","🖼️ Generate: shap.summary_plot, beeswarm_plot, bar_plot","🧬 Identify top 20 SHAP features — write them down","🔍 Cross-reference top genes with known BRCA biomarkers (ESR1, ERBB2, PIK3CA)"],csprep:["📖 OOP: classes, inheritance, polymorphism, abstract classes","💻 Mini OOP project: Student Management System","🃏 2 OOP design questions"],ielts:["✍️ Task 1: describe a bar chart about university enrollment","🎙️ Describe your research in 2 minutes — record yourself and listen"],admission:["📝 Write Statement of Purpose (SOP) — 1-page draft","🎓 Request recommendation letters from 2 professors"],blocker:"SHAP top genes must match known BRCA markers. Verify in published literature.",milestone:"✅ SHAP plots = KEY THESIS FIGURES complete. Face noticeably better from reduced smoking."},
  {week:8,dates:"May 8–14",phase:2,thesis:["🔧 Tune CRO: test pop sizes 10–50, iterations 100–500","📊 Run CRO 5× with different seeds — report mean ± std accuracy","🧬 Biological validation: SHAP genes vs published BRCA gene signatures","📨 Major supervisor check-in — present ALL current results"],csprep:["📖 Theory of Computation: DFA, NFA, CFG, pumping lemma","📝 Practice NFA → DFA conversion","🃏 TOC problems — hardest topic, give extra time"],ielts:["📝 Full IELTS mock test (all 4 sections, timed)","📊 Score yourself — identify weakest section"],admission:["✏️ Revise SOP — get feedback from someone you trust","📋 Portfolio: thesis abstract + 1-page preliminary results summary"],blocker:"Don't tune CRO parameters blindly — discuss results with supervisor first.",milestone:"✅ Best CRO params found. Biological validation done. SOP polished."},
  {week:9,dates:"May 15–21",phase:3,thesis:["⚔️ pip install deap — implement GA feature selection","⚔️ pip install pyswarms — implement PSO feature selection","⚔️ LASSO + RFE via scikit-learn — 1 day each","📊 Run all 5 methods on identical BRCA dataset and same train/test split"],csprep:["📖 OS: scheduling (FCFS/SJF/Round Robin), deadlocks, paging","📝 Draw OS scheduling Gantt charts by hand","🃏 3 OS problems"],ielts:["✍️ Task 2: 'AI will replace human jobs — both views'","🔤 Focus vocabulary from mock test weak areas"],admission:["🔍 Check ku.ac.bd for any new MSc 2026 announcements","📧 Email KUET CSE department: inquiry about 2026–27 MSc intake date"],blocker:"Use DEAP + pyswarms libraries — NOT implemented from scratch. Too time-consuming.",milestone:"✅ All 5 baseline methods running. Raw comparison results collected."},
  {week:10,dates:"May 22–28",phase:3,thesis:["📐 scipy.stats.wilcoxon — CRO vs each baseline (5 separate tests)","📐 scipy.stats.friedmanchisquare — all 5 methods together","📊 Final comparison table: Method | Features | Acc | F1 | AUC | p-value","📈 Plot convergence curves of all methods on same graph"],csprep:["📖 Computer Networks: OSI model, TCP/IP, subnetting, HTTP/DNS","🔢 Practice subnetting math: IP conversion, subnet masks","🃏 3 networking problems"],ielts:["📖 3 passages timed: 60 minutes total","📝 Every wrong question type — note the pattern"],admission:["📋 Finalize document checklist for all 4 universities","🗂️ Get certificates attested or notarized if required"],blocker:"p-value < 0.05 required to claim CRO is significantly better than baselines.",milestone:"✅ Statistical proof complete. CRO proven better. Weight +5kg from starting point."},
  {week:11,dates:"May 29–Jun 4",phase:3,thesis:["🖼️ Finalize ALL figures — SHAP, convergence curves, comparison table","📋 Write every figure caption — must be self-explanatory to a reader","🔍 Final results review with supervisor — get written approval to write","📁 Organize /results folder: CSVs, plots, trained model files, metrics"],csprep:["📖 Digital Logic: NAND/NOR, Boolean algebra, Karnaugh maps, flip-flops","📝 Practice K-map simplification problems","🃏 3 digital logic problems"],ielts:["🎙️ Record 3 speaking topics — listen back critically and self-grade","📊 Second full mock test — target score improvement vs Week 8"],admission:["📝 Write professor email templates for all 4 universities","🎯 Identify 3 professors whose research overlaps your CRO+SHAP thesis"],blocker:"No chapter writing until supervisor approves all results. Physical style upgrade this week.",milestone:"✅ All figures finalized. Supervisor signed off. Visible physical transformation in mirror."},
  {week:12,dates:"Jun 5–11",phase:4,thesis:["✍️ Chapter 3: Methodology — CRO algorithm, SHAP integration, dataset details","✍️ Chapter 4: Results & Analysis — all figures and tables included","📌 Consistent formatting throughout both chapters","📨 Send Chapters 3 + 4 to supervisor for feedback"],csprep:["📝 Full BUET-style mock exam: 2 hours, all topics","📊 Score yourself — identify any remaining weak areas","🎯 Final focused sprint on weakest 2 topics"],ielts:["✍️ Timed Task 2: exactly 40 minutes — 250+ words mandatory","📊 Check word count + coherence + task response criteria"],admission:["📧 Send professor emails with 1-page research summary attached","🔔 Monday reminder: check all 4 university portals for new circulars"],blocker:"Write fast, revise later. A rough first draft beats a perfect blank page every time.",milestone:"✅ Chapters 3+4 first draft done. +7kg total gain. Shirts fitting completely differently."},
  {week:13,dates:"Jun 12–18",phase:4,thesis:["✍️ Chapter 1: Introduction — problem statement, motivation, research gaps","✍️ Chapter 2: Literature Review — from Week 3 notes, organized by theme","✍️ Chapter 5: Conclusion — summary, limitations, future work","🔄 Incorporate all supervisor feedback on Chapters 3 and 4"],csprep:["📚 Final sweep: 1 bullet-point page per topic","💬 Explain your thesis to a non-expert in under 3 minutes","🎯 Last intense CS exam prep week before submission"],ielts:["📖 Final timed reading practice session","🎙️ Final speaking practice — record and evaluate yourself"],admission:["📋 Finalize KUET application at kuet.ac.bd/pgadmission","📋 Finalize KU CSE application at ku.ac.bd — Nov–Dec 2026 intake","📋 Finalize DU CSEDU at msadmission.cse.du.ac.bd — July 2026"],blocker:"Always cite supervisor's CRO papers in lit review. Strategic, respectful, important.",milestone:"✅ All 5 chapters drafted. All applications prepared. Confidence at peak level."},
  {week:14,dates:"Jun 19–25",phase:4,thesis:["✏️ Full thesis revision: flow, grammar, figure references, consistency","📝 Write Abstract — 250 words: background + method + results + conclusion","🔗 Fix all references with Zotero — consistent citation style throughout","📐 Format: title page, table of contents, figures list, page numbers uniform"],csprep:["💬 Prepare 10 viva questions: 'Why CRO?', 'What is SHAP?', 'How validated?'","🎤 Practice answers out loud — confidently and concisely","✅ Light review only now — you are ready for the exam"],ielts:["📅 Register for IELTS exam — target September/October 2026","🎯 Goal: minimum 6.5 overall, 7.0 for strong scholarship applications"],admission:["📧 Follow up professor emails if no reply after 1 week","📝 Write final cover letter for all university applications"],blocker:"The Abstract must stand alone. A stranger reading it should understand everything.",milestone:"✅ Thesis 95% complete. IELTS registered. +9–10kg. Hero build is real."},
  {week:15,dates:"Jun 26–30",phase:4,thesis:["🔧 Final corrections from supervisor's last round of feedback","🎨 Final formatting pass: font, spacing, margins, page numbers — all uniform","🖨️ Print and bind per university's exact format requirement","🚀 SUBMIT THESIS BY JUNE 30 ✓"],csprep:["🎉 Rest — you earned it completely. Light review only.","💬 Prepare for thesis defense or viva questions"],ielts:["🎉 Celebrate submission. Keep 15 minutes daily reading as a habit.","📅 IELTS prep continues passively — don't break the momentum"],admission:["📤 Note all MSc application deadlines: DU (July), KUET (Aug–Sept), KU (Nov–Dec)","📧 Email professors after submission: 'I just submitted my thesis on CRO+SHAP...'"],blocker:"Check exact university formatting guide at Week 1, not Week 15.",milestone:"🎓 THESIS SUBMITTED. BODY TRANSFORMED. THE COMEBACK IS REAL AND PERMANENT."},
];

// ─── WORKOUT DAYS (Beginner-Friendly — Rudra: 50kg, skinny-fat, new to training) ───
const DAYS=[
  {day:1,name:"PUSH DAY",sub:"Chest · Shoulders · Triceps",icon:"🔥",color:T.green,level:"BEGINNER",focus:"Build pushing strength. Quality over quantity every single rep.",
    warmup:["1 min gentle arm circles — small to big, both directions","10 slow shoulder rolls forward then backward","10 wrist circles each way — joints need warming","5 wall push-ups VERY slowly (3s down, hold 1s, push up) — prime the movement"],
    exercises:[
      {id:"p1",name:"Wall Push-ups",sets:3,reps:"10",rest:90,
        tip:"Stand arm's length from wall. Lean in, touch wall with nose, push back. This is your FOUNDATION. Master this first.",
        why:"Builds push pattern safely. No wrist/shoulder strain. Perfect for week 1–2.",
        mod:"Too easy? Move feet further from wall. Still hard? Closer to wall.",
        form:["Hands at shoulder height, shoulder-width","Body straight like a board — no bent hips","Breathe in going toward wall, out pushing away","Feel chest working, not just arms"]},
      {id:"p2",name:"Incline Push-ups (on chair)",sets:3,reps:"8",rest:90,
        tip:"Hands on chair seat, body diagonal. Halfway between wall and floor push-up. Chest must touch chair.",
        why:"Progressive step toward floor push-ups. Safer on weak wrists.",
        mod:"Too hard? Use a higher surface (table). Getting easier? Use a lower chair.",
        form:["Elbows 45° from body — not flared out wide","Look slightly ahead not straight down","Hips in line — squeeze glutes to keep body rigid","Each rep full range: touch chair, fully extend"]},
      {id:"p3",name:"Knee Push-ups",sets:3,reps:"6",rest:90,
        tip:"Knees on floor, hands wider than shoulders. Lower your CHEST not your head. This is not cheating — it's smart progression.",
        why:"Real chest activation with reduced bodyweight. Bridge to full push-ups.",
        mod:"Too hard? Go back to incline. Getting 8+ reps easy? Try 2 full push-ups at end of each set.",
        form:["Knees together, not splayed out","Hips down — no 'tent' shape with raised butt","Chest touches floor on each rep","2 second pause at bottom — don't bounce"]},
      {id:"p4",name:"Pike Push-ups (Easy Version)",sets:2,reps:"5",rest:90,
        tip:"Downward-dog position. Bend elbows to lower head toward floor between your hands. Only go as low as comfortable.",
        why:"Trains shoulder pressing. Builds the V-shape shoulders that transform posture.",
        mod:"Can't go low? Just 2–3cm movement is fine. Build range over weeks.",
        form:["Hips high in V-shape","Head between hands as you lower","Don't shrug shoulders up to ears","Push floor away to come back up"]},
      {id:"p5",name:"Tricep Wall Push",sets:2,reps:"10",rest:60,
        tip:"Face wall, hands close together (thumbs almost touching) at chest height. Push yourself away. Elbows stay close to sides.",
        why:"Tricep isolation — critical for arm size and push strength. Zero wrist strain.",
        mod:"Easy? Try with hands lower (more lean angle).",
        form:["Hands narrow — close together","Elbows TIGHT to body, don't let them flare","Full extension — lock out arms at end","Controlled return, don't fall into wall"]},
      {id:"p6",name:"Plank Hold",sets:2,reps:"15s",rest:60,
        tip:"Forearms on floor, body straight. Start with just 15 seconds. Quality > duration. Add 5s each week.",
        why:"Core stability is the foundation of EVERY exercise. Non-negotiable.",
        mod:"Can't hold 15s? Do 3 x 5s with 5s rest between. Still counts.",
        form:["Elbows under shoulders, not out in front","Don't let hips sag OR rise — body is a plank","Breathe normally — don't hold breath","Look at floor 30cm in front of hands"]},
    ],
    cooldown:["30s doorframe chest stretch — arm at 90°, lean forward gently","20s tricep overhead stretch each arm — gentle, no forcing","30s child's pose — arms extended, breathe into the stretch"]},
  {day:2,name:"PULL DAY",sub:"Back · Biceps · Rear Delts",icon:"⚡",color:T.blue,level:"BEGINNER",focus:"Pulling muscles fix your posture and build the back thickness that transforms your frame.",
    warmup:["10 slow arm swings across body — feel shoulder blades moving","15 scapular squeezes — pinch shoulder blades together, hold 2s, release","10 neck side stretches — ear to shoulder, hold 5s each side","5 cat-cow on floor — arch and round the spine slowly"],
    exercises:[
      {id:"u1",name:"Door Row (Standing)",sets:3,reps:"8",rest:90,
        tip:"Hold both door handle sides, lean back 30–45°, pull your chest to the door. Easiest back exercise that actually works.",
        why:"Zero equipment back training. Teaches the pulling movement pattern safely.",
        mod:"Too easy? Lean back further (more bodyweight). Too hard? Less lean angle.",
        form:["Feet close to door, lean back — don't sit","Pull elbows BACK not just up","Squeeze shoulder blades together at the top","Lower slowly — 3 seconds on the way down"]},
      {id:"u2",name:"Table Row (Lying)",sets:3,reps:"6",rest:90,
        tip:"Lie under a sturdy table, grip edge, pull chest up to table. Body straight. This is a genuine back exercise — don't rush it.",
        why:"Horizontal pulling builds back width and rear delts for posture correction.",
        mod:"Too hard? Bend knees so feet are flat on floor (reduces bodyweight). Too easy? Straighten legs fully.",
        form:["Grip slightly wider than shoulders","Pull until chest nearly touches table","Elbows go back and flare slightly out","Lower all the way down — full range matters"]},
      {id:"u3",name:"Superman Hold",sets:3,reps:"8",rest:60,
        tip:"Lie face down, lift arms AND legs off floor simultaneously. Hold 2 seconds at top. This builds the lower back you desperately need for safe training.",
        why:"Critical lower back strength. Prevents injury as exercises get harder.",
        mod:"Too hard? Just lift arms, keep feet on floor. Or just legs, keep arms down.",
        form:["Start with arms extended overhead","Lift everything simultaneously — no jerking","Hold at top and SQUEEZE the glutes","Lower controlled — don't drop"]},
      {id:"u4",name:"Y-T-W Raises",sets:2,reps:"8",rest:60,
        tip:"Face down, arms raised: Y shape first (overhead), then T (sides), then W (bent elbow). This looks easy — it is NOT. Small movement, massive impact.",
        why:"Fixes rounded shoulders and improves posture — critical for someone sitting studying all day.",
        mod:"Can't feel it? Focus on squeezing shoulder blades throughout.",
        form:["Thumbs pointing up in all positions","Small range of motion — only lift what you can control","Go slow — 3 seconds up, hold, 3 seconds down","Feel the muscles between your shoulder blades BURNING"]},
      {id:"u5",name:"Doorframe Bicep Curl",sets:2,reps:"10",rest:60,
        tip:"Stand in doorframe, hold frame at waist height, lean back slightly, curl your body up by bending elbows. Feels strange at first — practice it.",
        why:"First real bicep work. Builds the arm muscles and reinforces the pull pattern.",
        mod:"Can't feel biceps? Try gripping at different heights.",
        form:["Start with arms nearly straight","Pull elbows in tight to sides as you curl","Pause at top — squeeze for 1 second","Lower fully — don't do partial reps"]},
    ],
    cooldown:["30s doorframe lats stretch — one arm overhead, lean to opposite side","20s bicep wall stretch — arm straight back on wall, turn away gently","30s child's pose — great for upper back release after pulling"]},
  {day:3,name:"LEGS + CORE",sub:"Quads · Glutes · Core · Balance",icon:"💥",color:T.orange,level:"BEGINNER",focus:"Your legs are your biggest muscles. Training them boosts testosterone and total-body growth.",
    warmup:["10 ankle circles each direction — joint prep","15 leg swings forward-back holding wall — hip mobility","10 slow hip circles each direction — loosen the hip flexors","5 slow deep squat holds — 5 seconds at bottom, use wall for support"],
    exercises:[
      {id:"l1",name:"Box Squats (Chair Sit-Stand)",sets:3,reps:"10",rest:90,
        tip:"Stand in front of chair. Squat until you barely touch the seat, then stand back up. The chair teaches depth and removes fear of falling. Don't PLOP — touch and stand.",
        why:"Teaches squat pattern safely. Builds quad, glute, and core strength from day one.",
        mod:"Too hard? Use higher surface or hold wall lightly. Too easy? Pause 2s at bottom before standing.",
        form:["Feet shoulder-width, toes slightly out 10–15°","Chest up — don't fold forward","Knees track over toes — don't let them cave in","Push through your HEELS to stand up"]},
      {id:"l2",name:"Glute Bridges",sets:3,reps:"12",rest:60,
        tip:"Lie on back, knees bent, feet flat. Drive hips UP by squeezing glutes. This is the best glute exercise. Hold 2s at top. You will feel this in your butt — that's correct.",
        why:"Activates glutes which are likely dormant from sitting. Essential for posture, back health, and leg day.",
        mod:"Easy? Try single-leg version (other leg raised). Hard? Smaller range of motion.",
        form:["Feet hip-width, 30cm from butt","Press through heels — not balls of feet","Squeeze glutes HARD at the top — don't just raise hips","Lower slowly — don't let hips drop fast"]},
      {id:"l3",name:"Standing Calf Raises",sets:3,reps:"15",rest:45,
        tip:"Stand at edge of step or just flat floor. Rise on toes, hold 1s, lower fully. Calves are stubborn — go slow and feel the squeeze.",
        why:"Calf development changes how your legs look. Also improves ankle stability for all exercises.",
        mod:"On floor? Perfectly fine to start. Add step-edge when comfortable.",
        form:["Both feet, rise on toes fully","Pause at top — don't bounce","Lower BELOW floor level if on step (full stretch)","Control the descent — 2 seconds down"]},
      {id:"l4",name:"Reverse Lunges (Holding Wall)",sets:2,reps:"6 each leg",rest:90,
        tip:"Step ONE leg back, lower that knee toward floor, stand back up. Hold wall lightly for balance. Do all reps on one leg, then switch. Step BACK not forward — much easier on knees.",
        why:"Single-leg strength prevents muscle imbalance. Reveals which leg is weaker.",
        mod:"Losing balance? Hold wall with both hands. Getting confident? No wall support.",
        form:["Step back far enough so front knee stays over ankle","Lower back knee to 2cm off floor — don't crash it","Push through FRONT HEEL to stand up","Keep chest upright — don't lean forward"]},
      {id:"l5",name:"Dead Bug (Core)",sets:2,reps:"5 each side",rest:60,
        tip:"Lie on back. Arms straight up, knees at 90°. Slowly lower opposite arm and leg to floor without touching. Return. This sounds easy and feels IMPOSSIBLE. That's the point.",
        why:"The safest core exercise. Teaches spinal stability that protects your back during every other exercise.",
        mod:"Too hard? Just lower arm without moving leg. Or just leg, no arm.",
        form:["Lower back PRESSED into floor — critical — don't let it arch","Move slowly — 4 seconds to lower, 4 seconds back","Breathe OUT as you lower arm/leg","Stop if lower back lifts off floor"]},
    ],
    cooldown:["60s standing quad stretch each leg — hold ankle to butt, hold wall","30s seated hamstring stretch — straight leg, reach for toes","30s hip flexor lunge stretch each side — knee on floor, lean forward"]},
  {day:4,name:"PUSH (PROGRESS)",sub:"Chest · Triceps · Shoulders",icon:"🔥",color:T.green,level:"BEGINNER→INTERMEDIATE",focus:"Same muscles as Day 1, but push slightly harder. More reps, harder variations where you can.",
    warmup:["30s arm circles — bigger range than Day 1","10 incline push-ups slow — treating it as warmup now","10 wrist circles each way","5 deep breaths — focus your mind on what you're building"],
    exercises:[
      {id:"v1",name:"Push-ups (Knees → Attempts at Full)",sets:3,reps:"8",rest:90,
        tip:"Start with knee push-ups. After set 2, try 2–3 FULL push-ups. Don't worry if you can't — you're building the foundation right now. Track your best attempt.",
        why:"Every time you try the harder version, you send a signal to your nervous system to adapt.",
        mod:"Full push-up feels impossible? Pure knee push-ups are absolutely fine. Progress comes with time.",
        form:["Full push-up: entire body rigid from head to toe","Lower until chest grazes floor — no half reps","Elbows 45° out — protect shoulder joint","Push explosively UP, lower controlled"]},
      {id:"v2",name:"Incline Push-ups — Lower Surface",sets:3,reps:"10",rest:75,
        tip:"This week use a lower surface than last week — lower chair, or a stack of books. Same movement, harder angle. You are progressing.",
        why:"Progressive overload without equipment. Your muscles must work harder each week.",
        mod:"Same surface as last week? That is fine — increase reps instead.",
        form:["Full range — chest to surface, full arm extension","No hip sag or rise","3 second descent is your new standard","Feel the chest stretch at bottom of each rep"]},
      {id:"v3",name:"Pike Push-ups (More Range)",sets:2,reps:"6",rest:90,
        tip:"Same as Day 1 but go 2–3cm lower this week. Small progress is real progress.",
        why:"Shoulders need consistent work. Each week of slightly deeper range builds pressing strength.",
        mod:"Head touching floor? That's excellent — you're ahead of schedule.",
        form:["Hips higher than Day 1 if possible","Head goes between hands — not in front","Lock arms out fully at top","Don't rush — slow reps build more strength"]},
      {id:"v4",name:"Chair Dips (Short Range)",sets:2,reps:"6",rest:90,
        tip:"Sit on chair edge, hands gripping sides, lower yourself 5–10cm only. This IS a dip even if tiny. Your triceps and shoulders will burn.",
        why:"Dips are the most effective tricep exercise. Start small — wrists and elbows need to adapt.",
        mod:"Wrist pain? Skip this for now. Replace with extra wall tricep pushes.",
        form:["Hands close to hips on chair edge","Elbows point STRAIGHT BACK — not out to sides","Lower 5–10cm only for first 2 weeks","Press back up without using legs"]},
      {id:"v5",name:"Plank (Progress)",sets:2,reps:"20s",rest:60,
        tip:"5 more seconds than Week 1. That IS progress. Your core is getting stronger even if you can't see it yet.",
        why:"Core strength = foundation of everything. Never skip this.",
        mod:"Add 5s per week as your standard progression goal.",
        form:["All Day 1 form cues apply","Add: tense your thighs and squeeze glutes while holding","Breathe slowly in through nose, out through mouth","If shaking — that's fine. Muscles working."]},
    ],
    cooldown:["30s doorframe chest stretch each side","20s overhead tricep stretch each arm","30s wrist flexor stretch on floor — important for push-up wrists"]},
  {day:5,name:"PULL (PROGRESS)",sub:"Back · Biceps · Posture",icon:"⚡",color:T.blue,level:"BEGINNER→INTERMEDIATE",focus:"Back training is the most important thing a skinny person can do. Fix posture, build width.",
    warmup:["15 scapular retractions — squeeze blades for 2s each","10 slow arm swings across body","5 cat-cow on floor — spinal mobility","Band pull-apart simulation — hold arms out, squeeze imaginary band"],
    exercises:[
      {id:"b1",name:"Table Rows (More Reps)",sets:3,reps:"8",rest:90,
        tip:"Same table setup as Day 2. This week, 2 more reps per set. AND add a 2-second squeeze at the top of each rep. That squeeze is where the back activation happens.",
        why:"Back muscles respond to mind-muscle connection. The squeeze cue is critical for beginners.",
        mod:"Table feels wobbly? Use a sturdy desk or ask someone to hold it.",
        form:["Squeeze shoulder blades like you're cracking a walnut between them","Hold 2 seconds at top — don't rush through","Full hang at bottom — let arms extend completely","Don't swing — strict form only"]},
      {id:"b2",name:"Door Row (Deeper Lean)",sets:3,reps:"10",rest:75,
        tip:"Same door, but lean back 10° more than last time. More bodyweight = more difficulty = more strength gain.",
        why:"Progressive overload principle. Each week should be slightly harder than the last.",
        mod:"Body swinging? Engage core — squeeze abs throughout the movement.",
        form:["Lean angle is your resistance control","Pull elbows PAST your body — not just to your sides","Pause at top — chest near door handle","Slower descent = more muscle work"]},
      {id:"b3",name:"Superman Hold (3s hold)",sets:3,reps:"10",rest:60,
        tip:"Same position — but this week HOLD 3 seconds at the top of each rep. Those 3 seconds are where lower back and glute strength is built.",
        why:"Time-under-tension is how you make bodyweight exercises harder without equipment.",
        mod:"Back cramping? Shorten hold to 1s. Build up over weeks.",
        form:["Full body tense at top — arms, legs, glutes, lower back all at once","Keep head neutral — look at floor","3 second hold, then SLOW descent","Breathe normally — don't hold breath during hold"]},
      {id:"b4",name:"Doorframe Bicep Curl (2 sets)",sets:2,reps:"12",rest:60,
        tip:"More reps this week. Slow it down — 3 seconds up, hold 1s, 3 seconds down. Slow curls build more bicep than fast ones.",
        why:"Biceps need volume for growth. Two slow sets beat four sloppy sets.",
        mod:"Adding a slight body sway to complete reps? Reduce range slightly to stay strict.",
        form:["Zero swinging — if you rock, the weight is too heavy","Both arms simultaneously for efficiency","Wrists stay straight — don't let them bend back","Contract bicep hard at the top — feel the peak"]},
      {id:"b5",name:"Wall Angels",sets:2,reps:"10",rest:45,
        tip:"Back flat against wall, arms in W position, slide up to Y, back to W. Sounds simple — most people find this IMPOSSIBLE at first because of tight chest and weak upper back. That's exactly why you need it.",
        why:"Directly counteracts phone/study posture. Rebuilds the shoulder and upper back mobility.",
        mod:"Back won't stay flat on wall? Just do what you can — it improves weekly.",
        form:["Lower back touches wall — tuck pelvis slightly","Elbows and wrists stay on wall throughout","Slow sliding — 4 seconds up, 4 down","Feel the stretch in your chest as arms go overhead"]},
    ],
    cooldown:["30s doorframe lats stretch each side","30s chest opener — clasp hands behind back, squeeze blades, look up","20s neck stretch each side — ear to shoulder, 3 deep breaths"]},
  {day:6,name:"FULL BODY (BEGINNER CIRCUIT)",sub:"All Muscles · Burn Fat · Build Base",icon:"⚔️",color:T.pink,level:"BEGINNER",focus:"One round through everything. This is your first full-body test. Take it seriously but go at YOUR pace.",
    warmup:["2 min light walking in place — get blood moving","10 arm circles each direction","10 slow squats — bodyweight only","10 leg swings each leg"],
    exercises:[
      {id:"c1",name:"Incline Push-ups",sets:2,reps:"10",rest:45,
        tip:"Circuit round 1: Incline push-ups. Rest 45 seconds then move to squats. DO NOT rest longer — the burn is the point.",
        why:"Circuit training burns calories AND builds muscle simultaneously. Best for body recomposition.",
        mod:"Too gassed? Add 15 seconds to each rest. The key is completing all rounds.",
        form:["Good form even when tired — no exceptions","If form breaks, reduce reps not form quality","Breathe rhythmically — don't hold breath"]},
      {id:"c2",name:"Chair Squats",sets:2,reps:"12",rest:45,
        tip:"Immediately after push-ups. Chair squat — touch and stand. Legs burning? Good.",
        why:"Legs are biggest muscle group — burning them burns the most calories.",
        mod:"Can't do 12? Do 8. Consistency matters more than number.",
        form:["Same form as Day 3 box squats","Push through heels","Chest up throughout"]},
      {id:"c3",name:"Door Row",sets:2,reps:"8",rest:45,
        tip:"After squats. Pull your back into work while legs recover. Smart circuit design.",
        why:"Pulling after pushing gives each muscle group a partial rest.",
        mod:["Lean just 20–30° if legs are shaky from squats"]},
      {id:"c4",name:"Glute Bridges",sets:2,reps:"10",rest:45,
        tip:"Floor-based — lets your upper body recover while training glutes and core.",
        why:"Posterior chain development essential for posture and overall strength.",
        mod:["Squeeze at top for 2s for extra difficulty"]},
      {id:"c5",name:"Plank Hold",sets:2,reps:"20s",rest:60,
        tip:"Final exercise each round. 20 seconds of pure core. If you finish this — you've completed your first full-body workout.",
        why:"Ending with planks locks in core stability while fatigued — trains real-world strength.",
        mod:["Drop to knees if shaking too much to maintain form"]},
    ],
    cooldown:["90s: full body — any stretch that feels good to you right now","60s child's pose — you earned it","30s happy baby pose — lower back release after your first real circuit"]},
  {day:7,name:"REST + ACTIVE RECOVERY",sub:"Mobility · Stretch · Mental Reset",icon:"🌙",color:T.gold,level:"ESSENTIAL",focus:"Rest is not laziness. Muscles grow BETWEEN workouts. This day is as important as day 1.",
    warmup:[],
    exercises:[
      {id:"r1",name:"15-min Walk Outside",sets:1,reps:"15 min",rest:0,
        tip:"Actual sunlight on your face. Vitamin D, serotonin, reduced cortisol. Non-negotiable for both body and thesis brain.",
        why:"Low-intensity movement improves blood flow to recovering muscles — speeds up growth.",
        mod:["Indoors? Walk your building stairs or march in place"]},
      {id:"r2",name:"Full Body Stretch — 10 min",sets:1,reps:"10 min",rest:0,
        tip:"No timer rushing you. Each major muscle group: chest, back, quads, hamstrings, hip flexors, shoulders. Hold each 30s.",
        why:"Flexibility training prevents injury as strength increases. Critical for beginners.",
        mod:["YouTube: 'beginner full body stretch 10 minutes' — follow along if unsure what to do"]},
      {id:"r3",name:"Deep Diaphragm Breathing",sets:3,reps:"10 breaths",rest:30,
        tip:"Hand on belly. Breathe so belly rises — not chest. 4s in, hold 4s, 6s out. Resets nervous system after a week of training and studying.",
        why:"Reduces cortisol. Lowers blood pressure. Improves sleep quality. Free performance enhancement.",
        mod:["Do this lying down for maximum relaxation"]},
      {id:"r4",name:"Cold Water Face Splash",sets:1,reps:"2 min",rest:0,
        tip:"Cold water on face activates the vagus nerve — immediate stress reduction. Also helps with smoking-related puffiness in face.",
        why:"Circulation boost. Alertness. Skin health. 2 minutes costs nothing.",
        mod:["Splash 15–20 times, then hold cold cloth on face for 30s"]},
    ],
    cooldown:["Plan your meals for next week — Sunday meal prep = consistency","Review what 3 exercises improved this week — celebrate the wins","Sleep by 11 PM tonight — muscle synthesis peaks during deep sleep"]},
];

const MEALS=[
  {time:"7:00 AM",name:"Wake-Up Fuel",foods:"2 boiled eggs + banana + full-fat milk",cal:450,color:T.gold},
  {time:"9:00 AM",name:"Power Breakfast",foods:"3 roti/paratha + 2 eggs + vegetables",cal:600,color:T.green},
  {time:"12:00 PM",name:"Pre-Workout",foods:"Banana + peanuts + glass of milk",cal:400,color:T.blue},
  {time:"2:00 PM",name:"Main Meal",foods:"2 cup rice + dal + chicken or fish curry",cal:750,color:T.orange},
  {time:"5:00 PM",name:"Post-Workout",foods:"Rice or bread + banana (within 30 MIN of workout)",cal:350,color:T.pink},
  {time:"8:00 PM",name:"Dinner",foods:"Rice or roti + protein + vegetables",cal:650,color:T.green},
  {time:"10:30 PM",name:"Pre-Sleep Anabolic",foods:"Warm milk + banana + peanut butter",cal:350,color:T.gold},
];

// ─── PERSONALIZED ANALYSIS DATA ───────────────────────────────────────────
const RUDRA_ANALYSIS = {
  // Deep personal profile analysis
  strengths:[
    {area:"Debate & Communication",score:99,impact:"HIGH",detail:"National Champion 2018. Re-won Best Debater 2024. Viva panels are your arena. Email professors with confidence. Your articulation is a top-1% skill in Bangladesh academia."},
    {area:"Academic Consistency",score:95,impact:"HIGH",detail:"PSC/JSC/SSC/HSC all 5.0/5.0. BSc 3.95 — top of batch despite the GST setback. You don't peak — you sustain. Professors notice sustained performers over one-time scorers."},
    {area:"Research Novelty",score:88,impact:"HIGH",detail:"CRO+SHAP for multi-omics cancer classification is genuinely novel. Your supervisor has 2–3 published CRO papers — you're building on a real research lineage. This is publishable work."},
    {area:"Leadership Record",score:90,impact:"MEDIUM",detail:"CISC General Secretary. Inter-dept debate. Event head. Cricket/Football captain. You have led teams in 5+ domains. MSc committees respond well to leadership evidence."},
    {area:"Sporting Champion",score:87,impact:"MEDIUM",detail:"Archery school champion. Football college team captain GK. Cricket multi-level. National debater. This profile is exceptionally rare in CS applicants — use it in your SOP as evidence of discipline."},
    {area:"GST Recovery",score:100,impact:"TRANSFORMATIVE",detail:"32/100 in the most public exam of your academic life. Then: 3.95 GPA. Best Debater again. Published research. The recovery is the story. Every admission committee understands comeback narratives."},
  ],
  weaknesses:[
    {area:"CS Exam Preparation",score:40,impact:"HIGH",detail:"BUET and DU require hard written exams. DSA (trees, graphs, DP) and SQL are your main gaps. Plan: LeetCode 50 Easy-Medium + GeeksforGeeks DSA track between July–March 2027."},
    {area:"IELTS Score",score:0,impact:"HIGH",detail:"Not yet taken. Required for all foreign scholarships (6.5+). Target: register Oct 2026. Reading and Listening are your strongest sections based on your English proficiency profile."},
    {area:"Body Weight",score:35,impact:"MEDIUM",detail:"Currently 50kg, target 60kg. +10kg required. This is purely a nutrition consistency issue. You need 2800–3200 cal/day. The workout is secondary to eating enough food."},
    {area:"Smoking",score:30,impact:"HIGH",detail:"Direct health impact. Reduces lung capacity, sleep quality, and focus. Each cigarette is Tk 8–12 and costs approximately 11 minutes of life. Quit by Week 6 — it's in the plan."},
    {area:"Python Depth",score:55,impact:"MEDIUM",detail:"Research-level is good for the thesis. But for BUET exam and MSc coursework, you need stronger algorithms implementation skills. Practice on LeetCode using Python only."},
  ],
  competitiveEdge:[
    "You are a Khulna local applying to Khulna universities. This is statistically rare — most serious applicants come from Dhaka.",
    "3.95 GPA from NUBTK puts you above 95% of KUET/KU applicants who have minimum-viable GPAs.",
    "National Debate Championship 2018 + re-win 2024 is unique. No other CSE applicant in your batch has this.",
    "Your supervisor Mr. Riaz Mohammed has CRO publications — you have a direct academic lineage that KUET faculty will recognize.",
    "CRO+SHAP on multi-omics cancer data is novel at Bangladesh MSc level. You are not submitting a routine thesis.",
    "You have sports championships across 3+ disciplines. This signals discipline, team leadership, and physical health — rare in CS profiles.",
  ],
  scholarshipReadiness:{
    daad:{name:"DAAD Germany",score:55,missing:["IELTS 6.5+","1 publication","MSc degree"],when:"2028",note:"Very achievable after KUET MSc + 1 paper. Germany has 5,000+ DAAD scholars/year."},
    commonwealth:{name:"Commonwealth UK",score:50,missing:["IELTS 7.0+","1–2 publications","MSc with high CGPA"],when:"2028–2029",note:"Highly competitive. Your debate + research profile is exactly what they look for."},
    vanier:{name:"Vanier Canada",score:40,missing:["IELTS 7.0+","Publications","Strong reference letters"],when:"2029",note:"$50,000/year. Requires exceptional leadership evidence — you already have this."},
    erasmus:{name:"Erasmus Mundus EU",score:60,missing:["IELTS 6.5+","BSc/MSc strong record"],when:"2027",note:"Multiple MSc programs. Funded. Apply even during KUET MSc year 1."},
  },
  timelineAnalysis:[
    {period:"Now → Jun 1",focus:"THESIS SUBMISSION",priority:"🔴 CRITICAL",actions:["Complete all 15 thesis weeks","Get supervisor approval","Write all 5 chapters","Final binding and submission"]},
    {period:"Jun 2026",focus:"IMMEDIATE RESET",priority:"🟡 IMPORTANT",actions:["Email professors at KUET, KU, DU, BUET","Apply DU CSEDU (earliest deadline)","Register IELTS for October","Start body transformation seriously"]},
    {period:"Jul–Sep 2026",focus:"KUET ADMISSION",priority:"🔴 CRITICAL",actions:["Monitor kuet.ac.bd every Monday","Apply on Day 1 of circular","Prepare viva answers","Get recommendation letter from Mr. Riaz Mohammed"]},
    {period:"Jul–Oct 2026",focus:"PARALLEL GRIND",priority:"🟡 IMPORTANT",actions:["Build Fiverr/Upwork profile","IELTS prep 30 min daily","Body: hit 55kg intermediate target","Rest and recover from thesis stress"]},
    {period:"Oct 2026",focus:"IELTS EXAM",priority:"🟡 IMPORTANT",actions:["Sit IELTS exam","Target: 6.5 overall","Apply results to scholarship portals","November KU application prep"]},
    {period:"Nov–Dec 2026",focus:"KU ADMISSION",priority:"🟢 BACKUP",actions:["Apply KU CSE (same docs as KUET)","Await KUET/KU results","Finalize MSc enrollment","Plan MSc year 1 research direction"]},
    {period:"Jan–Mar 2027",focus:"BUET PREP",priority:"🔵 DREAM",actions:["Intensive DSA: LeetCode 50+ problems","SQL: W3Schools + LeetCode SQL 50","TOC: Sipser Chapters 1–4","Digital Logic K-map practice daily"]},
    {period:"Apr 2027",focus:"BUET EXAM",priority:"🔵 DREAM",actions:["Sit BUET written exam","If pass → dream achieved","If not → KUET/KU MSc already secured","Continue MSc regardless of result"]},
  ],
};

// ─── KUET PROFESSORS TO EMAIL ──────────────────────────────────────────────
const KUET_PROFS=[
  {name:"Prof. Dr. Md. Abdus Sobhan",dept:"CSE",area:"Machine Learning, Data Mining",email:"sobhan@cse.kuet.ac.bd",why:"His ML and data mining work directly overlaps your CRO feature selection approach."},
  {name:"Prof. Dr. Md. Mamunur Rashid",dept:"CSE",area:"Soft Computing, Optimization",email:"rashid@cse.kuet.ac.bd",why:"Soft computing and optimization — CRO is exactly in his domain."},
  {name:"Dr. Md. Shahinur Rahman",dept:"CSE",area:"Bioinformatics, Pattern Recognition",email:"shahinur@cse.kuet.ac.bd",why:"Bioinformatics background makes your multi-omics cancer thesis a perfect fit."},
  {name:"KUET CSE Dept Head",dept:"CSE",area:"Department Head",email:"head@cse.kuet.ac.bd",why:"CC the department head on your application email for visibility."},
];

const SCHOLARSHIP_PROGRAMS=[
  {name:"DAAD Research Scholarships",country:"🇩🇪 Germany",amount:"Full funding + €934/month",deadline:"Annual — usually Oct/Nov",gpa:"2:1 or equivalent",ielts:"6.5",url:"daad.de",desc:"Largest scholarship program globally. 5,000+ scholars/year. Your CRO research fits German engineering excellence perfectly.",steps:["Complete KUET MSc with high CGPA","Publish 1 paper in indexed journal","Achieve IELTS 6.5+","Contact German professor in ML/bioinformatics","Apply Oct 2027 for 2028 intake"]},
  {name:"Commonwealth Scholarships UK",country:"🇬🇧 United Kingdom",amount:"Full tuition + living allowance",deadline:"Usually December",gpa:"Upper Second (equivalent 3.5+/4.0)",ielts:"7.0",url:"cscuk.fcdo.gov.uk",desc:"Prestigious. Values leadership (your National Debate Championship is exactly this). Bangladesh quota available.",steps:["MSc completion + publication","IELTS 7.0 overall","Leadership evidence document","Statement of purpose: GST story → comeback → research","3 strong reference letters including Mr. Riaz Mohammed"]},
  {name:"Vanier Canada Graduate Scholarships",country:"🇨🇦 Canada",amount:"$50,000 CAD/year",deadline:"Usually November",gpa:"3.7+ on 4.0 scale",ielts:"7.0",url:"vanier-banting.gc.ca",desc:"Elite. But your profile: 3.95 GPA + National Champion + cancer research = competitive. Long shot but worth applying.",steps:["PhD program required (not MSc)","Outstanding academic + research record","Leadership: National Debate Champion qualifies","Canadian university supervisor contact first"]},
  {name:"Erasmus Mundus Joint Masters",country:"🇪🇺 Europe",amount:"€1,400–1,000/month",deadline:"Varies by program — usually Jan",gpa:"Good BSc + MSc",ielts:"6.5",url:"erasmus-plus.ec.europa.eu",desc:"Multiple EU country exposure in one program. High acceptance for ML/AI profiles. Can apply even from Bangladesh.",steps:["Find program overlapping bioinformatics/ML","Check if Bangladesh is eligible country (yes)","Prepare application during KUET MSc Year 1","Apply Jan 2027 for 2027 intake (fastest path)"]},
];

const PATHS=[
  {id:"p1",name:"Foreign Scholarship",icon:"🌍",color:T.blue,tag:"DREAMY LIFE",timeline:"2–3 years",summary:"Fully-funded MSc or PhD abroad after building your research profile during a local MSc.",pros:["Highest global career ceiling","Full funding: tuition and monthly stipend","International alumni network forever","Top 0.1% life outcome achievable","Permanently elevates your entire family's trajectory"],cons:["IELTS 6.5–7.5 minimum required","Highly competitive worldwide","Family separation for years","3+ years from today to materialize","Visa and application uncertainty"],targets:["🇩🇪 DAAD Germany — fully funded, world-class CS programs","🇨🇦 Vanier Canada — $50,000 per year","🇸🇪 Sweden/Netherlands — no tuition + monthly stipend","🇦🇺 Australia RTP — Research Training Program","🇬🇧 UK Commonwealth Scholarship"],strategy:"Local MSc first → 1–2 publications → IELTS → apply abroad. Your profile: 3.95 GPA + National Debate Champion + Published CRO+SHAP research = genuinely competitive globally.",score:{family:2,financial:4,reputation:5,satisfaction:5,complexity:2}},
  {id:"p2",name:"MSc Public University",icon:"🏛️",color:T.green,tag:"ULTIMATE COMEBACK",timeline:"July–Dec 2026",summary:"MSc at BUET, KUET, KU, or DU. The public verdict that permanently rewrites the GST failure story.",pros:["The comeback society will notice publicly","Family happy — nearby, safe, studying","MSc thesis makes scholarship apps much stronger","Freelancing income can run in parallel","Bridge to both publication and foreign scholarship"],cons:["BUET written exam is genuinely hard","BUET 2026 cycle may require waiting for 2027","Limited or no stipend during MSc years","KUET and KU are in Khulna — relocation required"],targets:["🥇 BUET — most prestigious, hardest exam, April–May intake","🥈 KUET — your profile far exceeds minimums, near-certain","🏫 KU CSE — November–December intake, perfect for your timeline","🥉 DU CSEDU — July intake, Dhaka location, thesis group available"],strategy:"PRIMARY PATH. Strong thesis + professor emails + apply to all 4 = at least one accepts. Use 2 MSc years to publish, build IELTS score, and prepare scholarship applications.",score:{family:5,financial:3,reputation:5,satisfaction:5,complexity:4}},
  {id:"p3",name:"Bank MTO / Govt IT",icon:"🏦",color:T.orange,tag:"RAT RACE RISK",timeline:"6–12 months",summary:"Bank MTO or government IT job. 60–80k immediate income. Fast settlement. But you already called it a Rat Race yourself.",pros:["Immediate 60,000–80,000 BDT per month","Relationship and family stability fast","Job security, pension, predictable life","Good emergency fallback if all MSc admissions fail","Social prestige of the 'bank job'"],cons:["YOU wrote 'Rat Race' and 'Higher Education Stopped'","Career ceiling very low within 10 years","Daily work won't use your CS or AI skills","The duplex and global life will NOT happen on this path","Very hard to restart higher education once working"],targets:["Bangladesh Bank AD (IT) — six-figure potential","Sonali/Janata/Agrani Bank MTO — 60–70k start","BCS IT cadre — ultimate prestige, 2–3 year process","ICT Division government — most CS-relevant option"],strategy:"ONLY consider this if ALL MSc admissions fail completely. Even then, simultaneously prepare for next year's intake. Do NOT make this your primary plan.",score:{family:5,financial:4,reputation:4,satisfaction:2,complexity:4}},
  {id:"p4",name:"Freelancing / Tech",icon:"💻",color:T.pink,tag:"PARALLEL INCOME",timeline:"Start July 2026",summary:"Fiverr and Upwork income using Python and ML skills. Runs PARALLEL to MSc — not instead of it.",pros:["Income during MSc removes family financial guilt","ML and AI are the highest-demand skills on Fiverr right now","Part-time while studying — fully flexible schedule","Your BRCA thesis IS your portfolio starter project","Relationship goals like the bike become achievable sooner"],cons:["First 2–3 months: low earnings while building profile","Client management takes time away from MSc studies","Requires strong daily discipline not to let it distract","Payoneer and payment setup needed in Bangladesh"],targets:["🟡 Fiverr: Python scripting, data analysis, ML models","🔵 Upwork: Data science consulting, research assistance","🟢 Local BD companies: growing data analytics demand","🏆 Kaggle competitions: builds public ML portfolio for clients"],strategy:"After thesis submission July 2026 → 2 weeks building Fiverr/Upwork profile → thesis project is your proof of work → target Tk 15k–40k per month within 3 months.",score:{family:4,financial:4,reputation:3,satisfaction:4,complexity:3}},
];

const UNIS=[
  {id:"kuet",name:"KUET",fullName:"Khulna University of Engineering & Technology",icon:"🥇",color:T.green,
    status:"#1 PRIORITY — HOME GROUND",
    site:"kuet.ac.bd/pgadmission",
    intake:"Circular: July–September 2026. Exam: Sept–Oct 2026.",
    location:"Khulna (KDA Ave, Boyra)",
    locationAdvantage:"🏠 10–15 min from your home. No rent. Family food. Zero relocation cost.",
    chancePct:90,chanceLabel:"NEAR CERTAIN",chanceColor:"#00ff88",
    profileScore:{gpa:5,thesis:5,exam:4,interview:5,total:19,max:20},
    khulnaAdvantage:"You are a Khulna local. KUET is in your backyard. Other applicants will struggle with relocation. You arrive rested, fed by your mother, and mentally settled. That IS a competitive advantage.",
    lifeSavers:[
      "🔑 Your 3.95 GPA from NUBTK (Khulna) is KNOWN to KUET faculty. Local-to-local credibility matters.",
      "🔑 Email KUET CSE professors NOW — before the circular even opens. Introduce yourself + attach thesis abstract. They remember faces.",
      "🔑 NUBTK has alumni at KUET. Ask your BSc supervisor Mr. Riaz Mohammed if he has any KUET connections — one warm introduction changes everything.",
      "🔑 The viva at KUET is where you will DOMINATE. You are a National Debate Champion. You explain CRO+SHAP to a panel? That is your arena.",
      "🔑 KUET minimum CGPA is 2.75. You have 3.95. You clear the bar by so much that rejection on GPA grounds is mathematically impossible.",
      "🔑 Apply on Day 1 of circular opening. Early applications signal seriousness to the department.",
      "🔑 If KUET has a professor working on ML/AI/optimization — mention your thesis overlaps their work. Research alignment = admission magnet.",
    ],
    examTopics:[
      {t:"Academic Record (GPA)",w:"Very Heavy",pct:35,tip:"3.95 vs minimum 2.75. You are 44% above minimum. This single metric makes you a top 5% applicant before the exam even starts.",color:T.green},
      {t:"Viva / Interview",w:"Heavy",pct:30,tip:"Your DEBATE CHAMPIONSHIP is your secret weapon here. Practice: Explain CRO algorithm in 60 seconds. What is SHAP? Why MSc? — you will be the most articulate person in the room.",color:T.green},
      {t:"Core CS Knowledge",w:"Medium",pct:20,tip:"BSc-level. Algorithms, data structures, OS basics, networking. Not as deep as BUET. Focus on topics from your NUBTK curriculum.",color:"#a855f7"},
      {t:"Statement of Purpose",w:"Medium",pct:15,tip:"1 page. Why CRO+SHAP thesis. Why KUET specifically. Your local connection (Khulna resident) is worth mentioning — shows you are committed to staying.",color:T.blue},
    ],
    process:["Step 1: Bookmark kuet.ac.bd/pgadmission — check EVERY Monday from June 2026","Step 2: Email 2 KUET CSE professors NOW with your thesis abstract","Step 3: Download circular immediately on release day","Step 4: Submit application with all docs within first 3 days","Step 5: Appear for written test (if any) — BSc fundamentals only","Step 6: Viva — the National Debate Champion speaks","Step 7: Accept offer. 10-minute commute from home begins."],
    docs:["BSc transcript (original + 3 attested copies)","BSc certificate / provisional (original + 3 copies)","SSC marksheet + certificate (original + 3 copies)","HSC marksheet + certificate (original + 3 copies)","NID card photocopy (attested)","4 passport-size photos (studio quality)","Supervisor recommendation letter (Mr. Riaz Mohammed)","Statement of Purpose — 1 page, printed","Bank draft for application fee (~Tk 600–800)","Testimonial from NUBTK dept head"],
    prepResources:["Practice your 3-minute thesis explanation — in Bangla AND English","Prepare: Why MSc, Why KUET, Research plans, Funding plans","Revise: sorting algorithms, BST, BFS/DFS, SQL basics, OS scheduling","Check KUET CSE faculty page: kuet.ac.bd/dept/cse — find prof whose work matches yours","Contact KUET students on Facebook group KUET CSE for viva experience"],
    emailTemplate:"Subject: Prospective MSc Applicant — CRO+SHAP Research (BSc CSE, NUBTK, CGPA 3.95)\n\nDear Professor [Name],\n\nI am Peash Rudra, BSc CSE from NUBTK Khulna (CGPA 3.95/4.00, Top of Batch). I am a Khulna resident planning to apply for KUET MSc CSE.\n\nMy BSc thesis: xAI-Driven Evolutionary Feature Selection for Multi-Omics Cancer Classification using CRO and SHAP — supervised by Mr. Riaz Mohammed.\n\nYour research on [their research area] closely aligns with my optimization and ML background. I would be honored to continue research under your guidance.\n\nI have attached a 1-page abstract. I would be grateful for any guidance on the application process.\n\nRespectfully,\nPeash Rudra | NUBTK CSE | CGPA 3.95 | National Debate Champion 2018 | Khulna",
    verdict:"This is your HOME university. You live here. Family feeds you. Zero rent. Full focus on research. KUET MSc + 1 CRO+SHAP publication = direct path to DAAD Germany or Commonwealth scholarship within 2 years.",
    scores:{prestige:4,difficulty:2,familyProximity:5,cost:5,timeline:5,certainty:5},
  },
  {id:"ku",name:"KU",fullName:"Khulna University",icon:"🥈",color:T.orange,
    status:"#2 PRIORITY — SAME CITY",
    site:"ku.ac.bd/discipline/cse",
    intake:"Application: November–December 2026. Admission: Dec 24–29, 2026.",
    location:"Khulna (Gollamari, KU campus)",
    locationAdvantage:"🏠 Also in Khulna. 20–25 min from your area. Still home, still family, still free food.",
    chancePct:82,chanceLabel:"VERY LIKELY",chanceColor:T.orange,
    profileScore:{gpa:5,thesis:5,exam:3,interview:4,total:17,max:20},
    khulnaAdvantage:"KU is in Khulna. You know this city. Apply simultaneously with KUET — same documents, same city. Double your Khulna options.",
    lifeSavers:[
      "🔑 KU November–December intake is PERFECTLY timed. Thesis done June 1 → 5 free months → apply Nov → admit Dec → start Jan 2027.",
      "🔑 KU has a CALMER research environment than KUET. Less competitive pressure = better thesis output for your MSc.",
      "🔑 Since both KU and KUET are in Khulna, apply to BOTH simultaneously. Double your chances with zero extra effort.",
      "🔑 KU application is submitted physically to the Discipline Office. Show up in person, dressed professionally. A face-to-face first impression at submission is unusual and remembered.",
      "🔑 Your CRO+SHAP cancer classification thesis is genuinely unique at KU level — it will be the most advanced thesis topic in your application batch.",
      "🔑 KU has no aggressive student politics culture. You will be able to do research in peace — critical for publishing.",
    ],
    examTopics:[
      {t:"Academic Performance",w:"Heavy",pct:40,tip:"Your 3.95 will likely be in the top 3 GPAs in the applicant pool.",color:T.green},
      {t:"Written Admission Test",w:"Medium",pct:35,tip:"Core CS. Less intense than BUET. Focus: algorithms complexity, SQL, basic networking. Past papers from KU CSE students on Facebook.",color:T.orange},
      {t:"Research Background",w:"Medium",pct:15,tip:"Explicitly mention CRO+SHAP thesis. Many KU applicants have zero research background — yours stands out strongly.",color:T.blue},
      {t:"Viva",w:"Light",pct:10,tip:"Straightforward. Know your thesis, your goals, why KU. Your debate background makes this trivial.",color:"#a855f7"},
    ],
    process:["Step 1: Watch ku.ac.bd/discipline/cse from October 2026","Step 2: Download form from KU CSE Discipline Office (physical collection)","Step 3: Get bank draft (Sonali Bank, KU branch preferred)","Step 4: Submit full document file in person to Discipline Office","Step 5: Eligible list published December 21, 2026","Step 6: Admission process December 24–29, 2026","Step 7: MSc begins January 2027 — commute from home daily"],
    docs:["All academic marksheets SSC to BSc (originals + 3 copies each)","All certificates (originals + attested copies)","NID + attested photocopy","4 passport-size photos","Bank draft (Sonali Bank preferred, amount per circular)","Supervisor recommendation letter","Brief research statement / SOP"],
    prepResources:["Search Facebook: KU CSE MSc — find past papers and experience posts","KU CSE Discipline Office: visit in person for latest info on intake","CS revision: same topics as KUET prep — BSc fundamentals","Email a KU CSE professor with your thesis abstract before November"],
    emailTemplate:"Subject: Prospective MSc Applicant — AI/Cancer Research Thesis | BSc CSE Khulna\n\nDear Professor [Name],\n\nI am Peash Rudra, BSc CSE from NUBTK Khulna (CGPA 3.95, Top of Batch). I am a Khulna resident and intend to apply for MSc CSE at Khulna University.\n\nMy thesis: CRO and SHAP-based feature selection for multi-omics cancer classification — uses evolutionary optimization and explainable AI for cancer research.\n\nI am particularly interested in continuing research in this domain and believe KU environment would support this well.\n\nWould you be available for a brief conversation about the MSc program?\n\nRespectfully,\nPeash Rudra | NUBTK | 3.95 CGPA | Khulna Resident",
    verdict:"Apply SIMULTANEOUSLY with KUET. Same city, same documents, November deadline. If KUET and KU both say yes, choose KUET for the engineering prestige. Both are HOME.",
    scores:{prestige:3,difficulty:2,familyProximity:5,cost:5,timeline:4,certainty:4},
  },
  {id:"buet",name:"BUET",fullName:"Bangladesh University of Engineering & Technology",icon:"🏆",color:T.blue,
    status:"DREAM TARGET — DHAKA",
    site:"pgadmission.buet.ac.bd",
    intake:"April–May 2027. Check cse.buet.ac.bd for circular.",
    location:"Dhaka (Palashi area)",
    locationAdvantage:"⚠️ Dhaka = away from Khulna family. Rent 8,000–12,000 BDT/month extra cost.",
    chancePct:45,chanceLabel:"CHALLENGING",chanceColor:"#ff8800",
    profileScore:{gpa:5,thesis:5,exam:3,interview:4,total:17,max:20},
    khulnaAdvantage:"BUET is in Dhaka. Leaving Khulna means leaving family. But BUET on your CV is a permanent status upgrade. The prestige justifies the sacrifice IF your exam prep is strong.",
    lifeSavers:[
      "🔑 BUET April 2027 — you have 10+ months after thesis to prepare the written exam. Use every week.",
      "🔑 The written exam IS the gate. Your 3.95 GPA is excellent but BUET weights exam score heavily. DSA is 30% — master it.",
      "🔑 Email a BUET CSE professor BEFORE applying. Professor who knows your research = tie-breaker if exam scores are close.",
      "🔑 BUET accommodation: research CSE halls and mess options before applying. Relocation cost is real — budget it now.",
      "🔑 KUET/KU MSc first → then BUET PhD = valid and respected upgrade path. You do not have to choose BUET over Khulna immediately.",
      "🔑 BUET prestige makes your CV competitive for DAAD Germany, Commonwealth UK, Vanier Canada. It is a passport upgrade.",
    ],
    examTopics:[
      {t:"Data Structures & Algorithms — 30%",w:"Very Heavy",pct:30,tip:"Trees, graphs (BFS/DFS/Dijkstra/Bellman-Ford), heaps, DP. LeetCode Medium difficulty minimum. 50 problems before exam.",color:T.red},
      {t:"Database / SQL — 20%",w:"Heavy",pct:20,tip:"All JOINs, subqueries, GROUP BY, normalization (1NF-BCNF), triggers. W3Schools SQL + LeetCode SQL 50.",color:T.red},
      {t:"Theory of Computation — 15%",w:"Medium",pct:15,tip:"DFA/NFA conversion, CFG, pumping lemma, P vs NP. Sipser book Chapters 1–4. Start early — hardest topic.",color:T.orange},
      {t:"Digital Logic — 15%",w:"Medium",pct:15,tip:"NAND/NOR gates, Karnaugh map simplification, flip-flops, multiplexers. Practice K-map problems daily.",color:T.orange},
      {t:"OOP & Programming — 10%",w:"Medium",pct:10,tip:"C/Java output tracing, polymorphism, abstract classes. Write code on paper — that is how BUET tests you.",color:"#a855f7"},
      {t:"Operating Systems — 5%",w:"Light",pct:5,tip:"FCFS/SJF/Round Robin, banker algorithm, paging, page replacement. Draw Gantt charts by hand.",color:"#a855f7"},
      {t:"Networks + SE — 5%",w:"Light",pct:5,tip:"OSI layers, TCP/IP, subnetting math. SDLC models, UML. 1–2 days combined revision is enough.",color:T.green},
    ],
    process:["Step 1: Check cse.buet.ac.bd every Monday from January 2027","Step 2: Application fee ~Tk 500 via bank draft","Step 3: Submit application online at pgadmission.buet.ac.bd","Step 4: 2-hour written exam — MCQ + short answer","Step 5: Merit list published 2–3 weeks after exam","Step 6: Accept offer — prepare for Dhaka relocation with budget plan"],
    docs:["BSc transcript (original + 3 attested copies)","BSc certificate or provisional","SSC/HSC marksheets + certificates (original + 3 copies each)","NID photocopy (attested)","4 passport-size photos","Bank draft ~Tk 500"],
    prepResources:["GeeksforGeeks: complete DSA track — trees, graphs, DP, hashing","LeetCode: 50 Easy + 30 Medium problems minimum","SQL: W3Schools full course + LeetCode SQL 50","Sipser Introduction to Theory of Computation — Chapters 1–4","BUET CSE past MSc admission papers — ask in FB group BUET CSE","YouTube: Abdul Bari algorithms course — best free DSA prep"],
    emailTemplate:"Subject: Prospective MSc Applicant — CRO+SHAP Research | BSc CSE NUBTK | CGPA 3.95\n\nDear Professor [Name],\n\nI am Peash Rudra, BSc CSE from NUBTK Khulna (CGPA 3.95/4.00, Top of Batch, National Debate Champion 2018).\n\nMy BSc thesis: xAI-Driven Evolutionary Feature Selection for Multi-Omics Cancer Classification: A CRO and SHAP Integrated Framework — under Mr. Riaz Mohammed.\n\nYour work on [professor research area] strongly aligns with my background in metaheuristic optimization and explainable AI. I plan to apply for BUET MSc CSE April 2027 intake.\n\nI would be deeply grateful for guidance on aligning my research direction with your lab.\n\nRespectfully,\nPeash Rudra | NUBTK Khulna | CGPA 3.95 | CRO+SHAP Cancer Research",
    verdict:"Your DREAM target. Secure KUET/KU first (Khulna = home base secured), then spend 10 months preparing BUET exam. You cannot lose: if BUET says yes you go to Dhaka with prestige, if no you are already at KUET at home.",
    scores:{prestige:5,difficulty:5,familyProximity:2,cost:3,timeline:2,certainty:3},
  },
  {id:"du",name:"DU CSEDU",fullName:"University of Dhaka — CSE Dept",icon:"🎯",color:"#a855f7",
    status:"DHAKA OPTION",
    site:"msadmission.cse.du.ac.bd",
    intake:"Circular: June–July 2026. Exam: August–September 2026.",
    location:"Dhaka (TSC / Curzon Hall area)",
    locationAdvantage:"⚠️ Dhaka = away from Khulna family. BUT: Bangladesh best tech job market and ML opportunities.",
    chancePct:70,chanceLabel:"LIKELY",chanceColor:"#a855f7",
    profileScore:{gpa:5,thesis:4,exam:3,interview:4,total:16,max:20},
    khulnaAdvantage:"DU is in Dhaka. You leave Khulna. BUT DU CSEDU Thesis Group MSc + Dhaka network = faster route to high-paying tech jobs and international applications.",
    lifeSavers:[
      "🔑 ALWAYS apply to the THESIS GROUP. Your CRO+SHAP BSc thesis directly evolves into your MSc thesis. 2 years of continuous research = publication-ready output.",
      "🔑 DU July 2026 circular — earliest deadline. Apply immediately after thesis submission June 1.",
      "🔑 DU written exam is HARD. Similar to BUET. Your 3.95 GPA helps but the exam is the real gate. Do not underestimate it.",
      "🔑 Dhaka accommodation: research mess and sub-let near Curzon Hall before applying — plan budget.",
      "🔑 DU + Dhaka = BASIS, tech meetups, top freelancing clients. If startup or product is your goal post-MSc, Dhaka accelerates this.",
    ],
    examTopics:[
      {t:"Written Admission Test — 45%",w:"Hard",pct:45,tip:"Core CS: algorithms, data structures, programming logic, discrete math, probability. More math than BUET. Study both.",color:T.red},
      {t:"Academic Performance — 30%",w:"Heavy",pct:30,tip:"Your 3.95 places you in top bracket. DU evaluates private uni GPAs fairly.",color:T.green},
      {t:"Viva Thesis Group — 25%",w:"Medium",pct:25,tip:"Research interest, thesis explanation, future MSc plan. Thesis group viva is serious — they want your research roadmap.",color:T.blue},
    ],
    process:["Step 1: Watch msadmission.cse.du.ac.bd from May 2026","Step 2: Download application form immediately on release","Step 3: Bank draft + all documents submitted by deadline","Step 4: Written admission test (Dhaka venue)","Step 5: Viva interview — thesis group applicants","Step 6: Admission confirmed — arrange Dhaka accommodation"],
    docs:["All marksheets SSC to BSc (originals + attested copies)","All certificates (originals + attested copies)","NID photocopy (attested)","4 passport-size photos","Bank draft for application fee","Research statement for thesis group (1 page)"],
    prepResources:["DU CSE MSc past papers — search DU CSE MSc admission on Facebook","Focus on: algorithms, discrete math, probability, programming logic","Facebook group: CSEDU MSc — current students share experience"],
    emailTemplate:"Subject: MSc Thesis Group Applicant — CRO+SHAP Cancer Research | BSc CSE, CGPA 3.95\n\nDear Professor [Name],\n\nI am Peash Rudra, BSc CSE graduate from NUBTK (CGPA 3.95, Top of Batch).\n\nI am applying for DU CSEDU MSc — specifically the Thesis group, as my research aligns with your work on [topic].\n\nMy BSc thesis: evolutionary feature selection using CRO and SHAP for multi-omics cancer classification.\n\nI am committed to publishing this work during my MSc and would be honored to work under your supervision.\n\nRespectfully,\nPeash Rudra | NUBTK Khulna | CGPA 3.95 | National Debate Champion 2018",
    verdict:"Apply if open to Dhaka. The July 2026 deadline is earliest — apply right after thesis submission. If KUET says yes AND DU says yes, choose KUET (home in Khulna). Only choose DU over KUET if Dhaka career goals matter more.",
    scores:{prestige:4,difficulty:4,familyProximity:1,cost:2,timeline:4,certainty:3},
  },
];

const XP_RANKS=[
  {min:0,    title:"ROOKIE",        color:"#6b7280"},
  {min:100,  title:"FIGHTER",       color:"#00ff88"},
  {min:300,  title:"WARRIOR",       color:"#00b4ff"},
  {min:600,  title:"CHAMPION",      color:"#ff8800"},
  {min:1000, title:"ELITE",         color:"#a855f7"},
  {min:1500, title:"LEGEND",        color:"#ff006e"},
  {min:2500, title:"COMEBACK KING", color:"#ffd700"},
];
const getRank=(xp)=>[...XP_RANKS].reverse().find(r=>xp>=r.min)||XP_RANKS[0];

// ─── DAILY CHALLENGES (seeded by date) ─────────────────────────────────────
const DAILY_CHALLENGES=[
  {id:"dc01",text:"Complete 5 thesis tasks today",icon:"🎯",xp:50,key:"thesis5",check:(s)=>Object.keys(s.tasksDone||{}).filter(k=>s.tasksDone[k]).length>=5},
  {id:"dc02",text:"Drink all 8 glasses of water",icon:"💧",xp:30,key:"water8",check:(s)=>(s.waterData?.count||0)>=8},
  {id:"dc03",text:"Complete 3 full Pomodoro sessions",icon:"⏱",xp:40,key:"pom3",check:(s)=>(s.pomSessions||0)>=3},
  {id:"dc04",text:"Do every single habit today",icon:"🔁",xp:60,key:"allhabits",check:(s,td)=>(s.habits||[]).length>0&&(s.habits||[]).every(h=>h.lastDone===td)},
  {id:"dc05",text:"Log 4+ war log entries",icon:"📓",xp:35,key:"log4",check:(s,td)=>(s.dailyLog||[]).filter(e=>e.date===td).length>=4},
  {id:"dc06",text:"Complete a full workout day",icon:"💪",xp:45,key:"workout100",check:(s)=>Object.keys(s.sets||{}).length>=10},
  {id:"dc07",text:"Log your weight + hit water goal",icon:"⚖️",xp:35,key:"wtwater",check:(s)=>(s.weightLog||[]).length>=2&&(s.waterData?.count||0)>=8},
  {id:"dc08",text:"Zero cigarettes today",icon:"🚭",xp:50,key:"nosmoking",check:(s)=>(s.smokingLog||[]).slice(-1)[0]?.count===0},
  {id:"dc09",text:"Finish a Pomodoro + 3 thesis tasks",icon:"⚡",xp:45,key:"pomthesis",check:(s)=>(s.pomSessions||0)>=1&&Object.keys(s.tasksDone||{}).filter(k=>s.tasksDone[k]).length>=3},
  {id:"dc10",text:"Log mood + diary + water all today",icon:"🧠",xp:40,key:"logall",check:(s,td)=>!!(s.moodLog||[]).find(m=>m.date===td)&&(s.dailyLog||[]).some(e=>e.date===td)&&(s.waterData?.count||0)>=4},
  {id:"dc11",text:"Complete 8+ workout sets",icon:"🏋️",xp:40,key:"sets8",check:(s)=>Object.keys(s.sets||{}).filter(k=>s.sets[k]).length>=8},
  {id:"dc12",text:"Write 2+ research notes",icon:"📖",xp:35,key:"resnotes2",check:(s)=>(s.researchNotes||[]).length>=2},
  {id:"dc13",text:"No smoking + all habits + log mood",icon:"🌟",xp:70,key:"triplewin",check:(s,td)=>(s.smokingLog||[]).slice(-1)[0]?.count===0&&(s.habits||[]).every(h=>h.lastDone===td)&&!!(s.moodLog||[]).find(m=>m.date===td)},
  {id:"dc14",text:"Log 7+ hours of sleep + workout",icon:"😴",xp:45,key:"sleepwork",check:(s,td)=>{const sl=(s.sleepLog||[]).find(x=>x.date===td);return sl&&sl.hours>=7&&Object.keys(s.sets||{}).filter(k=>s.sets[k]).length>=5;}},
  {id:"dc15",text:"Hit 2800+ calories today",icon:"🔥",xp:30,key:"cals",check:(s,td)=>(s.calData?.date===td?(s.calData.log||[]):[]).reduce((a,c)=>a+c.cal,0)>=2800},
  {id:"dc16",text:"Complete week's thesis tasks ≥50%",icon:"🧪",xp:60,key:"thesis50pct",check:(s)=>{const done=Object.keys(s.tasksDone||{}).filter(k=>s.tasksDone[k]).length;return done>=8;}},
  {id:"dc17",text:"5+ Pomodoros today — pure focus",icon:"🎯",xp:75,key:"pom5",check:(s)=>(s.pomSessions||0)>=5},
  {id:"dc18",text:"Sleep 8 hours + water goal + mood",icon:"💫",xp:50,key:"selfcare",check:(s,td)=>{const sl=(s.sleepLog||[]).find(x=>x.date===td);return sl&&sl.hours>=8&&(s.waterData?.count||0)>=8&&!!(s.moodLog||[]).find(m=>m.date===td);}},
  {id:"dc19",text:"Log weight + measurements + workout",icon:"📐",xp:40,key:"bodytrack",check:(s)=>(s.weightLog||[]).length>=2&&Object.values(s.measurements||{}).some(v=>v&&v!=="")},
  {id:"dc20",text:"Perfect day: all habits + workout + 3 thesis tasks",icon:"👑",xp:100,key:"perfectday",check:(s,td)=>(s.habits||[]).every(h=>h.lastDone===td)&&Object.keys(s.sets||{}).filter(k=>s.sets[k]).length>=5&&Object.keys(s.tasksDone||{}).filter(k=>s.tasksDone[k]).length>=3},
];
function getTodayChallenge(){
  const d=new Date();
  const idx=(d.getFullYear()*366+d.getMonth()*31+d.getDate())%DAILY_CHALLENGES.length;
  return DAILY_CHALLENGES[idx];
}

// ─── STUDY PLAYLISTS ────────────────────────────────────────────────────────
const PLAYLISTS=[
  {name:"Lo-Fi Study",desc:"Calm beats for deep work",icon:"🎵",url:"https://www.youtube.com/watch?v=jfKfPfyJRdk",color:T.blue},
  {name:"Dark Techno Focus",desc:"High energy for hard coding",icon:"⚡",url:"https://www.youtube.com/watch?v=3ZMmSoRjr8c",color:T.pink},
  {name:"Classical Concentration",desc:"Mozart, Bach for thesis writing",icon:"🎻",url:"https://www.youtube.com/watch?v=jgpJVI3tDbY",color:T.gold},
  {name:"Rain & Thunder",desc:"White noise for flow state",icon:"🌧️",url:"https://www.youtube.com/watch?v=mPZkdNFkNps",color:T.cyan},
  {name:"Epic Orchestral",desc:"Soundtrack for the comeback",icon:"🎼",url:"https://www.youtube.com/watch?v=K5KAc5CoCuk",color:T.orange},
  {name:"Binaural Beats",desc:"40Hz gamma for focus",icon:"🧠",url:"https://www.youtube.com/watch?v=LqEL3FBMLPI",color:"#a855f7"},
];

// ─── MSC DEADLINES ──────────────────────────────────────────────────────────
const MSC_DEADLINES=[
  {uni:"Thesis Submit",date:"2026-06-01",color:T.red,icon:"📝",note:"Non-negotiable. Everything else follows this."},
  {uni:"DU CSEDU",date:"2026-07-15",color:"#a855f7",icon:"🏛️",note:"Semester A circular expected June–July 2026"},
  {uni:"KUET MSc",date:"2026-09-01",color:T.green,icon:"🏫",note:"Circular expected July–September 2026"},
  {uni:"KU MSc",date:"2026-11-30",color:T.orange,icon:"🎓",note:"Apply November–December 2026"},
  {uni:"BUET MSc",date:"2027-04-01",color:T.blue,icon:"🥇",note:"Next cycle April 2027 — your ultimate target"},
];

// ─── RING COMPONENT ───
function Ring({pct,size=56,stroke=4,color=T.green,label,sublabel}){
  const r=(size-stroke*2)/2,circ=2*Math.PI*r,off=circ-(pct/100)*circ;
  return(
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color+"22"} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
          style={{transition:"stroke-dashoffset 0.7s",filter:`drop-shadow(0 0 4px ${color}66)`}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        {label&&<span style={{fontSize:size>60?13:size>40?10:8,fontWeight:700,color,...orb,lineHeight:1}}>{label}</span>}
        {sublabel&&<span style={{fontSize:7,color:T.muted,marginTop:1,...mono}}>{sublabel}</span>}
      </div>
    </div>
  );
}

// ─── REST TIMER ───
function RestTimer({seconds,onDone}){
  const [left,setLeft]=useState(seconds);
  useEffect(()=>{if(left<=0){onDone();return;}const t=setTimeout(()=>setLeft(l=>l-1),1000);return()=>clearTimeout(t);},[left,onDone]);
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"12px 0",gap:8}}>
      <Ring pct={Math.round(((seconds-left)/seconds)*100)} size={72} stroke={6} color={T.orange} label={`${left}s`} sublabel="REST"/>
      <button onClick={onDone} style={{padding:"5px 14px",background:"transparent",border:`1px solid ${T.muted}`,color:T.muted,borderRadius:6,fontSize:10,cursor:"pointer",...mono}}>SKIP</button>
    </div>
  );
}

// ─── ACHIEVEMENTS ── 40 badges across all life areas ────────────────────────
const ACHIEVEMENTS_DEF=[
  // THESIS & TASKS
  {id:"first_task",   icon:"🎯",name:"First Strike",      desc:"Complete your first task",                   xp:20,  tier:"bronze", color:"#cd7f32"},
  {id:"five_tasks",   icon:"📋",name:"Getting Serious",   desc:"Complete 5 tasks",                           xp:30,  tier:"bronze", color:"#cd7f32"},
  {id:"ten_tasks",    icon:"🔥",name:"On Fire",           desc:"Complete 10 tasks",                          xp:50,  tier:"silver", color:"#c0c0c0"},
  {id:"twenty_tasks", icon:"⚡",name:"Relentless",        desc:"Complete 20 tasks",                          xp:80,  tier:"gold",   color:"#ffd700"},
  {id:"fifty_tasks",  icon:"💎",name:"Thesis Machine",    desc:"Complete 50 tasks",                          xp:150, tier:"diamond",color:"#00ffff"},
  {id:"week_done",    icon:"📅",name:"Week Warrior",      desc:"Complete any full week at 100%",             xp:60,  tier:"silver", color:"#c0c0c0"},
  {id:"two_weeks",    icon:"🗓️",name:"Two Weeks Down",    desc:"Complete 2 full weeks at 100%",              xp:100, tier:"gold",   color:"#ffd700"},
  {id:"phase1",       icon:"🧱",name:"Foundation Laid",   desc:"Complete all Phase 1 weeks at 100%",         xp:120, tier:"gold",   color:"#ffd700"},
  {id:"phase2",       icon:"⚗️",name:"Algorithm Born",    desc:"Complete all Phase 2 weeks at 100%",         xp:150, tier:"gold",   color:"#ffd700"},
  {id:"phase3",       icon:"📊",name:"Data Conquered",    desc:"Complete all Phase 3 weeks at 100%",         xp:150, tier:"diamond",color:"#00ffff"},
  {id:"phase4",       icon:"✍️",name:"Words on Paper",    desc:"Complete all Phase 4 weeks at 100%",         xp:200, tier:"diamond",color:"#00ffff"},
  {id:"all_phases",   icon:"🎓",name:"THESIS SUBMITTED",  desc:"Complete all 15 weeks — the comeback is real",xp:500, tier:"legendary",color:"#ff006e"},
  // XP MILESTONES
  {id:"xp50",         icon:"⚡",name:"Spark",             desc:"Earn 50 XP",                                 xp:0,   tier:"bronze", color:"#cd7f32"},
  {id:"xp100",        icon:"💡",name:"Rookie No More",    desc:"Earn 100 XP",                                xp:0,   tier:"bronze", color:"#cd7f32"},
  {id:"xp300",        icon:"🌟",name:"Rising Star",       desc:"Earn 300 XP",                                xp:0,   tier:"silver", color:"#c0c0c0"},
  {id:"xp500",        icon:"🏅",name:"The Comeback",      desc:"Earn 500 XP",                                xp:0,   tier:"gold",   color:"#ffd700"},
  {id:"xp1000",       icon:"🏆",name:"Champion",          desc:"Earn 1000 XP",                               xp:0,   tier:"gold",   color:"#ffd700"},
  {id:"xp2500",       icon:"👑",name:"COMEBACK KING",     desc:"Earn 2500 XP — the ultimate title",          xp:0,   tier:"legendary",color:"#ff006e"},
  // BODY & FITNESS
  {id:"first_workout",icon:"💪",name:"First Rep",         desc:"Complete your first workout set",            xp:15,  tier:"bronze", color:"#cd7f32"},
  {id:"workout3",     icon:"🔥",name:"Iron Will",         desc:"Complete 3 workout days",                    xp:30,  tier:"silver", color:"#c0c0c0"},
  {id:"workout10",    icon:"🦾",name:"Unstoppable",       desc:"Complete 10 workout days",                   xp:80,  tier:"gold",   color:"#ffd700"},
  {id:"streak7",      icon:"🔥",name:"Week Streak",       desc:"7-day workout streak",                       xp:100, tier:"gold",   color:"#ffd700"},
  {id:"streak14",     icon:"💥",name:"Two Weeks Solid",   desc:"14-day workout streak",                      xp:200, tier:"diamond",color:"#00ffff"},
  {id:"weight3",      icon:"⚖️",name:"Gaining Ground",    desc:"Log your weight 3 times",                    xp:20,  tier:"bronze", color:"#cd7f32"},
  {id:"weight_goal",  icon:"🦾",name:"Body Complete",     desc:"Hit the 60 kg target weight",                xp:200, tier:"diamond",color:"#00ffff"},
  // HEALTH
  {id:"smoke_cut",    icon:"🚭",name:"Clean Air",         desc:"Reduce smoking to ≤5 per day",               xp:50,  tier:"silver", color:"#c0c0c0"},
  {id:"smoke_quit",   icon:"🏆",name:"Smoke Free",        desc:"Quit completely — 0 per day",                xp:200, tier:"diamond",color:"#00ffff"},
  {id:"hydrated",     icon:"💧",name:"Hydration King",    desc:"Hit 8 glasses of water today",               xp:15,  tier:"bronze", color:"#cd7f32"},
  {id:"habits_all",   icon:"🔁",name:"Habit Machine",     desc:"Complete all habits in one day",             xp:40,  tier:"silver", color:"#c0c0c0"},
  {id:"habits3streak",icon:"⚙️",name:"System Online",    desc:"All habits completed 3 days running",        xp:100, tier:"gold",   color:"#ffd700"},
  // FOCUS & POMODORO
  {id:"pomodoro1",    icon:"⏱",name:"First Focus",       desc:"Complete your first Pomodoro",               xp:10,  tier:"bronze", color:"#cd7f32"},
  {id:"pomodoro5",    icon:"🧠",name:"Deep Work",         desc:"Complete 5 Pomodoro sessions",               xp:50,  tier:"silver", color:"#c0c0c0"},
  {id:"pomodoro20",   icon:"🎯",name:"Flow State",        desc:"Complete 20 Pomodoro sessions total",        xp:150, tier:"gold",   color:"#ffd700"},
  // WAR LOG
  {id:"notes1",       icon:"📓",name:"First Entry",       desc:"Write your first daily log entry",           xp:10,  tier:"bronze", color:"#cd7f32"},
  {id:"notes5",       icon:"📝",name:"War Journalist",    desc:"Write 5 daily log entries",                  xp:40,  tier:"silver", color:"#c0c0c0"},
  {id:"notes20",      icon:"📚",name:"Chronicler",        desc:"Write 20 daily log entries",                 xp:100, tier:"gold",   color:"#ffd700"},
  // SPECIAL / HIDDEN
  {id:"comeback_king",icon:"👑",name:"COMEBACK KING",     desc:"Phase 1 done + 7-day streak + 500 XP",       xp:300, tier:"legendary",color:"#ff006e"},
  {id:"perfect_day",  icon:"🌈",name:"Perfect Day",       desc:"All habits + workout + thesis task in one day",xp:150,tier:"diamond",color:"#00ffff"},
  {id:"early_bird",   icon:"🌅",name:"Early Bird",        desc:"Log mood before 8 AM",                       xp:25,  tier:"silver", color:"#c0c0c0"},
  {id:"note_creator", icon:"🗂️",name:"Notes Creator",     desc:"Create your first note",                     xp:15,  tier:"bronze", color:"#cd7f32"},
];

// localStorage helpers replaced by Firebase above

// ─── LIVE CLOCK + DATE + COUNTDOWN ─────────────────────────────────────────
function LiveClock(){
  const [now,setNow]=useState(new Date());
  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t);},[]);
  const THESIS_DEADLINE=new Date("2026-06-01T23:59:59");
  const diff=Math.max(0,THESIS_DEADLINE-now);
  const d=Math.floor(diff/86400000),h=Math.floor((diff%86400000)/3600000),m=Math.floor((diff%3600000)/60000),s=Math.floor((diff%60000)/1000);
  const totalDays=Math.ceil((THESIS_DEADLINE-new Date("2026-03-20"))/86400000);
  const daysGone=Math.ceil((now-new Date("2026-03-20"))/86400000);
  const pct=Math.min(100,Math.max(0,Math.round((daysGone/totalDays)*100)));
  const days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const hh=String(now.getHours()).padStart(2,"0"),mm=String(now.getMinutes()).padStart(2,"0"),ss=String(now.getSeconds()).padStart(2,"0");
  const urgentColor=d<=7?"#ff2244":d<=30?"#ff8800":"#00ff88";
  return(
    <div style={{marginTop:10}}>
      {/* Date + Time row */}
      <div style={{display:"flex",gap:8,marginBottom:8,alignItems:"stretch"}}>
        {/* Live digital clock */}
        <div style={{flex:1,background:"#000a04",border:"1px solid #00ff8822",borderRadius:10,padding:"10px 12px",display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:22,fontWeight:900,color:"#00ff88",letterSpacing:3,lineHeight:1,textShadow:"0 0 12px #00ff8866"}}>
            {hh}<span style={{animation:"clockPulse 1s infinite",display:"inline-block"}}>:</span>{mm}<span style={{animation:"clockPulse 1s infinite .5s",display:"inline-block"}}>:</span>{ss}
          </div>
          <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:"#3a6a5a",marginTop:3,letterSpacing:1}}>{days[now.getDay()].toUpperCase()} · {months[now.getMonth()].toUpperCase()} {now.getDate()}, {now.getFullYear()}</div>
        </div>
        {/* Days left block */}
        <div style={{background:"#000a04",border:`1px solid ${urgentColor}33`,borderRadius:10,padding:"10px 14px",textAlign:"center",display:"flex",flexDirection:"column",justifyContent:"center",minWidth:80}}>
          <div style={{fontFamily:"'Orbitron',monospace",fontSize:26,fontWeight:900,color:urgentColor,lineHeight:1,textShadow:`0 0 12px ${urgentColor}66`}}>{d}</div>
          <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:7,color:"#3a6a5a",marginTop:3,letterSpacing:1}}>DAYS LEFT</div>
          <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:7,color:urgentColor,marginTop:1}}>TO SUBMIT</div>
        </div>
      </div>
      {/* HH:MM:SS countdown */}
      <div style={{background:"#000a04",border:`1px solid ${urgentColor}22`,borderRadius:10,padding:"8px 12px",marginBottom:6}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:8,color:"#3a6a5a",letterSpacing:2}}>⏳ THESIS DEADLINE · JUN 1 2026</div>
          <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:8,color:urgentColor}}>{pct}% elapsed</div>
        </div>
        <div style={{display:"flex",gap:5,marginBottom:6}}>
          {[{v:d,l:"DAYS",c:urgentColor},{v:h,l:"HRS",c:"#00ff88"},{v:m,l:"MIN",c:"#00ff88"},{v:s,l:"SEC",c:"#ff8800"}].map((x,i)=>(
            <div key={i} style={{flex:1,background:"#030f07",border:`1px solid ${x.c}22`,borderRadius:7,padding:"5px 2px",textAlign:"center"}}>
              <div style={{fontFamily:"'Orbitron',monospace",fontSize:14,fontWeight:900,color:x.c,lineHeight:1}}>{String(x.v).padStart(2,"0")}</div>
              <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:6,color:"#2a5a3a",marginTop:2}}>{x.l}</div>
            </div>
          ))}
        </div>
        {/* Timeline progress bar */}
        <div style={{height:5,background:"#030f07",borderRadius:3,overflow:"hidden",position:"relative"}}>
          <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,#00ff88,${urgentColor})`,borderRadius:3,transition:"width 1s",boxShadow:`0 0 8px ${urgentColor}44`}}/>
        </div>
      </div>
    </div>
  );
}

// ─── LIVE TIME BAR (top nav inline) ─────────────────────────────────────────
function LiveTimeBar(){
  const [t,setT]=useState(new Date());
  useEffect(()=>{const id=setInterval(()=>setT(new Date()),1000);return()=>clearInterval(id);},[]);
  const hh=String(t.getHours()).padStart(2,"0"),mm=String(t.getMinutes()).padStart(2,"0");
  const days=["SUN","MON","TUE","WED","THU","FRI","SAT"];
  const months=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  return <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:"#3a6a5a",letterSpacing:1}}>{days[t.getDay()]} {months[t.getMonth()]} {t.getDate()} · {hh}:{mm}</span>;
}

// ─── COUNTDOWN DISPLAY — kept as alias for backward compat ───────────────────
function CountdownBox(){return null;}

// ── BATTLE CLOCK — isolated component so the tick never re-renders AppMain ──
function BattleClock({start}){
  const [elapsed,setElapsed]=useState(0);
  useEffect(()=>{
    if(!start)return;
    const id=setInterval(()=>setElapsed(Math.floor((Date.now()-start)/1000)),500);
    return()=>clearInterval(id);
  },[start]);
  const hh=String(Math.floor(elapsed/3600)).padStart(2,"0");
  const mm=String(Math.floor((elapsed%3600)/60)).padStart(2,"0");
  const ss=String(elapsed%60).padStart(2,"0");
  return(
    <span style={{fontFamily:"'Orbitron',monospace",fontSize:36,fontWeight:900,color:"#ff006e",letterSpacing:4,textShadow:"0 0 15px #ff006e66",lineHeight:1}}>
      {hh}:{mm}:{ss}
    </span>
  );
}


function hashPin(pin){let h=0;for(let i=0;i<pin.length;i++){h=Math.imul(31,h)+pin.charCodeAt(i)|0;}return String(h>>>0);}

// ─── PIN LOCK SCREEN ──────────────────────────────────────────────────────────
function PinLockScreen({pinHash,onUnlock,onSetPin}){
  const isFirst=!pinHash;
  const [step,setStep]=useState(isFirst?"set":"enter");
  const [input,setInput]=useState("");
  const [confirm,setConfirm]=useState("");
  const [error,setError]=useState(false);
  const Tc={bg:"#020408",bg1:"#060d12",bg2:"#0a1520",border:"#0d2030",green:"#00ff88",red:"#ff2244",gold:"#ffd700",muted:"#3a6a5a",bright:"#e8f8f0",dim:"#2a5a3a"};
  const o2={fontFamily:"'Orbitron',monospace"},m2={fontFamily:"'Share Tech Mono',monospace"},r2={fontFamily:"'Rajdhani',sans-serif"};
  const cur=step==="confirm"?confirm:input;
  const doErr=(cb)=>{setError(true);setTimeout(()=>{setError(false);cb();},650);};
  const press=(n)=>{
    if(n==="⌫"){step==="confirm"?setConfirm(p=>p.slice(0,-1)):setInput(p=>p.slice(0,-1));setError(false);return;}
    if(n==="")return;
    if(step==="set"){const nx=input+String(n);setInput(nx);if(nx.length===4)setStep("confirm");}
    else if(step==="confirm"){const nx=confirm+String(n);setConfirm(nx);if(nx.length===4){if(nx===input){onSetPin(nx);onUnlock();}else doErr(()=>{setConfirm("");setInput("");setStep("set");});}}
    else{const nx=input+String(n);setInput(nx);if(nx.length===4){if(hashPin(nx)===pinHash)onUnlock();else doErr(()=>setInput(""));}}
  };
  const label=step==="set"?"SET YOUR PIN":step==="confirm"?"CONFIRM PIN":"ENTER PIN";
  const sub=step==="set"?"4-digit PIN · synced across all devices":step==="confirm"?"Re-enter to confirm":"Welcome back, Rudra ⚔️";
  return(
    <div style={{minHeight:"100vh",background:Tc.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(0deg,transparent,transparent 28px,#00ff0804 29px),repeating-linear-gradient(90deg,transparent,transparent 28px,#00ff0804 29px)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:"20%",left:"50%",transform:"translateX(-50%)",width:200,height:200,background:"radial-gradient(circle,#00ff8809,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:20,left:0,right:0,textAlign:"center"}}>
        <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:"#2a5a3a",letterSpacing:2}}>
          {new Date().toLocaleDateString([],{weekday:"long",month:"long",day:"numeric",year:"numeric"})}
        </div>
      </div>
      <div style={{fontSize:48,marginBottom:8,filter:"drop-shadow(0 0 20px #00ff8888)"}}>⚔️</div>
      <div style={{...o2,fontSize:20,fontWeight:900,color:Tc.green,letterSpacing:3,marginBottom:4,textShadow:"0 0 20px #00ff8866"}}>COMEBACK OS</div>
      <div style={{fontSize:11,color:Tc.muted,...m2,letterSpacing:2,marginBottom:32}}>{sub}</div>
      <div style={{background:Tc.bg1,border:`1px solid ${error?Tc.red+"88":Tc.green+"33"}`,borderRadius:16,padding:"28px 24px",width:"100%",maxWidth:300,textAlign:"center",transition:"border-color .2s, transform .1s",transform:error?"translateX(-5px)":"none"}}>
        <div style={{fontSize:10,color:error?Tc.red:Tc.green,letterSpacing:2,...m2,marginBottom:20,minHeight:16}}>{error?"❌ WRONG PIN — TRY AGAIN":label}</div>
        <div style={{display:"flex",gap:14,justifyContent:"center",marginBottom:28}}>
          {Array.from({length:4},(_,i)=>(
            <div key={i} style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${cur.length>i?Tc.green:Tc.border}`,background:cur.length>i?Tc.green+"55":"transparent",transition:"all .15s",boxShadow:cur.length>i?`0 0 8px ${Tc.green}88`:"none"}}/>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,maxWidth:220,margin:"0 auto"}}>
          {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((n,i)=>(
            <button key={i} onClick={()=>press(n)} className="btn-tap" style={{padding:"16px 0",borderRadius:12,border:`1px solid ${error?Tc.red+"44":n===""?"transparent":Tc.border}`,background:n===""?"transparent":error?Tc.red+"11":Tc.bg2,color:n===""?Tc.muted:error?Tc.red:Tc.bright,...o2,fontSize:18,fontWeight:700,cursor:n===""?"default":"pointer",transition:"all .1s",WebkitTapHighlightColor:"transparent"}}>{n}</button>
          ))}
        </div>
      </div>
      {step==="enter"&&<div style={{fontSize:10,color:Tc.dim,...m2,marginTop:18,letterSpacing:1}}>PIN synced from Firebase · works on any device</div>}
      {step==="set"&&<div style={{fontSize:11,color:Tc.dim,...r2,marginTop:18,textAlign:"center",maxWidth:260,lineHeight:1.6}}>Your PIN is stored in Firebase and works on every device you log in from.</div>}
    </div>
  );
}

// ─── CHANGE PIN MODAL ─────────────────────────────────────────────────────────
function ChangePinModal({pinHash,onSave,onClose}){
  const [step,setStep]=useState("old");
  const [old_,setOld]=useState(""),newP=useRef(""),conf=useRef("");
  const [display,setDisplay]=useState("");
  const [error,setError]=useState("");
  const [done,setDone]=useState(false);
  const Tc={bg1:"#060d12",bg2:"#0a1520",border:"#0d2030",green:"#00ff88",gold:"#ffd700",red:"#ff2244",muted:"#3a6a5a",bright:"#e8f8f0"};
  const o2={fontFamily:"'Orbitron',monospace"},m2={fontFamily:"'Share Tech Mono',monospace"};
  const cur=step==="old"?old_:display;
  const label=step==="old"?"CURRENT PIN":step==="new"?"NEW PIN":"CONFIRM NEW PIN";
  const press=(n)=>{
    if(n==="⌫"){
      if(step==="old") setOld(p=>p.slice(0,-1));
      else setDisplay(p=>p.slice(0,-1));
      setError(""); return;
    }
    if(n==="")return;
    if(step==="old"){
      const nx=old_+String(n);setOld(nx);
      if(nx.length===4){if(hashPin(nx)===pinHash){setStep("new");newP.current="";setDisplay("");setError("");}else{setError("WRONG PIN");setTimeout(()=>{setOld("");setError("");},600);}}
    }else if(step==="new"){
      const nx=display+String(n);setDisplay(nx);
      if(nx.length===4){newP.current=nx;setStep("confirm");setDisplay("");setError("");}
    }else{
      const nx=display+String(n);setDisplay(nx);
      if(nx.length===4){if(nx===newP.current){setDone(true);setTimeout(()=>{onSave(nx);onClose();},700);}else{setError("NO MATCH");setTimeout(()=>{setDisplay("");newP.current="";setStep("new");setError("");},600);}}
    }
  };
  return(
    <div style={{position:"fixed",inset:0,zIndex:3000,background:"rgba(0,0,0,0.93)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
      <div style={{background:Tc.bg1,border:`1px solid ${done?"#00ff8888":"#0d2030"}`,borderRadius:16,padding:24,width:"100%",maxWidth:290,textAlign:"center"}} onClick={e=>e.stopPropagation()}>
        <div style={{...o2,fontSize:13,fontWeight:900,color:done?"#00ff88":"#ffd700",marginBottom:4}}>{done?"✓ PIN UPDATED!":"CHANGE PIN"}</div>
        <div style={{fontSize:9,color:Tc.muted,...m2,letterSpacing:2,marginBottom:16}}>{done?"Syncing to Firebase...":label}</div>
        {error&&<div style={{fontSize:10,color:Tc.red,...m2,marginBottom:10}}>{error}</div>}
        <div style={{display:"flex",gap:12,justifyContent:"center",marginBottom:20}}>
          {Array.from({length:4},(_,i)=>(
            <div key={i} style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${cur.length>i?"#00ff88":"#0d2030"}`,background:cur.length>i?"#00ff8844":"transparent",transition:"all .15s"}}/>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,maxWidth:200,margin:"0 auto",marginBottom:14}}>
          {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((n,i)=>(
            <button key={i} onClick={()=>press(n)} className="btn-tap" style={{padding:"13px 0",borderRadius:10,border:`1px solid ${n===""?"transparent":Tc.border}`,background:n===""?"transparent":Tc.bg2,color:n===""?Tc.muted:Tc.bright,...o2,fontSize:16,fontWeight:700,cursor:n===""?"default":"pointer"}}>{n}</button>
          ))}
        </div>
        <button onClick={onClose} style={{fontSize:10,color:Tc.muted,background:"transparent",border:"none",cursor:"pointer",...m2,letterSpacing:1}}>CANCEL</button>
      </div>
    </div>
  );
}

// ─── APP SHELL — only manages loading + PIN ──────────────────────────────────
// AppMain is rendered ONLY after Firebase data loads, so every useState
// in AppMain receives the correct initial value on first render. This
// eliminates ALL async-init race conditions permanently.
export default function App(){
  const [loadedData, setLoadedData] = useState(null);  // null = still loading
  const [pinHash,    setPinHash]    = useState(null);
  const [unlocked,   setUnlocked]   = useState(false);

  useEffect(()=>{
    loadState().then(data=>{
      const d = data || {};
      setLoadedData(d);
      setPinHash(d.pinHash || null);
    });
  },[]);

  const handleSetPin=(pin)=>{
    const h=hashPin(pin);
    setPinHash(h);
    // Persist pin hash immediately
    try {
      const cur=JSON.parse(localStorage.getItem("comeback_os")||"{}");
      cur.pinHash=h;
      localStorage.setItem("comeback_os",JSON.stringify(cur));
    } catch {}
    clearTimeout(_saveTimer);
    _saveTimer=setTimeout(async()=>{
      try{
        const cur=JSON.parse(localStorage.getItem("comeback_os")||"{}");
        cur.pinHash=h;
        await setDoc(USER_DOC,cur);
      }catch{}
    },1000);
  };

  // Loading screen
  if(!loadedData) return(
    <div style={{minHeight:"100vh",background:"#020408",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,fontFamily:"'Orbitron',monospace"}}>
      <style>{GSTYLE}</style>
      <div style={{fontSize:44,animation:"popIn .6s ease"}}>⚔️</div>
      <div style={{color:"#00ff88",fontSize:14,letterSpacing:3,textShadow:"0 0 20px #00ff8866"}}>COMEBACK OS</div>
      <div style={{fontFamily:"'Share Tech Mono',monospace",color:"#2a5a3a",fontSize:10,letterSpacing:2}}>SYNCING WITH FIREBASE...</div>
      <div style={{fontFamily:"'Share Tech Mono',monospace",color:"#1a3a2a",fontSize:9,letterSpacing:1,marginTop:4}}>
        {new Date().toLocaleDateString([],{weekday:"short",month:"short",day:"numeric",year:"numeric"})} · {new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
      </div>
    </div>
  );

  // PIN screen
  if(!unlocked) return(
    <>
      <style>{GSTYLE}</style>
      <PinLockScreen
        pinHash={pinHash}
        onUnlock={()=>setUnlocked(true)}
        onSetPin={handleSetPin}
      />
    </>
  );

  // Main app — receives fully-loaded initialData
  return(
    <>
      <style>{GSTYLE}</style>
      <AppMain
        initialData={loadedData}
        pinHash={pinHash}
        onPinChange={handleSetPin}
      />
    </>
  );
}

// ─── APP MAIN — all state initialized correctly from initialData prop ─────────
function AppMain({ initialData:D, pinHash, onPinChange }){
  // ── TODAY helper (used for daily resets) ──
  const TODAY = new Date().toDateString();

  // ── ALL STATE — initialized from D (already loaded from Firebase) ──
  const [tab,setTab]                       = useState("home");
  const [tasksDone,setTasksDone]           = useState(D.tasksDone||{});
  const [taskNotes,setTaskNotes]           = useState(D.taskNotes||{});
  const [openNote,setOpenNote]             = useState(null);
  const [workoutDay,setWorkoutDay]         = useState(D.workoutDay||1);
  const [sets,setSets]                     = useState(D.sets||{});
  const [warmupDone,setWarmupDone]         = useState(D.warmupDone||{});
  const [timer,setTimer]                   = useState(null);
  const [streak,setStreak]                 = useState(D.streak||0);
  const [lastWO,setLastWO]                 = useState(D.lastWO||null);
  const [activePath,setActivePath]         = useState("p2");
  const [activeUni,setActiveUni]           = useState("buet");
  const [expandedExam,setExpandedExam]     = useState(null);
  const [activeWeek,setActiveWeek]         = useState(1);
  const [weightLog,setWeightLog]           = useState(D.weightLog||[{date:"Day 1",weight:50}]);
  const [newWeight,setNewWeight]           = useState("");
  const [measurements,setMeasurements]     = useState(D.measurements||{chest:"",waist:"",bicep:"",neck:""});
  const [smokingLog,setSmokingLog]         = useState(D.smokingLog||[{date:"Day 1",count:10}]);
  const [newSmoke,setNewSmoke]             = useState("");
  const [myTasks,setMyTasks]               = useState(D.myTasks||[]);
  const [newTask,setNewTask]               = useState({title:"",cat:"Study",priority:"Medium",due:""});
  const [showAddTask,setShowAddTask]       = useState(false);
  const [taskFilter,setTaskFilter]         = useState("All");
  const [notes,setNotes]                   = useState(D.notes||[{id:1,title:"Welcome — Your War Room",body:"This space is yours. Write anything: ideas, blockers, wins, research notes, feelings, plans. No one sees this.",pinned:true,color:T.green,date:"Day 1"}]);
  const [activeNoteId,setActiveNoteId]     = useState(null);
  const [newNoteTitle,setNewNoteTitle]     = useState("");
  const [newNoteBody,setNewNoteBody]       = useState("");
  const [noteColor,setNoteColor]           = useState(T.green);
  const [showNewNote,setShowNewNote]       = useState(false);
  const [goalsTab,setGoalsTab]             = useState("paths");
  const [admTab,setAdmTab]                 = useState("overview");
  const [showExForm,setShowExForm]         = useState(null);
  const [statsTab,setStatsTab]             = useState("overview");
  const [selTier,setSelTier]               = useState(null);
  const [taskSubTab,setTaskSubTab]         = useState("tasks");
  const [xp,setXp]                         = useState(D.xp||0);
  const [xpToast,setXpToast]               = useState(null);
  // Daily XP guard: { "Mon Apr 14 2026_mood": true, ... }
  const [xpGuard,setXpGuard]              = useState(()=>{
    const g=D.xpGuard||{};
    // Clear stale keys from previous days
    const fresh={};
    Object.keys(g).forEach(k=>{ if(k.startsWith(TODAY+"_")) fresh[k]=g[k]; });
    return fresh;
  });
  const [levelUpAnim,setLevelUpAnim]       = useState(null);
  const [mood,setMood]                     = useState(D.mood||null);
  const [moodLog,setMoodLog]               = useState(D.moodLog||[]);
  const [dailyLog,setDailyLog]             = useState(D.dailyLog||[]);
  const [dailyLogText,setDailyLogText]     = useState("");
  const [habits,setHabits]                 = useState(D.habits||[
    {id:"h1",name:"8 Glasses Water 💧",streak:0,lastDone:null,color:T.blue},
    {id:"h2",name:"Thesis Session 🧪",streak:0,lastDone:null,color:T.green},
    {id:"h3",name:"Workout Done 💪",streak:0,lastDone:null,color:T.pink},
    {id:"h4",name:"Read 30 min 📖",streak:0,lastDone:null,color:T.gold},
    {id:"h5",name:"No Skip Meals 🍽️",streak:0,lastDone:null,color:T.orange},
    {id:"h6",name:"Sleep Before 12 🌙",streak:0,lastDone:null,color:T.cyan},
  ]);
  const [newHabitName,setNewHabitName]     = useState("");
  const [showAddHabit,setShowAddHabit]     = useState(false);
  const [pomState,setPomState]             = useState("idle");
  const [pomLeft,setPomLeft]               = useState(25*60);
  const [pomMode,setPomMode]               = useState("focus");
  const [pomSessions,setPomSessions]       = useState(D.pomSessions||0);
  // Daily-reset: water & calories — reset if saved date ≠ today
  const [waterCount,setWaterCount]         = useState(D.waterData?.date===TODAY ? D.waterData.count : 0);
  const [calorieLog,setCalorieLog]         = useState(D.calData?.date===TODAY ? D.calData.log : []);
  const [calInput,setCalInput]             = useState("");
  const [calLabel,setCalLabel]             = useState("");
  const [focusTab,setFocusTab]             = useState("pomodoro");
  const [battleMode,setBattleMode]         = useState(false);
  const [battlePin,setBattlePin]           = useState(D.battlePin||"");
  const [battleInput,setBattleInput]       = useState("");
  const [battleError,setBattleError]       = useState(false);
  const [battleStart,setBattleStart]       = useState(null);
  const [battleSessions,setBattleSessions] = useState(D.battleSessions||[]);
  const [battleGoal,setBattleGoal]         = useState("");
  const [battleGoalInput,setBattleGoalInput] = useState("");
  const [achievements,setAchievements]     = useState(D.achievements||{});
  const [newAchievement,setNewAchievement] = useState(null);
  const [quoteIdx,setQuoteIdx]             = useState(0);
  const [matrixTab,setMatrixTab]           = useState("urgent-important");
  const [showSetPin,setShowSetPin]         = useState(false);
  const [pinInput1,setPinInput1]           = useState("");
  const [pinInput2,setPinInput2]           = useState("");
  const [progressTab,setProgressTab]       = useState("overview");
  const [showChangePin,setShowChangePin]   = useState(false);
  const xpToastTimer=useRef(null);

  // ── NEW PERSONALIZED FEATURE STATE ────────────────────────────────────────
  // IELTS Tracker
  const [ieltsVocab,setIeltsVocab]         = useState(D.ieltsVocab||[]);
  const [ieltsNewWord,setIeltsNewWord]     = useState({word:"",meaning:"",example:""});
  const [ieltsMocks,setIeltsMocks]         = useState(D.ieltsMocks||[]);
  const [ieltsNewMock,setIeltsNewMock]     = useState({date:"",r:0,w:0,l:0,s:0});
  const [ieltsTab,setIeltsTab]             = useState("vocab");
  const [showIeltsWord,setShowIeltsWord]   = useState(false);
  const [showIeltsMock,setShowIeltsMock]   = useState(false);
  const [vocabFlip,setVocabFlip]           = useState(null);

  // Music & Singing Log
  const [musicLog,setMusicLog]             = useState(D.musicLog||[]);
  const [musicForm,setMusicForm]           = useState({date:"",type:"Practice",note:"",duration:""});
  const [showMusicForm,setShowMusicForm]   = useState(false);

  // Freelancing Tracker
  const [freelanceLog,setFreelanceLog]     = useState(D.freelanceLog||[]);
  const [freelanceForm,setFreelanceForm]   = useState({date:"",platform:"Fiverr",desc:"",amount:0,status:"Earned"});
  const [showFLForm,setShowFLForm]         = useState(false);
  const [freelanceGoal,setFreelanceGoal]   = useState(D.freelanceGoal||15000);

  // Professor CRM
  const [profCRM,setProfCRM]               = useState(D.profCRM||[]);
  const [profForm,setProfForm]             = useState({name:"",uni:"kuet",dept:"CSE",research:"",emailed:false,replied:false,notes:""});
  const [showProfForm,setShowProfForm]     = useState(false);
  const [showProfDetail,setShowProfDetail] = useState(null);

  // Smoke Quit Timeline
  const [smokeGoalDate,setSmokeGoalDate]   = useState(D.smokeGoalDate||"2026-06-01");

  // ── ADMISSION ANALYTICS STATE ─────────────────────────────────────────────
  const [admCheckDone,setAdmCheckDone]     = useState(D.admCheckDone||{});
  const [profEmailDone,setProfEmailDone]   = useState(D.profEmailDone||{});
  const [schTab,setSchTab]                 = useState("readiness");
  const [showAnalysis,setShowAnalysis]     = useState(false);
  const [goalsSubTab,setGoalsSubTab]       = useState("dashboard");

  // Life tab sub-tab
  const [lifeTab,setLifeTab]               = useState("ielts");

  // Research paper log
  const [paperLog,setPaperLog]             = useState(D.paperLog||[]);
  const [paperForm,setPaperForm]           = useState({title:"",authors:"",year:"",tag:"CRO",notes:"",status:"Reading"});
  const [showPaperForm,setShowPaperForm]   = useState(false);

  // ── NEW INTERACTIVE STATE ──────────────────────────────────────────────────
  const [sleepLog,setSleepLog]             = useState(D.sleepLog||[]);
  const [sleepHours,setSleepHours]         = useState("");
  const [sleepQuality,setSleepQuality]     = useState("Good");
  const [researchNotes,setResearchNotes]   = useState(D.researchNotes||[]);
  const [newResNote,setNewResNote]         = useState({title:"",body:"",tag:"CRO"});
  const [showResNote,setShowResNote]       = useState(false);
  const [activeResNote,setActiveResNote]   = useState(null);
  const [showWeeklyReview,setShowWeeklyReview] = useState(false);
  const [weekReflect,setWeekReflect]       = useState({win:"",improve:"",focus:""});
  const [weekReviews,setWeekReviews]       = useState(D.weekReviews||{});
  const [showQuickLog,setShowQuickLog]     = useState(false);
  const [challengeDone,setChallengeDone]   = useState(D.challengeDone||{});
  const [showHabitCal,setShowHabitCal]     = useState(null);
  const [habitHistory,setHabitHistory]     = useState(D.habitHistory||{});
  const [deepFocusLeft,setDeepFocusLeft]   = useState(90*60);
  const [deepFocusSt,setDeepFocusSt]       = useState("idle");
  const [deepFocusSessions,setDeepFocusSessions]=useState(D.deepFocusSessions||0);
  const [showMscDeadlines,setShowMscDeadlines]=useState(false);
  const [burnoutDismissed,setBurnoutDismissed]=useState(D.burnoutDismissed||"");
  const [showQuoteModal,setShowQuoteModal]=useState(false);
  const [focusIntention,setFocusIntention]=useState(D.focusIntention||"");
  const [todayIntention,setTodayIntention]=useState(D.todayIntention||{text:"",date:""});
  const [intentionInput,setIntentionInput]=useState("");

  // ── XP SYSTEM ──────────────────────────────────────────────────────────────
  // gainXP — add XP, optional daily-guard
  const gainXP=(amount,label,actionKey=null,oncePerDay=false)=>{
    if(oncePerDay&&actionKey){
      const key=`${TODAY}_${actionKey}`;
      if(xpGuard[key]) return;
      setXpGuard(g=>({...g,[key]:true}));
    }
    setXp(prev=>{
      const next=prev+amount;
      const oldRank=getRank(prev).title;
      const newRank=getRank(next).title;
      if(newRank!==oldRank){
        const r=getRank(next);
        setLevelUpAnim({title:r.title,color:r.color});
        setTimeout(()=>setLevelUpAnim(null),3200);
      }
      return next;
    });
    setXpToast({amount,label});
    if(xpToastTimer.current) clearTimeout(xpToastTimer.current);
    xpToastTimer.current=setTimeout(()=>setXpToast(null),2400);
  };

  // takeXP — remove XP (never below 0), clear daily guard if actionKey given
  const takeXP=(amount,label,actionKey=null)=>{
    if(actionKey){
      const key=`${TODAY}_${actionKey}`;
      setXpGuard(g=>{const n={...g};delete n[key];return n;});
    }
    setXp(prev=>Math.max(0,prev-amount));
    setXpToast({amount:-amount,label});
    if(xpToastTimer.current) clearTimeout(xpToastTimer.current);
    xpToastTimer.current=setTimeout(()=>setXpToast(null),2400);
  };

  const xpLevel=Math.floor(xp/100)+1;
  const xpPct=xp%100;
  const rank=getRank(xp);

  // ── HELPERS ────────────────────────────────────────────────────────────────
  const tDone=(wk,cat,i)=>!!tasksDone[`${wk}-${cat}-${i}`];
  // Thesis tasks: +10 XP on check, -10 XP on uncheck
  const togT=(wk,cat,i)=>{
    const key=`${wk}-${cat}-${i}`;
    const wasDone=!!tasksDone[key];
    setTasksDone(p=>({...p,[key]:!wasDone}));
    if(!wasDone) gainXP(10,"Task complete ✅");
    else takeXP(10,"Task undone ↩");
  };
  const isSetDone=(day,exId,si)=>!!sets[`${day}-${exId}-${si}`];
  // Workout sets: +5 XP on complete, -5 XP on untick
  const togSet=(day,exId,si)=>{
    const key=`${day}-${exId}-${si}`;
    const wasDone=!!sets[key];
    setSets(p=>({...p,[key]:!wasDone}));
    if(!wasDone) gainXP(5,"Set done 💪");
    else takeXP(5,"Set removed ↩");
  };
  const exPct=(day,ex)=>{const d=Array.from({length:ex.sets},(_,i)=>isSetDone(day,ex.id,i)).filter(Boolean).length;return ex.sets===0?100:Math.round((d/ex.sets)*100);};
  const dayPct=(dn)=>{const d=DAYS[dn-1];const tot=d.exercises.reduce((a,e)=>a+e.sets,0);const done=d.exercises.reduce((a,e)=>a+Array.from({length:e.sets},(_,i)=>isSetDone(dn,e.id,i)).filter(Boolean).length,0);return tot===0?100:Math.round((done/tot)*100);};
  const weekPct=(wk)=>{const w=WEEKS.find(x=>x.week===wk);if(!w)return 0;const cats=["thesis","csprep","ielts","admission"];const tot=cats.reduce((a,c)=>a+w[c].length,0);const done=cats.reduce((a,c)=>a+w[c].filter((_,i)=>tDone(wk,c,i)).length,0);return tot===0?0:Math.round((done/tot)*100);};
  const totalPct=()=>{const tot=WEEKS.reduce((a,w)=>a+w.thesis.length+w.csprep.length+w.ielts.length+w.admission.length,0);const done=Object.values(tasksDone).filter(Boolean).length;return tot===0?0:Math.round((done/tot)*100);};
  const pc=(ph)=>({1:T.orange,2:T.green,3:T.blue,4:"#a855f7"})[ph];
  const gt=(color)=>({color,textShadow:`0 0 10px ${color}44`});
  const C=(extra={})=>({background:T.bg1,border:`1px solid ${T.border}`,borderRadius:12,...extra});
  const tp=totalPct();
  const curWeight=weightLog.length>0?weightLog[weightLog.length-1].weight:50;
  const wGained=Math.max(0,curWeight-50).toFixed(1);
  const curSmoke=smokingLog.length>0?smokingLog[smokingLog.length-1].count:10;
  const sPct=Math.min(100,Math.round(((10-curSmoke)/10)*100));
  const wPct=Math.min(100,Math.round(((curWeight-50)/10)*100));

  // ── PERSIST — fires whenever any state changes ────────────────────────────
  useEffect(()=>{
    saveState({
      tasksDone,taskNotes,workoutDay,sets,warmupDone,streak,lastWO,
      weightLog,measurements,smokingLog,myTasks,notes,xp,mood,moodLog,
      dailyLog,habits,pomSessions,battlePin,achievements,xpGuard,pinHash,
      sleepLog,researchNotes,weekReviews,challengeDone,habitHistory,
      deepFocusSessions,burnoutDismissed,focusIntention,todayIntention,battleSessions,
      ieltsVocab,ieltsMocks,musicLog,freelanceLog,freelanceGoal,profCRM,smokeGoalDate,paperLog,
      admCheckDone,profEmailDone,
      waterData:{count:waterCount,date:TODAY},
      calData:{log:calorieLog,date:TODAY},
    });
  },[tasksDone,taskNotes,workoutDay,sets,warmupDone,streak,lastWO,weightLog,
     measurements,smokingLog,myTasks,notes,xp,mood,moodLog,dailyLog,habits,
     pomSessions,waterCount,calorieLog,battlePin,achievements,xpGuard,pinHash,
     sleepLog,researchNotes,weekReviews,challengeDone,habitHistory,
     deepFocusSessions,burnoutDismissed,focusIntention,todayIntention,battleSessions,
     ieltsVocab,ieltsMocks,musicLog,freelanceLog,freelanceGoal,profCRM,smokeGoalDate,paperLog,
     admCheckDone,profEmailDone]);

  // ── POMODORO TIMER ────────────────────────────────────────────────────────
  useEffect(()=>{
    if(pomState!=="running")return;
    if(pomLeft<=0){
      if(pomMode==="focus"){ gainXP(25,"Pomodoro ✅"); setPomSessions(s=>s+1); setPomMode("short"); setPomLeft(5*60); }
      else{ setPomMode("focus"); setPomLeft(25*60); }
      setPomState("idle"); return;
    }
    const t=setTimeout(()=>setPomLeft(l=>l-1),1000);
    return()=>clearTimeout(t);
  },[pomState,pomLeft,pomMode]);

  // ── DEEP FOCUS TIMER ──────────────────────────────────────────────────────
  useEffect(()=>{
    if(deepFocusSt!=="running")return;
    if(deepFocusLeft<=0){
      gainXP(75,"Deep Focus Session 🧠 90min!");
      setDeepFocusSessions(s=>s+1);
      setDeepFocusSt("idle");
      setDeepFocusLeft(90*60);
      return;
    }
    const t=setTimeout(()=>setDeepFocusLeft(l=>l-1),1000);
    return()=>clearTimeout(t);
  },[deepFocusSt,deepFocusLeft]);

  // ── DAILY SCORE ───────────────────────────────────────────────────────────
  const getDailyScore=()=>{
    let s=0;
    const taskCount=Object.values(tasksDone).filter(Boolean).length;
    const todayHabits=habits.filter(h=>h.lastDone===TODAY).length;
    const habitPct=habits.length>0?todayHabits/habits.length:0;
    s+=Math.min(20,taskCount*4);                         // tasks: 20pts
    s+=Math.round(habitPct*20);                          // habits: 20pts
    s+=Math.min(10,Math.round((waterCount/8)*10));       // water: 10pts
    s+=Math.min(15,Math.round((dayPct(workoutDay)/100)*15)); // workout: 15pts
    s+=moodLog.some(e=>e.date===TODAY)?5:0;             // mood: 5pts
    s+=dailyLog.some(e=>e.date===TODAY)?5:0;            // diary: 5pts
    const sl=sleepLog.find(x=>x.date===TODAY);
    if(sl)s+=(sl.hours>=7&&sl.hours<=9)?15:8;           // sleep: 15pts
    s+=calorieLog.reduce((a,c)=>a+c.cal,0)>=2500?10:0; // calories: 10pts
    return Math.min(100,s);
  };
  const dailyScore=getDailyScore();
  const scoreGrade=dailyScore>=90?"S":dailyScore>=75?"A":dailyScore>=60?"B":dailyScore>=40?"C":"D";
  const scoreColor=dailyScore>=90?T.gold:dailyScore>=75?T.green:dailyScore>=60?T.blue:dailyScore>=40?T.orange:T.red;

  // ── BURNOUT DETECTION ─────────────────────────────────────────────────────
  const isBurnout=streak>=10&&habits.filter(h=>h.lastDone===TODAY).length===habits.length&&burnoutDismissed!==TODAY;

  // ── CHALLENGE CHECK ───────────────────────────────────────────────────────
  const todayChallenge=getTodayChallenge();
  const challengeState={tasksDone,waterData:{count:waterCount,date:TODAY},pomSessions,habits,dailyLog,sets,moodLog,calData:{log:calorieLog,date:TODAY},sleepLog,weightLog,measurements,smokingLog,researchNotes};
  const isChallengeComplete=todayChallenge.check(challengeState,TODAY);
  const challengeKey=`${TODAY}_${todayChallenge.key}`;
  useEffect(()=>{
    if(isChallengeComplete&&!challengeDone[challengeKey]){
      setChallengeDone(p=>({...p,[challengeKey]:true}));
      gainXP(todayChallenge.xp,`Daily Challenge: ${todayChallenge.icon} +${todayChallenge.xp}XP!`);
    }
  },[isChallengeComplete]);

  // ── ACHIEVEMENT CHECKER ───────────────────────────────────────────────────
  useEffect(()=>{
    const taskCount=Object.values(tasksDone).filter(Boolean).length;
    const workoutDays=new Set(Object.keys(sets).map(k=>k.split("-")[0])).size;
    const allHabitsToday=habits.length>0&&habits.every(h=>h.lastDone===TODAY);
    const checks={
      first_task:   taskCount>=1,
      five_tasks:   taskCount>=5,
      ten_tasks:    taskCount>=10,
      twenty_tasks: taskCount>=20,
      fifty_tasks:  taskCount>=50,
      week_done:    WEEKS.some(w=>weekPct(w.week)===100),
      two_weeks:    WEEKS.filter(w=>weekPct(w.week)===100).length>=2,
      phase1:       WEEKS.filter(w=>w.phase===1).every(w=>weekPct(w.week)===100),
      phase2:       WEEKS.filter(w=>w.phase===2).every(w=>weekPct(w.week)===100),
      phase3:       WEEKS.filter(w=>w.phase===3).every(w=>weekPct(w.week)===100),
      phase4:       WEEKS.filter(w=>w.phase===4).every(w=>weekPct(w.week)===100),
      all_phases:   WEEKS.every(w=>weekPct(w.week)===100),
      xp50:         xp>=50,
      xp100:        xp>=100,
      xp300:        xp>=300,
      xp500:        xp>=500,
      xp1000:       xp>=1000,
      xp2500:       xp>=2500,
      first_workout:Object.keys(sets).length>=1,
      workout3:     workoutDays>=3,
      workout10:    workoutDays>=10,
      streak7:      streak>=7,
      streak14:     streak>=14,
      weight3:      weightLog.length>=3,
      weight_goal:  curWeight>=60,
      smoke_cut:    curSmoke<=5&&curSmoke>0,
      smoke_quit:   curSmoke===0,
      hydrated:     waterCount>=8,
      habits_all:   allHabitsToday,
      habits3streak:habits.length>0&&habits.every(h=>h.streak>=3),
      pomodoro1:    pomSessions>=1,
      pomodoro5:    pomSessions>=5,
      pomodoro20:   pomSessions>=20,
      notes1:       dailyLog.length>=1,
      notes5:       dailyLog.length>=5,
      notes20:      dailyLog.length>=20,
      comeback_king:WEEKS.filter(w=>w.phase===1).every(w=>weekPct(w.week)===100)&&streak>=7&&xp>=500,
      perfect_day:  allHabitsToday&&workoutDays>=1&&taskCount>=1,
      early_bird:   new Date().getHours()<8&&moodLog.some(e=>e.date===TODAY),
      note_creator: notes.length>1,
    };
    ACHIEVEMENTS_DEF.forEach(a=>{
      if(!achievements[a.id]&&checks[a.id]){
        setAchievements(p=>({...p,[a.id]:true}));
        setNewAchievement(a);
        if(a.xp>0) gainXP(a.xp,`🏆 ${a.name}!`);
        setTimeout(()=>setNewAchievement(null),4500);
      }
    });
  },[tasksDone,sets,weightLog,smokingLog,xp,dailyLog,habits,pomSessions,waterCount,streak,moodLog,notes]);

  // ── HOME ──
  const Home=()=>{
    const todayMoods=[{e:"😤",l:"GRINDING"},{e:"💪",l:"STRONG"},{e:"😐",l:"OKAY"},{e:"😴",l:"TIRED"},{e:"🔥",l:"ON FIRE"}];
    const totalCal=calorieLog.reduce((a,c)=>a+c.cal,0);
    const r=getRank(xp);
    // Mood trend: last 7 days
    const moodEmojis={GRINDING:"😤",STRONG:"💪",OKAY:"😐",TIRED:"😴","ON FIRE":"🔥"};
    const moodScores={GRINDING:80,STRONG:90,"ON FIRE":100,OKAY:60,TIRED:40};
    const last7Days=Array.from({length:7},(_,i)=>{
      const d=new Date(Date.now()-(6-i)*86400000).toDateString();
      const entry=moodLog.filter(m=>m.date===d).slice(-1)[0];
      return{d,mood:entry?.mood||null,score:entry?moodScores[entry.mood]||50:0};
    });
    const todaySleep=sleepLog.find(s=>s.date===TODAY);
    const isWeeklyReviewDay=new Date().getDay()===0; // Sunday
    return(
    <div style={{padding:16}}>

      {/* ── BURNOUT ALERT ── */}
      {isBurnout&&(
        <div style={{...C({padding:"12px 14px",marginBottom:12,border:`1px solid ${T.red}`,animation:"burnout 2s infinite"})}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:11,color:T.red,fontWeight:700,...orb}}>⚠️ BURNOUT RISK DETECTED</div>
              <div style={{fontSize:11,color:T.muted,...raj,marginTop:3}}>{streak} days straight. Take a mindful rest — it's not weakness, it's maintenance.</div>
            </div>
            <button onClick={()=>setBurnoutDismissed(TODAY)} style={{fontSize:10,color:T.muted,background:"transparent",border:`1px solid ${T.border}`,borderRadius:6,padding:"4px 10px",cursor:"pointer",...mono,flexShrink:0,marginLeft:10}}>OK</button>
          </div>
        </div>
      )}

      {/* ── DAILY CHALLENGE ── */}
      <div style={{...C({padding:"14px",marginBottom:12,border:`1px solid ${challengeDone[challengeKey]?T.gold+"88":T.gold+"33"}`,background:challengeDone[challengeKey]?"linear-gradient(135deg,#1a1200,#0a0800)":"transparent",animation:!challengeDone[challengeKey]?"challengePulse 3s infinite":"none"})}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontSize:9,color:T.gold,letterSpacing:2,...mono}}>⚔️ DAILY CHALLENGE</div>
          {challengeDone[challengeKey]?<span style={{fontSize:9,color:T.gold,background:T.gold+"22",padding:"2px 8px",borderRadius:10,...mono}}>✓ COMPLETED +{todayChallenge.xp}XP</span>:<span style={{fontSize:9,color:T.muted,...mono}}>+{todayChallenge.xp} XP</span>}
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <span style={{fontSize:24}}>{todayChallenge.icon}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:13,color:challengeDone[challengeKey]?T.gold:T.bright,fontWeight:600,...raj,textDecoration:challengeDone[challengeKey]?"line-through":"none"}}>{todayChallenge.text}</div>
            {challengeDone[challengeKey]&&<div style={{fontSize:10,color:T.gold,...mono,marginTop:3}}>🏆 NAILED IT — comeback confirmed</div>}
          </div>
        </div>
      </div>

      {/* ── TODAY'S INTENTION ── */}
      <div style={{...C({padding:"12px 14px",marginBottom:12,border:`1px solid ${T.cyan}33`,background:"linear-gradient(135deg,#020d0d,#020408)"})}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:todayIntention.date===TODAY?8:6}}>
          <div style={{fontSize:9,color:T.cyan,letterSpacing:2,...mono}}>🎯 TODAY'S INTENTION</div>
          {todayIntention.date===TODAY&&<button onClick={()=>setTodayIntention({text:"",date:""})} style={{fontSize:9,color:T.muted,background:"transparent",border:`1px solid ${T.border}`,borderRadius:5,padding:"2px 7px",cursor:"pointer",...mono}}>RESET</button>}
        </div>
        {todayIntention.date===TODAY?(
          <div style={{fontSize:13,color:T.cyan,...raj,fontWeight:600,lineHeight:1.5,fontStyle:"italic"}}>"{todayIntention.text}"</div>
        ):(
          <div style={{display:"flex",gap:6}}>
            <input value={intentionInput} onChange={e=>setIntentionInput(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter"&&intentionInput.trim()){setTodayIntention({text:intentionInput.trim(),date:TODAY});setIntentionInput("");gainXP(5,"Intention set 🎯","intention",true);e.preventDefault();}}}
              placeholder="Set your ONE intention for today..." style={{flex:1,background:T.bg2,border:`1px solid ${T.cyan}33`,borderRadius:7,padding:"8px 10px",color:T.bright,fontSize:12,...raj}}/>
            <button onClick={()=>{if(intentionInput.trim()){setTodayIntention({text:intentionInput.trim(),date:TODAY});setIntentionInput("");gainXP(5,"Intention set 🎯","intention",true);}}} className="btn-tap" style={{padding:"8px 12px",background:T.cyan+"22",border:`1px solid ${T.cyan}44`,color:T.cyan,borderRadius:7,fontSize:11,...mono,cursor:"pointer"}}>SET</button>
          </div>
        )}
      </div>

      {/* ── DAILY SCORE + BANNER ── */}
      <div style={{...C({padding:"18px",marginBottom:12,background:"linear-gradient(135deg,#020d08,#041520,#020408)",border:`1px solid ${T.green}44`,position:"relative",overflow:"hidden"})}}>
        <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(0deg,transparent,transparent 28px,#00ff0806 29px),repeating-linear-gradient(90deg,transparent,transparent 28px,#00ff0806 29px)",pointerEvents:"none"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{flex:1}}>
            <div style={{fontSize:9,color:T.dim,letterSpacing:4,...mono}}>OPERATION // ULTIMATE COMEBACK</div>
            <div style={{...orb,fontSize:22,fontWeight:900,...gt(T.green),marginTop:4}}>RUDRA</div>
            <div style={{fontSize:11,color:T.muted,marginTop:2,...raj}}>{new Date().getHours()<5?"🌙 Working late — legendary dedication":new Date().getHours()<12?"🌅 Good morning — make today count":new Date().getHours()<17?"☀️ Afternoon grind — stay locked in":"🌆 Evening session — finish strong"}</div>
            <div style={{display:"flex",gap:6,alignItems:"center",marginTop:8}}>
              <div style={{fontSize:9,color:r.color,...mono,background:r.color+"22",padding:"2px 8px",borderRadius:10}}>⚡ {r.title}</div>
              <div style={{fontSize:9,color:T.gold,...mono}}>{xp} XP · LVL {xpLevel}</div>
            </div>
          </div>
          {/* Daily Score Circle */}
          <div style={{textAlign:"center",flexShrink:0,marginLeft:10}}>
            <div style={{width:64,height:64,borderRadius:"50%",border:`3px solid ${scoreColor}`,background:`${scoreColor}15`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",boxShadow:`0 0 16px ${scoreColor}44`,animation:"scoreCount .5s ease"}}>
              <div style={{...orb,fontSize:20,fontWeight:900,color:scoreColor,lineHeight:1}}>{scoreGrade}</div>
              <div style={{fontSize:8,color:scoreColor,...mono}}>{dailyScore}</div>
            </div>
            <div style={{fontSize:7,color:T.muted,...mono,marginTop:3}}>TODAY</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginTop:12}}>
          <div style={{flex:1,height:7,background:"#041a0e",borderRadius:4,overflow:"hidden"}}>
            <div style={{width:`${tp}%`,height:"100%",background:`linear-gradient(90deg,${T.blue},${T.green})`,boxShadow:`0 0 12px ${T.green}55`,borderRadius:4,transition:"width .8s"}}/>
          </div>
          <span style={{...orb,fontSize:13,fontWeight:700,...gt(T.green)}}>{tp}%</span>
        </div>
        <LiveClock/>
        <div style={{display:"flex",gap:6,marginTop:8}}>
          <button onClick={()=>setShowMscDeadlines(true)} style={{fontSize:9,color:T.blue,background:T.blue+"11",border:`1px solid ${T.blue}33`,borderRadius:6,padding:"3px 10px",cursor:"pointer",...mono}}>🏛️ MSc Deadlines</button>
          {isWeeklyReviewDay&&<button onClick={()=>setShowWeeklyReview(true)} style={{fontSize:9,color:T.gold,background:T.gold+"11",border:`1px solid ${T.gold}33`,borderRadius:6,padding:"3px 10px",cursor:"pointer",...mono}}>📋 Weekly Review</button>}
        </div>
        {/* Rank XP bar */}
        <div style={{marginTop:10,borderTop:`1px solid ${T.border}`,paddingTop:8}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{fontSize:8,color:r.color,...mono}}>{r.title}</span>
            <span style={{fontSize:8,color:T.muted,...mono}}>{xpPct}/100 to LVL {xpLevel+1}</span>
          </div>
          <div style={{height:4,background:T.bg2,borderRadius:2,overflow:"hidden"}}>
            <div style={{width:`${xpPct}%`,height:"100%",background:`linear-gradient(90deg,${r.color},${T.gold})`,boxShadow:`0 0 6px ${r.color}55`,borderRadius:2,transition:"width .5s"}}/>
          </div>
        </div>
        {/* Rotating motivational quote */}
        <div onClick={()=>{setQuoteIdx(q=>(q+1)%PROFILE.quotes.length);setShowQuoteModal(true);}} style={{marginTop:10,borderTop:`1px solid ${T.border}`,paddingTop:8,cursor:"pointer"}}>
          <div style={{fontSize:9,color:T.dim,letterSpacing:2,...mono,marginBottom:4}}>💬 TAP FOR FUEL</div>
          <div key={quoteIdx} style={{fontSize:11,color:T.text,...raj,lineHeight:1.6,fontStyle:"italic",animation:"quoteFade .5s ease"}}>"{PROFILE.quotes[quoteIdx]}"</div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:12}}>
        {[{l:"THESIS",v:`${tp}%`,c:T.green},{l:"WEIGHT",v:`+${wGained}kg`,c:T.pink},{l:"STREAK",v:`${streak}d 🔥`,c:T.gold},{l:"SCORE",v:dailyScore,c:scoreColor}].map((s,i)=>(
          <div key={i} style={{...C({padding:"10px 4px",textAlign:"center",border:`1px solid ${s.c}22`})}}>
            <div style={{...orb,fontSize:15,fontWeight:900,...gt(s.c)}}>{s.v}</div>
            <div style={{fontSize:7,color:T.muted,letterSpacing:1,marginTop:2,...mono}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* ── TODAY'S PROGRESS CHECKLIST ── */}
      <div style={{...C({padding:"14px",marginBottom:12,border:`1px solid ${T.green}22`})}}>
        <div style={{fontSize:9,color:T.green,letterSpacing:2,...mono,marginBottom:10}}>📋 TODAY'S PROGRESS</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          {[
            {label:"Mood logged",done:moodLog.some(e=>e.date===TODAY),color:T.cyan,icon:"🧠"},
            {label:"Sleep logged",done:!!sleepLog.find(x=>x.date===TODAY),color:"#a855f7",icon:"😴"},
            {label:"Water 8/8",done:waterCount>=8,color:T.blue,icon:"💧"},
            {label:"Workout",done:dayPct(workoutDay)===100,color:DAYS[workoutDay-1].color,icon:"💪"},
            {label:"War log entry",done:dailyLog.some(e=>e.date===TODAY),color:T.green,icon:"📓"},
            {label:"Calories 2800+",done:calorieLog.reduce((a,c)=>a+c.cal,0)>=2800,color:T.orange,icon:"🔥"},
            {label:"Habits done",done:habits.length>0&&habits.every(h=>h.lastDone===TODAY),color:T.gold,icon:"🔁"},
            {label:"Intention set",done:todayIntention.date===TODAY,color:T.cyan,icon:"🎯"},
          ].map((item,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,background:item.done?item.color+"11":"transparent",border:`1px solid ${item.done?item.color+"44":T.border}`,borderRadius:8,padding:"7px 10px",transition:"all .3s"}}>
              <span style={{fontSize:14,flexShrink:0}}>{item.icon}</span>
              <span style={{flex:1,fontSize:10,color:item.done?item.color:T.muted,...raj,fontWeight:item.done?600:400,textDecoration:item.done?"none":"none"}}>{item.label}</span>
              <span style={{fontSize:12,color:item.done?item.color:T.border}}>{item.done?"✓":"○"}</span>
            </div>
          ))}
        </div>
        <div style={{marginTop:10,height:5,background:T.bg2,borderRadius:3,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${Math.round(([moodLog.some(e=>e.date===TODAY),!!sleepLog.find(x=>x.date===TODAY),waterCount>=8,dayPct(workoutDay)===100,dailyLog.some(e=>e.date===TODAY),calorieLog.reduce((a,c)=>a+c.cal,0)>=2800,habits.length>0&&habits.every(h=>h.lastDone===TODAY),todayIntention.date===TODAY].filter(Boolean).length/8)*100)}%`,background:`linear-gradient(90deg,${T.blue},${T.green})`,borderRadius:3,transition:"width .8s"}}/>
        </div>
        <div style={{fontSize:8,color:T.muted,...mono,marginTop:4,textAlign:"right"}}>{[moodLog.some(e=>e.date===TODAY),!!sleepLog.find(x=>x.date===TODAY),waterCount>=8,dayPct(workoutDay)===100,dailyLog.some(e=>e.date===TODAY),calorieLog.reduce((a,c)=>a+c.cal,0)>=2800,habits.length>0&&habits.every(h=>h.lastDone===TODAY),todayIntention.date===TODAY].filter(Boolean).length}/8 COMPLETED</div>
      </div>

      {/* ── MOOD TREND CHART ── */}
      <div style={{...C({padding:"14px",marginBottom:12,border:`1px solid ${T.cyan}22`})}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontSize:9,color:T.cyan,letterSpacing:2,...mono}}>🧠 TODAY'S MENTAL STATE</div>
          {mood&&<button onClick={()=>{setMood(null);setMoodLog(p=>p.filter(e=>e.date!==TODAY));takeXP(5,"Mood cleared ↩","mood");}} style={{fontSize:9,color:T.muted,background:"transparent",border:`1px solid ${T.border}`,borderRadius:6,padding:"2px 8px",cursor:"pointer",...mono}}>✕ CLEAR</button>}
        </div>
        <div style={{display:"flex",gap:6,marginBottom:10}}>
          {todayMoods.map(m=>(
            <button key={m.l} onClick={()=>{
              const first=!moodLog.some(e=>e.date===TODAY);
              setMood(m.l);
              setMoodLog(p=>[...p.filter(e=>e.date!==TODAY),{mood:m.l,emoji:m.e,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),date:TODAY}]);
              if(first)gainXP(5,"Mood logged 🧠","mood",true);
              if(new Date().getHours()<8)gainXP(25,"Early Bird! 🌅","early_bird",true);
            }} className="btn-tap" style={{flex:1,padding:"8px 2px",background:mood===m.l?T.cyan+"22":"transparent",border:`1.5px solid ${mood===m.l?T.cyan:T.border}`,borderRadius:8,cursor:"pointer",textAlign:"center",transition:"all .2s"}}>
              <div style={{fontSize:18}}>{m.e}</div>
              <div style={{fontSize:7,color:mood===m.l?T.cyan:T.muted,...mono,marginTop:2}}>{m.l}</div>
            </button>
          ))}
        </div>
        {/* 7-day mood trend */}
        <div style={{borderTop:`1px solid ${T.border}`,paddingTop:10}}>
          <div style={{fontSize:8,color:T.muted,letterSpacing:2,...mono,marginBottom:6}}>7-DAY MOOD TREND</div>
          <div style={{display:"flex",gap:3,alignItems:"flex-end",height:40}}>
            {last7Days.map((d,i)=>{
              const h=d.score>0?Math.max(8,Math.round((d.score/100)*36)):4;
              const isToday=i===6;
              const mColor=d.score>=80?T.green:d.score>=60?T.blue:d.score>=40?T.orange:T.red;
              return(
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                  {d.mood&&<span style={{fontSize:9}}>{moodEmojis[d.mood]||"•"}</span>}
                  <div style={{width:"100%",height:h,background:d.score>0?(isToday?T.cyan:mColor+"88"):T.border,borderRadius:2,border:isToday?`1px solid ${T.cyan}`:"none",transition:"height .5s",boxShadow:isToday?`0 0 6px ${T.cyan}44`:"none"}}/>
                  <div style={{fontSize:6,color:isToday?T.cyan:T.dim,...mono}}>{new Date(d.d).toLocaleDateString([],{weekday:"narrow"})}</div>
                </div>
              );
            })}
          </div>
        </div>
        {mood&&<div style={{fontSize:10,color:T.cyan,marginTop:8,textAlign:"center",...mono}}>Current: {mood} — stay locked in ⚡</div>}
      </div>

      {/* ── SLEEP TRACKER ── */}
      <div style={{...C({padding:"14px",marginBottom:12,border:`1px solid ${"#a855f7"}22`})}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontSize:9,color:"#a855f7",letterSpacing:2,...mono}}>😴 SLEEP TRACKER</div>
          {todaySleep&&<div style={{fontSize:10,color:"#a855f7",...mono}}>{todaySleep.hours}h · {todaySleep.quality}</div>}
        </div>
        {!todaySleep?(
          <div style={{display:"flex",gap:6}}>
            <input value={sleepHours} onChange={e=>setSleepHours(e.target.value)} type="number" placeholder="Hours slept" style={{flex:1,background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"7px 10px",color:T.bright,fontSize:12,...mono}} min="1" max="12" step="0.5"/>
            <select value={sleepQuality} onChange={e=>setSleepQuality(e.target.value)} style={{flex:1,background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"7px 10px",color:T.text,fontSize:11,...mono}}>
              {["Great","Good","Okay","Poor","Terrible"].map(q=><option key={q} value={q}>{q}</option>)}
            </select>
            <button onClick={()=>{
              const h=parseFloat(sleepHours);
              if(!isNaN(h)&&h>0){
                setSleepLog(l=>[...l.filter(x=>x.date!==TODAY),{date:TODAY,hours:h,quality:sleepQuality}]);
                setSleepHours("");
                const xpAmt=h>=7&&h<=9?20:h>=6?10:5;
                gainXP(xpAmt,`Sleep logged 😴 ${h}h`,"sleep",true);
              }
            }} className="btn-tap" style={{padding:"7px 12px",background:"#a855f722",border:"1px solid #a855f755",color:"#a855f7",borderRadius:7,fontSize:11,...mono,cursor:"pointer"}}>LOG</button>
          </div>
        ):(
          <div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              {Array.from({length:9},(_,i)=>{
                const isOn=(i+1)<=todaySleep.hours;
                const optimal=i>=6&&i<=8;
                return <div key={i} style={{flex:1,height:16,borderRadius:3,background:isOn?(optimal?"#a855f7":"#a855f766"):T.border,transition:"all .3s",boxShadow:isOn&&optimal?"0 0 6px #a855f766":"none"}}/>;
              })}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
              <span style={{fontSize:8,color:T.muted,...mono}}>1h</span>
              <span style={{fontSize:8,color:"#a855f7",...mono}}>Optimal: 7–9h</span>
              <span style={{fontSize:8,color:T.muted,...mono}}>9h</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}>
              <span style={{fontSize:10,...raj,color:T.text}}>Quality: <strong style={{color:"#a855f7"}}>{todaySleep.quality}</strong></span>
              <button onClick={()=>setSleepLog(l=>l.filter(x=>x.date!==TODAY))} style={{fontSize:9,color:T.muted,background:"transparent",border:`1px solid ${T.border}`,borderRadius:5,padding:"2px 7px",cursor:"pointer",...mono}}>EDIT</button>
            </div>
          </div>
        )}
      </div>

      {/* ── WATER ── */}
      <div style={{...C({padding:"14px",marginBottom:10,border:`1px solid ${T.blue}22`})}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontSize:9,color:T.blue,letterSpacing:2,...mono}}>💧 WATER INTAKE</div>
          <div style={{...orb,fontSize:14,fontWeight:700,color:waterCount>=8?T.green:T.blue}}>{waterCount}/8 glasses</div>
        </div>
        <div style={{display:"flex",gap:5,marginBottom:6}}>
          {Array.from({length:8},(_,i)=>(
            <div key={i} onClick={()=>{
              if(i===waterCount){const nx=waterCount+1;setWaterCount(nx);if(nx===8)gainXP(15,"Hydrated! 💧","hydration",true);}
              else if(i<waterCount)setWaterCount(i);
            }} style={{flex:1,height:30,borderRadius:5,background:i<waterCount?T.blue+"44":"transparent",border:`1.5px solid ${i<waterCount?T.blue:T.border}`,cursor:"pointer",transition:"all .2s",boxShadow:i<waterCount?`0 0 5px ${T.blue}44`:"none"}}/>
          ))}
        </div>
        <div style={{fontSize:8,color:T.muted,...mono}}>Tap next to fill · Tap filled to undo</div>
      </div>

      {/* ── CALORIES ── */}
      <div style={{...C({padding:"14px",marginBottom:10,border:`1px solid ${T.orange}22`})}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontSize:9,color:T.orange,letterSpacing:2,...mono}}>🔥 CALORIES</div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{...orb,fontSize:13,fontWeight:700,color:totalCal>=2800?T.green:T.orange}}>{totalCal}/2800</div>
            {calorieLog.length>0&&<button onClick={()=>{takeXP(calorieLog.length*3,"Meals cleared ↩");setCalorieLog([]);}} style={{fontSize:8,color:T.muted,background:"transparent",border:`1px solid ${T.border}`,borderRadius:5,padding:"2px 6px",cursor:"pointer",...mono}}>CLEAR</button>}
          </div>
        </div>
        <div style={{height:4,background:T.bg2,borderRadius:2,overflow:"hidden",marginBottom:8}}>
          <div style={{width:`${Math.min(100,(totalCal/2800)*100)}%`,height:"100%",background:`linear-gradient(90deg,${T.orange},${T.green})`,borderRadius:2,transition:"width .5s"}}/>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:8}}>
          <input value={calLabel} onChange={e=>setCalLabel(e.target.value)} placeholder="Meal name..." style={{flex:2,background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"7px 10px",color:T.bright,fontSize:11,...raj}}/>
          <input value={calInput} onChange={e=>setCalInput(e.target.value)} type="number" placeholder="cal" style={{flex:1,background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"7px 10px",color:T.bright,fontSize:11,...mono}}/>
          <button onClick={()=>{const v=parseInt(calInput);if(!isNaN(v)&&v>0){setCalorieLog(l=>[...l,{id:Date.now(),label:calLabel||"Meal",cal:v,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]);setCalInput("");setCalLabel("");gainXP(3,"Meal logged 🍽️");}}} className="btn-tap" style={{padding:"7px 12px",background:T.orange+"33",border:`1px solid ${T.orange}55`,color:T.orange,borderRadius:7,fontSize:11,...mono,cursor:"pointer"}}>LOG</button>
        </div>
        {calorieLog.length>0&&(
          <div style={{display:"flex",flexDirection:"column",gap:4,maxHeight:150,overflowY:"auto"}}>
            {calorieLog.map((x,i)=>(
              <div key={x.id||i} style={{display:"flex",alignItems:"center",gap:8,background:T.bg2,border:`1px solid ${T.border}`,borderRadius:6,padding:"5px 10px"}}>
                <span style={{fontSize:9,color:T.dim,...mono,flexShrink:0}}>{x.time}</span>
                <span style={{flex:1,fontSize:11,color:T.text,...raj}}>{x.label}</span>
                <span style={{...orb,fontSize:11,color:T.orange,fontWeight:700,flexShrink:0}}>{x.cal} cal</span>
                <button onClick={()=>{setCalorieLog(l=>l.filter((_,j)=>j!==i));takeXP(3,"Meal removed ↩");}} style={{background:"transparent",border:"none",color:T.muted,fontSize:16,cursor:"pointer",lineHeight:1}}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── DAILY WAR LOG ── */}
      <div style={{...C({padding:"14px",marginBottom:10,border:`1px solid ${T.green}22`})}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontSize:9,color:T.green,letterSpacing:2,...mono}}>📓 DAILY WAR LOG</div>
          <span style={{fontSize:9,color:T.muted,...mono}}>{dailyLog.length} entries</span>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:8}}>
          <input value={dailyLogText} onChange={e=>setDailyLogText(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&dailyLogText.trim()){setDailyLog(p=>[{id:Date.now(),text:dailyLogText,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),date:TODAY},...p]);setDailyLogText("");gainXP(5,"Entry logged 📓");e.preventDefault();}}}
            placeholder="Log a thought, win, or blocker... (Enter)" style={{flex:1,background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",color:T.bright,fontSize:12,...raj}}/>
          <button onClick={()=>{if(dailyLogText.trim()){setDailyLog(p=>[{id:Date.now(),text:dailyLogText,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),date:TODAY},...p]);setDailyLogText("");gainXP(5,"Entry logged 📓");}}} className="btn-tap" style={{padding:"8px 12px",background:T.green+"33",border:`1px solid ${T.green}55`,color:T.green,borderRadius:7,fontSize:11,...mono,cursor:"pointer"}}>ADD</button>
        </div>
        {dailyLog.slice(0,6).map((l,i)=>(
          <div key={l.id||i} style={{display:"flex",gap:8,alignItems:"flex-start",padding:"5px 0",borderBottom:i<Math.min(5,dailyLog.length-1)?`1px solid ${T.border}`:"none"}}>
            <span style={{fontSize:8,color:T.dim,...mono,marginTop:2,flexShrink:0}}>{l.time}</span>
            <span style={{flex:1,fontSize:11,color:T.text,lineHeight:1.5,...raj}}>→ {l.text}</span>
            <button onClick={()=>{setDailyLog(p=>p.filter((_,j)=>j!==i));takeXP(5,"Entry removed ↩");}} style={{background:"transparent",border:"none",color:T.muted,fontSize:14,cursor:"pointer",lineHeight:1}}>×</button>
          </div>
        ))}
        {dailyLog.length>6&&<div style={{fontSize:9,color:T.muted,...mono,marginTop:6,textAlign:"center"}}>{dailyLog.length-6} older entries hidden</div>}
      </div>

      {/* ── PHASE OVERVIEW ── */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
        {[1,2,3,4].map(ph=>{
          const ws=WEEKS.filter(w=>w.phase===ph);
          const avg=ws.reduce((a,w)=>a+weekPct(w.week),0)/ws.length;
          const col=pc(ph);
          return(
            <div key={ph} className="hovlift" onClick={()=>setTab("plan")} style={{...C({padding:"12px",border:`1px solid ${col}33`,cursor:"pointer"})}}>
              <div style={{fontSize:8,color:col,letterSpacing:2,...mono}}>PHASE {ph}</div>
              <div style={{...orb,fontSize:16,fontWeight:900,color:T.bright,margin:"4px 0 6px"}}>{Math.round(avg)}%</div>
              <div style={{height:3,background:T.bg2,borderRadius:2,overflow:"hidden"}}><div style={{width:`${avg}%`,height:"100%",background:col,transition:"width .6s"}}/></div>
            </div>
          );
        })}
      </div>

      {/* ── WEEK AT A GLANCE ── */}
      <div style={{...C({padding:"12px 14px",marginBottom:10,border:`1px solid ${T.blue}22`})}}>
        <div style={{fontSize:9,color:T.blue,letterSpacing:2,...mono,marginBottom:10}}>📅 THIS WEEK AT A GLANCE</div>
        <div style={{display:"flex",gap:5}}>
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day,i)=>{
            const today=new Date().getDay();
            const dayNum=i===6?0:i+1;
            const isToday=today===dayNum;
            const isPast=today>dayNum||(today===0&&dayNum!==0);
            return(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{fontSize:7,color:isToday?T.blue:T.dim,...mono}}>{day}</div>
                <div style={{width:"100%",aspectRatio:"1",borderRadius:6,background:isToday?T.blue+"33":isPast?T.border+"88":T.bg2,border:`1px solid ${isToday?T.blue:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:isToday?`0 0 8px ${T.blue}44`:"none"}}>
                  {isToday&&<div style={{width:6,height:6,borderRadius:"50%",background:T.blue,boxShadow:`0 0 6px ${T.blue}`}}/>}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
          <span style={{fontSize:8,color:T.muted,...mono}}>WEEK {Math.ceil((new Date()-new Date(2026,2,20))/604800000)+1 > 0 && Math.ceil((new Date()-new Date(2026,2,20))/604800000)+1 <= 15 ? Math.ceil((new Date()-new Date(2026,2,20))/604800000)+1 : "—"} OF 15</span>
          <span style={{fontSize:8,color:T.green,...mono}}>PHASE {WEEKS.find(w=>w.week===activeWeek)?.phase||1} · {["FOUNDATION","IMPLEMENTATION","EXPERIMENTS","WRITING"][(WEEKS.find(w=>w.week===activeWeek)?.phase||1)-1]}</span>
        </div>
      </div>

      {/* ── TODAY'S WORKOUT ── */}
      <div className="hovlift" onClick={()=>setTab("body")} style={{...C({padding:"14px",cursor:"pointer",border:`1px solid ${DAYS[workoutDay-1].color}44`})}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:9,color:T.muted,letterSpacing:2,...mono}}>TODAY'S WORKOUT</div>
            <div style={{...orb,fontSize:14,fontWeight:700,color:T.bright,marginTop:3}}>{DAYS[workoutDay-1].icon} {DAYS[workoutDay-1].name}</div>
            <div style={{fontSize:11,color:T.muted,...raj,marginTop:2}}>{DAYS[workoutDay-1].sub}</div>
          </div>
          <Ring pct={dayPct(workoutDay)} size={58} stroke={5} color={DAYS[workoutDay-1].color} label={`${dayPct(workoutDay)}%`}/>
        </div>
      </div>
    </div>
  );};

  // ── PLAN ──
  const Plan=()=>{
    const w=WEEKS.find(x=>x.week===activeWeek);
    const col=pc(w.phase);
    const prog=weekPct(w.week);
    const Sect=({title,emoji,color:sc,items,cat})=>(
      <div style={{...C({padding:"14px",marginBottom:10,border:`1px solid ${sc}22`})}}>
        <div style={{fontSize:9,color:sc,letterSpacing:2,fontWeight:700,marginBottom:12,...mono}}>{emoji} {title}</div>
        {items.map((task,i)=>{
          const done=tDone(w.week,cat,i);
          const nk=`${w.week}-${cat}-${i}`;
          return(
            <div key={i} style={{marginBottom:i<items.length-1?10:0}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                <div onClick={()=>togT(w.week,cat,i)} style={{width:20,height:20,border:`1.5px solid ${done?sc:sc+"44"}`,borderRadius:4,flexShrink:0,marginTop:2,cursor:"pointer",background:done?sc+"33":"transparent",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:done?`0 0 8px ${sc}44`:"none",transition:"all .2s"}}>
                  {done&&<span style={{fontSize:11,color:sc,fontWeight:900}}>✓</span>}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,color:done?"#2a4a3a":T.text,lineHeight:1.6,textDecoration:done?"line-through":"none",...raj}}>{task}</div>
                  <button onClick={()=>setOpenNote(openNote===nk?null:nk)} style={{fontSize:10,color:taskNotes[nk]?T.gold:T.muted,background:"transparent",border:"none",cursor:"pointer",padding:"2px 0",...mono}}>
                    {taskNotes[nk]?"📝 note":"+ note"}
                  </button>
                  {openNote===nk&&(
                    <textarea value={taskNotes[nk]||""} onChange={e=>setTaskNotes(p=>({...p,[nk]:e.target.value}))}
                      placeholder="Notes, blockers, wins..."
                      style={{width:"100%",marginTop:5,background:T.bg2,border:`1px solid ${sc}33`,borderRadius:6,color:T.text,fontSize:11,padding:8,resize:"vertical",...mono,minHeight:50,boxSizing:"border-box"}}/>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
    return(
      <div style={{}}>
        <div style={{padding:"10px 16px",background:T.bg1,borderBottom:`1px solid ${T.border}`,overflowX:"auto"}}>
          <div style={{display:"flex",gap:4,minWidth:"max-content"}}>
            {WEEKS.map(wk=>{
              const wc=pc(wk.phase),ia=wk.week===activeWeek,wp=weekPct(wk.week);
              return(
                <div key={wk.week} onClick={()=>setActiveWeek(wk.week)} style={{padding:"5px 9px",borderRadius:7,border:ia?`1.5px solid ${wc}`:"1.5px solid transparent",background:ia?wc+"22":wp===100?wc+"11":"transparent",color:ia?wc:wp>0?wc+"88":T.muted,fontSize:11,cursor:"pointer",...orb,fontWeight:ia?700:400,textAlign:"center",minWidth:34,transition:"all .2s"}}>
                  <div>{wk.week}</div>{wp>0&&<div style={{fontSize:7,marginTop:1}}>{wp}%</div>}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{padding:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
            <div>
              <div style={{fontSize:8,color:col,letterSpacing:3,...mono,marginBottom:4}}>PHASE {w.phase} · {["FOUNDATION","IMPLEMENTATION","EXPERIMENTS","WRITING"][w.phase-1]}</div>
              <div style={{...orb,fontSize:22,fontWeight:900,color:T.bright}}>WEEK {w.week}</div>
              <div style={{fontSize:11,color:T.muted,marginTop:2,...raj}}>{w.dates}</div>
            </div>
            <Ring pct={prog} size={58} stroke={5} color={col} label={`${prog}%`}/>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:14}}>
            {[{l:"THESIS",t:"2h",c:T.green},{l:"CS PREP",t:"45m",c:T.blue},{l:"IELTS",t:"15m",c:T.gold},{l:"ADMIT",t:"∞",c:"#a855f7"}].map(x=>(
              <div key={x.l} style={{flex:1,background:x.c+"11",border:`1px solid ${x.c}22`,borderRadius:8,padding:"7px 4px",textAlign:"center"}}>
                <div style={{fontSize:8,color:x.c,letterSpacing:1,...mono}}>{x.l}</div>
                <div style={{...orb,fontSize:13,fontWeight:700,color:T.bright}}>{x.t}</div>
              </div>
            ))}
          </div>
          <Sect title="THESIS WORK" emoji="🧪" color={T.green} items={w.thesis} cat="thesis"/>
          <Sect title="CS EXAM PREP" emoji="💻" color={T.blue} items={w.csprep} cat="csprep"/>
          <Sect title="IELTS PREP" emoji="🌍" color={T.gold} items={w.ielts} cat="ielts"/>
          <Sect title="ADMISSION ACTIONS" emoji="🏛️" color="#a855f7" items={w.admission} cat="admission"/>
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            <div style={{flex:1,background:"#1a050a",border:`1px solid ${T.red}33`,borderRadius:10,padding:12}}>
              <div style={{fontSize:9,color:T.red,letterSpacing:2,marginBottom:5,...mono}}>⚠️ BLOCKER</div>
              <div style={{fontSize:11,color:"#ffaaaa",lineHeight:1.7,...raj}}>{w.blocker}</div>
            </div>
            <div style={{flex:1,background:col+"08",border:`1px solid ${col}33`,borderRadius:10,padding:12}}>
              <div style={{fontSize:9,color:col,letterSpacing:2,marginBottom:5,...mono}}>🏁 MILESTONE</div>
              <div style={{fontSize:11,color:T.text,lineHeight:1.7,...raj}}>{w.milestone}</div>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <button onClick={()=>activeWeek>1&&setActiveWeek(a=>a-1)} disabled={activeWeek===1} style={{padding:"9px 18px",borderRadius:8,border:`1px solid ${T.border}`,background:activeWeek===1?"transparent":T.bg2,color:activeWeek===1?T.muted:T.bright,fontSize:11,...mono,cursor:activeWeek===1?"not-allowed":"pointer"}}>← PREV</button>
            <span style={{fontSize:11,color:T.muted,alignSelf:"center",...orb}}>{activeWeek}/15</span>
            <button onClick={()=>activeWeek<15&&setActiveWeek(a=>a+1)} disabled={activeWeek===15} style={{padding:"9px 18px",borderRadius:8,border:`1px solid ${col}55`,background:col+"22",color:col,fontSize:11,...mono,cursor:activeWeek===15?"not-allowed":"pointer"}}>NEXT →</button>
          </div>
        </div>
      </div>
    );
  };

  // ── BODY ──
  // ── BODY STREAK EFFECT (at AppMain level so Body can be called as plain fn) ──
  const _bodyDp = dayPct(workoutDay);
  useEffect(()=>{
    if(_bodyDp===100){
      const today=new Date().toDateString();
      if(lastWO!==today){
        const yest=new Date(Date.now()-86400000).toDateString();
        setStreak(s=>lastWO===yest?s+1:1);
        setLastWO(today);
      }
    }
  },[_bodyDp]);

  const Body=()=>{
    const d=DAYS[workoutDay-1],dp=dayPct(workoutDay),allDone=dp===100;
    return(
      <div style={{}}>
        <div style={{padding:"10px 16px",background:T.bg1,borderBottom:`1px solid ${T.border}`,overflowX:"auto"}}>
          <div style={{display:"flex",gap:5,minWidth:"max-content"}}>
            {DAYS.map(day=>{const ia=day.day===workoutDay,pr=dayPct(day.day);return(
              <div key={day.day} onClick={()=>{setWorkoutDay(day.day);setTimer(null);setShowExForm(null);}} style={{padding:"8px 10px",borderRadius:8,border:ia?`1.5px solid ${day.color}`:`1px solid ${T.border}`,background:ia?day.color+"22":pr===100?day.color+"11":"transparent",cursor:"pointer",textAlign:"center",minWidth:50,transition:"all .2s"}}>
                <div style={{fontSize:14}}>{day.icon}</div>
                <div style={{fontSize:9,color:ia?day.color:T.muted,marginTop:2,...orb}}>D{day.day}</div>
                {pr>0&&<div style={{fontSize:8,color:day.color+"99"}}>{pr}%</div>}
              </div>
            );})}
          </div>
        </div>
        <div style={{padding:16}}>
          {/* Day header */}
          <div style={{...C({padding:"16px",marginBottom:10,border:`1px solid ${d.color}44`})}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                  <div style={{fontSize:9,color:T.muted,letterSpacing:2,...mono}}>DAY {d.day} MISSION</div>
                  <div style={{fontSize:8,background:d.level?.includes("INTERMEDIATE")?T.orange+"22":d.level==="ESSENTIAL"?T.gold+"22":T.green+"22",border:`1px solid ${d.level?.includes("INTERMEDIATE")?T.orange:d.level==="ESSENTIAL"?T.gold:T.green}44`,color:d.level?.includes("INTERMEDIATE")?T.orange:d.level==="ESSENTIAL"?T.gold:T.green,padding:"2px 7px",borderRadius:20,...mono}}>
                    {d.level||"BEGINNER"}
                  </div>
                </div>
                <div style={{...orb,fontSize:17,fontWeight:900,...gt(d.color),marginTop:2}}>{d.icon} {d.name}</div>
                <div style={{fontSize:11,color:T.muted,...raj,marginTop:3}}>{d.sub}</div>
                {d.focus&&<div style={{fontSize:11,color:d.color+"cc",marginTop:6,...raj,fontStyle:"italic",borderLeft:`2px solid ${d.color}44`,paddingLeft:8}}>"{d.focus}"</div>}
                {streak>0&&<div style={{fontSize:11,color:T.gold,marginTop:6,...mono}}>🔥 {streak}-day streak</div>}
              </div>
              <div style={{textAlign:"center",flexShrink:0,marginLeft:10}}>
                <Ring pct={dp} size={68} stroke={6} color={d.color} label={`${dp}%`}/>
                {allDone&&<div style={{fontSize:10,color:d.color,marginTop:4,animation:"popIn .4s",...mono}}>DONE! ✓</div>}
              </div>
            </div>
          </div>

          {/* Beginner tip banner */}
          {d.level!=="ESSENTIAL"&&(
            <div style={{...C({padding:"10px 12px",marginBottom:10,background:"#0a1000",border:`1px solid ${T.green}33`})}}>
              <div style={{fontSize:9,color:T.green,letterSpacing:2,...mono,marginBottom:4}}>💡 BEGINNER GUIDE</div>
              <div style={{fontSize:11,color:T.muted,...raj,lineHeight:1.6}}>
                Tap any exercise card to see <span style={{color:T.green}}>WHY you're doing it</span>, <span style={{color:T.orange}}>beginner modifications</span>, and <span style={{color:T.blue}}>form cues</span>. Quality beats quantity every time. If you can't do the listed reps — do less with perfect form.
              </div>
            </div>
          )}

          {/* Rest timer */}
          {timer&&(
            <div style={{...C({padding:"16px",marginBottom:12,border:`1px solid ${T.orange}44`,textAlign:"center"})}}>
              <div style={{fontSize:10,color:T.orange,letterSpacing:2,marginBottom:8,...mono}}>⏱ REST PERIOD</div>
              <RestTimer seconds={timer.seconds} onDone={()=>setTimer(null)}/>
            </div>
          )}

          {/* Warmup */}
          {d.warmup.length>0&&(
            <div style={{...C({padding:"14px",marginBottom:10,border:`1px solid ${T.gold}22`})}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div>
                  <div style={{fontSize:9,color:T.gold,letterSpacing:2,fontWeight:700,...mono}}>🌅 WARMUP — NEVER SKIP THIS</div>
                  <div style={{fontSize:9,color:T.muted,...mono,marginTop:2}}>Cold muscles tear. Warm muscles grow.</div>
                </div>
                <button onClick={()=>setWarmupDone(p=>({...p,[workoutDay]:!p[workoutDay]}))} style={{fontSize:10,color:warmupDone[workoutDay]?T.gold:T.muted,background:warmupDone[workoutDay]?T.gold+"22":"transparent",border:`1px solid ${warmupDone[workoutDay]?T.gold:T.muted}33`,borderRadius:20,padding:"3px 10px",cursor:"pointer",...mono,flexShrink:0}}>
                  {warmupDone[workoutDay]?"✓ DONE":"MARK DONE"}
                </button>
              </div>
              {d.warmup.map((wu,i)=><div key={i} style={{fontSize:12,color:warmupDone[workoutDay]?"#2a4a3a":T.text,marginBottom:6,textDecoration:warmupDone[workoutDay]?"line-through":"none",...raj}}>→ {wu}</div>)}
            </div>
          )}

          {/* Exercises */}
          {d.exercises.map((ex,ei)=>{
            const ep=exPct(workoutDay,ex),exDone=ep===100;
            const isExpanded=showExForm===ex.id;
            return(
              <div key={ex.id} style={{...C({padding:"14px",marginBottom:10,border:`1px solid ${exDone?d.color+"55":T.border}`,background:exDone?d.color+"06":T.bg1,transition:"all .3s"})}}>
                {/* Exercise header */}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                      <span style={{fontSize:13,color:exDone?d.color:T.bright,fontWeight:700,...raj}}>{ei+1}. {ex.name}</span>
                      {exDone&&<span style={{animation:"popIn .3s"}}>✅</span>}
                    </div>
                    <div style={{fontSize:11,color:T.muted,...mono}}>{ex.sets} sets × {ex.reps}{ex.rest>0?` · Rest ${ex.rest}s`:""}</div>
                    {/* Main tip */}
                    <div style={{fontSize:11,color:d.color+"cc",marginTop:5,...raj,lineHeight:1.5}}>💡 {ex.tip}</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:5,alignItems:"center",flexShrink:0,marginLeft:8}}>
                    <Ring pct={ep} size={40} stroke={3} color={d.color} label={`${ep}%`}/>
                    <button onClick={()=>setShowExForm(isExpanded?null:ex.id)} style={{fontSize:8,padding:"3px 8px",background:isExpanded?T.blue+"22":"transparent",border:`1px solid ${T.blue}44`,color:T.blue,borderRadius:6,cursor:"pointer",...mono,whiteSpace:"nowrap"}}>
                      {isExpanded?"LESS ▲":"HOW? ▼"}
                    </button>
                  </div>
                </div>

                {/* Expandable beginner info */}
                {isExpanded&&(
                  <div style={{marginBottom:12,borderTop:`1px solid ${T.border}`,paddingTop:12,animation:"fadeUp .2s ease"}}>
                    {ex.why&&(
                      <div style={{background:"#051a0a",border:`1px solid ${T.green}33`,borderRadius:8,padding:"9px 12px",marginBottom:8}}>
                        <div style={{fontSize:8,color:T.green,letterSpacing:2,...mono,marginBottom:4}}>✅ WHY THIS EXERCISE</div>
                        <div style={{fontSize:11,color:T.text,...raj,lineHeight:1.6}}>{ex.why}</div>
                      </div>
                    )}
                    {ex.mod&&(
                      <div style={{background:"#1a0e05",border:`1px solid ${T.orange}33`,borderRadius:8,padding:"9px 12px",marginBottom:8}}>
                        <div style={{fontSize:8,color:T.orange,letterSpacing:2,...mono,marginBottom:4}}>🔧 MODIFICATION / SCALING</div>
                        <div style={{fontSize:11,color:"#ffcc88",...raj,lineHeight:1.6}}>{Array.isArray(ex.mod)?ex.mod.join(" · "):ex.mod}</div>
                      </div>
                    )}
                    {ex.form&&ex.form.length>0&&(
                      <div style={{background:"#05080f",border:`1px solid ${T.blue}33`,borderRadius:8,padding:"9px 12px"}}>
                        <div style={{fontSize:8,color:T.blue,letterSpacing:2,...mono,marginBottom:8}}>📐 FORM CHECKLIST</div>
                        {ex.form.map((f,i)=>(
                          <div key={i} style={{display:"flex",gap:8,marginBottom:6,alignItems:"flex-start"}}>
                            <div style={{width:16,height:16,borderRadius:"50%",background:T.blue+"22",border:`1px solid ${T.blue}44`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:8,color:T.blue,...orb,marginTop:1}}>{i+1}</div>
                            <div style={{fontSize:11,color:T.text,...raj,lineHeight:1.5}}>{f}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Set buttons */}
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {Array.from({length:ex.sets},(_,si)=>{
                    const sd=isSetDone(workoutDay,ex.id,si);
                    return(
                      <button key={si} className="btn-tap" onClick={()=>{togSet(workoutDay,ex.id,si);if(!sd&&ex.rest>0&&si<ex.sets-1)setTimer({seconds:ex.rest});}} style={{padding:"8px 16px",borderRadius:7,cursor:"pointer",...orb,fontSize:10,fontWeight:700,transition:"all .2s",border:`1.5px solid ${sd?d.color:T.border}`,background:sd?d.color+"33":T.bg2,color:sd?d.color:T.muted,boxShadow:sd?`0 0 8px ${d.color}44`:"none"}}>
                        {sd?"✓ ":""}SET {si+1}
                      </button>
                    );
                  })}
                </div>

                {/* Rest time indicator */}
                {ex.rest>0&&<div style={{fontSize:9,color:T.dim,marginTop:6,...mono}}>⏱ {ex.rest}s rest between sets — don't skip it as a beginner, your joints need it</div>}
              </div>
            );
          })}

          {/* Cooldown */}
          {d.cooldown.length>0&&(
            <div style={{...C({padding:"14px",marginTop:4,border:`1px solid ${T.blue}22`})}}>
              <div style={{fontSize:9,color:T.blue,letterSpacing:2,fontWeight:700,marginBottom:4,...mono}}>🌊 COOLDOWN — REQUIRED</div>
              <div style={{fontSize:9,color:T.muted,...mono,marginBottom:10}}>Skipping cooldown = soreness tomorrow + slower recovery. 5 min only.</div>
              {d.cooldown.map((c,i)=><div key={i} style={{fontSize:12,color:T.text,marginBottom:5,...raj}}>→ {c}</div>)}
            </div>
          )}

          {/* Nutrition */}
          <div style={{...C({padding:"14px",marginTop:10,border:`1px solid ${T.pink}22`})}}>
            <div style={{fontSize:9,color:T.pink,letterSpacing:2,fontWeight:700,marginBottom:4,...mono}}>🍽️ NUTRITION: 2,800–3,200 cal/day</div>
            <div style={{fontSize:9,color:T.muted,...mono,marginBottom:10}}>You're 50kg. You need a CALORIC SURPLUS to gain weight. Don't miss meals.</div>
            <div style={{display:"flex",overflowX:"auto",gap:8,paddingBottom:4}}>
              {MEALS.map((m,i)=>(
                <div key={i} style={{background:m.color+"11",border:`1px solid ${m.color}33`,borderRadius:8,padding:"10px 12px",minWidth:138,flexShrink:0}}>
                  <div style={{fontSize:9,color:m.color,fontWeight:700,...mono}}>{m.time}</div>
                  <div style={{fontSize:11,color:T.bright,marginTop:3,lineHeight:1.4,...raj}}>{m.foods}</div>
                  <div style={{...orb,fontSize:11,color:m.color,marginTop:4,fontWeight:700}}>{m.cal} cal</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── ME (PROFILE) ──
  const Me=()=>(
    <div style={{padding:16,}}>
      <div style={{...C({padding:"20px",marginBottom:12,background:"linear-gradient(135deg,#020d08,#031525,#020408)",border:`1px solid ${T.green}44`,position:"relative",overflow:"hidden"})}}>
        <div style={{position:"absolute",top:0,right:0,width:100,height:100,background:`radial-gradient(circle at top right,${T.green}18,transparent 70%)`,pointerEvents:"none"}}/>
        <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
          <div style={{width:60,height:60,borderRadius:"50%",background:`linear-gradient(135deg,${T.green}44,${T.blue}44)`,border:`2px solid ${T.green}66`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>⚔️</div>
          <div style={{flex:1}}>
            <div style={{...orb,fontSize:22,fontWeight:900,...gt(T.green)}}>{PROFILE.name}</div>
            <div style={{fontSize:12,color:T.muted,marginTop:2,...raj}}>{PROFILE.title}</div>
            <div style={{fontSize:11,color:T.dim,marginTop:4,...mono}}>{PROFILE.university}</div>
          </div>
        </div>
        <div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${T.border}`}}>
          <div style={{fontSize:10,color:T.muted,letterSpacing:2,...mono,marginBottom:6}}>THESIS MISSION</div>
          <div style={{fontSize:11,color:T.text,lineHeight:1.7,...raj}}>{PROFILE.thesis}</div>
          <div style={{fontSize:11,color:T.dim,marginTop:6,...mono}}>Supervisor: {PROFILE.supervisor}</div>
        </div>
      </div>

      <div style={{...C({padding:"16px",marginBottom:12,background:"linear-gradient(135deg,#030810,#051020)",border:`1px solid ${T.blue}44`})}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:9,color:T.blue,letterSpacing:2,...mono}}>⚡ DAILY FUEL</div>
          <div style={{fontSize:9,color:T.muted,...mono}}>{quoteIdx+1}/{PROFILE.quotes.length}</div>
        </div>
        <div key={quoteIdx} style={{fontSize:13,color:T.bright,lineHeight:1.9,...raj,fontStyle:"italic",borderLeft:`3px solid ${T.green}`,paddingLeft:14,animation:"quoteFade .5s ease"}}>
          "{PROFILE.quotes[quoteIdx]}"
        </div>
        <div style={{display:"flex",gap:8,marginTop:12}}>
          <button onClick={()=>setQuoteIdx(q=>(q-1+PROFILE.quotes.length)%PROFILE.quotes.length)} className="btn-tap" style={{padding:"6px 14px",background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:7,fontSize:10,cursor:"pointer",...mono}}>← PREV</button>
          <button onClick={()=>setQuoteIdx(q=>(q+1)%PROFILE.quotes.length)} className="btn-tap" style={{flex:1,padding:"6px 14px",background:T.blue+"22",border:`1px solid ${T.blue}44`,color:T.blue,borderRadius:7,fontSize:10,cursor:"pointer",...mono}}>NEXT QUOTE →</button>
        </div>
      </div>

      <div style={{...C({padding:"14px 16px",marginBottom:12})}}>
        <div style={{fontSize:9,color:T.muted,letterSpacing:2,...mono,marginBottom:14}}>ACADEMIC RECORD</div>
        {PROFILE.academics.map((a,i)=>(
          <div key={i} style={{display:"flex",gap:12,alignItems:"center",marginBottom:i<PROFILE.academics.length-1?12:0}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:i===PROFILE.academics.length-1?T.green:T.green+"66",boxShadow:i===PROFILE.academics.length-1?`0 0 8px ${T.green}`:"none",flexShrink:0}}/>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{...orb,fontSize:13,fontWeight:700,color:i===PROFILE.academics.length-1?T.green:T.bright}}>{a.level}</div>
                <div style={{...orb,fontSize:12,color:T.gold,fontWeight:700}}>{a.gpa}</div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
                <div style={{fontSize:10,color:T.muted,...mono}}>{a.year}</div>
                <div style={{fontSize:9,background:T.gold+"22",border:`1px solid ${T.gold}33`,color:T.gold,padding:"1px 7px",borderRadius:20,...mono}}>{a.badge}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{...C({padding:"14px 16px",marginBottom:12})}}>
        <div style={{fontSize:9,color:T.muted,letterSpacing:2,...mono,marginBottom:14}}>SKILL LOADOUT</div>
        {PROFILE.skills.map((sk,i)=>(
          <div key={i} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span style={{fontSize:14}}>{sk.icon}</span>
                <span style={{fontSize:12,color:T.bright,...raj,fontWeight:600}}>{sk.name}</span>
                <span style={{fontSize:9,color:T.muted,...mono}}>{sk.note}</span>
              </div>
              <span style={{...orb,fontSize:11,color:sk.level>80?T.green:sk.level>50?T.orange:T.blue}}>{sk.level}%</span>
            </div>
            <div style={{height:4,background:T.bg2,borderRadius:2,overflow:"hidden"}}>
              <div style={{width:`${sk.level}%`,height:"100%",background:sk.level>80?T.green:sk.level>50?T.orange:T.blue,boxShadow:`0 0 6px ${sk.level>80?T.green:sk.level>50?T.orange:T.blue}55`,borderRadius:2,transition:"width .8s"}}/>
            </div>
          </div>
        ))}
      </div>

      <div style={{...C({padding:"14px 16px",marginBottom:12})}}>
        <div style={{fontSize:9,color:T.muted,letterSpacing:2,...mono,marginBottom:14}}>THE COMEBACK STORY</div>
        {PROFILE.story.map((s,i)=>(
          <div key={i} style={{display:"flex",gap:12,marginBottom:i<PROFILE.story.length-1?14:0}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:s.type==="win"?T.green:s.type==="rise"?T.blue:T.red,boxShadow:`0 0 6px ${s.type==="win"?T.green:s.type==="rise"?T.blue:T.red}88`}}/>
              {i<PROFILE.story.length-1&&<div style={{width:1,flex:1,marginTop:4,background:T.border}}/>}
            </div>
            <div style={{paddingBottom:i<PROFILE.story.length-1?4:0}}>
              <div style={{fontSize:9,color:T.muted,...mono,marginBottom:3}}>{s.year}</div>
              <div style={{fontSize:12,color:s.type==="win"?T.green:s.type==="rise"?T.blue:"#ffaaaa",...raj,lineHeight:1.5}}>{s.event}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{...C({padding:"14px 16px",marginBottom:12})}}>
        <div style={{fontSize:9,color:T.muted,letterSpacing:2,...mono,marginBottom:14}}>DREAMS LOCKED AND LOADED</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {PROFILE.dreams.map((d,i)=>(
            <div key={i} style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 12px"}}>
              <div style={{fontSize:20,marginBottom:4}}>{d.icon}</div>
              <div style={{fontSize:12,color:T.bright,...raj,fontWeight:600}}>{d.dream}</div>
              <div style={{fontSize:9,color:T.muted,...mono,marginTop:3}}>{d.tag}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{...C({padding:"14px 16px",marginBottom:12,border:`1px solid ${T.gold}33`})}}>
        <div style={{fontSize:9,color:T.gold,letterSpacing:2,...mono,marginBottom:14}}>🏆 HALL OF ACHIEVEMENTS</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {PROFILE.achievements.map((a,i)=>(
            <div key={i} style={{background:a.color+"0d",border:`1px solid ${a.color}33`,borderRadius:10,padding:"10px 12px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                <span style={{fontSize:20}}>{a.icon}</span>
                <span style={{fontSize:8,color:a.color,...mono,background:a.color+"22",padding:"2px 6px",borderRadius:10}}>{a.year}</span>
              </div>
              <div style={{fontSize:11,color:T.bright,fontWeight:700,...raj,lineHeight:1.3}}>{a.title}</div>
              <div style={{fontSize:9,color:T.muted,...mono,marginTop:3}}>{a.org}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{...C({padding:"14px 16px"})}}>
        <div style={{fontSize:9,color:T.muted,letterSpacing:2,...mono,marginBottom:14}}>MSc TARGET UNIVERSITIES</div>
        {PROFILE.targets.map((t,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:10,marginBottom:10,borderBottom:i<PROFILE.targets.length-1?`1px solid ${T.border}`:"none"}}>
            <span style={{fontSize:13,color:T.bright,...raj,fontWeight:600}}>{t.uni}</span>
            <span style={{background:t.color+"22",border:`1px solid ${t.color}33`,color:t.color,fontSize:9,padding:"2px 8px",borderRadius:20,...mono}}>{t.status}</span>
          </div>
        ))}
      </div>

      {/* ── SETTINGS ── */}
      <div style={{...C({padding:"14px 16px",marginTop:10,border:`1px solid ${T.pink}22`})}}>
        <div style={{fontSize:9,color:T.pink,letterSpacing:2,...mono,marginBottom:14}}>⚙️ SETTINGS</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:12,marginBottom:12,borderBottom:`1px solid ${T.border}`}}>
          <div>
            <div style={{fontSize:13,color:T.bright,...raj,fontWeight:600}}>🔐 App PIN</div>
            <div style={{fontSize:10,color:T.muted,...mono,marginTop:2}}>Stored in Firebase · syncs across all devices</div>
          </div>
          <button onClick={()=>setShowChangePin(true)} className="btn-tap" style={{padding:"7px 14px",background:T.pink+"22",border:`1px solid ${T.pink}44`,color:T.pink,borderRadius:8,fontSize:10,...mono,cursor:"pointer"}}>CHANGE PIN</button>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:13,color:T.bright,...raj,fontWeight:600}}>☁️ Firebase Sync</div>
            <div style={{fontSize:10,color:T.green,...mono,marginTop:2}}>✓ Connected — auto-saves every 3 seconds</div>
          </div>
          <div style={{width:8,height:8,borderRadius:"50%",background:T.green,boxShadow:`0 0 8px ${T.green}`}}/>
        </div>
      </div>
    </div>
  );

  // ── PROGRESS ──
  const Progress=()=>{
    const chartH=110,chartW=300;
    const maxW=Math.max(...weightLog.map(w=>w.weight),61);
    const minW=Math.min(...weightLog.map(w=>w.weight),49);
    const wRange=Math.max(maxW-minW,1);
    const pts=weightLog.map((w,i)=>({
      x:weightLog.length===1?chartW/2:i*(chartW/(weightLog.length-1)),
      y:chartH-((w.weight-minW)/wRange)*(chartH*0.8)-10,
      weight:w.weight,date:w.date
    }));
    const pathD=pts.length>1?pts.map((p,i)=>i===0?`M${p.x.toFixed(1)},${p.y.toFixed(1)}`:`L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" "):`M${chartW/2},${chartH/2}`;
    const fillD=pts.length>1?`${pathD} L${pts[pts.length-1].x},${chartH} L${pts[0].x},${chartH} Z`:"";
    const goalY=chartH-((60-minW)/wRange)*(chartH*0.8)-10;

    return(
      <div style={{padding:16,}}>
        <div style={{...orb,fontSize:16,fontWeight:900,color:T.bright,marginBottom:4}}>PROGRESS COMMAND</div>
        <div style={{fontSize:11,color:T.muted,marginBottom:16,...raj}}>Real-time tracking across all battle fronts</div>

        <div style={{...C({padding:"16px",marginBottom:12})}}>
          <div style={{fontSize:9,color:T.muted,letterSpacing:2,...mono,marginBottom:14}}>MISSION OVERVIEW</div>
          <div style={{display:"flex",justifyContent:"space-around",alignItems:"center"}}>
            {[{pct:tp,color:T.green,label:`${tp}%`,sub:"THESIS"},{pct:wPct,color:T.pink,label:`${wPct}%`,sub:"BODY"},{pct:sPct,color:T.gold,label:`${sPct}%`,sub:"QUIT"},{pct:Math.min(100,streak*10),color:T.orange,label:`${streak}d`,sub:"STREAK"}].map((r,i)=>(
              <div key={i} style={{textAlign:"center"}}>
                <Ring pct={r.pct} size={70} stroke={6} color={r.color} label={r.label} sublabel={r.sub}/>
              </div>
            ))}
          </div>
        </div>

        <div style={{...C({padding:"16px",marginBottom:12})}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div>
              <div style={{fontSize:9,color:T.muted,letterSpacing:2,...mono}}>WEIGHT TRACKER</div>
              <div style={{...orb,fontSize:18,fontWeight:900,...gt(T.pink),marginTop:2}}>{curWeight} kg</div>
              <div style={{fontSize:10,color:T.pink,...mono}}>+{wGained}kg gained · Target: 60kg</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:9,color:T.muted,...mono}}>REMAINING</div>
              <div style={{...orb,fontSize:18,fontWeight:900,color:T.muted}}>{Math.max(0,60-curWeight).toFixed(1)}kg</div>
            </div>
          </div>
          <div style={{overflowX:"auto",marginBottom:12}}>
            <svg width={chartW} height={chartH+10} style={{display:"block"}}>
              <defs>
                <linearGradient id="wfill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={T.pink} stopOpacity="0.35"/>
                  <stop offset="100%" stopColor={T.pink} stopOpacity="0.02"/>
                </linearGradient>
              </defs>
              {[0.25,0.5,0.75].map((f,i)=>(
                <line key={i} x1="0" y1={chartH*f} x2={chartW} y2={chartH*f} stroke={T.border} strokeWidth="1"/>
              ))}
              {goalY>0&&goalY<chartH&&(
                <>
                  <line x1="0" y1={goalY} x2={chartW} y2={goalY} stroke={T.green} strokeWidth="1" strokeDasharray="4,4" opacity="0.5"/>
                  <text x={chartW-32} y={goalY-4} fontSize="9" fill={T.green} opacity="0.7">60kg</text>
                </>
              )}
              {fillD&&<path d={fillD} fill="url(#wfill)"/>}
              {pts.length>1&&<path d={pathD} fill="none" stroke={T.pink} strokeWidth="2" strokeLinecap="round" style={{filter:`drop-shadow(0 0 4px ${T.pink}66)`}}/>}
              {pts.map((p,i)=>(
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r={4} fill={T.pink} stroke={T.bg1} strokeWidth="2" style={{filter:`drop-shadow(0 0 3px ${T.pink})`}}/>
                  <text x={p.x} y={p.y-8} textAnchor="middle" fontSize="9" fill={T.text}>{p.weight}</text>
                </g>
              ))}
            </svg>
          </div>
          <div style={{display:"flex",gap:8}}>
            <input value={newWeight} onChange={e=>setNewWeight(e.target.value)} type="number" placeholder="Log weight (kg)" style={{flex:1,background:T.bg2,border:`1px solid ${T.border}`,borderRadius:8,padding:"9px 12px",color:T.bright,fontSize:12,...mono}}/>
            <button onClick={()=>{const v=parseFloat(newWeight);if(!isNaN(v)&&v>0){setWeightLog(l=>[...l,{date:`Day ${l.length+1}`,weight:v}]);setNewWeight("");gainXP(8,"Weight logged 📊","weight_log",true);}}} style={{padding:"9px 16px",background:T.pink+"33",border:`1px solid ${T.pink}55`,color:T.pink,borderRadius:8,fontSize:11,cursor:"pointer",...mono}}>LOG</button>
          </div>
          {weightLog.length>1&&(
            <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:4,maxHeight:140,overflowY:"auto"}}>
              {weightLog.slice(1).map((w,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,background:T.bg2,border:`1px solid ${T.border}`,borderRadius:6,padding:"5px 10px"}}>
                  <span style={{fontSize:9,color:T.muted,...mono,flexShrink:0}}>{w.date}</span>
                  <span style={{flex:1,...orb,fontSize:12,color:T.pink,fontWeight:700}}>{w.weight} kg</span>
                  <button onClick={()=>{
                    setWeightLog(l=>l.filter((_,j)=>j!==i+1));
                    takeXP(8,"Weight entry removed ↩","weight_log");
                  }} style={{background:"transparent",border:"none",color:T.muted,fontSize:14,cursor:"pointer",lineHeight:1,padding:"0 2px"}}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{...C({padding:"14px",marginBottom:12})}}>
          <div style={{fontSize:9,color:T.muted,letterSpacing:2,...mono,marginBottom:12}}>BODY MEASUREMENTS (cm)</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[{k:"chest",label:"Chest",icon:"💪"},{k:"waist",label:"Waist",icon:"⬛"},{k:"bicep",label:"Bicep",icon:"🦾"},{k:"neck",label:"Neck",icon:"🔵"}].map(m=>(
              <div key={m.k} style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:8,padding:10}}>
                <div style={{fontSize:10,color:T.muted,...mono,marginBottom:6}}>{m.icon} {m.label}</div>
                <input value={measurements[m.k]} onChange={e=>setMeasurements(p=>({...p,[m.k]:e.target.value}))} placeholder="— cm" style={{width:"100%",background:"transparent",border:"none",borderBottom:`1px solid ${T.border}`,color:T.bright,fontSize:15,padding:"2px 0",...orb,fontWeight:700}}/>
              </div>
            ))}
          </div>
        </div>

        <div style={{...C({padding:"14px",marginBottom:12})}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div>
              <div style={{fontSize:9,color:T.muted,letterSpacing:2,...mono}}>🚭 SMOKING TRACKER</div>
              <div style={{...orb,fontSize:18,fontWeight:900,color:curSmoke===0?T.green:T.orange,marginTop:2}}>{curSmoke===0?"QUIT 🎉":`${curSmoke}/day`}</div>
            </div>
            <Ring pct={sPct} size={52} stroke={4} color={curSmoke===0?T.green:T.orange} label={`${sPct}%`} sublabel="to quit"/>
          </div>
          <div style={{height:6,background:T.bg2,borderRadius:3,overflow:"hidden",marginBottom:6}}>
            <div style={{width:`${sPct}%`,height:"100%",background:`linear-gradient(90deg,${T.red},${T.orange},${T.green})`,borderRadius:3,transition:"width .5s"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
            <span style={{fontSize:9,color:T.muted,...mono}}>10/day start</span>
            <span style={{fontSize:9,color:T.green,...mono}}>0/day goal</span>
          </div>
          <div style={{display:"flex",gap:8}}>
            <input value={newSmoke} onChange={e=>setNewSmoke(e.target.value)} type="number" placeholder="Today's count" style={{flex:1,background:T.bg2,border:`1px solid ${T.border}`,borderRadius:8,padding:"9px 12px",color:T.bright,fontSize:12,...mono}}/>
            <button onClick={()=>{const v=parseInt(newSmoke);if(!isNaN(v)){const prev=curSmoke;setSmokingLog(l=>[...l,{date:`Day ${l.length+1}`,count:Math.max(0,v)}]);setNewSmoke("");if(v<prev)gainXP(15,"Reduced smoking 🚭","smoking_reduce",true);}}} style={{padding:"9px 16px",background:T.orange+"33",border:`1px solid ${T.orange}55`,color:T.orange,borderRadius:8,fontSize:11,cursor:"pointer",...mono}}>LOG</button>
          </div>
          {smokingLog.length>1&&(
            <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:4,maxHeight:120,overflowY:"auto"}}>
              {smokingLog.slice(1).map((s,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,background:T.bg2,border:`1px solid ${T.border}`,borderRadius:6,padding:"5px 10px"}}>
                  <span style={{fontSize:9,color:T.muted,...mono,flexShrink:0}}>{s.date}</span>
                  <span style={{flex:1,...orb,fontSize:12,color:s.count===0?T.green:T.orange,fontWeight:700}}>{s.count===0?"QUIT 🎉":`${s.count}/day`}</span>
                  <button onClick={()=>{
                    setSmokingLog(l=>l.filter((_,j)=>j!==i+1));
                    takeXP(15,"Smoking entry removed ↩","smoking_reduce");
                  }} style={{background:"transparent",border:"none",color:T.muted,fontSize:14,cursor:"pointer",lineHeight:1,padding:"0 2px"}}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{...C({padding:"14px"})}}>
          <div style={{fontSize:9,color:T.muted,letterSpacing:2,...mono,marginBottom:12}}>WEEKLY BATTLE GRID</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:5}}>
            {WEEKS.map(w=>{
              const p=weekPct(w.week),col=pc(w.phase);
              return(
                <div key={w.week} onClick={()=>{setTab("plan");setActiveWeek(w.week);}} style={{cursor:"pointer",textAlign:"center"}}>
                  <div style={{width:"100%",aspectRatio:"1",borderRadius:8,background:p===100?col+"44":p>0?col+"22":T.bg2,border:`1px solid ${p>0?col+"55":T.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",transition:"all .2s"}}>
                    <div style={{...orb,fontSize:11,fontWeight:700,color:p>0?col:T.muted}}>W{w.week}</div>
                    <div style={{fontSize:9,color:p===100?col:T.muted,...mono,marginTop:2}}>{p}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ── TASKS + NOTES ──
  const TasksNotes=()=>{
    const cats=["Study","Thesis","Personal","Health","Admission","Other"];
    const prioColors={High:T.red,Medium:T.orange,Low:T.green};
    const noteColors=[T.green,T.blue,T.orange,T.pink,T.gold,T.cyan];
    const filtered=myTasks.filter(t=>taskFilter==="All"||(taskFilter==="Done"?t.done:taskFilter==="Active"?!t.done:t.cat===taskFilter));
    const addTask=()=>{
      if(!newTask.title.trim())return;
      setMyTasks(p=>[...p,{id:Date.now(),title:newTask.title,cat:newTask.cat,priority:newTask.priority,due:newTask.due,done:false,created:new Date().toLocaleDateString()}]);
      gainXP(5,"Task created 📋");
      setNewTask({title:"",cat:"Study",priority:"Medium",due:""});
      setShowAddTask(false);
    };
    const activeNoteObj=notes.find(x=>x.id===activeNoteId);
    return(
      <div style={{}}>
        <div style={{display:"flex",background:T.bg1,borderBottom:`1px solid ${T.border}`,overflowX:"auto"}}>
          {[{id:"tasks",label:"✅ TASKS"},{id:"matrix",label:"🎯 MATRIX"},{id:"notes",label:"📝 NOTES"},{id:"research",label:"🧪 RESEARCH"}].map(st=>(
            <div key={st.id} onClick={()=>setTaskSubTab(st.id)} style={{flex:1,padding:"11px 4px",textAlign:"center",cursor:"pointer",borderBottom:taskSubTab===st.id?`2px solid ${T.green}`:"2px solid transparent",background:taskSubTab===st.id?"#00ff8808":"transparent",fontSize:11,color:taskSubTab===st.id?T.green:T.muted,...mono,letterSpacing:.5,transition:"all .2s",minWidth:60,whiteSpace:"nowrap"}}>
              {st.label}
            </div>
          ))}
        </div>

        {taskSubTab==="tasks"&&(
          <div style={{padding:16}}>
            <button onClick={()=>setShowAddTask(!showAddTask)} className="btn-tap" style={{width:"100%",padding:"11px",background:T.green+"22",border:`1px solid ${T.green}44`,color:T.green,borderRadius:10,fontSize:12,...mono,cursor:"pointer",marginBottom:12,letterSpacing:1}}>
              {showAddTask?"✕ CANCEL":"+ ADD NEW TASK"}
            </button>
            {showAddTask&&(
              <div style={{...C({padding:"16px",marginBottom:12,border:`1px solid ${T.green}44`})}}>
                <input value={newTask.title} onChange={e=>setNewTask(p=>({...p,title:e.target.value}))} placeholder="Task title..." style={{width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 12px",color:T.bright,fontSize:13,...raj,marginBottom:10,boxSizing:"border-box"}}/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                  <select value={newTask.cat} onChange={e=>setNewTask(p=>({...p,cat:e.target.value}))} style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 10px",color:T.text,fontSize:11,...mono}}>
                    {cats.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                  <select value={newTask.priority} onChange={e=>setNewTask(p=>({...p,priority:e.target.value}))} style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 10px",color:T.text,fontSize:11,...mono}}>
                    {["High","Medium","Low"].map(p2=><option key={p2} value={p2}>{p2}</option>)}
                  </select>
                </div>
                <input value={newTask.due} onChange={e=>setNewTask(p=>({...p,due:e.target.value}))} type="date" style={{width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 12px",color:T.text,fontSize:11,...mono,marginBottom:10,boxSizing:"border-box"}}/>
                <button onClick={addTask} className="btn-tap" style={{width:"100%",padding:"10px",background:T.green+"33",border:`1px solid ${T.green}55`,color:T.green,borderRadius:8,fontSize:12,...mono,cursor:"pointer"}}>CREATE TASK</button>
              </div>
            )}
            <div style={{display:"flex",gap:5,overflowX:"auto",marginBottom:12,paddingBottom:4}}>
              {["All","Active","Done","Study","Thesis","Personal","Health","Admission"].map(f=>(
                <button key={f} onClick={()=>setTaskFilter(f)} style={{padding:"5px 10px",borderRadius:20,border:`1px solid ${taskFilter===f?T.green:T.border}`,background:taskFilter===f?T.green+"22":"transparent",color:taskFilter===f?T.green:T.muted,fontSize:10,cursor:"pointer",...mono,whiteSpace:"nowrap",transition:"all .2s"}}>{f}</button>
              ))}
            </div>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              {[{l:"TOTAL",v:myTasks.length,c:T.blue},{l:"ACTIVE",v:myTasks.filter(t=>!t.done).length,c:T.orange},{l:"DONE",v:myTasks.filter(t=>t.done).length,c:T.green}].map((s,i)=>(
                <div key={i} style={{flex:1,background:s.c+"11",border:`1px solid ${s.c}22`,borderRadius:8,padding:"8px",textAlign:"center"}}>
                  <div style={{...orb,fontSize:16,fontWeight:700,color:s.c}}>{s.v}</div>
                  <div style={{fontSize:8,color:T.muted,...mono,marginTop:2}}>{s.l}</div>
                </div>
              ))}
            </div>
            {filtered.length===0&&<div style={{textAlign:"center",padding:"30px 0",color:T.muted,fontSize:12,...raj}}>{myTasks.length===0?"No tasks yet. Add your first task above.":"No tasks match this filter."}</div>}
            {filtered.map(task=>(
              <div key={task.id} style={{...C({padding:"14px",marginBottom:8,border:`1px solid ${task.done?T.border:prioColors[task.priority]+"33"}`,background:task.done?T.bg1:prioColors[task.priority]+"06",transition:"all .2s"})}}>
                <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div onClick={()=>{const wasDone=task.done;setMyTasks(p=>p.map(t=>t.id===task.id?{...t,done:!t.done}:t));if(!wasDone)gainXP(15,"Custom task done ✅");else takeXP(15,"Custom task undone ↩");}} style={{width:22,height:22,border:`1.5px solid ${task.done?T.green:prioColors[task.priority]}`,borderRadius:5,flexShrink:0,marginTop:1,cursor:"pointer",background:task.done?T.green+"33":"transparent",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:task.done?`0 0 8px ${T.green}44`:"none",transition:"all .2s"}}>
                    {task.done&&<span style={{fontSize:12,color:T.green,fontWeight:900}}>✓</span>}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,color:task.done?"#2a4a3a":T.bright,fontWeight:600,...raj,textDecoration:task.done?"line-through":"none"}}>{task.title}</div>
                    <div style={{display:"flex",gap:6,marginTop:5,flexWrap:"wrap"}}>
                      <span style={{fontSize:9,background:prioColors[task.priority]+"22",border:`1px solid ${prioColors[task.priority]}33`,color:prioColors[task.priority],padding:"2px 6px",borderRadius:20,...mono}}>{task.priority}</span>
                      <span style={{fontSize:9,background:T.blue+"22",border:`1px solid ${T.blue}33`,color:T.blue,padding:"2px 6px",borderRadius:20,...mono}}>{task.cat}</span>
                      {task.due&&<span style={{fontSize:9,color:T.muted,...mono}}>📅 {task.due}</span>}
                    </div>
                  </div>
                  <button onClick={()=>{
                    if(task.done) takeXP(5,"Task deleted ↩");
                    setMyTasks(p=>p.filter(t=>t.id!==task.id));
                  }} style={{background:"transparent",border:"none",color:T.muted,fontSize:18,cursor:"pointer",padding:"0 4px",flexShrink:0,lineHeight:1}}>×</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {taskSubTab==="matrix"&&(
          <div style={{padding:16,}}>
            <div style={{fontSize:9,color:T.muted,letterSpacing:2,...mono,marginBottom:12}}>EISENHOWER DECISION MATRIX — drag tasks to quadrant</div>
            {[
              {q:"urgent-important",label:"DO FIRST",sub:"Urgent + Important",color:T.red,icon:"🔥"},
              {q:"not-urgent-important",label:"SCHEDULE",sub:"Not Urgent + Important",color:T.blue,icon:"📅"},
              {q:"urgent-not-important",label:"DELEGATE",sub:"Urgent + Not Important",color:T.orange,icon:"👋"},
              {q:"not-urgent-not-important",label:"ELIMINATE",sub:"Not Urgent + Not Important",color:T.muted,icon:"🗑️"},
            ].map(quad=>{
              const qTasks=myTasks.filter(t=>t.quadrant===quad.q&&!t.done);
              const allQTasks=myTasks.filter(t=>!t.quadrant&&!t.done);
              return(
                <div key={quad.q} style={{...C({padding:"12px",marginBottom:10,border:`1.5px solid ${quad.color}33`})}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div>
                      <div style={{fontSize:9,color:quad.color,letterSpacing:2,fontWeight:700,...mono}}>{quad.icon} {quad.label}</div>
                      <div style={{fontSize:10,color:T.muted,...raj}}>{quad.sub}</div>
                    </div>
                    <div style={{...orb,fontSize:18,fontWeight:900,color:quad.color}}>{qTasks.length}</div>
                  </div>
                  {qTasks.map(t=>(
                    <div key={t.id} style={{display:"flex",gap:8,alignItems:"center",background:quad.color+"0d",borderRadius:7,padding:"6px 8px",marginBottom:5}}>
                      <div onClick={()=>{setMyTasks(p=>p.map(x=>x.id===t.id?{...x,done:true}:x));gainXP(15,"Matrix task done ✅");}} style={{width:18,height:18,border:`1.5px solid ${quad.color}`,borderRadius:4,cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}/>
                      <span style={{fontSize:12,color:T.bright,flex:1,...raj}}>{t.title}</span>
                      <span style={{fontSize:8,color:quad.color,...mono,background:quad.color+"22",padding:"2px 6px",borderRadius:10}}>{t.priority}</span>
                    </div>
                  ))}
                  {allQTasks.length>0&&(
                    <div>
                      <div style={{fontSize:8,color:T.dim,...mono,marginTop:6,marginBottom:4}}>ASSIGN UNPLACED TASK:</div>
                      <select onChange={e=>{if(e.target.value){setMyTasks(p=>p.map(t=>t.id===parseInt(e.target.value)?{...t,quadrant:quad.q}:t));e.target.value=""}}} style={{width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"6px 8px",color:T.text,fontSize:11,...mono}}>
                        <option value="">+ assign task here...</option>
                        {allQTasks.map(t=><option key={t.id} value={t.id}>{t.title}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
            {myTasks.filter(t=>!t.quadrant&&!t.done).length===0&&myTasks.length===0&&(
              <div style={{textAlign:"center",padding:"20px 0",color:T.muted,fontSize:12,...raj}}>Add tasks in the TASKS tab, then assign them to quadrants here.</div>
            )}
          </div>
        )}

        {taskSubTab==="notes"&&(
          <div style={{padding:16}}>
            <button onClick={()=>{setShowNewNote(!showNewNote);setActiveNoteId(null);}} className="btn-tap" style={{width:"100%",padding:"11px",background:T.blue+"22",border:`1px solid ${T.blue}44`,color:T.blue,borderRadius:10,fontSize:12,...mono,cursor:"pointer",marginBottom:12,letterSpacing:1}}>
              {showNewNote?"✕ CANCEL":"+ NEW NOTE"}
            </button>
            {showNewNote&&(
              <div style={{...C({padding:"16px",marginBottom:12,border:`1px solid ${noteColor}44`})}}>
                <input value={newNoteTitle} onChange={e=>setNewNoteTitle(e.target.value)} placeholder="Note title..." style={{width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 12px",color:T.bright,fontSize:14,...raj,fontWeight:700,marginBottom:10,boxSizing:"border-box"}}/>
                <textarea value={newNoteBody} onChange={e=>setNewNoteBody(e.target.value)} placeholder="Write anything — ideas, blockers, wins, research notes, feelings, plans..." rows={5} style={{width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 12px",color:T.text,fontSize:12,...raj,lineHeight:1.7,resize:"vertical",marginBottom:10,boxSizing:"border-box"}}/>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
                  <span style={{fontSize:10,color:T.muted,...mono}}>COLOR:</span>
                  {noteColors.map(nc=>(
                    <div key={nc} onClick={()=>setNoteColor(nc)} style={{width:20,height:20,borderRadius:"50%",background:nc,border:`2px solid ${noteColor===nc?"#fff":nc+"44"}`,cursor:"pointer",transition:"all .15s"}}/>
                  ))}
                </div>
                <button onClick={()=>{if(!newNoteTitle.trim())return;setNotes(p=>[{id:Date.now(),title:newNoteTitle,body:newNoteBody,pinned:false,color:noteColor,date:new Date().toLocaleDateString()},...p]);setNewNoteTitle("");setNewNoteBody("");setShowNewNote(false);}} className="btn-tap" style={{width:"100%",padding:"10px",background:T.blue+"33",border:`1px solid ${T.blue}55`,color:T.blue,borderRadius:8,fontSize:12,...mono,cursor:"pointer"}}>SAVE NOTE</button>
              </div>
            )}
            {activeNoteObj&&(
              <div style={{...C({padding:"16px",marginBottom:12,border:`1px solid ${activeNoteObj.color}55`})}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div style={{...orb,fontSize:14,fontWeight:700,color:activeNoteObj.color}}>{activeNoteObj.title}</div>
                  <button onClick={()=>setActiveNoteId(null)} style={{background:"transparent",border:"none",color:T.muted,fontSize:20,cursor:"pointer",lineHeight:1}}>×</button>
                </div>
                <textarea value={activeNoteObj.body} onChange={e=>setNotes(p=>p.map(x=>x.id===activeNoteObj.id?{...x,body:e.target.value}:x))} style={{width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:8,padding:"12px",color:T.text,fontSize:13,...raj,lineHeight:1.8,resize:"vertical",minHeight:130,boxSizing:"border-box"}}/>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:10,alignItems:"center"}}>
                  <span style={{fontSize:10,color:T.muted,...mono}}>{activeNoteObj.date}</span>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>setNotes(p=>p.map(x=>x.id===activeNoteObj.id?{...x,pinned:!x.pinned}:x))} style={{padding:"5px 10px",background:activeNoteObj.pinned?T.gold+"22":"transparent",border:`1px solid ${activeNoteObj.pinned?T.gold:T.border}`,color:activeNoteObj.pinned?T.gold:T.muted,borderRadius:6,fontSize:10,cursor:"pointer",...mono}}>{activeNoteObj.pinned?"📌 PINNED":"PIN"}</button>
                    <button onClick={()=>{setNotes(p=>p.filter(x=>x.id!==activeNoteObj.id));setActiveNoteId(null);}} style={{padding:"5px 10px",background:T.red+"22",border:`1px solid ${T.red}33`,color:T.red,borderRadius:6,fontSize:10,cursor:"pointer",...mono}}>DELETE</button>
                  </div>
                </div>
              </div>
            )}
            {notes.length===0&&<div style={{textAlign:"center",padding:"30px 0",color:T.muted,fontSize:12,...raj}}>No notes yet. Capture your first thought above.</div>}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[...notes.filter(n=>n.pinned),...notes.filter(n=>!n.pinned)].map(n=>(
                <div key={n.id} onClick={()=>setActiveNoteId(n.id===activeNoteId?null:n.id)} className="hovlift" style={{background:n.color+"0d",border:`1px solid ${n.id===activeNoteId?n.color:n.color+"33"}`,borderRadius:10,padding:"12px",cursor:"pointer",minHeight:90,position:"relative",transition:"all .2s"}}>
                  {n.pinned&&<div style={{position:"absolute",top:8,right:8,fontSize:12}}>📌</div>}
                  <div style={{fontSize:11,color:n.color,fontWeight:700,...raj,marginBottom:5,paddingRight:n.pinned?18:0}}>{n.title}</div>
                  <div style={{fontSize:11,color:T.muted,...raj,lineHeight:1.5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical"}}>{n.body||"Empty. Tap to edit."}</div>
                  <div style={{fontSize:9,color:T.dim,...mono,marginTop:8}}>{n.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RESEARCH NOTES ── */}
        {taskSubTab==="research"&&(
          <div style={{padding:16}}>
            <div style={{display:"flex",gap:8,marginBottom:12,alignItems:"center"}}>
              <div style={{flex:1}}>
                <div style={{fontSize:9,color:T.green,letterSpacing:2,...mono}}>🧪 RESEARCH NOTES</div>
                <div style={{fontSize:10,color:T.muted,...raj,marginTop:2}}>CRO · SHAP · Dataset · Results · Ideas</div>
              </div>
              <button onClick={()=>setShowResNote(!showResNote)} className="btn-tap" style={{padding:"7px 12px",background:T.green+"22",border:`1px solid ${T.green}44`,color:T.green,borderRadius:8,fontSize:10,...mono,cursor:"pointer"}}>+ NOTE</button>
            </div>
            {showResNote&&(
              <div style={{...C({padding:"14px",marginBottom:12,border:`1px solid ${T.green}44`})}}>
                <input value={newResNote.title} onChange={e=>setNewResNote(p=>({...p,title:e.target.value}))} placeholder="Note title (e.g. CRO convergence issue)" style={{width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:8,padding:"9px 12px",color:T.bright,fontSize:13,...raj,marginBottom:8,boxSizing:"border-box"}}/>
                <div style={{display:"flex",gap:6,marginBottom:8}}>
                  {["CRO","SHAP","Dataset","Results","Ideas","Writing"].map(tag=>(
                    <button key={tag} onClick={()=>setNewResNote(p=>({...p,tag}))} className="btn-tap" style={{flex:1,padding:"5px 4px",borderRadius:6,border:`1px solid ${newResNote.tag===tag?T.green:T.border}`,background:newResNote.tag===tag?T.green+"22":"transparent",color:newResNote.tag===tag?T.green:T.muted,fontSize:9,...mono,cursor:"pointer"}}>{tag}</button>
                  ))}
                </div>
                <textarea value={newResNote.body} onChange={e=>setNewResNote(p=>({...p,body:e.target.value}))} placeholder="Write your research thought, finding, or idea..." style={{width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:8,padding:"9px 12px",color:T.text,fontSize:12,...raj,lineHeight:1.7,resize:"vertical",minHeight:100,boxSizing:"border-box",marginBottom:8}}/>
                <button onClick={()=>{
                  if(!newResNote.title.trim())return;
                  setResearchNotes(p=>[{id:Date.now(),title:newResNote.title,body:newResNote.body,tag:newResNote.tag,date:new Date().toLocaleDateString(),time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})},...p]);
                  setNewResNote({title:"",body:"",tag:"CRO"});
                  setShowResNote(false);
                  gainXP(8,"Research note added 🧪");
                }} className="btn-tap" style={{width:"100%",padding:"9px",background:T.green+"33",border:`1px solid ${T.green}55`,color:T.green,borderRadius:8,fontSize:12,...mono,cursor:"pointer"}}>SAVE NOTE</button>
              </div>
            )}
            {researchNotes.length===0&&(
              <div style={{textAlign:"center",padding:"30px 0",color:T.muted,fontSize:12,...raj}}>
                <div style={{fontSize:32,marginBottom:8}}>🧪</div>
                <div>No research notes yet.</div>
                <div style={{fontSize:10,color:T.dim,marginTop:4}}>Write down CRO ideas, SHAP findings, dataset notes — anything thesis related.</div>
              </div>
            )}
            {/* Tag filter */}
            {researchNotes.length>0&&(
              <div style={{display:"flex",gap:5,marginBottom:10,overflowX:"auto",paddingBottom:2}}>
                {["All","CRO","SHAP","Dataset","Results","Ideas","Writing"].map(tag=>(
                  <button key={tag} onClick={()=>setActiveResNote(activeResNote===tag?null:tag)} style={{padding:"4px 10px",borderRadius:20,border:`1px solid ${activeResNote===tag?T.green:T.border}`,background:activeResNote===tag?T.green+"22":"transparent",color:activeResNote===tag?T.green:T.muted,fontSize:9,...mono,cursor:"pointer",flexShrink:0}}>{tag}</button>
                ))}
              </div>
            )}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {researchNotes
                .filter(n=>!activeResNote||activeResNote==="All"||n.tag===activeResNote)
                .map((n,i)=>{
                  const tagColors={CRO:T.green,SHAP:T.blue,Dataset:T.orange,Results:T.pink,Ideas:T.gold,Writing:"#a855f7"};
                  const col=tagColors[n.tag]||T.green;
                  return(
                    <div key={n.id} style={{...C({padding:"12px",border:`1px solid ${col}33`,background:`${col}06`})}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
                            <span style={{fontSize:9,color:col,background:col+"22",padding:"2px 7px",borderRadius:10,...mono}}>{n.tag}</span>
                            <span style={{fontSize:8,color:T.dim,...mono}}>{n.date} {n.time}</span>
                          </div>
                          <div style={{fontSize:13,color:T.bright,fontWeight:600,...raj}}>{n.title}</div>
                        </div>
                        <button onClick={()=>{setResearchNotes(p=>p.filter(x=>x.id!==n.id));takeXP(8,"Research note removed ↩");}} style={{background:"transparent",border:"none",color:T.muted,fontSize:16,cursor:"pointer",lineHeight:1,marginLeft:8}}>×</button>
                      </div>
                      {n.body&&<div style={{fontSize:11,color:T.text,...raj,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{n.body}</div>}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    );
  };
  const Goals=()=>{
    const path=PATHS.find(p=>p.id===activePath);
    const uni=UNIS.find(u=>u.id===activeUni);
    const scoreLabels=[["family","👨‍👩‍👦 Parents & Family"],["financial","💰 Financial Freedom"],["reputation","🎖️ Reputation / Society"],["satisfaction","❤️ Own Satisfaction"],["complexity","🧩 Complexity (↑ = easier)"]];
    return(
      <div style={{}}>
        <div style={{display:"flex",background:T.bg1,borderBottom:`1px solid ${T.border}`}}>
          {[{id:"paths",label:"🗺️ LIFE PATHS"},{id:"admission",label:"🏛️ ADMISSION"}].map(st=>(
            <div key={st.id} onClick={()=>setGoalsTab(st.id)} style={{flex:1,padding:"11px 4px",textAlign:"center",cursor:"pointer",borderBottom:goalsTab===st.id?`2px solid ${T.green}`:"2px solid transparent",background:goalsTab===st.id?"#00ff8808":"transparent",fontSize:12,color:goalsTab===st.id?T.green:T.muted,...mono,letterSpacing:1,transition:"all .2s"}}>
              {st.label}
            </div>
          ))}
        </div>

        {goalsTab==="paths"&&(
          <div style={{padding:16}}>
            {PATHS.map(p=>(
              <div key={p.id} onClick={()=>setActivePath(p.id)} style={{...C({padding:"12px 14px",marginBottom:8,cursor:"pointer",border:`1.5px solid ${activePath===p.id?p.color:T.border}`,background:activePath===p.id?p.color+"11":T.bg1,transition:"all .2s"}),display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <span style={{fontSize:20}}>{p.icon}</span>
                  <div>
                    <div style={{fontSize:13,color:activePath===p.id?T.bright:T.muted,fontWeight:700,...raj}}>{p.name}</div>
                    <div style={{fontSize:10,color:T.muted,...mono}}>{p.timeline}</div>
                  </div>
                </div>
                <span style={{background:p.color+"22",border:`1px solid ${p.color}33`,color:p.color,fontSize:8,letterSpacing:1,padding:"3px 8px",borderRadius:20,...mono,whiteSpace:"nowrap"}}>{p.tag}</span>
              </div>
            ))}
            {path&&(
              <div style={{marginTop:4}}>
                <div style={{...C({padding:"16px",marginBottom:10,border:`1px solid ${path.color}44`})}}>
                  <div style={{...orb,fontSize:14,fontWeight:900,color:T.bright}}>{path.icon} {path.name}</div>
                  <div style={{fontSize:12,color:T.muted,lineHeight:1.7,marginTop:8,...raj}}>{path.summary}</div>
                </div>
                <div style={{...C({padding:"14px",marginBottom:10})}}>
                  <div style={{fontSize:9,color:T.muted,letterSpacing:2,...mono,marginBottom:12}}>LIFE CONDITIONS SCORE</div>
                  {scoreLabels.map(([key,label])=>(
                    <div key={key} style={{marginBottom:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                        <span style={{fontSize:11,color:T.text,...raj}}>{label}</span>
                        <span style={{...orb,fontSize:11,color:path.color}}>{path.score[key]}/5</span>
                      </div>
                      <div style={{height:5,background:T.bg2,borderRadius:3,overflow:"hidden"}}>
                        <div style={{width:`${(path.score[key]/5)*100}%`,height:"100%",background:path.color,boxShadow:`0 0 6px ${path.color}44`,transition:"width .5s"}}/>
                      </div>
                    </div>
                  ))}
                  <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between"}}>
                    <span style={{color:T.muted,fontSize:12,...raj}}>TOTAL SCORE</span>
                    <span style={{...orb,fontSize:20,fontWeight:900,...gt(path.color)}}>{Object.values(path.score).reduce((a,b)=>a+b,0)}/25</span>
                  </div>
                </div>
                <div style={{display:"flex",gap:8,marginBottom:10}}>
                  <div style={{flex:1,background:"#051a0a",border:`1px solid ${T.green}22`,borderRadius:10,padding:12}}>
                    <div style={{fontSize:9,color:T.green,letterSpacing:2,marginBottom:8,...mono}}>✅ PROS</div>
                    {path.pros.map((pr,i)=><div key={i} style={{fontSize:11,color:T.text,marginBottom:5,lineHeight:1.5,...raj}}>• {pr}</div>)}
                  </div>
                  <div style={{flex:1,background:"#1a0508",border:`1px solid ${T.red}22`,borderRadius:10,padding:12}}>
                    <div style={{fontSize:9,color:T.red,letterSpacing:2,marginBottom:8,...mono}}>⚠️ CONS</div>
                    {path.cons.map((cn,i)=><div key={i} style={{fontSize:11,color:"#ffcccc",marginBottom:5,lineHeight:1.5,...raj}}>• {cn}</div>)}
                  </div>
                </div>
                <div style={{...C({padding:"14px",border:`1px solid ${path.color}44`})}}>
                  <div style={{fontSize:9,color:path.color,letterSpacing:2,marginBottom:8,...mono}}>⚡ STRATEGY</div>
                  <div style={{fontSize:12,color:T.bright,lineHeight:1.8,...raj}}>{path.strategy}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {goalsTab==="admission"&&(
          <div style={{padding:16}}>

            {/* ── RUDRA PROFILE ANALYSIS HEADER ── */}
            <div style={{...C({padding:"15px",marginBottom:12,background:"linear-gradient(135deg,#020d08,#040814)",border:`2px solid ${T.green}55`})}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <div style={{fontSize:9,color:T.green,letterSpacing:3,...mono,marginBottom:4}}>🎯 YOUR ADMISSION PROFILE</div>
                  <div style={{...orb,fontSize:18,fontWeight:900,color:T.bright}}>PEASH RUDRA</div>
                  <div style={{fontSize:10,color:T.muted,...mono,marginTop:2}}>NUBTK · CSE · 3.95/4.00 · Khulna</div>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{width:54,height:54,borderRadius:10,background:T.green+"22",border:`2px solid ${T.green}`,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
                    <div style={{...orb,fontSize:18,fontWeight:900,color:T.green}}>A+</div>
                    <div style={{fontSize:7,color:T.green,...mono}}>PROFILE</div>
                  </div>
                </div>
              </div>
              {/* Competitive edge stats */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
                {[
                  {l:"GPA vs KUET min",v:"3.95 vs 2.75",c:T.green,pct:100},
                  {l:"Khulna unis",v:"2 home options",c:T.green,pct:100},
                  {l:"Research novelty",v:"Published-level",c:T.blue,pct:88},
                ].map((s,i)=>(
                  <div key={i} style={{background:s.c+"11",border:`1px solid ${s.c}22`,borderRadius:7,padding:"7px 6px",textAlign:"center"}}>
                    <div style={{fontSize:9,color:s.c,fontWeight:700,...raj,lineHeight:1.3}}>{s.v}</div>
                    <div style={{fontSize:6,color:T.muted,...mono,marginTop:2}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── SUB-NAV ── */}
            <div style={{display:"flex",background:T.bg1,borderRadius:10,border:`1px solid ${T.border}`,marginBottom:12,overflow:"hidden",overflowX:"auto"}}>
              {[{id:"dashboard",l:"📊 Dashboard"},{id:"enhanced",l:"🚀 Enhanced"},{id:"unis",l:"🏛️ Universities"},{id:"analysis",l:"🔍 Analysis"},{id:"profs",l:"📧 Professors"},{id:"scholarships",l:"✈️ Abroad"},{id:"timeline",l:"📅 Timeline"}].map(s=>(
                <div key={s.id} onClick={()=>setGoalsSubTab(s.id)} style={{padding:"9px 8px",cursor:"pointer",whiteSpace:"nowrap",borderBottom:goalsSubTab===s.id?`2px solid ${T.green}`:"2px solid transparent",background:goalsSubTab===s.id?"#00ff8808":"transparent",fontSize:9,color:goalsSubTab===s.id?T.green:T.muted,...mono,transition:"all .2s"}}>{s.l}</div>
              ))}
            </div>

            {/* ── DASHBOARD ── */}
            {goalsSubTab==="dashboard"&&(
              <div>
                {/* Khulna advantage */}
                <div style={{...C({padding:"13px",marginBottom:12,background:"linear-gradient(135deg,#001a00,#020408)",border:`2px solid ${T.green}44`})}}>
                  <div style={{fontSize:9,color:T.green,letterSpacing:2,...mono,marginBottom:6}}>🏠 THE KHULNA ADVANTAGE — YOUR UNFAIR EDGE</div>
                  <div style={{fontSize:12,color:T.bright,...raj,lineHeight:1.9}}>
                    You live in <strong style={{color:T.green}}>Khulna</strong>. KUET and KU are both in Khulna. While applicants from Dhaka, Rajshahi, Sylhet budget for rent, food, transport, and relocation stress — you wake up in your own house, eat your mother's cooking, and commute 10–25 minutes. <strong style={{color:T.gold}}>This is not a small advantage. This is a life quality difference.</strong>
                  </div>
                  <div style={{display:"flex",gap:6,marginTop:10}}>
                    {[{v:"৳0",l:"Monthly Rent",c:T.green},{v:"10 min",l:"To KUET",c:T.green},{v:"৳96k+",l:"Saved vs Dhaka/yr",c:T.gold},{v:"100%",l:"Family support",c:T.blue}].map((s,i)=>(
                      <div key={i} style={{flex:1,background:s.c+"11",border:`1px solid ${s.c}22`,borderRadius:7,padding:"7px 4px",textAlign:"center"}}>
                        <div style={{...orb,fontSize:12,fontWeight:900,color:s.c}}>{s.v}</div>
                        <div style={{fontSize:6,color:T.muted,...mono,marginTop:2}}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* All 4 uni cards */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                  {UNIS.map(u=>(
                    <div key={u.id} onClick={()=>{setActiveUni(u.id);setAdmTab("overview");setGoalsSubTab("unis");}} style={{background:activeUni===u.id?u.color+"18":T.bg2,border:`2px solid ${activeUni===u.id?u.color:u.color+"33"}`,borderRadius:12,padding:"12px 8px",cursor:"pointer",textAlign:"center",transition:"all .2s",position:"relative"}}>
                      {(u.id==="kuet"||u.id==="ku")&&<div style={{position:"absolute",top:-7,right:6,background:T.green,color:"#020408",fontSize:6,padding:"2px 6px",borderRadius:8,...orb,fontWeight:900}}>🏠 HOME</div>}
                      <div style={{fontSize:22,marginBottom:4}}>{u.icon}</div>
                      <div style={{...orb,fontSize:12,fontWeight:700,color:T.bright}}>{u.name}</div>
                      <div style={{fontSize:7,color:u.color,...mono,marginTop:2,marginBottom:6}}>{u.status}</div>
                      <div style={{height:5,background:T.bg3,borderRadius:3,overflow:"hidden",marginBottom:3}}>
                        <div style={{width:`${u.chancePct}%`,height:"100%",background:u.chanceColor,transition:"width .6s"}}/>
                      </div>
                      <div style={{...orb,fontSize:11,fontWeight:900,color:u.chanceColor}}>{u.chancePct}%</div>
                      <div style={{fontSize:7,color:u.chanceColor,...mono,marginTop:1}}>{u.chanceLabel}</div>
                    </div>
                  ))}
                </div>

                {/* Comparison table */}
                <div style={{...C({padding:"13px",marginBottom:12})}}>
                  <div style={{fontSize:9,color:T.muted,letterSpacing:2,...mono,marginBottom:8}}>📊 AT A GLANCE</div>
                  <div style={{overflowX:"auto"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",minWidth:320}}>
                      <thead><tr>
                        {["",UNIS[0].name,UNIS[1].name,UNIS[2].name,UNIS[3].name].map((h,i)=>(
                          <th key={i} style={{padding:"5px 4px",textAlign:i===0?"left":"center",color:i===0?T.muted:[T.green,T.orange,T.blue,"#a855f7"][i-1],...mono,fontSize:8,borderBottom:`1px solid ${T.border}`,fontWeight:700}}>{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {[
                          ["Location","Khulna 🏠","Khulna 🏠","Dhaka ✈️","Dhaka ✈️"],
                          ["From home","10 min","25 min","5+ hrs","5+ hrs"],
                          ["Monthly cost","৳0 rent","৳0 rent","৳8–12k","৳8–12k"],
                          ["Your chance","90%","82%","45%","70%"],
                          ["Apply when","Sep 2026","Dec 2026","Apr 2027","Jul 2026"],
                          ["Exam diff.","Moderate","Moderate","Very Hard","Hard"],
                          ["Prestige","⭐⭐⭐⭐","⭐⭐⭐","⭐⭐⭐⭐⭐","⭐⭐⭐⭐"],
                        ].map(([l,...v],ri)=>(
                          <tr key={ri} style={{background:ri%2===0?T.bg2:"transparent"}}>
                            <td style={{padding:"6px 4px",color:T.muted,...raj,fontSize:10}}>{l}</td>
                            {v.map((val,ci)=><td key={ci} style={{padding:"6px 4px",textAlign:"center",color:[T.green,T.orange,T.blue,"#a855f7"][ci],...mono,fontSize:9}}>{val}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Master plan */}
                <div style={{...C({padding:"13px",background:"linear-gradient(135deg,#0a0800,#020408)",border:`2px solid ${T.gold}55`})}}>
                  <div style={{fontSize:9,color:T.gold,letterSpacing:2,...mono,marginBottom:10}}>👑 RUDRA'S MASTER PLAN — ACTION BY ACTION</div>
                  {RUDRA_ANALYSIS.timelineAnalysis.map((t,i)=>(
                    <div key={i} style={{display:"flex",gap:10,marginBottom:i<RUDRA_ANALYSIS.timelineAnalysis.length-1?10:0,padding:"9px 10px",background:T.bg2,borderRadius:8,border:`1px solid ${t.priority.includes("🔴")?T.red+"33":t.priority.includes("🟡")?"#ff880033":t.priority.includes("🔵")?T.blue+"33":T.green+"33"}`}}>
                      <div style={{flexShrink:0,width:8,height:8,borderRadius:"50%",background:t.priority.includes("🔴")?T.red:t.priority.includes("🟡")?T.orange:t.priority.includes("🔵")?T.blue:T.green,marginTop:4,boxShadow:`0 0 6px ${t.priority.includes("🔴")?T.red:t.priority.includes("🟡")?T.orange:t.priority.includes("🔵")?T.blue:T.green}66`}}/>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                          <span style={{fontSize:9,...mono,color:T.gold,fontWeight:700}}>{t.period}</span>
                          <span style={{fontSize:8,...mono,color:T.muted}}>{t.priority.replace(/[🔴🟡🟢🔵]/g,"")}</span>
                        </div>
                        <div style={{fontSize:12,color:T.bright,...raj,fontWeight:600,marginBottom:4}}>{t.focus}</div>
                        {t.actions.map((a,j)=><div key={j} style={{fontSize:10,color:T.muted,...raj,marginBottom:2}}>• {a}</div>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── ENHANCED ADMISSIONS (NEWS, TIPS, TRICKS, INTERVIEW, SOP, SCHOLARSHIP) ── */}
            {goalsSubTab==="enhanced"&&(
              <div>
                <div style={{...C({padding:"10px 14px",marginBottom:12,background:"linear-gradient(135deg,#040a06,#060d12)",border:`2px solid ${T.cyan}44`})}}>
                  <div style={{fontSize:9,color:T.cyan,letterSpacing:3,...mono,marginBottom:4}}>🚀 ENHANCED ADMISSIONS PORTAL</div>
                  <div style={{fontSize:11,color:T.text,...raj}}>Live news, interview prep, SOP templates, scholarship guides — verified May 5, 2026</div>
                </div>
                <AdmissionsDashboard T={T} orb={orb} mono={mono} raj={raj} C={C} />
              </div>
            )}

            {/* ── UNIVERSITIES DETAIL ── */}
            {goalsSubTab==="unis"&&(
              <div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:12}}>
                  {UNIS.map(u=>(
                    <div key={u.id} onClick={()=>{setActiveUni(u.id);setAdmTab("overview");}} style={{background:activeUni===u.id?u.color+"18":T.bg2,border:`2px solid ${activeUni===u.id?u.color:u.color+"33"}`,borderRadius:10,padding:"10px 8px",cursor:"pointer",textAlign:"center",transition:"all .2s",position:"relative"}}>
                      {(u.id==="kuet"||u.id==="ku")&&<div style={{position:"absolute",top:-6,right:6,background:T.green,color:"#020408",fontSize:6,padding:"2px 5px",borderRadius:8,...orb,fontWeight:900}}>HOME</div>}
                      <div style={{fontSize:20,marginBottom:3}}>{u.icon}</div>
                      <div style={{...orb,fontSize:11,fontWeight:700,color:activeUni===u.id?T.bright:T.muted}}>{u.name}</div>
                      <div style={{fontSize:7,color:u.color,...mono,marginTop:2}}>{u.status}</div>
                      <div style={{marginTop:5,height:4,background:T.bg3,borderRadius:2,overflow:"hidden"}}>
                        <div style={{width:`${u.chancePct}%`,height:"100%",background:u.chanceColor}}/>
                      </div>
                      <div style={{...orb,fontSize:10,color:u.chanceColor,marginTop:2}}>{u.chancePct}%</div>
                    </div>
                  ))}
                </div>
                {uni&&(
                  <div key={uni.id}>
                    <div style={{...C({padding:"14px",marginBottom:10,border:`2px solid ${uni.color}44`,background:`linear-gradient(135deg,${uni.color}08,transparent)`})}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                            <div style={{...orb,fontSize:15,fontWeight:900,color:T.bright}}>{uni.icon} {uni.name}</div>
                            {(uni.id==="kuet"||uni.id==="ku")&&<div style={{background:T.green+"22",border:`1px solid ${T.green}`,color:T.green,fontSize:7,padding:"2px 7px",borderRadius:8,...mono,fontWeight:700}}>YOUR CITY</div>}
                          </div>
                          <div style={{fontSize:10,color:uni.color,...mono}}>{uni.fullName}</div>
                          <div style={{fontSize:10,color:T.muted,marginTop:3,...mono}}>📍 {uni.location} · 🌐 {uni.site}</div>
                          <div style={{fontSize:10,color:T.muted,marginTop:2,...mono}}>📅 {uni.intake}</div>
                        </div>
                        <div style={{textAlign:"center",flexShrink:0,marginLeft:10}}>
                          <div style={{width:56,height:56,borderRadius:10,background:uni.color+"22",border:`2px solid ${uni.chanceColor}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",boxShadow:`0 0 12px ${uni.chanceColor}33`}}>
                            <div style={{...orb,fontSize:18,fontWeight:900,color:uni.chanceColor,lineHeight:1}}>{uni.chancePct}%</div>
                            <div style={{fontSize:6,color:uni.chanceColor,...mono,marginTop:1,textAlign:"center",lineHeight:1.2}}>{uni.chanceLabel}</div>
                          </div>
                        </div>
                      </div>
                      <div style={{marginTop:10,padding:"8px 10px",background:uni.id==="kuet"||uni.id==="ku"?"#001a00":"#1a0500",border:`1px solid ${uni.id==="kuet"||uni.id==="ku"?T.green+"44":T.orange+"44"}`,borderRadius:8}}>
                        <div style={{fontSize:11,color:uni.id==="kuet"||uni.id==="ku"?T.green:T.orange,...raj,lineHeight:1.6}}>{uni.locationAdvantage}</div>
                      </div>
                      <div style={{marginTop:10,paddingTop:8,borderTop:`1px solid ${T.border}`}}>
                        <div style={{fontSize:8,color:T.muted,...mono,marginBottom:6}}>PROFILE MATCH</div>
                        {[["GPA",uni.profileScore.gpa,T.green],["Thesis",uni.profileScore.thesis,T.blue],["Exam",uni.profileScore.exam,"#a855f7"],["Interview",uni.profileScore.interview,T.gold]].map(([l,v,c])=>(
                          <div key={l} style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                            <span style={{fontSize:8,...mono,color:T.muted,width:50,flexShrink:0}}>{l}</span>
                            <div style={{flex:1,height:4,background:T.bg2,borderRadius:2,overflow:"hidden"}}>
                              <div style={{width:`${v*20}%`,height:"100%",background:v>=4?T.green:v>=3?"#ff8800":T.red}}/>
                            </div>
                            <span style={{...orb,fontSize:9,color:v>=4?T.green:v>=3?"#ff8800":T.red,width:18,textAlign:"right"}}>{v}/5</span>
                          </div>
                        ))}
                        <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
                          <span style={{fontSize:10,...raj,color:T.muted}}>Total score</span>
                          <span style={{...orb,fontSize:14,fontWeight:900,color:uni.color}}>{uni.profileScore.total}/{uni.profileScore.max}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{display:"flex",background:T.bg1,borderRadius:10,border:`1px solid ${T.border}`,marginBottom:10,overflow:"hidden"}}>
                      {[{id:"overview",l:"📋"},{id:"lifesavers",l:"🔑"},{id:"exam",l:"📚"},{id:"docs",l:"📁"},{id:"email",l:"📧"}].map(s=>(
                        <div key={s.id} onClick={()=>setAdmTab(s.id)} style={{flex:1,padding:"9px 2px",textAlign:"center",cursor:"pointer",background:admTab===s.id?uni.color+"22":"transparent",borderBottom:admTab===s.id?`2px solid ${uni.color}`:"2px solid transparent",fontSize:16,color:admTab===s.id?uni.color:T.muted,transition:"all .2s"}}>{s.l}</div>
                      ))}
                    </div>
                    {admTab==="overview"&&(
                      <div>
                        {uni.khulnaAdvantage&&<div style={{background:"#001a00",border:`1px solid ${T.green}33`,borderRadius:10,padding:"12px 14px",marginBottom:10}}>
                          <div style={{fontSize:9,color:T.green,...mono,marginBottom:5}}>🏠 KHULNA CONTEXT</div>
                          <div style={{fontSize:12,color:T.bright,...raj,lineHeight:1.8}}>{uni.khulnaAdvantage}</div>
                        </div>}
                        <div style={{...C({padding:"13px",marginBottom:10})}}>
                          <div style={{fontSize:9,color:T.muted,...mono,marginBottom:10}}>📋 STEP BY STEP PROCESS</div>
                          {uni.process.map((step,i)=>(
                            <div key={i} style={{display:"flex",gap:10,marginBottom:10,alignItems:"flex-start"}}>
                              <div style={{width:22,height:22,borderRadius:"50%",background:uni.color+"22",border:`1px solid ${uni.color}44`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:9,color:uni.color,...orb,fontWeight:700}}>{i+1}</div>
                              <div style={{fontSize:11,color:T.text,...raj,lineHeight:1.6,paddingTop:2}}>{step}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{background:uni.color+"08",border:`1px solid ${uni.color}44`,borderRadius:10,padding:13}}>
                          <div style={{fontSize:9,color:uni.color,...mono,marginBottom:6}}>🏆 VERDICT</div>
                          <div style={{fontSize:12,color:T.bright,...raj,lineHeight:1.8}}>{uni.verdict}</div>
                        </div>
                      </div>
                    )}
                    {admTab==="lifesavers"&&(
                      <div style={{...C({padding:"13px",border:`1px solid ${T.gold}44`,background:"linear-gradient(135deg,#0a0800,transparent)"})}}>
                        <div style={{fontSize:9,color:T.gold,...mono,marginBottom:4}}>🔑 LIFE-SAVER INSIGHTS</div>
                        <div style={{fontSize:10,color:T.muted,...raj,marginBottom:12}}>Things most applicants never figure out. These are yours.</div>
                        {(uni.lifeSavers||[]).map((tip,i)=>(
                          <div key={i} style={{display:"flex",gap:10,marginBottom:10,padding:"10px 12px",background:T.bg2,borderRadius:8,border:`1px solid ${T.gold}22`}}>
                            <div style={{width:22,height:22,borderRadius:"50%",background:T.gold+"22",border:`1px solid ${T.gold}44`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:9,color:T.gold,...orb}}>{i+1}</div>
                            <div style={{fontSize:11,color:T.bright,...raj,lineHeight:1.7}}>{tip}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {admTab==="exam"&&(
                      <div>
                        <div style={{...C({padding:"13px",marginBottom:10})}}>
                          <div style={{fontSize:9,color:T.muted,...mono,marginBottom:10}}>📚 EXAM TOPICS — WEIGHTED</div>
                          {(uni.examTopics||[]).map((t,i)=>(
                            <div key={i} onClick={()=>setExpandedExam(expandedExam===`${uni.id}-${i}`?null:`${uni.id}-${i}`)} style={{background:T.bg2,borderRadius:8,padding:"10px 12px",marginBottom:6,cursor:"pointer",border:`1px solid ${expandedExam===`${uni.id}-${i}`?uni.color+"55":T.border}`}}>
                              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                <span style={{fontSize:11,color:T.bright,...raj,flex:1}}>{t.t}</span>
                                <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
                                  <div style={{width:36,height:4,background:T.bg3,borderRadius:2,overflow:"hidden"}}>
                                    <div style={{width:`${t.pct}%`,height:"100%",background:t.color||uni.color}}/>
                                  </div>
                                  <span style={{fontSize:8,color:t.color||uni.color,...mono}}>{t.pct}%</span>
                                </div>
                              </div>
                              {expandedExam===`${uni.id}-${i}`&&<div style={{fontSize:11,color:uni.color,marginTop:8,paddingTop:8,borderTop:`1px solid ${T.border}`,...raj,lineHeight:1.6}}>💡 {t.tip}</div>}
                            </div>
                          ))}
                        </div>
                        <div style={{...C({padding:"12px",border:`1px solid ${uni.color}22`})}}>
                          <div style={{fontSize:9,color:uni.color,...mono,marginBottom:8}}>📖 PREP RESOURCES</div>
                          {(uni.prepResources||[]).map((r,i)=>(
                            <div key={i} style={{display:"flex",gap:8,marginBottom:6}}>
                              <span style={{color:uni.color,flexShrink:0}}>→</span>
                              <div style={{fontSize:11,color:T.text,...raj,lineHeight:1.5}}>{r}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {admTab==="docs"&&(
                      <div style={{...C({padding:"13px"})}}>
                        <div style={{fontSize:9,color:T.muted,...mono,marginBottom:10}}>📁 DOCUMENTS CHECKLIST</div>
                        {(uni.docs||[]).map((doc,i)=>(
                          <div key={i} onClick={()=>setAdmCheckDone(p=>({...p,[`${uni.id}-${i}`]:!p[`${uni.id}-${i}`]}))} style={{display:"flex",gap:10,alignItems:"center",padding:"8px 10px",marginBottom:5,background:T.bg2,borderRadius:7,border:`1px solid ${admCheckDone[`${uni.id}-${i}`]?T.green+"44":T.border}`,cursor:"pointer"}}>
                            <div style={{width:18,height:18,borderRadius:4,border:`1.5px solid ${admCheckDone[`${uni.id}-${i}`]?T.green:T.border}`,background:admCheckDone[`${uni.id}-${i}`]?T.green+"33":"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                              {admCheckDone[`${uni.id}-${i}`]&&<span style={{fontSize:10,color:T.green,fontWeight:900}}>✓</span>}
                            </div>
                            <span style={{fontSize:11,color:admCheckDone[`${uni.id}-${i}`]?T.muted:T.text,...raj,textDecoration:admCheckDone[`${uni.id}-${i}`]?"line-through":"none"}}>{doc}</span>
                          </div>
                        ))}
                        <div style={{marginTop:10,padding:"10px 12px",background:"#0a0a00",border:`1px solid ${T.gold}33`,borderRadius:8}}>
                          <div style={{fontSize:9,color:T.gold,...mono,marginBottom:4}}>⚡ KHULNA TIP</div>
                          <div style={{fontSize:11,color:T.text,...raj,lineHeight:1.7}}>Attested copies: any notary in Khulna city. Sonali Bank KDA branch for bank drafts. Do ALL attestation in one trip — bring originals + 5 extra copies each.</div>
                        </div>
                      </div>
                    )}
                    {admTab==="email"&&(
                      <div style={{...C({padding:"13px",border:`1px solid ${uni.color}44`})}}>
                        <div style={{fontSize:9,color:uni.color,...mono,marginBottom:4}}>📧 PROFESSOR EMAIL TEMPLATE</div>
                        <div style={{fontSize:10,color:T.muted,...raj,marginBottom:10}}>Send to 2–3 professors at {uni.name} whose research overlaps ML/AI/optimization.</div>
                        <div style={{background:"#020408",border:`1px solid ${uni.color}33`,borderRadius:8,padding:"12px 14px",...mono,fontSize:10,color:T.text,lineHeight:1.8,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
                          {(uni.emailTemplate||"").replace(/\\n/g,"\n")}
                        </div>
                        <div style={{marginTop:10,padding:"8px 10px",background:T.gold+"11",border:`1px solid ${T.gold}33`,borderRadius:7}}>
                          <div style={{fontSize:9,color:T.gold,...mono,marginBottom:3}}>🔑 WHY THIS MATTERS</div>
                          <div style={{fontSize:11,color:T.text,...raj,lineHeight:1.6}}>Send this NOW — before any circular opens. A professor who knows your name = dramatically better viva outcome.</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── PERSONAL ANALYSIS ── */}
            {goalsSubTab==="analysis"&&(
              <div>
                {/* Strengths */}
                <div style={{...C({padding:"13px",marginBottom:12,border:`1px solid ${T.green}33`})}}>
                  <div style={{fontSize:9,color:T.green,letterSpacing:2,...mono,marginBottom:10}}>💪 YOUR STRENGTHS AS AN APPLICANT</div>
                  {RUDRA_ANALYSIS.strengths.map((s,i)=>(
                    <div key={i} style={{marginBottom:10,padding:"10px 12px",background:T.bg2,borderRadius:8,border:`1px solid ${T.green}22`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                        <span style={{fontSize:12,color:T.bright,...raj,fontWeight:600}}>{s.area}</span>
                        <div style={{display:"flex",gap:6,alignItems:"center"}}>
                          <span style={{fontSize:8,padding:"2px 6px",borderRadius:8,background:s.impact==="HIGH"?T.green+"22":s.impact==="TRANSFORMATIVE"?"#ff006e22":T.gold+"22",color:s.impact==="HIGH"?T.green:s.impact==="TRANSFORMATIVE"?"#ff006e":T.gold,...mono}}>{s.impact}</span>
                          <span style={{...orb,fontSize:10,color:T.green}}>{s.score}%</span>
                        </div>
                      </div>
                      <div style={{height:4,background:T.bg3,borderRadius:2,overflow:"hidden",marginBottom:6}}>
                        <div style={{width:`${s.score}%`,height:"100%",background:T.green,boxShadow:`0 0 6px ${T.green}44`}}/>
                      </div>
                      <div style={{fontSize:11,color:T.muted,...raj,lineHeight:1.6}}>{s.detail}</div>
                    </div>
                  ))}
                </div>
                {/* Weaknesses */}
                <div style={{...C({padding:"13px",marginBottom:12,border:`1px solid ${T.orange}33`})}}>
                  <div style={{fontSize:9,color:T.orange,letterSpacing:2,...mono,marginBottom:10}}>⚠️ GAPS TO ADDRESS</div>
                  {RUDRA_ANALYSIS.weaknesses.map((w,i)=>(
                    <div key={i} style={{marginBottom:10,padding:"10px 12px",background:T.bg2,borderRadius:8,border:`1px solid ${T.orange}22`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                        <span style={{fontSize:12,color:T.bright,...raj,fontWeight:600}}>{w.area}</span>
                        <div style={{display:"flex",gap:6,alignItems:"center"}}>
                          <span style={{fontSize:8,padding:"2px 6px",borderRadius:8,background:w.impact==="HIGH"?T.red+"22":T.gold+"22",color:w.impact==="HIGH"?T.red:T.gold,...mono}}>{w.impact}</span>
                          <span style={{...orb,fontSize:10,color:T.orange}}>{w.score}%</span>
                        </div>
                      </div>
                      <div style={{height:4,background:T.bg3,borderRadius:2,overflow:"hidden",marginBottom:6}}>
                        <div style={{width:`${w.score}%`,height:"100%",background:T.orange}}/>
                      </div>
                      <div style={{fontSize:11,color:T.muted,...raj,lineHeight:1.6}}>{w.detail}</div>
                    </div>
                  ))}
                </div>
                {/* Competitive edge */}
                <div style={{...C({padding:"13px",border:`1px solid ${T.gold}44`})}}>
                  <div style={{fontSize:9,color:T.gold,letterSpacing:2,...mono,marginBottom:10}}>⚡ YOUR COMPETITIVE EDGE — WHAT OTHERS DON'T HAVE</div>
                  {RUDRA_ANALYSIS.competitiveEdge.map((e,i)=>(
                    <div key={i} style={{display:"flex",gap:10,marginBottom:8,padding:"8px 10px",background:T.gold+"0d",borderRadius:7,border:`1px solid ${T.gold}22`}}>
                      <span style={{color:T.gold,flexShrink:0,fontSize:12}}>⚡</span>
                      <div style={{fontSize:11,color:T.bright,...raj,lineHeight:1.6}}>{e}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── PROFESSOR CRM ── */}
            {goalsSubTab==="profs"&&(
              <div>
                <div style={{...C({padding:"13px",marginBottom:12,background:"linear-gradient(135deg,#020408,#040814)",border:`1px solid ${T.blue}44`})}}>
                  <div style={{fontSize:9,color:T.blue,letterSpacing:2,...mono,marginBottom:6}}>📧 PROFESSOR EMAIL TRACKER</div>
                  <div style={{fontSize:11,color:T.text,...raj,lineHeight:1.7,marginBottom:10}}>Email KUET professors BEFORE the circular opens. A professor who already knows your name gets curious when they see your application. That curiosity = interview advantage.</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    {[{l:"Emailed",v:Object.values(profEmailDone).filter(v=>v==="emailed"||v==="replied").length,c:T.blue},{l:"Replied",v:Object.values(profEmailDone).filter(v=>v==="replied").length,c:T.green}].map((s,i)=>(
                      <div key={i} style={{background:s.c+"11",border:`1px solid ${s.c}22`,borderRadius:8,padding:"8px",textAlign:"center"}}>
                        <div style={{...orb,fontSize:18,fontWeight:900,color:s.c}}>{s.v}</div>
                        <div style={{fontSize:8,color:T.muted,...mono,marginTop:2}}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* KUET professors */}
                <div style={{...C({padding:"13px",marginBottom:12})}}>
                  <div style={{fontSize:9,color:T.green,letterSpacing:2,...mono,marginBottom:10}}>🥇 KUET CSE PROFESSORS TO EMAIL</div>
                  {KUET_PROFS.map((p,i)=>{
                    const status=profEmailDone[p.email]||"pending";
                    return(
                      <div key={i} style={{...C({padding:"12px",marginBottom:8,border:`1px solid ${status==="replied"?T.green+"55":status==="emailed"?T.blue+"44":T.border}`})}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                          <div style={{flex:1}}>
                            <div style={{fontSize:12,color:T.bright,fontWeight:600,...raj}}>{p.name}</div>
                            <div style={{fontSize:9,color:T.muted,...mono,marginTop:2}}>{p.dept} · {p.email}</div>
                          </div>
                          <div style={{display:"flex",gap:5,flexShrink:0,marginLeft:8}}>
                            <button onClick={()=>setProfEmailDone(prev=>({...prev,[p.email]:"emailed"}))} style={{padding:"4px 8px",background:status==="emailed"||status==="replied"?T.blue+"33":"transparent",border:`1px solid ${T.blue}44`,color:T.blue,borderRadius:5,fontSize:8,...mono,cursor:"pointer"}}>✉ Sent</button>
                            <button onClick={()=>setProfEmailDone(prev=>({...prev,[p.email]:"replied"}))} style={{padding:"4px 8px",background:status==="replied"?T.green+"33":"transparent",border:`1px solid ${T.green}44`,color:T.green,borderRadius:5,fontSize:8,...mono,cursor:"pointer"}}>✓ Reply</button>
                          </div>
                        </div>
                        <div style={{fontSize:10,color:T.muted,...raj,marginBottom:4}}><strong style={{color:T.blue}}>Research:</strong> {p.area}</div>
                        <div style={{fontSize:10,color:T.gold,...raj,fontStyle:"italic"}}>{p.why}</div>
                      </div>
                    );
                  })}
                </div>
                {/* SOP tips */}
                <div style={{...C({padding:"13px",border:`1px solid ${T.gold}33`})}}>
                  <div style={{fontSize:9,color:T.gold,letterSpacing:2,...mono,marginBottom:8}}>📝 SOP / STATEMENT OF PURPOSE TIPS</div>
                  {["Open with: 'I scored 32/100 in GST. I graduated 3.95 — top of my batch. This is the story of what I did in between.' — This hooks any committee.",
                    "Your National Debate Championship 2018 should be in paragraph 1. It signals communication skill — rare in CS applicants.",
                    "Explicitly name-drop Mr. Riaz Mohammed's CRO publications. 'My research builds on Dr. Mohammed's published work in...'",
                    "Mention that KUET is your hometown university — shows commitment to stay and research, not just collect a degree.",
                    "Paragraph on future: 'MSc → 1 publication → DAAD Germany or Commonwealth scholarship.' Shows you have thought beyond the MSc.",
                    "One specific paragraph on CRO+SHAP: what it does, why it matters for cancer, what makes it novel. Show you actually understand your own work."].map((t,i)=>(
                    <div key={i} style={{display:"flex",gap:8,marginBottom:8}}>
                      <div style={{width:18,height:18,borderRadius:"50%",background:T.gold+"22",border:`1px solid ${T.gold}44`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:8,color:T.gold,...orb}}>{i+1}</div>
                      <div style={{fontSize:11,color:T.text,...raj,lineHeight:1.6}}>{t}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── SCHOLARSHIPS ── */}
            {goalsSubTab==="scholarships"&&(
              <div>
                <div style={{...C({padding:"13px",marginBottom:12,background:"linear-gradient(135deg,#020408,#0a0514)",border:`2px solid ${"#a855f7"}55`})}}>
                  <div style={{fontSize:9,color:"#a855f7",letterSpacing:2,...mono,marginBottom:6}}>✈️ SCHOLARSHIP READINESS — YOUR ROADMAP ABROAD</div>
                  <div style={{fontSize:12,color:T.bright,...raj,lineHeight:1.8}}>The GST 32 to NUBTK to <strong style={{color:T.green}}>3.95 Top of Batch</strong> to CRO+SHAP thesis to MSc to <strong style={{color:"#a855f7"}}>DAAD / Commonwealth / Vanier</strong>. The arc is real. Each step is documented.</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginTop:10}}>
                    {Object.entries(RUDRA_ANALYSIS.scholarshipReadiness).map(([key,s])=>(
                      <div key={key} style={{background:"#a855f711",border:"1px solid #a855f722",borderRadius:8,padding:"7px 4px",textAlign:"center"}}>
                        <div style={{...orb,fontSize:11,fontWeight:900,color:"#a855f7"}}>{s.score}%</div>
                        <div style={{fontSize:6,color:T.muted,...mono,marginTop:2,lineHeight:1.3}}>{s.name.split(" ")[0]}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What's missing */}
                <div style={{...C({padding:"13px",marginBottom:12,border:`1px solid ${T.orange}33`})}}>
                  <div style={{fontSize:9,color:T.orange,letterSpacing:2,...mono,marginBottom:10}}>🎯 WHAT YOU STILL NEED</div>
                  {[
                    {item:"IELTS 6.5+",status:"NOT DONE",c:T.red,action:"Register Oct 2026. Study 30 min daily from July."},
                    {item:"1 Published Paper",status:"IN PROGRESS",c:T.orange,action:"CRO+SHAP paper → target Briefings in Bioinformatics or IEEE Access."},
                    {item:"MSc Degree (KUET)",status:"PLANNED",c:T.blue,action:"KUET Sep 2026 — near-certain with your profile."},
                    {item:"3 Reference Letters",status:"PLANNED",c:T.gold,action:"Mr. Riaz Mohammed (supervisor) + 2 KUET professors. Build these relationships NOW."},
                    {item:"Research Portfolio",status:"IN PROGRESS",c:T.orange,action:"GitHub repo with thesis code + published paper = world-class portfolio."},
                  ].map((r,i)=>(
                    <div key={i} style={{display:"flex",gap:10,marginBottom:8,padding:"9px 10px",background:T.bg2,borderRadius:8,border:`1px solid ${r.c}22`}}>
                      <div>
                        <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:3}}>
                          <span style={{fontSize:12,color:T.bright,...raj,fontWeight:600}}>{r.item}</span>
                          <span style={{fontSize:7,padding:"2px 6px",borderRadius:8,background:r.c+"22",color:r.c,...mono}}>{r.status}</span>
                        </div>
                        <div style={{fontSize:11,color:T.muted,...raj,lineHeight:1.5}}>{r.action}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Programs */}
                {SCHOLARSHIP_PROGRAMS.map((prog,i)=>(
                  <div key={i} style={{...C({padding:"13px",marginBottom:10,border:`1px solid ${"#a855f7"}22`})}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,color:T.bright,fontWeight:700,...raj}}>{prog.name}</div>
                        <div style={{fontSize:10,color:"#a855f7",...mono,marginTop:1}}>{prog.country} · {prog.amount}</div>
                      </div>
                      <div style={{textAlign:"right",flexShrink:0,marginLeft:8}}>
                        <div style={{fontSize:8,color:T.muted,...mono}}>IELTS {prog.ielts}+</div>
                        <div style={{fontSize:8,color:T.muted,...mono}}>Due: {prog.deadline}</div>
                      </div>
                    </div>
                    <div style={{fontSize:11,color:T.text,...raj,lineHeight:1.6,marginBottom:8}}>{prog.desc}</div>
                    <div style={{fontSize:9,color:"#a855f7",...mono,marginBottom:6}}>YOUR STEPS:</div>
                    {prog.steps.map((s,j)=>(
                      <div key={j} style={{display:"flex",gap:6,marginBottom:4}}>
                        <span style={{color:"#a855f7",fontSize:10,flexShrink:0}}>→</span>
                        <div style={{fontSize:10,color:T.muted,...raj,lineHeight:1.5}}>{s}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* ── TIMELINE ── */}
            {goalsSubTab==="timeline"&&(
              <div>
                <div style={{...C({padding:"13px",marginBottom:12,background:"linear-gradient(135deg,#020d08,#020408)",border:`1px solid ${T.green}44`})}}>
                  <div style={{fontSize:9,color:T.green,letterSpacing:2,...mono,marginBottom:8}}>📅 COMPLETE TIMELINE — NOW TO 2029</div>
                  <div style={{fontSize:11,color:T.text,...raj,lineHeight:1.8}}>This is the full path. Every step is a prerequisite for the next. Miss one and you delay the dream. Complete one and you accelerate everything after it.</div>
                </div>
                {RUDRA_ANALYSIS.timelineAnalysis.map((t,i)=>{
                  const colors={"🔴":T.red,"🟡":T.orange,"🟢":T.green,"🔵":T.blue};
                  const col=colors[t.priority[0]]||T.green;
                  return(
                    <div key={i} style={{display:"flex",gap:12,marginBottom:14}}>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
                        <div style={{width:14,height:14,borderRadius:"50%",background:col,boxShadow:`0 0 8px ${col}88`,flexShrink:0}}/>
                        {i<RUDRA_ANALYSIS.timelineAnalysis.length-1&&<div style={{width:2,flex:1,background:`linear-gradient(${col},${col}22)`,marginTop:4,minHeight:40}}/>}
                      </div>
                      <div style={{flex:1,paddingBottom:4}}>
                        <div style={{...orb,fontSize:10,fontWeight:700,color:col,marginBottom:3}}>{t.period}</div>
                        <div style={{fontSize:13,color:T.bright,...raj,fontWeight:700,marginBottom:5}}>{t.focus}</div>
                        <div style={{padding:"8px 10px",background:col+"0d",border:`1px solid ${col}22`,borderRadius:8}}>
                          {t.actions.map((a,j)=>(
                            <div key={j} style={{display:"flex",gap:6,marginBottom:j<t.actions.length-1?5:0}}>
                              <span style={{color:col,flexShrink:0,fontSize:10}}>•</span>
                              <div style={{fontSize:11,color:T.text,...raj,lineHeight:1.5}}>{a}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div style={{...C({padding:"13px",background:"linear-gradient(135deg,#0a0800,#040814)",border:`2px solid ${T.gold}55`,textAlign:"center"})}}>
                  <div style={{fontSize:32,marginBottom:8}}>🏆</div>
                  <div style={{...orb,fontSize:14,fontWeight:900,color:T.gold,marginBottom:6}}>2029 TARGET: FULLY FUNDED ABROAD</div>
                  <div style={{fontSize:12,color:T.text,...raj,lineHeight:1.8}}>DAAD Germany or Commonwealth UK. <br/>3.95 GPA → KUET MSc → 1 Publication → IELTS 6.5 → National Debate Champion → Abroad.<br/><span style={{color:T.green,fontWeight:700}}>The comeback arc is complete.</span></div>
                </div>
              </div>
            )}

            {/* timeline tab ends above */}

          </div>
        )}

      </div>
    );
  };

  // ── FOCUS TAB ──
  const Focus=()=>{
    const pomModes=[{id:"focus",label:"FOCUS",min:25},{id:"short",label:"SHORT BREAK",min:5},{id:"long",label:"LONG BREAK",min:15}];
    const mins=Math.floor(pomLeft/60),secs=pomLeft%60;
    const pomPct=Math.round(((pomModes.find(m=>m.id===pomMode).min*60-pomLeft)/(pomModes.find(m=>m.id===pomMode).min*60))*100);
    const dfMins=Math.floor(deepFocusLeft/60),dfSecs=deepFocusLeft%60;
    const dfPct=Math.round(((90*60-deepFocusLeft)/(90*60))*100);
    const r=getRank(xp);
    return(
      <div style={{padding:16}}>
        <div style={{...orb,fontSize:15,fontWeight:900,color:T.bright,marginBottom:4}}>FOCUS CONTROL</div>
        <div style={{fontSize:11,color:T.muted,marginBottom:12,...raj}}>Pomodoro · Deep Focus · Habits · XP Log · Music</div>

        {/* Tab switcher */}
        <div style={{display:"flex",background:T.bg1,borderRadius:10,border:`1px solid ${T.border}`,marginBottom:14,overflow:"hidden",overflowX:"auto"}}>
          {[{id:"pomodoro",label:"⏱"},{id:"deep",label:"🧠"},{id:"habits",label:"🔁"},{id:"xplog",label:"⚡"},{id:"music",label:"🎵"}].map(st=>(
            <div key={st.id} onClick={()=>setFocusTab(st.id)} style={{flex:1,padding:"10px 4px",textAlign:"center",cursor:"pointer",background:focusTab===st.id?T.green+"22":"transparent",borderBottom:focusTab===st.id?`2px solid ${T.green}`:"2px solid transparent",fontSize:16,color:focusTab===st.id?T.green:T.muted,transition:"all .2s",minWidth:44}}>
              {st.label}
            </div>
          ))}
        </div>

        {/* ── POMODORO ── */}
        {focusTab==="pomodoro"&&(
          <div>
            <div style={{display:"flex",gap:6,marginBottom:14}}>
              {pomModes.map(m=>(
                <button key={m.id} onClick={()=>{setPomMode(m.id);setPomLeft(m.min*60);setPomState("idle");}} style={{flex:1,padding:"8px 4px",borderRadius:8,border:`1.5px solid ${pomMode===m.id?T.green:T.border}`,background:pomMode===m.id?T.green+"22":"transparent",color:pomMode===m.id?T.green:T.muted,fontSize:9,...mono,cursor:"pointer",transition:"all .2s"}}>
                  <div style={{...orb,fontSize:12,fontWeight:700}}>{m.min}m</div>
                  <div style={{marginTop:2,fontSize:8}}>{m.label}</div>
                </button>
              ))}
            </div>
            <div style={{...C({padding:"24px 16px",marginBottom:12,textAlign:"center",border:`1px solid ${pomState==="running"?T.green+"44":T.border}`,background:pomState==="running"?"linear-gradient(135deg,#020d08,#020408)":T.bg1,transition:"all .5s"})}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:14}}>
                <Ring pct={pomPct} size={140} stroke={8} color={pomState==="running"?T.green:T.muted} label={`${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`} sublabel={pomMode==="focus"?"FOCUS":pomMode==="short"?"BREAK":"LONG BREAK"}/>
              </div>
              <div style={{display:"flex",justifyContent:"center",gap:10,marginBottom:14}}>
                <button onClick={()=>setPomState(s=>s==="running"?"paused":"running")} className="btn-tap" style={{padding:"11px 28px",borderRadius:10,border:`1.5px solid ${T.green}`,background:pomState==="running"?T.bg2:T.green+"33",color:T.green,fontSize:13,...orb,fontWeight:700,cursor:"pointer",transition:"all .2s"}}>
                  {pomState==="running"?"⏸ PAUSE":"▶ START"}
                </button>
                <button onClick={()=>{setPomState("idle");setPomLeft(pomModes.find(x=>x.id===pomMode).min*60);}} className="btn-tap" style={{padding:"11px 16px",borderRadius:10,border:`1px solid ${T.border}`,background:"transparent",color:T.muted,fontSize:11,...mono,cursor:"pointer"}}>↺</button>
              </div>
              <div style={{display:"flex",justifyContent:"center",gap:16}}>
                {[{v:pomSessions,l:"SESSIONS",c:T.gold},{v:`${pomSessions*25}m`,l:"FOCUSED",c:T.green},{v:deepFocusSessions,l:"DEEP",c:"#a855f7"}].map((s,i)=>(
                  <div key={i} style={{textAlign:"center"}}>
                    <div style={{...orb,fontSize:17,fontWeight:900,color:s.c}}>{s.v}</div>
                    <div style={{fontSize:7,color:T.muted,...mono}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{...C({padding:"12px",border:`1px solid ${T.gold}22`})}}>
              <div style={{fontSize:9,color:T.gold,letterSpacing:2,...mono,marginBottom:8}}>⚡ XP REWARDS</div>
              {[["Complete a Pomodoro","+25"],[`Deep Focus 90min`,"+75"],["Complete a task","+10"],["Workout set","+5"],["Log mood (once)","+5"],["8 glasses water","+15"],["Diary entry","+5"],["Sleep log","+20"]].map(([a,x],i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:11,color:T.text,...raj}}>{a}</span>
                  <span style={{...orb,fontSize:10,color:T.gold,fontWeight:700}}>{x} XP</span>
                </div>
              ))}
            </div>
            {/* Today's Focus Session Summary */}
            <div style={{...C({padding:"12px",marginTop:10,border:`1px solid ${T.green}22`})}}>
              <div style={{fontSize:9,color:T.green,letterSpacing:2,...mono,marginBottom:10}}>📊 TODAY'S FOCUS SUMMARY</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                {[
                  {v:pomSessions,l:"POMODOROS",c:T.green,sub:`${pomSessions*25}m focused`},
                  {v:deepFocusSessions,l:"DEEP SESSIONS",c:"#a855f7",sub:`${deepFocusSessions*90}m flow`},
                  {v:xp,l:"TOTAL XP",c:T.gold,sub:`LVL ${xpLevel}`},
                ].map((s,i)=>(
                  <div key={i} style={{background:s.c+"11",border:`1px solid ${s.c}22`,borderRadius:8,padding:"10px 6px",textAlign:"center"}}>
                    <div style={{...orb,fontSize:18,fontWeight:900,color:s.c}}>{s.v}</div>
                    <div style={{fontSize:7,color:T.muted,...mono,marginTop:2}}>{s.l}</div>
                    <div style={{fontSize:8,color:s.c,...mono,marginTop:2,opacity:.7}}>{s.sub}</div>
                  </div>
                ))}
              </div>
              {pomSessions>0&&(
                <div style={{marginTop:10,height:4,background:T.bg2,borderRadius:2,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${Math.min(100,(pomSessions/8)*100)}%`,background:`linear-gradient(90deg,${T.green},${T.gold})`,borderRadius:2,transition:"width .5s"}}/>
                </div>
              )}
              {pomSessions>0&&<div style={{fontSize:8,color:T.muted,...mono,marginTop:4,textAlign:"right"}}>{pomSessions}/8 sessions · {Math.round((pomSessions/8)*100)}% of daily goal</div>}
            </div>
          </div>
        )}

        {/* ── DEEP FOCUS 90 MIN ── */}
        {focusTab==="deep"&&(
          <div>
            <div style={{...C({padding:"20px",marginBottom:12,border:`1px solid ${"#a855f7"}44`,background:deepFocusSt==="running"?"linear-gradient(135deg,#0d0820,#020408)":T.bg1,transition:"all .5s",textAlign:"center"})}}>
              <div style={{fontSize:9,color:"#a855f7",letterSpacing:3,...mono,marginBottom:4}}>🧠 DEEP FOCUS — FLOW STATE</div>
              <div style={{fontSize:11,color:T.muted,...raj,marginBottom:16}}>90 uninterrupted minutes · No phone · Pure output · +75 XP</div>
              <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
                <Ring pct={dfPct} size={150} stroke={9} color={deepFocusSt==="running"?"#a855f7":T.muted} label={`${String(dfMins).padStart(2,"0")}:${String(dfSecs).padStart(2,"0")}`} sublabel="DEEP FOCUS"/>
              </div>
              {deepFocusSt==="running"&&(
                <div style={{...C({padding:"10px",marginBottom:12,background:"#a855f711",border:`1px solid ${"#a855f7"}33`})}}>
                  <div style={{fontSize:11,color:"#a855f7",textAlign:"center",...raj}}>⚠️ LOCK IN — no social media, no distractions</div>
                  <div style={{fontSize:10,color:T.muted,textAlign:"center",marginTop:4,...mono}}>phone face-down · door closed · headphones on</div>
                </div>
              )}
              <div style={{display:"flex",justifyContent:"center",gap:10}}>
                <button onClick={()=>{
                  if(deepFocusSt==="idle"){setDeepFocusSt("running");setDeepFocusLeft(90*60);}
                  else if(deepFocusSt==="running"){setDeepFocusSt("paused");}
                  else{setDeepFocusSt("running");}
                }} className="btn-tap" style={{padding:"12px 32px",borderRadius:10,border:`1.5px solid ${"#a855f7"}`,background:deepFocusSt==="running"?T.bg2:"#a855f733",color:"#a855f7",fontSize:13,...orb,fontWeight:700,cursor:"pointer"}}>
                  {deepFocusSt==="idle"?"⚡ ENTER FLOW":deepFocusSt==="running"?"⏸ PAUSE":"▶ RESUME"}
                </button>
                {deepFocusSt!=="idle"&&<button onClick={()=>{setDeepFocusSt("idle");setDeepFocusLeft(90*60);}} className="btn-tap" style={{padding:"12px 16px",borderRadius:10,border:`1px solid ${T.border}`,background:"transparent",color:T.muted,fontSize:11,...mono,cursor:"pointer"}}>↺</button>}
              </div>
            </div>
            <div style={{...C({padding:"14px",border:`1px solid ${"#a855f7"}22`})}}>
              <div style={{fontSize:9,color:"#a855f7",letterSpacing:2,...mono,marginBottom:10}}>DEEP FOCUS PROTOCOL</div>
              {["Before starting: write your one main goal for this session","Phone completely silent and face-down","Use the study playlist on 🎵 tab for max focus","After 90 min: 20 min break, then evaluate output","Rate yourself honestly — quality > quantity"].map((t,i)=>(
                <div key={i} style={{display:"flex",gap:8,marginBottom:7}}>
                  <div style={{width:18,height:18,borderRadius:"50%",background:"#a855f722",border:"1px solid #a855f744",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:9,color:"#a855f7",...orb}}>{i+1}</div>
                  <div style={{fontSize:11,color:T.text,...raj,lineHeight:1.5}}>{t}</div>
                </div>
              ))}
              <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:11,color:T.muted,...raj}}>Sessions completed</span>
                <span style={{...orb,fontSize:15,fontWeight:900,color:"#a855f7"}}>{deepFocusSessions}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── HABITS ── */}
        {focusTab==="habits"&&(
          <div>
            <div style={{...C({padding:"14px",marginBottom:12})}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontSize:9,color:T.muted,letterSpacing:2,...mono}}>TODAY'S HABITS</div>
                <button onClick={()=>setShowAddHabit(!showAddHabit)} style={{fontSize:9,color:T.green,background:"transparent",border:`1px solid ${T.green}44`,borderRadius:6,padding:"3px 9px",cursor:"pointer",...mono}}>{showAddHabit?"✕":"+ ADD"}</button>
              </div>
              {showAddHabit&&(
                <div style={{display:"flex",gap:6,marginBottom:12}}>
                  <input value={newHabitName} onChange={e=>setNewHabitName(e.target.value)} placeholder="New habit name..." style={{flex:1,background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"7px 10px",color:T.bright,fontSize:12,...raj}}/>
                  <button onClick={()=>{if(!newHabitName.trim())return;setHabits(h=>[...h,{id:"h"+Date.now(),name:newHabitName,streak:0,lastDone:null,color:T.green}]);setNewHabitName("");setShowAddHabit(false);}} className="btn-tap" style={{padding:"7px 12px",background:T.green+"33",border:`1px solid ${T.green}55`,color:T.green,borderRadius:7,fontSize:11,...mono,cursor:"pointer"}}>ADD</button>
                </div>
              )}
              {habits.map(h=>{
                const doneTdy=h.lastDone===TODAY;
                return(
                  <div key={h.id} style={{marginBottom:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div onClick={()=>{
                        const newKey=`${TODAY}_habit_${h.id}`;
                        if(!doneTdy){
                          setHabits(p=>p.map(x=>x.id===h.id?{...x,lastDone:TODAY,streak:x.streak+1}:x));
                          setHabitHistory(p=>({...p,[newKey]:true}));
                          gainXP(10,`${h.name} ✅`);
                        } else {
                          setHabits(p=>p.map(x=>x.id===h.id?{...x,lastDone:null,streak:Math.max(0,x.streak-1)}:x));
                          setHabitHistory(p=>{const n={...p};delete n[newKey];return n;});
                          takeXP(10,`${h.name} undone ↩`);
                        }
                      }} style={{width:28,height:28,borderRadius:8,border:`2px solid ${doneTdy?h.color:T.border}`,background:doneTdy?h.color+"33":"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"all .2s",boxShadow:doneTdy?`0 0 8px ${h.color}44`:"none"}}>
                        {doneTdy&&<span style={{color:h.color,fontSize:14,fontWeight:900}}>✓</span>}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,color:doneTdy?h.color:T.bright,fontWeight:600,...raj}}>{h.name}</div>
                        <div style={{fontSize:9,color:T.muted,...mono,marginTop:1}}>🔥 {h.streak} day streak{doneTdy?" · done today":""}</div>
                      </div>
                      <button onClick={()=>setShowHabitCal(showHabitCal===h.id?null:h.id)} style={{fontSize:9,color:T.muted,background:"transparent",border:`1px solid ${T.border}`,borderRadius:5,padding:"2px 7px",cursor:"pointer",...mono}}>📅</button>
                      <button onClick={()=>setHabits(p=>p.filter(x=>x.id!==h.id))} style={{background:"transparent",border:"none",color:T.muted,fontSize:16,cursor:"pointer",lineHeight:1}}>×</button>
                    </div>
                    {/* 30-day habit calendar */}
                    {showHabitCal===h.id&&(
                      <div style={{marginTop:8,padding:"10px",background:T.bg2,borderRadius:8,border:`1px solid ${h.color}33`}}>
                        <div style={{fontSize:8,color:h.color,letterSpacing:2,...mono,marginBottom:6}}>30-DAY HISTORY</div>
                        <div style={{display:"grid",gridTemplateColumns:"repeat(10,1fr)",gap:3}}>
                          {Array.from({length:30},(_,i)=>{
                            const d=new Date(Date.now()-(29-i)*86400000);
                            const dk=`${d.toDateString()}_habit_${h.id}`;
                            const done=!!habitHistory[dk]||(i===29&&h.lastDone===TODAY);
                            return(
                              <div key={i} style={{aspectRatio:"1",borderRadius:2,background:done?h.color+"88":T.border,title:d.toLocaleDateString()}}/>
                            );
                          })}
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                          <span style={{fontSize:7,color:T.muted,...mono}}>30d ago</span>
                          <span style={{fontSize:7,color:h.color,...mono}}>Today</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{...C({padding:"12px",border:`1px solid ${T.orange}22`})}}>
              <div style={{fontSize:9,color:T.orange,letterSpacing:2,...mono,marginBottom:8}}>📊 HABIT STATS</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                {[{l:"TOTAL",v:habits.length,c:T.blue},{l:"DONE TODAY",v:habits.filter(h=>h.lastDone===TODAY).length,c:T.green},{l:"BEST STREAK",v:Math.max(0,...habits.map(h=>h.streak)),c:T.gold}].map((s,i)=>(
                  <div key={i} style={{background:s.c+"11",border:`1px solid ${s.c}22`,borderRadius:8,padding:"8px",textAlign:"center"}}>
                    <div style={{...orb,fontSize:18,fontWeight:700,color:s.c}}>{s.v}</div>
                    <div style={{fontSize:7,color:T.muted,...mono,marginTop:2}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── XP LOG ── */}
        {focusTab==="xplog"&&(()=>{
          const r2=getRank(xp);
          const nextRank=XP_RANKS.find(rk=>rk.min>xp)||{min:xp+100,title:"MAX"};
          const toNext=nextRank.min-xp;
          const pctToNext=Math.round(((xp-r2.min)/(nextRank.min-r2.min))*100)||0;
          return(
            <div>
              <div style={{...C({padding:"18px",marginBottom:12,background:`linear-gradient(135deg,#0a0800,#040814)`,border:`2px solid ${r2.color}66`})}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                  <div>
                    <div style={{fontSize:9,color:r2.color,letterSpacing:3,...mono}}>COMEBACK RANK</div>
                    <div style={{...orb,fontSize:24,fontWeight:900,color:r2.color,textShadow:`0 0 20px ${r2.color}66`,lineHeight:1.1}}>{r2.title}</div>
                    <div style={{fontSize:11,color:T.muted,...raj,marginTop:4}}>Level {xpLevel} · {xp} total XP</div>
                  </div>
                  <div style={{background:r2.color+"22",border:`1px solid ${r2.color}44`,borderRadius:10,padding:"10px 14px",textAlign:"center"}}>
                    <div style={{...orb,fontSize:32,fontWeight:900,color:r2.color,lineHeight:1}}>{xpLevel}</div>
                    <div style={{fontSize:8,color:r2.color,...mono}}>LEVEL</div>
                  </div>
                </div>
                <div style={{marginBottom:5,display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:8,color:T.muted,...mono}}>{r2.title}</span>
                  <span style={{fontSize:8,color:r2.color,...mono}}>{toNext} XP to {nextRank.title}</span>
                </div>
                <div style={{height:8,background:"#0a0f0a",borderRadius:4,overflow:"hidden",border:`1px solid ${r2.color}22`}}>
                  <div style={{width:`${Math.max(2,pctToNext)}%`,height:"100%",background:`linear-gradient(90deg,${r2.color}88,${r2.color})`,boxShadow:`0 0 8px ${r2.color}66`,borderRadius:4,transition:"width .6s"}}/>
                </div>
                {/* Today's daily score breakdown */}
                <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${T.border}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div style={{fontSize:8,color:T.muted,letterSpacing:2,...mono}}>TODAY'S DAILY SCORE</div>
                    <div style={{...orb,fontSize:18,fontWeight:900,color:scoreColor}}>{scoreGrade} · {dailyScore}/100</div>
                  </div>
                  <div style={{height:5,background:T.bg2,borderRadius:3,overflow:"hidden"}}>
                    <div style={{width:`${dailyScore}%`,height:"100%",background:`linear-gradient(90deg,${scoreColor}88,${scoreColor})`,borderRadius:3,transition:"width .6s"}}/>
                  </div>
                </div>
              </div>
              <div style={{...C({padding:"14px",marginBottom:12})}}>
                <div style={{fontSize:9,color:T.muted,letterSpacing:2,...mono,marginBottom:12}}>RANK PROGRESSION</div>
                {XP_RANKS.map((rk,i)=>{
                  const reached=xp>=rk.min;
                  const isCurrent=reached&&(i===XP_RANKS.length-1||xp<XP_RANKS[i+1].min);
                  return(
                    <div key={i} style={{display:"flex",gap:12,alignItems:"center",marginBottom:i<XP_RANKS.length-1?10:0}}>
                      <div style={{width:10,height:10,borderRadius:"50%",background:reached?rk.color:T.border,boxShadow:reached?`0 0 8px ${rk.color}88`:"none",flexShrink:0,transition:"all .3s"}}/>
                      <div style={{flex:1}}>
                        <div style={{fontSize:12,color:reached?rk.color:T.muted,...raj,fontWeight:isCurrent?700:400}}>{rk.title}{isCurrent?" ← YOU":""}</div>
                        <div style={{fontSize:9,color:T.dim,...mono}}>{rk.min} XP{i<XP_RANKS.length-1?` → ${XP_RANKS[i+1].min} XP`:""}</div>
                      </div>
                      {reached&&<span style={{fontSize:10,color:rk.color}}>✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ── MUSIC ── */}
        {focusTab==="music"&&(
          <div>
            <div style={{...C({padding:"14px",marginBottom:12,border:`1px solid ${T.green}22`})}}>
              <div style={{fontSize:9,color:T.green,letterSpacing:2,...mono,marginBottom:4}}>🎵 STUDY PLAYLISTS</div>
              <div style={{fontSize:11,color:T.muted,...raj,marginBottom:12}}>Opens YouTube. Best with headphones. Close all other tabs.</div>
              {PLAYLISTS.map((p,i)=>(
                <div key={i} className="hovlift" onClick={()=>window.open(p.url,"_blank")} style={{display:"flex",gap:12,alignItems:"center",padding:"12px",marginBottom:8,background:T.bg2,border:`1px solid ${p.color}33`,borderRadius:10,cursor:"pointer",transition:"all .2s"}}>
                  <span style={{fontSize:24,flexShrink:0}}>{p.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,color:T.bright,fontWeight:600,...raj}}>{p.name}</div>
                    <div style={{fontSize:10,color:T.muted,...mono,marginTop:2}}>{p.desc}</div>
                  </div>
                  <div style={{fontSize:9,color:p.color,background:p.color+"22",padding:"3px 8px",borderRadius:8,...mono,flexShrink:0}}>PLAY →</div>
                </div>
              ))}
            </div>
            <div style={{...C({padding:"12px",border:`1px solid ${"#a855f7"}22`})}}>
              <div style={{fontSize:9,color:"#a855f7",letterSpacing:2,...mono,marginBottom:6}}>💡 FOCUS SCIENCE</div>
              {["Lo-fi & ambient music reduce cortisol by 60%","40Hz binaural beats increase gamma brain waves","Classical music improves spatial-temporal reasoning","Silence is best for reading complex material — use noise-cancelling","Match music energy to task: heavy = coding, calm = writing"].map((t,i)=>(
                <div key={i} style={{fontSize:11,color:T.text,...raj,marginBottom:5,paddingLeft:8,borderLeft:`2px solid ${"#a855f7"}44`}}>{t}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── LIFE TAB — IELTS · Music · Freelance · Prof CRM · Papers · Smoke ──────
  const Life=()=>{
    const ieltsTotal=ieltsVocab.length;
    const ieltsAvg=ieltsMocks.length>0?(ieltsMocks.reduce((a,m)=>(a+(m.r+m.w+m.l+m.s)/4),0)/ieltsMocks.length).toFixed(1):0;
    const lastMock=ieltsMocks[ieltsMocks.length-1]||null;
    const totalFreelance=freelanceLog.filter(f=>f.status==="Earned").reduce((a,f)=>a+Number(f.amount||0),0);
    const profEmailed=profCRM.filter(p=>p.emailed).length;
    const profReplied=profCRM.filter(p=>p.replied).length;
    const curSmoke=smokingLog.length>0?smokingLog[smokingLog.length-1].count:10;
    const daysToQuitGoal=Math.max(0,Math.floor((new Date(smokeGoalDate)-new Date())/86400000));

    return(
      <div style={{}}>
        {/* Sub-tab nav */}
        <div style={{display:"flex",background:T.bg1,borderBottom:`1px solid ${T.border}`,overflowX:"auto"}}>
          {[
            {id:"ielts",  l:"🌍 IELTS"},
            {id:"music",  l:"🎵 MUSIC"},
            {id:"hustle", l:"💰 HUSTLE"},
            {id:"profs",  l:"📧 PROFS"},
            {id:"papers", l:"📄 PAPERS"},
            {id:"quit",   l:"🚭 QUIT"},
          ].map(s=>(
            <div key={s.id} onClick={()=>setLifeTab(s.id)} style={{padding:"10px 10px",cursor:"pointer",borderBottom:lifeTab===s.id?`2px solid ${T.green}`:"2px solid transparent",background:lifeTab===s.id?"#00ff8808":"transparent",fontSize:10,color:lifeTab===s.id?T.green:T.muted,...mono,whiteSpace:"nowrap",transition:"all .2s"}}>{s.l}</div>
          ))}
        </div>

        {/* ── IELTS PREP ── */}
        {lifeTab==="ielts"&&(
          <div style={{padding:16}}>
            {/* Header stats */}
            <div style={{...C({padding:"14px",marginBottom:12,border:`1px solid ${T.gold}44`,background:"linear-gradient(135deg,#0a0800,transparent)"})}}>
              <div style={{fontSize:9,color:T.gold,letterSpacing:2,...mono,marginBottom:10}}>🌍 IELTS MISSION CONTROL</div>
              <div style={{fontSize:11,color:T.muted,...raj,marginBottom:12}}>Target: <strong style={{color:T.green}}>6.5 overall</strong> (7.0 for top scholarships) · Exam: Sept–Oct 2026</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                {[
                  {l:"VOCAB",v:ieltsTotal,s:"words",c:T.blue},
                  {l:"MOCK AVG",v:ieltsAvg||"—",s:"band",c:T.gold},
                  {l:"MOCKS DONE",v:ieltsMocks.length,s:"tests",c:"#a855f7"},
                ].map((s,i)=>(
                  <div key={i} style={{background:s.c+"11",border:`1px solid ${s.c}22`,borderRadius:8,padding:"8px",textAlign:"center"}}>
                    <div style={{...orb,fontSize:20,fontWeight:900,color:s.c}}>{s.v}</div>
                    <div style={{fontSize:7,color:T.muted,...mono,marginTop:2}}>{s.l}</div>
                    <div style={{fontSize:8,color:s.c+"88",...mono}}>{s.s}</div>
                  </div>
                ))}
              </div>
              {lastMock&&(
                <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${T.border}`}}>
                  <div style={{fontSize:9,color:T.muted,...mono,marginBottom:6}}>LAST MOCK — {lastMock.date}</div>
                  <div style={{display:"flex",gap:8}}>
                    {[["R",lastMock.r,T.blue],["W",lastMock.w,T.green],["L",lastMock.l,T.orange],["S",lastMock.s,"#a855f7"]].map(([k,v,c])=>(
                      <div key={k} style={{flex:1,textAlign:"center",background:c+"11",borderRadius:6,padding:"6px 2px"}}>
                        <div style={{...orb,fontSize:16,fontWeight:900,color:Number(v)>=7?T.green:Number(v)>=6?T.gold:T.red}}>{v}</div>
                        <div style={{fontSize:8,color:T.muted,...mono}}>{k}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* IELTS sub-tabs */}
            <div style={{display:"flex",gap:6,marginBottom:12}}>
              {["vocab","mock","guide"].map(t=>(
                <button key={t} onClick={()=>setIeltsTab(t)} style={{flex:1,padding:"7px 4px",borderRadius:8,border:`1px solid ${ieltsTab===t?T.gold:T.border}`,background:ieltsTab===t?T.gold+"22":"transparent",color:ieltsTab===t?T.gold:T.muted,...mono,fontSize:9,cursor:"pointer",textTransform:"uppercase"}}>{t}</button>
              ))}
            </div>

            {ieltsTab==="vocab"&&(
              <div>
                <button onClick={()=>setShowIeltsWord(s=>!s)} style={{width:"100%",padding:"10px",background:T.blue+"22",border:`1px solid ${T.blue}44`,color:T.blue,borderRadius:9,...mono,fontSize:10,cursor:"pointer",marginBottom:10}}>{showIeltsWord?"✕ CANCEL":"+ ADD WORD"}</button>
                {showIeltsWord&&(
                  <div style={{...C({padding:"13px",marginBottom:10,border:`1px solid ${T.blue}44`})}}>
                    {[["word","Academic word..."],["meaning","Bengali or English meaning"],["example","Use it in a sentence"]].map(([k,ph])=>(
                      <input key={k} value={ieltsNewWord[k]} onChange={e=>setIeltsNewWord(p=>({...p,[k]:e.target.value}))} placeholder={ph} style={{width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",color:T.bright,fontSize:12,...raj,marginBottom:8,boxSizing:"border-box"}}/>
                    ))}
                    <button onClick={()=>{if(!ieltsNewWord.word.trim())return;setIeltsVocab(p=>[{id:Date.now(),...ieltsNewWord,date:new Date().toLocaleDateString()},  ...p]);setIeltsNewWord({word:"",meaning:"",example:""});setShowIeltsWord(false);gainXP(2,"Vocab word added 📖");}} style={{width:"100%",padding:"9px",background:T.blue+"33",border:`1px solid ${T.blue}55`,color:T.blue,borderRadius:7,...mono,fontSize:10,cursor:"pointer"}}>SAVE WORD</button>
                  </div>
                )}
                {/* Flashcard random */}
                {ieltsVocab.length>0&&(
                  <div onClick={()=>setVocabFlip(v=>v===null?Math.floor(Math.random()*ieltsVocab.length):null)} style={{...C({padding:"16px",marginBottom:10,textAlign:"center",cursor:"pointer",border:`1px solid ${T.blue}33`,background:T.blue+"06"})}}>
                    <div style={{fontSize:9,color:T.blue,...mono,marginBottom:8}}>🃏 FLASHCARD — TAP TO {vocabFlip===null?"REVEAL":"HIDE"}</div>
                    {vocabFlip!==null&&ieltsVocab[vocabFlip%ieltsVocab.length]?(
                      <div>
                        <div style={{...orb,fontSize:20,fontWeight:700,color:T.bright,marginBottom:6}}>{ieltsVocab[vocabFlip%ieltsVocab.length].word}</div>
                        <div style={{fontSize:13,color:T.gold,...raj,marginBottom:4}}>{ieltsVocab[vocabFlip%ieltsVocab.length].meaning}</div>
                        <div style={{fontSize:11,color:T.muted,...raj,fontStyle:"italic"}}>"{ieltsVocab[vocabFlip%ieltsVocab.length].example}"</div>
                      </div>
                    ):(
                      <div style={{...orb,fontSize:18,color:T.muted}}>? ? ?</div>
                    )}
                    <div style={{fontSize:8,color:T.blue,...mono,marginTop:8}}>TAP FOR RANDOM CARD · {ieltsVocab.length} total</div>
                  </div>
                )}
                <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:320,overflowY:"auto"}}>
                  {ieltsVocab.map((w,i)=>(
                    <div key={w.id||i} style={{...C({padding:"10px 12px"})}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                        <div style={{flex:1}}>
                          <div style={{...orb,fontSize:13,fontWeight:700,color:T.blue}}>{w.word}</div>
                          <div style={{fontSize:11,color:T.gold,...raj,marginTop:2}}>{w.meaning}</div>
                          {w.example&&<div style={{fontSize:10,color:T.muted,...raj,marginTop:2,fontStyle:"italic"}}>"{w.example}"</div>}
                        </div>
                        <button onClick={()=>setIeltsVocab(p=>p.filter((_,j)=>j!==i))} style={{background:"transparent",border:"none",color:T.muted,fontSize:16,cursor:"pointer"}}>×</button>
                      </div>
                    </div>
                  ))}
                  {ieltsVocab.length===0&&<div style={{textAlign:"center",padding:"24px",color:T.muted,...raj}}>No words yet. Add 10 new words every day.</div>}
                </div>
              </div>
            )}

            {ieltsTab==="mock"&&(
              <div>
                <button onClick={()=>setShowIeltsMock(s=>!s)} style={{width:"100%",padding:"10px",background:T.gold+"22",border:`1px solid ${T.gold}44`,color:T.gold,borderRadius:9,...mono,fontSize:10,cursor:"pointer",marginBottom:10}}>{showIeltsMock?"✕ CANCEL":"+ LOG MOCK TEST"}</button>
                {showIeltsMock&&(
                  <div style={{...C({padding:"13px",marginBottom:10,border:`1px solid ${T.gold}44`})}}>
                    <input type="date" value={ieltsNewMock.date} onChange={e=>setIeltsNewMock(p=>({...p,date:e.target.value}))} style={{width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",color:T.tx,fontSize:11,...mono,marginBottom:8,boxSizing:"border-box"}}/>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:8}}>
                      {[["r","Reading"],["w","Writing"],["l","Listening"],["s","Speaking"]].map(([k,l])=>(
                        <div key={k} style={{textAlign:"center"}}>
                          <div style={{fontSize:8,color:T.muted,...mono,marginBottom:3}}>{l.slice(0,3).toUpperCase()}</div>
                          <input type="number" value={ieltsNewMock[k]} onChange={e=>setIeltsNewMock(p=>({...p,[k]:e.target.value}))} placeholder="0" min="0" max="9" step="0.5" style={{width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 4px",color:T.bright,fontSize:14,...orb,fontWeight:700,textAlign:"center",boxSizing:"border-box"}}/>
                        </div>
                      ))}
                    </div>
                    <button onClick={()=>{setIeltsMocks(p=>[...p,{...ieltsNewMock,id:Date.now()}]);setIeltsNewMock({date:"",r:0,w:0,l:0,s:0});setShowIeltsMock(false);gainXP(20,"IELTS mock completed! 🌍");}} style={{width:"100%",padding:"9px",background:T.gold+"33",border:`1px solid ${T.gold}55`,color:T.gold,borderRadius:7,...mono,fontSize:10,cursor:"pointer"}}>SAVE MOCK SCORE</button>
                  </div>
                )}
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {ieltsMocks.slice().reverse().map((m,i)=>{
                    const avg=((Number(m.r)+Number(m.w)+Number(m.l)+Number(m.s))/4).toFixed(1);
                    const col=Number(avg)>=7?T.green:Number(avg)>=6.5?T.gold:Number(avg)>=6?T.orange:T.red;
                    return(
                      <div key={m.id||i} style={{...C({padding:"12px",border:`1px solid ${col}33`})}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                          <span style={{fontSize:11,color:T.muted,...mono}}>{m.date}</span>
                          <span style={{...orb,fontSize:16,fontWeight:900,color:col}}>Band {avg}</span>
                        </div>
                        <div style={{display:"flex",gap:6}}>
                          {[["R",m.r,T.blue],["W",m.w,T.green],["L",m.l,T.orange],["S",m.s,"#a855f7"]].map(([k,v,c])=>(
                            <div key={k} style={{flex:1,textAlign:"center",background:c+"11",borderRadius:6,padding:"5px 2px"}}>
                              <div style={{...orb,fontSize:14,color:c}}>{v}</div>
                              <div style={{fontSize:7,color:T.muted,...mono}}>{k}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {ieltsMocks.length===0&&<div style={{textAlign:"center",padding:"24px",color:T.muted,...raj}}>No mocks yet. Take your first practice test now.</div>}
                </div>
              </div>
            )}

            {ieltsTab==="guide"&&(
              <div>
                {[
                  {title:"Target Score",c:T.green,items:["Overall: 6.5 minimum for most MSc abroad","7.0 for DAAD Germany, Commonwealth UK, top scholarships","Reading: aim 7.0 (strongest for a researcher)","Writing: 6.5 — Task 2 essays need practice NOW","Listening: 7.0 — achievable with 30 min daily practice","Speaking: 6.5 — debate background makes this your strength"]},
                  {title:"Daily IELTS Plan",c:T.blue,items:["10 new academic words per day — save in vocab tab","15 min listening: BBC 6 Minute English (free on YouTube)","1 reading passage per day (Cambridge IELTS books 14–19)","Sunday: full 40-minute timed writing practice","Speaking: record yourself on phone, listen back critically"]},
                  {title:"Resources (All Free)",c:T.gold,items:["Cambridge IELTS books 14–19 (PDFs widely available)","E2 IELTS YouTube — best free video prep channel","IELTS.org practice materials — official free tests","BBC Learning English website — vocabulary and grammar","Magoosh IELTS blog — writing task 2 templates and tips"]},
                  {title:"Exam Registration",c:"#a855f7",items:["Target date: September–October 2026","Register at: ielts.org or britishcouncil.org.bd","Dhaka British Council or Khulna IDP centre","Fee: ~Tk 18,000–20,000 (plan budget now)","Results in 13 calendar days — in time for KU November deadline"]},
                ].map((sec,i)=>(
                  <div key={i} style={{...C({padding:"13px",marginBottom:8,border:`1px solid ${sec.c}33`})}}>
                    <div style={{fontSize:9,color:sec.c,letterSpacing:2,...mono,marginBottom:8}}>{sec.title.toUpperCase()}</div>
                    {sec.items.map((it,j)=><div key={j} style={{fontSize:11,color:T.text,...raj,marginBottom:5,lineHeight:1.5}}>→ {it}</div>)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MUSIC & SINGING ── */}
        {lifeTab==="music"&&(
          <div style={{padding:16}}>
            <div style={{...C({padding:"14px",marginBottom:12,background:"linear-gradient(135deg,#0d0820,transparent)",border:`1px solid ${"#a855f7"}44`})}}>
              <div style={{fontSize:9,color:"#a855f7",letterSpacing:2,...mono,marginBottom:8}}>🎵 MUSICAL IDENTITY</div>
              <div style={{fontSize:12,color:T.bright,...raj,lineHeight:1.8}}>National-level singing champion. Performer. Musician. This is not a hobby — it is part of who you are. Log your practice. Track your voice.</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:12}}>
                <div style={{background:"#a855f711",border:"1px solid #a855f733",borderRadius:8,padding:"10px",textAlign:"center"}}>
                  <div style={{...orb,fontSize:20,fontWeight:900,color:"#a855f7"}}>{musicLog.length}</div>
                  <div style={{fontSize:8,color:T.muted,...mono}}>SESSIONS LOGGED</div>
                </div>
                <div style={{background:T.gold+"11",border:`1px solid ${T.gold}33`,borderRadius:8,padding:"10px",textAlign:"center"}}>
                  <div style={{...orb,fontSize:20,fontWeight:900,color:T.gold}}>{musicLog.filter(m=>m.type==="Practice").reduce((a,m)=>a+Number(m.duration||0),0)}m</div>
                  <div style={{fontSize:8,color:T.muted,...mono}}>PRACTICE TIME</div>
                </div>
              </div>
            </div>
            <button onClick={()=>setShowMusicForm(s=>!s)} style={{width:"100%",padding:"10px",background:"#a855f722",border:"1px solid #a855f744",color:"#a855f7",borderRadius:9,...mono,fontSize:10,cursor:"pointer",marginBottom:10}}>{showMusicForm?"✕ CANCEL":"+ LOG SESSION"}</button>
            {showMusicForm&&(
              <div style={{...C({padding:"13px",marginBottom:10,border:"1px solid #a855f744"})}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                  <select value={musicForm.type} onChange={e=>setMusicForm(p=>({...p,type:e.target.value}))} style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 10px",color:T.tx,...mono,fontSize:10}}>
                    {["Practice","Performance","Competition","Recording","Lesson","Jam Session"].map(t=><option key={t}>{t}</option>)}
                  </select>
                  <input type="number" value={musicForm.duration} onChange={e=>setMusicForm(p=>({...p,duration:e.target.value}))} placeholder="Duration (min)" style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 10px",color:T.bright,...mono,fontSize:11}}/>
                </div>
                <textarea value={musicForm.note} onChange={e=>setMusicForm(p=>({...p,note:e.target.value}))} placeholder="What did you practice? Songs, scales, performance details..." style={{width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 10px",color:T.tx,fontSize:11,...raj,lineHeight:1.6,resize:"vertical",minHeight:60,boxSizing:"border-box",marginBottom:8}}/>
                <button onClick={()=>{setMusicLog(p=>[{id:Date.now(),...musicForm,date:new Date().toLocaleDateString()},...p]);setMusicForm({date:"",type:"Practice",note:"",duration:""});setShowMusicForm(false);gainXP(10,"Music session logged 🎵");}} style={{width:"100%",padding:"9px",background:"#a855f733",border:"1px solid #a855f755",color:"#a855f7",borderRadius:7,...mono,fontSize:10,cursor:"pointer"}}>SAVE SESSION</button>
              </div>
            )}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {musicLog.map((m,i)=>(
                <div key={m.id||i} style={{...C({padding:"12px",border:"1px solid #a855f722"})}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                        <span style={{fontSize:8,background:"#a855f722",color:"#a855f7",padding:"2px 8px",borderRadius:10,...mono}}>{m.type}</span>
                        <span style={{fontSize:8,color:T.muted,...mono}}>{m.date}</span>
                        {m.duration&&<span style={{fontSize:8,color:T.gold,...mono}}>{m.duration}m</span>}
                      </div>
                      {m.note&&<div style={{fontSize:12,color:T.text,...raj,lineHeight:1.5}}>{m.note}</div>}
                    </div>
                    <button onClick={()=>setMusicLog(p=>p.filter((_,j)=>j!==i))} style={{background:"transparent",border:"none",color:T.muted,fontSize:16,cursor:"pointer"}}>×</button>
                  </div>
                </div>
              ))}
              {musicLog.length===0&&<div style={{textAlign:"center",padding:"24px",color:T.muted,...raj}}>No sessions logged. Even 10 minutes of daily singing practice compounds.</div>}
            </div>
          </div>
        )}

        {/* ── FREELANCING HUSTLE ── */}
        {lifeTab==="hustle"&&(
          <div style={{padding:16}}>
            <div style={{...C({padding:"14px",marginBottom:12,background:"linear-gradient(135deg,#001a00,transparent)",border:`1px solid ${T.green}44`})}}>
              <div style={{fontSize:9,color:T.green,letterSpacing:2,...mono,marginBottom:8}}>💰 FREELANCING MISSION</div>
              <div style={{fontSize:11,color:T.text,...raj,lineHeight:1.7,marginBottom:10}}>Target: Tk <strong style={{color:T.green}}>{freelanceGoal.toLocaleString()}/month</strong> after thesis submission. Your CRO+SHAP thesis IS your portfolio. Python + ML = highest-demand Fiverr skills right now.</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <div style={{background:T.green+"11",border:`1px solid ${T.green}22`,borderRadius:8,padding:"10px",textAlign:"center"}}>
                  <div style={{...orb,fontSize:18,fontWeight:900,color:T.green}}>৳{totalFreelance.toLocaleString()}</div>
                  <div style={{fontSize:7,color:T.muted,...mono}}>TOTAL EARNED</div>
                </div>
                <div style={{background:T.gold+"11",border:`1px solid ${T.gold}22`,borderRadius:8,padding:"10px",textAlign:"center"}}>
                  <div style={{...orb,fontSize:18,fontWeight:900,color:T.gold}}>{freelanceLog.length}</div>
                  <div style={{fontSize:7,color:T.muted,...mono}}>TOTAL ENTRIES</div>
                </div>
              </div>
              <div style={{marginTop:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:9,color:T.muted,...mono}}>MONTHLY GOAL</span>
                  <span style={{fontSize:9,color:T.green,...mono}}>৳{freelanceGoal.toLocaleString()}</span>
                </div>
                <input type="range" min="5000" max="100000" step="5000" value={freelanceGoal} onChange={e=>setFreelanceGoal(Number(e.target.value))} style={{width:"100%",accentColor:T.green}}/>
              </div>
            </div>
            <button onClick={()=>setShowFLForm(s=>!s)} style={{width:"100%",padding:"10px",background:T.green+"22",border:`1px solid ${T.green}44`,color:T.green,borderRadius:9,...mono,fontSize:10,cursor:"pointer",marginBottom:10}}>{showFLForm?"✕ CANCEL":"+ LOG WORK"}</button>
            {showFLForm&&(
              <div style={{...C({padding:"13px",marginBottom:10,border:`1px solid ${T.green}44`})}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                  <select value={freelanceForm.platform} onChange={e=>setFreelanceForm(p=>({...p,platform:e.target.value}))} style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px",color:T.tx,...mono,fontSize:10}}>
                    {["Fiverr","Upwork","Direct Client","Kaggle","Local BD","Other"].map(t=><option key={t}>{t}</option>)}
                  </select>
                  <select value={freelanceForm.status} onChange={e=>setFreelanceForm(p=>({...p,status:e.target.value}))} style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px",color:T.tx,...mono,fontSize:10}}>
                    {["Earned","Proposal Sent","In Progress","Rejected"].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <input value={freelanceForm.desc} onChange={e=>setFreelanceForm(p=>({...p,desc:e.target.value}))} placeholder="Project/work description..." style={{width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 10px",color:T.bright,fontSize:12,...raj,marginBottom:8,boxSizing:"border-box"}}/>
                <input type="number" value={freelanceForm.amount} onChange={e=>setFreelanceForm(p=>({...p,amount:e.target.value}))} placeholder="Amount (BDT)" style={{width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 10px",color:T.bright,fontSize:12,...mono,marginBottom:8,boxSizing:"border-box"}}/>
                <button onClick={()=>{setFreelanceLog(p=>[{id:Date.now(),...freelanceForm,date:new Date().toLocaleDateString()},...p]);setFreelanceForm({date:"",platform:"Fiverr",desc:"",amount:0,status:"Earned"});setShowFLForm(false);if(freelanceForm.status==="Earned")gainXP(25,"Freelance income! 💰");}} style={{width:"100%",padding:"9px",background:T.green+"33",border:`1px solid ${T.green}55`,color:T.green,borderRadius:7,...mono,fontSize:10,cursor:"pointer"}}>SAVE</button>
              </div>
            )}
            {/* Roadmap */}
            <div style={{...C({padding:"12px",marginBottom:10,border:`1px solid ${T.gold}22`})}}>
              <div style={{fontSize:9,color:T.gold,letterSpacing:2,...mono,marginBottom:8}}>🗺️ FREELANCING ROADMAP</div>
              {[
                {phase:"Jul 2026",act:"Thesis done → build Fiverr + Upwork profiles",c:T.green},
                {phase:"Aug 2026",act:"First 5 proposals/gigs. Your thesis = portfolio proof",c:T.green},
                {phase:"Sep 2026",act:"Target first Tk 5,000 month. Python scripts, data analysis",c:T.gold},
                {phase:"Oct 2026",act:"Tk 15,000/month target. ML models, research assistance",c:T.gold},
                {phase:"Jan 2027",act:"Tk 25,000+/month while doing MSc simultaneously",c:T.orange},
                {phase:"2027+",act:"Tk 40,000+/month. Fund MSc + family contribution + bike",c:"#a855f7"},
              ].map((s,i)=>(
                <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"center"}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:s.c,flexShrink:0,boxShadow:`0 0 6px ${s.c}66`}}/>
                  <div>
                    <span style={{fontSize:9,color:s.c,...mono,fontWeight:700}}>{s.phase}: </span>
                    <span style={{fontSize:11,color:T.text,...raj}}>{s.act}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:280,overflowY:"auto"}}>
              {freelanceLog.map((f,i)=>(
                <div key={f.id||i} style={{...C({padding:"10px 12px",border:`1px solid ${f.status==="Earned"?T.green:f.status==="In Progress"?T.gold:T.border}22`})}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",gap:6,marginBottom:3,flexWrap:"wrap"}}>
                        <span style={{fontSize:8,background:T.blue+"22",color:T.blue,padding:"1px 6px",borderRadius:8,...mono}}>{f.platform}</span>
                        <span style={{fontSize:8,background:(f.status==="Earned"?T.green:f.status==="In Progress"?T.gold:T.muted)+"22",color:f.status==="Earned"?T.green:f.status==="In Progress"?T.gold:T.muted,padding:"1px 6px",borderRadius:8,...mono}}>{f.status}</span>
                        <span style={{fontSize:8,color:T.dim,...mono}}>{f.date}</span>
                      </div>
                      <div style={{fontSize:11,color:T.text,...raj}}>{f.desc}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0,marginLeft:8}}>
                      {Number(f.amount)>0&&<div style={{...orb,fontSize:13,fontWeight:700,color:f.status==="Earned"?T.green:T.muted}}>৳{Number(f.amount).toLocaleString()}</div>}
                      <button onClick={()=>setFreelanceLog(p=>p.filter((_,j)=>j!==i))} style={{background:"transparent",border:"none",color:T.muted,fontSize:14,cursor:"pointer"}}>×</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PROFESSOR CRM ── */}
        {lifeTab==="profs"&&(
          <div style={{padding:16}}>
            <div style={{...C({padding:"14px",marginBottom:12,border:`1px solid ${T.blue}44`,background:"linear-gradient(135deg,#00050a,transparent)"})}}>
              <div style={{fontSize:9,color:T.blue,letterSpacing:2,...mono,marginBottom:6}}>📧 PROFESSOR CRM — CONTACT TRACKER</div>
              <div style={{fontSize:11,color:T.text,...raj,lineHeight:1.7}}>Professors who know your name before the circular = admission advantage. Track every contact. Follow up after 7 days of silence.</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:10}}>
                {[
                  {l:"CONTACTED",v:profCRM.length,c:T.blue},
                  {l:"EMAILED",v:profEmailed,c:T.orange},
                  {l:"REPLIED",v:profReplied,c:T.green},
                ].map((s,i)=>(
                  <div key={i} style={{background:s.c+"11",border:`1px solid ${s.c}22`,borderRadius:7,padding:"8px",textAlign:"center"}}>
                    <div style={{...orb,fontSize:18,fontWeight:900,color:s.c}}>{s.v}</div>
                    <div style={{fontSize:7,color:T.muted,...mono}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={()=>setShowProfForm(s=>!s)} style={{width:"100%",padding:"10px",background:T.blue+"22",border:`1px solid ${T.blue}44`,color:T.blue,borderRadius:9,...mono,fontSize:10,cursor:"pointer",marginBottom:10}}>{showProfForm?"✕ CANCEL":"+ ADD PROFESSOR"}</button>
            {showProfForm&&(
              <div style={{...C({padding:"13px",marginBottom:10,border:`1px solid ${T.blue}44`})}}>
                <input value={profForm.name} onChange={e=>setProfForm(p=>({...p,name:e.target.value}))} placeholder="Prof. Full Name" style={{width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 10px",color:T.bright,fontSize:13,...raj,marginBottom:8,boxSizing:"border-box"}}/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                  <select value={profForm.uni} onChange={e=>setProfForm(p=>({...p,uni:e.target.value}))} style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px",color:T.tx,...mono,fontSize:10}}>
                    <option value="kuet">KUET</option><option value="ku">KU</option><option value="buet">BUET</option><option value="du">DU</option>
                  </select>
                  <input value={profForm.research} onChange={e=>setProfForm(p=>({...p,research:e.target.value}))} placeholder="Research area" style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px",color:T.bright,fontSize:11,...raj}}/>
                </div>
                <textarea value={profForm.notes} onChange={e=>setProfForm(p=>({...p,notes:e.target.value}))} placeholder="Notes, email subject, any response..." style={{width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 10px",color:T.tx,fontSize:11,...raj,resize:"vertical",minHeight:60,boxSizing:"border-box",marginBottom:8}}/>
                <div style={{display:"flex",gap:12,marginBottom:8}}>
                  {[["emailed","Email Sent"],["replied","Replied"]].map(([k,l])=>(
                    <label key={k} style={{display:"flex",gap:6,alignItems:"center",cursor:"pointer"}}>
                      <input type="checkbox" checked={profForm[k]} onChange={e=>setProfForm(p=>({...p,[k]:e.target.checked}))} style={{accentColor:T.green}}/>
                      <span style={{fontSize:11,color:T.text,...raj}}>{l}</span>
                    </label>
                  ))}
                </div>
                <button onClick={()=>{if(!profForm.name.trim())return;setProfCRM(p=>[{id:Date.now(),...profForm,addedDate:new Date().toLocaleDateString()},...p]);setProfForm({name:"",uni:"kuet",dept:"CSE",research:"",emailed:false,replied:false,notes:""});setShowProfForm(false);gainXP(10,"Professor added to CRM 📧");}} style={{width:"100%",padding:"9px",background:T.blue+"33",border:`1px solid ${T.blue}55`,color:T.blue,borderRadius:7,...mono,fontSize:10,cursor:"pointer"}}>ADD TO CRM</button>
              </div>
            )}
            {profCRM.length===0&&<div style={{textAlign:"center",padding:"32px 0",color:T.muted,...raj}}><div style={{fontSize:28,marginBottom:8}}>📭</div><div>No professors tracked yet.</div><div style={{fontSize:10,...mono,marginTop:4}}>Start with 2 KUET CSE professors. Email them TODAY.</div></div>}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {profCRM.map((p,i)=>{
                const uniColor={kuet:T.green,ku:T.orange,buet:T.blue,du:"#a855f7"}[p.uni]||T.muted;
                return(
                  <div key={p.id||i} style={{...C({padding:"12px",border:`1px solid ${p.replied?T.green:p.emailed?T.gold:T.border}33`})}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4,flexWrap:"wrap"}}>
                          <span style={{fontSize:12,color:T.bright,fontWeight:700,...raj}}>{p.name}</span>
                          <span style={{fontSize:8,background:uniColor+"22",color:uniColor,padding:"1px 7px",borderRadius:8,...mono}}>{p.uni.toUpperCase()}</span>
                          {p.emailed&&<span style={{fontSize:8,background:T.gold+"22",color:T.gold,padding:"1px 7px",borderRadius:8,...mono}}>✉ Emailed</span>}
                          {p.replied&&<span style={{fontSize:8,background:T.green+"22",color:T.green,padding:"1px 7px",borderRadius:8,...mono}}>✓ Replied!</span>}
                        </div>
                        {p.research&&<div style={{fontSize:11,color:T.muted,...raj}}>Research: {p.research}</div>}
                        {p.notes&&<div style={{fontSize:10,color:T.text,...raj,marginTop:4,lineHeight:1.5}}>{p.notes}</div>}
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:4,flexShrink:0,marginLeft:8}}>
                        <button onClick={()=>setProfCRM(p2=>p2.map((x,j)=>j===i?{...x,emailed:!x.emailed}:x))} style={{fontSize:8,padding:"3px 8px",background:p.emailed?T.gold+"22":"transparent",border:`1px solid ${p.emailed?T.gold:T.border}`,color:p.emailed?T.gold:T.muted,borderRadius:6,cursor:"pointer",...mono}}>✉</button>
                        <button onClick={()=>setProfCRM(p2=>p2.map((x,j)=>j===i?{...x,replied:!x.replied}:x))} style={{fontSize:8,padding:"3px 8px",background:p.replied?T.green+"22":"transparent",border:`1px solid ${p.replied?T.green:T.border}`,color:p.replied?T.green:T.muted,borderRadius:6,cursor:"pointer",...mono}}>✓</button>
                        <button onClick={()=>setProfCRM(p2=>p2.filter((_,j)=>j!==i))} style={{background:"transparent",border:"none",color:T.muted,fontSize:14,cursor:"pointer"}}>×</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── RESEARCH PAPERS ── */}
        {lifeTab==="papers"&&(
          <div style={{padding:16}}>
            <div style={{...C({padding:"14px",marginBottom:12,border:`1px solid ${T.cyan}33`})}}>
              <div style={{fontSize:9,color:T.cyan,letterSpacing:2,...mono,marginBottom:6}}>📄 RESEARCH PAPER LOG</div>
              <div style={{fontSize:11,color:T.text,...raj,lineHeight:1.7}}>Your thesis requires reading 15 papers minimum (5 CRO + 5 SHAP + 5 multi-omics). Track each one here with notes.</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginTop:10}}>
                {["CRO","SHAP","Dataset","Results"].map(tag=>{
                  const count=paperLog.filter(p=>p.tag===tag).length;
                  return <div key={tag} style={{background:T.cyan+"11",border:`1px solid ${T.cyan}22`,borderRadius:7,padding:"6px",textAlign:"center"}}><div style={{...orb,fontSize:16,color:T.cyan}}>{count}</div><div style={{fontSize:7,color:T.muted,...mono}}>{tag}</div></div>;
                })}
              </div>
            </div>
            <button onClick={()=>setShowPaperForm(s=>!s)} style={{width:"100%",padding:"10px",background:T.cyan+"22",border:`1px solid ${T.cyan}44`,color:T.cyan,borderRadius:9,...mono,fontSize:10,cursor:"pointer",marginBottom:10}}>{showPaperForm?"✕ CANCEL":"+ ADD PAPER"}</button>
            {showPaperForm&&(
              <div style={{...C({padding:"13px",marginBottom:10,border:`1px solid ${T.cyan}44`})}}>
                <input value={paperForm.title} onChange={e=>setPaperForm(p=>({...p,title:e.target.value}))} placeholder="Paper title..." style={{width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 10px",color:T.bright,fontSize:12,...raj,marginBottom:8,boxSizing:"border-box"}}/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                  <input value={paperForm.authors} onChange={e=>setPaperForm(p=>({...p,authors:e.target.value}))} placeholder="Authors" style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px",color:T.tx,fontSize:11,...raj}}/>
                  <input value={paperForm.year} onChange={e=>setPaperForm(p=>({...p,year:e.target.value}))} placeholder="Year" style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px",color:T.bright,fontSize:11,...mono}}/>
                </div>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  {["CRO","SHAP","Dataset","Results","Survey"].map(t=><button key={t} onClick={()=>setPaperForm(p=>({...p,tag:t}))} style={{flex:1,padding:"5px",borderRadius:6,border:`1px solid ${paperForm.tag===t?T.cyan:T.border}`,background:paperForm.tag===t?T.cyan+"22":"transparent",color:paperForm.tag===t?T.cyan:T.muted,fontSize:8,...mono,cursor:"pointer"}}>{t}</button>)}
                </div>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  {["Reading","Read","Key Reference"].map(t=><button key={t} onClick={()=>setPaperForm(p=>({...p,status:t}))} style={{flex:1,padding:"5px",borderRadius:6,border:`1px solid ${paperForm.status===t?T.green:T.border}`,background:paperForm.status===t?T.green+"22":"transparent",color:paperForm.status===t?T.green:T.muted,fontSize:9,...mono,cursor:"pointer"}}>{t}</button>)}
                </div>
                <textarea value={paperForm.notes} onChange={e=>setPaperForm(p=>({...p,notes:e.target.value}))} placeholder="Key notes, findings, how it relates to your thesis..." style={{width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 10px",color:T.tx,fontSize:11,...raj,resize:"vertical",minHeight:60,boxSizing:"border-box",marginBottom:8}}/>
                <button onClick={()=>{if(!paperForm.title.trim())return;setPaperLog(p=>[{id:Date.now(),...paperForm,addedDate:new Date().toLocaleDateString()},...p]);setPaperForm({title:"",authors:"",year:"",tag:"CRO",notes:"",status:"Reading"});setShowPaperForm(false);gainXP(5,"Paper added 📄");}} style={{width:"100%",padding:"9px",background:T.cyan+"33",border:`1px solid ${T.cyan}55`,color:T.cyan,borderRadius:7,...mono,fontSize:10,cursor:"pointer"}}>SAVE PAPER</button>
              </div>
            )}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {paperLog.map((p,i)=>{
                const statusColor={Reading:T.orange,Read:T.green,"Key Reference":T.gold}[p.status]||T.muted;
                const tagColor={CRO:T.green,SHAP:T.blue,Dataset:T.orange,Results:T.pink,Survey:"#a855f7"}[p.tag]||T.muted;
                return(
                  <div key={p.id||i} style={{...C({padding:"12px",border:`1px solid ${statusColor}22`})}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",gap:5,marginBottom:4,flexWrap:"wrap"}}>
                          <span style={{fontSize:8,background:tagColor+"22",color:tagColor,padding:"1px 6px",borderRadius:8,...mono}}>{p.tag}</span>
                          <span style={{fontSize:8,background:statusColor+"22",color:statusColor,padding:"1px 6px",borderRadius:8,...mono}}>{p.status}</span>
                          {p.year&&<span style={{fontSize:8,color:T.dim,...mono}}>{p.year}</span>}
                        </div>
                        <div style={{fontSize:12,color:T.bright,fontWeight:600,...raj,lineHeight:1.4,marginBottom:3}}>{p.title}</div>
                        {p.authors&&<div style={{fontSize:10,color:T.muted,...raj}}>{p.authors}</div>}
                        {p.notes&&<div style={{fontSize:11,color:T.text,...raj,marginTop:5,lineHeight:1.5,borderLeft:`2px solid ${tagColor}44`,paddingLeft:8}}>{p.notes}</div>}
                      </div>
                      <button onClick={()=>setPaperLog(p2=>p2.filter((_,j)=>j!==i))} style={{background:"transparent",border:"none",color:T.muted,fontSize:16,cursor:"pointer",flexShrink:0,marginLeft:8}}>×</button>
                    </div>
                  </div>
                );
              })}
              {paperLog.length===0&&<div style={{textAlign:"center",padding:"24px",color:T.muted,...raj}}>No papers yet. Add 15 papers minimum for your literature review.</div>}
            </div>
          </div>
        )}

        {/* ── QUIT SMOKING TIMELINE ── */}
        {lifeTab==="quit"&&(
          <div style={{padding:16}}>
            {/* Status */}
            <div style={{...C({padding:"16px",marginBottom:12,background:"linear-gradient(135deg,#0d0500,transparent)",border:`1px solid ${curSmoke===0?T.green:T.orange}44`})}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div>
                  <div style={{fontSize:9,color:T.orange,letterSpacing:2,...mono}}>🚭 QUIT SMOKING MISSION</div>
                  <div style={{...orb,fontSize:24,fontWeight:900,color:curSmoke===0?T.green:T.orange,marginTop:4}}>{curSmoke===0?"SMOKE FREE 🎉":`${curSmoke} today`}</div>
                  <div style={{fontSize:11,color:T.muted,...raj,marginTop:3}}>Started at ~10/day. Target: 0 by June 1, 2026</div>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{...orb,fontSize:18,fontWeight:900,color:daysToQuitGoal===0?T.green:T.orange}}>{daysToQuitGoal}d</div>
                  <div style={{fontSize:8,color:T.muted,...mono}}>TO GOAL</div>
                </div>
              </div>
              <div style={{height:8,background:T.bg2,borderRadius:4,overflow:"hidden",marginBottom:6}}>
                <div style={{width:`${Math.min(100,((10-curSmoke)/10)*100)}%`,height:"100%",background:`linear-gradient(90deg,${T.red},${T.orange},${T.green})`,borderRadius:4,transition:"width .6s"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:8,color:T.muted,...mono}}>
                <span>10/day (start)</span>
                <span style={{color:T.green}}>0/day (goal)</span>
              </div>
            </div>

            {/* Goal date setter */}
            <div style={{...C({padding:"12px",marginBottom:12})}}>
              <div style={{fontSize:9,color:T.muted,...mono,marginBottom:6}}>🎯 SET QUIT GOAL DATE</div>
              <input type="date" value={smokeGoalDate} onChange={e=>setSmokeGoalDate(e.target.value)} style={{width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 10px",color:T.tx,...mono,fontSize:11,boxSizing:"border-box"}}/>
            </div>

            {/* Milestones */}
            <div style={{...C({padding:"13px",marginBottom:12,border:`1px solid ${T.green}22`})}}>
              <div style={{fontSize:9,color:T.green,letterSpacing:2,...mono,marginBottom:12}}>🏆 QUIT MILESTONES</div>
              {[
                {target:"≤7/day",reward:"Face puffiness starts reducing",done:curSmoke<=7,xpVal:10},
                {target:"≤5/day",reward:"Skin tone improves noticeably",done:curSmoke<=5,xpVal:25},
                {target:"≤3/day",reward:"Morning cough reduces significantly",done:curSmoke<=3,xpVal:50},
                {target:"≤1/day",reward:"Lungs begin actual tissue repair",done:curSmoke<=1,xpVal:75},
                {target:"0/day — QUIT",reward:"Blood oxygen normal. Gym performance rockets.",done:curSmoke===0,xpVal:200},
                {target:"30 days free",reward:"Nicotine cravings drop by 70%",done:smokingLog.filter(s=>s.count===0).length>=30,xpVal:300},
              ].map((m,i)=>(
                <div key={i} style={{display:"flex",gap:10,alignItems:"center",marginBottom:10,padding:"10px 12px",background:m.done?T.green+"08":T.bg2,border:`1px solid ${m.done?T.green+"44":T.border}`,borderRadius:8}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:m.done?T.green:"transparent",border:`2px solid ${m.done?T.green:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {m.done&&<span style={{color:"#020408",fontSize:10,fontWeight:900}}>✓</span>}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{...orb,fontSize:11,fontWeight:700,color:m.done?T.green:T.bright}}>{m.target}</div>
                    <div style={{fontSize:10,color:T.muted,...raj,marginTop:2}}>{m.reward}</div>
                  </div>
                  <div style={{fontSize:9,color:T.gold,...mono,flexShrink:0}}>+{m.xpVal}XP</div>
                </div>
              ))}
            </div>

            {/* Why quitting matters — personalized */}
            <div style={{...C({padding:"13px",border:`1px solid ${T.orange}22`})}}>
              <div style={{fontSize:9,color:T.orange,letterSpacing:2,...mono,marginBottom:8}}>⚡ WHY THIS MATTERS FOR YOU</div>
              {[
                "Your face will change. The puffiness from smoking causes water retention — quitting reveals your actual bone structure within 3–4 weeks.",
                "Gym gains will accelerate. Smoking reduces testosterone and growth hormone by measurable amounts. At 50kg trying to gain weight, this matters enormously.",
                "MSc application photos and professor meetings — you want to look sharp and healthy. Smoking ages your face visibly.",
                "IELTS Speaking: smoking thickens mucus and affects voice clarity. Your debate voice is an asset — protect it.",
                "The money: Tk 200–300/day on cigarettes = Tk 6,000–9,000/month = Fiverr marketing budget or gym supplement fund.",
              ].map((tip,i)=><div key={i} style={{fontSize:11,color:T.text,...raj,lineHeight:1.6,marginBottom:7,paddingLeft:8,borderLeft:`2px solid ${T.orange}44`}}>{tip}</div>)}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── STATS TAB (Enhanced — Interactive, Detailed) ──
  const Stats=()=>{
    const earned=ACHIEVEMENTS_DEF.filter(a=>achievements[a.id]);
    const locked=ACHIEVEMENTS_DEF.filter(a=>!achievements[a.id]);
    const rnk=getRank(xp);
    const nRank=XP_RANKS.find(r=>r.min>xp)||{min:xp+100,title:"MAX"};
    const toNext=nRank.min-xp;
    const pctNext=Math.round(((xp-rnk.min)/((nRank.min||xp+100)-rnk.min))*100)||0;
    const habToday=habits.filter(h=>h.lastDone===TODAY);
    const tiers=["legendary","diamond","gold","silver","bronze"];
    const tierColors={bronze:"#cd7f32",silver:"#c0c0c0",gold:"#ffd700",diamond:"#00ffff",legendary:"#ff006e"};
    const tierLabels={bronze:"🥉 BRONZE",silver:"🥈 SILVER",gold:"🥇 GOLD",diamond:"💎 DIAMOND",legendary:"👑 LEGENDARY"};
    const radarData=[
      {label:"Thesis",  val:tp,                                                                  color:T.green},
      {label:"Body",    val:wPct,                                                                 color:T.pink},
      {label:"Habits",  val:habits.length>0?Math.round((habToday.length/habits.length)*100):0,   color:T.cyan},
      {label:"XP",      val:Math.min(100,Math.round((xp/2500)*100)),                             color:T.gold},
      {label:"Quit 🚭", val:sPct,                                                                 color:T.orange},
      {label:"Streak",  val:Math.min(100,streak*7),                                              color:T.blue},
    ];
    const W=300,H=260,cx=W/2,cy=H/2,R=98;
    const pts=(vals,full)=>vals.map((v,i)=>{const angle=(Math.PI*2*i/vals.length)-Math.PI/2;const r=(full?1:v/100)*R;return[cx+r*Math.cos(angle),cy+r*Math.sin(angle)];});
    const poly=(arr)=>arr.map(p=>p.join(",")).join(" ");
    const outerPts=pts(radarData.map(()=>100),true);
    const innerPts=pts(radarData.map(d=>d.val),false);
    const heatCols=["#0d2030","#00ff8822","#00ff8855","#00ff8899","#00ff88cc"];
    const taskCount=Object.values(tasksDone).filter(Boolean).length;
    const workoutDays=new Set(Object.keys(sets).map(k=>k.split("-")[0])).size;

    return(
      <div style={{padding:16}}>
        <div style={{...orb,fontSize:16,fontWeight:900,color:T.bright,marginBottom:4}}>BATTLE STATS</div>
        <div style={{fontSize:11,color:T.muted,marginBottom:12,...raj}}>Your complete comeback dashboard — every number tracked.</div>

        {/* Tab nav */}
        <div style={{display:"flex",background:T.bg1,borderRadius:10,border:`1px solid ${T.border}`,marginBottom:14,overflow:"hidden"}}>
          {[{id:"overview",l:"📊"},{id:"achievements",l:"🏆"},{id:"analytics",l:"📈"},{id:"rank",l:"⚡"}].map(s=>(
            <div key={s.id} onClick={()=>setStatsTab(s.id)} style={{flex:1,padding:"10px 4px",textAlign:"center",cursor:"pointer",background:statsTab===s.id?T.green+"22":"transparent",borderBottom:statsTab===s.id?`2px solid ${T.green}`:"2px solid transparent",fontSize:18,color:statsTab===s.id?T.green:T.muted,transition:"all .2s"}}>{s.l}</div>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {statsTab==="overview"&&(
          <div>
            {/* Rank card */}
            <div style={{...C({padding:"16px",marginBottom:12,background:"linear-gradient(135deg,#0a0800,#040814)",border:`2px solid ${rnk.color}66`})}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div>
                  <div style={{fontSize:9,color:rnk.color,letterSpacing:3,...mono}}>COMEBACK RANK</div>
                  <div style={{...orb,fontSize:26,fontWeight:900,color:rnk.color,textShadow:`0 0 20px ${rnk.color}66`,lineHeight:1.1,marginTop:4}}>{rnk.title}</div>
                  <div style={{fontSize:11,color:T.muted,...raj,marginTop:6}}>Level {xpLevel} · {xp} total XP · {toNext} XP to next</div>
                </div>
                <div style={{background:rnk.color+"22",border:`1px solid ${rnk.color}44`,borderRadius:12,padding:"12px 16px",textAlign:"center"}}>
                  <div style={{...orb,fontSize:36,fontWeight:900,color:rnk.color,lineHeight:1}}>{xpLevel}</div>
                  <div style={{fontSize:8,color:rnk.color,...mono}}>LEVEL</div>
                </div>
              </div>
              <div style={{marginBottom:5,display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:8,color:rnk.color,...mono}}>{rnk.title}</span>
                <span style={{fontSize:8,color:T.muted,...mono}}>{nRank.title}</span>
              </div>
              <div style={{height:8,background:"#0a0f0a",borderRadius:4,overflow:"hidden",border:`1px solid ${rnk.color}22`}}>
                <div style={{width:`${Math.max(2,pctNext)}%`,height:"100%",background:`linear-gradient(90deg,${rnk.color}88,${rnk.color})`,boxShadow:`0 0 8px ${rnk.color}66`,borderRadius:4,transition:"width .6s"}}/>
              </div>
            </div>

            {/* Key stats grid */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
              {[
                {l:"THESIS PROGRESS",v:`${tp}%`,sub:`${taskCount} tasks done`,c:T.green,icon:"🧪"},
                {l:"WORKOUT DAYS",v:workoutDays,sub:`${streak}d streak 🔥`,c:T.orange,icon:"💪"},
                {l:"ACHIEVEMENTS",v:`${earned.length}/${ACHIEVEMENTS_DEF.length}`,sub:`${Math.round((earned.length/ACHIEVEMENTS_DEF.length)*100)}% complete`,c:T.gold,icon:"🏆"},
                {l:"WEIGHT GAINED",v:`+${wGained}kg`,sub:`${curWeight}kg / 60kg target`,c:T.pink,icon:"⚖️"},
                {l:"HABITS TODAY",v:`${habToday.length}/${habits.length}`,sub:`${habits.length>0?Math.round((habToday.length/habits.length)*100):0}% complete`,c:T.cyan,icon:"🔁"},
                {l:"POMODOROS",v:pomSessions,sub:`${pomSessions*25}m focused`,c:"#a855f7",icon:"⏱"},
              ].map((s,i)=>(
                <div key={i} style={{...C({padding:"12px",border:`1px solid ${s.c}22`})}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div style={{fontSize:9,color:T.muted,letterSpacing:1,...mono}}>{s.l}</div>
                    <span style={{fontSize:16}}>{s.icon}</span>
                  </div>
                  <div style={{...orb,fontSize:20,fontWeight:900,color:s.c,lineHeight:1}}>{s.v}</div>
                  <div style={{fontSize:9,color:T.muted,...mono,marginTop:4}}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Radar */}
            <div style={{...C({padding:"14px",marginBottom:12,border:`1px solid ${T.blue}33`})}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontSize:9,color:T.blue,letterSpacing:2,...mono}}>📡 PERFORMANCE RADAR</div>
                <div style={{fontSize:9,color:T.muted,...mono}}>Tap a label to see score</div>
              </div>
              <div style={{overflowX:"auto",display:"flex",justifyContent:"center"}}>
                <svg width={W} height={H} style={{display:"block"}}>
                  {[0.25,0.5,0.75,1].map((f,i)=>(
                    <polygon key={i} points={poly(pts(radarData.map(()=>f*100),false))} fill="none" stroke={T.border} strokeWidth={1}/>
                  ))}
                  {outerPts.map((p,i)=><line key={i} x1={cx} y1={cy} x2={p[0]} y2={p[1]} stroke={T.border} strokeWidth={1}/>)}
                  <polygon points={poly(innerPts)} fill={T.green+"22"} stroke={T.green} strokeWidth={2} style={{filter:`drop-shadow(0 0 6px ${T.green}66)`}}/>
                  {innerPts.map((p,i)=>(
                    <circle key={i} cx={p[0]} cy={p[1]} r={5} fill={radarData[i].color} stroke={T.bg1} strokeWidth={2} style={{filter:`drop-shadow(0 0 5px ${radarData[i].color})`}}/>
                  ))}
                  {outerPts.map((p,i)=>{
                    const angle=(Math.PI*2*i/radarData.length)-Math.PI/2;
                    const lx=cx+(R+22)*Math.cos(angle),ly=cy+(R+22)*Math.sin(angle);
                    return(
                      <g key={i}>
                        <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill={radarData[i].color} fontFamily="Share Tech Mono">{radarData[i].label}</text>
                        <text x={lx} y={ly+12} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill={T.muted} fontFamily="Orbitron" fontWeight="700">{radarData[i].val}%</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
              {/* Radar bar breakdown */}
              <div style={{marginTop:8,paddingTop:10,borderTop:`1px solid ${T.border}`}}>
                {radarData.map((r,i)=>(
                  <div key={i} style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
                    <span style={{fontSize:9,color:r.color,...mono,width:55,flexShrink:0}}>{r.label.replace(" 🚭","")}</span>
                    <div style={{flex:1,height:5,background:T.bg2,borderRadius:3,overflow:"hidden"}}>
                      <div style={{width:`${r.val}%`,height:"100%",background:r.color,transition:"width .6s",boxShadow:`0 0 5px ${r.color}66`}}/>
                    </div>
                    <span style={{...orb,fontSize:9,color:r.color,width:28,textAlign:"right"}}>{r.val}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Heatmap */}
            <div style={{...C({padding:"14px",border:`1px solid ${T.green}22`})}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontSize:9,color:T.green,letterSpacing:2,...mono}}>🗓 15-WEEK PROGRESS HEATMAP</div>
                <div style={{fontSize:9,color:T.muted,...mono}}>{WEEKS.filter(w=>weekPct(w.week)===100).length} weeks done</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:5,marginBottom:8}}>
                {WEEKS.map(w=>{
                  const p=weekPct(w.week);
                  const col=p===0?heatCols[0]:p<25?heatCols[1]:p<50?heatCols[2]:p<75?heatCols[3]:heatCols[4];
                  const phColor=pc(w.phase);
                  return(
                    <div key={w.week} onClick={()=>{setTab("plan");setActiveWeek(w.week);}} style={{cursor:"pointer",textAlign:"center"}}>
                      <div style={{aspectRatio:"1",borderRadius:8,background:col,border:`1px solid ${p>0?phColor+"44":T.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",transition:"all .2s",boxShadow:p===100?`0 0 8px ${T.green}44`:"none"}}>
                        <div style={{...orb,fontSize:10,fontWeight:700,color:p>0?phColor:T.muted}}>W{w.week}</div>
                        <div style={{fontSize:8,color:p===100?T.green:T.muted,...mono}}>{p}%</div>
                      </div>
                      <div style={{fontSize:7,color:T.dim,...mono,marginTop:2}}>{w.dates.split("–")[0]}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <span style={{fontSize:8,color:T.muted,...mono}}>LESS</span>
                {heatCols.map((c,i)=><div key={i} style={{width:14,height:14,borderRadius:3,background:c}}/>)}
                <span style={{fontSize:8,color:T.muted,...mono}}>MORE</span>
              </div>
            </div>
          </div>
        )}

        {/* ── ACHIEVEMENTS ── */}
        {statsTab==="achievements"&&(
          <div>
            {/* Summary bar */}
            <div style={{...C({padding:"14px",marginBottom:12,border:`1px solid ${T.gold}44`})}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontSize:9,color:T.gold,letterSpacing:2,...mono}}>🏆 ACHIEVEMENT VAULT</div>
                <div style={{...orb,fontSize:13,fontWeight:700,color:T.gold}}>{earned.length}/{ACHIEVEMENTS_DEF.length}</div>
              </div>
              <div style={{height:6,background:T.bg2,borderRadius:3,overflow:"hidden",marginBottom:8}}>
                <div style={{width:`${Math.round((earned.length/ACHIEVEMENTS_DEF.length)*100)}%`,height:"100%",background:`linear-gradient(90deg,${T.gold}88,${T.gold})`,borderRadius:3,transition:"width .6s"}}/>
              </div>
              {/* Tier breakdown */}
              <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}}>
                {tiers.map(tier=>{
                  const count=ACHIEVEMENTS_DEF.filter(a=>a.tier===tier).length;
                  const earnedCount=earned.filter(a=>a.tier===tier).length;
                  return(
                    <div key={tier} onClick={()=>setSelTier(selTier===tier?null:tier)} style={{flex:1,background:selTier===tier?tierColors[tier]+"22":"transparent",border:`1px solid ${selTier===tier?tierColors[tier]:tierColors[tier]+"44"}`,borderRadius:8,padding:"6px 4px",textAlign:"center",cursor:"pointer",transition:"all .2s",minWidth:52}}>
                      <div style={{fontSize:9,color:tierColors[tier],...mono,fontWeight:700}}>{earnedCount}/{count}</div>
                      <div style={{fontSize:7,color:tierColors[tier]+"88",...mono,marginTop:2}}>{tier.toUpperCase()}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Earned achievements by tier */}
            {tiers.map(tier=>{
              const tierEarned=earned.filter(a=>a.tier===tier);
              const tierLocked=locked.filter(a=>a.tier===tier);
              if(selTier&&selTier!==tier)return null;
              if(tierEarned.length===0&&tierLocked.length===0)return null;
              return(
                <div key={tier} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div style={{fontSize:10,color:tierColors[tier],letterSpacing:2,...mono}}>{tierLabels[tier]}</div>
                    <div style={{fontSize:9,color:T.muted,...mono}}>{tierEarned.length}/{tierEarned.length+tierLocked.length} unlocked</div>
                  </div>
                  {/* Earned */}
                  {tierEarned.length>0&&(
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:7}}>
                      {tierEarned.map(a=>(
                        <div key={a.id} style={{background:tierColors[tier]+"0d",border:`1px solid ${tierColors[tier]}55`,borderRadius:10,padding:"10px 12px",display:"flex",gap:8,alignItems:"flex-start",animation:"badgePop .4s ease"}}>
                          <span style={{fontSize:22,flexShrink:0,filter:`drop-shadow(0 0 6px ${tierColors[tier]}88)`}}>{a.icon}</span>
                          <div>
                            <div style={{fontSize:11,color:tierColors[tier],fontWeight:700,...raj}}>{a.name}</div>
                            <div style={{fontSize:9,color:T.muted,...mono,marginTop:2,lineHeight:1.4}}>{a.desc}</div>
                            {a.xp>0&&<div style={{fontSize:8,color:T.gold,...mono,marginTop:3}}>+{a.xp} XP</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Locked */}
                  {tierLocked.length>0&&(
                    <div style={{display:"flex",flexDirection:"column",gap:5}}>
                      {tierLocked.map(a=>(
                        <div key={a.id} style={{display:"flex",gap:10,alignItems:"center",padding:"8px 10px",background:T.bg2,borderRadius:8,border:`1px solid ${T.border}`,opacity:.55}}>
                          <span style={{fontSize:16,flexShrink:0,filter:"grayscale(1)"}}>{a.icon}</span>
                          <div style={{flex:1}}>
                            <div style={{fontSize:11,color:T.muted,fontWeight:600,...raj}}>{a.name}</div>
                            <div style={{fontSize:9,color:T.dim,...mono}}>{a.desc}</div>
                          </div>
                          {a.xp>0&&<div style={{fontSize:8,color:T.dim,...mono,flexShrink:0}}>+{a.xp}XP</div>}
                          <span style={{fontSize:9,color:T.dim,flexShrink:0}}>🔒</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── ANALYTICS ── */}
        {statsTab==="analytics"&&(
          <div>
            {/* Daily score history */}
            <div style={{...C({padding:"14px",marginBottom:12})}}>
              <div style={{fontSize:9,color:T.muted,letterSpacing:2,...mono,marginBottom:12}}>📊 LIFETIME STATS</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[
                  {l:"TOTAL TASKS",v:taskCount,c:T.green,icon:"✅"},
                  {l:"TOTAL XP",v:xp,c:T.gold,icon:"⚡"},
                  {l:"WORKOUT DAYS",v:workoutDays,c:T.orange,icon:"💪"},
                  {l:"BEST HABIT STREAK",v:Math.max(0,...habits.map(h=>h.streak||0)),c:T.cyan,icon:"🔁"},
                  {l:"DIARY ENTRIES",v:dailyLog?.length||0,c:T.blue,icon:"📓"},
                  {l:"WEIGHT ENTRIES",v:weightLog.length,c:T.pink,icon:"⚖️"},
                ].map((s,i)=>(
                  <div key={i} style={{background:s.c+"11",border:`1px solid ${s.c}22`,borderRadius:8,padding:"10px 8px",textAlign:"center"}}>
                    <div style={{fontSize:18,marginBottom:4}}>{s.icon}</div>
                    <div style={{...orb,fontSize:20,fontWeight:900,color:s.c}}>{s.v}</div>
                    <div style={{fontSize:7,color:T.muted,...mono,marginTop:2}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Phase completion analysis */}
            <div style={{...C({padding:"14px",marginBottom:12})}}>
              <div style={{fontSize:9,color:T.muted,letterSpacing:2,...mono,marginBottom:12}}>📐 THESIS PHASE ANALYSIS</div>
              {[1,2,3,4].map(ph=>{
                const phWeeks=WEEKS.filter(w=>w.phase===ph);
                const avg=Math.round(phWeeks.reduce((a,w)=>a+weekPct(w.week),0)/phWeeks.length);
                const phNames={1:"Foundation",2:"Implementation",3:"Experiments",4:"Writing"};
                const col=pc(ph);
                const done=phWeeks.filter(w=>weekPct(w.week)===100).length;
                return(
                  <div key={ph} style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:col,boxShadow:`0 0 6px ${col}66`}}/>
                        <span style={{fontSize:12,color:T.bright,...raj}}>Phase {ph}: {phNames[ph]}</span>
                      </div>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        <span style={{fontSize:9,color:T.muted,...mono}}>{done}/{phWeeks.length} weeks</span>
                        <span style={{...orb,fontSize:11,fontWeight:700,color:col}}>{avg}%</span>
                      </div>
                    </div>
                    <div style={{height:6,background:T.bg2,borderRadius:3,overflow:"hidden"}}>
                      <div style={{width:`${avg}%`,height:"100%",background:col,boxShadow:`0 0 6px ${col}44`,transition:"width .6s"}}/>
                    </div>
                    {/* Individual week dots */}
                    <div style={{display:"flex",gap:3,marginTop:5}}>
                      {phWeeks.map(w=>{
                        const p=weekPct(w.week);
                        return(
                          <div key={w.week} onClick={()=>{setTab("plan");setActiveWeek(w.week);}} style={{flex:1,height:8,borderRadius:2,background:p===100?col:p>0?col+"55":T.border,cursor:"pointer",transition:"all .2s",boxShadow:p===100?`0 0 4px ${col}66`:"none"}} title={`Wk ${w.week}: ${p}%`}/>
                        );
                      })}
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:2}}>
                      <span style={{fontSize:7,color:T.dim,...mono}}>Wk {phWeeks[0].week}</span>
                      <span style={{fontSize:7,color:T.dim,...mono}}>Wk {phWeeks[phWeeks.length-1].week}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Habits performance */}
            <div style={{...C({padding:"14px"})}}>
              <div style={{fontSize:9,color:T.muted,letterSpacing:2,...mono,marginBottom:12}}>🔁 HABIT LEADERBOARD</div>
              {habits.length===0&&<div style={{fontSize:11,color:T.muted,...raj,textAlign:"center",padding:"20px 0"}}>No habits tracked yet. Add habits in the Focus tab.</div>}
              {[...habits].sort((a,b)=>(b.streak||0)-(a.streak||0)).map((h,i)=>(
                <div key={h.id} style={{display:"flex",gap:10,alignItems:"center",padding:"8px 10px",background:i===0?h.color+"11":T.bg2,border:`1px solid ${i===0?h.color+"44":T.border}`,borderRadius:8,marginBottom:6}}>
                  <div style={{...orb,fontSize:14,fontWeight:900,color:i===0?T.gold:i===1?T.muted:i===2?"#cd7f32":T.dim,width:18,textAlign:"center"}}>{i+1}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,color:h.lastDone===TODAY?h.color:T.bright,fontWeight:600,...raj}}>{h.name}</div>
                    <div style={{fontSize:9,color:T.muted,...mono,marginTop:1}}>{h.lastDone===TODAY?"✓ done today · ":""}{h.streak||0} day streak</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{...orb,fontSize:14,fontWeight:900,color:h.color}}>{h.streak||0}</div>
                    <div style={{fontSize:7,color:T.muted,...mono}}>STREAK</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RANK / XP ── */}
        {statsTab==="rank"&&(
          <div>
            <div style={{...C({padding:"16px",marginBottom:12,background:"linear-gradient(135deg,#0a0800,#04080f)",border:`1px solid ${rnk.color}55`})}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div>
                  <div style={{fontSize:9,color:rnk.color,letterSpacing:3,...mono}}>YOUR RANK</div>
                  <div style={{...orb,fontSize:22,fontWeight:900,color:rnk.color,textShadow:`0 0 16px ${rnk.color}66`}}>{rnk.title}</div>
                </div>
                <div style={{background:rnk.color+"22",border:`1px solid ${rnk.color}44`,borderRadius:12,padding:"10px 16px",textAlign:"center"}}>
                  <div style={{...orb,fontSize:34,fontWeight:900,color:rnk.color,lineHeight:1}}>{xpLevel}</div>
                  <div style={{fontSize:7,color:rnk.color,...mono}}>LVL</div>
                </div>
              </div>
              <div style={{height:8,background:"#0a0f0a",borderRadius:4,overflow:"hidden",border:`1px solid ${rnk.color}22`,marginBottom:5}}>
                <div style={{width:`${Math.max(2,pctNext)}%`,height:"100%",background:`linear-gradient(90deg,${rnk.color}88,${rnk.color})`,boxShadow:`0 0 8px ${rnk.color}66`,borderRadius:4,transition:"width .6s"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:8,color:T.muted,...mono}}>{xp} XP total</span>
                <span style={{fontSize:8,color:rnk.color,...mono}}>{toNext} XP → {nRank.title}</span>
              </div>
            </div>

            {/* All ranks */}
            <div style={{...C({padding:"14px",marginBottom:12})}}>
              <div style={{fontSize:9,color:T.muted,letterSpacing:2,...mono,marginBottom:14}}>ALL RANKS — YOUR JOURNEY</div>
              {XP_RANKS.map((r,i)=>{
                const reached=xp>=r.min;
                const isCurrent=reached&&(i===XP_RANKS.length-1||xp<XP_RANKS[i+1].min);
                const nextMin=i<XP_RANKS.length-1?XP_RANKS[i+1].min:null;
                const pct=nextMin?Math.min(100,Math.round(((xp-r.min)/(nextMin-r.min))*100)):100;
                return(
                  <div key={i} style={{display:"flex",gap:12,alignItems:"center",marginBottom:14}}>
                    <div style={{width:36,height:36,borderRadius:8,background:reached?r.color+"22":T.bg2,border:`1.5px solid ${reached?r.color:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:reached?`0 0 8px ${r.color}44`:"none"}}>
                      <div style={{...orb,fontSize:9,fontWeight:900,color:reached?r.color:T.dim}}>{reached?"✓":r.min>=1000?`${r.min/1000}k`:r.min}</div>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                        <span style={{fontSize:13,color:reached?r.color:T.muted,...raj,fontWeight:isCurrent?700:500}}>{r.title}{isCurrent?" ← YOU":""}</span>
                        <span style={{fontSize:9,color:T.muted,...mono}}>{r.min} XP</span>
                      </div>
                      {isCurrent&&nextMin&&(
                        <>
                          <div style={{height:4,background:T.bg2,borderRadius:2,overflow:"hidden"}}>
                            <div style={{width:`${pct}%`,height:"100%",background:r.color,transition:"width .6s"}}/>
                          </div>
                          <div style={{fontSize:8,color:T.muted,...mono,marginTop:3}}>{toNext} XP to reach {nRank.title}</div>
                        </>
                      )}
                      {!isCurrent&&reached&&<div style={{fontSize:8,color:r.color+"88",...mono}}>✓ completed</div>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* XP sources */}
            <div style={{...C({padding:"13px",border:`1px solid ${T.gold}22`})}}>
              <div style={{fontSize:9,color:T.gold,letterSpacing:2,...mono,marginBottom:10}}>⚡ XP EARNING SOURCES</div>
              {[
                {src:"Thesis task complete",xp:"+10",icon:"📋"},
                {src:"Workout set done",xp:"+5",icon:"💪"},
                {src:"Habit completed",xp:"+10",icon:"🔁"},
                {src:"Pomodoro session",xp:"+25",icon:"⏱"},
                {src:"Deep Focus 90min",xp:"+75",icon:"🧠"},
                {src:"Mood logged (once/day)",xp:"+5",icon:"🧠"},
                {src:"8 glasses water (once)",xp:"+15",icon:"💧"},
                {src:"Daily diary entry",xp:"+5",icon:"📓"},
                {src:"Weight logged (once/day)",xp:"+8",icon:"⚖️"},
                {src:"Sleep logged (once/day)",xp:"+20",icon:"😴"},
                {src:"Research note added",xp:"+8",icon:"🧪"},
                {src:"Achievement unlocked",xp:"varies",icon:"🏆"},
              ].map((s,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,paddingBottom:6,marginBottom:6,borderBottom:i<11?`1px solid ${T.border}`:"none"}}>
                  <span style={{fontSize:14,flexShrink:0}}>{s.icon}</span>
                  <span style={{flex:1,fontSize:11,color:T.text,...raj}}>{s.src}</span>
                  <span style={{...orb,fontSize:11,color:T.gold,fontWeight:700,flexShrink:0}}>{s.xp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };



  // ── RENDER ────────────────────────────────────────────────────────────────

  // ── BATTLE MODE EARLY RETURN — renders nothing else, so no tab can crash ──
  if(battleMode){
    return(
      <div style={{fontFamily:"'Rajdhani',sans-serif",background:"#020408",color:"#a8d8c0",minHeight:"100vh",maxWidth:430,margin:"0 auto",overflowY:"auto"}}>
        <style>{`@keyframes breathe{0%,100%{opacity:.7}50%{opacity:1}}`}</style>
        {/* Grid bg */}
        <div style={{position:"fixed",inset:0,background:"repeating-linear-gradient(0deg,transparent,transparent 30px,#ff006e06 31px),repeating-linear-gradient(90deg,transparent,transparent 30px,#ff006e06 31px)",pointerEvents:"none",zIndex:0}}/>
        <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"40px 20px 32px"}}>

          {/* Header */}
          <div style={{textAlign:"center",marginBottom:28}}>
            <div style={{fontSize:48,marginBottom:10,animation:"breathe 3s infinite",filter:"drop-shadow(0 0 24px #ff006e88)"}}>⚔️</div>
            <div style={{fontFamily:"'Orbitron',monospace",fontSize:22,fontWeight:900,color:"#ff006e",letterSpacing:5,textShadow:"0 0 20px #ff006e88"}}>BATTLE MODE</div>
            <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:"#ff006e66",letterSpacing:3,marginTop:6}}>FOCUS LOCK ACTIVE</div>
          </div>

          {/* Live clock */}
          <div style={{background:"#0a0005",border:"2px solid #ff006e44",borderRadius:18,padding:"20px 32px",marginBottom:20,textAlign:"center",width:"100%",maxWidth:320,boxShadow:"0 0 40px #ff006e18"}}>
            <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:"#ff006e66",letterSpacing:3,marginBottom:10}}>⏱ BATTLE DURATION</div>
            <BattleClock start={battleStart}/>
            {battleGoal?<div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:"#a8d8c0",marginTop:12,borderTop:"1px solid #ff006e22",paddingTop:12,lineHeight:1.6}}>🎯 <em>"{battleGoal}"</em></div>:null}
          </div>

          {/* Stats snapshot */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:20,width:"100%",maxWidth:340}}>
            {[
              {l:"THESIS",v:tp+"%",c:"#00ff88"},
              {l:"STREAK",v:streak+"d",c:"#ffd700"},
              {l:"XP",v:String(xp),c:"#ff006e"},
            ].map(function(s,i){return(
              <div key={i} style={{background:"#0a0005",border:"1px solid "+s.c+"33",borderRadius:10,padding:"10px 6px",textAlign:"center"}}>
                <div style={{fontFamily:"'Orbitron',monospace",fontSize:18,fontWeight:900,color:s.c}}>{s.v}</div>
                <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:7,color:s.c+"88",marginTop:3}}>{s.l}</div>
              </div>
            );})}
          </div>

          {/* Quote */}
          <div style={{background:"#0a0005",border:"1px solid #ff006e22",borderRadius:12,padding:"16px 18px",marginBottom:20,width:"100%",maxWidth:340}}>
            <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:"#ff006e66",letterSpacing:2,marginBottom:8}}>⚡ COMEBACK FUEL</div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:"#e8f8f0",lineHeight:1.8,fontStyle:"italic",borderLeft:"2px solid #ff006e33",paddingLeft:12}}>
              {Array.isArray(PROFILE.quotes)&&PROFILE.quotes.length>0 ? PROFILE.quotes[quoteIdx%PROFILE.quotes.length] : "The fall was public. The comeback will be louder."}
            </div>
            <button onClick={function(){setQuoteIdx(function(q){return (q+1)%(PROFILE.quotes&&PROFILE.quotes.length>0?PROFILE.quotes.length:1);});}} style={{marginTop:10,fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:"#ff006e55",background:"transparent",border:"none",cursor:"pointer"}}>NEXT QUOTE →</button>
          </div>

          {/* Past sessions */}
          {Array.isArray(battleSessions)&&battleSessions.length>0&&(
            <div style={{background:"#0a0005",border:"1px solid #ff006e18",borderRadius:12,padding:"12px 16px",marginBottom:20,width:"100%",maxWidth:340}}>
              <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:"#ff006e55",letterSpacing:2,marginBottom:8}}>📜 PAST BATTLES</div>
              {battleSessions.slice(-3).reverse().map(function(s,i){return(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:i<2?"1px solid #ff006e0a":"none"}}>
                  <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:"#3a6a5a"}}>{s.date||""}</span>
                  <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:"#ff006e",flexShrink:0}}>{s.duration||""}</span>
                </div>
              );})}
            </div>
          )}

          {/* PIN exit */}
          <div style={{background:"#0a0005",border:"2px solid #ff006e44",borderRadius:18,padding:"22px 24px",width:"100%",maxWidth:300,textAlign:"center"}}>
            <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:"#ff006e",letterSpacing:2,marginBottom:16}}>🔐 ENTER PIN TO EXIT</div>
            <div style={{display:"flex",gap:14,justifyContent:"center",marginBottom:20}}>
              {[0,1,2,3].map(function(i){return(
                <div key={i} style={{width:16,height:16,borderRadius:"50%",border:"2px solid "+(battleInput.length>i?"#ff006e":"#ff006e33"),background:battleInput.length>i?"#ff006e44":"transparent",transition:"all .15s",boxShadow:battleInput.length>i?"0 0 8px #ff006e88":"none"}}/>
              );})}
            </div>
            {battleError&&<div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:"#ff2244",marginBottom:10}}>❌ WRONG PIN</div>}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,maxWidth:200,margin:"0 auto",marginBottom:14}}>
              {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map(function(n,i){return(
                <button key={i} onClick={function(){
                  if(n==="⌫"){setBattleInput(function(p){return p.slice(0,-1);});setBattleError(false);}
                  else if(n!==""&&battleInput.length<4){
                    var next=battleInput+String(n);
                    setBattleInput(next);
                    if(next.length===4){
                      if(next===String(battlePin)){
                        var el=battleStart?Math.floor((Date.now()-battleStart)/1000):0;
                        var hh=String(Math.floor(el/3600)).padStart(2,"0");
                        var mm=String(Math.floor((el%3600)/60)).padStart(2,"0");
                        var ss=String(el%60).padStart(2,"0");
                        setBattleSessions(function(prev){return [...prev,{date:new Date().toLocaleDateString(),duration:hh+":"+mm+":"+ss,goal:battleGoal}];});
                        gainXP(15,"Battle Session Complete ⚔️");
                        setBattleMode(false);setBattleInput("");setBattleError(false);setBattleStart(null);setBattleGoal("");
                      } else {
                        setBattleError(true);
                        setTimeout(function(){setBattleInput("");setBattleError(false);},700);
                      }
                    }
                  }
                }} style={{padding:"14px 0",borderRadius:10,border:"1px solid "+(n===""?"transparent":battleError?"#ff224444":"#ff006e22"),background:n===""?"transparent":battleError?"#ff224411":"#0d0005",color:n===""?"transparent":battleError?"#ff2244":"#e8f8f0",fontFamily:"'Orbitron',monospace",fontSize:17,fontWeight:700,cursor:n===""?"default":"pointer",WebkitTapHighlightColor:"transparent"}}>
                  {n}
                </button>
              );})}
            </div>
            {!battlePin&&(
              <button onClick={function(){setBattleMode(false);setBattleStart(null);setBattleGoal("");}} style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:"#3a6a5a",background:"transparent",border:"1px solid #1a3a2a",borderRadius:8,padding:"8px 20px",cursor:"pointer"}}>NO PIN SET — EXIT</button>
            )}
          </div>

          <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:8,color:"#ff006e22",marginTop:24,textAlign:"center",letterSpacing:2}}>THE COMEBACK IS BEING WRITTEN RIGHT NOW</div>
        </div>
      </div>
    );
  }

  return(
    <div style={{fontFamily:"'Rajdhani',sans-serif",background:T.bg,color:T.text,minHeight:"100vh",maxWidth:430,margin:"0 auto",position:"relative"}}>

      {/* Change PIN Modal */}
      {showChangePin&&(
        <ChangePinModal pinHash={pinHash} onSave={(pin)=>{onPinChange(pin);gainXP(10,"PIN updated 🔒");}} onClose={()=>setShowChangePin(false)}/>
      )}

      {/* Level-up banner */}
      {levelUpAnim&&(
        <div style={{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,zIndex:2500,padding:"0 16px",pointerEvents:"none",animation:"fadeUp .4s ease"}}>
          <div style={{background:"linear-gradient(135deg,#0a0800,#040814)",border:`2px solid ${levelUpAnim.color}`,borderRadius:"0 0 14px 14px",padding:"12px 20px",textAlign:"center",boxShadow:`0 0 40px ${levelUpAnim.color}55`}}>
            <div style={{fontSize:9,color:levelUpAnim.color,letterSpacing:3,...mono,marginBottom:2}}>⬆ RANK UP</div>
            <div style={{...orb,fontSize:20,fontWeight:900,color:levelUpAnim.color,textShadow:`0 0 20px ${levelUpAnim.color}`}}>{levelUpAnim.title}</div>
          </div>
        </div>
      )}

        {/* ── ACHIEVEMENT POPUP ── */}
        {newAchievement&&(
          <div style={{position:"fixed",top:80,left:"50%",transform:"translateX(-50%)",zIndex:1500,animation:"badgePop .5s ease forwards",pointerEvents:"none",minWidth:280,maxWidth:390,padding:"0 16px"}}>
            <div style={{background:"linear-gradient(135deg,#0a0800,#040a14)",border:`2px solid ${newAchievement.color||T.gold}88`,borderRadius:16,padding:"14px 20px",display:"flex",gap:14,alignItems:"center",boxShadow:`0 0 40px ${newAchievement.color||T.gold}55,0 8px 32px rgba(0,0,0,.8)`}}>
              <div style={{fontSize:38,flexShrink:0,filter:`drop-shadow(0 0 10px ${newAchievement.color||T.gold})`}}>{newAchievement.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:8,color:newAchievement.color||T.gold,letterSpacing:3,...mono,marginBottom:3}}>🏆 ACHIEVEMENT · {(newAchievement.tier||"bronze").toUpperCase()}</div>
                <div style={{...orb,fontSize:14,fontWeight:900,color:T.bright,lineHeight:1.2}}>{newAchievement.name}</div>
                <div style={{fontSize:11,color:T.muted,...raj,marginTop:3}}>{newAchievement.desc}</div>
                {newAchievement.xp>0&&<div style={{fontSize:9,color:newAchievement.color||T.gold,...mono,marginTop:5,background:(newAchievement.color||T.gold)+"22",display:"inline-block",padding:"2px 8px",borderRadius:10}}>+{newAchievement.xp} XP BONUS</div>}
              </div>
            </div>
          </div>
        )}

        {/* ── XP TOAST ── */}
        {xpToast&&(
          <div style={{position:"fixed",top:70,left:"50%",transform:"translateX(-50%)",zIndex:999,background:`linear-gradient(135deg,${T.bg2},${T.bg3})`,border:`1px solid ${xpToast.amount<0?T.red+"66":T.gold+"66"}`,borderRadius:20,padding:"8px 18px",display:"flex",gap:8,alignItems:"center",animation:"xpToast 2.2s ease forwards",boxShadow:`0 0 20px ${xpToast.amount<0?T.red:T.gold}33`,pointerEvents:"none"}}>
            <span style={{fontSize:16}}>{xpToast.amount<0?"↩":"⚡"}</span>
            <span style={{...orb,fontSize:13,fontWeight:700,color:xpToast.amount<0?T.red:T.gold}}>{xpToast.amount>0?"+":""}{xpToast.amount} XP</span>
            <span style={{fontSize:11,color:T.text,...raj}}>{xpToast.label}</span>
          </div>
        )}

        {/* ── TOP NAV BAR ── */}
        <div style={{background:"linear-gradient(180deg,#020d08,#020408)",borderBottom:`1px solid ${T.green}33`,padding:"10px 16px 8px",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(12px)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{...orb,fontSize:13,fontWeight:900,...gt(T.green)}}>⚔️ COMEBACK OS</div>
              <div style={{display:"flex",gap:6,alignItems:"center",marginTop:2}}>
                <div style={{fontSize:9,color:T.dim,letterSpacing:1,...mono}}>{rank.title} · {Math.max(0,Math.floor((new Date("2026-06-01")-new Date())/86400000))}d LEFT</div>
                <span style={{fontSize:9,color:T.border}}>·</span>
                <LiveTimeBar/>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <button onClick={()=>{if(!battlePin){setShowSetPin(true);}else{setBattleMode(true);setBattleStart(Date.now());}}} className="btn-tap" style={{padding:"5px 10px",background:T.pink+"22",border:`1px solid ${T.pink}33`,borderRadius:8,color:T.pink,fontSize:9,...mono,cursor:"pointer",letterSpacing:1}}>⚔️</button>
              <div style={{textAlign:"right"}}>
                <div style={{...orb,fontSize:11,color:T.green,fontWeight:700}}>{tp}%</div>
                <div style={{fontSize:8,color:T.gold,...mono}}>⚡{xp} · LVL{xpLevel}</div>
              </div>
              <Ring pct={tp} size={38} stroke={3} color={T.green}/>
            </div>
          </div>
          <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(0deg,transparent,transparent 3px,#00ff0804 4px)",pointerEvents:"none"}}/>
        </div>

        {/* ── SET PIN MODAL ── */}
        {showSetPin&&(
          <div style={{position:"fixed",inset:0,zIndex:1800,background:"rgba(0,0,0,0.9)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowSetPin(false)}>
            <div style={{...C({padding:"24px",border:`1px solid ${T.pink}44`,minWidth:280}),animation:"fadeUp .3s"}} onClick={e=>e.stopPropagation()}>
              <div style={{...orb,fontSize:14,fontWeight:900,color:T.pink,marginBottom:4}}>SET BATTLE PIN</div>
              <div style={{fontSize:11,color:T.muted,...raj,marginBottom:16}}>4-digit PIN to lock your app in focus mode</div>
              <input value={pinInput1} onChange={e=>setPinInput1(e.target.value.replace(/\D/g,"").slice(0,4))} type="password" placeholder="Enter 4-digit PIN" style={{width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 12px",color:T.bright,fontSize:16,...orb,marginBottom:10,textAlign:"center",boxSizing:"border-box"}}/>
              <input value={pinInput2} onChange={e=>setPinInput2(e.target.value.replace(/\D/g,"").slice(0,4))} type="password" placeholder="Confirm PIN" style={{width:"100%",background:T.bg2,border:`1px solid ${pinInput2&&pinInput1!==pinInput2?T.red:T.border}`,borderRadius:8,padding:"10px 12px",color:T.bright,fontSize:16,...orb,marginBottom:16,textAlign:"center",boxSizing:"border-box"}}/>
              {pinInput2&&pinInput1!==pinInput2&&<div style={{fontSize:10,color:T.red,...mono,marginBottom:10}}>PINs don't match</div>}
              <button onClick={()=>{if(pinInput1.length===4&&pinInput1===pinInput2){setBattlePin(pinInput1);setPinInput1("");setPinInput2("");setShowSetPin(false);gainXP(10,"Battle PIN set 🔒");}}} disabled={pinInput1.length!==4||pinInput1!==pinInput2} style={{width:"100%",padding:"11px",background:T.pink+"33",border:`1px solid ${T.pink}55`,color:T.pink,borderRadius:8,fontSize:12,...orb,fontWeight:700,cursor:"pointer",opacity:pinInput1.length===4&&pinInput1===pinInput2?1:0.4}}>ACTIVATE BATTLE MODE</button>
            </div>
          </div>
        )}

        {/* ── MAIN CONTENT ── keyboard stays open because tabs are called as
              plain functions (not JSX components), so React never unmounts/
              remounts them on state change — no more focus loss on keypress  */}
        <div style={{paddingBottom:68}}>
          {tab==="home"&&Home()}
          {tab==="plan"&&Plan()}
          {tab==="body"&&Body()}
          {tab==="focus"&&Focus()}
          {tab==="me"&&Me()}
          {tab==="progress"&&Progress()}
          {tab==="tasks"&&TasksNotes()}
          {tab==="goals"&&Goals()}
          {tab==="stats"&&Stats()}
          {tab==="life"&&Life()}
        </div>

        {/* ── QUOTE MODAL ── */}
        {showQuoteModal&&(
          <div style={{position:"fixed",inset:0,zIndex:3500,background:"rgba(2,4,8,0.97)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32}} onClick={()=>setShowQuoteModal(false)}>
            <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(0deg,transparent,transparent 28px,#00ff0806 29px),repeating-linear-gradient(90deg,transparent,transparent 28px,#00ff0806 29px)",pointerEvents:"none"}}/>
            <div style={{fontSize:48,marginBottom:20,filter:"drop-shadow(0 0 30px #00ff8888)",animation:"breathe 3s infinite"}}>⚔️</div>
            <div style={{fontSize:9,color:T.dim,letterSpacing:4,...mono,marginBottom:20,textAlign:"center"}}>COMEBACK FUEL · {quoteIdx+1}/{PROFILE.quotes.length}</div>
            <div key={quoteIdx} style={{fontSize:18,color:T.bright,...raj,fontWeight:600,lineHeight:1.8,textAlign:"center",maxWidth:340,animation:"quoteFade .4s ease",fontStyle:"italic",textShadow:`0 0 20px ${T.green}22`}}>
              "{PROFILE.quotes[quoteIdx]}"
            </div>
            <div style={{display:"flex",gap:12,marginTop:32}}>
              <button onClick={e=>{e.stopPropagation();setQuoteIdx(q=>(q-1+PROFILE.quotes.length)%PROFILE.quotes.length);}} className="btn-tap" style={{padding:"10px 20px",background:T.bg1,border:`1px solid ${T.border}`,color:T.muted,borderRadius:10,fontSize:12,...mono,cursor:"pointer"}}>← PREV</button>
              <button onClick={e=>{e.stopPropagation();setQuoteIdx(q=>(q+1)%PROFILE.quotes.length);}} className="btn-tap" style={{padding:"10px 20px",background:T.green+"22",border:`1px solid ${T.green}44`,color:T.green,borderRadius:10,fontSize:12,...mono,cursor:"pointer"}}>NEXT →</button>
            </div>
            <div style={{fontSize:10,color:T.dim,...mono,marginTop:20}}>tap anywhere to close</div>
          </div>
        )}

        {/* ── MSC DEADLINES MODAL ── */}
        {showMscDeadlines&&(
          <div style={{position:"fixed",inset:0,zIndex:2500,background:"rgba(0,0,0,0.9)",display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setShowMscDeadlines(false)}>
            <div style={{background:T.bg1,borderRadius:"16px 16px 0 0",padding:"20px",width:"100%",maxWidth:430,animation:"slideUp .3s ease"}} onClick={e=>e.stopPropagation()}>
              <div style={{width:36,height:4,background:T.border,borderRadius:2,margin:"0 auto 16px"}}/>
              <div style={{...orb,fontSize:14,fontWeight:900,color:T.blue,marginBottom:4}}>🏛️ MSc DEADLINES</div>
              <div style={{fontSize:11,color:T.muted,...raj,marginBottom:16}}>Every deadline. Don't miss a single one.</div>
              {MSC_DEADLINES.map((d,i)=>{
                const days=Math.max(0,Math.floor((new Date(d.date)-new Date())/86400000));
                const urgent=days<=30;
                return(
                  <div key={i} style={{display:"flex",gap:12,alignItems:"center",padding:"12px",marginBottom:8,background:T.bg2,borderRadius:10,border:`1px solid ${urgent&&days>0?d.color+"88":d.color+"33"}`,animation:urgent&&days>0?"challengePulse 3s infinite":"none"}}>
                    <span style={{fontSize:22,flexShrink:0}}>{d.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,color:T.bright,fontWeight:600,...raj}}>{d.uni}</div>
                      <div style={{fontSize:10,color:T.muted,...mono,marginTop:2}}>{d.note}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{...orb,fontSize:16,fontWeight:900,color:days===0?"#ff2244":urgent?d.color:T.muted}}>{days===0?"TODAY":days+"d"}</div>
                      <div style={{fontSize:8,color:T.dim,...mono}}>{new Date(d.date).toLocaleDateString([],{month:"short",day:"numeric"})}</div>
                    </div>
                  </div>
                );
              })}
              <button onClick={()=>setShowMscDeadlines(false)} style={{width:"100%",marginTop:8,padding:"11px",background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:8,cursor:"pointer",...mono,fontSize:11}}>CLOSE</button>
            </div>
          </div>
        )}

        {/* ── WEEKLY REVIEW MODAL ── */}
        {showWeeklyReview&&(
          <div style={{position:"fixed",inset:0,zIndex:2500,background:"rgba(0,0,0,0.9)",display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setShowWeeklyReview(false)}>
            <div style={{background:T.bg1,borderRadius:"16px 16px 0 0",padding:"20px",width:"100%",maxWidth:430,animation:"slideUp .3s ease",maxHeight:"85vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
              <div style={{width:36,height:4,background:T.border,borderRadius:2,margin:"0 auto 16px"}}/>
              <div style={{...orb,fontSize:14,fontWeight:900,color:T.gold,marginBottom:4}}>📋 WEEKLY REVIEW</div>
              <div style={{fontSize:11,color:T.muted,...raj,marginBottom:16}}>Sunday ritual — reflect, reset, reload.</div>
              {/* Stats for the week */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
                {[{l:"TASKS DONE",v:Object.values(tasksDone).filter(Boolean).length,c:T.green},{l:"STREAK",v:`${streak}d`,c:T.gold},{l:"DAILY SCORE",v:`${dailyScore}/100`,c:scoreColor}].map((s,i)=>(
                  <div key={i} style={{background:s.c+"11",border:`1px solid ${s.c}22`,borderRadius:8,padding:"8px",textAlign:"center"}}>
                    <div style={{...orb,fontSize:14,fontWeight:900,color:s.c}}>{s.v}</div>
                    <div style={{fontSize:7,color:T.muted,...mono,marginTop:2}}>{s.l}</div>
                  </div>
                ))}
              </div>
              {[{label:"🏆 What was your biggest WIN this week?",key:"win",placeholder:"e.g. Finished CRO implementation, supervisor approved Chapter 3..."},
                {label:"⚠️ What will you IMPROVE next week?",key:"improve",placeholder:"e.g. Start earlier, reduce phone time, be consistent with sleep..."},
                {label:"🎯 What is your ONE main focus for next week?",key:"focus",placeholder:"e.g. Complete SHAP integration and run first full experiment..."}].map(f=>(
                <div key={f.key} style={{marginBottom:12}}>
                  <div style={{fontSize:11,color:T.text,...raj,fontWeight:600,marginBottom:6}}>{f.label}</div>
                  <textarea value={weekReflect[f.key]} onChange={e=>setWeekReflect(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} style={{width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 12px",color:T.text,fontSize:12,...raj,lineHeight:1.7,resize:"none",height:70,boxSizing:"border-box"}}/>
                </div>
              ))}
              <button onClick={()=>{
                const weekKey=`week_${new Date().getFullYear()}_${Math.floor((new Date().getTime()-(new Date(new Date().getFullYear(),0,1)).getTime())/604800000)}`;
                setWeekReviews(p=>({...p,[weekKey]:{...weekReflect,date:new Date().toLocaleDateString(),score:dailyScore}}));
                gainXP(30,"Weekly Review completed 📋");
                setShowWeeklyReview(false);
                setWeekReflect({win:"",improve:"",focus:""});
              }} className="btn-tap" style={{width:"100%",padding:"12px",background:T.gold+"33",border:`1px solid ${T.gold}55`,color:T.gold,borderRadius:8,fontSize:12,...orb,fontWeight:700,cursor:"pointer",marginBottom:8}}>SAVE REVIEW +30 XP</button>
              <button onClick={()=>setShowWeeklyReview(false)} style={{width:"100%",padding:"9px",background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:8,cursor:"pointer",...mono,fontSize:11}}>CLOSE</button>
            </div>
          </div>
        )}

        {/* ── QUICK LOG FAB ── */}
        {showQuickLog&&(
          <div style={{position:"fixed",inset:0,zIndex:1900,background:"rgba(0,0,0,0.7)"}} onClick={()=>setShowQuickLog(false)}>
            <div style={{position:"fixed",bottom:78,right:16,display:"flex",flexDirection:"column",gap:8,animation:"fab .3s ease"}} onClick={e=>e.stopPropagation()}>
              {[
                {label:"💧 +1 Water",action:()=>{if(waterCount<8){const nx=waterCount+1;setWaterCount(nx);if(nx===8)gainXP(15,"Hydrated! 💧","hydration",true);}}},
                {label:"😤 Log Mood",action:()=>{setTab("home");setShowQuickLog(false);}},
                {label:"📓 War Log",action:()=>{const t=prompt("Quick log entry:");if(t?.trim()){setDailyLog(p=>[{id:Date.now(),text:t,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),date:TODAY},...p]);gainXP(5,"Entry logged 📓");}}},
                {label:"⚖️ Weight",action:()=>{setTab("progress");setShowQuickLog(false);}},
                {label:"🍽️ Log Meal",action:()=>{setTab("home");setShowQuickLog(false);}},
              ].map((a,i)=>(
                <button key={i} onClick={()=>{a.action();setShowQuickLog(false);}} className="btn-tap" style={{padding:"9px 16px",background:T.bg1,border:`1px solid ${T.border}`,borderRadius:20,color:T.bright,fontSize:12,...raj,cursor:"pointer",whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,0,0,0.5)",textAlign:"left"}}>{a.label}</button>
              ))}
            </div>
          </div>
        )}
        {/* FAB button */}
        <button onClick={()=>setShowQuickLog(q=>!q)} className="btn-tap" style={{position:"fixed",bottom:78,right:16,width:48,height:48,borderRadius:"50%",background:`linear-gradient(135deg,${T.green},${T.blue})`,border:"none",color:"#020408",fontSize:22,cursor:"pointer",zIndex:showQuickLog?1901:150,boxShadow:`0 4px 20px ${T.green}66`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,transition:"all .2s",transform:showQuickLog?"rotate(45deg)":"rotate(0)"}}>+</button>

        {/* ── BOTTOM NAV ── */}
        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"rgba(2,4,8,0.97)",borderTop:`1px solid ${T.green}22`,backdropFilter:"blur(16px)",display:"flex",zIndex:100,overflowX:"auto"}}>
          {[
            {id:"home",icon:"🏠",label:"HOME"},
            {id:"plan",icon:"📅",label:"PLAN"},
            {id:"body",icon:"💪",label:"BODY"},
            {id:"focus",icon:"⏱",label:"FOCUS"},
            {id:"me",icon:"👤",label:"ME"},
            {id:"progress",icon:"📈",label:"TRACK"},
            {id:"tasks",icon:"✅",label:"TASKS"},
            {id:"goals",icon:"🎯",label:"GOALS"},
            {id:"life",icon:"⚡",label:"LIFE"},
            {id:"stats",icon:"🏅",label:"STATS"},
          ].map(t=>(
            <div key={t.id} className="tabitem" onClick={()=>setTab(t.id)} style={{flex:1,padding:"7px 2px",textAlign:"center",cursor:"pointer",borderTop:tab===t.id?`2px solid ${T.green}`:"2px solid transparent",background:tab===t.id?"#00ff8808":"transparent",transition:"all .2s",minWidth:40}}>
              <div style={{fontSize:12}}>{t.icon}</div>
              <div style={{fontSize:6,color:tab===t.id?T.green:T.muted,marginTop:1,letterSpacing:.3,...orb}}>{t.label}</div>
            </div>
          ))}
        </div>
      </div>
  );
}
