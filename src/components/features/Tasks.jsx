import { useApp } from "../../context/AppContext";
import { motion } from "framer-motion";
import { Pencil, Droplets } from "lucide-react";

const Tasks = () => {
  const { waterCount, setWaterCount, setDailyLog, gainXP, dailyLogText, setDailyLogText, TODAY } = useApp();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3 p-4"
    >
      {/* Daily Log */}
      <div className="bg-white/5 backdrop-blur-xl border border-green-500/20 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Pencil size={16} className="text-green-400" />
          <span className="text-[9px] text-green-400 tracking-[2px] font-mono">DAILY LOG</span>
        </div>
        <textarea 
          value={dailyLogText} 
          onChange={e => setDailyLogText(e.target.value)}
          placeholder="Log your thoughts, wins, blockers..."
          className="w-full h-24 bg-gray-900/50 border border-white/10 rounded-lg p-3 text-xs text-gray-300 font-rajdhani resize-none focus:border-green-400/40 outline-none"
        />
        <button 
          onClick={() => {
            if (dailyLogText.trim()) {
              setDailyLog(p => [{ id: Date.now(), text: dailyLogText, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), date: TODAY }, ...p]);
              setDailyLogText("");
              gainXP(5);
            }
          }}
          className="mt-2 w-full py-2 bg-green-500/20 border border-green-500/40 rounded-lg text-green-400 text-xs font-mono hover:bg-green-500/30 transition-colors"
        >
          SAVE ENTRY +5 XP
        </button>
      </div>

      {/* Water Intake */}
      <div className="bg-white/5 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Droplets size={16} className="text-blue-400" />
          <span className="text-[9px] text-blue-400 tracking-[2px] font-mono">WATER INTAKE</span>
        </div>
        <div className="flex gap-1.5 mb-2">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              onClick={() => {
                if (i === waterCount) { 
                  const nx = waterCount + 1; 
                  setWaterCount(nx); 
                  if (nx === 8) gainXP(15); 
                } else if (i < waterCount) setWaterCount(i);
              }}
              className={`flex-1 h-8 rounded cursor-pointer transition-all ${
                i < waterCount 
                  ? 'bg-blue-400/40 border-2 border-blue-400' 
                  : 'bg-transparent border-2 border-white/10 hover:border-blue-400/40'
              }`}
            />
          ))}
        </div>
        <div className="text-center text-xs font-orbitron font-bold text-blue-400">{waterCount}/8 glasses</div>
      </div>
    </motion.div>
  );
};

export default Tasks;
