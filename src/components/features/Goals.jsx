import { AdmissionsDashboard } from "../../AdmissionsDashboard";

const Goals = (props) => {
  const {
    goalsTab, setGoalsTab, goalsSubTab, setGoalsSubTab,
    admTab, setAdmTab, admCheckDone, setAdmCheckDone,
    profEmailDone, setProfEmailDone, expandedExam, setExpandedExam,
    activePath, setActivePath, activeUni, setActiveUni,
    PATHS, UNIS, RUDRA_ANALYSIS, SCHOLARSHIP_PROGRAMS, KUET_PROFS,
    T, orb, mono, raj, gt, C
  } = props;

  const path = PATHS.find(p => p.id === activePath);
  const uni = UNIS.find(u => u.id === activeUni);
  const scoreLabels = [["family", "👨‍👩‍👦 Parents & Family"], ["financial", "💰 Financial Freedom"], ["reputation", "🎖️ Reputation / Society"], ["satisfaction", "❤️ Own Satisfaction"], ["complexity", "🧩 Complexity (↑ = easier)"]];
  return (
    <div style={{}}>
      <div style={{ display: "flex", background: T.bg1, borderBottom: `1px solid ${T.border}` }}>
        {[{ id: "paths", label: "🗺️ LIFE PATHS" }, { id: "admission", label: "🏛️ ADMISSION" }].map(st => (
          <div key={st.id} onClick={() => setGoalsTab(st.id)} style={{ flex: 1, padding: "11px 4px", textAlign: "center", cursor: "pointer", borderBottom: goalsTab === st.id ? `2px solid ${T.green}` : "2px solid transparent", background: goalsTab === st.id ? "#00ff8808" : "transparent", fontSize: 12, color: goalsTab === st.id ? T.green : T.muted, ...mono, letterSpacing: 1, transition: "all .2s" }}>
            {st.label}
          </div>
        ))}
      </div>

      {goalsTab === "paths" && (
        <div style={{ padding: 16 }}>
          {PATHS.map(p => (
            <div key={p.id} onClick={() => setActivePath(p.id)} style={{ ...C({ padding: "12px 14px", marginBottom: 8, cursor: "pointer", border: `1.5px solid ${activePath === p.id ? p.color : T.border}`, background: activePath === p.id ? p.color + "11" : T.bg1, transition: "all .2s" }), display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 20 }}>{p.icon}</span>
                <div>
                  <div style={{ fontSize: 13, color: activePath === p.id ? T.bright : T.muted, fontWeight: 700, ...raj }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: T.muted, ...mono }}>{p.timeline}</div>
                </div>
              </div>
              <span style={{ background: p.color + "22", border: `1px solid ${p.color}33`, color: p.color, fontSize: 8, letterSpacing: 1, padding: "3px 8px", borderRadius: 20, ...mono, whiteSpace: "nowrap" }}>{p.tag}</span>
            </div>
          ))}
          {path && (
            <div style={{ marginTop: 4 }}>
              <div style={{ ...C({ padding: "16px", marginBottom: 10, border: `1px solid ${path.color}44` }) }}>
                <div style={{ ...orb, fontSize: 14, fontWeight: 900, color: T.bright }}>{path.icon} {path.name}</div>
                <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.7, marginTop: 8, ...raj }}>{path.summary}</div>
              </div>
              <div style={{ ...C({ padding: "14px", marginBottom: 10 }) }}>
                <div style={{ fontSize: 9, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 12 }}>LIFE CONDITIONS SCORE</div>
                {scoreLabels.map(([key, label]) => (
                  <div key={key} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: T.text, ...raj }}>{label}</span>
                      <span style={{ ...orb, fontSize: 11, color: path.color }}>{path.score[key]}/5</span>
                    </div>
                    <div style={{ height: 5, background: T.bg2, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${(path.score[key] / 5) * 100}%`, height: "100%", background: path.color, boxShadow: `0 0 6px ${path.color}44`, transition: "width .5s" }} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: T.muted, fontSize: 12, ...raj }}>TOTAL SCORE</span>
                  <span style={{ ...orb, fontSize: 20, fontWeight: 900, ...gt(path.color) }}>{Object.values(path.score).reduce((a, b) => a + b, 0)}/25</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <div style={{ flex: 1, background: "#051a0a", border: `1px solid ${T.green}22`, borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 9, color: T.green, letterSpacing: 2, marginBottom: 8, ...mono }}>✅ PROS</div>
                  {path.pros.map((pr, i) => <div key={i} style={{ fontSize: 11, color: T.text, marginBottom: 5, lineHeight: 1.5, ...raj }}>• {pr}</div>)}
                </div>
                <div style={{ flex: 1, background: "#1a0508", border: `1px solid ${T.red}22`, borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 9, color: T.red, letterSpacing: 2, marginBottom: 8, ...mono }}>⚠️ CONS</div>
                  {path.cons.map((cn, i) => <div key={i} style={{ fontSize: 11, color: "#ffcccc", marginBottom: 5, lineHeight: 1.5, ...raj }}>• {cn}</div>)}
                </div>
              </div>
              <div style={{ ...C({ padding: "14px", border: `1px solid ${path.color}44` }) }}>
                <div style={{ fontSize: 9, color: path.color, letterSpacing: 2, marginBottom: 8, ...mono }}>⚡ STRATEGY</div>
                <div style={{ fontSize: 12, color: T.bright, lineHeight: 1.8, ...raj }}>{path.strategy}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {goalsTab === "admission" && (
        <div style={{ padding: 16 }}>

          {/* ── RUDRA PROFILE ANALYSIS HEADER ── */}
          <div style={{ ...C({ padding: "15px", marginBottom: 12, background: "linear-gradient(135deg,#020d08,#040814)", border: `2px solid ${T.green}55` }) }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 9, color: T.green, letterSpacing: 3, ...mono, marginBottom: 4 }}>🎯 YOUR ADMISSION PROFILE</div>
                <div style={{ ...orb, fontSize: 18, fontWeight: 900, color: T.bright }}>PEASH RUDRA</div>
                <div style={{ fontSize: 10, color: T.muted, ...mono, marginTop: 2 }}>NUBTK · CSE · 3.95/4.00 · Khulna</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 54, height: 54, borderRadius: 10, background: T.green + "22", border: `2px solid ${T.green}`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                  <div style={{ ...orb, fontSize: 18, fontWeight: 900, color: T.green }}>A+</div>
                  <div style={{ fontSize: 7, color: T.green, ...mono }}>PROFILE</div>
                </div>
              </div>
            </div>
            {/* Competitive edge stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
              {[
                { l: "GPA vs KUET min", v: "3.95 vs 2.75", c: T.green, pct: 100 },
                { l: "Khulna unis", v: "2 home options", c: T.green, pct: 100 },
                { l: "Research novelty", v: "Published-level", c: T.blue, pct: 88 },
              ].map((s, i) => (
                <div key={i} style={{ background: s.c + "11", border: `1px solid ${s.c}22`, borderRadius: 7, padding: "7px 6px", textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: s.c, fontWeight: 700, ...raj, lineHeight: 1.3 }}>{s.v}</div>
                  <div style={{ fontSize: 6, color: T.muted, ...mono, marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── SUB-NAV ── */}
          <div style={{ display: "flex", background: T.bg1, borderRadius: 10, border: `1px solid ${T.border}`, marginBottom: 12, overflow: "hidden", overflowX: "auto" }}>
            {[{ id: "dashboard", l: "📊 Dashboard" }, { id: "enhanced", l: "🚀 Enhanced" }, { id: "unis", l: "🏛️ Universities" }, { id: "analysis", l: "🔍 Analysis" }, { id: "profs", l: "📧 Professors" }, { id: "scholarships", l: "✈️ Abroad" }, { id: "timeline", l: "📅 Timeline" }].map(s => (
              <div key={s.id} onClick={() => setGoalsSubTab(s.id)} style={{ padding: "9px 8px", cursor: "pointer", whiteSpace: "nowrap", borderBottom: goalsSubTab === s.id ? `2px solid ${T.green}` : "2px solid transparent", background: goalsSubTab === s.id ? "#00ff8808" : "transparent", fontSize: 9, color: goalsSubTab === s.id ? T.green : T.muted, ...mono, transition: "all .2s" }}>{s.l}</div>
            ))}
          </div>

          {/* ── DASHBOARD ── */}
          {goalsSubTab === "dashboard" && (
            <div>
              {/* Khulna advantage */}
              <div style={{ ...C({ padding: "13px", marginBottom: 12, background: "linear-gradient(135deg,#001a00,#020408)", border: `2px solid ${T.green}44` }) }}>
                <div style={{ fontSize: 9, color: T.green, letterSpacing: 2, ...mono, marginBottom: 6 }}>🏠 THE KHULNA ADVANTAGE — YOUR UNFAIR EDGE</div>
                <div style={{ fontSize: 12, color: T.bright, ...raj, lineHeight: 1.9 }}>
                  You live in <strong style={{ color: T.green }}>Khulna</strong>. KUET and KU are both in Khulna. While applicants from Dhaka, Rajshahi, Sylhet budget for rent, food, transport, and relocation stress — you wake up in your own house, eat your mother's cooking, and commute 10–25 minutes. <strong style={{ color: T.gold }}>This is not a small advantage. This is a life quality difference.</strong>
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                  {[{ v: "৳0", l: "Monthly Rent", c: T.green }, { v: "10 min", l: "To KUET", c: T.green }, { v: "৳96k+", l: "Saved vs Dhaka/yr", c: T.gold }, { v: "100%", l: "Family support", c: T.blue }].map((s, i) => (
                    <div key={i} style={{ flex: 1, background: s.c + "11", border: `1px solid ${s.c}22`, borderRadius: 7, padding: "7px 4px", textAlign: "center" }}>
                      <div style={{ ...orb, fontSize: 12, fontWeight: 900, color: s.c }}>{s.v}</div>
                      <div style={{ fontSize: 6, color: T.muted, ...mono, marginTop: 2 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* All 4 uni cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                {UNIS.map(u => (
                  <div key={u.id} onClick={() => { setActiveUni(u.id); setAdmTab("overview"); setGoalsSubTab("unis"); }} style={{ background: activeUni === u.id ? u.color + "18" : T.bg2, border: `2px solid ${activeUni === u.id ? u.color : u.color + "33"}`, borderRadius: 12, padding: "12px 8px", cursor: "pointer", textAlign: "center", transition: "all .2s", position: "relative" }}>
                    {(u.id === "kuet" || u.id === "ku") && <div style={{ position: "absolute", top: -7, right: 6, background: T.green, color: "#020408", fontSize: 6, padding: "2px 6px", borderRadius: 8, ...orb, fontWeight: 900 }}>🏠 HOME</div>}
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{u.icon}</div>
                    <div style={{ ...orb, fontSize: 12, fontWeight: 700, color: T.bright }}>{u.name}</div>
                    <div style={{ fontSize: 7, color: u.color, ...mono, marginTop: 2, marginBottom: 6 }}>{u.status}</div>
                    <div style={{ height: 5, background: T.bg3, borderRadius: 3, overflow: "hidden", marginBottom: 3 }}>
                      <div style={{ width: `${u.chancePct}%`, height: "100%", background: u.chanceColor, transition: "width .6s" }} />
                    </div>
                    <div style={{ ...orb, fontSize: 11, fontWeight: 900, color: u.chanceColor }}>{u.chancePct}%</div>
                    <div style={{ fontSize: 7, color: u.chanceColor, ...mono, marginTop: 1 }}>{u.chanceLabel}</div>
                  </div>
                ))}
              </div>

              {/* Comparison table */}
              <div style={{ ...C({ padding: "13px", marginBottom: 12 }) }}>
                <div style={{ fontSize: 9, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 8 }}>📊 AT A GLANCE</div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 320 }}>
                    <thead><tr>
                      {["", UNIS[0].name, UNIS[1].name, UNIS[2].name, UNIS[3].name].map((h, i) => (
                        <th key={i} style={{ padding: "5px 4px", textAlign: i === 0 ? "left" : "center", color: i === 0 ? T.muted : [T.green, T.orange, T.blue, "#a855f7"][i - 1], ...mono, fontSize: 8, borderBottom: `1px solid ${T.border}`, fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {[
                        ["Location", "Khulna 🏠", "Khulna 🏠", "Dhaka ✈️", "Dhaka ✈️"],
                        ["From home", "10 min", "25 min", "5+ hrs", "5+ hrs"],
                        ["Monthly cost", "৳0 rent", "৳0 rent", "৳8–12k", "৳8–12k"],
                        ["Your chance", "90%", "82%", "45%", "70%"],
                        ["Apply when", "Sep 2026", "Dec 2026", "Apr 2027", "Jul 2026"],
                        ["Exam diff.", "Moderate", "Moderate", "Very Hard", "Hard"],
                        ["Prestige", "⭐⭐⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐"],
                      ].map(([l, ...v], ri) => (
                        <tr key={ri} style={{ background: ri % 2 === 0 ? T.bg2 : "transparent" }}>
                          <td style={{ padding: "6px 4px", color: T.muted, ...raj, fontSize: 10 }}>{l}</td>
                          {v.map((val, ci) => <td key={ci} style={{ padding: "6px 4px", textAlign: "center", color: [T.green, T.orange, T.blue, "#a855f7"][ci], ...mono, fontSize: 9 }}>{val}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Master plan */}
              <div style={{ ...C({ padding: "13px", background: "linear-gradient(135deg,#0a0800,#020408)", border: `2px solid ${T.gold}55` }) }}>
                <div style={{ fontSize: 9, color: T.gold, letterSpacing: 2, ...mono, marginBottom: 10 }}>👑 RUDRA'S MASTER PLAN — ACTION BY ACTION</div>
                {RUDRA_ANALYSIS.timelineAnalysis.map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < RUDRA_ANALYSIS.timelineAnalysis.length - 1 ? 10 : 0, padding: "9px 10px", background: T.bg2, borderRadius: 8, border: `1px solid ${t.priority.includes("🔴") ? T.red + "33" : t.priority.includes("🟡") ? "#ff880033" : t.priority.includes("🔵") ? T.blue + "33" : T.green + "33"}` }}>
                    <div style={{ flexShrink: 0, width: 8, height: 8, borderRadius: "50%", background: t.priority.includes("🔴") ? T.red : t.priority.includes("🟡") ? T.orange : t.priority.includes("🔵") ? T.blue : T.green, marginTop: 4, boxShadow: `0 0 6px ${t.priority.includes("🔴") ? T.red : t.priority.includes("🟡") ? T.orange : t.priority.includes("🔵") ? T.blue : T.green}66` }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 9, ...mono, color: T.gold, fontWeight: 700 }}>{t.period}</span>
                        <span style={{ fontSize: 8, ...mono, color: T.muted }}>{t.priority.replace(/[🔴🟡🟢🔵]/g, "")}</span>
                      </div>
                      <div style={{ fontSize: 12, color: T.bright, ...raj, fontWeight: 600, marginBottom: 4 }}>{t.focus}</div>
                      {t.actions.map((a, j) => <div key={j} style={{ fontSize: 10, color: T.muted, ...raj, marginBottom: 2 }}>• {a}</div>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ENHANCED ADMISSIONS (NEWS, TIPS, TRICKS, INTERVIEW, SOP, SCHOLARSHIP) ── */}
          {goalsSubTab === "enhanced" && (
            <div>
              <div style={{ ...C({ padding: "10px 14px", marginBottom: 12, background: "linear-gradient(135deg,#040a06,#060d12)", border: `2px solid ${T.cyan}44` }) }}>
                <div style={{ fontSize: 9, color: T.cyan, letterSpacing: 3, ...mono, marginBottom: 4 }}>🚀 ENHANCED ADMISSIONS PORTAL</div>
                <div style={{ fontSize: 11, color: T.text, ...raj }}>Live news, interview prep, SOP templates, scholarship guides — verified May 5, 2026</div>
              </div>
              <AdmissionsDashboard T={T} orb={orb} mono={mono} raj={raj} C={C} />
            </div>
          )}

          {/* ── UNIVERSITIES DETAIL ── */}
          {goalsSubTab === "unis" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
                {UNIS.map(u => (
                  <div key={u.id} onClick={() => { setActiveUni(u.id); setAdmTab("overview"); }} style={{ background: activeUni === u.id ? u.color + "18" : T.bg2, border: `2px solid ${activeUni === u.id ? u.color : u.color + "33"}`, borderRadius: 10, padding: "10px 8px", cursor: "pointer", textAlign: "center", transition: "all .2s", position: "relative" }}>
                    {(u.id === "kuet" || u.id === "ku") && <div style={{ position: "absolute", top: -6, right: 6, background: T.green, color: "#020408", fontSize: 6, padding: "2px 5px", borderRadius: 8, ...orb, fontWeight: 900 }}>HOME</div>}
                    <div style={{ fontSize: 20, marginBottom: 3 }}>{u.icon}</div>
                    <div style={{ ...orb, fontSize: 11, fontWeight: 700, color: activeUni === u.id ? T.bright : T.muted }}>{u.name}</div>
                    <div style={{ fontSize: 7, color: u.color, ...mono, marginTop: 2 }}>{u.status}</div>
                    <div style={{ marginTop: 5, height: 4, background: T.bg3, borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${u.chancePct}%`, height: "100%", background: u.chanceColor }} />
                    </div>
                    <div style={{ ...orb, fontSize: 10, color: u.chanceColor, marginTop: 2 }}>{u.chancePct}%</div>
                  </div>
                ))}
              </div>
              {uni && (
                <div key={uni.id}>
                  <div style={{ ...C({ padding: "14px", marginBottom: 10, border: `2px solid ${uni.color}44`, background: `linear-gradient(135deg,${uni.color}08,transparent)` }) }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                          <div style={{ ...orb, fontSize: 15, fontWeight: 900, color: T.bright }}>{uni.icon} {uni.name}</div>
                          {(uni.id === "kuet" || uni.id === "ku") && <div style={{ background: T.green + "22", border: `1px solid ${T.green}`, color: T.green, fontSize: 7, padding: "2px 7px", borderRadius: 8, ...mono, fontWeight: 700 }}>YOUR CITY</div>}
                        </div>
                        <div style={{ fontSize: 10, color: uni.color, ...mono }}>{uni.fullName}</div>
                        <div style={{ fontSize: 10, color: T.muted, marginTop: 3, ...mono }}>📍 {uni.location} · 🌐 {uni.site}</div>
                        <div style={{ fontSize: 10, color: T.muted, marginTop: 2, ...mono }}>📅 {uni.intake}</div>
                      </div>
                      <div style={{ textAlign: "center", flexShrink: 0, marginLeft: 10 }}>
                        <div style={{ width: 56, height: 56, borderRadius: 10, background: uni.color + "22", border: `2px solid ${uni.chanceColor}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `0 0 12px ${uni.chanceColor}33` }}>
                          <div style={{ ...orb, fontSize: 18, fontWeight: 900, color: uni.chanceColor, lineHeight: 1 }}>{uni.chancePct}%</div>
                          <div style={{ fontSize: 6, color: uni.chanceColor, ...mono, marginTop: 1, textAlign: "center", lineHeight: 1.2 }}>{uni.chanceLabel}</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: 10, padding: "8px 10px", background: uni.id === "kuet" || uni.id === "ku" ? "#001a00" : "#1a0500", border: `1px solid ${uni.id === "kuet" || uni.id === "ku" ? T.green + "44" : T.orange + "44"}`, borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: uni.id === "kuet" || uni.id === "ku" ? T.green : T.orange, ...raj, lineHeight: 1.6 }}>{uni.locationAdvantage}</div>
                    </div>
                    <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid ${T.border}` }}>
                      <div style={{ fontSize: 8, color: T.muted, ...mono, marginBottom: 6 }}>PROFILE MATCH</div>
                      {[["GPA", uni.profileScore.gpa, T.green], ["Thesis", uni.profileScore.thesis, T.blue], ["Exam", uni.profileScore.exam, "#a855f7"], ["Interview", uni.profileScore.interview, T.gold]].map(([l, v, c]) => (
                        <div key={l} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                          <span style={{ fontSize: 8, ...mono, color: T.muted, width: 50, flexShrink: 0 }}>{l}</span>
                          <div style={{ flex: 1, height: 4, background: T.bg2, borderRadius: 2, overflow: "hidden" }}>
                            <div style={{ width: `${v * 20}%`, height: "100%", background: v >= 4 ? T.green : v >= 3 ? "#ff8800" : T.red }} />
                          </div>
                          <span style={{ ...orb, fontSize: 9, color: v >= 4 ? T.green : v >= 3 ? "#ff8800" : T.red, width: 18, textAlign: "right" }}>{v}/5</span>
                        </div>
                      ))}
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                        <span style={{ fontSize: 10, ...raj, color: T.muted }}>Total score</span>
                        <span style={{ ...orb, fontSize: 14, fontWeight: 900, color: uni.color }}>{uni.profileScore.total}/{uni.profileScore.max}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", background: T.bg1, borderRadius: 10, border: `1px solid ${T.border}`, marginBottom: 10, overflow: "hidden" }}>
                    {[{ id: "overview", l: "📋" }, { id: "lifesavers", l: "🔑" }, { id: "exam", l: "📚" }, { id: "docs", l: "📁" }, { id: "email", l: "📧" }].map(s => (
                      <div key={s.id} onClick={() => setAdmTab(s.id)} style={{ flex: 1, padding: "9px 2px", textAlign: "center", cursor: "pointer", background: admTab === s.id ? uni.color + "22" : "transparent", borderBottom: admTab === s.id ? `2px solid ${uni.color}` : "2px solid transparent", fontSize: 16, color: admTab === s.id ? uni.color : T.muted, transition: "all .2s" }}>{s.l}</div>
                    ))}
                  </div>
                  {admTab === "overview" && (
                    <div>
                      {uni.khulnaAdvantage && <div style={{ background: "#001a00", border: `1px solid ${T.green}33`, borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
                        <div style={{ fontSize: 9, color: T.green, ...mono, marginBottom: 5 }}>🏠 KHULNA CONTEXT</div>
                        <div style={{ fontSize: 12, color: T.bright, ...raj, lineHeight: 1.8 }}>{uni.khulnaAdvantage}</div>
                      </div>}
                      <div style={{ ...C({ padding: "13px", marginBottom: 10 }) }}>
                        <div style={{ fontSize: 9, color: T.muted, ...mono, marginBottom: 10 }}>📋 STEP BY STEP PROCESS</div>
                        {uni.process.map((step, i) => (
                          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                            <div style={{ width: 22, height: 22, borderRadius: "50%", background: uni.color + "22", border: `1px solid ${uni.color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 9, color: uni.color, ...orb, fontWeight: 700 }}>{i + 1}</div>
                            <div style={{ fontSize: 11, color: T.text, ...raj, lineHeight: 1.6, paddingTop: 2 }}>{step}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ background: uni.color + "08", border: `1px solid ${uni.color}44`, borderRadius: 10, padding: 13 }}>
                        <div style={{ fontSize: 9, color: uni.color, ...mono, marginBottom: 6 }}>🏆 VERDICT</div>
                        <div style={{ fontSize: 12, color: T.bright, ...raj, lineHeight: 1.8 }}>{uni.verdict}</div>
                      </div>
                    </div>
                  )}
                  {admTab === "lifesavers" && (
                    <div style={{ ...C({ padding: "13px", border: `1px solid ${T.gold}44`, background: "linear-gradient(135deg,#0a0800,transparent)" }) }}>
                      <div style={{ fontSize: 9, color: T.gold, ...mono, marginBottom: 4 }}>🔑 LIFE-SAVER INSIGHTS</div>
                      <div style={{ fontSize: 10, color: T.muted, ...raj, marginBottom: 12 }}>Things most applicants never figure out. These are yours.</div>
                      {(uni.lifeSavers || []).map((tip, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, padding: "10px 12px", background: T.bg2, borderRadius: 8, border: `1px solid ${T.gold}22` }}>
                          <div style={{ width: 22, height: 22, borderRadius: "50%", background: T.gold + "22", border: `1px solid ${T.gold}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 9, color: T.gold, ...orb }}>{i + 1}</div>
                          <div style={{ fontSize: 11, color: T.bright, ...raj, lineHeight: 1.7 }}>{tip}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {admTab === "exam" && (
                    <div>
                      <div style={{ ...C({ padding: "13px", marginBottom: 10 }) }}>
                        <div style={{ fontSize: 9, color: T.muted, ...mono, marginBottom: 10 }}>📚 EXAM TOPICS — WEIGHTED</div>
                        {(uni.examTopics || []).map((t, i) => (
                          <div key={i} onClick={() => setExpandedExam(expandedExam === `${uni.id}-${i}` ? null : `${uni.id}-${i}`)} style={{ background: T.bg2, borderRadius: 8, padding: "10px 12px", marginBottom: 6, cursor: "pointer", border: `1px solid ${expandedExam === `${uni.id}-${i}` ? uni.color + "55" : T.border}` }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: 11, color: T.bright, ...raj, flex: 1 }}>{t.t}</span>
                              <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                                <div style={{ width: 36, height: 4, background: T.bg3, borderRadius: 2, overflow: "hidden" }}>
                                  <div style={{ width: `${t.pct}%`, height: "100%", background: t.color || uni.color }} />
                                </div>
                                <span style={{ fontSize: 8, color: t.color || uni.color, ...mono }}>{t.pct}%</span>
                              </div>
                            </div>
                            {expandedExam === `${uni.id}-${i}` && <div style={{ fontSize: 11, color: uni.color, marginTop: 8, paddingTop: 8, borderTop: `1px solid ${T.border}`, ...raj, lineHeight: 1.6 }}>💡 {t.tip}</div>}
                          </div>
                        ))}
                      </div>
                      <div style={{ ...C({ padding: "12px", border: `1px solid ${uni.color}22` }) }}>
                        <div style={{ fontSize: 9, color: uni.color, ...mono, marginBottom: 8 }}>📖 PREP RESOURCES</div>
                        {(uni.prepResources || []).map((r, i) => (
                          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                            <span style={{ color: uni.color, flexShrink: 0 }}>→</span>
                            <div style={{ fontSize: 11, color: T.text, ...raj, lineHeight: 1.5 }}>{r}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {admTab === "docs" && (
                    <div style={{ ...C({ padding: "13px" }) }}>
                      <div style={{ fontSize: 9, color: T.muted, ...mono, marginBottom: 10 }}>📁 DOCUMENTS CHECKLIST</div>
                      {(uni.docs || []).map((doc, i) => (
                        <div key={i} onClick={() => setAdmCheckDone(p => ({ ...p, [`${uni.id}-${i}`]: !p[`${uni.id}-${i}`] }))} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 10px", marginBottom: 5, background: T.bg2, borderRadius: 7, border: `1px solid ${admCheckDone[`${uni.id}-${i}`] ? T.green + "44" : T.border}`, cursor: "pointer" }}>
                          <div style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${admCheckDone[`${uni.id}-${i}`] ? T.green : T.border}`, background: admCheckDone[`${uni.id}-${i}`] ? T.green + "33" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {admCheckDone[`${uni.id}-${i}`] && <span style={{ fontSize: 10, color: T.green, fontWeight: 900 }}>✓</span>}
                          </div>
                          <span style={{ fontSize: 11, color: admCheckDone[`${uni.id}-${i}`] ? T.muted : T.text, ...raj, textDecoration: admCheckDone[`${uni.id}-${i}`] ? "line-through" : "none" }}>{doc}</span>
                        </div>
                      ))}
                      <div style={{ marginTop: 10, padding: "10px 12px", background: "#0a0a00", border: `1px solid ${T.gold}33`, borderRadius: 8 }}>
                        <div style={{ fontSize: 9, color: T.gold, ...mono, marginBottom: 4 }}>⚡ KHULNA TIP</div>
                        <div style={{ fontSize: 11, color: T.text, ...raj, lineHeight: 1.7 }}>Attested copies: any notary in Khulna city. Sonali Bank KDA branch for bank drafts. Do ALL attestation in one trip — bring originals + 5 extra copies each.</div>
                      </div>
                    </div>
                  )}
                  {admTab === "email" && (
                    <div style={{ ...C({ padding: "13px", border: `1px solid ${uni.color}44` }) }}>
                      <div style={{ fontSize: 9, color: uni.color, ...mono, marginBottom: 4 }}>📧 PROFESSOR EMAIL TEMPLATE</div>
                      <div style={{ fontSize: 10, color: T.muted, ...raj, marginBottom: 10 }}>Send to 2–3 professors at {uni.name} whose research overlaps ML/AI/optimization.</div>
                      <div style={{ background: "#020408", border: `1px solid ${uni.color}33`, borderRadius: 8, padding: "12px 14px", ...mono, fontSize: 10, color: T.text, lineHeight: 1.8, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                        {(uni.emailTemplate || "").replace(/\\n/g, "\n")}
                      </div>
                      <div style={{ marginTop: 10, padding: "8px 10px", background: T.gold + "11", border: `1px solid ${T.gold}33`, borderRadius: 7 }}>
                        <div style={{ fontSize: 9, color: T.gold, ...mono, marginBottom: 3 }}>🔑 WHY THIS MATTERS</div>
                        <div style={{ fontSize: 11, color: T.text, ...raj, lineHeight: 1.6 }}>Send this NOW — before any circular opens. A professor who knows your name = dramatically better viva outcome.</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── PERSONAL ANALYSIS ── */}
          {goalsSubTab === "analysis" && (
            <div>
              {/* Strengths */}
              <div style={{ ...C({ padding: "13px", marginBottom: 12, border: `1px solid ${T.green}33` }) }}>
                <div style={{ fontSize: 9, color: T.green, letterSpacing: 2, ...mono, marginBottom: 10 }}>💪 YOUR STRENGTHS AS AN APPLICANT</div>
                {RUDRA_ANALYSIS.strengths.map((s, i) => (
                  <div key={i} style={{ marginBottom: 10, padding: "10px 12px", background: T.bg2, borderRadius: 8, border: `1px solid ${T.green}22` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: T.bright, ...raj, fontWeight: 600 }}>{s.area}</span>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 8, background: s.impact === "HIGH" ? T.green + "22" : s.impact === "TRANSFORMATIVE" ? "#ff006e22" : T.gold + "22", color: s.impact === "HIGH" ? T.green : s.impact === "TRANSFORMATIVE" ? "#ff006e" : T.gold, ...mono }}>{s.impact}</span>
                        <span style={{ ...orb, fontSize: 10, color: T.green }}>{s.score}%</span>
                      </div>
                    </div>
                    <div style={{ height: 4, background: T.bg3, borderRadius: 2, overflow: "hidden", marginBottom: 6 }}>
                      <div style={{ width: `${s.score}%`, height: "100%", background: T.green, boxShadow: `0 0 6px ${T.green}44` }} />
                    </div>
                    <div style={{ fontSize: 11, color: T.muted, ...raj, lineHeight: 1.6 }}>{s.detail}</div>
                  </div>
                ))}
              </div>
              {/* Weaknesses */}
              <div style={{ ...C({ padding: "13px", marginBottom: 12, border: `1px solid ${T.orange}33` }) }}>
                <div style={{ fontSize: 9, color: T.orange, letterSpacing: 2, ...mono, marginBottom: 10 }}>⚠️ GAPS TO ADDRESS</div>
                {RUDRA_ANALYSIS.weaknesses.map((w, i) => (
                  <div key={i} style={{ marginBottom: 10, padding: "10px 12px", background: T.bg2, borderRadius: 8, border: `1px solid ${T.orange}22` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: T.bright, ...raj, fontWeight: 600 }}>{w.area}</span>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 8, background: w.impact === "HIGH" ? T.red + "22" : T.gold + "22", color: w.impact === "HIGH" ? T.red : T.gold, ...mono }}>{w.impact}</span>
                        <span style={{ ...orb, fontSize: 10, color: T.orange }}>{w.score}%</span>
                      </div>
                    </div>
                    <div style={{ height: 4, background: T.bg3, borderRadius: 2, overflow: "hidden", marginBottom: 6 }}>
                      <div style={{ width: `${w.score}%`, height: "100%", background: T.orange }} />
                    </div>
                    <div style={{ fontSize: 11, color: T.muted, ...raj, lineHeight: 1.6 }}>{w.detail}</div>
                  </div>
                ))}
              </div>
              {/* Competitive edge */}
              <div style={{ ...C({ padding: "13px", border: `1px solid ${T.gold}44` }) }}>
                <div style={{ fontSize: 9, color: T.gold, letterSpacing: 2, ...mono, marginBottom: 10 }}>⚡ YOUR COMPETITIVE EDGE — WHAT OTHERS DON'T HAVE</div>
                {RUDRA_ANALYSIS.competitiveEdge.map((e, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, padding: "8px 10px", background: T.gold + "0d", borderRadius: 7, border: `1px solid ${T.gold}22` }}>
                    <span style={{ color: T.gold, flexShrink: 0, fontSize: 12 }}>⚡</span>
                    <div style={{ fontSize: 11, color: T.bright, ...raj, lineHeight: 1.6 }}>{e}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PROFESSOR CRM ── */}
          {goalsSubTab === "profs" && (
            <div>
              <div style={{ ...C({ padding: "13px", marginBottom: 12, background: "linear-gradient(135deg,#020408,#040814)", border: `1px solid ${T.blue}44` }) }}>
                <div style={{ fontSize: 9, color: T.blue, letterSpacing: 2, ...mono, marginBottom: 6 }}>📧 PROFESSOR EMAIL TRACKER</div>
                <div style={{ fontSize: 11, color: T.text, ...raj, lineHeight: 1.7, marginBottom: 10 }}>Email KUET professors BEFORE the circular opens. A professor who already knows your name gets curious when they see your application. That curiosity = interview advantage.</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[{ l: "Emailed", v: Object.values(profEmailDone).filter(v => v === "emailed" || v === "replied").length, c: T.blue }, { l: "Replied", v: Object.values(profEmailDone).filter(v => v === "replied").length, c: T.green }].map((s, i) => (
                    <div key={i} style={{ background: s.c + "11", border: `1px solid ${s.c}22`, borderRadius: 8, padding: "8px", textAlign: "center" }}>
                      <div style={{ ...orb, fontSize: 18, fontWeight: 900, color: s.c }}>{s.v}</div>
                      <div style={{ fontSize: 8, color: T.muted, ...mono, marginTop: 2 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* KUET professors */}
              <div style={{ ...C({ padding: "13px", marginBottom: 12 }) }}>
                <div style={{ fontSize: 9, color: T.green, letterSpacing: 2, ...mono, marginBottom: 10 }}>🥇 KUET CSE PROFESSORS TO EMAIL</div>
                {KUET_PROFS.map((p, i) => {
                  const status = profEmailDone[p.email] || "pending";
                  return (
                    <div key={i} style={{ ...C({ padding: "12px", marginBottom: 8, border: `1px solid ${status === "replied" ? T.green + "55" : status === "emailed" ? T.blue + "44" : T.border}` }) }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, color: T.bright, fontWeight: 600, ...raj }}>{p.name}</div>
                          <div style={{ fontSize: 9, color: T.muted, ...mono, marginTop: 2 }}>{p.dept} · {p.email}</div>
                        </div>
                        <div style={{ display: "flex", gap: 5, flexShrink: 0, marginLeft: 8 }}>
                          <button onClick={() => setProfEmailDone(prev => ({ ...prev, [p.email]: "emailed" }))} style={{ padding: "4px 8px", background: status === "emailed" || status === "replied" ? T.blue + "33" : "transparent", border: `1px solid ${T.blue}44`, color: T.blue, borderRadius: 5, fontSize: 8, ...mono, cursor: "pointer" }}>✉ Sent</button>
                          <button onClick={() => setProfEmailDone(prev => ({ ...prev, [p.email]: "replied" }))} style={{ padding: "4px 8px", background: status === "replied" ? T.green + "33" : "transparent", border: `1px solid ${T.green}44`, color: T.green, borderRadius: 5, fontSize: 8, ...mono, cursor: "pointer" }}>✓ Reply</button>
                        </div>
                      </div>
                      <div style={{ fontSize: 10, color: T.muted, ...raj, marginBottom: 4 }}><strong style={{ color: T.blue }}>Research:</strong> {p.area}</div>
                      <div style={{ fontSize: 10, color: T.gold, ...raj, fontStyle: "italic" }}>{p.why}</div>
                    </div>
                  );
                })}
              </div>
              {/* SOP tips */}
              <div style={{ ...C({ padding: "13px", border: `1px solid ${T.gold}33` }) }}>
                <div style={{ fontSize: 9, color: T.gold, letterSpacing: 2, ...mono, marginBottom: 8 }}>📝 SOP / STATEMENT OF PURPOSE TIPS</div>
                {["Open with: 'I scored 32/100 in GST. I graduated 3.95 — top of my batch. This is the story of what I did in between.' — This hooks any committee.",
                  "Your National Debate Championship 2018 should be in paragraph 1. It signals communication skill — rare in CS applicants.",
                  "Explicitly name-drop Mr. Riaz Mohammed's CRO publications. 'My research builds on Dr. Mohammed's published work in...'",
                  "Mention that KUET is your hometown university — shows commitment to stay and research, not just collect a degree.",
                  "Paragraph on future: 'MSc → 1 publication → DAAD Germany or Commonwealth scholarship.' Shows you have thought beyond the MSc.",
                  "One specific paragraph on CRO+SHAP: what it does, why it matters for cancer, what makes it novel. Show you actually understand your own work."].map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: T.gold + "22", border: `1px solid ${T.gold}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 8, color: T.gold, ...orb }}>{i + 1}</div>
                    <div style={{ fontSize: 11, color: T.text, ...raj, lineHeight: 1.6 }}>{t}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SCHOLARSHIPS ── */}
          {goalsSubTab === "scholarships" && (
            <div>
              <div style={{ ...C({ padding: "13px", marginBottom: 12, background: "linear-gradient(135deg,#020408,#0a0514)", border: `2px solid ${"#a855f7"}55` }) }}>
                <div style={{ fontSize: 9, color: "#a855f7", letterSpacing: 2, ...mono, marginBottom: 6 }}>✈️ SCHOLARSHIP READINESS — YOUR ROADMAP ABROAD</div>
                <div style={{ fontSize: 12, color: T.bright, ...raj, lineHeight: 1.8 }}>The GST 32 to NUBTK to <strong style={{ color: T.green }}>3.95 Top of Batch</strong> to CRO+SHAP thesis to MSc to <strong style={{ color: "#a855f7" }}>DAAD / Commonwealth / Vanier</strong>. The arc is real. Each step is documented.</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginTop: 10 }}>
                  {Object.entries(RUDRA_ANALYSIS.scholarshipReadiness).map(([key, s]) => (
                    <div key={key} style={{ background: "#a855f711", border: "1px solid #a855f722", borderRadius: 8, padding: "7px 4px", textAlign: "center" }}>
                      <div style={{ ...orb, fontSize: 11, fontWeight: 900, color: "#a855f7" }}>{s.score}%</div>
                      <div style={{ fontSize: 6, color: T.muted, ...mono, marginTop: 2, lineHeight: 1.3 }}>{s.name.split(" ")[0]}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What's missing */}
              <div style={{ ...C({ padding: "13px", marginBottom: 12, border: `1px solid ${T.orange}33` }) }}>
                <div style={{ fontSize: 9, color: T.orange, letterSpacing: 2, ...mono, marginBottom: 10 }}>🎯 WHAT YOU STILL NEED</div>
                {[
                  { item: "IELTS 6.5+", status: "NOT DONE", c: T.red, action: "Register Oct 2026. Study 30 min daily from July." },
                  { item: "1 Published Paper", status: "IN PROGRESS", c: T.orange, action: "CRO+SHAP paper → target Briefings in Bioinformatics or IEEE Access." },
                  { item: "MSc Degree (KUET)", status: "PLANNED", c: T.blue, action: "KUET Sep 2026 — near-certain with your profile." },
                  { item: "3 Reference Letters", status: "PLANNED", c: T.gold, action: "Mr. Riaz Mohammed (supervisor) + 2 KUET professors. Build these relationships NOW." },
                  { item: "Research Portfolio", status: "IN PROGRESS", c: T.orange, action: "GitHub repo with thesis code + published paper = world-class portfolio." },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, padding: "9px 10px", background: T.bg2, borderRadius: 8, border: `1px solid ${r.c}22` }}>
                    <div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 3 }}>
                        <span style={{ fontSize: 12, color: T.bright, ...raj, fontWeight: 600 }}>{r.item}</span>
                        <span style={{ fontSize: 7, padding: "2px 6px", borderRadius: 8, background: r.c + "22", color: r.c, ...mono }}>{r.status}</span>
                      </div>
                      <div style={{ fontSize: 11, color: T.muted, ...raj, lineHeight: 1.5 }}>{r.action}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Programs */}
              {SCHOLARSHIP_PROGRAMS.map((prog, i) => (
                <div key={i} style={{ ...C({ padding: "13px", marginBottom: 10, border: `1px solid ${"#a855f7"}22` }) }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: T.bright, fontWeight: 700, ...raj }}>{prog.name}</div>
                      <div style={{ fontSize: 10, color: "#a855f7", ...mono, marginTop: 1 }}>{prog.country} · {prog.amount}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
                      <div style={{ fontSize: 8, color: T.muted, ...mono }}>IELTS {prog.ielts}+</div>
                      <div style={{ fontSize: 8, color: T.muted, ...mono }}>Due: {prog.deadline}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: T.text, ...raj, lineHeight: 1.6, marginBottom: 8 }}>{prog.desc}</div>
                  <div style={{ fontSize: 9, color: "#a855f7", ...mono, marginBottom: 6 }}>YOUR STEPS:</div>
                  {prog.steps.map((s, j) => (
                    <div key={j} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                      <span style={{ color: "#a855f7", fontSize: 10, flexShrink: 0 }}>→</span>
                      <div style={{ fontSize: 10, color: T.muted, ...raj, lineHeight: 1.5 }}>{s}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* ── TIMELINE ── */}
          {goalsSubTab === "timeline" && (
            <div>
              <div style={{ ...C({ padding: "13px", marginBottom: 12, background: "linear-gradient(135deg,#020d08,#020408)", border: `1px solid ${T.green}44` }) }}>
                <div style={{ fontSize: 9, color: T.green, letterSpacing: 2, ...mono, marginBottom: 8 }}>📅 COMPLETE TIMELINE — NOW TO 2029</div>
                <div style={{ fontSize: 11, color: T.text, ...raj, lineHeight: 1.8 }}>This is the full path. Every step is a prerequisite for the next. Miss one and you delay the dream. Complete one and you accelerate everything after it.</div>
              </div>
              {RUDRA_ANALYSIS.timelineAnalysis.map((t, i) => {
                const colors = { "🔴": T.red, "🟡": T.orange, "🟢": T.green, "🔵": T.blue };
                const col = colors[t.priority[0]] || T.green;
                return (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div style={{ width: 14, height: 14, borderRadius: "50%", background: col, boxShadow: `0 0 8px ${col}88`, flexShrink: 0 }} />
                      {i < RUDRA_ANALYSIS.timelineAnalysis.length - 1 && <div style={{ width: 2, flex: 1, background: `linear-gradient(${col},${col}22)`, marginTop: 4, minHeight: 40 }} />}
                    </div>
                    <div style={{ flex: 1, paddingBottom: 4 }}>
                      <div style={{ ...orb, fontSize: 10, fontWeight: 700, color: col, marginBottom: 3 }}>{t.period}</div>
                      <div style={{ fontSize: 13, color: T.bright, ...raj, fontWeight: 700, marginBottom: 5 }}>{t.focus}</div>
                      <div style={{ padding: "8px 10px", background: col + "0d", border: `1px solid ${col}22`, borderRadius: 8 }}>
                        {t.actions.map((a, j) => (
                          <div key={j} style={{ display: "flex", gap: 6, marginBottom: j < t.actions.length - 1 ? 5 : 0 }}>
                            <span style={{ color: col, flexShrink: 0, fontSize: 10 }}>•</span>
                            <div style={{ fontSize: 11, color: T.text, ...raj, lineHeight: 1.5 }}>{a}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div style={{ ...C({ padding: "13px", background: "linear-gradient(135deg,#0a0800,#040814)", border: `2px solid ${T.gold}55`, textAlign: "center" }) }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🏆</div>
                <div style={{ ...orb, fontSize: 14, fontWeight: 900, color: T.gold, marginBottom: 6 }}>2029 TARGET: FULLY FUNDED ABROAD</div>
                <div style={{ fontSize: 12, color: T.text, ...raj, lineHeight: 1.8 }}>DAAD Germany or Commonwealth UK. <br />3.95 GPA → KUET MSc → 1 Publication → IELTS 6.5 → National Debate Champion → Abroad.<br /><span style={{ color: T.green, fontWeight: 700 }}>The comeback arc is complete.</span></div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default Goals;
