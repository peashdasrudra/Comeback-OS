const Life = (props) => {
  const {
    lifeTab, setLifeTab,
    ieltsVocab, setIeltsVocab, ieltsMocks, setIeltsMocks,
    ieltsNewWord, setIeltsNewWord, ieltsTab, setIeltsTab,
    showIeltsWord, setShowIeltsWord, vocabFlip, setVocabFlip,
    showIeltsMock, setShowIeltsMock, ieltsNewMock, setIeltsNewMock,
    musicLog, setMusicLog, musicForm, setMusicForm, showMusicForm, setShowMusicForm,
    freelanceLog, setFreelanceLog, freelanceForm, setFreelanceForm,
    showFLForm, setShowFLForm, freelanceGoal, setFreelanceGoal,
    profCRM, setProfCRM, profForm, setProfForm, showProfForm, setShowProfForm,
    paperLog, setPaperLog, paperForm, setPaperForm, showPaperForm, setShowPaperForm,
    smokingLog, smokeGoalDate, setSmokeGoalDate,
    gainXP, T, orb, mono, raj, C
  } = props;

  const ieltsTotal = ieltsVocab.length;
  const ieltsAvg = ieltsMocks.length > 0 ? (ieltsMocks.reduce((a,m) => (a+(m.r+m.w+m.l+m.s)/4), 0) / ieltsMocks.length).toFixed(1) : 0;
  const lastMock = ieltsMocks[ieltsMocks.length-1] || null;
  const totalFreelance = freelanceLog.filter(f => f.status === "Earned").reduce((a,f) => a+Number(f.amount||0), 0);
  const profEmailed = profCRM.filter(p => p.emailed).length;
  const profReplied = profCRM.filter(p => p.replied).length;
  const curSmoke = smokingLog.length > 0 ? smokingLog[smokingLog.length-1].count : 10;
  const daysToQuitGoal = Math.max(0, Math.floor((new Date(smokeGoalDate)-new Date())/86400000));

  return (
    <div style={{}}>
      {/* Sub-tab nav */}
      <div style={{display:"flex",background:T.bg1,borderBottom:`1px solid ${T.border}`,overflowX:"auto"}}>
        {[
          {id:"ielts",  l:"🌍 IELTS"},
          {id:"music",  l:"🎵 MUSIC"},
          {id:"sports", l:"⚽ SPORTS"},
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
                  <button onClick={()=>{if(!ieltsNewWord.word.trim())return;setIeltsVocab(p=>[{id:Date.now(),...ieltsNewWord,date:new Date().toLocaleDateString()},...p]);setIeltsNewWord({word:"",meaning:"",example:""});setShowIeltsWord(false);gainXP(2,"Vocab word added 📖");}} style={{width:"100%",padding:"9px",background:T.blue+"33",border:`1px solid ${T.blue}55`,color:T.blue,borderRadius:7,...mono,fontSize:10,cursor:"pointer"}}>SAVE WORD</button>
                </div>
              )}
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

      {/* ── SPORTS (eFootball + Cricket) ── */}
      {lifeTab==="sports"&&(
        <div style={{padding:16}}>
          <div style={{...C({padding:"14px",marginBottom:12,background:"linear-gradient(135deg,#1a0080,transparent)",border:`1px solid ${T.pink}44`})}}>
            <div style={{fontSize:9,color:T.pink,letterSpacing:2,...mono,marginBottom:8}}>⚽ TACTICAL ATHLETE</div>
            <div style={{...orb,fontSize:16,fontWeight:900,color:T.bright,marginBottom:4}}>Peash Das Rudra</div>
            <div style={{fontSize:11,color:T.muted,...raj,marginBottom:2}}>eFootball: Bayern Munich · Cricket: Wicketkeeper-batsman #7</div>
            <div style={{fontSize:9,color:T.dim,...mono}}>Age 25 · Final-year CSE @ NUBTK</div>
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

          <div style={{...C({padding:"12px",marginBottom:12})}}>
            <div style={{fontSize:9,color:T.muted,...mono,marginBottom:6}}>🎯 SET QUIT GOAL DATE</div>
            <input type="date" value={smokeGoalDate} onChange={e=>setSmokeGoalDate(e.target.value)} style={{width:"100%",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 10px",color:T.tx,...mono,fontSize:11,boxSizing:"border-box"}}/>
          </div>

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

export default Life;
