import { motion } from "framer-motion";
import { useState } from "react";
import { MoveRight, CheckCircle, Clock, Send, FileCheck, Award } from "lucide-react";

const stages = [
  { id: "planning", label: "PLANNING", color: "#3b82f6", icon: Clock },
  { id: "submitted", label: "SUBMITTED", color: "#a855f7", icon: Send },
  { id: "viva", label: "VIVA", color: "#f59e0b", icon: FileCheck },
  { id: "admitted", label: "ADMITTED", color: "#10b981", icon: Award }
];

const applications = [
  { uni: "KUET", program: "MSc CSE", currentStage: "submitted", color: "#10b981" },
  { uni: "BUET", program: "MSc CSE", currentStage: "planning", color: "#3b82f6" },
  { uni: "KU", program: "MSc CSE", currentStage: "planning", color: "#06b6d4" },
  { uni: "DU", program: "MSc CSE", currentStage: "planning", color: "#8b5cf6" }
];

const AppStatusPipeline = ({ T, C, mono, orb, raj }) => {
  const [apps, setApps] = useState(applications);
  const [draggedApp, setDraggedApp] = useState(null);

  const moveToNext = (index) => {
    setApps(prev => prev.map((app, i) => {
      if (i !== index) return app;
      const currentIdx = stages.findIndex(s => s.id === app.currentStage);
      if (currentIdx < stages.length - 1) {
        return { ...app, currentStage: stages[currentIdx + 1].id };
      }
      return app;
    }));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      style={{ ...C({ padding: "14px", marginBottom: 12, border: `1px solid ${T.orange}44` }) }}
    >
      <div style={{ fontSize: 9, color: T.orange, letterSpacing: 2, ...mono, marginBottom: 10 }}>📋 APPLICATION STATUS PIPELINE</div>

      {/* Stage Headers */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${stages.length}, 1fr)`, gap: 4, marginBottom: 12 }}>
        {stages.map((stage, i) => (
          <motion.div key={stage.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            style={{ textAlign: "center", padding: "6px 4px", background: stage.color + "11", borderRadius: 6, border: `1px solid ${stage.color}33` }}>
            <stage.icon size={16} color={stage.color} style={{ marginBottom: 4 }} />
            <div style={{ fontSize: 7, color: stage.color, ...mono }}>{stage.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Applications */}
      {apps.map((app, idx) => {
        const currentStageIdx = stages.findIndex(s => s.id === app.currentStage);
        return (
          <motion.div key={app.uni} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
            style={{ marginBottom: 8, padding: "10px 12px", background: T.bg2, borderRadius: 8, border: `1px solid ${app.color}22` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 12, color: T.bright, ...raj, fontWeight: 700 }}>{app.uni}</div>
                <div style={{ fontSize: 9, color: T.muted, ...mono }}>{app.program}</div>
              </div>
              {currentStageIdx < stages.length - 1 && (
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => moveToNext(idx)}
                  style={{ padding: "4px 10px", background: T.green + "22", border: `1px solid ${T.green}44`, color: T.green, borderRadius: 6, fontSize: 9, ...mono, cursor: "pointer" }}>
                  NEXT STAGE →
                </motion.button>
              )}
            </div>
            <div style={{ display: "flex", gap: 2 }}>
              {stages.map((stage, i) => (
                <motion.div key={stage.id} animate={{ 
                    background: i <= currentStageIdx ? `${stage.color}44` : T.bg3,
                    border: i <= currentStageIdx ? `1.5px solid ${stage.color}` : `1px solid ${T.border}`
                  }} transition={{ duration: 0.3 }}
                  style={{ flex: 1, height: 6, borderRadius: 3, position: "relative" }}>
                  {i <= currentStageIdx && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}
                      style={{ position: "absolute", right: -4, top: -6, width: 16, height: 16, borderRadius: "50%", background: stage.color,
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#fff" }}>✓</motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default AppStatusPipeline;
