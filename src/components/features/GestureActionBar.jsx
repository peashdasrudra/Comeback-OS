import { motion, useDragControls, PanInfo } from "framer-motion";
import { useState } from "react";
import { Dumbbell, BookOpen, PenTool, Zap } from "lucide-react";

const actions = [
  { id: "workout", label: "Workout", icon: Dumbbell, color: "#ff006e", description: "Log your training" },
  { id: "study", label: "Study", icon: BookOpen, color: "#00b4ff", description: "Thesis & research" },
  { id: "log", label: "Log", icon: PenTool, color: "#ff8800", description: "Daily war log" },
  { id: "ielts", label: "IELTS", icon: Zap, color: "#10b981", description: "Practice test" },
  { id: "smoke", label: "Quit", icon: Zap, color: "#a855f7", description: "Smoke-free day" },
];

const GestureActionBar = ({ T, C, mono, orb, raj }) => {
  const [activeAction, setActiveAction] = useState(null);
  const [dragX, setDragX] = useState(0);
  const controls = useDragControls();

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 50) setDragX(prev => prev - 100);
    else if (info.offset.x < -50) setDragX(prev => prev + 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(0,255,136,0.3)" }}
      className="card-glow"
      style={{ ...C({ padding: "14px", marginBottom: 12 }), background: "linear-gradient(135deg, rgba(0,255,136,0.08), rgba(0,180,255,0.08))", backdropFilter: "blur(20px)" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 9, color: T.pink, letterSpacing: 2, ...mono }}>👆 GESTURE ACTION BAR</div>
        <Zap size={16} color={T.pink} />
      </div>

      <motion.div drag="x" dragControls={controls} dragConstraints={{ left: -200, right: 0 }}
        onDragEnd={handleDragEnd}
        style={{ display: "flex", gap: 8, cursor: "grab", paddingBottom: 4 }}
        whileTap={{ cursor: "grabbing" }}
      >
        {actions.map((action, i) => {
          const Icon = action.icon;
          const isActive = activeAction === action.id;
          return (
            <motion.div key={action.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{ minWidth: 72, padding: "12px 8px", background: isActive ? `${action.color}22` : T.bg2,
                borderRadius: 12, border: `1px solid ${isActive ? action.color + "44" : T.border}`,
                textAlign: "center", cursor: "pointer",
                boxShadow: isActive ? `0 0 16px ${action.color}33` : "none" }}
              onClick={() => setActiveAction(isActive ? null : action.id)}
            >
              <motion.div animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
                style={{ marginBottom: 6 }}>
                <Icon size={20} color={isActive ? action.color : T.muted} />
              </motion.div>
              <div style={{ fontSize: 9, color: isActive ? action.color : T.text, ...raj, fontWeight: 600 }}>
                {action.label}
              </div>
              <div style={{ fontSize: 6, color: T.muted, ...mono, marginTop: 2 }}>{action.description}</div>
            </motion.div>
          );
        })}
      </motion.div>

      {activeAction && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: 10, padding: "10px 12px", background: T.bg2, borderRadius: 8,
            border: `1px solid ${actions.find(a => a.id === activeAction)?.color}44` }}
        >
          <div style={{ fontSize: 10, color: actions.find(a => a.id === activeAction)?.color, ...raj, fontWeight: 700 }}>
            ⚡ {actions.find(a => a.id === activeAction)?.label} Mode Activated
          </div>
          <div style={{ fontSize: 8, color: T.muted, ...mono, marginTop: 4 }}>
            Swipe or tap to switch between quick actions
          </div>
        </motion.div>
      )}

      <div style={{ fontSize: 7, color: T.muted, ...mono, marginTop: 8, textAlign: "center", opacity: 0.6 }}>
        ← SWIPE FOR MORE ACTIONS →
      </div>
    </motion.div>
  );
};

export default GestureActionBar;
