import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, Calendar, Dumbbell, Clock, User, TrendingUp, 
  CheckSquare, Target, Zap, Trophy, X 
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

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1040,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={{ width: sidebarOpen ? 240 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 1050,
          overflow: "hidden",
        }}
      >
        <div style={{
          width: 240,
          height: "100%",
          background: "rgba(10,21,32,0.95)",
          backdropFilter: "blur(12px)",
          borderRight: `1px solid ${T.border}`,
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{
            padding: 16,
            borderBottom: `1px solid ${T.border}`,
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}>
                <span style={{fontSize: 24}}>💎</span>
                <div>
                  <div style={{
                    fontWeight: "bold",
                    color: T.green,
                    fontSize: 12,
                    fontFamily: "'Orbitron',monospace",
                  }}>COMEBACK</div>
                  <div style={{
                    fontSize: 10,
                    color: T.muted,
                    fontFamily: "'Share Tech Mono',monospace",
                  }}>v1.0 • ELITE</div>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  padding: 6,
                  borderRadius: 8,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: T.muted,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <nav style={{
            flex: 1,
            padding: 8,
            overflowY: "auto",
          }}>
            {navItems.map((item, i) => {
              const isActive = tab === item.id;
              const itemColor = colorMap[item.color] || T.green;
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => { setTab(item.id); setSidebarOpen(false); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "all 200ms",
                    marginBottom: 4,
                    background: isActive ? `${itemColor}10` : "transparent",
                    borderLeft: `3px solid ${isActive ? itemColor : "transparent"}`,
                    color: isActive ? itemColor : T.muted,
                  }}
                >
                  <Icon size={18} style={{color: isActive ? itemColor : T.muted}} />
                  <span style={{
                    fontWeight: 500,
                    fontSize: 13,
                    color: isActive ? itemColor : T.muted,
                  }}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      style={{
                        marginLeft: "auto",
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: itemColor,
                      }}
                    />
                  )}
                </motion.div>
              );
            })}
          </nav>

          <div style={{
            padding: 12,
            borderTop: `1px solid ${T.border}`,
            textAlign: "center",
            fontSize: 10,
            color: T.muted,
            fontFamily: "'Share Tech Mono',monospace",
          }}>
            © 2026 Peash Rudra • Comeback-OS
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;