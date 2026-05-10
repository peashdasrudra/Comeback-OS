/* eslint-disable */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── THESIS: 15 weeks, May 9 → June 15, 2026 ─────────────────────────────────
const THESIS_START = new Date("2026-05-09");
const THESIS_END   = new Date("2026-06-15");
const THESIS_WEEKS = 15;

const NAV_TILES = [
  { id:"home",   icon:"🏠", label:"HOME",    color:"#00ff88", desc:"Dashboard" },
  { id:"plan",   icon:"📅", label:"PLAN",    color:"#00aaff", desc:"Thesis Plan" },
  { id:"body",   icon:"💪", label:"BODY",    color:"#ff0088", desc:"Body Gains" },
  { id:"focus",  icon:"⏱",  label:"FOCUS",   color:"#ff8800", desc:"Deep Work" },
  { id:"admissions", icon:"🎓", label:"ADMIT", color:"#a855f7", desc:"Admissions" },
  { id:"life",   icon:"⚡", label:"LIFE",    color:"#ffd700", desc:"Lifestyle" },
  { id:"me",     icon:"👤", label:"ME",      color:"#00ffcc", desc:"Profile" },
  { id:"stats",  icon:"🏅", label:"STATS",   color:"#ff4444", desc:"Statistics" },
];

const QUOTES = [
  "The fall was public. The comeback will be louder.",
  "Discipline > motivation. Every single time.",
  "3.95 GPA + Debate Champion = Unstoppable.",
  "50kg→60kg. Thesis done. MSc admitted. Watch.",
  "Every expert was once a beginner.",
  "Your only competition is who you were yesterday.",
];

// Particle component for ambient background
const Particle = ({ delay, x, y, size, color, duration }) => (
  <motion.div
    style={{
      position:"absolute", left:`${x}%`, top:`${y}%`,
      width:size, height:size, borderRadius:"50%",
      background:color, opacity:0, pointerEvents:"none",
    }}
    animate={{ opacity:[0,0.6,0], y:[0,-30,0], scale:[0,1,0] }}
    transition={{ duration, delay, repeat:Infinity, ease:"easeInOut" }}
  />
);

// Ring progress component
const ArcRing = ({ pct=0, size=80, stroke=6, color="#00ff88", label="", sublabel="" }) => {
  const r = (size - stroke*2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(pct,100)/100);
  const cx = size/2, cy = size/2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <filter id={`glow-${color.replace("#","")}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color+"22"} strokeWidth={stroke}/>
      <motion.circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration:1.5, ease:"easeOut", delay:0.3 }}
        transform={`rotate(-90 ${cx} ${cy})`}
        filter={`url(#glow-${color.replace("#","")})`}
        style={{ filter:`drop-shadow(0 0 6px ${color}88)` }}
      />
      <text x={cx} y={sublabel ? cy-4 : cy+4} textAnchor="middle" fill={color}
        fontSize={sublabel?13:12} fontFamily="Orbitron,monospace" fontWeight="900">{label}</text>
      {sublabel && <text x={cx} y={cy+11} textAnchor="middle" fill={color+"88"}
        fontSize={7} fontFamily="monospace">{sublabel}</text>}
    </svg>
  );
};

// Animated counter
const Counter = ({ to, duration=1.5, suffix="", prefix="" }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts-start)/(duration*1000), 1);
      setVal(Math.floor(p * to));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [to, duration]);
  return <span>{prefix}{val}{suffix}</span>;
};

const DashboardOverview = ({ T, C, mono, orb, raj, tab, setTab, xp, streak, waterCount, dailyScore, tasksDone, weightLog, mood, calorieLog, levelTitle, level }) => {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [time, setTime] = useState(new Date());
  const [hoveredNav, setHoveredNav] = useState(null);
  const [particles] = useState(() =>
    Array.from({length:18},(_,i)=>({
      id:i, x:Math.random()*100, y:Math.random()*100,
      size:2+Math.random()*4, delay:Math.random()*5,
      duration:4+Math.random()*4,
      color:["#00ff8844","#00aaff44","#ff008844","#ffd70044"][i%4]
    }))
  );

  // Live clock
  useEffect(()=>{
    const t = setInterval(()=>setTime(new Date()),1000);
    return ()=>clearInterval(t);
  },[]);

  // Auto-rotate quotes
  useEffect(()=>{
    const t = setInterval(()=>setQuoteIdx(q=>(q+1)%QUOTES.length),8000);
    return ()=>clearInterval(t);
  },[]);

  // Thesis progress
  const now = new Date();
  const totalMs = THESIS_END - THESIS_START;
  const elapsedMs = Math.max(0, now - THESIS_START);
  const thesisPct = Math.min(100, Math.round((elapsedMs/totalMs)*100));
  const daysLeft = Math.max(0, Math.ceil((THESIS_END - now)/86400000));
  const currentWeek = Math.min(THESIS_WEEKS, Math.max(1, Math.ceil(elapsedMs/604800000)));

  // XP
  const xpForNext = 500;
  const xpPct = Math.min(100, Math.round(((xp||0) % xpForNext) / xpForNext * 100));

  // Score color
  const sc = (dailyScore||0) >= 80 ? T.green : (dailyScore||0) >= 50 ? T.orange : T.red;

  // Weight
  const curWeight = weightLog && weightLog.length ? weightLog[weightLog.length-1].weight : 50;
  const weightPct = Math.min(100, Math.round(((curWeight-50)/10)*100));

  const taskCount = tasksDone ? Object.values(tasksDone).filter(Boolean).length : 0;

  const timeStr = time.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"});
  const dateStr = time.toLocaleDateString([],{weekday:"short",month:"short",day:"numeric"});

  const totalCals = calorieLog ? calorieLog.reduce((acc, c) => acc + c.cals, 0) : 0;

  return (
    <div style={{ padding:"0 0 16px", maxWidth:430, margin:"0 auto" }}>

      {/* ── AMBIENT PARTICLES ── */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
        {particles.map(p=><Particle key={p.id} {...p}/>)}
        {/* Subtle grid */}
        <div style={{
          position:"absolute", inset:0,
          backgroundImage:`linear-gradient(rgba(0,255,136,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,0.03) 1px,transparent 1px)`,
          backgroundSize:"40px 40px"
        }}/>
      </div>

      {/* ── HERO HEADER ── */}
      <motion.div
        initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:.6,type:"spring",stiffness:200}}
        style={{
          position:"relative", overflow:"hidden",
          background:"linear-gradient(160deg,#020d06 0%,#020408 35%,#030814 60%,#040610 100%)",
          borderBottom:`1px solid #00ff8818`,
          padding:"22px 16px 18px",
        }}
      >
        {/* Animated glow orbs */}
        <motion.div animate={{scale:[1,1.2,1],opacity:[0.4,0.7,0.4]}} transition={{duration:6,repeat:Infinity,ease:"easeInOut"}}
          style={{position:"absolute",top:-80,right:-60,width:240,height:240,background:"radial-gradient(circle,#00ff8814,transparent 65%)",pointerEvents:"none"}}/>
        <motion.div animate={{scale:[1,1.15,1],opacity:[0.3,0.5,0.3]}} transition={{duration:8,repeat:Infinity,ease:"easeInOut",delay:2}}
          style={{position:"absolute",bottom:-50,left:-40,width:180,height:180,background:"radial-gradient(circle,#00aaff0c,transparent 65%)",pointerEvents:"none"}}/>
        <motion.div animate={{scale:[1,1.3,1],opacity:[0.2,0.4,0.2]}} transition={{duration:7,repeat:Infinity,ease:"easeInOut",delay:4}}
          style={{position:"absolute",top:"40%",left:"50%",width:120,height:120,background:"radial-gradient(circle,#ffd70008,transparent 65%)",pointerEvents:"none"}}/>

        <div style={{ position:"relative", zIndex:1 }}>
          {/* Top row: name + clock */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
            <div>
              <motion.div
                initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:.2}}
                style={{ fontSize:7, color:T.green, letterSpacing:4, ...mono, marginBottom:4 }}
              >⚡ COMEBACK-OS · LIVE</motion.div>
              <motion.div
                initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.3}}
                style={{ ...orb, fontSize:22, fontWeight:900, color:T.bright, lineHeight:1.1 }}
              >PEASH RUDRA</motion.div>
              <div style={{ fontSize:9, color:T.muted, ...raj, marginTop:3 }}>
                MSc CSE Candidate · Debate Champion · KUET
              </div>
            </div>
            <motion.div
              initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} transition={{delay:.4}}
              style={{ textAlign:"right" }}
            >
              <div style={{ ...orb, fontSize:20, fontWeight:900, color:T.green, fontVariantNumeric:"tabular-nums",
                textShadow:`0 0 20px ${T.green}88` }}>
                {timeStr}
              </div>
              <div style={{ fontSize:9, color:T.muted, ...mono, marginTop:2 }}>{dateStr}</div>
            </motion.div>
          </div>

          {/* Level + XP bar */}
          <motion.div
            initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.5}}
            style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}
          >
            <div style={{
              padding:"4px 10px", borderRadius:20, background:`${T.gold}18`,
              border:`1px solid ${T.gold}44`, display:"flex", alignItems:"center", gap:6, flexShrink:0
            }}>
              <span style={{ fontSize:12 }}>👑</span>
              <span style={{ ...orb, fontSize:11, fontWeight:900, color:T.gold }}>LV {level||1}</span>
              <span style={{ fontSize:9, color:T.gold+"88", ...raj }}>{levelTitle||"Rising Star"}</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                <span style={{ fontSize:7, color:T.muted, ...mono }}>XP PROGRESS</span>
                <span style={{ fontSize:7, color:T.gold, ...mono }}>{xp||0}/{xpForNext}</span>
              </div>
              <div style={{ height:5, background:`${T.gold}18`, borderRadius:4, overflow:"hidden", position:"relative" }}>
                <motion.div
                  initial={{width:0}} animate={{width:`${xpPct}%`}} transition={{duration:1.2,delay:.6}}
                  style={{
                    height:"100%", borderRadius:4,
                    background:`linear-gradient(90deg,${T.gold},${T.orange})`,
                    boxShadow:`0 0 8px ${T.gold}66`
                  }}
                />
                {/* Shimmer */}
                <motion.div
                  animate={{x:["-100%","200%"]}} transition={{duration:2,repeat:Infinity,delay:1.5}}
                  style={{
                    position:"absolute", inset:0, width:"30%",
                    background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)",
                    borderRadius:4
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Thesis deadline banner */}
          <motion.div
            initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:.6}}
            style={{
              background:`linear-gradient(135deg,${daysLeft<=7?"#1a0000":"#001a00"},${T.bg2})`,
              border:`1px solid ${daysLeft<=7?T.red+"55":T.green+"44"}`,
              borderRadius:10, padding:"10px 14px",
              display:"flex", alignItems:"center", gap:12
            }}
          >
            <div style={{ position:"relative", flexShrink:0 }}>
              <ArcRing pct={thesisPct} size={60} stroke={5}
                color={daysLeft<=7?T.red:daysLeft<=14?T.orange:T.green}
                label={`${thesisPct}%`} sublabel="done"/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:8, color:daysLeft<=7?T.red:T.green, ...mono, letterSpacing:2, marginBottom:2 }}>
                🧪 THESIS DEADLINE
              </div>
              <div style={{ ...orb, fontSize:15, fontWeight:900, color:T.bright }}>
                {daysLeft <= 0 ? "DUE TODAY!" : `${daysLeft} DAYS LEFT`}
              </div>
              <div style={{ fontSize:9, color:T.muted, ...raj, marginTop:2 }}>
                Week {currentWeek}/{THESIS_WEEKS} · Jun 15, 2026
              </div>
              <div style={{ marginTop:6, height:4, background:`${T.border}`, borderRadius:3, overflow:"hidden" }}>
                <motion.div
                  initial={{width:0}} animate={{width:`${thesisPct}%`}} transition={{duration:1.5,delay:.8}}
                  style={{
                    height:"100%", borderRadius:3,
                    background:daysLeft<=7?`linear-gradient(90deg,${T.red},${T.orange})`:`linear-gradient(90deg,${T.green},${T.cyan})`,
                    boxShadow:`0 0 6px ${T.green}66`
                  }}
                />
              </div>
            </div>
            {daysLeft > 0 && daysLeft <= 7 && (
              <motion.div animate={{scale:[1,1.15,1]}} transition={{duration:1,repeat:Infinity}}
                style={{ fontSize:20 }}>🔥</motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* ── LIVE STATS STRIP ── */}
      <motion.div
        initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.7}}
        style={{ display:"flex", gap:6, overflowX:"auto", padding:"10px 12px", background:"rgba(2,8,4,0.6)", borderBottom:`1px solid #00ff8810` }}
      >
        {[
          { label:"STREAK", value:`${streak||0}d`, icon:"🔥", color:T.orange },
          { label:"SCORE",  value:`${dailyScore||0}`, icon:"⚡", color:sc },
          { label:"WATER",  value:`${waterCount||0}/8`, icon:"💧", color:T.blue },
          { label:"FOOD",   value:`${totalCals}`, icon:"🍽️", color:T.orange },
          { label:"TASKS",  value:`${taskCount}`, icon:"✅", color:T.green },
          { label:"WEIGHT", value:`${curWeight}kg`, icon:"💪", color:T.pink },
          { label:"MOOD",   value:mood||"😤", icon:"", color:T.gold },
        ].map((s,i)=>(
          <motion.div
            key={s.label}
            initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} transition={{delay:.7+i*.06,type:"spring",stiffness:300}}
            whileHover={{scale:1.05,y:-2}}
            style={{
              flex:1, minWidth:52, padding:"8px 6px", textAlign:"center",
              background:`${s.color}08`, border:`1px solid ${s.color}18`,
              borderRadius:10, cursor:"default",
            }}
          >
            <div style={{ fontSize:13, marginBottom:3 }}>{s.icon||s.value}</div>
            <div style={{ ...orb, fontSize:s.icon?13:11, fontWeight:900, color:s.color, lineHeight:1, textShadow:`0 0 8px ${s.color}44` }}>
              {s.icon?s.value:""}
            </div>
            <div style={{ fontSize:6, color:T.dim, ...mono, marginTop:3, letterSpacing:1 }}>{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <div style={{ padding:"14px 16px 0" }}>

        {/* ── QUOTE CARD ── */}
        <motion.div
          initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:.8}}
          style={{
            ...C({padding:"14px 16px", marginBottom:14}),
            background:"linear-gradient(135deg,#020d06,#020408)",
            border:`1px solid ${T.green}33`, position:"relative", overflow:"hidden"
          }}
        >
          <div style={{
            position:"absolute", top:0, left:0, right:0, height:2,
            background:`linear-gradient(90deg,transparent,${T.green},transparent)`
          }}/>
          <div style={{ fontSize:7, color:T.green, ...mono, letterSpacing:3, marginBottom:8 }}>⚡ DAILY FUEL</div>
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIdx}
              initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}
              transition={{duration:.4}}
              style={{ fontSize:13, color:T.bright, ...raj, lineHeight:1.8, fontStyle:"italic",
                textShadow:`0 0 20px ${T.green}22` }}
            >
              "{QUOTES[quoteIdx]}"
            </motion.div>
          </AnimatePresence>
          <div style={{ display:"flex", gap:4, marginTop:10, alignItems:"center" }}>
            {QUOTES.map((_,i)=>(
              <div key={i} onClick={()=>setQuoteIdx(i)}
                style={{ width:i===quoteIdx?16:4, height:4, borderRadius:2,
                  background:i===quoteIdx?T.green:T.dim, cursor:"pointer", transition:"all .3s" }}/>
            ))}
          </div>
        </motion.div>

        {/* ── NAVIGATE GRID ── */}
        <motion.div
          initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.9}}
          style={{ marginBottom:14 }}
        >
          <div style={{ fontSize:7, color:T.muted, ...mono, letterSpacing:3, marginBottom:10 }}>NAVIGATE</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
            {NAV_TILES.map((tile,i)=>(
              <motion.div
                key={tile.id}
                initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}}
                transition={{delay:.9+i*.04,type:"spring",stiffness:300}}
                whileTap={{scale:.93}}
                onHoverStart={()=>setHoveredNav(tile.id)}
                onHoverEnd={()=>setHoveredNav(null)}
                onClick={()=>setTab(tile.id)}
                style={{
                  position:"relative", cursor:"pointer",
                  background:hoveredNav===tile.id?`${tile.color}18`:tab===tile.id?`${tile.color}14`:`${T.bg2}`,
                  border:`1px solid ${tab===tile.id?tile.color:hoveredNav===tile.id?tile.color+"66":T.border}`,
                  borderRadius:12, padding:"12px 8px",
                  textAlign:"center", transition:"all .2s",
                  boxShadow:tab===tile.id?`0 0 16px ${tile.color}33`:`inset 0 1px 0 rgba(255,255,255,0.04)`,
                  overflow:"hidden"
                }}
              >
                {/* Active indicator */}
                {tab===tile.id && (
                  <motion.div layoutId="navActive"
                    style={{
                      position:"absolute", inset:0, borderRadius:12,
                      background:`${tile.color}08`, border:`1px solid ${tile.color}44`
                    }}
                  />
                )}
                {/* Top corner glow */}
                <div style={{
                  position:"absolute", top:0, right:0, width:40, height:40,
                  background:`radial-gradient(circle at 100% 0%,${tile.color}18,transparent)`,
                  borderRadius:12
                }}/>
                <div style={{ fontSize:22, marginBottom:5, filter:tab===tile.id||hoveredNav===tile.id?`drop-shadow(0 0 8px ${tile.color})`:"none", transition:"filter .2s" }}>
                  {tile.icon}
                </div>
                <div style={{ fontSize:7, color:tab===tile.id?tile.color:T.muted, ...orb, fontWeight:700, letterSpacing:1 }}>
                  {tile.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── FOUR METRICS RINGS ── */}
        <motion.div
          initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:1,type:"spring"}}
          style={{ ...C({padding:"18px"}), marginBottom:14, background:"linear-gradient(135deg,rgba(10,15,20,0.8),rgba(6,13,18,0.9))", border:`1px solid ${T.green}12`, position:"relative", overflow:"hidden" }}
        >
          <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${T.green}33,${T.blue}33,transparent)`}}/>
          <div style={{ fontSize:7, color:T.muted, ...mono, letterSpacing:3, marginBottom:14 }}>⚡ CORE METRICS</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6 }}>
            {[
              { label:"Thesis", pct:thesisPct, color:thesisPct<70?T.red:T.green, emoji:"🧪" },
              { label:"Weight", pct:weightPct, color:T.pink, emoji:"💪" },
              { label:"Daily",  pct:dailyScore||0, color:sc, emoji:"⚡" },
              { label:"XP",     pct:xpPct, color:T.gold, emoji:"👑" },
            ].map((m,i)=>(
              <motion.div
                key={m.label}
                initial={{opacity:0,scale:.7}} animate={{opacity:1,scale:1}} transition={{delay:1+i*.1,type:"spring",stiffness:250}}
                whileHover={{scale:1.05}}
                style={{ textAlign:"center", padding:"6px 0", borderRadius:12, background:`${m.color}06`, cursor:"default" }}
              >
                <ArcRing pct={m.pct} size={72} stroke={6} color={m.color} label={`${m.pct}%`}/>
                <div style={{ fontSize:8, color:m.color, ...mono, marginTop:4, letterSpacing:1, fontWeight:600 }}>{m.emoji} {m.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── MISSION CARD ── */}
        <motion.div
          initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:1.1}}
          style={{
            ...C({padding:"14px"}), marginBottom:14,
            background:"linear-gradient(135deg,#040814,#020408)",
            border:`1px solid ${T.blue}33`, position:"relative", overflow:"hidden"
          }}
        >
          <div style={{
            position:"absolute", bottom:-30, right:-30, width:120, height:120,
            background:`radial-gradient(circle,${T.blue}12,transparent)`, pointerEvents:"none"
          }}/>
          <div style={{ fontSize:7, color:T.blue, ...mono, letterSpacing:3, marginBottom:8 }}>🧪 MISSION</div>
          <div style={{ fontSize:11, color:T.text, ...raj, lineHeight:1.9 }}>
            <span style={{ color:T.bright, fontWeight:700 }}>CRO vs SHAP</span>: Interpretable ML for{" "}
            <span style={{ color:T.cyan }}>Multi-omics Cancer</span> Subtype Prediction
          </div>
          <div style={{ marginTop:8, display:"flex", gap:6, flexWrap:"wrap" }}>
            {["TCGA-BRCA","METABRIC","CRO","SHAP","Multi-omics"].map(tag=>(
              <span key={tag} style={{
                fontSize:7, color:T.blue, background:`${T.blue}12`,
                border:`1px solid ${T.blue}33`, borderRadius:10, padding:"2px 7px", ...mono
              }}>{tag}</span>
            ))}
          </div>
          <div style={{ marginTop:10, display:"flex", gap:8, alignItems:"center" }}>
            <div style={{ width:28, height:28, borderRadius:8, background:`${T.blue}18`,
              border:`1px solid ${T.blue}33`, display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:14 }}>👨‍🏫</div>
            <div>
              <div style={{ fontSize:9, color:T.muted, ...mono }}>SUPERVISOR</div>
              <div style={{ fontSize:11, color:T.bright, ...raj, fontWeight:600 }}>Md. Riaz Mahmud</div>
            </div>
          </div>
        </motion.div>

        {/* ── QUICK ACTIONS ── */}
        <motion.div
          initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:1.2}}
        >
          <div style={{ fontSize:7, color:T.muted, ...mono, letterSpacing:3, marginBottom:10 }}>⚡ QUICK ACTIONS</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
            {[
              { label:"Start Focus", icon:"⏱", color:T.orange, tab:"focus" },
              { label:"Thesis Plan", icon:"📋", color:T.blue,   tab:"plan" },
              { label:"Log Workout", icon:"💪", color:T.pink,   tab:"body" },
              { label:"Admissions",  icon:"🎓", color:"#a855f7", tab:"admissions" },
              { label:"Tasks",       icon:"✅", color:T.green,   tab:"tasks" },
              { label:"Goals",       icon:"🎯", color:T.cyan,    tab:"goals" },
            ].map((a,i)=>(
              <motion.button
                key={a.label}
                whileTap={{scale:.92}}
                whileHover={{scale:1.04,y:-2}}
                onClick={()=>setTab(a.tab)}
                initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:1.2+i*.06,type:"spring",stiffness:300}}
                style={{
                  padding:"12px 6px", borderRadius:12, cursor:"pointer",
                  background:`linear-gradient(135deg,${a.color}10,${a.color}06)`, border:`1px solid ${a.color}28`,
                  display:"flex", flexDirection:"column", alignItems:"center", gap:5,
                  boxShadow:`0 2px 12px ${a.color}08`,
                }}
              >
                <span style={{ fontSize:20, filter:`drop-shadow(0 0 4px ${a.color}44)` }}>{a.icon}</span>
                <span style={{ fontSize:8, color:a.color, ...raj, fontWeight:700, textAlign:"center", lineHeight:1.2, letterSpacing:.3 }}>
                  {a.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default DashboardOverview;
