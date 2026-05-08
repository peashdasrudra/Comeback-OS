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

  const academicDegrees = [
    { year: "2012", degree: "PSC", title: "Primary School Certificate", grade: "A+" },
    { year: "2015", degree: "JSC", title: "Junior School Certificate", grade: "A+" },
    { year: "2018", degree: "SSC", title: "Secondary School Certificate", grade: "Golden A+" },
    { year: "2020", degree: "HSC", title: "Higher Secondary Certificate", grade: "Golden A+" },
    { year: "2026", degree: "BSc", title: "Computer Science & Engineering", grade: "3.95/4.00" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3 p-4"
    >
      {/* Hero Card with Radial Mesh Gradient */}
      <motion.div
        whileHover={{ scale: 1.01, y: -2 }}
        className="bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-900/20 via-[#020408] to-[#020408] backdrop-blur-xl border border-green-500/20 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-white/[0.02] rounded-2xl" />
        <div className="relative z-10">
          <div className="text-2xl font-bold font-orbitron text-green-400">Peash Das Rudra</div>
          <div className="text-xs text-gray-500 mt-1">Final-year CSE • RevOps Team Lead</div>
          <div className="text-xs text-gray-600 mt-1">Northern University of Business and Technology</div>
        </div>
      </motion.div>

      {/* Academic Record — Vertical Timeline */}
      <motion.div
        whileHover={{ scale: 1.005, y: -1 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-5">
          <Award size={16} className="text-blue-400" />
          <span className="text-[9px] text-blue-400 tracking-[2px] font-mono">ACADEMIC RECORD</span>
        </div>
        <div className="relative border-l-2 border-white/5 pl-6 space-y-5">
          {academicDegrees.map((d, i) => (
            <motion.div
              key={d.degree}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="relative"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 + 0.2, type: "spring", stiffness: 400 }}
                className="absolute w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_12px_#22c55e] -left-[23px] top-2"
              />
              <div className="text-xs font-bold font-orbitron text-green-400">{d.degree}</div>
              <div className="text-[11px] text-gray-300 font-rajdhani">{d.title}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] text-gray-600">{d.year}</span>
                <span className="text-[9px] text-yellow-400 font-mono">{d.grade}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        whileHover={{ scale: 1.005, y: -1 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Award size={16} className="text-yellow-400" />
          <span className="text-[9px] text-yellow-400 tracking-[2px] font-mono">ACHIEVEMENTS</span>
        </div>
        {achievements.map((a, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            whileHover={{ scale: 1.01, y: -1 }}
            className="bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-3 mb-2 last:mb-0"
          >
            <div className="text-sm text-gray-200 font-rajdhani font-semibold">{a.icon} {a.title}</div>
            <div className="text-[9px] text-gray-600 mt-1">{a.year}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-white/5 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-3 text-center"
        >
          <div className="text-2xl font-bold font-orbitron text-blue-400">3.95</div>
          <div className="text-[7px] text-gray-500 mt-1">CGPA</div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-white/5 backdrop-blur-xl border border-green-500/20 rounded-2xl p-3 text-center"
        >
          <div className="text-2xl font-bold font-orbitron text-green-400">{xp}</div>
          <div className="text-[7px] text-gray-500 mt-1">TOTAL XP</div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Me;
