import { motion } from "framer-motion";
import { useState } from "react";
import { BarChart3 } from "lucide-react";

const unis = [
  { 
    name: "KUET", 
    match: 92, 
    rank: "Top 5", 
    courses: ["CSE", "ETE", "CE"],
    funding: "Government",
    location: "Khulna",
    color: "#00ff88"
  },
  { 
    name: "BUET", 
    match: 78, 
    rank: "Top 2", 
    courses: ["CSE", "EEE", "ME"],
    funding: "Government",
    location: "Dhaka",
    color: "#00b4ff"
  },
  { 
    name: "DU", 
    match: 65, 
    rank: "Top 3", 
    courses: ["CSE", "ITE", "SE"],
    funding: "Government",
    location: "Dhaka",
    color: "#ff8800"
  }
];

const UniComparisonMatrix = () => {
  const [selectedUni, setSelectedUni] = useState(null);

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
              University Comparison Matrix
            </h2>
            <p className="text-xs text-white/50" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              Side-by-side match scores with animated bars
            </p>
          </div>
        </div>
      </div>

      {/* University Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {unis.map((uni, index) => (
          <motion.div
            key={uni.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedUni(selectedUni === uni.name ? null : uni.name)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedUni === uni.name
                ? "bg-white/10 border-" + uni.color + "30"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <div className="text-center mb-3">
              <div className="text-xl font-bold" style={{ color: uni.color, fontFamily: "'Orbitron', monospace" }}>
                {uni.name}
              </div>
              <div className="text-[10px] text-white/40" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                {uni.location}
              </div>
            </div>

            {/* Match Score Bar */}
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-[11px] text-white/60">Match</span>
                <span className="text-[11px] font-bold" style={{ color: uni.color, fontFamily: "'Orbitron', monospace" }}>
                  {uni.match}%
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: uni.color }}
                  initial={{ width: 0 }}
                  animate={{ width: uni.match + "%" }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
              </div>
            </div>

            {/* Rank */}
            <div className="mb-2">
              <span className="text-[10px] text-white/40">Rank: </span>
              <span className="text-[11px] text-white/70">{uni.rank}</span>
            </div>

            {/* Courses */}
            <div className="flex flex-wrap gap-1">
              {uni.courses.map(c => (
                <span key={c} className="px-2 py-0.5 bg-white/5 rounded text-[9px] text-white/50">
                  {c}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Expanded Details */}
      {selectedUni && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-white/5 border border-white/10 rounded-xl"
        >
          <div className="text-[10px] text-white/30 mb-2" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            DETAILS: {selectedUni}
          </div>
          {unis.filter(u => u.name === selectedUni).map(uni => (
            <div key={uni.name} className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[11px] text-white/60">Funding</span>
                <span className="text-[11px] text-white/70">{uni.funding}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[11px] text-white/60">Courses</span>
                <span className="text-[11px] text-white/70">{uni.courses.join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[11px] text-white/60">Location</span>
                <span className="text-[11px] text-white/70">{uni.location}</span>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "BEST MATCH", value: "KUET", icon: "🏆" },
          { label: "AVG SCORE", value: "78.3%", icon: "📊" },
          { label: "TARGET", value: "BUET", icon: "🎯" }
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

export default UniComparisonMatrix;
