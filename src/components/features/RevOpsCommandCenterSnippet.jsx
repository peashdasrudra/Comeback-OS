import { motion } from "framer-motion";
import { TrendingUp, AlertCircle, GitBranch } from "lucide-react";

const kpis = [
  { label: "Sprint Velocity", value: "42 pts", icon: TrendingUp, color: "#00ff88", change: "+8%" },
  { label: "Open Issues", value: "12", icon: AlertCircle, color: "#ff8800", change: "-3" },
  { label: "Deploy Freq.", value: "3.2/w", icon: GitBranch, color: "#00b4ff", change: "+0.4" },
];

const velocityData = [28, 31, 35, 29, 38, 42];
const maxVal = Math.max(...velocityData);
const minVal = Math.min(...velocityData);
const svgWidth = 200;
const svgHeight = 60;
const padding = 5;

const points = velocityData.map((v, i) => {
  const x = padding + (i / (velocityData.length - 1)) * (svgWidth - 2 * padding);
  const y = padding + (1 - (v - minVal) / (maxVal - minVal)) * (svgHeight - 2 * padding);
  return `${x},${y}`;
}).join(" ");

const RevOpsCommandCenterSnippet = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.6, delay: 0.5, ease: "easeOut" }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-zinc-500 text-[10px] font-mono tracking-widest uppercase">RevOps Command Center</p>
          <h3 className="text-white text-lg font-bold mt-0.5">Project Management</h3>
        </div>
        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-emerald-400 text-[9px] font-mono font-bold">ALL SYSTEMS GO</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
            className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3 flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between">
              <k.icon size={14} style={{ color: k.color }} />
              <span className="text-[9px] font-mono" style={{ color: k.color }}>{k.change}</span>
            </div>
            <div className="text-white text-base font-bold">{k.value}</div>
            <div className="text-zinc-500 text-[9px] font-mono">{k.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Velocity Chart */}
      <div className="bg-zinc-900/40 rounded-xl p-3 border border-zinc-800/50">
        <div className="text-zinc-500 text-[9px] font-mono mb-2 tracking-wider">SPRINT VELOCITY — 6 SPRINTS</div>
        <svg width="100%" height="60" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none" className="overflow-visible">
          <defs>
            <linearGradient id="revGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ff88" />
              <stop offset="100%" stopColor="#00b4ff" />
            </linearGradient>
            <filter id="revGlow">
              <feGaussianBlur stdDeviation="2" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Grid lines */}
          {[0, 1, 2].map(i => (
            <line key={i} x1={padding} y1={padding + i * (svgHeight - 2 * padding) / 2} x2={svgWidth - padding} y2={padding + i * (svgHeight - 2 * padding) / 2} stroke="#ffffff08" strokeWidth="0.5" />
          ))}
          {/* Animated line */}
          <motion.polyline
            points={points}
            fill="none"
            stroke="url(#revGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#revGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 1.2, duration: 1.8, ease: "easeInOut" }}
          />
          {/* Data points */}
          {velocityData.map((v, i) => {
            const x = padding + (i / (velocityData.length - 1)) * (svgWidth - 2 * padding);
            const y = padding + (1 - (v - minVal) / (maxVal - minVal)) * (svgHeight - 2 * padding);
            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill="#00ff88"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.4 + i * 0.1, duration: 0.3 }}
              />
            );
          })}
        </svg>
        <div className="flex justify-between mt-1">
          {["S1", "S2", "S3", "S4", "S5", "S6"].map(s => (
            <span key={s} className="text-zinc-600 text-[8px] font-mono">{s}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default RevOpsCommandCenterSnippet;
