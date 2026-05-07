import { motion, useSpring } from "framer-motion";
import { useState, useEffect } from "react";
import { TrendingUp, Target } from "lucide-react";

const projects = [
  { id: 1, name: "Portfolio Website", amount: 1500, status: "Paid", date: "2026-01" },
  { id: 2, name: "E-commerce App", amount: 2000, status: "In Progress", date: "2026-03" },
  { id: 3, name: "Blog Platform", amount: 1500, status: "Pending", date: "2026-05" }
];

const FreelanceTracker = () => {
  const targetEarnings = 5000;
  const currentEarnings = projects.reduce((sum, p) => sum + (p.status === "Paid" ? p.amount : 0), 0);
  const springEarnings = useSpring(currentEarnings, { stiffness: 50, damping: 20 });

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
          <div className="p-2 bg-green-500/20 rounded-xl">
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white/90" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Freelance Tracker
            </h2>
            <p className="text-xs text-white/50" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              Tk 0 → 5000 earnings target
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-white/30" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            EARNINGS
          </div>
          <motion.div
            className="text-2xl font-bold text-green-300"
            style={{ fontFamily: "'Orbitron', monospace" }}
          >
            Tk {springEarnings.get()}
          </motion.div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-[11px] text-white/60" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Progress to Target
          </span>
          <span className="text-[11px] font-bold" style={{ color: "#ffd700", fontFamily: "'Orbitron', monospace" }}>
            {Math.round((currentEarnings / targetEarnings) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #00ff88, #ffd700)",
              boxShadow: "0 0 10px #00ff8844"
            }}
            initial={{ width: 0 }}
            animate={{ width: `${(currentEarnings / targetEarnings) * 100}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      {/* Project Cards */}
      <div className="space-y-3 mb-6">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 bg-white/5 border border-white/10 rounded-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-white/90" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                {project.name}
              </span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full ${
                  project.status === "Paid" ? "bg-green-500/20 text-green-300" :
                  project.status === "In Progress" ? "bg-blue-500/20 text-blue-300" :
                  "bg-white/10 text-white/50"
                }`}
              >
                {project.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-white/40" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                {project.date}
              </span>
              <span className="text-lg font-bold" style={{ color: "#ffd700", fontFamily: "'Orbitron', monospace" }}>
                Tk {project.amount}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "EARNED", value: `Tk ${currentEarnings}`, icon: "💰" },
          { label: "TARGET", value: "Tk 5000", icon: "🎯" },
          { label: "PROJECTS", value: projects.length, icon: "📋" }
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

export default FreelanceTracker;
