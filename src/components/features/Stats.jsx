import { useApp } from "../../context/AppContext";
import { motion } from "framer-motion";
const Stats = () => {
  const { xp, weightLog } = useApp();
  const xpLevel = Math.floor(xp / 100) + 1;
  const curWeight = weightLog[weightLog.length - 1]?.weight || 50;
  const wGained = Math.max(0, curWeight - 50);

  const getRank = (xp) => {
    if (xp >= 10000) return { title: "LEGEND", color: "text-yellow-400" };
    if (xp >= 5000) return { title: "MASTER", color: "text-pink-400" };
    if (xp >= 2500) return { title: "ELITE", color: "text-blue-400" };
    if (xp >= 1000) return { title: "PRO", color: "text-green-400" };
    return { title: "NEWBIE", color: "text-gray-500" };
  };

  const r = getRank(xp);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3 p-4"
    >
      {/* Rank Card */}
      <div className="bg-gradient-to-br from-yellow-900/20 to-black border-2 border-yellow-500/40 rounded-2xl p-4 shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-[9px] text-yellow-400 tracking-[3px] font-mono">COMEBACK RANK</div>
            <div className={`text-2xl font-bold font-orbitron ${r.color}`}>{r.title}</div>
            <div className="text-xs text-gray-500 mt-1 font-mono">Level {xpLevel} • {xp} XP</div>
          </div>
          <div className="bg-yellow-400/20 border border-yellow-400/40 rounded-xl p-3 text-center">
            <div className="text-3xl font-bold font-orbitron text-yellow-400">{xpLevel}</div>
            <div className="text-[7px] text-yellow-400/80 font-mono">LEVEL</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 backdrop-blur-xl border border-green-500/20 rounded-2xl p-3 text-center">
          <div className="text-xl font-bold font-orbitron text-green-400">{Math.min(100, (/* thesis progress */ 27))}%</div>
          <div className="text-[7px] text-gray-500 mt-1">THESIS</div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-3 text-center">
          <div className="text-xl font-bold font-orbitron text-orange-400">0</div>
          <div className="text-[7px] text-gray-500 mt-1">WORKOUTS</div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-3 text-center">
          <div className="text-xl font-bold font-orbitron text-pink-400">{wGained}kg</div>
          <div className="text-[7px] text-gray-500 mt-1">GAINED</div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-3 text-center">
          <div className="text-xl font-bold font-orbitron text-blue-400">{xp}</div>
          <div className="text-[7px] text-gray-500 mt-1">TOTAL XP</div>
        </div>
      </div>
    </motion.div>
  );
};

export default Stats;
