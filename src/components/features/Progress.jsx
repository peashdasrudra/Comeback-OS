import { useApp } from "../../context/AppContext";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const Progress = () => {
  const { weightLog } = useApp();
  const curWeight = weightLog[weightLog.length - 1]?.weight || 50;
  const wGained = Math.max(0, curWeight - 50);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3 p-4"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white/5 backdrop-blur-xl border border-green-500/20 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold font-orbitron text-green-400">27%</div>
          <div className="text-[8px] text-gray-500 mt-1">THESIS</div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold font-orbitron text-pink-400">+{wGained}kg</div>
          <div className="text-[8px] text-gray-500 mt-1">BODY</div>
        </div>
      </div>
      
      {/* Weight Progress */}
      <div className="bg-white/5 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-pink-400" />
          <span className="text-[9px] text-pink-400 tracking-[2px] font-mono">WEIGHT GAIN</span>
        </div>
        <div className="text-center mb-3">
          <div className="text-3xl font-bold font-orbitron text-pink-400">{curWeight}kg</div>
          <div className="text-[9px] text-gray-500">CURRENT</div>
        </div>
        <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full" style={{ width: Math.min(100, (curWeight / 60) * 100) + '%' }} />
        </div>
      </div>

      {/* Thesis Progress */}
      <div className="bg-white/5 backdrop-blur-xl border border-green-500/20 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-green-400" />
          <span className="text-[9px] text-green-400 tracking-[2px] font-mono">THESIS PROGRESS</span>
        </div>
        {[
          { ch: 'Ch 1', title: 'Introduction', pct: 40 },
          { ch: 'Ch 2', title: 'Literature Review', pct: 70 },
          { ch: 'Ch 3', title: 'Methodology', pct: 20 },
          { ch: 'Ch 4', title: 'Results', pct: 5 },
          { ch: 'Ch 5', title: 'Conclusion', pct: 0 }
        ].map((ch, i) => (
          <div key={i} className="mb-2 last:mb-0">
            <div className="flex justify-between mb-1">
              <span className="text-[10px] text-gray-300">{ch.ch} {ch.title}</span>
              <span className="text-[9px] text-gray-500">{ch.pct}%</span>
            </div>
            <div className="h-1.5 bg-gray-900 rounded-full">
              <div className="h-full bg-green-400/60 rounded-full" style={{ width: ch.pct + '%' }} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Progress;
