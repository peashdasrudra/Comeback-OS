const MeTab = ({
  T, orb, mono, raj, C, gt, PROFILE, quoteIdx, setQuoteIdx, setShowChangePin
}) => (
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
        &quot;{PROFILE.quotes[quoteIdx]}&quot;
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
export default MeTab;
