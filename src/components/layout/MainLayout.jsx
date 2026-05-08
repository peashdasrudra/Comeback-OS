import { useApp } from "../../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";

const MainLayout = ({ children }) => {
  const { sidebarOpen, setSidebarOpen, tab, setTab, xp } = useApp();
  const level = Math.floor(xp / 100) + 1;

  const navItems = [
    { id: "home", label: "Dashboard", icon: "🏠" },
    { id: "plan", label: "Thesis Plan", icon: "📅" },
    { id: "body", label: "Body Gain", icon: "💪" },
    { id: "focus", label: "Focus Mode", icon: "⏱" },
    { id: "admissions", label: "Admissions", icon: "🎓" },
    { id: "life", label: "Life Style", icon: "⚡" },
    { id: "progress", label: "Progress", icon: "📈" },
    { id: "tasks", label: "Tasks & Logs", icon: "✅" },
    { id: "goals", label: "Goals", icon: "🎯" },
    { id: "stats", label: "Statistics", icon: "🏅" },
    { id: "me", label: "Profile", icon: "👤" },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white max-w-[430px] mx-auto relative overflow-hidden">
      
      {/* 🔮 VIBRANT BACKGROUND ORBS (This makes the glass work) */}
      <div className="fixed top-[-5%] left-[-20%] w-[300px] h-[300px] bg-emerald-500/30 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed top-[40%] right-[-20%] w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-5%] left-[10%] w-[300px] h-[300px] bg-emerald-700/20 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* 🧊 FROSTED HEADER (Exactly 64px tall) */}
      <div className="fixed top-0 max-w-[430px] w-full h-[64px] z-[100] bg-black/20 backdrop-blur-2xl border-b border-white/10 flex items-center px-4 justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors backdrop-blur-md"
          >
            <Menu size={18} className="text-emerald-400" />
          </button>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="text-[11px] font-orbitron font-bold text-emerald-400 tracking-wider">LV.{level}</span>
            <span className="text-[9px] text-gray-400 font-mono tracking-widest">{xp} XP</span>
          </div>
        </div>
      </div>

      {/* SIDEBAR OVERLAY */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR MENU */}
      <motion.div 
        animate={{ width: sidebarOpen ? 260 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 bottom-0 bg-[#050b14]/95 backdrop-blur-3xl border-r border-white/10 z-[1000] overflow-hidden"
      >
        <div className="w-[260px] h-full flex flex-col">
          <div className="p-6 border-b border-white/5 mt-4">
            <div className="text-lg font-bold font-orbitron text-emerald-400 tracking-widest">COMEBACK OS</div>
          </div>
          <nav className="flex-1 p-3 overflow-y-auto scrollbar-hide">
            {navItems.map((item) => (
              <div
                key={item.id}
                onClick={() => { setTab(item.id); setSidebarOpen(false); }}
                className={`flex items-center gap-4 px-4 py-3 mb-2 rounded-xl cursor-pointer transition-all ${
                  tab === item.id ? 'bg-emerald-500/20 border border-emerald-500/50 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'hover:bg-white/5 text-gray-400'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className={`text-sm font-medium tracking-wide ${tab === item.id ? 'font-bold' : ''}`}>{item.label}</span>
              </div>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* 🚀 MAIN CONTENT AREA (pt-20 is 80px, clearing the 64px header perfectly) */}
      <div className="relative z-10 pt-20 pb-28 px-4 h-screen overflow-y-auto scrollbar-hide">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[430px] bg-black/40 backdrop-blur-3xl border-t border-white/10 flex z-[100] pb-2 pt-2 px-2">
        {navItems.slice(0, 5).map((item) => (
          <div 
            key={item.id} onClick={() => setTab(item.id)}
            className={`flex-1 py-2 text-center cursor-pointer transition-all rounded-xl ${tab === item.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
          >
            <div className="text-xl mb-1">{item.icon}</div>
            <div className={`text-[8px] font-bold tracking-wider uppercase ${tab === item.id ? 'text-emerald-400' : 'text-gray-500'}`}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainLayout;