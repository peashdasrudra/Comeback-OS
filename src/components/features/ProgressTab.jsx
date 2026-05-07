/* eslint-disable */
const ProgressTab = ({
  T, orb, mono, raj, C, gt, Ring,
  weightLog, setWeightLog, newWeight, setNewWeight,
  measurements, setMeasurements,
  smokingLog, setSmokingLog, newSmoke, setNewSmoke,
  tp, wPct, sPct, streak,
  curWeight, wGained, curSmoke,
  gainXP, takeXP,
  WEEKS, weekPct, pc,
  setTab, setActiveWeek
}) => {
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
export default ProgressTab;
