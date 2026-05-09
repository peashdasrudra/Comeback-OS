import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, Calendar, Dumbbell, Clock, User, TrendingUp, 
  CheckSquare, Target, Zap, Trophy, X, ChevronLeft, ChevronRight 
} from "lucide-react";

const navItems = [
  { id: "home", icon: Home, label: "Dashboard", color: "primary" },
  { id: "plan", icon: Calendar, label: "Thesis Plan", color: "secondary" },
  { id: "body", icon: Dumbbell, label: "Body Gain", color: "accent" },
  { id: "focus", icon: Clock, label: "Focus Mode", color: "warning" },
  { id: "admissions", icon: Trophy, label: "Admissions", color: "purple-500" },
  { id: "life", icon: Zap, label: "Life Style", color: "amber-500" },
  { id: "progress", icon: TrendingUp, label: "Progress", color: "emerald-500" },
  { id: "tasks", icon: CheckSquare, label: "Tasks & Logs", color: "cyan-500" },
  { id: "goals", icon: Target, label: "Goals", color: "pink-500" },
  { id: "stats", icon: Trophy, label: "Statistics", color: "gold" },
  { id: "me", icon: User, label: "Profile", color: "purple-400" },
];

const Sidebar = ({ tab, setTab, sidebarOpen, setSidebarOpen, T }) => {
  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={{ width: sidebarOpen ? 60 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 bottom-0 z-50 overflow-hidden"
      >
        <div className="w-60 h-full bg-bg-card/95 backdrop-blur-xl border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💎</span>
                <div>
                  <div className="font-bold text-primary text-sm font-display">COMEBACK</div>
                  <div className="text-xs text-text-muted font-mono">v1.0 • ELITE</div>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-bg-surface transition-colors"
              >
                <X size={16} className="text-text-muted" />
              </button>
            </div>
          </div>

          <nav className="flex-1 p-2 overflow-y-auto">
            {navItems.map((item, i) => {
              const isActive = tab === item.id;
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => { setTab(item.id); setSidebarOpen(false); }}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 mb-1 group ${
                    isActive 
                      ? `bg-${item.color}/10 border-l-3 border-${item.color}` 
                      : "hover:bg-bg-surface border-l-3 border-transparent"
                  }`}
                >
                  <Icon 
                    size={18} 
                    className={`transition-colors ${isActive ? `text-${item.color}` : "text-text-muted group-hover:text-text-secondary"}`} 
                  />
                  <span className={`font-medium transition-colors ${isActive ? `text-${item.color}` : "text-text-muted group-hover:text-text-secondary"}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className={`absolute right-2 w-2 h-2 rounded-full bg-${item.color}`}
                    />
                  )}
                </motion.div>
              );
            })}
          </nav>

          <div className="p-3 border-t border-border">
            <div className="text-center text-xs text-text-muted font-mono">
              © 2026 Peash Rudra • Comeback-OS
            </div>
          </div>
        </div>
      </motion.div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-3 z-[600] w-9 h-9 rounded-lg bg-bg-card/90 backdrop-blur-xl border border-border flex items-center justify-center transition-all duration-300"
        style={{ left: sidebarOpen ? 260 : 12 }}
      >
        {sidebarOpen ? (
          <ChevronLeft size={16} className="text-primary" />
        ) : (
          <ChevronRight size={16} className="text-primary" />
        )}
      </motion.button>
    </>
  );
};

export default Sidebar;