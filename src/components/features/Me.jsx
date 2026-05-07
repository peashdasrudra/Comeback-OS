import { useApp } from "../../context/AppContext";
import { motion } from "framer-motion";
import { Award } from "lucide-react";

const Me = () => {
  const { xp } = useApp();

  const achievements = [
    { year: "2018", title: "National Debate Champion", icon: "🎤", color: "text-yellow-400" },
    { year: "2018", title: "SSC Golden A+", icon: "📜", color: "text-green-400" },
    { year: "2020", title: "HSC Golden A+", icon: "📜", color: "text-green-400" },
    { year: "2024", title: "Inter Dept Debate Champion", icon: "🏆", color: "text-yellow-400" },
    { year: "2026", title: "BSc CSE — 3.95/4.00 CGPA", icon: "🎓", color: "text-green-400" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3 p-4"
    >
      {/* Profile Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-green-500/20 rounded-2xl p-5 shadow-xl">
        <div className="text-2xl font-bold font-orbitron text-green-400">Peash Das Rudra</div>
        <div className="text-xs text-gray-500 mt-1">Final-year CSE • RevOps Team Lead</div>
        <div className="text-xs text-gray-600 mt-1">Northern University of Business and Technology</div>
      </div>

      {/* XP Summary */}
      <div className="bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Award size={16} className="text-yellow-400" />
          <span className="text-[9px] text-yellow-400 tracking-[2px] font-mono">ACHIEVEMENTS</span>
        </div>
        {achievements.map((a, i) => (
          <div key={i} className="bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-3 mb-2 last:mb-0">
            <div className="text-sm text-gray-200 font-rajdhani font-semibold">{a.icon} {a.title}</div>
            <div className="text-[9px] text-gray-600 mt-1">{a.year}</div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-3 text-center">
          <div className="text-2xl font-bold font-orbitron text-blue-400">3.95</div>
          <div className="text-[7px] text-gray-500 mt-1">CGPA</div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-green-500/20 rounded-2xl p-3 text-center">
          <div className="text-2xl font-bold font-orbitron text-green-400">{xp}</div>
          <div className="text-[7px] text-gray-500 mt-1">TOTAL XP</div>
        </div>
      </div>
    </motion.div>
  );
};

export default Me;
