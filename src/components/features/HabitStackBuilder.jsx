import { motion, useDragControls } from "framer-motion";
import { useState } from "react";
import { GripVertical, Check, Target, Flame } from "lucide-react";

const habits = [
  { id: 1, name: "Read thesis paper", time: "8:00 AM", color: "#00ff88", streak: 12, completed: true },
  { id: 2, name: "Code 1 hour", time: "10:00 AM", color: "#00b4ff", streak: 8, completed: true },
  { id: 3, name: "Gym workout", time: "4:00 PM", color: "#ff006e", streak: 5, completed: false },
  { id: 4, name: "Apply university", time: "6:00 PM", color: "#ff8800", streak: 3, completed: false },
  { id: 5, name: "IELTS practice", time: "8:00 PM", color: "#a855f7", streak: 7, completed: false },
  { id: 6, name: "Water 8 glasses", time: "All day", color: "#00ffff", streak: 15, completed: true },
];

const HabitStackBuilder = ({ T, C, mono, orb, raj }) => {
  const [habitList, setHabitList] = useState(habits);
  const [draggedId, setDraggedId] = useState(null);

  const toggleHabit = (id) => {
    setHabitList(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(16,185,129,0.3)" }}
      className="card-glow"
      style={{ ...C({ padding: "14px", marginBottom: 12 }), background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(59,130,246,0.08))", backdropFilter: "blur(20px)" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 9, color: T.green, letterSpacing: 2, ...mono }}>✅ HABIT STACK</div>
        <Target size={16} color={T.green} />
      </div>

      <div style={{ fontSize: 8, color: T.muted, ...mono, marginBottom: 8 }}>
        DRAG TO REORDER · TAP TO COMPLETE
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {habitList.map((h, i) => (
          <motion.div key={h.id} layout transition={{ type: "spring", stiffness: 300, damping: 20 }}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
            style={{ padding: "10px 12px", background: h.completed ? `${h.color}11` : T.bg2,
              borderRadius: 10, border: `1px solid ${h.completed ? h.color + "44" : T.border}`,
              display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
              boxShadow: h.completed ? `0 0 12px ${h.color}22` : "none" }}
            onClick={() => toggleHabit(h.id)}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          >
            <GripVertical size={14} color={T.muted} style={{ cursor: "grab", flexShrink: 0 }} />
            <motion.div animate={{ scale: h.completed ? 1 : 0.8, opacity: h.completed ? 1 : 0.5 }}
              style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${h.color}`,
                background: h.completed ? h.color : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {h.completed && <Check size={12} color={T.bg} />}
            </motion.div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: h.completed ? h.color : T.text, ...raj, fontWeight: 600,
                textDecoration: h.completed ? "line-through" : "none" }}>
                {h.name}
              </div>
              <div style={{ fontSize: 8, color: T.muted, ...mono, marginTop: 2 }}>{h.time}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <motion.div animate={{ scale: h.streak > 10 ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 1.5, repeat: h.streak > 10 ? Infinity : 0 }}
                style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Flame size={10} color={T.orange} />
                <span style={{ ...orb, fontSize: 10, fontWeight: 700, color: T.orange }}>{h.streak}</span>
              </motion.div>
              <div style={{ fontSize: 6, color: T.muted, ...mono }}>DAY STREAK</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "8px 12px", background: T.bg2, borderRadius: 8 }}>
        <div>
          <div style={{ fontSize: 8, color: T.muted, ...mono }}>COMPLETED</div>
          <div style={{ ...orb, fontSize: 18, fontWeight: 900, color: T.green }}>
            {habitList.filter(h => h.completed).length}/{habitList.length}
          </div>
        </div>
        <motion.div animate={{ scale: habitList.every(h => h.completed) ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 1, repeat: habitList.every(h => h.completed) ? Infinity : 0 }}>
          <div style={{ fontSize: 24 }}>{habitList.every(h => h.completed) ? "🎉" : "💪"}</div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HabitStackBuilder;
