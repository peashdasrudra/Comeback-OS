import { useApp } from "../../context/AppContext";
import { motion } from "framer-motion";
import { Clock, CheckSquare } from "lucide-react";

const Focus = () => {
  const { habits, setHabits, gainXP, TODAY } = useApp();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3 p-4"
    >
      <div className="bg-white/5 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={16} className="text-orange-400" />
          <span className="text-[9px] text-orange-400 tracking-[2px] font-mono">FOCUS MODE</span>
        </div>
        <div className="text-center mb-4">
          <div className="text-4xl font-mono font-bold text-orange-400">25:00</div>
          <button className="mt-3 px-4 py-2 bg-orange-500/20 border border-orange-500/40 rounded-lg text-orange-400 text-xs font-mono hover:bg-orange-500/30 transition-colors">
            START
          </button>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <CheckSquare size={16} className="text-cyan-400" />
          <span className="text-[9px] text-cyan-400 tracking-[2px] font-mono">DAILY HABITS</span>
        </div>
        {habits.map(h => (
          <div 
            key={h.id}
            className={`flex items-center gap-3 p-3 mb-2 rounded-xl border transition-all ${
              h.lastDone === TODAY 
                ? 'border-white/10' 
                : 'bg-transparent border-white/10 hover:bg-white/5'
            }`}
            style={h.lastDone === TODAY ? { background: h.color + '1A', borderColor: h.color + '66' } : {}}
          >
            <div 
              onClick={() => {
                setHabits(p => p.map(x => 
                  x.id === h.id 
                    ? { 
                        ...x, 
                        lastDone: TODAY,
                        streak: x.lastDone === new Date(Date.now()-86400000).toDateString() ? x.streak + 1 : 1 
                      } 
                    : x
                ));
                if (h.lastDone !== TODAY) gainXP(10);
              }}
              className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                h.lastDone === TODAY 
                  ? '' 
                  : 'border-white/20 hover:border-white/40'
              }`}
              style={h.lastDone === TODAY ? { background: h.color + '55', borderColor: h.color } : {}}
            >
              {h.lastDone === TODAY && <span className="text-xs" style={{ color: h.color }}>✓</span>}
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-300 font-rajdhani">{h.name}</div>
              <div className="text-[9px] mt-0.5" style={{ color: h.color }}>🔥 {h.streak || 0} day streak</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Focus;
