import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Target, CheckCircle, Clock, Play, Circle } from "lucide-react";

const milestones = [];

const nodeColors = {
  completed: "#00ff88",
  "in-progress": "#00b4ff",
  pending: "#ffffff30"
};

const ResearchMilestoneTracker = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [activeMilestone, setActiveMilestone] = useState(3);

  const completedCount = milestones.filter(m => m.status === "completed").length;
  const totalProgress = Math.round(milestones.reduce((acc, m) => acc + m.progress, 0) / milestones.length);

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
          <div className="p-2 bg-cyan-500/20 rounded-xl">
            <Target className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white/90" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Research Milestone Tracker
            </h2>
            <p className="text-xs text-white/50" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              Glowing nodes with animated gradient flow
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-white/30" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            OVERALL PROGRESS
          </div>
          <div className="text-lg font-bold text-cyan-300" style={{ fontFamily: "'Orbitron', monospace" }}>
            {totalProgress}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 via-cyan-400 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${totalProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ boxShadow: "0 0 20px #00ff8855" }}
          />
        </div>
        <div className="flex justify-between mt-1">
          {milestones.map((m, i) => (
            <div key={m.id} className="text-[8px] text-white/30" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              {m.name.slice(0, 4)}
            </div>
          ))}
        </div>
      </div>

      {/* Milestone Nodes */}
      <div className="relative">
        {/* Animated Connecting Line */}
        <svg className="absolute top-6 left-[29px] w-0.5 h-[calc(100%-48px)]" style={{ zIndex: 0 }}>
          <motion.line
            x1="0" y1="0" x2="0" y2="100%"
            stroke="url(#gradient)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00ff88" />
              <stop offset="50%" stopColor="#00b4ff" />
              <stop offset="100%" stopColor="#ffffff20" />
            </linearGradient>
          </defs>
        </svg>

        <div className="space-y-4">
          {milestones.map((milestone, index) => {
            const isActive = activeMilestone === milestone.id;
            const isExpanded = expandedId === milestone.id;
            const isCompleted = milestone.status === "completed";
            const isInProgress = milestone.status === "in-progress";
            const delay = index * 0.15;

            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay, duration: 0.4 }}
                className="relative flex gap-4"
              >
                {/* Node */}
                <motion.div
                  className="relative flex-shrink-0 w-14 h-14 rounded-full border-2 flex items-center justify-center cursor-pointer"
                  style={{
                    borderColor: nodeColors[milestone.status] || "#ffffff30",
                    backgroundColor: `${nodeColors[milestone.status]}15` || "#ffffff10",
                    boxShadow: isCompleted ? "0 0 20px #00ff8844, 0 0 40px #00ff8822" :
                               isInProgress ? "0 0 20px #00b4ff44, 0 0 40px #00b4ff22" :
                               "none"
                  }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => {
                    setActiveMilestone(milestone.id);
                    setExpandedId(isExpanded ? null : milestone.id);
                  }}
                  animate={isInProgress ? {
                    boxShadow: ["0 0 20px #00b4ff44", "0 0 30px #00b4ff66", "0 0 20px #00b4ff44"]
                  } : {}}
                  transition={{ duration: 2, repeat: isInProgress ? Infinity : 0 }}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : isInProgress ? (
                    <Play className="w-6 h-6 text-blue-400" />
                  ) : (
                    <Circle className="w-6 h-6 text-white/30" />
                  )}

                  {/* Pulse animation for active */}
                  {isInProgress && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-blue-400"
                      animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                {/* Content */}
                <div className="flex-1">
                  <motion.div
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isActive
                        ? "bg-white/10 border-white/20"
                        : "bg-white/5 border-white/10 hover:border-white/15"
                    }`}
                    onClick={() => setExpandedId(isExpanded ? null : milestone.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-sm font-bold text-white/90" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                          {milestone.name}
                        </h3>
                        <p className="text-[10px] text-white/40" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                          {milestone.date}
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${
                        isCompleted ? "bg-green-500/20 text-green-300 border border-green-400/30" :
                        isInProgress ? "bg-blue-500/20 text-blue-300 border border-blue-400/30" :
                        "bg-white/10 text-white/40 border border-white/20"
                      }`}>
                        {milestone.status === "completed" ? "✓ Done" :
                         milestone.status === "in-progress" ? "In Progress" :
                         "Pending"}
                      </span>
                    </div>

                    {/* Progress Ring */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="relative w-8 h-8">
                        <svg className="w-8 h-8 -rotate-90">
                          <circle
                            cx="16" cy="16" r="14"
                            fill="none"
                            stroke="#ffffff10"
                            strokeWidth="3"
                          />
                          <motion.circle
                            cx="16" cy="16" r="14"
                            fill="none"
                            stroke={isCompleted ? "#00ff88" : isInProgress ? "#00b4ff" : "#ffffff30"}
                            strokeWidth="3"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: milestone.progress / 100 }}
                            transition={{ duration: 1, delay: delay + 0.3 }}
                            style={{ filter: `drop-shadow(0 0 6px ${isCompleted ? "#00ff88" : isInProgress ? "#00b4ff" : "transparent"})` }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[8px] text-white/60" style={{ fontFamily: "'Orbitron', monospace" }}>
                            {milestone.progress}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: isCompleted ? "linear-gradient(90deg, #00ff88, #00ff88)" :
                                         isInProgress ? "linear-gradient(90deg, #00b4ff, #00ffff)" :
                                         "#ffffff10"
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${milestone.progress}%` }}
                            transition={{ duration: 1, delay: delay + 0.3 }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-3 border-t border-white/5">
                            <p className="text-xs text-white/50 mb-3" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                              {milestone.description}
                            </p>
                            <div className="space-y-1.5">
                              {milestone.subMilestones.map((sub, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                  className="flex items-center gap-2 text-[11px]"
                                >
                                  {sub.done ? (
                                    <CheckCircle className="w-3 h-3 text-green-400" />
                                  ) : (
                                    <Clock className="w-3 h-3 text-white/30" />
                                  )}
                                  <span className={sub.done ? "text-green-300" : "text-white/40"}>
                                    {sub.name}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { label: "COMPLETED", value: completedCount, color: "#00ff88" },
          { label: "IN PROGRESS", value: milestones.filter(m => m.status === "in-progress").length, color: "#00b4ff" },
          { label: "PENDING", value: milestones.filter(m => m.status === "pending").length, color: "#ffffff40" }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="p-3 bg-white/5 rounded-xl text-center"
          >
            <div className="text-xl font-bold" style={{ fontFamily: "'Orbitron', monospace", color: stat.color }}>
              {stat.value}
            </div>
            <div className="text-[9px] text-white/30 mt-1" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ResearchMilestoneTracker;
