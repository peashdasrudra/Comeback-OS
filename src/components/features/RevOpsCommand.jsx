import { motion } from "framer-motion";
import { useState } from "react";
import { BarChart3, TrendingUp } from "lucide-react";

const sprintData = [
  { sprint: 1, velocity: 28, target: 30, completed: 26 },
  { sprint: 2, velocity: 32, target: 30, completed: 32 },
  { sprint: 3, velocity: 35, target: 32, completed: 35 },
  { sprint: 4, velocity: 30, target: 32, completed: 28 },
  { sprint: 5, velocity: 38, target: 35, completed: 38 },
  { sprint: 6, velocity: 42, target: 35, completed: 42 }
];

const kpiCards = [
  { title: "Velocity", value: "35", unit: "pts", color: "#00ff88", icon: "📈" },
  { title: "Bug Rate", value: "2.3", unit: "%", color: "#ff8800", icon: "🐛" },
  { title: "Uptime", value: "99.9", unit: "%", color: "#00b4ff", icon: "⚡" },
  { title: "Deploy", value: "12", unit: "/mo", color: "#a855f7", icon: "🚀" }
];

const RevOpsCommand = () => {
  const [selectedSprint, setSelectedSprint] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-4 md:p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-xl">
            <BarChart3 className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white/90" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              RevOps Command Center
            </h2>
            <p className="text-xs text-white/50" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              Sprint velocity with glowing KPI cards
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-white/30" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            SPRINT
          </div>
          <motion.div
            className="text-2xl font-bold text-blue-300"
            style={{ fontFamily: "'Orbitron', monospace" }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            6
          </motion.div>
        </div>
      </div>

      {/* Sprint Velocity Chart */}
      <div className="mb-6 relative" style={{ height: 200 }}>
        <svg width="100%" height="100%" viewBox="0 0 400 200">
          {/* Grid lines */}
          {[10, 20, 30, 40].map((val) => (
            <g key={val}>
              <line x1="40" y1={200 - val * 4} x2="380" y2={200 - val * 4} stroke="#ffffff10" strokeWidth="0.5" />
              <text x="35" y={200 - val * 4 + 4} fill="#3a6a5a" fontSize="8" fontFamily="Share Tech Mono, monospace" textAnchor="end">
                {val}
              </text>
            </g>
          ))}

          {/* Target Line */}
          <motion.line
            x1="40" y1={200 - 35 * 4} x2="380" y2={200 - 35 * 4}
            stroke="#ffd700"
            strokeWidth="1"
            strokeDasharray="5 5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5 }}
          />

          {/* Velocity Polyline */}
          <motion.polyline
            points={sprintData.map((d, i) => `${40 + i * 60} ${200 - d.velocity * 4}`).join(' ')}
            fill="none"
            stroke="#00b4ff"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            style={{ filter: "drop-shadow(0 0 6px #00b4ff)" }}
          />

          {/* Data Points */}
          {sprintData.map((d, i) => (
            <motion.g
              key={d.sprint}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              onHoverStart={() => setSelectedSprint(d.sprint)}
              onHoverEnd={() => setSelectedSprint(null)}
              style={{ cursor: "pointer" }}
            >
              <motion.circle
                cx={40 + i * 60}
                cy={200 - d.velocity * 4}
                r="4"
                fill="#00b4ff"
                whileHover={{ r: 6 }}
                style={{ filter: "drop-shadow(0 0 6px #00b4ff)" }}
              />
              {/* Hover tooltip */}
              {selectedSprint === d.sprint && (
                <motion.g
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <rect x={40 + i * 60 - 30} y={200 - d.velocity * 4 - 40} width="60" height="30" rx="6" fill="rgba(0,180,255,0.1)" stroke="#00b4ff" strokeWidth="1" />
                  <text x={40 + i * 60} y={200 - d.velocity * 4 - 20} fill="#00b4ff" fontSize="9" fontFamily="Share Tech Mono, monospace" textAnchor="middle">
                    {d.velocity} pts
                  </text>
                </motion.g>
              )}
            </motion.g>
          ))}

          {/* Sprint Labels */}
          {sprintData.map((d, i) => (
            <text
              key={d.sprint}
              x={40 + i * 60}
              y="195"
              fill="#3a6a5a"
              fontSize="8"
              fontFamily="Share Tech Mono, monospace"
              textAnchor="middle"
            >
              S{d.sprint}
            </text>
          ))}
        </svg>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {kpiCards.map((kpi, i) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${kpi.color}44` }}
            className="p-3 bg-white/5 border border-white/10 rounded-xl text-center cursor-pointer"
          >
            <div className="text-xl mb-1">{kpi.icon}</div>
            <div className="text-[9px] text-white/30 mb-1" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              {kpi.title}
            </div>
            <div className="text-xs font-bold" style={{ color: kpi.color, fontFamily: "'Rajdhani', sans-serif" }}>
              {kpi.value} <span className="text-[9px] text-white/40">{kpi.unit}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "AVG", value: "34.2", icon: "📊" },
          { label: "BEST", value: "S6 (42)", icon: "🏆" },
          { label: "GOAL", value: "40+", icon: "🎯" }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="p-3 bg-white/5 rounded-xl text-center"
          >
            <div className="text-xl mb-1">{stat.icon}</div>
            <div className="text-[9px] text-white/30 mb-1" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              {stat.label}
            </div>
            <div className="text-xs font-bold text-white/80" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RevOpsCommand;
