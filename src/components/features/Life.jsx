import { useApp } from "../../context/AppContext";
import { motion } from "framer-motion";
import { Zap, Cigarette, Briefcase } from "lucide-react";

const Life = () => {
  const { xp } = useApp();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3 p-4"
    >
      <div className="bg-white/5 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Cigarette size={16} className="text-orange-400" />
          <span className="text-[9px] text-orange-400 tracking-[2px] font-mono">QUIT SMOKING</span>
        </div>
        <p className="text-sm text-gray-300 font-rajdhani mb-3">Started at ~10/day. Target: 0 by June 1.</p>
        <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full" style={{ width: '50%' }} />
        </div>
      </div>
      
      <div className="bg-white/5 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Briefcase size={16} className="text-blue-400" />
          <span className="text-[9px] text-blue-400 tracking-[2px] font-mono">FREELANCING</span>
        </div>
        <p className="text-sm text-gray-300 font-rajdhani mb-2">Target: Tk 5,000/month starting Aug 2026</p>
        <p className="text-xs text-gray-500 font-rajdhani">Build Fiverr + Upwork profiles using your thesis as portfolio proof.</p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-green-500/20 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={16} className="text-green-400" />
          <span className="text-[9px] text-green-400 tracking-[2px] font-mono">PRODUCTIVITY</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center bg-white/5 rounded-xl p-2">
            <div className="text-xl font-bold font-orbitron text-green-400">{xp}</div>
            <div className="text-[7px] text-gray-500">TOTAL XP</div>
          </div>
          <div className="text-center bg-white/5 rounded-xl p-2">
            <div className="text-xl font-bold font-orbitron text-blue-400">85%</div>
            <div className="text-[7px] text-gray-500">FOCUS</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Life;
