import { useApp } from "../../context/AppContext";
import { motion } from "framer-motion";
import { Target, TrendingUp } from "lucide-react";

const Goals = () => {
  const { weightLog } = useApp();
  const curWeight = weightLog[weightLog.length - 1]?.weight || 50;
  const wGained = Math.max(0, curWeight - 50);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3 p-4"
    >
      {/* MSc Admissions */}
      <div className="bg-white/5 backdrop-blur-xl border border-green-500/20 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Target size={16} className="text-green-400" />
          <span className="text-[9px] text-green-400 tracking-[2px] font-mono">MSC ADMISSIONS</span>
        </div>
        {[
          { uni: "KUET", status: "Applying 2026", color: "text-green-400", bg: "bg-green-400/10" },
          { uni: "BUET", status: "Applying 2027", color: "text-blue-400", bg: "bg-blue-400/10" },
          { uni: "KU", status: "Nov 2026", color: "text-orange-400", bg: "bg-orange-400/10" },
          { uni: "DU", status: "Jul 2026", color: "text-purple-400", bg: "bg-purple-400/10" }
        ].map((t, i) => (
          <div key={i} className={`flex justify-between items-center p-3 mb-2 rounded-xl ${t.bg} border border-white/10`}>
            <span className="text-sm text-gray-200 font-rajdhani font-semibold">{t.uni}</span>
            <span className={`text-[9px] px-2 py-0.5 rounded-full ${t.color} border border-current/30`}>{t.status}</span>
          </div>
        ))}
      </div>

      {/* Body Goal */}
      <div className="bg-white/5 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-pink-400" />
          <span className="text-[9px] text-pink-400 tracking-[2px] font-mono">BODY GOAL</span>
        </div>
        <div className="text-center py-5">
          <div className="text-4xl mb-2">🎯</div>
          <div className="text-xl font-bold font-orbitron text-pink-400">50kg → 60kg</div>
          <div className="text-xs text-gray-500 mt-1">Currently: {curWeight}kg • {wGained}kg gained</div>
        </div>
      </div>
    </motion.div>
  );
};

export default Goals;
