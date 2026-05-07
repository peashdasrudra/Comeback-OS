import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Star, Trophy, Zap, X } from "lucide-react";

const milestones = [
  { level: 5, title: "The Awakening", xpNeeded: 500, icon: "🌟", color: "#00ff88" },
  { level: 10, title: "Momentum Builder", xpNeeded: 1000, icon: "🔥", color: "#ff8800" },
  { level: 15, title: "Unstoppable Force", xpNeeded: 1500, icon: "💎", color: "#00b4ff" },
  { level: 20, title: "Comeback King", xpNeeded: 2000, icon: "👑", color: "#ffd700" },
];

const particles = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 4 + Math.random() * 8,
  delay: Math.random() * 2,
  duration: 2 + Math.random() * 3,
  color: ["#ffd700", "#ff8800", "#00ff88", "#00b4ff"][Math.floor(Math.random() * 4)],
}));

const LevelUpEngine = ({ T, C, mono, orb, raj }) => {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(3);
  const [xp, setXp] = useState(320);

  const nextMilestone = milestones.find(m => m.level === currentLevel + 1);
  const xpForNext = nextMilestone ? nextMilestone.xpNeeded : 2000;
  const progress = (xp / xpForNext) * 100;

  const triggerLevelUp = () => {
    if (currentLevel < 20) {
      setCurrentLevel(prev => prev + 1);
      setXp(0);
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 4000);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(234,179,8,0.3)" }}
        className="card-glow"
        style={{ ...C({ padding: "14px", marginBottom: 12 }), background: "linear-gradient(135deg, rgba(234,179,8,0.08), rgba(249,115,22,0.08))", backdropFilter: "blur(20px)" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 9, color: T.gold, letterSpacing: 2, ...mono }}>🎮 LEVEL UP ENGINE</div>
          <Trophy size={16} color={T.gold} />
        </div>

        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}
            style={{ display: "inline-block", padding: "12px 20px", background: `${T.gold}11`, borderRadius: 16,
              border: `2px solid ${T.gold}44` }}>
            <div style={{ fontSize: 7, color: T.muted, ...mono, marginBottom: 4 }}>CURRENT LEVEL</div>
            <div style={{ ...orb, fontSize: 36, fontWeight: 900, color: T.gold }}>{currentLevel}</div>
            <div style={{ fontSize: 9, color: T.bright, ...raj, fontWeight: 600 }}>{milestones[currentLevel - 1]?.title || "Rising Star"}</div>
          </motion.div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 8, color: T.muted, ...mono }}>XP Progress</span>
            <span style={{ fontSize: 8, color: T.gold, ...mono }}>{xp}/{xpForNext}</span>
          </div>
          <div style={{ height: 8, background: T.bg2, borderRadius: 4, overflow: "hidden" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.8 }}
              style={{ height: "100%", background: `linear-gradient(90deg, ${T.gold}, ${T.orange})`, borderRadius: 4 }} />
          </div>
        </div>

        <motion.button whileTap={{ scale: 0.95 }}
          onClick={triggerLevelUp}
          style={{ width: "100%", padding: "10px 16px", background: `linear-gradient(135deg, ${T.gold}22, ${T.orange}22)`,
            border: `1px solid ${T.gold}44`, borderRadius: 10, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          <Zap size={14} color={T.gold} />
          <span style={{ fontSize: 10, color: T.gold, ...raj, fontWeight: 700 }}>+100 XP (Simulate Level Up)</span>
        </motion.button>
      </motion.div>

      {/* Full-Screen Level Up Overlay */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(2,4,8,0.95)",
              display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}
          >
            {/* Particles */}
            {particles.map(p => (
              <motion.div key={p.id} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 0], scale: [0, 1, 0],
                x: [0, (Math.random() - 0.5) * 400], y: [0, (Math.random() - 0.5) * 400] }}
                transition={{ duration: p.duration, delay: p.delay, repeat: Infinity }}
                style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size,
                  borderRadius: "50%", background: p.color, boxShadow: `0 0 10px ${p.color}` }}
              />
            ))}

            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              style={{ textAlign: "center", zIndex: 1 }}
            >
              <div style={{ fontSize: 64, marginBottom: 16 }}>{milestones[currentLevel - 1]?.icon || "🎉"}</div>
              <div style={{ ...orb, fontSize: 48, fontWeight: 900, color: T.gold, marginBottom: 8 }}>
                LEVEL {currentLevel}
              </div>
              <div style={{ fontSize: 20, color: T.bright, ...raj, fontWeight: 700, marginBottom: 4 }}>
                {milestones[currentLevel - 1]?.title}
              </div>
              <div style={{ fontSize: 12, color: T.muted, ...mono }}>🎊 MILESTONE ACHIEVED!</div>
            </motion.div>

            <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
              onClick={() => setShowLevelUp(false)}
              style={{ marginTop: 32, padding: "10px 24px", background: T.gold, border: "none", borderRadius: 10,
                cursor: "pointer", fontSize: 12, fontWeight: 700, color: T.bg, zIndex: 1 }}
            >
              CLAIM REWARD ✨
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LevelUpEngine;
