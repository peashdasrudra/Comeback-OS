import { motion } from "framer-motion";

const CinematicEnvironmentalWidget = () => {
  const temp = 28;
  const condition = "Scattered Clouds";
  const humidity = 78;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.6, delay: 0.3, ease: "easeOut" }}
      className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6"
    >
      {/* Drifting cloud animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/5 rounded-full blur-2xl"
            style={{
              width: 120 + i * 40,
              height: 60 + i * 20,
              top: `${10 + i * 20}%`,
              left: `${-20 + i * -30}%`,
            }}
            animate={{ x: ["0%", "160%"] }}
            transition={{ duration: 18 + i * 4, repeat: Infinity, ease: "linear", delay: i * 3 }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-zinc-500 text-[10px] font-mono tracking-widest uppercase"
          >
            Khulna, Bangladesh
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="flex items-end gap-1 mt-1"
          >
            <span className="text-white text-5xl font-black leading-none tracking-tight drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]">
              {temp}
            </span>
            <span className="text-sky-400 text-xl font-bold mb-1 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]">
              °C
            </span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-zinc-400 text-xs mt-1"
          >
            {condition} · Humidity {humidity}%
          </motion.p>
        </div>

        <div className="flex flex-col items-center gap-2">
          {/* Weather icon - sun with clouds */}
          <svg width="60" height="60" viewBox="0 0 60 60">
            <motion.circle cx="30" cy="22" r="10" fill="#fbbf24" animate={{ opacity: [1, 0.8, 1] }} transition={{ repeat: Infinity, duration: 3 }} />
            <motion.path
              d="M15 40 Q20 32 30 34 Q38 30 44 35 Q52 36 48 42 Q50 48 44 48 L18 48 Q12 48 14 42 Z"
              fill="#ffffff15" stroke="#ffffff25" strokeWidth="1"
            />
            <motion.path
              d="M20 36 Q24 30 32 32 Q38 28 42 32"
              fill="none" stroke="#ffffff30" strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.5, duration: 1.5 }}
            />
          </svg>
          <span className="text-[9px] font-mono text-zinc-600 tracking-wider">LIVE</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CinematicEnvironmentalWidget;
