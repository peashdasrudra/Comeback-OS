/* eslint-disable */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── DATA ────────────────────────────────────────────────────────────────────
const UNIS = [
  {
    id:"kuet", name:"KUET", fullName:"Khulna University of Engineering & Technology",
    location:"Khulna", icon:"🏛️", color:"#00ff88", status:"HOME GROUND",
    chancePct:90, chanceLabel:"VERY HIGH", chanceColor:"#00ff88",
    intake:"Sep 2026", minGPA:"2.75", minIELTS:"N/A",
    exam:"Written + Viva", fees:"৳3k/year", researchActive:true,
    pros:["Home city – ৳0 rent","10-min commute","Strong ML faculty","Research labs"],
    deadline:"Sep 2026",
    notes:"Your best bet. Apply first.",
  },
  {
    id:"ku", name:"KU", fullName:"Khulna University",
    location:"Khulna", icon:"🎓", color:"#ff8800", status:"HOME GROUND",
    chancePct:82, chanceLabel:"HIGH", chanceColor:"#ff8800",
    intake:"Dec 2026", minGPA:"3.0", minIELTS:"N/A",
    exam:"Entrance Test", fees:"৳2k/year", researchActive:true,
    pros:["Home city","Interdisciplinary research","Good faculty network"],
    deadline:"Dec 2026",
    notes:"Strong backup. Same city advantage.",
  },
  {
    id:"du", name:"DU", fullName:"University of Dhaka",
    location:"Dhaka", icon:"🏫", color:"#a855f7", status:"STRETCH",
    chancePct:45, chanceLabel:"REACH", chanceColor:"#a855f7",
    intake:"Apr 2027", minGPA:"3.5", minIELTS:"6.0",
    exam:"Very competitive", fees:"৳5k/year", researchActive:true,
    pros:["Highest prestige","Research funding","Wide network"],
    deadline:"Apr 2027",
    notes:"Prestige play. Prepare hard for entrance.",
  },
  {
    id:"buet", name:"BUET", fullName:"Bangladesh University of Engineering & Technology",
    location:"Dhaka", icon:"⚙️", color:"#00aaff", status:"TARGET",
    chancePct:70, chanceLabel:"MODERATE", chanceColor:"#00aaff",
    intake:"Jul 2026", minGPA:"3.25", minIELTS:"N/A",
    exam:"Written admission", fees:"৳4k/year", researchActive:true,
    pros:["Top engineering school","Strong CS department","Alumni network"],
    deadline:"Jul 2026",
    notes:"Apply soon – Jul 2026 deadline approaching.",
  },
];

const DOCUMENTS = [
  { id:"transcript", label:"Academic Transcript", priority:"CRITICAL", icon:"📋" },
  { id:"certificate", label:"BSc Certificate", priority:"CRITICAL", icon:"🎓" },
  { id:"sop", label:"Statement of Purpose", priority:"CRITICAL", icon:"✍️" },
  { id:"cv", label:"Updated CV / Resume", priority:"HIGH", icon:"📄" },
  { id:"recommendation1", label:"Recommendation Letter #1", priority:"HIGH", icon:"💌" },
  { id:"recommendation2", label:"Recommendation Letter #2", priority:"HIGH", icon:"💌" },
  { id:"research_paper", label:"Thesis Abstract / Paper", priority:"MEDIUM", icon:"🧪" },
  { id:"ielts", label:"IELTS Score (if needed)", priority:"MEDIUM", icon:"🌍" },
  { id:"nid", label:"National ID / Passport", priority:"LOW", icon:"🪪" },
  { id:"photos", label:"Passport Photos", priority:"LOW", icon:"📷" },
];

const EXAM_TOPICS = [
  { subject:"Algorithms & DSA", weight:25, color:"#00ff88", icon:"💡" },
  { subject:"Machine Learning", weight:20, color:"#00aaff", icon:"🤖" },
  { subject:"Database Systems", weight:15, color:"#ffd700", icon:"🗄️" },
  { subject:"Operating Systems", weight:15, color:"#ff8800", icon:"⚙️" },
  { subject:"Computer Networks", weight:15, color:"#a855f7", icon:"🌐" },
  { subject:"Discrete Math",     weight:10, color:"#ff0088", icon:"📐" },
];

const TIMELINE_EVENTS = [
  { date:"Jun 15, 2026", label:"Thesis Submission", color:"#ff4444", urgent:true, icon:"🧪" },
  { date:"Jul 2026",     label:"BUET Application Opens", color:"#00aaff", urgent:false, icon:"⚙️" },
  { date:"Sep 2026",     label:"KUET Admission Exam", color:"#00ff88", urgent:false, icon:"🏛️" },
  { date:"Dec 2026",     label:"KU Application Deadline", color:"#ff8800", urgent:false, icon:"🎓" },
  { date:"Apr 2027",     label:"DU Application Opens", color:"#a855f7", urgent:false, icon:"🏫" },
];

const COST_DATA = [
  { uni:"KUET", tuition:"৳3k/yr", rent:"৳0", food:"৳3k/mo", travel:"৳500/mo", yearly:"৳45k", color:"#00ff88", icon:"🏛️", note:"Home city — zero relocation cost" },
  { uni:"KU",   tuition:"৳2k/yr", rent:"৳0", food:"৳3k/mo", travel:"৳800/mo", yearly:"৳48k", color:"#ff8800", icon:"🎓", note:"Home city — minimal extra cost" },
  { uni:"BUET", tuition:"৳4k/yr", rent:"৳8k/mo", food:"৳5k/mo", travel:"৳2k/mo", yearly:"৳184k", color:"#00aaff", icon:"⚙️", note:"Dhaka living is 4x Khulna" },
  { uni:"DU",   tuition:"৳5k/yr", rent:"৳10k/mo",food:"৳5k/mo", travel:"৳2k/mo", yearly:"৳209k", color:"#a855f7", icon:"🏫", note:"Most expensive option" },
];

const PROFESSORS = [
  { name:"Dr. Mohammad Shamsul Arefin", uni:"KUET", dept:"CSE", research:"ML, Data Mining", email:"sarefin@cse.kuet.ac.bd", status:"not_sent", color:"#00ff88" },
  { name:"Dr. K.M. Azharul Hasan", uni:"KUET", dept:"CSE", research:"Bioinformatics, ML", email:"azharul@cse.kuet.ac.bd", status:"not_sent", color:"#00ff88" },
  { name:"Dr. Muhammad Masroor Ali", uni:"BUET", dept:"CSE", research:"ML, Pattern Recognition", email:"masroorali@cse.buet.ac.bd", status:"not_sent", color:"#00aaff" },
  { name:"Dr. Md. Monirul Islam", uni:"BUET", dept:"CSE", research:"Neural Networks, Optimization", email:"monirul@cse.buet.ac.bd", status:"not_sent", color:"#00aaff" },
  { name:"Prof. Dr. Md. Rezaul Karim", uni:"KU", dept:"CSE", research:"AI, Data Science", email:"mrkarim@ku.ac.bd", status:"not_sent", color:"#ff8800" },
  { name:"Dr. Md. Abdur Razzaque", uni:"DU", dept:"CSE", research:"ML, IoT", email:"razzaque@cse.du.ac.bd", status:"not_sent", color:"#a855f7" },
];

// ─── SUB-TABS ────────────────────────────────────────────────────────────────
const SUB_TABS = [
  { id:"overview",   icon:"📊", label:"Overview" },
  { id:"unis",       icon:"🏛️", label:"Unis" },
  { id:"documents",  icon:"📂", label:"Docs" },
  { id:"exam",       icon:"📝", label:"Exam" },
  { id:"timeline",   icon:"📅", label:"Timeline" },
  { id:"sop",        icon:"✍️", label:"SOP" },
  { id:"costs",      icon:"💰", label:"Costs" },
  { id:"outreach",   icon:"📧", label:"Profs" },
];

// Animated counter
const AnimCounter = ({ to }) => {
  const [v, setV] = useState(0);
  useEffect(()=>{
    let start=null;
    const f=(ts)=>{
      if(!start)start=ts;
      const p=Math.min((ts-start)/800,1);
      setV(Math.floor(p*to));
      if(p<1)requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  },[to]);
  return <span>{v}</span>;
};

// Progress bar
const Bar = ({ pct, color, height=4 }) => (
  <div style={{ height, background:"#1a2a2a", borderRadius:height, overflow:"hidden" }}>
    <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:1,ease:"easeOut"}}
      style={{ height:"100%", background:color, borderRadius:height, boxShadow:`0 0 6px ${color}44` }}/>
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const AdmissionsTab = ({ T, C, mono, orb, raj, gainXP }) => {
  const [subTab, setSubTab]       = useState("overview");
  const [activeUni, setActiveUni] = useState("kuet");
  const [docChecks, setDocChecks] = useState({});
  const [sopKey,    setSopKey]    = useState("kuet");
  const [copied,    setCopied]    = useState(false);
  const [profStatus, setProfStatus] = useState({});

  const uni = UNIS.find(u=>u.id===activeUni);
  const docPct = Math.round((Object.values(docChecks).filter(Boolean).length/DOCUMENTS.length)*100);

  const toggleDoc = (id) => {
    setDocChecks(p=>({ ...p, [id]:!p[id] }));
    if(!docChecks[id]) gainXP && gainXP(5,"Document checked ✅");
  };

  const SOP_TEMPLATES = {
    kuet: `I am Peash Rudra, a BSc CSE graduate from NUBTK with a 3.95/4.00 GPA and National Debate Champion 2024. My thesis, "CRO vs SHAP: Interpretable ML for Multi-omics Cancer Subtype Prediction," supervised by Md. Riaz Mahmud, demonstrates my commitment to cutting-edge research at the intersection of machine learning and bioinformatics.

I wish to pursue MSc CSE at KUET to continue under expert supervision, leverage Khulna's research infrastructure, and contribute to the department's ML research agenda. My background in multi-omics analysis, Python, and interpretable AI aligns with current faculty research directions.

My goal is to publish peer-reviewed work and pursue a PhD abroad, making KUET the ideal launchpad for this journey.`,
    buet: `As a first-class BSc CSE graduate (3.95 GPA) and National Debate Champion, I bring both intellectual rigor and communication excellence to research. My thesis on interpretable ML for cancer subtype prediction places me at the frontier of applied machine learning.

BUET's reputation as Bangladesh's leading engineering institution and its strong research culture make it my top choice for graduate study. I am prepared for the competitive admission process and confident that my research profile—CRO optimization, SHAP-based interpretability, multi-omics fusion—will contribute meaningfully to BUET's research output.`,
    ku: `My academic journey from a 32/100 freshman score to a 3.95 GPA and National Debate Championship reflects the resilience and discipline I will bring to graduate research at Khulna University. My thesis combines optimization theory with deep learning interpretability, a novel approach with real clinical implications.

KU's interdisciplinary research environment and proximity to my home make it an ideal choice to continue my work without relocation disruption, allowing maximum focus on research output and publication.`,
    du: `University of Dhaka represents the pinnacle of academic excellence in Bangladesh. With a 3.95 GPA, a published-level thesis, and a national championship, I believe I can contribute meaningfully to DU's research culture. My work on CRO vs SHAP for multi-omics cancer prediction bridges optimization, interpretability, and biomedical AI—areas of growing importance.

I seek admission to DU's MSc CSE program to challenge myself at the highest level, access Dhaka's research network, and pursue international collaboration opportunities.`,
  };

  return (
    <div style={{ padding:"0 0 80px", maxWidth:430, margin:"0 auto" }}>

      {/* ── HERO BANNER ── */}
      <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} transition={{duration:.5}}
        style={{
          padding:"18px 16px 14px",
          background:"linear-gradient(135deg,#030814,#020408,#040a06)",
          borderBottom:`1px solid #a855f733`, position:"relative", overflow:"hidden"
        }}>
        <div style={{ position:"absolute", top:-40, right:-40, width:150, height:150,
          background:"radial-gradient(circle,#a855f712,transparent)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-30, left:-30, width:100, height:100,
          background:"radial-gradient(circle,#00ff8808,transparent)", pointerEvents:"none" }}/>
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:7, color:"#a855f7", ...mono, letterSpacing:4, marginBottom:4 }}>🎓 ADMISSIONS COMMAND</div>
          <div style={{ ...orb, fontSize:20, fontWeight:900, color:T.bright, marginBottom:2 }}>PEASH RUDRA</div>
          <div style={{ fontSize:9, color:T.muted, ...raj }}>3.95/4.00 GPA · BSc CSE · NUBTK · Khulna</div>
          <div style={{ display:"flex", gap:8, marginTop:10, flexWrap:"wrap" }}>
            {[
              { v:"3.95", l:"GPA", c:T.green },
              { v:"A+",   l:"Profile", c:"#a855f7" },
              { v:"90%",  l:"KUET odds", c:T.green },
              { v:`${docPct}%`, l:"Docs ready", c:docPct>=80?T.green:T.orange },
            ].map((s,i)=>(
              <motion.div key={i} initial={{opacity:0,scale:.7}} animate={{opacity:1,scale:1}} transition={{delay:.2+i*.07}}
                style={{ padding:"5px 10px", borderRadius:8, background:`${s.c}15`,
                  border:`1px solid ${s.c}44`, textAlign:"center" }}>
                <div style={{ ...orb, fontSize:14, fontWeight:900, color:s.c }}>{s.v}</div>
                <div style={{ fontSize:6, color:T.muted, ...mono }}>{s.l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── SUB-TAB NAVIGATION ── */}
      <div style={{ background:T.bg1, borderBottom:`1px solid ${T.border}`, overflowX:"auto" }}>
        <div style={{ display:"flex", padding:"0 8px", minWidth:"max-content" }}>
          {SUB_TABS.map(t=>(
            <motion.div key={t.id} whileTap={{scale:.96}} onClick={()=>setSubTab(t.id)}
              style={{
                padding:"11px 14px", cursor:"pointer", whiteSpace:"nowrap",
                borderBottom:`2px solid ${subTab===t.id?"#a855f7":"transparent"}`,
                background:subTab===t.id?"#a855f712":"transparent",
                transition:"all .2s", display:"flex", alignItems:"center", gap:5
              }}>
              <span style={{ fontSize:11 }}>{t.icon}</span>
              <span style={{ fontSize:9, color:subTab===t.id?"#a855f7":T.muted, ...mono, fontWeight:subTab===t.id?700:400 }}>
                {t.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ padding:"14px 16px 0" }}>
        <AnimatePresence mode="wait">

          {/* ══ OVERVIEW ══ */}
          {subTab==="overview" && (
            <motion.div key="overview" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}>

              {/* Khulna Advantage */}
              <div style={{ ...C({padding:"14px",marginBottom:12}),
                background:"linear-gradient(135deg,#001a00,#020408)",
                border:`2px solid ${T.green}44` }}>
                <div style={{ fontSize:8, color:T.green, ...mono, letterSpacing:3, marginBottom:8 }}>
                  🏠 KHULNA ADVANTAGE — YOUR UNFAIR EDGE
                </div>
                <div style={{ fontSize:11, color:T.text, ...raj, lineHeight:1.9 }}>
                  You live in <strong style={{color:T.green}}>Khulna</strong>. KUET and KU are both here.
                  While competitors budget for rent & relocation — you wake up home, commute 10 min.{" "}
                  <strong style={{color:T.gold}}>This is a life quality difference.</strong>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6, marginTop:10 }}>
                  {[
                    {v:"৳0",    l:"Monthly rent",    c:T.green},
                    {v:"10min", l:"To KUET",         c:T.green},
                    {v:"৳96k+", l:"Saved vs Dhaka/yr",c:T.gold},
                    {v:"100%",  l:"Family support",  c:T.blue},
                  ].map((s,i)=>(
                    <div key={i} style={{ textAlign:"center", padding:"7px 4px", borderRadius:7,
                      background:`${s.c}11`, border:`1px solid ${s.c}22` }}>
                      <div style={{ ...orb, fontSize:11, fontWeight:900, color:s.c }}>{s.v}</div>
                      <div style={{ fontSize:6, color:T.muted, ...mono, marginTop:1 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* University cards grid */}
              <div style={{ fontSize:8, color:T.muted, ...mono, letterSpacing:2, marginBottom:8 }}>TARGET UNIVERSITIES</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
                {UNIS.map((u,i)=>(
                  <motion.div key={u.id}
                    initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} transition={{delay:i*.07}}
                    whileTap={{scale:.97}}
                    onClick={()=>{setActiveUni(u.id);setSubTab("unis");}}
                    style={{ background:T.bg2, border:`2px solid ${u.color}33`,
                      borderRadius:12, padding:"12px 10px", cursor:"pointer",
                      textAlign:"center", transition:"all .2s", position:"relative",
                      boxShadow:`0 2px 12px ${u.color}11` }}>
                    {(u.id==="kuet"||u.id==="ku")&&(
                      <div style={{ position:"absolute", top:-7, right:8,
                        background:T.green, color:"#020408", fontSize:6, padding:"2px 7px",
                        borderRadius:8, ...orb, fontWeight:900, letterSpacing:1 }}>🏠 HOME</div>
                    )}
                    <div style={{ fontSize:24, marginBottom:5 }}>{u.icon}</div>
                    <div style={{ ...orb, fontSize:13, fontWeight:900, color:T.bright }}>{u.name}</div>
                    <div style={{ fontSize:7, color:u.color, ...mono, marginTop:2, marginBottom:8 }}>{u.status}</div>
                    <Bar pct={u.chancePct} color={u.chanceColor}/>
                    <div style={{ ...orb, fontSize:16, fontWeight:900, color:u.chanceColor, marginTop:6 }}>
                      {u.chancePct}%
                    </div>
                    <div style={{ fontSize:7, color:T.muted, ...mono }}>{u.deadline}</div>
                  </motion.div>
                ))}
              </div>

              {/* Quick comparison table */}
              <div style={{ ...C({padding:"12px"}), overflowX:"auto" }}>
                <div style={{ fontSize:7, color:T.muted, ...mono, letterSpacing:2, marginBottom:8 }}>QUICK COMPARE</div>
                <table style={{ width:"100%", borderCollapse:"collapse", minWidth:300, fontSize:9 }}>
                  <thead>
                    <tr>{["",UNIS[0].name,UNIS[1].name,UNIS[2].name,UNIS[3].name].map((h,i)=>(
                      <th key={i} style={{ padding:"5px 6px", textAlign:i===0?"left":"center",
                        color:i===0?T.muted:[T.green,T.orange,T.blue,"#a855f7"][i-1],
                        ...mono, fontSize:8, borderBottom:`1px solid ${T.border}`, fontWeight:700 }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {[
                      ["City",    "Khulna🏠","Khulna🏠","Dhaka✈️","Dhaka✈️"],
                      ["Chance",  "90%","82%","45%","70%"],
                      ["Deadline","Sep 26","Dec 26","Apr 27","Jul 26"],
                      ["Rent",    "৳0","৳0","৳8-12k","৳8-12k"],
                    ].map(([l,...v],ri)=>(
                      <tr key={ri} style={{ background:ri%2===0?T.bg2:"transparent" }}>
                        <td style={{ padding:"5px 6px", color:T.muted, ...raj, fontSize:9 }}>{l}</td>
                        {v.map((val,ci)=>(
                          <td key={ci} style={{ padding:"5px 6px", textAlign:"center",
                            color:[T.green,T.orange,"#a855f7",T.blue][ci], ...mono, fontSize:8 }}>{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ══ UNIVERSITIES ══ */}
          {subTab==="unis" && (
            <motion.div key="unis" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
              {/* Selector */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6, marginBottom:14 }}>
                {UNIS.map(u=>(
                  <motion.div key={u.id} whileTap={{scale:.95}} onClick={()=>setActiveUni(u.id)}
                    style={{ textAlign:"center", padding:"10px 6px", borderRadius:10, cursor:"pointer",
                      background:activeUni===u.id?`${u.color}18`:T.bg2,
                      border:`2px solid ${activeUni===u.id?u.color:T.border}`, transition:"all .2s",
                      boxShadow:activeUni===u.id?`0 0 12px ${u.color}33`:"none" }}>
                    <div style={{ fontSize:18 }}>{u.icon}</div>
                    <div style={{ fontSize:9, color:activeUni===u.id?u.color:T.muted, ...orb, fontWeight:700, marginTop:3 }}>{u.name}</div>
                    <div style={{ fontSize:7, color:T.muted, ...mono }}>{u.chancePct}%</div>
                  </motion.div>
                ))}
              </div>

              {/* Uni detail */}
              {uni && (
                <motion.div key={uni.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
                  <div style={{ ...C({padding:"16px",marginBottom:10}),
                    border:`2px solid ${uni.color}44`,
                    background:`linear-gradient(135deg,${uni.color}06,transparent)` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                      <div>
                        <div style={{ fontSize:8, color:uni.color, ...mono, letterSpacing:2, marginBottom:4 }}>{uni.status}</div>
                        <div style={{ ...orb, fontSize:18, fontWeight:900, color:T.bright }}>
                          {uni.icon} {uni.name}
                        </div>
                        <div style={{ fontSize:9, color:T.muted, ...raj, marginTop:2 }}>{uni.fullName}</div>
                        <div style={{ fontSize:8, color:T.muted, ...mono, marginTop:3 }}>
                          📍 {uni.location} · 📅 {uni.intake}
                        </div>
                      </div>
                      <div style={{ textAlign:"center" }}>
                        <div style={{ width:58, height:58, borderRadius:12, background:`${uni.chanceColor}18`,
                          border:`2px solid ${uni.chanceColor}`, display:"flex", flexDirection:"column",
                          alignItems:"center", justifyContent:"center",
                          boxShadow:`0 0 16px ${uni.chanceColor}33` }}>
                          <div style={{ ...orb, fontSize:18, fontWeight:900, color:uni.chanceColor, lineHeight:1 }}>
                            {uni.chancePct}%
                          </div>
                          <div style={{ fontSize:6, color:uni.chanceColor, ...mono }}>{uni.chanceLabel}</div>
                        </div>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, marginBottom:10 }}>
                      {[
                        { l:"Min GPA", v:uni.minGPA, c:T.green },
                        { l:"Exam",    v:uni.exam,   c:T.orange },
                        { l:"Fees",    v:uni.fees,   c:T.blue },
                      ].map((s,i)=>(
                        <div key={i} style={{ padding:"8px", borderRadius:7, background:T.bg2, border:`1px solid ${T.border}`, textAlign:"center" }}>
                          <div style={{ fontSize:9, color:s.c, ...raj, fontWeight:700 }}>{s.v}</div>
                          <div style={{ fontSize:6, color:T.muted, ...mono, marginTop:1 }}>{s.l}</div>
                        </div>
                      ))}
                    </div>

                    {/* Pros */}
                    <div style={{ marginBottom:10 }}>
                      <div style={{ fontSize:7, color:T.green, ...mono, letterSpacing:2, marginBottom:6 }}>✅ ADVANTAGES</div>
                      {uni.pros.map((p,i)=>(
                        <div key={i} style={{ display:"flex", gap:6, alignItems:"center", marginBottom:4,
                          fontSize:10, color:T.text, ...raj }}>
                          <div style={{ width:5, height:5, borderRadius:"50%", background:T.green, flexShrink:0 }}/>
                          {p}
                        </div>
                      ))}
                    </div>

                    {/* Note */}
                    <div style={{ padding:"8px 12px", borderRadius:8,
                      background:`${uni.color}10`, border:`1px solid ${uni.color}33`,
                      fontSize:11, color:T.bright, ...raj, fontStyle:"italic" }}>
                      💬 {uni.notes}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ══ DOCUMENTS ══ */}
          {subTab==="documents" && (
            <motion.div key="documents" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
              <div style={{ ...C({padding:"14px",marginBottom:12}),
                background:`linear-gradient(135deg,${docPct>=80?T.green+"08":"#0a0800"},transparent)`,
                border:`1px solid ${docPct>=80?T.green+"44":"#ff880044"}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <div>
                    <div style={{ fontSize:8, color:T.muted, ...mono, letterSpacing:2 }}>DOCUMENT READINESS</div>
                    <div style={{ ...orb, fontSize:24, fontWeight:900,
                      color:docPct>=80?T.green:docPct>=50?T.orange:T.red, lineHeight:1.2 }}>
                      {docPct}%
                    </div>
                  </div>
                  <div style={{ fontSize:28 }}>{docPct>=80?"✅":docPct>=50?"⚠️":"🚨"}</div>
                </div>
                <Bar pct={docPct} color={docPct>=80?T.green:docPct>=50?T.orange:T.red} height={6}/>
                <div style={{ fontSize:9, color:T.muted, ...raj, marginTop:6 }}>
                  {Object.values(docChecks).filter(Boolean).length}/{DOCUMENTS.length} documents ready
                </div>
              </div>

              {DOCUMENTS.map((doc,i)=>{
                const checked=!!docChecks[doc.id];
                const pc=doc.priority==="CRITICAL"?T.red:doc.priority==="HIGH"?T.orange:doc.priority==="MEDIUM"?T.blue:T.muted;
                return (
                  <motion.div key={doc.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*.04}}
                    onClick={()=>toggleDoc(doc.id)}
                    style={{ display:"flex", gap:10, alignItems:"center", padding:"10px 12px", marginBottom:6,
                      background:checked?`${T.green}08`:T.bg2,
                      border:`1px solid ${checked?T.green+"44":pc+"22"}`,
                      borderRadius:10, cursor:"pointer", transition:"all .2s" }}>
                    <div style={{ width:24, height:24, borderRadius:6, border:`2px solid ${checked?T.green:T.border}`,
                      background:checked?`${T.green}22`:"transparent", display:"flex",
                      alignItems:"center", justifyContent:"center", color:T.green, fontSize:13, flexShrink:0 }}>
                      {checked?"✓":""}
                    </div>
                    <span style={{ fontSize:14, flexShrink:0 }}>{doc.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:11, color:checked?T.text:T.bright, ...raj, fontWeight:600,
                        textDecoration:checked?"line-through":"none" }}>{doc.label}</div>
                    </div>
                    <span style={{ fontSize:7, color:pc, background:`${pc}15`,
                      border:`1px solid ${pc}33`, borderRadius:4, padding:"2px 6px", ...mono,
                      flexShrink:0 }}>{doc.priority}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* ══ EXAM PREP ══ */}
          {subTab==="exam" && (
            <motion.div key="exam" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
              <div style={{ ...C({padding:"14px",marginBottom:12}),
                background:"linear-gradient(135deg,#040814,#020408)",
                border:`1px solid ${T.blue}33` }}>
                <div style={{ fontSize:8, color:T.blue, ...mono, letterSpacing:3, marginBottom:10 }}>
                  📝 ADMISSION EXAM BLUEPRINT
                </div>
                <div style={{ fontSize:10, color:T.muted, ...raj, marginBottom:12 }}>
                  Based on KUET/BUET MSc CSE exam patterns — focus on these weighted topics
                </div>
                {EXAM_TOPICS.map((t,i)=>(
                  <motion.div key={t.subject} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*.08}}
                    style={{ marginBottom:10 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4, alignItems:"center" }}>
                      <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                        <span style={{ fontSize:13 }}>{t.icon}</span>
                        <span style={{ fontSize:11, color:T.bright, ...raj, fontWeight:600 }}>{t.subject}</span>
                      </div>
                      <span style={{ fontSize:10, color:t.color, ...mono, fontWeight:700 }}>{t.weight}%</span>
                    </div>
                    <Bar pct={t.weight*4} color={t.color} height={5}/>
                  </motion.div>
                ))}
              </div>

              {/* Study tips */}
              <div style={{ ...C({padding:"14px"}) }}>
                <div style={{ fontSize:8, color:T.gold, ...mono, letterSpacing:3, marginBottom:10 }}>💡 EXAM STRATEGY</div>
                {[
                  { tip:"Start with DSA — highest weight, most predictable questions", c:T.green },
                  { tip:"ML topics match your thesis — easy wins here", c:T.blue },
                  { tip:"Use past papers from KUET CSE dept library", c:T.orange },
                  { tip:"60 days before exam: solve 3 problems daily", c:T.gold },
                  { tip:"SHAP/CRO knowledge = unique edge in ML questions", c:"#a855f7" },
                ].map((s,i)=>(
                  <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:8,
                    padding:"8px 10px", borderRadius:8, background:T.bg2, border:`1px solid ${s.c}22` }}>
                    <div style={{ width:5, height:5, borderRadius:"50%", background:s.c, flexShrink:0, marginTop:4 }}/>
                    <span style={{ fontSize:10, color:T.text, ...raj, lineHeight:1.7 }}>{s.tip}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ══ TIMELINE ══ */}
          {subTab==="timeline" && (
            <motion.div key="timeline" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
              <div style={{ fontSize:8, color:T.muted, ...mono, letterSpacing:3, marginBottom:12 }}>
                📅 YOUR ADMISSION ROADMAP
              </div>
              <div style={{ position:"relative" }}>
                {/* Vertical line */}
                <div style={{ position:"absolute", left:16, top:10, bottom:10, width:2,
                  background:`linear-gradient(to bottom,${T.green},${T.orange}55)`, borderRadius:1 }}/>
                {TIMELINE_EVENTS.map((e,i)=>{
                  const now=new Date();
                  const evDate=new Date(e.date.replace(/([A-Za-z]+)\s(\d+)/,"$2 $1"));
                  const daysLeft=Math.ceil((evDate-now)/86400000);
                  const past=daysLeft<0;
                  return (
                    <motion.div key={i} initial={{opacity:0,x:15}} animate={{opacity:1,x:0}} transition={{delay:i*.09}}
                      style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:14, position:"relative" }}>
                      <div style={{ width:34, height:34, borderRadius:"50%", background:`${e.color}22`,
                        border:`2px solid ${past?"#333":e.color}`, display:"flex", alignItems:"center",
                        justifyContent:"center", flexShrink:0, fontSize:15, zIndex:1,
                        boxShadow:e.urgent&&!past?`0 0 12px ${e.color}66`:"none" }}>
                        {e.icon}
                      </div>
                      <div style={{ flex:1, padding:"10px 12px", borderRadius:10,
                        background:past?`${T.bg2}`:e.urgent?`${e.color}12`:T.bg2,
                        border:`1px solid ${past?T.border:e.urgent?e.color+"55":e.color+"22"}` }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <div style={{ fontSize:11, color:past?T.muted:T.bright, ...raj, fontWeight:600 }}>{e.label}</div>
                          <div style={{ ...orb, fontSize:11, fontWeight:900,
                            color:past?T.muted:daysLeft<=30?T.red:e.color }}>
                            {past?"PAST":daysLeft===0?"TODAY!":daysLeft<=365?`${daysLeft}d`:"2027+"}
                          </div>
                        </div>
                        <div style={{ fontSize:8, color:T.muted, ...mono, marginTop:3 }}>{e.date}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ══ SOP ══ */}
          {subTab==="sop" && (
            <motion.div key="sop" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
              <div style={{ fontSize:8, color:T.muted, ...mono, letterSpacing:3, marginBottom:10 }}>✍️ SOP TEMPLATES</div>
              {/* Selector */}
              <div style={{ display:"flex", gap:6, marginBottom:12, overflowX:"auto" }}>
                {UNIS.map(u=>(
                  <motion.button key={u.id} whileTap={{scale:.95}} onClick={()=>{setSopKey(u.id);setCopied(false);}}
                    style={{ flex:"0 0 auto", padding:"7px 14px", borderRadius:8, /* removed */
                      background:sopKey===u.id?`${u.color}22`:T.bg2,
                      border:`1px solid ${sopKey===u.id?u.color:T.border}`,
                      color:sopKey===u.id?u.color:T.muted, fontSize:9, ...orb,
                      cursor:"pointer", fontWeight:sopKey===u.id?900:400, transition:"all .2s" }}>
                    {u.icon} {u.name}
                  </motion.button>
                ))}
              </div>
              <div style={{ ...C({padding:"14px",marginBottom:10}),
                border:`1px solid ${UNIS.find(u=>u.id===sopKey)?.color||T.border}33` }}>
                <div style={{ whiteSpace:"pre-wrap", fontSize:10, color:T.text, ...raj, lineHeight:1.9 }}>
                  {SOP_TEMPLATES[sopKey]}
                </div>
              </div>
              <motion.button whileTap={{scale:.96}}
                onClick={()=>{
                  navigator.clipboard?.writeText(SOP_TEMPLATES[sopKey]);
                  setCopied(true); setTimeout(()=>setCopied(false),2000);
                  gainXP && gainXP(10,"SOP copied ✍️");
                }}
                style={{ width:"100%", padding:"11px", borderRadius:10,
                  background:copied?`${T.green}22`:`${UNIS.find(u=>u.id===sopKey)?.color||T.blue}22`,
                  border:`1px solid ${copied?T.green:UNIS.find(u=>u.id===sopKey)?.color||T.blue}55`,
                  color:copied?T.green:UNIS.find(u=>u.id===sopKey)?.color||T.blue,
                  fontSize:11, ...orb, fontWeight:700, cursor:"pointer", transition:"all .2s" }}>
                {copied?"✅ COPIED TO CLIPBOARD":"📋 COPY SOP"}
              </motion.button>
            </motion.div>
          )}

          {/* ══ COSTS ══ */}
          {subTab==="costs" && (
            <motion.div key="costs" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
              <div style={{ fontSize:8, color:T.muted, ...mono, letterSpacing:3, marginBottom:12 }}>💰 FINANCIAL COMPARISON</div>

              {/* Summary cards */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
                {COST_DATA.map((c,i)=>(
                  <motion.div key={c.uni} initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} transition={{delay:i*.06}}
                    style={{ ...C({padding:"12px"}), border:`1px solid ${c.color}33`,
                      background:`linear-gradient(135deg,${c.color}08,transparent)` }}>
                    <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:8 }}>
                      <span style={{ fontSize:18 }}>{c.icon}</span>
                      <div style={{ ...orb, fontSize:14, fontWeight:900, color:T.bright }}>{c.uni}</div>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, marginBottom:8 }}>
                      {[
                        {l:"Tuition",v:c.tuition},{l:"Rent",v:c.rent},
                        {l:"Food",v:c.food},{l:"Travel",v:c.travel},
                      ].map((s,j)=>(
                        <div key={j} style={{ padding:"4px 6px", borderRadius:6, background:T.bg2, textAlign:"center" }}>
                          <div style={{ fontSize:9, color:c.color, ...raj, fontWeight:600 }}>{s.v}</div>
                          <div style={{ fontSize:6, color:T.muted, ...mono }}>{s.l}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ padding:"6px 8px", borderRadius:6, background:`${c.color}12`, border:`1px solid ${c.color}33`, textAlign:"center" }}>
                      <div style={{ fontSize:7, color:T.muted, ...mono }}>YEARLY TOTAL</div>
                      <div style={{ ...orb, fontSize:16, fontWeight:900, color:c.color }}>{c.yearly}</div>
                    </div>
                    <div style={{ fontSize:8, color:T.muted, ...raj, marginTop:6, fontStyle:"italic" }}>💬 {c.note}</div>
                  </motion.div>
                ))}
              </div>

              {/* Savings highlight */}
              <div style={{ ...C({padding:"14px"}), border:`2px solid ${T.green}44`,
                background:"linear-gradient(135deg,#001a00,#020408)" }}>
                <div style={{ fontSize:8, color:T.green, ...mono, letterSpacing:3, marginBottom:8 }}>🏠 KHULNA SAVINGS</div>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ ...orb, fontSize:28, fontWeight:900, color:T.green }}>৳139k+</div>
                  <div style={{ fontSize:11, color:T.text, ...raj, lineHeight:1.7 }}>
                    Saved per year vs Dhaka.<br/>
                    <span style={{ color:T.gold, fontWeight:700 }}>That's 2+ years of KUET tuition.</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══ PROFESSOR OUTREACH ══ */}
          {subTab==="outreach" && (
            <motion.div key="outreach" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
              <div style={{ fontSize:8, color:T.muted, ...mono, letterSpacing:3, marginBottom:6 }}>📧 PROFESSOR OUTREACH CRM</div>
              <div style={{ fontSize:9, color:T.muted, ...raj, marginBottom:14, lineHeight:1.7 }}>
                Track your cold emails to potential supervisors. Tap to update status.
              </div>

              {PROFESSORS.map((p,i)=>{
                const st = profStatus[p.email] || "not_sent";
                const stColor = st==="replied"?T.green:st==="sent"?T.blue:st==="followed_up"?T.orange:T.muted;
                const stLabel = st==="replied"?"REPLIED ✅":st==="sent"?"SENT 📤":st==="followed_up"?"FOLLOWED UP 🔄":"NOT SENT";
                return (
                  <motion.div key={p.email} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*.05}}
                    style={{ ...C({padding:"12px",marginBottom:8}), border:`1px solid ${p.color}22` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                      <div>
                        <div style={{ fontSize:11, color:T.bright, ...raj, fontWeight:700 }}>{p.name}</div>
                        <div style={{ fontSize:8, color:p.color, ...mono, marginTop:2 }}>{p.uni} · {p.dept} · {p.research}</div>
                        <div style={{ fontSize:8, color:T.muted, ...mono, marginTop:2 }}>{p.email}</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:4, marginTop:6 }}>
                      {["not_sent","sent","followed_up","replied"].map(s=>{
                        const sc = s==="replied"?T.green:s==="sent"?T.blue:s==="followed_up"?T.orange:T.muted;
                        const sl = s==="replied"?"Replied":s==="sent"?"Sent":s==="followed_up"?"Follow-up":"Pending";
                        return (
                          <button key={s} onClick={()=>{
                            setProfStatus(prev=>({...prev,[p.email]:s}));
                            if(s==="sent") gainXP && gainXP(10,"Email sent 📧");
                            if(s==="replied") gainXP && gainXP(25,"Prof replied! 🎉");
                          }}
                            style={{ flex:1, padding:"5px 4px", borderRadius:6, cursor:"pointer",
                              background:st===s?`${sc}22`:T.bg2,
                              border:`1px solid ${st===s?sc:T.border}`,
                              color:st===s?sc:T.dim, fontSize:7, ...mono, fontWeight:st===s?700:400 }}>
                            {sl}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}

              {/* Email template */}
              <div style={{ ...C({padding:"14px",marginTop:6}), border:`1px solid ${T.blue}33` }}>
                <div style={{ fontSize:8, color:T.blue, ...mono, letterSpacing:2, marginBottom:8 }}>📝 EMAIL TEMPLATE</div>
                <div style={{ fontSize:9, color:T.text, ...raj, lineHeight:1.9, whiteSpace:"pre-wrap" }}>{`Subject: Prospective MSc Student — CRO + SHAP for Multi-omics Cancer Research\n\nDear Professor [Name],\n\nI am Peash Rudra, a BSc CSE graduate from NUBTK (3.95/4.00 GPA) and National Debate Champion 2024. My thesis, supervised by Md. Riaz Mahmud, applies Chemical Reaction Optimization with SHAP-based interpretability for multi-omics breast cancer subtype prediction.\n\nI am interested in pursuing MSc research under your supervision at [University]. Your work on [specific research area] aligns closely with my thesis direction.\n\nI have attached my CV and a 1-page research summary for your review.\n\nThank you for your time and consideration.\n\nBest regards,\nPeash Das Rudra`}</div>
                <button onClick={()=>{
                  navigator.clipboard?.writeText(`Subject: Prospective MSc Student — CRO + SHAP for Multi-omics Cancer Research\n\nDear Professor [Name],\n\nI am Peash Rudra, a BSc CSE graduate from NUBTK (3.95/4.00 GPA) and National Debate Champion 2024. My thesis, supervised by Md. Riaz Mahmud, applies Chemical Reaction Optimization with SHAP-based interpretability for multi-omics breast cancer subtype prediction.\n\nI am interested in pursuing MSc research under your supervision at [University]. Your work on [specific research area] aligns closely with my thesis direction.\n\nI have attached my CV and a 1-page research summary for your review.\n\nThank you for your time and consideration.\n\nBest regards,\nPeash Das Rudra`);
                  gainXP && gainXP(5,"Template copied 📋");
                }} className="btn-tap" style={{ width:"100%", marginTop:10, padding:"10px", borderRadius:8,
                  background:`${T.blue}22`, border:`1px solid ${T.blue}55`, color:T.blue,
                  ...orb, fontWeight:700, fontSize:11, cursor:"pointer" }}>📋 COPY TEMPLATE</button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdmissionsTab;
