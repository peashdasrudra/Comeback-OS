// eslint-disable-next-line
import { useState } from "react";
import { motion } from "framer-motion";
import { Home, Calendar, Dumbbell, Clock, User, TrendingUp, CheckSquare, Target, Zap, Trophy, X, ChevronLeft, ChevronRight } from "lucide-react";

const navItems = [
  { id: "home", icon: Home, label: "Dashboard", color: "#00ff88" },
  { id: "plan", icon: Calendar, label: "Thesis Plan", color: "#00b4ff" },
  { id: "body", icon: Dumbbell, label: "Body Gain", color: "#ff006e" },
  { id: "focus", icon: Clock, label: "Focus Mode", color: "#ff8800" },
  { id: "admissions", icon: Trophy, label: "Admissions", color: "#a855f7" },
  { id: "life", icon: Zap, label: "Life Style", color: "#f59e0b" },
  { id: "progress", icon: TrendingUp, label: "Progress", color: "#10b981" },
  { id: "tasks", icon: CheckSquare, label: "Tasks & Logs", color: "#06b6d4" },
  { id: "goals", icon: Target, label: "Goals", color: "#ec4899" },
  { id: "stats", icon: Trophy, label: "Statistics", color: "#fbbf24" },
  { id: "me", icon: User, label: "Profile", color: "#8b5cf6" },
];

const Sidebar = ({ tab, setTab, sidebarOpen, setSidebarOpen, T }) => {
  return (
    <>
      {sidebarOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 999 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <motion.div animate={{ width: sidebarOpen ? 240 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          position: "fixed", top: 0, left: 0, bottom: 0,
          background: "rgba(10,15,20,0.98)", backdropFilter: "blur(20px)",
          borderRight: `1px solid ${T.border}`, zIndex: 1000, overflow: "hidden",
          boxShadow: sidebarOpen ? "4px 0 20px rgba(0,0,0,0.3)" : "none"
        }}
      >
        <div style={{ width: 240, height: "100%", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "20px 16px", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 24 }}>💎</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: T.green, fontFamily: "Orbitron" }}>COMEBACK</div>
                  <div style={{ fontSize: 8, color: T.muted, fontFamily: "monospace" }}>v1.0 • ELITE</div>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={16} color={T.muted} />
              </button>
            </div>
          </div>

          <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
            {navItems.map((item, i) => {
              const Icon = item.icon;
              const isActive = tab === item.id;
              return (
                <motion.div key={item.id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => { setTab(item.id); setSidebarOpen(false); }}
                  style={{
                    padding: "10px 12px", marginBottom: 4, borderRadius: 10,
                    background: isActive ? `${item.color}11` : "transparent",
                    borderLeft: `3px solid ${isActive ? item.color : "transparent"}`,
                    cursor: "pointer", transition: "all 0.2s",
                    display: "flex", alignItems: "center", gap: 12
                  }}
                  whileHover={{ background: `${item.color}08`, x: 4 }}
                >
                  <Icon size={18} color={isActive ? item.color : T.muted} />
                  <span style={{
                    fontSize: 12, color: isActive ? item.color : T.text,
                    fontWeight: isActive ? 600 : 400, fontFamily: "Rajdhani"
                  }}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div layoutId="activeIndicator" style={{
                      marginLeft: "auto", width: 6, height: 6,
                      borderRadius: "50%", background: item.color
                    }} />
                  )}
                </motion.div>
              );
            })}
          </nav>

          <div style={{ padding: "12px 16px", borderTop: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 8, color: T.dim, fontFamily: "monospace", textAlign: "center" }}>
              © 2026 Peash Rudra • Comeback-OS
            </div>
          </div>
        </div>
      </motion.div>

      {/* Toggle Button - Always Visible */}
      <motion.button whileTap={{ scale: 0.95 }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: "fixed", top: 12,
          left: sidebarOpen ? 248 : 12,
          zIndex: 1001,
          width: 36, height: 36, borderRadius: 8,
          background: "rgba(10,15,20,0.9)", border: `1px solid ${T.border}`,
          cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", transition: "left 0.3s"
        }}
      >
        {sidebarOpen ? <ChevronLeft size={16} color={T.green} /> : <ChevronRight size={16} color={T.green} />}
      </motion.button>
    </>
  );
};

export default Sidebar;
