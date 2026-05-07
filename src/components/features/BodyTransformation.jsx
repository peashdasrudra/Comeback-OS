import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { TrendingUp, Target } from "lucide-react";

const BodyTransformation = () => {
  const [currentWeight, setCurrentWeight] = useState(54.2);
  const targetWeight = 60;
  const startWeight = 50;
  const progress = ((currentWeight - startWeight) / (targetWeight - startWeight)) * 100;

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentWeight < 55.5) {
        setCurrentWeight(prev => +(prev + 0.1).toFixed(1));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [currentWeight]);

  const workouts = [
    { day: "Mon", chest: 85, back: 78, legs: 92 },
    { day: "Tue", chest: 0, back: 0, legs: 0 },
    { day: "Wed", chest: 78, back: 88, legs: 85 },
    { day: "Thu", chest: 0, back: 0, legs: 0 },
    { day: "Fri", chest: 90, back: 82, legs: 88 },
    { day: "Sat", chest: 0, back: 0, legs: 95 },
    { day: "Sun", chest: 0, back: 0, legs: 0 }
  ];

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
              Body Transformation
            </h2>
            <p className="text-xs text-white/50" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              50kg → 60kg muscle gain journey
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-white/30" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            CURRENT
          </div>
          <motion.div
            className="text-2xl font-bold text-green-300"
            style={{ fontFamily: "'Orbitron', monospace" }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {currentWeight}kg
          </motion.div>
        </div>
      </div>

      {/* Progress Visualization */}
      <div className="mb-6 relative" style={{ height: 300 }}>
        <svg width="100%" height="100%" viewBox="0 0 400 300">
          {/* Grid */}
          {[50, 52, 54, 56, 58, 60].map((val) => (
            <g key={val}>
              <line x1="40" y1={300 - (val - 50) * 50} x2="380" y2={300 - (val - 50) * 50} stroke="#ffffff10" strokeWidth="0.5" />
              <text x="35" y={300 - (val - 50) * 50 + 4} fill="#3a6a5a" fontSize="9" fontFamily="Share Tech Mono, monospace" textAnchor="end">
                {val}kg
              </text>
            </g>
          ))}

          {/* Human Silhouette - simplified */}
          <motion.rect
            x="180" y={300 - (currentWeight - 50) * 50 - 120}
            width="40"
            height="120"
            rx="8"
            fill="rgba(0, 255, 136, 0.1)"
            stroke="#00ff88"
            strokeWidth="1"
            initial={{ height: 0 }}
            animate={{ height: 120 }}
            transition={{ duration: 1 }}
          />
          <motion.circle
            cx="200" cy={300 - (currentWeight - 50) * 50 - 140}
            r="20"
            fill="rgba(0, 255, 136, 0.1)"
            stroke="#00ff88"
            strokeWidth="1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          />

          {/* Weight Line */}
          <motion.line
            x1="40" y1={300 - (startWeight - 50) * 50}
            x2="200" y2={300 - (currentWeight - 50) * 50}
            stroke="#00ff88"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5 }}
            style={{ filter: "drop-shadow(0 0 6px #00ff88)" }}
          />

          {/* Target Line */}
          <line x1="40" y1={300 - (targetWeight - 50) * 50} x2="380" y2={300 - (targetWeight - 50) * 50} stroke="#ffd700" strokeWidth="1" strokeDasharray="5 5" />
          <text x="385" y={300 - (targetWeight - 50) * 50 + 4} fill="#ffd700" fontSize="9" fontFamily="Share Tech Mono, monospace">
            Target
          </text>
        </svg>
      </div>

      {/* Weekly Workout Grid */}
      <div className="mb-6">
        <div className="text-[10px] text-white/30 mb-2" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
          WEEKLY WORKOUTS
        </div>
        <div className="grid grid-cols-7 gap-2">
          {workouts.map((day, i) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-[9px] text-white/40 mb-1" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                {day.day}
              </div>
              {day.chest > 0 ? (
                <div className="space-y-1">
                  <div className="h-8 bg-white/5 rounded overflow-hidden">
                    <motion.div
                      className="h-full rounded"
                      style={{ backgroundColor: "#00ff88" }}
                      initial={{ height: 0 }}
                      animate={{ height: `${day.chest}%` }}
                      transition={{ delay: i * 0.1 + 0.3 }}
                    />
                  </div>
                  <div className="h-8 bg-white/5 rounded overflow-hidden">
                    <motion.div
                      className="h-full rounded"
                      style={{ backgroundColor: "#00b4ff" }}
                      initial={{ height: 0 }}
                      animate={{ height: `${day.back}%` }}
                      transition={{ delay: i * 0.1 + 0.5 }}
                    />
                  </div>
                  <div className="h-8 bg-white/5 rounded overflow-hidden">
                    <motion.div
                      className="h-full rounded"
                      style={{ backgroundColor: "#ff8800" }}
                      initial={{ height: 0 }}
                      animate={{ height: `${day.legs}%` }}
                      transition={{ delay: i * 0.1 + 0.7 }}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-24 flex items-center justify-center">
                  <span className="text-[9px] text-white/20">Rest</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "START", value: `${startWeight}kg`, icon: "🏁" },
          { label: "CURRENT", value: `${currentWeight}kg`, icon: "💪" },
          { label: "GAINED", value: `+${(currentWeight - startWeight).toFixed(1)}kg`, icon: "📈" },
          { label: "LEFT", value: `${(targetWeight - currentWeight).toFixed(1)}kg`, icon: "🎯" }
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

export default BodyTransformation;
