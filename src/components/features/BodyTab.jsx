const BodyTab = ({
  workoutDay, setWorkoutDay, dayPct, exPct, isSetDone, togSet, showExForm, setShowExForm,
  warmupDone, setWarmupDone, streak, timer, setTimer, T, orb, mono, raj, C, gt, DAYS, Ring, RestTimer
}) => {
  const MEALS = [
    {time:"7:00 AM",name:"Wake-Up Fuel",foods:"2 boiled eggs + banana + full-fat milk",cal:450,color:T.gold},
    {time:"9:00 AM",name:"Power Breakfast",foods:"3 roti/paratha + 2 eggs + vegetables",cal:600,color:T.green},
    {time:"12:00 PM",name:"Pre-Workout",foods:"Banana + peanuts + glass of milk",cal:400,color:T.blue},
    {time:"2:00 PM",name:"Main Meal",foods:"2 cup rice + dal + chicken or fish curry",cal:750,color:T.orange},
    {time:"5:00 PM",name:"Post-Workout",foods:"Rice or bread + banana (within 30 MIN of workout)",cal:350,color:T.pink},
    {time:"8:00 PM",name:"Dinner",foods:"Rice or roti + protein + vegetables",cal:650,color:T.green},
    {time:"10:30 PM",name:"Pre-Sleep Anabolic",foods:"Warm milk + banana + peanut butter",cal:350,color:T.gold},
  ];
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
export default BodyTab;
