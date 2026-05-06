const fs = require('fs');

const app = `/* eslint-disable */
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

// Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA18GxWg2WNCj4tcj31PsanrtCeBE8ZDVw",
  authDomain: "comeback-os.firebaseapp.com",
  projectId: "comeback-os",
  storageBucket: "comeback-os.firebasestorage.app",
  messagingSenderId: "1059100194426",
  appId: "1:1059100194426:web:41d8eb7390c6e550d111e9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Theme
const T = {
  bg1: "#020408", bg2: "#0a0f14", bright: "#e8f8f0", muted: "#6a8a7a",
  dim: "#3a5a4a", green: "#00ff88", blue: "#00aaff", pink: "#ff0088",
  orange: "#ff8800", gold: "#ffd700", red: "#ff2244", cyan: "#00ffcc",
  border: "#1a2a2a", text: "#a8d8c0", bg: "#020408"
};

// Profile
const PROFILE = {
  name: "Peash Rudra",
  title: "MSc CSE Candidate | Debate Champion",
  university: "Khulna University of Engineering & Technology",
  thesis: "CRO vs SHAP: Interpretable ML for Multi-omics Cancer Subtype Prediction",
  supervisor: "Dr. Susmita Islam",
  quotes: [
    "The fall was public. The comeback will be louder.",
    "Discipline > motivation. Every single time.",
    "3.95 GPA + Debate Champion = Unstoppable.",
    "50kg->60kg. Thesis done. MSc admitted. Watch."
  ]
};

// Weeks (May 6 - Aug 15, 2026)
const WEEKS = [
  {week:1, phase:1, dates:"May 6-12"}, {week:2, phase:1, dates:"May 13-19"},
  {week:3, phase:1, dates:"May 20-26"}, {week:4, phase:1, dates:"May 27-Jun 2"},
  {week:5, phase:2, dates:"Jun 3-9"}, {week:6, phase:2, dates:"Jun 10-16"},
  {week:7, phase:2, dates:"Jun 17-23"}, {week:8, phase:2, dates:"Jun 24-30"},
  {week:9, phase:3, dates:"Jul 1-7"}, {week:10, phase:3, dates:"Jul 8-14"},
  {week:11, phase:3, dates:"Jul 15-21"}, {week:12, phase:3, dates:"Jul 22-28"},
  {week:13, phase:4, dates:"Jul 29-Aug 4"}, {week:14, phase:4, dates:"Aug 5-11"},
  {week:15, phase:4, dates:"Aug 12-15"}
];

function App() {
  const [tab, setTab] = useState("home");
  const [xp, setXp] = useState(0);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [workoutDay, setWorkoutDay] = useState(1);
  const [waterCount, setWaterCount] = useState(0);
  const [weightLog, setWeightLog] = useState([{weight:50, date:"May 6"}]);
  const [dailyLog, setDailyLog] = useState([]);
  const [habits, setHabits] = useState([
    {id:1, name:"Read thesis paper", color:T.green, streak:0, lastDone:""},
    {id:2, name:"Code 1 hour", color:T.blue, streak:0, lastDone:""},
    {id:3, name:"Gym workout", color:T.pink, streak:0, lastDone:""},
    {id:4, name:"Apply university", color:T.orange, streak:0, lastDone:""}
  ]);
  
  const gainXP = (amount) => {
    setXp(x => x + amount);
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(50);
  };
  
  const TODAY = new Date().toDateString();
  const curWeight = weightLog[weightLog.length-1].weight;
  const wGained = Math.max(0, curWeight - 50);
  const daysGone = Math.max(0, Math.floor((new Date() - new Date("2026-05-06"))/86400000));
  const daysToGo = Math.max(0, Math.floor((new Date("2026-08-15") - new Date())/86400000));

  // Home Tab
  const Home = () => (
    <motion.div key="home" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:0.3}} style={{padding:16}}>
      <div style={{background:T.bg2,padding:20,borderRadius:12,border:"1px solid "+T.green+"44"}}>
        <div style={{fontSize:22,fontWeight:900,color:T.green}}>{PROFILE.name}</div>
        <div style={{fontSize:12,color:T.muted,marginTop:2}}>{PROFILE.title}</div>
      </div>
      <div style={{marginTop:12,background:T.bg2,padding:16,borderRadius:12}}>
        <div style={{fontSize:9,color:T.blue,letterSpacing:2,marginBottom:8}}>⚡ DAILY FUEL</div>
        <div style={{fontSize:13,color:T.text,lineHeight:1.9,fontStyle:"italic"}}>{PROFILE.quotes[quoteIdx]}</div>
        <div style={{display:"flex",gap:8,marginTop:12}}>
          <button onClick={() => setQuoteIdx(q => (q+1) % PROFILE.quotes.length)} style={{flex:1,padding:"6px 14px",background:T.blue+"22",border:"1px solid "+T.blue+"44",color:T.blue,borderRadius:7,fontSize:10,cursor:"pointer"}}>NEXT QUOTE</button>
        </div>
      </div>
      <div style={{marginTop:12,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <div style={{background:T.green+"11",border:"1px solid "+T.green+"22",borderRadius:10,padding:12,textAlign:"center"}}>
          <div style={{fontSize:18,fontWeight:900,color:T.green}}>0%</div>
          <div style={{fontSize:7,color:T.muted,marginTop:2}}THESIS</div>
        </div>
        <div style={{background:T.pink+"11",border:"1px solid "+T.pink+"22",borderRadius:10,padding:12,textAlign:"center"}}>
          <div style={{fontSize:18,fontWeight:900,color:T.pink}}>{wGained}kg</div>
          <div style={{fontSize:7,color:T.muted,marginTop:2}}BODY</div>
        </div>
      </div>
      <div style={{marginTop:12,background:T.bg2,padding:14,borderRadius:12}}>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:11,color:T.green}}>Start: May 6, 2026</div>
            <div style={{fontSize:9,color:T.muted}}>{daysGone} days gone</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:11,color:T.orange}}>Deadline: Aug 15</div>
            <div style={{fontSize:9,color:T.muted}}>{daysToGo} days left</div>
          </div>
        </div>
        <div style={{height:6,background:T.bg, borderRadius:3,overflow:"hidden",marginTop:8}}>
          <div style={{width:Math.min(100,daysGone/(daysGone+daysToGo)*100)+"%",height:"100%",background:"linear-gradient(90deg,"+T.green+","+T.orange+")",borderRadius:3}} />
        </div>
      </div>
    </motion.div>
  );

  // Plan Tab
  const Plan = () => {
    const [activeWeek, setActiveWeek] = useState(1);
    const w = WEEKS.find(x => x.week === activeWeek);
    return (
      <motion.div key="plan" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:0.3}} style={{padding:16}}>
        <h2 style={{fontSize:16,fontWeight:900,color:T.bright,marginBottom:4}}>📅 THESIS PLAN</h2>
        <p style={{fontSize:11,color:T.muted,marginBottom:16}}>15 weeks • May 6 → Aug 15, 2026</p>
        <div style={{display:"flex",gap:8,overflowX:"auto",marginBottom:16,paddingBottom:4}}>
          {WEEKS.map(wk => (
            <div key={wk.week} onClick={() => setActiveWeek(wk.week)} style={{padding:"8px 12px",background:activeWeek===wk.week?T.green+"22":"transparent",border:"1px solid "+(activeWeek===wk.week?T.green:T.border),borderRadius:8,cursor:"pointer",flexShrink:0,minWidth:80,textAlign:"center"}}>
              <div style={{fontSize:10,color:activeWeek===wk.week?T.green:T.muted}}>W{wk.week}</div>
              <div style={{fontSize:8,color:T.dim,marginTop:2}}>{wk.dates.split("-")[0]}</div>
            </div>
          ))}
        </div>
        <div style={{background:T.bg2,padding:16,borderRadius:12}}>
          <div style={{fontSize:14,fontWeight:700,color:T.bright,marginBottom:4}}>Week {w.week}: {w.dates}</div>
          <div style={{fontSize:10,color:T.muted}}>Phase {w.phase} • Foundation → Implementation → Experiments → Writing</div>
          <div style={{marginTop:12,padding:12,background:T.green+"11",borderRadius:8}}>
            <div style={{fontSize:11,color:T.text}}>Tasks: Read CRO papers, Read SHAP papers, Survey multi-omics methods</div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Body Tab
  const Body = () => {
    const DAYS = [
      {name:"Chest + Tris",color:T.pink,exercises:["Bench Press 4x8-10","Incline DB 3x10-12"]},
      {name:"Back + Bis",color:T.blue,exercises:["Pullups 4x6-8","Barbell Rows 4x8-10"]},
      {name:"Legs + Shoulders",color:T.orange,exercises:["Squats 4x8-10","Overhead Press 4x8-10"]},
      {name:"Rest + Core",color:T.green,exercises:["Plank 3x60s","Crunches 3x20"]},
      {name:"Cardio + Abs",color:T.red,exercises:["30min Run","Burpees 3x10"]}
    ];
    const d = DAYS[workoutDay-1];
    return (
      <motion.div key="body" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:0.3}} style={{padding:16}}>
        <h2 style={{fontSize:16,fontWeight:900,color:T.bright,marginBottom:4}}>💪 BODY GAINER</h2>
        <p style={{fontSize:11,color:T.muted,marginBottom:16}}>50kg → 60kg • Current: {curWeight}kg</p>
        <div style={{display:"flex",gap:8,overflowX:"auto",marginBottom:16}}>
          {DAYS.map((day,i) => (
            <div key={i} onClick={() => setWorkoutDay(i+1)} style={{padding:"10px 14px",background:workoutDay===i+1?day.color+"22":"transparent",border:"1px solid "+(workoutDay===i+1?day.color:T.border),borderRadius:8,cursor:"pointer",flexShrink:0,minWidth:90,textAlign:"center"}}>
              <div style={{fontSize:10,color:workoutDay===i+1?day.color:T.muted}}>{day.name.split(" ")[0]}</div>
            </div>
          ))}
        </div>
        <div style={{background:T.bg2,padding:16,borderRadius:12}}>
          <div style={{fontSize:14,fontWeight:700,color:T.bright,marginBottom:8}}>{d.name}</div>
          {d.exercises.map((ex,i) => (
            <div key={i} style={{padding:"8px 12px",marginBottom:i<d.exercises.length-1?8:0,background:T.bg1,borderRadius:8}}>
              <div style={{fontSize:12,color:T.text}}>{ex}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:12,background:T.bg2,padding:14,borderRadius:12}}>
          <div style={{fontSize:9,color:T.pink,letterSpacing:2,marginBottom:8}}>⚖️ WEIGHT TRACKER</div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:11,color:T.text}}>Current: {curWeight}kg</span>
            <span style={{fontSize:11,color:T.pink}}>+{wGained}kg gained</span>
          </div>
        </div>
      </motion.div>
    );
  };

  // Focus Tab
  const Focus = () => (
    <motion.div key="focus" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:0.3}} style={{padding:16}}>
      <h2 style={{fontSize:16,fontWeight:900,color:T.bright,marginBottom:4}}>⏱ FOCUS MODE</h2>
      <p style={{fontSize:11,color:T.muted,marginBottom:16}}>Pomodoro timer + habit tracker</p>
      <div style={{background:T.bg2,padding:20,borderRadius:12,border:"1px solid "+T.orange+"44",textAlign:"center"}}>
        <div style={{fontSize:9,color:T.orange,letterSpacing:2,marginBottom:8}}>POMODORO TIMER</div>
        <div style={{fontSize:48,fontWeight:900,color:T.orange,fontFamily:"monospace"}}>25:00</div>
        <button style={{marginTop:12,padding:"8px 20px",background:T.orange+"22",border:"1px solid "+T.orange+"44",color:T.orange,borderRadius:7,fontSize:11,cursor:"pointer"}}>START</button>
      </div>
      <div style={{marginTop:12,background:T.bg2,padding:14,borderRadius:12}}>
        <div style={{fontSize:9,color:T.cyan,letterSpacing:2,marginBottom:10}}>✅ DAILY HABITS</div>
        {habits.map(h => (
          <div key={h.id} style={{display:"flex",gap:10,alignItems:"center",padding:"10px 12px",marginBottom:8,background:h.lastDone===TODAY?h.color+"11":"transparent",border:"1px solid "+(h.lastDone===TODAY?h.color+"44":T.border),borderRadius:8}}>
            <div onClick={() => {
              setHabits(p => p.map(x => x.id===h.id ? {...x,lastDone:TODAY,streak:x.lastDone===new Date(Date.now()-86400000).toDateString()?x.streak+1:1} : x));
              if(h.lastDone!==TODAY) gainXP(10,"Habit done: "+h.name);
            }} style={{width:22,height:22,border:"2px solid "+(h.lastDone===TODAY?h.color:h.color+"44"),borderRadius:6,flexShrink:0,cursor:"pointer",background:h.lastDone===TODAY?h.color+"33":"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {h.lastDone===TODAY && <span style={{color:h.color,fontWeight:900}}>✓</span>}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:12,color:T.text,fontWeight:600}}>{h.name}</div>
              <div style={{fontSize:9,color:h.color,marginTop:2}}>🔥 {h.streak||0} day streak</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  // Me Tab
  const Me = () => (
    <motion.div key="me" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:0.3}} style={{padding:16}}>
      <div style={{background:T.bg2,padding:20,borderRadius:12,border:"1px solid "+T.green+"44"}}>
        <div style={{fontSize:22,fontWeight:900,color:T.green}}>{PROFILE.name}</div>
        <div style={{fontSize:12,color:T.muted,marginTop:2}}>{PROFILE.title}</div>
        <div style={{fontSize:11,color:T.dim,marginTop:4}}>{PROFILE.university}</div>
      </div>
      <div style={{marginTop:12,background:T.bg2,padding:14,borderRadius:12}}>
        <div style={{fontSize:9,color:T.muted,letterSpacing:2,marginBottom:10}}>🏆 ACHIEVEMENTS</div>
        {["🏆 Debate Champion 2023","🥇 3.95 GPA 2024","🧬 CRO+SHAP Research 2026"].map((a,i) => (
          <div key={i} style={{background:T.gold+"0d",border:"1px solid "+T.gold+"33",borderRadius:10,padding:12,marginBottom:8}}>
            <div style={{fontSize:11,color:T.bright,fontWeight:700}}>{a}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  // Progress Tab
  const Progress = () => (
    <motion.div key="progress" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:0.3}} style={{padding:16}}>
      <h2 style={{fontSize:16,fontWeight:900,color:T.bright,marginBottom:4}}>📈 PROGRESS</h2>
      <p style={{fontSize:11,color:T.muted,marginBottom:16}}>Track your comeback journey</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
        <div style={{background:T.green+"11",border:"1px solid "+T.green+"22",borderRadius:10,padding:14,textAlign:"center"}}>
          <div style={{fontSize:24,fontWeight:900,color:T.green}}>0%</div>
          <div style={{fontSize:8,color:T.muted,marginTop:2}}THESIS</div>
        </div>
        <div style={{background:T.pink+"11",border:"1px solid "+T.pink+"22",borderRadius:10,padding:14,textAlign:"center"}}>
          <div style={{fontSize:24,fontWeight:900,color:T.pink}}>{wGained}kg</div>
          <div style={{fontSize:8,color:T.muted,marginTop:2}}BODY</div>
        </div>
      </div>
      <div style={{background:T.bg2,padding:14,borderRadius:12}}>
        <div style={{fontSize:9,color:T.pink,letterSpacing:2,marginBottom:8}}>⚖️ WEIGHT PROGRESS</div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
          <div>
            <div style={{fontSize:24,fontWeight:900,color:T.pink}}>{curWeight}kg</div>
            <div style={{fontSize:10,color:T.muted}}>Current weight</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:18,fontWeight:700,color:T.green}}>+{wGained}kg</div>
            <div style={{fontSize:10,color:T.muted}}>Gained so far</div>
          </div>
        </div>
        <div style={{height:8,background:T.bg,borderRadius:4,overflow:"hidden"}}>
          <div style={{width:Math.min(100,(curWeight-50)*20)+"%",height:"100%",background:"linear-gradient(90deg,"+T.pink+","+T.green+")",borderRadius:4}} />
        </div>
      </div>
    </motion.div>
  );

  // Tasks Tab
  const Tasks = () => (
    <motion.div key="tasks" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:0.3}} style={{padding:16}}>
      <h2 style={{fontSize:16,fontWeight:900,color:T.bright,marginBottom:4}}>✅ TASKS & NOTES</h2>
      <p style={{fontSize:11,color:T.muted,marginBottom:16}}>Daily tasks + quick notes</p>
      <div style={{background:T.bg2,padding:14,borderRadius:12,marginBottom:12}}>
        <div style={{fontSize:9,color:T.green,letterSpacing:2,marginBottom:10}}>📓 DAILY LOG</div>
        <textarea placeholder="Log your thoughts, wins, blockers..." style={{width:"100%",height:100,background:T.bg1,border:"1px solid "+T.border,borderRadius:8,padding:10,color:T.text,fontSize:12,resize:"vertical",boxSizing:"border-box"}} />
        <button onClick={() => gainXP(5,"Diary entry logged")} style={{width:"100%",marginTop:8,padding:10,background:T.green+"22",border:"1px solid "+T.green+"44",color:T.green,borderRadius:7,fontSize:11,cursor:"pointer"}}>SAVE ENTRY +5 XP</button>
      </div>
      <div style={{background:T.bg2,padding:14,borderRadius:12}}>
        <div style={{fontSize:9,color:T.blue,letterSpacing:2,marginBottom:8}}>💧 WATER INTAKE</div>
        <div style={{display:"flex",gap:5,marginBottom:8}}>
          {[0,1,2,3,4,5,6,7].map(i => (
            <div key={i} onClick={() => {
              if(i===waterCount){setWaterCount(w=>w+1);if(waterCount+1===8)gainXP(15,"Hydrated! 💧");}
              else if(i<waterCount)setWaterCount(i);
            }} style={{flex:1,height:30,borderRadius:5,background:i<waterCount?T.blue+"44":"transparent",border:"1.5px solid "+(i<waterCount?T.blue:T.border),cursor:"pointer",transition:"all .2s"}} />
          ))}
        </div>
        <div style={{textAlign:"center",fontSize:11,color:T.blue}}>{waterCount}/8 glasses</div>
      </div>
    </motion.div>
  );

  // Goals Tab
  const Goals = () => (
    <motion.div key="goals" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:0.3}} style={{padding:16}}>
      <h2 style={{fontSize:16,fontWeight:900,color:T.bright,marginBottom:4}}>🎯 GOALS</h2>
      <p style={{fontSize:11,color:T.muted,marginBottom:16}}>Admissions + personal targets</p>
      <div style={{background:T.bg2,padding:14,borderRadius:12,marginBottom:12}}>
        <div style={{fontSize:9,color:T.green,letterSpacing:2,marginBottom:10}}>🎓 MSC ADMISSIONS</div>
        {[{uni:"KUET",status:"Target",color:T.green},{uni:"BUET",status:"Target",color:T.blue},{uni:"DU",status:"Dream",color:T.orange}].map((t,i) => (
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",marginBottom:8,background:t.color+"0d",border:"1px solid "+t.color+"33",borderRadius:8}}>
            <span style={{fontSize:13,color:T.bright,fontWeight:600}}>{t.uni}</span>
            <span style={{background:t.color+"22",border:"1px solid "+t.color+"33",color:t.color,fontSize:9,padding:"2px 8px",borderRadius:20}}>{t.status}</span>
          </div>
        ))}
      </div>
      <div style={{background:T.bg2,padding:14,borderRadius:12}}>
        <div style={{textAlign:"center",padding:20}}>
          <div style={{fontSize:48,marginBottom:8}}>🎯</div>
          <div style={{fontSize:18,fontWeight:900,color:T.pink}}>50kg → 60kg</div>
          <div style={{fontSize:11,color:T.muted,marginTop:4}}>Currently: {curWeight}kg • {wGained}kg gained</div>
        </div>
      </div>
    </motion.div>
  );

  // Life Tab
  const Life = () => (
    <motion.div key="life" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:0.3}} style={{padding:16}}>
      <h2 style={{fontSize:16,fontWeight:900,color:T.bright,marginBottom:4}}>⚡ LIFE</h2>
      <p style={{fontSize:11,color:T.muted,marginBottom:16}}>Quit smoking + freelancing + research</p>
      <div style={{background:T.bg2,padding:14,borderRadius:12,marginBottom:12,border:"1px solid "+T.orange+"44"}}>
        <div style={{fontSize:9,color:T.orange,letterSpacing:2,marginBottom:8}}>🚭 QUIT SMOKING</div>
        <div style={{fontSize:14,color:T.text,marginBottom:8}}>Started at ~10/day. Target: 0 by June 1.</div>
        <div style={{height:8,background:T.bg,borderRadius:4,overflow:"hidden"}}>
          <div style={{width:"50%",height:"100%",background:"linear-gradient(90deg,"+T.red+","+T.orange+")",borderRadius:4}} />
        </div>
      </div>
      <div style={{background:T.bg2,padding:14,borderRadius:12}}>
        <div style={{fontSize:9,color:T.blue,letterSpacing:2,marginBottom:8}}>💼 FREELANCING</div>
        <div style={{fontSize:14,color:T.text,marginBottom:8}}>Target: Tk 5,000/month starting Aug 2026</div>
        <div style={{fontSize:11,color:T.muted}}>Build Fiverr + Upwork profiles using your thesis as portfolio proof.</div>
      </div>
    </motion.div>
  );

  // Stats Tab
  const Stats = () => (
    <motion.div key="stats" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:0.3}} style={{padding:16}}>
      <h2 style={{fontSize:16,fontWeight:900,color:T.bright,marginBottom:4}}>🏅 STATS</h2>
      <p style={{fontSize:11,color:T.muted,marginBottom:16}}>XP + achievements + analytics</p>
      <div style={{background:"linear-gradient(135deg,#0a0800,#040814)",padding:16,borderRadius:12,border:"2px solid "+T.gold+"66",marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:9,color:T.gold,letterSpacing:3}}>COMEBACK RANK</div>
            <div style={{fontSize:26,fontWeight:900,color:T.gold}}>NEWBIE</div>
            <div style={{fontSize:11,color:T.muted}}>Level {Math.floor(xp/100)+1} • {xp} XP</div>
          </div>
          <div style={{background:T.gold+"22",border:"1px solid "+T.gold+"44",borderRadius:12,padding:12,textAlign:"center"}}>
            <div style={{fontSize:36,fontWeight:900,color:T.gold}}>{Math.floor(xp/100)+1}</div>
            <div style={{fontSize:7,color:T.gold+"88"}}LEVEL</div>
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <div style={{background:T.green+"11",border:"1px solid "+T.green+"22",borderRadius:10,padding:12,textAlign:"center"}}>
          <div style={{fontSize:20,fontWeight:900,color:T.green}}>0%</div>
          <div style={{fontSize:7,color:T.muted,marginTop:2}}THESIS</div>
        </div>
        <div style={{background:T.orange+"11",border:"1px solid "+T.orange+"22",borderRadius:10,padding:12,textAlign:"center"}}>
          <div style={{fontSize:20,fontWeight:900,color:T.orange}}>0</div>
          <div style={{fontSize:7,color:T.muted,marginTop:2}}WORKOUTS</div>
        </div>
      </div>
    </motion.div>
  );

  // Main Render
  return (
    <div style={{background:T.bg,paddingBottom:68,minHeight:"100vh",maxWidth:430,margin:"0 auto",color:T.bright,overflowX:"hidden"}}>
      <AnimatePresence mode="wait">
        {tab==="home" && <Home />}
        {tab==="plan" && <Plan />}
        {tab==="body" && <Body />}
        {tab==="focus" && <Focus />}
        {tab==="me" && <Me />}
        {tab==="progress" && <Progress />}
        {tab==="tasks" && <Tasks />}
        {tab==="goals" && <Goals />}
        {tab==="life" && <Life />}
        {tab==="stats" && <Stats />}
      </AnimatePresence>

      {/* Bottom Nav */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"rgba(2,4,8,0.97)",borderTop:"1px solid "+T.green+"22",display:"flex",zIndex:100}}>
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
          {id:"stats",icon:"🏅",label:"STATS"}
        ].map(t => (
          <div key={t.id} onClick={() => setTab(t.id)} style={{flex:1,padding:"7px 2px",textAlign:"center",cursor:"pointer",borderTop:tab===t.id?"2px solid "+T.green:"2px solid transparent",background:tab===t.id?"#00ff8808":"transparent",transition:"all .2s",minWidth:40}}>
            <div style={{fontSize:12}}>{t.icon}</div>
            <div style={{fontSize:6,color:tab===t.id?T.green:T.muted,marginTop:1,letterSpacing:.3}}>{t.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
`;

fs.writeFileSync('src/App.js', app);
console.log('Generated src/App.js with', app.length, 'characters');
