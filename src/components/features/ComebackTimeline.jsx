import { motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { Trophy, Star, TrendingUp } from "lucide-react";

const milestones = [];

const ComebackTimeline = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-4 md:p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl">
          <Trophy className="w-6 h-6 text-yellow-400" />
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-bold text-white/90" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Comeback Story Timeline
          </h2>
          <p className="text-xs text-white/50" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            From 32/100 → 3.95 GPA → Debate Champ
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative" style={{ height: 300 }}>
        <svg width="100%" height="100%" viewBox="0 0 400 300">
          {/* Gradient Line */}
          <defs>
            <linearGradient id="timelineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff2244" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#00ff88" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#00b4ff" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Main Path */}
          <motion.path
            d="M 80 240 Q 140 180, 200 120 Q 260 60, 320 40"
            fill="none"
            stroke="url(#timelineGrad)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 2, ease: "easeInOut" }}
            style={{ filter: "drop-shadow(0 0 10px rgba(0,255,136,0.3))" }}
          />

          {/* Scatter Nodes */}
          {milestones.map((m, i) => {
            const cx = m.x * 4;
            const cy = m.y * 3;
            return (
              <motion.g
                key={m.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.3, type: "spring", stiffness: 200 }}
              >
                {/* Glow Effect */}
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r="20"
                  fill={m.glowColor}
                  animate={{
                    r: [20, 30, 20],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                />

                {/* Main Node */}
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r="8"
                  fill={m.color}
                  stroke="#fff"
                  strokeWidth="2"
                  whileHover={{ scale: 1.3 }}
                  style={{ filter: `drop-shadow(0 0 8px ${m.color})`, cursor: "pointer" }}
                />

                {/* Icon */}
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="16"
                >
                  {m.icon}
                </text>

                {/* Label */}
                <text
                  x={cx}
                  y={cy + 25}
                  fill="#a8d8c0"
                  fontSize="10"
                  fontFamily="Share Tech Mono, monospace"
                  textAnchor="middle"
                >
                  {m.title}
                </text>

                {/* Date */}
                <text
                  x={cx}
                  y={cy + 38}
                  fill="#3a6a5a"
                  fontSize="9"
                  fontFamily="Share Tech Mono, monospace"
                  textAnchor="middle"
                >
                  {m.date}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        {[
          { label: "START", value: "32/100", icon: "📉", color: "#ff2244" },
          { label: "CURRENT", value: "3.95", icon: "🏆", color: "#00ff88" },
          { label: "TARGET", value: "MSc + PhD", icon: "🎓", color: "#00b4ff" }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="p-3 bg-white/5 rounded-xl text-center"
          >
            <div className="text-xl mb-1">{stat.icon}</div>
            <div className="text-[9px] text-white/30 mb-1" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              {stat.label}
            </div>
            <div className="text-xs font-bold" style={{ color: stat.color, fontFamily: "'Rajdhani', sans-serif" }}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ComebackTimeline;
