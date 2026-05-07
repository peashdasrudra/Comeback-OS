import { motion, AnimatePresence } from "framer-motion";

const FocusTab = ({
  pomLeft, pomMode, deepFocusLeft, getRank, xp, T, orb, raj, mono, C, Ring,
  setFocusTab, focusTab, setPomMode, setPomLeft, setPomState, pomState,
  pomSessions, deepFocusSessions, setDeepFocusSt, setDeepFocusLeft, deepFocusSt,
  setShowAddHabit, showAddHabit, newHabitName, setNewHabitName, setHabits, habits,
  TODAY, setHabitHistory, gainXP, takeXP, habitHistory, setShowHabitCal, showHabitCal,
  XP_RANKS, scoreColor, scoreGrade, dailyScore, PLAYLISTS, xpLevel
}) => {
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

export default FocusTab;
