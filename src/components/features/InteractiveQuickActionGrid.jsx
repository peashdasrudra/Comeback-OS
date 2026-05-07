import { motion } from "framer-motion";
import { Zap, Dumbbell, BookOpen } from "lucide-react";

const actions = [
  { icon: Zap, label: "Start Workout", desc: "Log today's training", color: "#00b4ff" },
  { icon: Dumbbell, label: "Track Body", desc: "Update measurements", color: "#ff8800" },
  { icon: BookOpen, label: "Study Stats", desc: "Review progress", color: "#00ff88" },
];

const InteractiveQuickActionGrid = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {actions.map((a, i) => (
        <motion.div
          key={a.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 + i * 0.15, duration: 0.6 }}
          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          className="relative group cursor-pointer bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 flex flex-col items-center gap-3 overflow-hidden"
        >
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
            style={{ background: `radial-gradient(circle at center, ${a.color}33, transparent 70%)` }}
          />
          <div className="relative z-10 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${a.color}22` }}>
            <a.icon size={20} style={{ color: a.color }} />
          </div>
          <div className="relative z-10 text-center">
            <div className="text-white text-xs font-bold tracking-wide">{a.label}</div>
            <div className="text-zinc-500 text-[10px] font-mono mt-0.5">{a.desc}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default InteractiveQuickActionGrid;
