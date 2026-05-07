import { motion } from "framer-motion";
import { useState } from "react";
import { BarChart3 } from "lucide-react";

const radarData = [
  { metric: "Sprint Velocity", football: 85, pubg: 72, color: "#00ff88" },
  { metric: "Code Quality", football: 78, pubg: 88, color: "#00b4ff" },
  { metric: "Bug Resolution", football: 92, pubg: 65, color: "#ff8800" },
  { metric: "Deployment Freq", football: 70, pubg: 80, color: "#a855f7" },
  { metric: "User Satisfaction", football: 88, pubg: 75, color: "#ff006e" },
  { metric: "Team Collaboration", football: 82, pubg: 90, color: "#ffd700" }
];

const TacticalAnalytics = () => {
  const [selectedGame, setSelectedGame] = useState("football");

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
          <div className="p-2 bg-purple-500/20 rounded-xl">
            <BarChart3 className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white/90" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Tactical Analytics Hub
            </h2>
            <p className="text-xs text-white/50" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              Neon glow performance metrics
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {["football", "pubg"].map((game) => (
            <button
              key={game}
              onClick={() => setSelectedGame(game)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                selectedGame === game
                  ? "bg-purple-500/20 text-purple-300 border border-purple-400/30"
                  : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
              }`}
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              {game.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Radar Chart Visualization */}
      <div className="mb-6 h-64 relative">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Grid circles */}
          {[20, 40, 60, 80, 100].map((val) => (
            <circle
              key={val}
              cx="100"
              cy="100"
              r={val}
              fill="none"
              stroke="#ffffff10"
              strokeWidth="0.5"
            />
          ))}

          {/* Axes */}
          {radarData.map((_, i) => {
            const angle = (i * 60 - 90) * Math.PI / 180;
            const x = 100 + 100 * Math.cos(angle);
            const y = 100 + 100 * Math.sin(angle);
            return (
              <line
                key={i}
                x1="100"
                y1="100"
                x2={x}
                y2={y}
                stroke="#ffffff10"
                strokeWidth="0.5"
              />
            );
          })}

          {/* Data Polygon */}
          <motion.polygon
            points={radarData.map((d, i) => {
              const angle = (i * 60 - 90) * Math.PI / 180;
              const value = selectedGame === "football" ? d.football : d.pubg;
              const r = (value / 100) * 100;
              const x = 100 + r * Math.cos(angle);
              const y = 100 + r * Math.sin(angle);
              return `${x},${y}`;
            }).join(' ')}
            fill="rgba(168, 85, 247, 0.1)"
            stroke="#a855f7"
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            style={{ filter: "drop-shadow(0 0 10px #a855f744)" }}
          />

          {/* Data Points */}
          {radarData.map((d, i) => {
            const angle = (i * 60 - 90) * Math.PI / 180;
            const value = selectedGame === "football" ? d.football : d.pubg;
            const r = (value / 100) * 100;
            const x = 100 + r * Math.cos(angle);
            const y = 100 + r * Math.sin(angle);
            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill="#a855f7"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                style={{ filter: "drop-shadow(0 0 6px #a855f7)" }}
              />
            );
          })}

          {/* Labels */}
          {radarData.map((d, i) => {
            const angle = (i * 60 - 90) * Math.PI / 180;
            const x = 100 + 115 * Math.cos(angle);
            const y = 100 + 115 * Math.sin(angle);
            return (
              <text
                key={i}
                x={x}
                y={y}
                fill="#a8d8c0"
                fontSize="8"
                fontFamily="Share Tech Mono, monospace"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {d.metric}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "AVG SCORE", value: selectedGame === "football" ? "82.5" : "78.3", icon: "📊" },
          { label: "TOP METRIC", value: "Bug Fix", icon: "🏆" },
          { label: "TARGET", value: "85+", icon: "🎯" }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
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

export default TacticalAnalytics;
