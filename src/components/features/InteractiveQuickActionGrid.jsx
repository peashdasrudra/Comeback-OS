import { motion } from "framer-motion";
import { Zap, Dumbbell, BookOpen } from "lucide-react";

const actions = [
  { icon: Zap, label: "Start Workout", desc: "Log today's training", color: "#00b4ff" },
  { icon: Dumbbell, label: "Track Body", desc: "Update measurements", color: "#ff8800" },
  { icon: BookOpen, label: "Study Stats", desc: "Review progress", color: "#00ff88" },
];

const InteractiveQuickActionGrid = () => {
  return (
    // ✅ FIX: Removed per-cell dark backgrounds — they lived inside a glass card,
    //          creating a box-in-box effect. Cells now use transparent bases with
    //          colored borders + hover glows only.
    <div className="grid grid-cols-3 gap-3 p-5">
      {actions.map((a, i) => (
        <motion.div
          key={a.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 + i * 0.12, duration: 0.5 }}
          whileHover={{
            scale: 1.04,
            transition: { duration: 0.18 },
          }}
          whileTap={{ scale: 0.97 }}
          className="relative group cursor-pointer rounded-2xl p-4 flex flex-col items-center gap-2.5 overflow-hidden"
          style={{
            // ✅ Transparent base — the parent glass card is the real panel
            background: "transparent",
            border: `1px solid ${a.color}28`,
            transition: "border-color 0.25s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = a.color + "80";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = a.color + "28";
          }}
        >
          {/* Radial glow on hover */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: `radial-gradient(circle at 50% 60%, ${a.color}18, transparent 70%)` }}
          />

          {/* Icon */}
          <div
            className="relative z-10 w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: a.color + "15",
              border: `1px solid ${a.color}33`,
              boxShadow: `0 0 12px ${a.color}22`,
            }}
          >
            <a.icon size={18} style={{ color: a.color }} />
          </div>

          {/* Text */}
          <div className="relative z-10 text-center">
            <div
              className="text-white text-[11px] font-bold tracking-wide"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              {a.label}
            </div>
            <div className="text-zinc-500 text-[9px] font-mono mt-0.5">{a.desc}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default InteractiveQuickActionGrid;
