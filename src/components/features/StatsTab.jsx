import { motion, AnimatePresence } from "framer-motion";

const StatsTab = ({
  ACHIEVEMENTS_DEF,
  XP_RANKS,
  WEEKS,
  getRank,
  achievements,
  habits,
  xp,
  tasksDone,
  sets,
  streak,
  statsTab,
  setStatsTab,
  selTier,
  setSelTier,
  TODAY,
  T,
  orb,
  mono,
  raj,
  C,
  tp,
  wPct,
  sPct,
  xpLevel,
  weekPct,
  pc,
  setTab,
  setActiveWeek,
  pomSessions,
  weightLog,
  dailyLog,
  wGained,
  curWeight,
}) => {
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
export default StatsTab;
