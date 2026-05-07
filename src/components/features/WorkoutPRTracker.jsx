import { motion } from "framer-motion";
import { useState } from "react";
import { Trophy, TrendingUp, BarChart3 } from "lucide-react";

const exercises = [
  { name: "Wall Push-ups", current: 25, previous: 10, unit: "reps", color: "#10b981", icon: "🔥" },
  { name: "Incline Push-ups", current: 15, previous: 8, unit: "reps", color: "#3b82f6", icon: "💪" },
  { name: "Knee Push-ups", current: 12, previous: 6, unit: "reps", color: "#8b5cf6", icon: "💥" },
  { name: "Plank Hold", current: 45, previous: 15, unit: "seconds", color: "#f59e0b", icon: "⏱️" },
  { name: "Box Squats", current: 20, previous: 10, unit: "reps", color: "#ef4444", icon: "🦵" },
  { name: "Glute Bridges", current: 25, previous: 12, unit: "reps", color: "#ec4899", icon: "🍑" }
];

const WorkoutPRTracker = ({ T, C, mono, orb, raj }) => {
  const [selectedEx, setSelectedEx] = useState(null);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      style={{ ...C({ padding: "14px", marginBottom: 12, border: `1px solid ${T.orange}44` }) }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 9, color: T.orange, letterSpacing: 2, ...mono }}>🏆 WORKOUT PR TRACKER</div>
        <BarChart3 size={16} color={T.orange} />
      </div>

      {/* PR Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 12 }}>
        <div style={{ textAlign: "center", padding: "8px 4px", background: T.bg2, borderRadius: 8 }}>
          <Trophy size={14} color={T.gold} style={{ marginBottom: 4 }} />
          <div style={{ fontSize: 7, color: T.muted, ...mono }}>TOTAL PRS</div>
          <div style={{ ...orb, fontSize: 16, fontWeight: 900, color: T.gold }}>6</div>
        </div>
        <div style={{ textAlign: "center", padding: "8px 4px", background: T.bg2, borderRadius: 8 }}>
          <TrendingUp size={14} color={T.green} style={{ marginBottom: 4 }} />
          <div style={{ fontSize: 7, color: T.muted, ...mono }}>BEST GAIN</div>
          <div style={{ ...orb, fontSize: 12, fontWeight: 700, color: T.green }}>+200%</div>
        </div>
        <div style={{ textAlign: "center", padding: "8px 4px", background: T.bg2, borderRadius: 8 }}>
          <div style={{ fontSize: 14, marginBottom: 4 }}>📈</div>
          <div style={{ fontSize: 7, color: T.muted, ...mono }}>AVG INCREASE</div>
          <div style={{ ...orb, fontSize: 12, fontWeight: 700, color: T.blue }}>+125%</div>
        </div>
      </div>

      {/* Exercise PRs */}
      {exercises.map((ex, i) => {
        const improvement = ((ex.current - ex.previous) / ex.previous) * 100;
        return (
          <motion.div key={ex.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            style={{ marginBottom: 10, padding: "10px 12px", background: T.bg2, borderRadius: 8, border: `1px solid ${ex.color}22`,
              cursor: "pointer" }} onClick={() => setSelectedEx(selectedEx === i ? null : i)}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>{ex.icon}</span>
                <div>
                  <div style={{ fontSize: 11, color: T.text, ...raj, fontWeight: 600 }}>{ex.name}</div>
                  <div style={{ fontSize: 8, color: T.muted, ...mono }}>Previous: {ex.previous} {ex.unit}</div>
                </div>
              </div>
              <motion.div animate={{ scale: improvement > 100 ? [1, 1.1, 1] : 1 }} transition={{ duration: 1.5, repeat: improvement > 100 ? Infinity : 0 }}
                style={{ textAlign: "right" }}>
                <div style={{ ...orb, fontSize: 18, fontWeight: 900, color: ex.color }}>{ex.current}</div>
                <div style={{ fontSize: 7, color: T.muted, ...mono }}>{ex.unit}</div>
              </motion.div>
            </div>

            {/* Improvement Bar */}
            <div style={{ height: 6, background: T.bg3, borderRadius: 3, overflow: "hidden", position: "relative" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(ex.current / Math.max(ex.current, ex.previous) * 100, 100)}%` }} 
                transition={{ duration: 0.8, delay: i * 0.1 }}
                style={{ height: "100%", background: `linear-gradient(90deg, ${ex.color}88, ${ex.color})`, borderRadius: 3 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <span style={{ fontSize: 8, color: T.muted, ...mono }}>0</span>
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.2 }}
                style={{ fontSize: 9, color: improvement > 0 ? T.green : T.red, ...mono, fontWeight: 700 }}>
                +{improvement.toFixed(0)}% 🚀
              </motion.span>
              <span style={{ fontSize: 8, color: T.muted, ...mono }}>{ex.current}</span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default WorkoutPRTracker;
