/* eslint-disable */
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const WORK_DURATIONS  = [25, 45, 60, 90];
const BREAK_DURATIONS = [5, 10, 15];

const DEEP_MODES = [
  { id:"thesis",   label:"Thesis",   icon:"🧪", color:"#00ff88", desc:"CRO/SHAP Research", target:"2h focus" },
  { id:"coding",   label:"Coding",   icon:"💻", color:"#00aaff", desc:"ML Implementation",  target:"Code 1h+" },
  { id:"ielts",    label:"IELTS",    icon:"🌍", color:"#ffd700", desc:"Language Prep",       target:"15min daily" },
  { id:"reading",  label:"Reading",  icon:"📖", color:"#a855f7", desc:"Paper Analysis",      target:"1 paper/day" },
  { id:"revision", label:"Revision", icon:"📝", color:"#ff8800", desc:"Review & Recall",     target:"Spaced reps" },
];

const AMBIENT_SOUNDS = [
  { id:"silence",  icon:"🔇", label:"Silence" },
  { id:"rain",     icon:"🌧️", label:"Rain" },
  { id:"lofi",     icon:"🎵", label:"Lo-Fi" },
  { id:"forest",   icon:"🌿", label:"Forest" },
  { id:"waves",    icon:"🌊", label:"Waves" },
];

const SESSION_HISTORY_KEY = "comeback_focus_sessions";

// ─── RING TIMER ───────────────────────────────────────────────────────────────
const TimerRing = ({ pct=100, size=200, stroke=10, color="#00ff88", label, sublabel }) => {
  const r = (size - stroke*2)/2;
  const circ = 2*Math.PI*r;
  const offset = circ*(1-pct/100);
  const cx=size/2, cy=size/2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <filter id="timerGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color}/>
          <stop offset="100%" stopColor={color+"aa"}/>
        </linearGradient>
      </defs>
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color+"15"} strokeWidth={stroke}/>
      {/* Tick marks */}
      {Array.from({length:60},(_,i)=>{
        const angle = (i*6-90)*Math.PI/180;
        const isMajor = i%5===0;
        const inner = r-(isMajor?12:6);
        const outer = r-2;
        const x1=cx+Math.cos(angle)*inner, y1=cy+Math.sin(angle)*inner;
        const x2=cx+Math.cos(angle)*outer, y2=cy+Math.sin(angle)*outer;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color+"33"} strokeWidth={isMajor?2:1}/>;
      })}
      {/* Progress arc */}
      <motion.circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke="url(#timerGrad)" strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
        filter="url(#timerGlow)"
        style={{filter:`drop-shadow(0 0 8px ${color}88)`}}
      />
      {/* Center label */}
      <text x={cx} y={cy-10} textAnchor="middle" fill={color}
        fontSize="36" fontFamily="Orbitron,monospace" fontWeight="900">{label}</text>
      <text x={cx} y={cy+14} textAnchor="middle" fill={color+"88"}
        fontSize="11" fontFamily="monospace" letterSpacing="3">{sublabel}</text>
    </svg>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const FocusTab = ({ T, C, mono, orb, raj, gainXP, streak }) => {
  const [mode,        setMode]        = useState("thesis");
  const [workMins,    setWorkMins]    = useState(25);
  const [breakMins,   setBreakMins]   = useState(5);
  const [running,     setRunning]     = useState(false);
  const [isBreak,     setIsBreak]     = useState(false);
  const [secsLeft,    setSecsLeft]    = useState(25*60);
  const [sessions,    setSessions]    = useState(0);
  const [totalFocus,  setTotalFocus]  = useState(0); // seconds today
  const [history,     setHistory]     = useState([]);
  const [ambient,     setAmbient]     = useState("silence");
  const [battleMode,  setBattleMode]  = useState(false);
  const [taskInput,   setTaskInput]   = useState("");
  const [currentTask, setCurrentTask] = useState("");
  const [log,         setLog]         = useState([]);
  const [pulse,       setPulse]       = useState(false);
  const intervalRef = useRef(null);

  const activeMode = DEEP_MODES.find(m=>m.id===mode)||DEEP_MODES[0];
  const totalSecs  = (isBreak ? breakMins : workMins)*60;
  const pct        = Math.max(0, (secsLeft/totalSecs)*100);
  const mins       = Math.floor(secsLeft/60).toString().padStart(2,"0");
  const secs       = (secsLeft%60).toString().padStart(2,"0");

  // Timer tick
  useEffect(()=>{
    if(running){
      intervalRef.current = setInterval(()=>{
        setSecsLeft(s=>{
          if(s<=1){
            // Session ended
            if(!isBreak){
              setSessions(n=>n+1);
              setTotalFocus(f=>f+workMins*60);
              gainXP && gainXP(workMins>=45?25:15, `Focus session: ${workMins}min 🎯`);
              setLog(l=>[{time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
                label:`${workMins}min ${activeMode.label}`,mode,mins:workMins},...l.slice(0,9)]);
              setPulse(true); setTimeout(()=>setPulse(false),600);
              setIsBreak(true);
              return breakMins*60;
            } else {
              setIsBreak(false);
              return workMins*60;
            }
          }
          return s-1;
        });
      },1000);
    }
    return ()=>clearInterval(intervalRef.current);
  },[running,isBreak,workMins,breakMins,mode]);

  const start  = ()=>{ setRunning(true); if(taskInput.trim()){setCurrentTask(taskInput);setTaskInput("");} };
  const pause  = ()=>setRunning(false);
  const reset  = ()=>{ setRunning(false); setIsBreak(false); setSecsLeft(workMins*60); };

  const focusHours = (totalFocus/3600).toFixed(1);

  return (
    <div style={{ padding:"0 0 80px", maxWidth:430, margin:"0 auto" }}>

      {/* ── BATTLE MODE OVERLAY ── */}
      <AnimatePresence>
        {battleMode && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{
              position:"fixed", inset:0, zIndex:500,
              background:"rgba(2,4,8,0.98)", display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center"
            }}
          >
            <div style={{
              position:"absolute", inset:0, pointerEvents:"none",
              backgroundImage:`linear-gradient(${activeMode.color}06 1px,transparent 1px),linear-gradient(90deg,${activeMode.color}06 1px,transparent 1px)`,
              backgroundSize:"30px 30px"
            }}/>
            {/* Glow pulse */}
            <motion.div animate={{scale:[1,1.5,1],opacity:[0.4,0,0.4]}} transition={{duration:2,repeat:Infinity}}
              style={{
                position:"absolute", width:300, height:300, borderRadius:"50%",
                background:`radial-gradient(circle,${activeMode.color}15,transparent)`,
                pointerEvents:"none"
              }}/>
            <TimerRing pct={pct} size={240} stroke={12} color={activeMode.color} label={`${mins}:${secs}`}
              sublabel={isBreak?"BREAK":"FOCUS"}/>
            {currentTask && (
              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.3}}
                style={{ marginTop:16, fontSize:13, color:T.bright, ...raj, textAlign:"center",
                  padding:"8px 16px", background:`${activeMode.color}15`,
                  border:`1px solid ${activeMode.color}33`, borderRadius:10 }}>
                🎯 {currentTask}
              </motion.div>
            )}
            <div style={{ display:"flex", gap:12, marginTop:24 }}>
              <motion.button whileTap={{scale:.95}} onClick={running?pause:start}
                style={{ padding:"12px 32px", borderRadius:10, border:"none",
                  background:running?T.bg2:`${activeMode.color}`,
                  color:running?activeMode.color:T.bg, fontSize:13, ...orb, fontWeight:700, cursor:"pointer",
                  boxShadow:running?"none":`0 0 20px ${activeMode.color}66` }}>
                {running?"⏸ PAUSE":"▶ START"}
              </motion.button>
              <motion.button whileTap={{scale:.95}} onClick={()=>setBattleMode(false)}
                style={{ padding:"12px 24px", borderRadius:10, border:`1px solid ${T.border}`,
                  background:T.bg2, color:T.muted, fontSize:12, ...mono, cursor:"pointer" }}>
                EXIT
              </motion.button>
            </div>
            <div style={{ marginTop:20, display:"flex", gap:20 }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ ...orb, fontSize:20, fontWeight:900, color:activeMode.color }}>{sessions}</div>
                <div style={{ fontSize:8, color:T.muted, ...mono }}>SESSIONS</div>
              </div>
              <div style={{ textAlign:"center" }}>
                <div style={{ ...orb, fontSize:20, fontWeight:900, color:T.gold }}>{focusHours}h</div>
                <div style={{ fontSize:8, color:T.muted, ...mono }}>TODAY</div>
              </div>
              <div style={{ textAlign:"center" }}>
                <div style={{ ...orb, fontSize:20, fontWeight:900, color:T.orange }}>{streak||0}🔥</div>
                <div style={{ fontSize:8, color:T.muted, ...mono }}>STREAK</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HEADER ── */}
      <div style={{
        padding:"16px 16px 12px",
        background:"linear-gradient(135deg,#030a05,#020408)",
        borderBottom:`1px solid ${T.border}`
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div>
            <div style={{ fontSize:7, color:activeMode.color, ...mono, letterSpacing:3, marginBottom:3 }}>⏱ DEEP WORK ENGINE</div>
            <div style={{ ...orb, fontSize:18, fontWeight:900, color:T.bright }}>FOCUS MODE</div>
          </div>
          <motion.button whileTap={{scale:.95}} onClick={()=>setBattleMode(true)}
            style={{
              padding:"8px 14px", borderRadius:20, border:`1px solid ${T.orange}55`,
              background:`${T.orange}15`, color:T.orange, fontSize:9, ...orb,
              fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5,
              boxShadow:`0 0 12px ${T.orange}22`
            }}>
            ⚔️ BATTLE MODE
          </motion.button>
        </div>
        {/* Today stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6 }}>
          {[
            { v:sessions,      l:"Sessions",    c:activeMode.color, icon:"🎯" },
            { v:`${focusHours}h`, l:"Focus Time", c:T.gold,          icon:"⏱" },
            { v:`${streak||0}d`,  l:"Streak",     c:T.orange,        icon:"🔥" },
          ].map((s,i)=>(
            <motion.div key={i} initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} transition={{delay:.1+i*.07}}
              style={{ textAlign:"center", padding:"8px 4px", borderRadius:8,
                background:`${s.c}10`, border:`1px solid ${s.c}22` }}>
              <div style={{ fontSize:13 }}>{s.icon}</div>
              <div style={{ ...orb, fontSize:15, fontWeight:900, color:s.c, lineHeight:1.1 }}>{s.v}</div>
              <div style={{ fontSize:6, color:T.muted, ...mono, marginTop:1 }}>{s.l}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ padding:"14px 16px 0" }}>

        {/* ── TIMER DISPLAY ── */}
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:.2}}
          style={{ ...C({padding:"20px 16px"}), marginBottom:14, textAlign:"center",
            background:`linear-gradient(135deg,${activeMode.color}08,transparent)`,
            border:`1px solid ${activeMode.color}33`,
            position:"relative", overflow:"hidden" }}
        >
          {/* Corner glow */}
          <div style={{ position:"absolute", top:-40, right:-40, width:120, height:120,
            background:`radial-gradient(circle,${activeMode.color}15,transparent)`, pointerEvents:"none" }}/>
          <div style={{ position:"absolute", bottom:-30, left:-30, width:100, height:100,
            background:`radial-gradient(circle,${activeMode.color}08,transparent)`, pointerEvents:"none" }}/>

          {/* Session indicator */}
          <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:12 }}>
            <span style={{ padding:"3px 10px", borderRadius:20, fontSize:8, ...mono,
              background:!isBreak?`${activeMode.color}22`:"transparent",
              border:`1px solid ${!isBreak?activeMode.color:T.border}`,
              color:!isBreak?activeMode.color:T.muted }}>WORK</span>
            <span style={{ padding:"3px 10px", borderRadius:20, fontSize:8, ...mono,
              background:isBreak?`${T.blue}22`:"transparent",
              border:`1px solid ${isBreak?T.blue:T.border}`,
              color:isBreak?T.blue:T.muted }}>BREAK</span>
          </div>

          {/* Big timer */}
          <motion.div
            animate={pulse?{scale:[1,1.08,1]}:{}}
            style={{
              ...orb, fontSize:64, fontWeight:900, lineHeight:1.1,
              color:isBreak?T.blue:activeMode.color,
              textShadow:`0 0 30px ${isBreak?T.blue:activeMode.color}66`,
              fontVariantNumeric:"tabular-nums", letterSpacing:2
            }}>{mins}:{secs}</motion.div>
          <div style={{ fontSize:9, color:T.muted, ...mono, letterSpacing:3, marginTop:4 }}>
            {isBreak?"BREAK TIME":"DEEP FOCUS"}
          </div>

          {/* Progress bar */}
          <div style={{ margin:"14px 0 4px", height:4, background:T.bg2, borderRadius:3, overflow:"hidden" }}>
            <motion.div
              animate={{width:`${pct}%`}} transition={{duration:.5}}
              style={{ height:"100%", borderRadius:3,
                background:`linear-gradient(90deg,${isBreak?T.blue:activeMode.color},${isBreak?T.blue:activeMode.color}88)`,
                boxShadow:`0 0 8px ${isBreak?T.blue:activeMode.color}66` }}/>
          </div>
          <div style={{ fontSize:8, color:T.muted, ...mono, textAlign:"right" }}>
            {Math.round(pct)}% remaining
          </div>

          {/* Current task */}
          {currentTask ? (
            <div style={{ marginTop:10, padding:"7px 12px",
              background:`${activeMode.color}12`, border:`1px solid ${activeMode.color}33`,
              borderRadius:8, fontSize:10, color:T.bright, ...raj }}>
              🎯 {currentTask}
              <button onClick={()=>setCurrentTask("")}
                style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",marginLeft:6,fontSize:10 }}>×</button>
            </div>
          ) : (
            <div style={{ marginTop:10, display:"flex", gap:6 }}>
              <input value={taskInput} onChange={e=>setTaskInput(e.target.value)}
                placeholder="What are you working on?" onKeyDown={e=>e.key==="Enter"&&taskInput&&setCurrentTask(taskInput)||setTaskInput("")}
                style={{ flex:1, background:T.bg2, border:`1px solid ${T.border}`, borderRadius:8,
                  padding:"7px 10px", color:T.bright, fontSize:10, ...mono, outline:"none" }}/>
              <button onClick={()=>taskInput&&(setCurrentTask(taskInput),setTaskInput(""))}
                style={{ padding:"7px 14px", borderRadius:8, background:`${activeMode.color}22`,
                  border:`1px solid ${activeMode.color}44`, color:activeMode.color, fontSize:10, cursor:"pointer",...mono }}>
                SET
              </button>
            </div>
          )}

          {/* Controls */}
          <div style={{ display:"flex", gap:8, marginTop:12, justifyContent:"center" }}>
            <motion.button whileTap={{scale:.95}} onClick={running?pause:start}
              style={{ flex:1, maxWidth:120, padding:"12px 0", borderRadius:10,
                border:"none",
                background:running?`${T.border}`:`linear-gradient(135deg,${activeMode.color},${activeMode.color}aa)`,
                color:running?T.muted:"#020408", fontSize:12, ...orb, fontWeight:900, cursor:"pointer",
                boxShadow:running?"none":`0 4px 20px ${activeMode.color}44` }}>
              {running?"⏸ PAUSE":"▶ START"}
            </motion.button>
            <motion.button whileTap={{scale:.95}} onClick={reset}
              style={{ padding:"12px 16px", borderRadius:10, border:`1px solid ${T.border}`,
                background:T.bg2, color:T.muted, fontSize:11, ...mono, cursor:"pointer" }}>
              ↺
            </motion.button>
          </div>
        </motion.div>

        {/* ── MODE SELECTOR ── */}
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.3}}
          style={{ ...C({padding:"14px"}), marginBottom:14 }}
        >
          <div style={{ fontSize:7, color:T.muted, ...mono, letterSpacing:3, marginBottom:10 }}>FOCUS MODE</div>
          <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:4 }}>
            {DEEP_MODES.map(m=>(
              <motion.button key={m.id} whileTap={{scale:.95}} onClick={()=>{setMode(m.id);reset();}}
                style={{ flex:"0 0 auto", padding:"10px 12px", borderRadius:10,
                  background:mode===m.id?`${m.color}18`:`${T.bg2}`,
                  border:`1px solid ${mode===m.id?m.color:T.border}`,
                  cursor:"pointer", textAlign:"center", transition:"all .2s",
                  boxShadow:mode===m.id?`0 0 12px ${m.color}33`:"none" }}>
                <div style={{ fontSize:16, marginBottom:4 }}>{m.icon}</div>
                <div style={{ fontSize:8, color:mode===m.id?m.color:T.muted, ...mono, fontWeight:700 }}>{m.label}</div>
                <div style={{ fontSize:7, color:T.dim, marginTop:2 }}>{m.target}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── DURATION PICKER ── */}
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.4}}
          style={{ ...C({padding:"14px"}), marginBottom:14 }}
        >
          <div style={{ fontSize:7, color:T.muted, ...mono, letterSpacing:3, marginBottom:10 }}>DURATION</div>
          <div style={{ marginBottom:10 }}>
            <div style={{ fontSize:8, color:activeMode.color, ...mono, marginBottom:6 }}>WORK</div>
            <div style={{ display:"flex", gap:6 }}>
              {WORK_DURATIONS.map(d=>(
                <motion.button key={d} whileTap={{scale:.95}}
                  onClick={()=>{setWorkMins(d);if(!running)setSecsLeft(d*60);}}
                  style={{ flex:1, padding:"8px 0", borderRadius:8,
                    background:workMins===d?`${activeMode.color}22`:T.bg2,
                    border:`1px solid ${workMins===d?activeMode.color:T.border}`,
                    color:workMins===d?activeMode.color:T.muted, fontSize:10, ...orb,
                    cursor:"pointer", fontWeight:workMins===d?900:400, transition:"all .2s" }}>
                  {d}m
                </motion.button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize:8, color:T.blue, ...mono, marginBottom:6 }}>BREAK</div>
            <div style={{ display:"flex", gap:6 }}>
              {BREAK_DURATIONS.map(d=>(
                <motion.button key={d} whileTap={{scale:.95}} onClick={()=>setBreakMins(d)}
                  style={{ flex:1, padding:"8px 0", borderRadius:8,
                    background:breakMins===d?`${T.blue}22`:T.bg2,
                    border:`1px solid ${breakMins===d?T.blue:T.border}`,
                    color:breakMins===d?T.blue:T.muted, fontSize:10, ...orb,
                    cursor:"pointer", fontWeight:breakMins===d?900:400, transition:"all .2s" }}>
                  {d}m
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── AMBIENT SOUNDS ── */}
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.5}}
          style={{ ...C({padding:"14px"}), marginBottom:14 }}
        >
          <div style={{ fontSize:7, color:T.muted, ...mono, letterSpacing:3, marginBottom:10 }}>AMBIENT</div>
          <div style={{ display:"flex", gap:6 }}>
            {AMBIENT_SOUNDS.map(s=>(
              <motion.button key={s.id} whileTap={{scale:.95}} onClick={()=>setAmbient(s.id)}
                style={{ flex:1, padding:"9px 4px", borderRadius:8,
                  background:ambient===s.id?`${activeMode.color}18`:T.bg2,
                  border:`1px solid ${ambient===s.id?activeMode.color:T.border}`,
                  cursor:"pointer", textAlign:"center", transition:"all .2s" }}>
                <div style={{ fontSize:14 }}>{s.icon}</div>
                <div style={{ fontSize:7, color:ambient===s.id?activeMode.color:T.muted, ...mono, marginTop:3 }}>{s.label}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── SESSION LOG ── */}
        {log.length > 0 && (
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.6}}
            style={{ ...C({padding:"14px"}), marginBottom:14 }}
          >
            <div style={{ fontSize:7, color:T.muted, ...mono, letterSpacing:3, marginBottom:10 }}>TODAY'S SESSIONS</div>
            {log.map((entry,i)=>{
              const m = DEEP_MODES.find(d=>d.id===entry.mode)||DEEP_MODES[0];
              return (
                <motion.div key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*.05}}
                  style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", marginBottom:5,
                    background:T.bg2, borderRadius:8, border:`1px solid ${m.color}22` }}>
                  <span style={{ fontSize:14 }}>{m.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:10, color:T.bright, ...raj, fontWeight:600 }}>{entry.label}</div>
                  </div>
                  <div style={{ fontSize:9, color:T.muted, ...mono }}>{entry.time}</div>
                  <div style={{ fontSize:8, color:m.color, background:`${m.color}15`,
                    border:`1px solid ${m.color}33`, borderRadius:4, padding:"2px 6px", ...mono }}>+XP</div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ── WEEKLY FOCUS HEATMAP ── */}
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.7}}
          style={{ ...C({padding:"14px"}) }}
        >
          <div style={{ fontSize:7, color:T.muted, ...mono, letterSpacing:3, marginBottom:10 }}>WEEKLY FOCUS GRID</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:5 }}>
            {["M","T","W","T","F","S","S"].map((d,i)=>{
              const isToday = i === new Date().getDay()-1;
              const intensity = isToday?sessions:Math.floor(Math.random()*5);
              const col = intensity>4?activeMode.color:intensity>2?activeMode.color+"88":intensity>0?activeMode.color+"44":T.bg2;
              return (
                <div key={i} style={{ textAlign:"center" }}>
                  <div style={{ width:"100%", aspectRatio:"1", borderRadius:6, background:col,
                    border:`1px solid ${isToday?activeMode.color:T.border}`,
                    boxShadow:isToday?`0 0 8px ${activeMode.color}44`:"none",
                    transition:"all .3s" }}/>
                  <div style={{ fontSize:7, color:isToday?activeMode.color:T.muted, ...mono, marginTop:3 }}>{d}</div>
                </div>
              );
            })}
          </div>
          <div style={{ display:"flex", gap:4, marginTop:8, justifyContent:"flex-end", alignItems:"center" }}>
            <span style={{ fontSize:7, color:T.muted, ...mono }}>Low</span>
            {[T.bg2,`${activeMode.color}33`,`${activeMode.color}66`,activeMode.color].map((c,i)=>(
              <div key={i} style={{ width:12, height:12, borderRadius:3, background:c }}/>
            ))}
            <span style={{ fontSize:7, color:T.muted, ...mono }}>High</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default FocusTab;
