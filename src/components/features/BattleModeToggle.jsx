import { motion } from "framer-motion";
import { useState } from "react";
import { Zap, X } from "lucide-react";

const BattleModeToggle = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentTask, setCurrentTask] = useState("Complete SHAP integration");

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
          <div className="p-2 bg-orange-500/20 rounded-xl">
            <Zap className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white/90" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Battle Mode Toggle
            </h2>
            <p className="text-xs text-white/50" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              Full-screen focus mode
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsActive(!isActive)}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            isActive 
              ? "bg-orange-500/20 text-orange-300 border border-orange-400/30" 
              : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
          }`}
        >
          {isActive ? "Deactivate" : "Activate"}
        </motion.button>
      </div>

      {/* Active Task Display */}
      <div className="mb-6">
        <div className="text-[10px] text-white/30 mb-2" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
          CURRENT FOCUS
        </div>
        <motion.div
          className="p-4 bg-white/5 border border-white/10 rounded-xl text-center"
          animate={isActive ? { scale: 1.05 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            className="text-lg font-bold text-orange-300"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
            animate={isActive ? { 
              textShadow: ["0 0 10px #ff880044", "0 0 20px #ff880066", "0 0 10px #ff880044"]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {currentTask}
          </motion.div>
        </motion.div>
      </div>

      {/* Full-Screen Overlay */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center p-8"
          >
            <motion.div
              animate={{ 
                textShadow: ["0 0 20px #ff880044", "0 0 40px #ff880066", "0 0 20px #ff880044"]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-4xl font-bold text-orange-300 mb-4"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              BATTLE MODE
            </motion.div>
            <div className="text-xl text-white/80 mb-8" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              {currentTask}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsActive(false)}
              className="px-6 py-3 bg-orange-500/20 border border-orange-400/30 rounded-xl text-orange-300 text-sm font-medium"
            >
              <X className="w-4 h-4 inline mr-2" />
              Exit Battle Mode
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "STATUS", value: isActive ? "Active" : "Idle", icon: isActive ? "🔥" : "⚫️" },
          { label: "FOCUS", value: currentTask.slice(0, 15) + "...", icon: "🎯" },
          { label: "MODE", value: "Night Owl", icon: "🌙" }
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

export default BattleModeToggle;
