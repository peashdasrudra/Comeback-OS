import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const CinematicWelcomeHUD = () => {
  const cgpa = 3.95;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (cgpa / 4.0) * circumference;
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      setTimeStr(`${hh}:${mm}:${ss}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    // ✅ FIX: No bg/border/shadow — the parent glass card in Home.jsx already provides them
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="flex items-center justify-between gap-4 p-2"
    >
      {/* Left: identity */}
      <div className="flex-1 min-w-0">
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-zinc-500 text-[9px] font-mono tracking-[3px] uppercase mb-1"
        >
          ⚔️ COMEBACK OS · OPERATOR DASHBOARD
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-white text-2xl font-black tracking-tight leading-none"
          style={{
            fontFamily: "'Orbitron', monospace",
            textShadow: "0 0 24px rgba(0,255,136,0.4)",
            background: "linear-gradient(135deg, #e8f8f0 0%, #00ff88 60%, #00b4ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Peash Rudra
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="text-zinc-400 text-[11px] mt-1.5 leading-relaxed"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          MSc CSE Candidate · National Debate Champion · Cancer Research
        </motion.p>

        {/* Status chips */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="flex gap-2 mt-3 flex-wrap"
        >
          {[
            { label: "3.95 CGPA", color: "#00ff88" },
            { label: "TOP OF BATCH", color: "#ffd700" },
            { label: "ALL SYSTEMS NOMINAL", color: "#00b4ff" },
          ].map((chip, i) => (
            <span
              key={i}
              className="text-[8px] font-mono px-2 py-0.5 rounded-full"
              style={{
                color: chip.color,
                background: chip.color + "18",
                border: `1px solid ${chip.color}44`,
                letterSpacing: "1px",
              }}
            >
              {chip.label}
            </span>
          ))}
        </motion.div>

        {/* Live clock */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="mt-3 text-[9px] text-zinc-600 font-mono tracking-widest"
        >
          {timeStr}
        </motion.p>
      </div>

      {/* Right: CGPA ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.5, duration: 1.2, type: "spring", stiffness: 120 }}
        className="relative w-28 h-28 flex-shrink-0"
      >
        {/* Outer glow ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: "0 0 24px rgba(0,255,136,0.25), 0 0 48px rgba(0,255,136,0.1)",
          }}
        />

        <svg width="112" height="112" className="-rotate-90" viewBox="0 0 96 96">
          {/* Track */}
          <circle cx="48" cy="48" r={radius} stroke="#1a2a2a" strokeWidth="8" fill="none" />
          {/* Progress arc */}
          <motion.circle
            cx="48"
            cy="48"
            r={radius}
            stroke="url(#cgpaGrad)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ delay: 0.8, duration: 2.0, ease: "easeInOut" }}
            style={{ strokeDasharray: circumference, filter: "drop-shadow(0 0 6px #00ff8888)" }}
          />
          <defs>
            <linearGradient id="cgpaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ff88" />
              <stop offset="100%" stopColor="#00b4ff" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="text-white text-xl font-black"
            style={{ fontFamily: "'Orbitron', monospace", textShadow: "0 0 12px rgba(0,255,136,0.6)" }}
          >
            {cgpa}
          </motion.span>
          <span className="text-zinc-500 text-[8px] font-mono tracking-wider">CGPA</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CinematicWelcomeHUD;
