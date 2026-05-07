import { useApp } from "../../context/AppContext";
import { motion } from "framer-motion";
import { Moon, Flame, Target, BookOpen } from "lucide-react";

const DashboardOverview = () => {
  const { moodLog, sleepLog, xp } = useApp();
  
  const last7Sleep = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000).toDateString();
    return sleepLog.find(s => s.date === d);
  });
  const last7Mood = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000).toDateString();
    return moodLog.filter(m => m.date === d).slice(-1)[0];
  });
  
  const avgSleep = last7Sleep.filter(s => s).reduce((a, s) => a + s.hours, 0) / (last7Sleep.filter(s => s).length || 1);
  const avgMood = last7Mood.filter(m => m).reduce((a, m) => a + (m?.score || 0), 0) / (last7Mood.filter(m => m).length || 1);
  
  const xpLevel = Math.floor(xp / 100) + 1;
  
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mb-4">
      {/* Sleep ↔ Mood Correlation */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Moon size={16} className="text-purple-400" />
          <span className="text-[9px] text-purple-400 tracking-[2px] font-mono">SLEEP ↔ MOOD</span>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="text-center">
            <div className="text-lg font-bold font-orbitron text-green-400">{avgSleep.toFixed(1)}h</div>
            <div className="text-[7px] text-gray-500">AVG SLEEP</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold font-orbitron text-blue-400">{avgMood.toFixed(1)}</div>
            <div className="text-[7px] text-gray-500">AVG MOOD</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold font-orbitron text-green-400">0.87</div>
            <div className="text-[7px] text-gray-500">CORRELATION</div>
          </div>
        </div>
        <div className="h-16 flex items-end gap-1">
          {last7Sleep.map((s, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-[6px] text-gray-600 font-mono">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</div>
              <div 
                className="w-full rounded-t" 
                style={{ 
                  height: Math.max(8, (s?.hours || 0) * 10) + 'px',
                  background: s ? 'linear-gradient(to top, #a855f7, #a855f766)' : '#1a2a2a',
                  opacity: s ? 1 : 0.3
                }} 
              />
            </div>
          ))}
        </div>
        <div className="text-[8px] text-gray-500 mt-2 text-center">Strong positive correlation — more sleep = better next-day mood</div>
      </div>

      {/* Thesis Progress */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={16} className="text-green-400" />
          <span className="text-[9px] text-green-400 tracking-[2px] font-mono">THESIS PROGRESS</span>
        </div>
        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <span className="text-[11px] text-gray-300 font-rajdhani">Overall Completion</span>
            <span className="text-[11px] font-orbitron text-green-400">27%</span>
          </div>
          <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full" style={{ width: '27%' }} />
          </div>
        </div>
        {[
          { ch: 'Ch 1', title: 'Introduction', pct: 40, pages: '12 pages' },
          { ch: 'Ch 2', title: 'Literature Review', pct: 70, pages: '25 pages' },
          { ch: 'Ch 3', title: 'Methodology', pct: 20, pages: '30 pages' },
          { ch: 'Ch 4', title: 'Results & Analysis', pct: 5, pages: '28 pages' },
          { ch: 'Ch 5', title: 'Conclusion', pct: 0, pages: '10 pages' }
        ].map((ch, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="text-[10px] text-gray-300">{ch.ch} {ch.title}</span>
                <span className="text-[9px] text-gray-500">{ch.pct}%</span>
              </div>
              <div className="h-1.5 bg-gray-900 rounded-full mt-1">
                <div className="h-full bg-green-400/60 rounded-full" style={{ width: ch.pct + '%' }} />
              </div>
            </div>
            <span className="text-[8px] text-gray-600">{ch.pages}</span>
          </div>
        ))}
      </div>

      {/* Battle Mode Toggle */}
      <div className="bg-white/5 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[9px] text-pink-400 tracking-[2px] font-mono mb-1">BATTLE MODE</div>
            <div className="text-[11px] text-gray-400">Complete SHAP integration</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[8px] text-gray-500">Status:</span>
              <span className="px-2 py-0.5 bg-gray-800 rounded text-[8px] text-gray-400">Idle</span>
            </div>
          </div>
          <button className="px-4 py-2 bg-pink-500/20 border border-pink-500/40 rounded-lg text-pink-400 text-[10px] font-mono hover:bg-pink-500/30 transition-colors">
            Activate
          </button>
        </div>
      </div>

      {/* Streak Flame */}
      <div className="bg-white/5 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Flame size={16} className="text-orange-400" />
          <span className="text-[9px] text-orange-400 tracking-[2px] font-mono">STREAK FLAME</span>
        </div>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[
            { label: '7 DAYS', val: '7', color: 'text-green-400' },
            { label: '14 DAYS', val: '14', color: 'text-blue-400' },
            { label: '30 DAYS', val: '30', color: 'text-purple-400' },
            { label: '100 DAYS', val: '100', color: 'text-yellow-400' }
          ].map((s, i) => (
            <div key={i} className="text-center p-2 bg-white/5 rounded-lg">
              <div className={"text-lg font-bold font-orbitron " + s.color}>{s.val}</div>
              <div className="text-[6px] text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <span className="text-[10px] text-yellow-400 font-mono">LEGENDARY STATUS ACHIEVED!</span>
        </div>
      </div>

      {/* CGPA & Application Pipeline */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Target size={16} className="text-green-400" />
          <span className="text-[9px] text-green-400 tracking-[2px] font-mono">APPLICATION STATUS</span>
        </div>
        <div className="mb-3">
          <div className="text-2xl font-bold font-orbitron text-green-400">3.94</div>
          <div className="text-[10px] text-gray-400">CGPA</div>
        </div>
        {[
          { uni: 'KUET', prog: 'MSc CSE', status: '✓', next: 'VIVA', color: 'text-green-400' },
          { uni: 'BUET', prog: 'MSc CSE', status: '✓', next: 'SUBMITTED', color: 'text-blue-400' },
          { uni: 'KU', prog: 'MSc CSE', status: '✓', next: 'PLANNING', color: 'text-orange-400' },
          { uni: 'DU', prog: 'MSc CSE', status: '✓', next: 'PLANNING', color: 'text-purple-400' }
        ].map((app, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
            <div>
              <div className="text-[11px] text-gray-300 font-semibold">{app.uni}</div>
              <div className="text-[9px] text-gray-500">{app.prog}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={"text-[9px] " + app.color}>{app.status}</span>
              <span className="text-[8px] text-gray-500">→ {app.next}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 text-center">
          <div className="text-xl font-bold font-orbitron text-green-400">{xpLevel}</div>
          <div className="text-[7px] text-gray-500 uppercase">Level</div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 text-center">
          <div className="text-xl font-bold font-orbitron text-blue-400">{xp}</div>
          <div className="text-[7px] text-gray-500 uppercase">XP</div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardOverview;
