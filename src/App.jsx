/* eslint-disable */
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const AdmissionsDashboard = lazy(() => import("./AdmissionsDashboard"));
const AdmissionsTab = lazy(() => import("./components/features/AdmissionsTab"));
const Home = lazy(() => import("./components/features/Home"));
const DashboardOverview = lazy(() => import("./components/features/DashboardOverview"));
const Plan = lazy(() => import("./components/features/Plan"));
const Body = lazy(() => import("./components/features/Body"));
const BodyTab = lazy(() => import("./components/features/BodyTab"));
import PageTransition from "./components/layout/PageTransition";
import QuickLog from "./components/layout/QuickLog";
const Sidebar = lazy(() => import("./components/layout/Sidebar"));
const SleepMoodCorrelator = lazy(() => import("./components/features/SleepMoodCorrelator"));
const ThesisProgressRings = lazy(() => import("./components/features/ThesisProgressRings"));
const BattleModeToggle = lazy(() => import("./components/features/BattleModeToggle"));
const StreakFlameVisualizer = lazy(() => import("./components/features/StreakFlameVisualizer"));
const PersonalAIAssistant = lazy(() => import("./components/features/PersonalAIAssistant"));
const InteractiveQuickActionGrid = lazy(() => import("./components/features/InteractiveQuickActionGrid"));
const CinematicWelcomeHUD = lazy(() => import("./components/features/CinematicWelcomeHUD"));
const RealTimeStatusIndicator = lazy(() => import("./components/features/RealTimeStatusIndicator"));
const AppStatusPipeline = lazy(() => import("./components/features/AppStatusPipeline"));
const ResearchMilestoneTracker = lazy(() => import("./components/features/ResearchMilestoneTracker"));
const Life = lazy(() => import("./components/features/Life"));
const StatsTab = lazy(() => import("./components/features/StatsTab"));
const TasksNotes = lazy(() => import("./components/features/TasksNotes"));
const Goals = lazy(() => import("./components/features/Goals"));
const FocusTab = lazy(() => import("./components/features/FocusTab"));
const MeTab = lazy(() => import("./components/features/MeTab"));
const ProgressTab = lazy(() => import("./components/features/ProgressTab"));
const PlanTab = lazy(() => import("./components/features/PlanTab"));
import { AppProvider } from "./context/AppContext";

// Fallback for lazy loading
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#020408]">
    <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-400 rounded-full animate-spin" />
  </div>
);

// ─── FIREBASE CONFIG ─────────────────────────────────────────────────────────
// Values loaded from environment variables for security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate required env vars
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("❌ Missing Firebase environment variables. Check your .env file.");
}
// ─────────────────────────────────────────────────────────────────────────────

const fbApp    = initializeApp(firebaseConfig);
const db       = getFirestore(fbApp);
const USER_DOC = doc(db, "users", "rudra");

async function loadState() {
  // Try localStorage first for instant load
  try { 
    const s = localStorage.getItem("comeback_os"); 
    if (s) return JSON.parse(s); 
  } catch {}
  
  // Firebase with 3s timeout (source of truth for cloud sync)
  try {
    const snap = await Promise.race([
      getDoc(USER_DOC),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))
    ]);
    if (snap.exists()) {
      const d = snap.data();
      try { localStorage.setItem("comeback_os", JSON.stringify(d)); } catch {}
      return d;
    }
  } catch (e) {
    // Firebase failed or timed out, use localStorage
  }
  
  // Final fallback
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
  ::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#00ff8855,#00b4ff44);border-radius:2px;}
  @keyframes fadeUp{0%{opacity:0;transform:translateY(14px) scale(0.98)}100%{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes popIn{0%{transform:scale(.5);opacity:0;filter:blur(4px)}60%{transform:scale(1.06)}100%{transform:scale(1);opacity:1;filter:blur(0)}}
  @keyframes xpToast{0%{opacity:0;transform:translateY(20px) scale(.8)}15%{opacity:1;transform:translateY(0) scale(1.05)}25%{transform:translateY(0) scale(1)}80%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-20px) scale(.8)}}
  @keyframes badgePop{0%{transform:scale(0) rotate(-20deg);opacity:0;filter:blur(6px)}50%{transform:scale(1.15) rotate(2deg);filter:blur(0)}100%{transform:scale(1) rotate(0deg);opacity:1}}
  @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
  @keyframes battlePulse{0%,100%{box-shadow:0 0 0 0 #ff006e22}50%{box-shadow:0 0 24px 6px #ff006e33}}
  @keyframes quoteFade{0%{opacity:0;transform:translateY(8px) scale(0.98)}100%{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes slideUp{0%{opacity:0;transform:translateY(100%)}100%{opacity:1;transform:translateY(0)}}
  @keyframes slideDown{0%{opacity:0;transform:translateY(-20px)}100%{opacity:1;transform:translateY(0)}}
  @keyframes scoreCount{0%{transform:scale(1)}50%{transform:scale(1.2)}100%{transform:scale(1)}}
  @keyframes burnout{0%,100%{border-color:#ff224444}50%{border-color:#ff2244aa}}
  @keyframes challengePulse{0%,100%{box-shadow:0 0 0 0 #ffd70022}50%{box-shadow:0 0 20px 6px #ffd70033}}
  @keyframes fab{0%{transform:scale(0) rotate(-180deg);filter:blur(4px)}70%{transform:scale(1.1) rotate(10deg)}100%{transform:scale(1) rotate(0deg);filter:blur(0)}}
  @keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
  @keyframes clockPulse{0%,100%{opacity:1}50%{opacity:.35}}
  @keyframes tickerSlide{0%{transform:translateX(100%)}100%{transform:translateX(-100%)}}
  @keyframes glowPulse{0%,100%{box-shadow:0 0 0 0 #00ff8822}50%{box-shadow:0 0 20px 6px #00ff8833}}
  @keyframes progressFill{0%{width:0%}100%{width:var(--w)}}
  @keyframes breathe{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.04);opacity:1}}
  @keyframes pageIn{0%{opacity:0;transform:translateY(10px) scale(0.98)}100%{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes navGlow{0%,100%{box-shadow:inset 0 1px 0 rgba(0,255,136,0.05)}50%{box-shadow:inset 0 1px 0 rgba(0,255,136,0.15),0 0 12px rgba(0,255,136,0.05)}}
  @keyframes floatOrb{0%,100%{transform:translate(0,0) scale(1)}25%{transform:translate(10px,-15px) scale(1.05)}50%{transform:translate(-5px,-25px) scale(0.95)}75%{transform:translate(-15px,-10px) scale(1.02)}}
  .btn-tap{transition:all .15s cubic-bezier(.4,0,.2,1);}
  .btn-tap:active{transform:scale(.93);}
  .btn-tap:hover{filter:brightness(1.12);}
  .hovlift{transition:all .25s cubic-bezier(.34,1.56,.64,1);}
  .hovlift:hover{transform:translateY(-3px);box-shadow:0 6px 20px rgba(0,0,0,.3);}
  .tabitem{transition:all .2s cubic-bezier(.4,0,.2,1);position:relative;}
  .tabitem:hover{background:rgba(0,255,136,0.06) !important;}
  .tabitem:active{transform:scale(.92);transition:transform .1s;}
  input,textarea,select{outline:none;font-family:inherit;transition:border-color .2s,box-shadow .2s;}
  input:focus,textarea:focus{border-color:rgba(0,255,136,0.5) !important;box-shadow:0 0 0 2px rgba(0,255,136,0.1);}
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
  name:"Peash Das Rudra", age:25, title:"Final-year CSE · RevOps Team Lead · eFootball Athlete · Cricket #7",
  university:"Northern University of Business and Technology, Bangladesh (NUBTK)",
  degree:"B.Sc. Computer Science & Engineering",
  thesis:"Interpretable ML for Cancer Subtype Prediction using CRO and SHAP",
  supervisor:"Md. Riaz Mahmud",
  career:{from:"CRM Intern",to:"RevOps Team Lead",company:"Clickless"},
  sports:{eFootball:{team:"Bayern Munich",role:"Player"},cricket:{role:"Wicketkeeper-batsman",jersey:7}},
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
  {week:1,dates:"May 9-15",phase:1,thesis:["?? Explore BRCA dataset � df.info(), df.describe(), check nulls","?? Read supervisor Mr. Reaj Mohammed's 2�3 CRO papers","?? Book + attend supervisor meeting � ask which CRO variant","?? Create GitHub repo /data /src /results /thesis � push first commit"],csprep:["?? Arrays, Linked Lists, Stack, Queue � theory + complexity","?? Solve 3 easy LeetCode DSA problems","?? Write 1-page revision summary"],ielts:["?? 10 new academic words daily","?? 1 IELTS reading passage for understanding"],admission:["?? Bookmark: pgadmission.buet.ac.bd, kuet.ac.bd/pgadmission, msadmission.cse.du.ac.bd, ku.ac.bd/discipline/cse","?? KUET min CGPA 2.75 � you have 3.95 ?"],blocker:"CRITICAL: Supervisor meeting THIS week. Everything flows from this one action.",milestone:"? Supervisor aligned + GitHub live + Dataset explored + First workout done"},
  {week:2,dates:"May 16-22",phase:1,thesis:["?? Handle missing values per omics layer","?? Normalize: log2 gene expression, scale methylation 0�1","?? Align samples by patient ID across all omics layers","?? Save clean dataset as preprocessed.pkl"],csprep:["?? Binary Trees, BST, Heap � theory + complexity","?? Implement max-heap from scratch in Python","?? 3 tree problems on LeetCode"],ielts:["?? 10 words/day � use each in a sentence","?? Write 1 paragraph about your thesis in English"],admission:["?? Check BUET pgadmission.buet.ac.bd � note next MSc intake date","??? Collect SSC/HSC/BSc certificates + transcripts"],blocker:"Dataset must be clean before any algorithm work. No shortcuts here.",milestone:"? Clean preprocessed.pkl saved. Eating 3 meals + 2 snacks consistently."},
  {week:3,dates:"May 23-29",phase:1,thesis:["?? Literature review: 15 papers (5 CRO + 5 SHAP + 5 multi-omics cancer)","?? Understand binary CRO: molecule = 0/1 feature vector encoding","?? EDA: correlation heatmaps, class distribution, feature counts","?? Create literature_notes.md � track all references"],csprep:["?? Graphs: BFS, DFS, Dijkstra, Bellman-ford � theory + code","?? Implement BFS + DFS in Python","?? 3 graph problems on LeetCode"],ielts:["?? 10 words/day","??? Speak 2 minutes: 'Technology in healthcare'"],admission:["?? BUET past exam questions � list weak topics honestly","?? Which CS subjects feel rusty? Write them down"],blocker:"GitHub commits every 2�3 days. Build the discipline now.",milestone:"? Lit notes done. EDA plots generated. Weak exam topics identified."},
  {week:4,dates:"May 30-Jun 5",phase:2,thesis:["?? Implement CRO: molecules class, energy function, decomposition reaction","?? Binary encoding: molecule = np.array of 0s and 1s","? Test CRO on toy dataset (10 features, 50 samples)","?? Send CRO skeleton code to supervisor for review"],csprep:["?? Sorting: QuickSort, MergeSort, HeapSort complexity","?? Implement QuickSort + MergeSort in Python","?? Write complexity comparison table"],ielts:["?? Task 2: 'Technology changes how people work'","?? Cambridge IELTS Practice Tests � download and start"],admission:["?? One table comparing BUET vs KUET vs KU vs DU exam format","?? Decide primary target university � commit to it today"],blocker:"BUET MSc circular may open April�May � check cse.buet.ac.bd TODAY.",milestone:"? CRO skeleton runs without errors. Supervisor reviewed. Weight +1kg."},
  {week:5,dates:"Jun 6-12",phase:2,thesis:["?? Add fitness function: f(molecule) = cross-validation RF accuracy","?? Run CRO on BRCA subset (start with 100 samples)","?? Plot convergence curve: energy vs iterations","?? Debug � consult supervisor if stuck more than 2 hours"],csprep:["?? Dynamic Programming: Knapsack, LCS, Coin Change","?? Fibonacci memoization + 0/1 Knapsack implementation","?? 2 DP problems"],ielts:["?? Task 2: 'Education should be free for all'","?? Self-assess: grammar, coherence, task response"],admission:["?? Check ku.ac.bd/discipline/cse � KU MSc CSE Nov�Dec 2026 intake","?? Draft email to KU CSE department about intake schedule"],blocker:"CRO on full dataset is slow � use 100 samples + 200 features max first.",milestone:"? CRO selects feature subset. Convergence curve plotted. Smoking =3/day."},
  {week:6,dates:"Jun 13-15",phase:2,thesis:["?? Train Random Forest on CRO-selected features � record Acc, F1, AUC","?? Train SVM (RBF kernel) on same features � record metrics","?? Train XGBoost on same features � record all metrics","?? Build results table: Features | Acc | F1 | AUC"],csprep:["?? SQL: SELECT, JOIN, GROUP BY, subqueries, triggers","?? Write 8 SQL queries of increasing complexity","?? 3 SQL problems"],ielts:["?? 10 words/day","?? Timed reading: 1 passage in 20 minutes"],admission:["?? CHECK cse.buet.ac.bd for MSc 2026 circular � April�May window!","??? All documents scanned as PDF and ready to upload"],blocker:"Thesis deadline June 15 � CRO results must be ready for chapters.",milestone:"? 3 classifiers trained. Results table populated. QUIT SMOKING WEEK."},
  {week:7,dates:"Jun 16-22",phase:3,thesis:["?? pip install shap � run SHAP on trained XGBoost model","??? Generate: shap.summary_plot, beeswarm_plot, bar_plot","?? Identify top 20 SHAP features � write them down","?? Cross-reference top genes with known BRCA biomarkers (ESR1, ERBB2, PIK3CA)"],csprep:["?? OOP: classes, inheritance, polymorphism, abstract classes","?? Mini OOP project: Student Management System","?? 2 OOP design questions"],ielts:["?? Task 1: describe a bar chart about university enrollment","??? Describe your research in 2 minutes � record yourself and listen"],admission:["?? Write Statement of Purpose (SOP) � 1-page draft","?? Request recommendation letters from 2 professors"],blocker:"SHAP top genes must match known BRCA markers. Verify in published literature.",milestone:"? SHAP plots = KEY THESIS FIGURES complete. Face noticeably better from reduced smoking."},
  {week:8,dates:"Jun 23-29",phase:3,thesis:["?? Tune CRO: test pop sizes 10�50, iterations 100�500","?? Run CRO 5� with different seeds � report mean � std accuracy","?? Biological validation: SHAP genes vs published BRCA gene signatures","?? Major supervisor check-in � present ALL current results"],csprep:["?? Theory of Computation: DFA, NFA, CFG, pumping lemma","?? Practice NFA ? DFA conversion","?? TOC problems � hardest topic, give extra time"],ielts:["?? Full IELTS mock test (all 4 sections, timed)","?? Score yourself � identify weakest section"],admission:["?? Revise SOP � get feedback from someone you trust","?? Portfolio: thesis abstract + 1-page preliminary results summary"],blocker:"Don't tune CRO parameters blindly � discuss results with supervisor first.",milestone:"? Best CRO params found. Biological validation done. SOP polished."},
  {week:9,dates:"Jun 30-Jul 6",phase:3,thesis:["?? pip install deap � implement GA feature selection","?? pip install pyswarms � implement PSO feature selection","?? LASSO + RFE via scikit-learn � 1 day each","?? Run all 5 methods on identical BRCA dataset and same train/test split"],csprep:["?? OS: scheduling (FCFS/SJF/Round Robin), deadlocks, paging","?? Draw OS scheduling Gantt charts by hand","?? 3 OS problems"],ielts:["?? Task 2: 'AI will replace human jobs � both views'","?? Focus vocabulary from mock test weak areas"],admission:["?? Check ku.ac.bd for any new MSc 2026 announcements","?? Email KUET CSE department: inquiry about 2026�27 MSc intake date"],blocker:"Use DEAP + pyswarms libraries � NOT implemented from scratch. Too time-consuming.",milestone:"? All 5 baseline methods running. Raw comparison results collected."},
  {week:10,dates:"Jul 7-13",phase:3,thesis:["?? scipy.stats.wilcoxon � CRO vs each baseline (5 separate tests)","?? scipy.stats.friedmanchisquare � all 5 methods together","?? Final comparison table: Method | Features | Acc | F1 | AUC | p-value","?? Plot convergence curves of all methods on same graph"],csprep:["?? Computer Networks: OSI model, TCP/IP, subnettng, HTTP/DNS","?? Practice subnetting math: IP conversion, subnet masks","?? 3 networking problems"],ielts:["?? 3 passages timed: 60 minutes total","?? Every wrong question type � note the pattern"],admission:["?? Finalize document checklist for all 4 universities","??? Get certificates attested or notarized if required"],blocker:"p-value < 0.05 required to claim CRO is significantly better than baselines.",milestone:"? Statistical proof complete. CRO proven better. Weight +5kg from starting point."},
  {week:11,dates:"Jul 14-20",phase:4,thesis:["??? Finalize ALL figures � SHAP, convergence curves, comparison table","?? Write every figure caption � must be self-explanatory to a reader","?? Final results review with supervisor � get written approval to write","?? Organize /results folder: CSVs, plots, trained model files, metrics"],csprep:["?? Digital Logic: NAND/NOR, Boolean algebra, Karnaugh maps, flip-flops","?? Practice K-map simplification problems","?? 3 digital logic problems"],ielts:["??? Record 3 speaking topics � listen back critically and self-grade","?? Second full mock test � target score improvement vs Week 8"],admission:["?? Write professor email templates for all 4 universities","?? Identify 3 professors whose research overlaps your CRO+SHAP thesis"],blocker:"No chapter writing until supervisor approves all results. Physical style upgrade this week.",milestone:"? All figures finalized. Supervisor signed off. Visible physical transformation in mirror."},
  {week:12,dates:"Jul 21-27",phase:4,thesis:["?? Chapter 3: Methodology � CRO algorithm, SHAP integration, dataset details","?? Chapter 4: Results & Analysis � all figures and tables included","?? Consistent formatting throughout both chapters","?? Send Chapters 3 + 4 to supervisor for feedback"],csprep:["?? Full BUET-style mock exam: 2 hours, all topics","?? Score yourself � identify any remaining weak areas","?? Final focused sprint on weakest 2 topics"],ielts:["?? Timed Task 2: exactly 40 minutes � 250+ words mandatory","?? Check word count + coherence + task response criteria"],admission:["?? Send professor emails with 1-page research summary attached","?? Monday reminder: check all 4 university portals for new circulars"],blocker:"Write fast, revise later. A rough first draft beats a perfect blank page every time.",milestone:"? Chapters 3+4 first draft done. +7kg total gain. Shirts fitting completely differently."},
  {week:13,dates:"Jul 28-Aug 3",phase:4,thesis:["?? Chapter 1: Introduction � problem statement, motivation, research gaps","?? Chapter 2: Literature Review � from Week 3 notes, organized by theme","?? Chapter 5: Conclusion � summary, limitations, future work","?? Incorporate all supervisor feedback on Chapters 3 and 4"],csprep:["?? Final sweep: 1 bullet-point page per topic","?? Explain your thesis to a non-expert in under 3 minutes","?? Last intense CS exam prep week before submission"],ielts:["?? Final timed reading practice session","??? Final speaking practice � record and evaluate yourself"],admission:["?? Finalize KUET application at kuet.ac.bd/pgadmission","?? Finalize KU CSE application at ku.ac.bd � Nov�Dec 2026 intake","?? Finalize DU CSEDU at msadmission.cse.du.ac.bd � July 2026"],blocker:"Always cite supervisor's CRO papers in lit review. Strategic, respectful, important.",milestone:"? All 5 chapters drafted. All applications prepared. Confidence at peak level."},
  {week:14,dates:"Aug 4-10",phase:4,thesis:["?? Full thesis revision: flow, grammar, figure references, consistency","?? Write Abstract � 250 words: background + method + results + conclusion","?? Fix all references with Zotero � consistent citation style throughout","?? Format: title page, table of contents, figures list, page numbers uniform"],csprep:["?? Prepare 10 viva questions: 'Why CRO?', 'What is SHAP?', 'How validated?'","?? Practice answers out loud � confidently and concisely","? Light review only now � you are ready for the exam"],ielts:["?? Register for IELTS exam � target September/October 2026","?? Goal: minimum 6.5 overall, 7.0 for strong scholarship applications"],admission:["?? Follow up professor emails if no reply after 1 week","?? Write final cover letter for all university applications"],blocker:"The Abstract must stand alone. A stranger reading it should understand everything.",milestone:"? Thesis 95% complete. IELTS registered. +9�10kg. Hero build is real."},
  {week:15,dates:"Aug 11-17",phase:4,thesis:["?? Final corrections from supervisor's last round of feedback","?? Final formatting pass: font, spacing, margins, page numbers � all uniform","??? Print and bind per university's exact format requirement","?? SUBMIT THESIS BY AUGUST 17 ?"],csprep:["?? Rest � you earned it completely. Light review only.","?? Prepare for thesis defense or viva questions"],ielts:["?? Celebrate submission. Keep 15 minutes daily reading as a habit.","?? IELTS prep continues passively � don't break the momentum"],admission:["?? Note all MSc application deadlines: DU (July), KUET (Aug�Sept), KU (Nov�Dec)","?? Email professors after submission: 'I just submitted my thesis on CRO+SHAP...'"],blocker:"Check exact university formatting guide at Week 1, not Week 15.",milestone:"?? THESIS SUBMITTED. BODY TRANSFORMED. THE COMEBACK IS REAL AND PERMANENT."},
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
  const THESIS_DEADLINE=new Date("2026-06-15T23:59:59");
  const THESIS_START=new Date("2026-05-09");
  const diff=Math.max(0,THESIS_DEADLINE-now);
  const d=Math.floor(diff/86400000),h=Math.floor((diff%86400000)/3600000),m=Math.floor((diff%3600000)/60000),s=Math.floor((diff%60000)/1000);
  const totalDays=Math.ceil((THESIS_DEADLINE-THESIS_START)/86400000);
  const daysGone=Math.ceil((now-THESIS_START)/86400000);
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
export default function App(){
  const [loadedData, setLoadedData] = useState(null);
  const [pinHash,    setPinHash]    = useState(null);
  const [unlocked,   setUnlocked]   = useState(false);

  useEffect(()=>{
    loadState().then(data=>{
      const d = data || {};
      setLoadedData(d);
      setPinHash(d.pinHash || null);
      // If no PIN exists, unlock automatically for the first time
      if(!d.pinHash) setUnlocked(true);
    });
  },[]);

  const handleSetPin=(pin)=>{
    const h=hashPin(pin);
    setPinHash(h);
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

  // Loading screen until Firebase resolves
  if(!loadedData) return(
    <div style={{minHeight:"100vh",background:"#020408",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,fontFamily:"'Orbitron',monospace"}}>
      <style>{GSTYLE}</style>
      <div style={{fontSize:44,animation:"popIn .6s ease"}}>⚔️</div>
      <div style={{color:"#00ff88",fontSize:14,letterSpacing:3,textShadow:"0 0 20px #00ff8866"}}>COMEBACK OS</div>
      <div style={{fontFamily:"'Share Tech Mono',monospace",color:"#2a5a3a",fontSize:10,letterSpacing:2}}>SYNCING WITH CLOUD...</div>
      <div style={{fontFamily:"'Share Tech Mono',monospace",color:"#1a3a2a",fontSize:9,letterSpacing:1,marginTop:4}}>
        {new Date().toLocaleDateString([],{weekday:"short",month:"short",day:"numeric",year:"numeric"})}
      </div>
    </div>
  );

  // PIN screen (only shows if pinHash exists and not yet unlocked)
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

  // Main app
  return(
    <AppProvider>
      <style>{GSTYLE}</style>
      <AppMain
        initialData={loadedData}
        pinHash={pinHash}
        onPinChange={handleSetPin}
      />
    </AppProvider>
  );
}

// ─── APP MAIN — all state initialized correctly from initialData prop ─────────
function AppMain({ initialData:D, pinHash, onPinChange }){
  // ── TODAY helper (used for daily resets) ──
  const TODAY = new Date().toDateString();

  // ── ALL STATE — initialized from D (already loaded from Firebase) ──
  const [tab,setTab]                       = useState("home");
  const [sidebarOpen,setSidebarOpen]       = useState(false);
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
  const [showMoodModal,setShowMoodModal]=useState(false);
  const [showFoodModal,setShowFoodModal]=useState(false);
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
  const C=(extra={})=>({background:"transparent",border:`1px solid ${T.border}`,borderRadius:12,...extra});
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

  // ── PLAN + BODY — extracted to PlanTab + BodyTab ──

  // ── ME (PROFILE) — extracted to MeTab ──

  // ── PROGRESS — extracted to ProgressTab ──

  // ── LIFE TAB — IELTS · Music · Freelance · Prof CRM · Papers · Smoke ──────
  // ── STATS TAB (Enhanced — Interactive, Detailed) ──





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

        {/* ── GLOBAL AMBIENT LIGHTS ── */}
<div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
  <div style={{position:"absolute",top:"-15%",left:"5%",width:460,height:460,
    background:"radial-gradient(circle,rgba(0,255,136,0.12) 0%,transparent 70%)",
    filter:"blur(80px)",animation:"floatOrb 20s ease-in-out infinite"}}/>
  <div style={{position:"absolute",bottom:"-10%",right:"0%",width:400,height:400,
    background:"radial-gradient(circle,rgba(0,180,255,0.10) 0%,transparent 70%)",
    filter:"blur(70px)",animation:"floatOrb 25s ease-in-out infinite reverse"}}/>
  <div style={{position:"absolute",top:"45%",right:"-5%",width:260,height:260,
    background:"radial-gradient(circle,rgba(255,0,110,0.07) 0%,transparent 70%)",
    filter:"blur(55px)",animation:"floatOrb 18s ease-in-out infinite 3s"}}/>
  <div style={{position:"absolute",top:"20%",left:"40%",width:200,height:200,
    background:"radial-gradient(circle,rgba(255,215,0,0.04) 0%,transparent 70%)",
    filter:"blur(60px)",animation:"floatOrb 22s ease-in-out infinite 7s"}}/>
</div>

        {/* ── TOP NAV BAR ── */}
        <div style={{background:"linear-gradient(180deg,rgba(2,4,8,0.85),rgba(2,4,8,0.7))",borderBottom:`1px solid rgba(0,255,136,0.08)`,padding:"12px 16px 10px",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(28px)",WebkitBackdropFilter:"blur(28px)"}}>
          {/* Top accent line */}
          <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${T.green}44,${T.blue}33,transparent)`}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <button onClick={()=>setSidebarOpen(o=>!o)} className="btn-tap" style={{background:`${T.green}08`,border:`1px solid ${T.green}18`,borderRadius:10,padding:"7px 9px",cursor:"pointer",display:"flex",alignItems:"center",gap:4,transition:"all .2s"}}>
                <div style={{width:16,height:2,background:T.green,borderRadius:1,position:"relative",transition:"all .3s",boxShadow:`0 0 6px ${T.green}44`}}>
                  <div style={{width:16,height:2,background:T.green,borderRadius:1,position:"absolute",top:5,left:0,transition:"all .3s"}}/>
                  <div style={{width:12,height:2,background:T.green,borderRadius:1,position:"absolute",top:-5,left:0,transition:"all .3s"}}/>
                </div>
              </button>
              <div>
                <div style={{...orb,fontSize:14,fontWeight:900,...gt(T.green),letterSpacing:1}}>⚔️ COMEBACK OS</div>
                <div style={{display:"flex",gap:6,alignItems:"center",marginTop:2}}>
                  <div style={{fontSize:9,color:T.dim,letterSpacing:1,...mono}}>{rank.title} · {Math.max(0,Math.floor((new Date("2026-06-01")-new Date())/86400000))}d LEFT</div>
                  <span style={{fontSize:9,color:T.border}}>·</span>
                  <LiveTimeBar/>
                </div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <button onClick={()=>{if(!battlePin){setShowSetPin(true);}else{setBattleMode(true);setBattleStart(Date.now());}}} className="btn-tap" style={{padding:"5px 10px",background:T.pink+"18",border:`1px solid ${T.pink}28`,borderRadius:10,color:T.pink,fontSize:9,...mono,cursor:"pointer",letterSpacing:1}}>⚔️</button>
              <div style={{textAlign:"right"}}>
                <div style={{...orb,fontSize:12,fontWeight:700,color:T.green,textShadow:`0 0 8px ${T.green}44`}}>{tp}%</div>
                <div style={{fontSize:8,color:T.gold,...mono}}>⚡{xp} · LVL{xpLevel}</div>
              </div>
            </div>
            <Ring pct={tp} size={40} stroke={3} color={T.green}/>
          </div>
          <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(0deg,transparent,transparent 4px,#00ff0803 5px)",pointerEvents:"none",opacity:.5}}/>
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

        {/* ── MAIN CONTENT ── */}
        <div style={{paddingBottom:68, paddingTop:0}}>
           
          <Sidebar tab={tab} setTab={setTab} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} T={T} />

        <PageTransition tabKey={tab}>
          {tab==="home"&&(
            <DashboardOverview
              T={T} C={C} mono={mono} orb={orb} raj={raj}
              tab={tab} setTab={setTab}
              xp={xp} streak={streak} waterCount={waterCount}
              dailyScore={dailyScore} tasksDone={tasksDone}
              weightLog={weightLog} mood={mood}
              calorieLog={calorieLog}
              level={xpLevel} levelTitle={rank.title}
            />
          )}
          {tab==="plan"&&<PlanTab {...{activeWeek, setActiveWeek, tDone, togT, taskNotes, setTaskNotes, openNote, setOpenNote, T, orb, mono, raj, C, WEEKS, pc, weekPct, Ring}} />}
          {tab==="body"&&<BodyTab {...{
            workoutDay, setWorkoutDay, dayPct, exPct, isSetDone, togSet, setShowExForm, showExForm,
            warmupDone, setWarmupDone, streak, timer, setTimer,
            T, orb, mono, raj, C, gt, DAYS, Ring, RestTimer
          }} />}
          {tab==="focus"&&<FocusTab {...{pomLeft,pomMode,deepFocusLeft,getRank,xp,T,orb,raj,mono,C,Ring,setFocusTab,focusTab,setPomMode,setPomLeft,setPomState,pomState,pomSessions,deepFocusSessions,setDeepFocusSt,setDeepFocusLeft,deepFocusSt,setShowAddHabit,showAddHabit,newHabitName,setNewHabitName,setHabits,habits,TODAY,setHabitHistory,gainXP,takeXP,habitHistory,setShowHabitCal,showHabitCal,XP_RANKS,scoreColor,scoreGrade,dailyScore,PLAYLISTS,xpLevel,streak}} />}
          {tab==="admissions"&&<AdmissionsTab T={T} C={C} mono={mono} orb={orb} raj={raj} gainXP={gainXP} />}
          {tab==="me"&&<MeTab {...{T,orb,mono,raj,C,gt,PROFILE,quoteIdx,setQuoteIdx,setShowChangePin}} />}
          {tab==="progress"&&<ProgressTab {...{T,orb,mono,raj,C,gt,Ring,weightLog,setWeightLog,newWeight,setNewWeight,measurements,setMeasurements,smokingLog,setSmokingLog,newSmoke,setNewSmoke,tp,wPct,sPct,streak,curWeight,wGained,curSmoke,gainXP,takeXP,WEEKS,weekPct,pc,setTab,setActiveWeek,progressTab,setProgressTab}}/>}
          {tab==="tasks"&&<TasksNotes {...{T,orb,mono,raj,C,myTasks,setMyTasks,taskFilter,setTaskFilter,newTask,setNewTask,showAddTask,setShowAddTask,taskSubTab,setTaskSubTab,gainXP,takeXP,notes,setNotes,activeNoteId,setActiveNoteId,showNewNote,setShowNewNote,newNoteTitle,setNewNoteTitle,newNoteBody,setNewNoteBody,noteColor,setNoteColor,researchNotes,setResearchNotes,showResNote,setShowResNote,newResNote,setNewResNote,activeResNote,setActiveResNote}} />}
          {tab==="goals"&&<Goals {...{goalsTab,setGoalsTab,goalsSubTab,setGoalsSubTab,admTab,setAdmTab,admCheckDone,setAdmCheckDone,profEmailDone,setProfEmailDone,expandedExam,setExpandedExam,activePath,setActivePath,activeUni,setActiveUni,PATHS,UNIS,RUDRA_ANALYSIS,SCHOLARSHIP_PROGRAMS,KUET_PROFS,T,orb,mono,raj,gt,C}} />}
          {tab==="stats"&&<StatsTab {...{achievements,ACHIEVEMENTS_DEF,getRank,xp,XP_RANKS,habits,TODAY,T,tp,wPct,sPct,streak,tasksDone,sets,setStatsTab,statsTab,selTier,setSelTier,orb,mono,raj,C,xpLevel,WEEKS,weekPct,pc,setTab,setActiveWeek,pomSessions,weightLog,dailyLog,wGained,curWeight}}/>}
          {tab==="life"&&<Life {...{lifeTab,setLifeTab,ieltsVocab,setIeltsVocab,ieltsMocks,setIeltsMocks,ieltsNewWord,setIeltsNewWord,ieltsTab,setIeltsTab,showIeltsWord,setShowIeltsWord,vocabFlip,setVocabFlip,showIeltsMock,setShowIeltsMock,ieltsNewMock,setIeltsNewMock,musicLog,setMusicLog,musicForm,setMusicForm,showMusicForm,setShowMusicForm,freelanceLog,setFreelanceLog,freelanceForm,setFreelanceForm,showFLForm,setShowFLForm,freelanceGoal,setFreelanceGoal,profCRM,setProfCRM,profForm,setProfForm,showProfForm,setShowProfForm,paperLog,setPaperLog,paperForm,setPaperForm,showPaperForm,setShowPaperForm,smokingLog,smokeGoalDate,setSmokeGoalDate,gainXP,T,orb,mono,raj,C}} />}
        </PageTransition>
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



        {/* ── MOOD MODAL ── */}
        {showMoodModal && (
          <div style={{position:"fixed",inset:0,zIndex:3000,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowMoodModal(false)}>
            <div style={{background:T.bg1,border:`1px solid ${T.gold}44`,borderRadius:16,padding:24,width:"90%",maxWidth:340,animation:"popIn .3s ease"}} onClick={e=>e.stopPropagation()}>
              <div style={{...orb,fontSize:16,color:T.gold,marginBottom:12,textAlign:"center"}}>HOW ARE YOU FEELING?</div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}>
                {["🔥","😤","🧠","😴","💀"].map(m=>(
                  <button key={m} onClick={()=>{
                    setMood(m);
                    setMoodLog(p=>[...p,{date:TODAY,mood:m,time:new Date().toLocaleTimeString()}]);
                    gainXP(10, "Mood logged");
                    setShowMoodModal(false);
                  }} style={{fontSize:32,background:"transparent",border:"none",cursor:"pointer",transition:"transform .2s"}} className="btn-tap">{m}</button>
                ))}
              </div>
              <button onClick={()=>setShowMoodModal(false)} style={{width:"100%",padding:"10px",background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:8,...mono,fontSize:12,cursor:"pointer"}}>CANCEL</button>
            </div>
          </div>
        )}

        {/* ── FOOD MODAL ── */}
        {showFoodModal && (
          <div style={{position:"fixed",inset:0,zIndex:3000,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowFoodModal(false)}>
            <div style={{background:T.bg1,border:`1px solid ${T.orange}44`,borderRadius:16,padding:24,width:"90%",maxWidth:340,animation:"popIn .3s ease"}} onClick={e=>e.stopPropagation()}>
              <div style={{...orb,fontSize:16,color:T.orange,marginBottom:16,textAlign:"center"}}>LOG MEAL</div>
              
              <div style={{marginBottom:12}}>
                <label style={{fontSize:10,color:T.dim,...mono}}>MEAL NAME / LABEL</label>
                <input value={calLabel} onChange={e=>setCalLabel(e.target.value)} placeholder="e.g. Chicken & Rice" style={{width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 12px",color:T.bright,fontSize:14,...raj,marginTop:4,boxSizing:"border-box"}}/>
              </div>

              <div style={{marginBottom:16}}>
                <label style={{fontSize:10,color:T.dim,...mono}}>CALORIES (KCAL)</label>
                <input type="number" value={calInput} onChange={e=>setCalInput(e.target.value)} placeholder="e.g. 500" style={{width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 12px",color:T.bright,fontSize:16,...orb,marginTop:4,boxSizing:"border-box"}}/>
              </div>

              <button onClick={()=>{
                if(calInput && calLabel) {
                  setCalorieLog(p=>[...p,{id:Date.now(),label:calLabel,cals:parseInt(calInput),time:new Date().toLocaleTimeString()}]);
                  gainXP(15, "Meal logged");
                  setCalInput("");
                  setCalLabel("");
                  setShowFoodModal(false);
                }
              }} style={{width:"100%",padding:"12px",background:T.orange+"22",border:`1px solid ${T.orange}55`,color:T.orange,borderRadius:8,...orb,fontWeight:700,fontSize:12,cursor:"pointer",marginBottom:8}}>SAVE MEAL</button>
              <button onClick={()=>setShowFoodModal(false)} style={{width:"100%",padding:"10px",background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:8,...mono,fontSize:12,cursor:"pointer"}}>CANCEL</button>
            </div>
          </div>
        )}

        {/* FAB button */}
        <QuickLog
          T={T} raj={raj} mono={mono}
          waterCount={waterCount} setWaterCount={setWaterCount}
          gainXP={gainXP} setDailyLog={setDailyLog} TODAY={TODAY}
          setTab={setTab} setShowMoodModal={setShowMoodModal} setShowFoodModal={setShowFoodModal}
        />

        {/* ── BOTTOM NAV ── */}
        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,zIndex:100}}>
          {/* Top glow line */}
          <div style={{height:1,background:`linear-gradient(90deg,transparent 5%,${T.green}33 30%,${T.blue}33 50%,${T.green}33 70%,transparent 95%)`,animation:"navGlow 4s ease-in-out infinite"}}/>
          <div style={{background:"rgba(2,4,8,0.94)",backdropFilter:"blur(28px)",WebkitBackdropFilter:"blur(28px)",display:"flex",padding:"4px 8px 6px",gap:2}}>
          {[
            {id:"home",icon:"🏠",label:"HOME"},
            {id:"plan",icon:"📅",label:"PLAN"},
            {id:"body",icon:"💪",label:"BODY"},
            {id:"focus",icon:"⏱",label:"FOCUS"},
            {id:"admissions",icon:"🎓",label:"UNIS"},
            {id:"stats",icon:"📊",label:"STATS"},
            {id:"me",icon:"👤",label:"ME"},
          ].map(t=>(
            <div key={t.id} className="tabitem" onClick={()=>setTab(t.id)} style={{flex:1,padding:"6px 2px 4px",textAlign:"center",cursor:"pointer",borderRadius:10,background:tab===t.id?`${T.green}0a`:"transparent",position:"relative",transition:"all .25s cubic-bezier(.34,1.56,.64,1)"}}>
              {tab===t.id&&<div style={{position:"absolute",top:-1,left:"50%",transform:"translateX(-50%)",width:20,height:2,borderRadius:4,background:T.green,boxShadow:`0 0 10px ${T.green}aa, 0 2px 16px ${T.green}44`}}/>}
              <div style={{fontSize:18,transition:"all .25s cubic-bezier(.34,1.56,.64,1)",transform:tab===t.id?"scale(1.2) translateY(-1px)":"scale(1)",filter:tab===t.id?`drop-shadow(0 0 6px ${T.green}88)`:"none"}}>{t.icon}</div>
              <div style={{fontSize:7,color:tab===t.id?T.green:T.muted,marginTop:1,letterSpacing:.5,...orb,fontWeight:tab===t.id?700:400,transition:"all .2s"}}>{t.label}</div>
            </div>
          ))}
          </div>
        </div>
      </div>
  );
}

