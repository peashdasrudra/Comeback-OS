import { useApp } from "../../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";

const MainLayout = ({ children }) => {
  const { sidebarOpen, setSidebarOpen, tab, setTab } = useApp();

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
    <div className="min-h-screen bg-[#020408] text-white max-w-[430px] mx-auto relative" style={{ paddingBottom: '68px' }}>
      {/* Sidebar Toggle */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-3 left-3 z-[1001] w-9 h-9 rounded-lg bg-[#0a1520]/90 border border-[#0d2030] flex items-center justify-center hover:bg-[#0d2030] transition-colors"
      >
        <Menu size={16} className="text-green-400" />
      </button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[999]"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div 
        animate={{ width: sidebarOpen ? 240 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 bottom-0 bg-[#0a1520]/98 backdrop-blur-xl border-r border-[#0d2030] z-[1000] overflow-hidden"
      >
        <div className="w-[240px] h-full flex flex-col">
          <div className="p-5 border-b border-[#0d2030]">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💎</span>
              <div>
                <div className="text-sm font-bold font-orbitron text-green-400">COMEBACK</div>
                <div className="text-[8px] text-gray-500 font-mono">v1.0 • ELITE</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-2 overflow-y-auto">
            {navItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ x: 4 }}
                onClick={() => { setTab(item.id); setSidebarOpen(false); }}
                className={`flex items-center gap-3 px-3 py-2.5 mb-1 rounded-xl cursor-pointer transition-all ${
                  tab === item.id 
                    ? 'bg-green-400/10 border-l-[3px] border-green-400' 
                    : 'hover:bg-white/5 border-l-[3px] border-transparent'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className={`text-xs font-rajdhani ${tab === item.id ? 'text-green-400 font-semibold' : 'text-gray-300'}`}>
                  {item.label}
                </span>
                {tab === item.id && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400"
                  />
                )}
              </motion.div>
            ))}
          </nav>

          <div className="p-4 border-t border-[#0d2030]">
            <div className="text-[8px] text-gray-600 font-mono text-center">
              © 2026 Peash Rudra • Comeback-OS
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="pt-16 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Tab-specific content */}
            <div className="mt-4">
              {children}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[430px] bg-[#020408]/97 border-t border-green-400/20 flex z-[100]">
        {navItems.slice(0, 5).map((item) => (
          <div 
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex-1 py-1.5 text-center cursor-pointer border-t-2 transition-all ${
              tab === item.id 
                ? 'border-green-400 bg-green-400/5' 
                : 'border-transparent hover:bg-white/5'
            }`}
          >
            <div className="text-xs">{item.icon}</div>
            <div className={`text-[6px] mt-0.5 ${tab === item.id ? 'text-green-400' : 'text-gray-500'}`}>
              {item.label.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainLayout;
