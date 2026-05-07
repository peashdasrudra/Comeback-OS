import { motion } from "framer-motion";
import { useState } from "react";
import { Trophy, TrendingUp, BarChart3, Zap } from "lucide-react";

const prs = [
  { exercise: "Bench Press", current: 60, previous: 45, unit: "kg", color: "#ef4444", date: "May 18", isNew: true },
  { exercise: "Squat", current: 80, previous: 60, unit: "kg", color: "#3b82f6", date: "May 16", isNew: true },
  { exercise: "Deadlift", current: 100, previous: 80, unit: "kg", color: "#8b5cf6", date: "May 12", isNew: false },
  { exercise: "Overhead Press", current: 40, previous: 30, unit: "kg", color: "#f59e0b", date: "May 14", isNew: true },
  { exercise: "Barbell Row", current: 70, previous: 55, unit: "kg", color: "#10b981", date: "May 10", isNew: false },
  { exercise: "Pull-ups", current: 12, previous: 8, unit: "reps", color: "#ec4899", date: "May 20", isNew: true },
];

const WorkoutPRTracker = ({ T, C, mono, orb, raj }) => {
  const [selected, setSelected] = useState(null);
  const maxVal = Math.max(...prs.map(p => Math.max(p.current, p.previous))) * 1.2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(255,136,0,0.3)" }}
      className="card-glow"
      style={{ ...C({ padding: "14px", marginBottom: 12 }), background: "linear-gradient(135deg, rgba(255,136,0,0.08), rgba(255,0,110,0.08))", backdropFilter: "blur(20px)", border: `1px solid ${T.orange}44` }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 9, color: T.orange, letterSpacing: 2, ...mono }}>🏆 WORKOUT PR TRACKER</div>
        <BarChart3 size={16} color={T.orange} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 12 }}>
        <div style={{ textAlign: "center", padding: "8px 4px", background: T.bg2, borderRadius: 8 }}>
          <Trophy size={14} color={T.gold} style={{ marginBottom: 4 }} />
          <div style={{ fontSize: 7, color: T.muted, ...mono }}>TOTAL PRS</div>
          <div style={{ ...orb, fontSize: 16, fontWeight: 900, color: T.gold }}>{prs.filter(p => p.isNew).length}</div>
        </div>
        <div style={{ textAlign: "center", padding: "8px 4px", background: T.bg2, borderRadius: 8 }}>
          <TrendingUp size={14} color={T.green} style={{ marginBottom: 4 }} />
          <div style={{ fontSize: 7, color: T.muted, ...mono }}>BEST GAIN</div>
          <div style={{ ...orb, fontSize: 12, fontWeight: 700, color: T.green }}>+33%</div>
        </div>
        <div style={{ textAlign: "center", padding: "8px 4px", background: T.bg2, borderRadius: 8 }}>
          <Zap size={14} color={T.pink} style={{ marginBottom: 4 }} />
          <div style={{ fontSize: 7, color: T.muted, ...mono }}>NEW PRS</div>
          <div style={{ ...orb, fontSize: 16, fontWeight: 900, color: T.pink }}>{prs.filter(p => p.isNew).length}</div>
        </div>
      </div>

      <div style={{ background: T.bg2, borderRadius: 12, padding: 12 }}>
        <div style={{ fontSize: 8, color: T.muted, ...mono, marginBottom: 10 }}>EXERCISE → PERSONAL RECORDS</div>
        {prs.map((pr, i) => {
          const currentHeight = (pr.current / maxVal) * 100;
          const prevHeight = (pr.previous / maxVal) * 100;
          return (
            <motion.div key={pr.exercise} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{ marginBottom: 12, cursor: "pointer" }}
              onClick={() => setSelected(selected === i ? null : i)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 11, color: T.text, ...raj, fontWeight: 600 }}>{pr.exercise}</div>
                  <div style={{ fontSize: 8, color: T.muted, ...mono }}>PR: {pr.date}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <motion.div animate={pr.isNew ? { scale: [1, 1.15, 1] } : {}} transition={{ duration: 1.5, repeat: pr.isNew ? Infinity : 0 }}
                    style={{ ...orb, fontSize: 18, fontWeight: 900, color: pr.color }}>
                    {pr.current}
                    {pr.isNew && <span style={{ fontSize: 8, color: T.green, ...mono, marginLeft: 4 }}>NEW!</span>}
                  </motion.div>
                  <div style={{ fontSize: 7, color: T.muted, ...mono }}>{pr.unit}</div>
                </div>
              </div>
              {/* Bar Chart */}
              <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 40, marginBottom: 4 }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <span style={{ fontSize: 6, color: T.muted, ...mono }}>PREV</span>
                  <motion.div initial={{ height: 0 }} animate={{ height: `${prevHeight}%` }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    style={{ width: "100%", background: `${pr.color}44`, borderRadius: 4, minHeight: 4 }} />
                  <span style={{ fontSize: 7, color: pr.color, ...mono }}>{pr.previous}</span>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <span style={{ fontSize: 6, color: T.muted, ...mono }}>CURRENT</span>
                  <motion.div initial={{ height: 0 }} animate={{ height: `${currentHeight}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    style={{ width: "100%", background: pr.isNew ? `linear-gradient(180deg, ${pr.color}, ${pr.color}88)` : pr.color,
                      borderRadius: 4, minHeight: 4,
                      boxShadow: pr.isNew ? `0 0 12px ${pr.color}88` : "none" }}
                  />
                  <span style={{ fontSize: 7, color: pr.color, ...orb, fontWeight: 700 }}>{pr.current}</span>
                </div>
              </div>
              {pr.isNew && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
                  style={{ fontSize: 7, color: T.green, ...mono, textAlign: "center" }}>
                  🎉 New PR! +{pr.current - pr.previous} {pr.unit}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default WorkoutPRTracker;
