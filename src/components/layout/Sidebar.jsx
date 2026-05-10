import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, Calendar, Dumbbell, Clock, User, TrendingUp, 
  CheckSquare, Target, Zap, Trophy, X, BarChart3
} from "lucide-react";

const navItems = [
  { id: "home", icon: Home, label: "Dashboard", emoji: "🏠", color: "primary" },
  { id: "plan", icon: Calendar, label: "Thesis Plan", emoji: "📅", color: "secondary" },
  { id: "body", icon: Dumbbell, label: "Body Gain", emoji: "💪", color: "accent" },
  { id: "focus", icon: Clock, label: "Focus Mode", emoji: "⏱", color: "warning" },
  { id: "tasks", icon: CheckSquare, label: "Tasks & Logs", emoji: "✅", color: "cyan-500" },
  { id: "progress", icon: TrendingUp, label: "Progress", emoji: "📈", color: "emerald-500" },
  { id: "admissions", icon: Trophy, label: "Admissions", emoji: "🎓", color: "purple-500" },
  { id: "goals", icon: Target, label: "Goals", emoji: "🎯", color: "pink-500" },
  { id: "life", icon: Zap, label: "Life Style", emoji: "⚡", color: "amber-500" },
  { id: "stats", icon: BarChart3, label: "Statistics", emoji: "🏅", color: "gold" },
  { id: "me", icon: User, label: "Profile", emoji: "👤", color: "purple-400" },
];

import { useEffect } from "react";

const Sidebar = ({ tab, setTab, sidebarOpen, setSidebarOpen, T }) => {
  const colorMap = {
    "primary": T.green,
    "secondary": T.blue,
    "accent": T.orange,
    "warning": T.orange,
    "gold": T.gold,
    "purple-500": T.pink,
    "amber-500": T.orange,
    "emerald-500": T.green,
    "cyan-500": T.cyan,
    "pink-500": T.pink,
    "purple-400": T.pink,
  };

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sidebarOpen]);

  const handleNav = (id) => {
    setTab(id);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Backdrop overlay — NO blur to prevent lingering blur bug */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1040,
              background: "rgba(0,0,0,0.6)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="sidebar-panel"
            initial={{ x: -260, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -260, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              width: 260,
              zIndex: 1050,
              background: "linear-gradient(180deg, rgba(6,13,18,0.98), rgba(2,4,8,0.99))",
              borderRight: `1px solid ${T.green}15`,
              display: "flex",
              flexDirection: "column",
              boxShadow: `8px 0 40px rgba(0,0,0,0.6), 0 0 80px ${T.green}08`,
            }}
          >
            {/* Header */}
            <div style={{
              padding: "20px 16px 16px",
              borderBottom: `1px solid ${T.border}`,
              background: `linear-gradient(135deg, ${T.green}06, transparent)`,
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <motion.div
                    initial={{ rotate: -20, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                    style={{ fontSize: 28, filter: `drop-shadow(0 0 8px ${T.green}66)` }}
                  >⚔️</motion.div>
                  <div>
                    <div style={{
                      fontWeight: 900,
                      color: T.green,
                      fontSize: 14,
                      fontFamily: "'Orbitron',monospace",
                      letterSpacing: 2,
                      textShadow: `0 0 10px ${T.green}44`,
                    }}>COMEBACK</div>
                    <div style={{
                      fontSize: 9,
                      color: T.muted,
                      fontFamily: "'Share Tech Mono',monospace",
                      letterSpacing: 1,
                    }}>OPERATING SYSTEM v2.0</div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    padding: 6,
                    borderRadius: 8,
                    background: `${T.red}15`,
                    border: `1px solid ${T.red}33`,
                    cursor: "pointer",
                    color: T.red,
                    display: "flex",
                    alignItems: "center",
                    transition: "all .2s",
                  }}
                >
                  <X size={14} />
                </motion.button>
              </div>
            </div>

            {/* Navigation items */}
            <nav style={{
              flex: 1,
              padding: "8px 8px",
              overflowY: "auto",
            }}>
              <div style={{
                fontSize: 8,
                color: T.dim,
                fontFamily: "'Share Tech Mono',monospace",
                letterSpacing: 3,
                padding: "8px 12px 6px",
              }}>NAVIGATE</div>
              {navItems.map((item, i) => {
                const isActive = tab === item.id;
                const itemColor = colorMap[item.color] || T.green;
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.03, type: "spring", stiffness: 300 }}
                    whileHover={{ x: 4, backgroundColor: `${itemColor}10` }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleNav(item.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "11px 12px",
                      borderRadius: 10,
                      cursor: "pointer",
                      marginBottom: 2,
                      background: isActive ? `${itemColor}12` : "transparent",
                      borderLeft: `3px solid ${isActive ? itemColor : "transparent"}`,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Active glow */}
                    {isActive && (
                      <div style={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 40,
                        height: 40,
                        background: `radial-gradient(circle, ${itemColor}20, transparent)`,
                        pointerEvents: "none",
                      }}/>
                    )}
                    <span style={{ fontSize: 16, position: "relative" }}>{item.emoji}</span>
                    <span style={{
                      fontWeight: isActive ? 700 : 500,
                      fontSize: 13,
                      color: isActive ? itemColor : T.text,
                      fontFamily: "'Rajdhani',sans-serif",
                      position: "relative",
                    }}>
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="sidebarActive"
                        style={{
                          marginLeft: "auto",
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: itemColor,
                          boxShadow: `0 0 8px ${itemColor}`,
                        }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </nav>

            {/* Footer */}
            <div style={{
              padding: "12px 16px",
              borderTop: `1px solid ${T.border}`,
              textAlign: "center",
            }}>
              <div style={{
                fontSize: 9,
                color: T.dim,
                fontFamily: "'Share Tech Mono',monospace",
                letterSpacing: 1,
              }}>© 2026 Peash Rudra</div>
              <div style={{
                fontSize: 8,
                color: T.green,
                fontFamily: "'Share Tech Mono',monospace",
                letterSpacing: 2,
                marginTop: 2,
                opacity: 0.5,
              }}>COMEBACK-OS</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;