import { motion } from "framer-motion";

const CinematicWelcomeHUD = () => {
  const cgpa = 3.94;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (cgpa / 4.0) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.8, ease: "easeOut" }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6 flex items-center justify-between"
    >
      <div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.2 }}
          className="text-zinc-400 text-sm font-mono tracking-widest uppercase"
        >
          Dashboard
        </motion.p>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="text-white text-2xl font-black tracking-tight mt-1"
        >
          Welcome back, Peash.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="text-zinc-500 text-xs font-mono mt-2"
        >
          All systems nominal. Ready to dominate.
        </motion.p>
      </div>

      <div className="relative w-24 h-24 flex-shrink-0">
        <svg width="96" height="96" className="-rotate-90">
          <circle cx="48" cy="48" r={radius} stroke="#27272a" strokeWidth="8" fill="none" />
          <motion.circle
            cx="48"
            cy="48"
            r={radius}
            stroke="#00ff88"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ delay: 1.4, duration: 1.8, ease: "easeInOut" }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white text-lg font-bold">{cgpa}</span>
          <span className="text-zinc-500 text-[9px] font-mono tracking-wider">CGPA</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CinematicWelcomeHUD;
