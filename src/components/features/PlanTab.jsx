import { CheckCircle, ArrowRight } from "lucide-react";
import ThesisChapterProgress from "./ThesisChapterProgress";
import ResearchMilestoneTracker from "./ResearchMilestoneTracker";
import CSExamAlgorithmVisualizer from "./CSExamAlgorithmVisualizer";
import CodingProblemTracker from "./CodingProblemTracker";

const PlanTab = ({ activeWeek, setActiveWeek, tDone, togT, taskNotes, setTaskNotes, openNote, setOpenNote, T, orb, mono, raj, C, WEEKS, pc, weekPct, Ring }) => {
  const w = WEEKS.find(x => x.week === activeWeek);
  const col = pc(w.phase);
  const prog = weekPct(w.week);
  const Sect = ({ title, emoji, color: sc, items, cat }) => (
    <div style={{ ...C({ padding: "14px", marginBottom: 10, border: `1px solid ${sc}22` }) }}>
      <div style={{ fontSize: 9, color: sc, letterSpacing: 2, fontWeight: 700, marginBottom: 12, ...mono }}>{emoji} {title}</div>
      {items.map((task, i) => {
        const done = tDone(w.week, cat, i);
        const nk = `${w.week}-${cat}-${i}`;
        return (
          <div key={i} style={{ marginBottom: i < items.length - 1 ? 10 : 0 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div onClick={() => togT(w.week, cat, i)} style={{ width: 20, height: 20, border: `1.5px solid ${done ? sc : sc + "44"}`, borderRadius: 4, flexShrink: 0, marginTop: 2, cursor: "pointer", background: done ? sc + "33" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: done ? `0 0 8px ${sc}44` : "none", transition: "all .2s" }}>
                {done && <span style={{ fontSize: 11, color: sc, fontWeight: 900 }}>✓</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: done ? "#2a4a3a" : T.text, lineHeight: 1.6, textDecoration: done ? "line-through" : "none", ...raj }}>
                  {task.startsWith("??? ") && <CheckCircle size={12} style={{ display: "inline", marginRight: 3, verticalAlign: "middle", color: "#ffd700" }} />}
                  {task.startsWith("?? ") && !task.startsWith("??? ") && <CheckCircle size={12} style={{ display: "inline", marginRight: 3, verticalAlign: "middle", color: sc }} />}
                  {task.startsWith("? ") && !task.startsWith("?? ") && <ArrowRight size={12} style={{ display: "inline", marginRight: 3, verticalAlign: "middle", color: T.blue }} />}
                  {task.replace(/^[?\s]{1,3}/, "").replace(/\uFFFD/g, "-")}
                </div>
                <button onClick={() => setOpenNote(openNote === nk ? null : nk)} style={{ fontSize: 10, color: taskNotes[nk] ? T.gold : T.muted, background: "transparent", border: "none", cursor: "pointer", padding: "2px 0", ...mono }}>
                  {taskNotes[nk] ? "📝 note" : "+ note"}
                </button>
                {openNote === nk && (
                  <textarea value={taskNotes[nk] || ""} onChange={e => setTaskNotes(p => ({ ...p, [nk]: e.target.value }))}
                    placeholder="Notes, blockers, wins..."
                    style={{ width: "100%", marginTop: 5, background: T.bg2, border: `1px solid ${sc}33`, borderRadius: 6, color: T.text, fontSize: 11, padding: 8, resize: "vertical", ...mono, minHeight: 50, boxSizing: "border-box" }} />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
  return (
    <div style={{}}>
      <div style={{ padding: "10px 16px", background: T.bg1, borderBottom: `1px solid ${T.border}`, overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 4, minWidth: "max-content" }}>
          {WEEKS.map(wk => {
            const wc = pc(wk.phase), ia = wk.week === activeWeek, wp = weekPct(wk.week);
            return (
              <div key={wk.week} onClick={() => setActiveWeek(wk.week)} style={{ padding: "5px 9px", borderRadius: 7, border: ia ? `1.5px solid ${wc}` : "1.5px solid transparent", background: ia ? wc + "22" : wp === 100 ? wc + "11" : "transparent", color: ia ? wc : wp > 0 ? wc + "88" : T.muted, fontSize: 11, cursor: "pointer", ...orb, fontWeight: ia ? 700 : 400, textAlign: "center", minWidth: 34, transition: "all .2s" }}>
                <div>{wk.week}</div>{wp > 0 && <div style={{ fontSize: 7, marginTop: 1 }}>{wp}%</div>}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 8, color: col, letterSpacing: 3, ...mono, marginBottom: 4 }}>PHASE {w.phase} · {["FOUNDATION", "IMPLEMENTATION", "EXPERIMENTS", "WRITING"][w.phase - 1]}</div>
            <div style={{ ...orb, fontSize: 22, fontWeight: 900, color: T.bright }}>WEEK {w.week}</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 2, ...raj }}>{w.dates.replace(/\uFFFD/g, "-")}</div>
          </div>
          <Ring pct={prog} size={58} stroke={5} color={col} label={`${prog}%`} />
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          {[{ l: "THESIS", t: "2h", c: T.green }, { l: "CS PREP", t: "45m", c: T.blue }, { l: "IELTS", t: "15m", c: T.gold }, { l: "ADMIT", t: "∞", c: "#a855f7" }].map(x => (
            <div key={x.l} style={{ flex: 1, background: x.c + "11", border: `1px solid ${x.c}22`, borderRadius: 8, padding: "7px 4px", textAlign: "center" }}>
              <div style={{ fontSize: 8, color: x.c, letterSpacing: 1, ...mono }}>{x.l}</div>
              <div style={{ ...orb, fontSize: 13, fontWeight: 700, color: T.bright }}>{x.t}</div>
            </div>
          ))}
        </div>
        <Sect title="THESIS WORK" emoji="🧪" color={T.green} items={w.thesis} cat="thesis" />
        <Sect title="CS EXAM PREP" emoji="💻" color={T.blue} items={w.csprep} cat="csprep" />
        <Sect title="IELTS PREP" emoji="🌍" color={T.gold} items={w.ielts} cat="ielts" />
        <Sect title="ADMISSION ACTIONS" emoji="🏛️" color="#a855f7" items={w.admission} cat="admission" />
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <div style={{ flex: 1, background: "#1a050a", border: `1px solid ${T.red}33`, borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 9, color: T.red, letterSpacing: 2, marginBottom: 5, ...mono }}>⚠️ BLOCKER</div>
            <div style={{ fontSize: 11, color: "#ffaaaa", lineHeight: 1.7, ...raj }}>{w.blocker.replace(/\uFFFD/g, "-")}</div>
          </div>
          <div style={{ flex: 1, background: col + "08", border: `1px solid ${col}33`, borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 9, color: col, letterSpacing: 2, marginBottom: 5, ...mono }}>🏁 MILESTONE</div>
            <div style={{ fontSize: 11, color: T.text, lineHeight: 1.7, ...raj }}>{w.milestone.replace(/\uFFFD/g, "-")}</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={() => activeWeek > 1 && setActiveWeek(a => a - 1)} disabled={activeWeek === 1} style={{ padding: "9px 18px", borderRadius: 8, border: `1px solid ${T.border}`, background: activeWeek === 1 ? "transparent" : T.bg2, color: activeWeek === 1 ? T.muted : T.bright, fontSize: 11, ...mono, cursor: activeWeek === 1 ? "not-allowed" : "pointer" }}>← PREV</button>
          <span style={{ fontSize: 11, color: T.muted, alignSelf: "center", ...orb }}>{activeWeek}/15</span>
          <button onClick={() => activeWeek < 15 && setActiveWeek(a => a + 1)} disabled={activeWeek === 15} style={{ padding: "9px 18px", borderRadius: 8, border: `1px solid ${col}55`, background: col + "22", color: col, fontSize: 11, ...mono, cursor: activeWeek === 15 ? "not-allowed" : "pointer" }}>NEXT →</button>
        </div>
      </div>

      <ThesisChapterProgress T={T} C={C} mono={mono} orb={orb} raj={raj} />
      <ResearchMilestoneTracker />
      <CSExamAlgorithmVisualizer />
      <CodingProblemTracker />
    </div>
  );
};

export default PlanTab;
