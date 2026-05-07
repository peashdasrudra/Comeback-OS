import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Sun, Moon, Zap, Cloud, Flame } from "lucide-react";

const moods = [
  { emoji: "😤", label: "GRINDING", color: "#f59e0b", bgGradient: "linear-gradient(135deg,#1a1200,#0a0800)", icon: Zap },
  { emoji: "💪", label: "STRONG", color: "#10b981", bgGradient: "linear-gradient(135deg,#001a0a,#020408)", icon: Zap },
  { emoji: "😐", label: "OKAY", color: "#3b82f6", bgGradient: "linear-gradient(135deg,#000d1a,#020408)", icon: Cloud },
  { emoji: "😴", label: "TIRED", color: "#8b5cf6", bgGradient: "linear-gradient(135deg,#0d0020,#040408)", icon: Moon },
  { emoji: "🔥", label: "ON FIRE", color: "#ef4444", bgGradient: "linear-gradient(135deg,#1a0005,#0a0008)", icon: Flame }
];

const MoodAmbientLighting = ({ T, C, mono, orb, raj, currentMood, onMoodChange }) => {
  const [ambientColor, setAmbientColor] = useState("#3b82f6");
  const [particles, setParticles] = useState([]);

  const activeMood = moods.find(m => m.label === currentMood) || moods[2];

  useEffect(() => {
    setAmbientColor(activeMood.color);
    // Create particles for "ON FIRE" mood
    if (currentMood === "ON FIRE") {
      const interval = setInterval(() => {
        setParticles(prev => [...prev.slice(-15), { id: Date.now(), x: Math.random() * window.innerWidth, y: window.innerHeight }]);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [currentMood]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
      style={{ ...C({ padding: "14px", marginBottom: 12, background: activeMood.bgGradient, border: `1px solid ${activeMood.color}44` }) }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 9, color: activeMood.color, letterSpacing: 2, ...mono }}>🎨 MOOD AMBIENT LIGHTING</div>
        <activeMood.icon size={16} color={activeMood.color} />
      </div>

      {/* Ambient Glow Effect */}
      <motion.div animate={{ 
          boxShadow: `0 0 30px ${activeMood.color}22, inset 0 0 50px ${activeMood.color}11`,
          background: `radial-gradient(circle at 50% 50%, ${activeMood.color}08, transparent 70%)`
        }} transition={{ duration: 1 }}
        style={{ padding: "20px", borderRadius: 12, marginBottom: 12, textAlign: "center", position: "relative", overflow: "hidden" }}>
        
        {/* Particles for ON FIRE */}
        <AnimatePresence>
          {particles.map(p => (
            <motion.div key={p.id} initial={{ opacity: 1, y: 0, x: p.x }} animate={{ opacity: 0, y: -100 }} exit={{ opacity: 0 }}
              style={{ position: "absolute", width: 3, height: 3, borderRadius: "50%", background: "#ef4444",
                boxShadow: "0 0 6px #ef444466" }} />
          ))}
        </AnimatePresence>

        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ fontSize: 48, marginBottom: 8 }}>
          {activeMood.emoji}
        </motion.div>
        <div style={{ ...orb, fontSize: 18, fontWeight: 900, color: activeMood.color, marginBottom: 4 }}>{activeMood.label}</div>
        <div style={{ fontSize: 9, color: T.muted, ...mono }}>Background adapts to your mood</div>
      </motion.div>

      {/* Mood Selector */}
      <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
        {moods.map((m, i) => (
          <motion.button key={m.label} whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}
            onClick={() => onMoodChange(m.label)}
            animate={{ 
              background: currentMood === m.label ? m.color + "22" : T.bg2,
              border: `1px solid ${currentMood === m.label ? m.color + "55" : T.border}`,
              boxShadow: currentMood === m.label ? `0 0 12px ${m.color}33` : "none"
            }} transition={{ duration: 0.3 }}
            style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{m.emoji}</div>
            <div style={{ fontSize: 6, color: currentMood === m.label ? m.color : T.muted, ...mono, letterSpacing: 1 }}>{m.label}</div>
          </motion.button>
        ))}
      </div>

      {/* Ambient Status */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        style={{ marginTop: 10, padding: "8px 10px", background: activeMood.color + "0d", borderRadius: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 8, color: T.muted, ...mono }}>AMBIENT COLOR</span>
        <span style={{ fontSize: 9, color: activeMood.color, ...mono, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: activeMood.color, boxShadow: `0 0 6px ${activeMood.color}` }} />
          {activeMood.color.toUpperCase()}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default MoodAmbientLighting;
