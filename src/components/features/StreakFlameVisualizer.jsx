import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Flame, Zap } from "lucide-react";

const StreakFlameVisualizer = ({ T, C, mono, orb, raj, streak }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (streak >= 7) {
      const interval = setInterval(() => {
        setParticles(prev => [...prev.slice(-20), { id: Date.now(), x: Math.random() * 100, y: 100 }]);
      }, 300);
      return () => clearInterval(interval);
    }
  }, [streak]);

  const flameHeight = Math.min(streak * 10, 100);
  const flameColor = streak >= 30 ? "#ef4444" : streak >= 14 ? "#f59e0b" : streak >= 7 ? "#10b981" : T.orange;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
      style={{ ...C({ padding: "14px", marginBottom: 12, background: "linear-gradient(135deg,#0a0500,transparent)", border: `2px solid ${flameColor}44` }) }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 9, color: flameColor, letterSpacing: 2, ...mono }}>🔥 STREAK FLAME</div>
        {streak >= 7 && <div style={{ fontSize: 8, color: T.gold, ...mono, animation: "pulse 2s infinite" }}>+50 XP BONUS ACTIVE</div>}
      </div>

      {/* 3D Flame Visualization */}
      <div style={{ position: "relative", height: 120, display: "flex", justifyContent: "center", alignItems: "flex-end", marginBottom: 12 }}>
        {/* Particles */}
        <AnimatePresence>
          {particles.map(p => (
            <motion.div key={p.id} initial={{ opacity: 1, y: 0, x: `${p.x}%` }} animate={{ opacity: 0, y: -100 }} exit={{ opacity: 0 }}
              style={{ position: "absolute", bottom: 0, width: 4, height: 4, borderRadius: "50%", background: flameColor, boxShadow: `0 0 6px ${flameColor}` }} />
          ))}
        </AnimatePresence>

        {/* Flame */}
        <motion.div animate={{ 
            height: `${flameHeight}%`,
            scale: streak >= 7 ? [1, 1.05, 1] : 1,
            filter: `drop-shadow(0 0 ${streak >= 30 ? 20 : 10}px ${flameColor})`
          }} transition={{ duration: streak >= 7 ? 1.5 : 0.5, repeat: streak >= 7 ? Infinity : 0 }}
          style={{ width: 60, background: `linear-gradient(to top, ${flameColor}cc, ${flameColor}22)`,
            borderRadius: "50% 50% 0 0", position: "relative", boxShadow: `0 0 20px ${flameColor}44` }}>
          
          {/* Inner Flame */}
          <motion.div animate={{ height: `${flameHeight * 0.6}%` }} transition={{ duration: 0.5 }}
            style={{ position: "absolute", bottom: 0, left: "25%", width: "50%", 
              background: `linear-gradient(to top, #fbbf24cc, transparent)`,
              borderRadius: "50% 50% 0 0" }} />
        </motion.div>

        {/* Streak Number */}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400 }}
          style={{ position: "absolute", bottom: "40%", left: "50%", transform: "translateX(-50%)",
            fontSize: streak >= 30 ? 32 : streak >= 14 ? 24 : 18, fontWeight: 900, color: "#fff", ...orb,
            textShadow: `0 0 10px ${flameColor}` }}>
          {streak}
        </motion.div>
      </div>

      {/* Milestones */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
        {[
          { days: 7, label: "7 DAYS", color: T.green },
          { days: 14, label: "14 DAYS", color: T.blue },
          { days: 30, label: "30 DAYS", color: T.gold },
          { days: 100, label: "100 DAYS", color: T.pink }
        ].map((m, i) => (
          <motion.div key={m.days} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            style={{ flex: 1, textAlign: "center", padding: "6px 4px",
              background: streak >= m.days ? m.color + "11" : T.bg3,
              border: `1px solid ${streak >= m.days ? m.color + "44" : T.border}`,
              borderRadius: 6 }}>
            <Zap size={12} color={streak >= m.days ? m.color : T.muted} style={{ marginBottom: 2 }} />
            <div style={{ fontSize: 7, color: streak >= m.days ? m.color : T.muted, ...mono }}>{m.label}</div>
            {streak >= m.days && <div style={{ fontSize: 6, color: m.color, ...mono, marginTop: 1 }}>✓</div>}
          </motion.div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 8 }}>
        <div style={{ fontSize: 10, color: T.muted, ...raj, lineHeight: 1.5 }}>
          {streak === 0 ? "Start your streak today! 💪" :
           streak < 7 ? `${7 - streak} more days to unlock flame bonus!` :
           streak < 30 ? "Blazing! Keep going to 30 days 🔥" :
           "LEGENDARY STATUS ACHIEVED! 🏆"}
        </div>
      </div>
    </motion.div>
  );
};

export default StreakFlameVisualizer;
