import { motion } from "framer-motion";
import { useState } from "react";
import { PieChart, Apple, Beef, Wheat } from "lucide-react";

const macroData = {
  protein: { current: 120, target: 140, color: "#3b82f6", icon: Beef, label: "PROTEIN" },
  carbs: { current: 350, target: 400, color: "#f59e0b", icon: Wheat, label: "CARBS" },
  fats: { current: 80, target: 90, color: "#ef4444", icon: Apple, label: "FATS" }
};

const NutritionMacroSplit = ({ T, C, mono, orb, raj, totalCalories }) => {
  const [selectedMacro, setSelectedMacro] = useState(null);
  const totalCurrent = Object.values(macroData).reduce((a, m) => a + m.current, 0);
  const totalTarget = Object.values(macroData).reduce((a, m) => a + m.target, 0);

  return (
    <motion.div initial={{ opacity: 0, rotate: -5 }} animate={{ opacity: 1, rotate: 0 }} transition={{ duration: 0.6 }}
      style={{ ...C({ padding: "14px", marginBottom: 12, border: `1px solid ${T.green}44` }) }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 9, color: T.green, letterSpacing: 2, ...mono }}>🍽️ NUTRITION MACRO SPLIT</div>
        <PieChart size={16} color={T.green} />
      </div>

      {/* Donut Chart Simulation */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, position: "relative" }}>
        <svg width="140" height="140">
          {Object.entries(macroData).map(([key, macro], i) => {
            const offset = Object.entries(macroData).slice(0, i).reduce((a, [_, m]) => a + (m.current / totalCurrent) * 100, 0);
            return (
              <motion.circle key={key} cx="70" cy="70" r="55" fill="none" 
                stroke={macro.color} strokeWidth="20" strokeLinecap="round"
                initial={{ pathLength: 0, rotate: -90 }} 
                animate={{ pathLength: macro.current / totalCurrent, rotate: -90 + offset }}
                transition={{ duration: 1, delay: i * 0.2 }}
                style={{ transformOrigin: "center", cursor: "pointer" }}
                onClick={() => setSelectedMacro(selectedMacro === key ? null : key)} />
            );
          })}
          {/* Center text */}
          <text x="70" y="65" textAnchor="middle" style={{ fontSize: 20, fontWeight: 900, fill: T.bright, fontFamily: "Orbitron" }}>
            {totalCalories}
          </text>
          <text x="70" y="80" textAnchor="middle" style={{ fontSize: 8, fill: T.muted, fontFamily: "monospace" }}>
            CALORIES
          </text>
        </svg>
      </div>

      {/* Macro Cards */}
      {Object.entries(macroData).map(([key, macro], i) => {
        const pct = (macro.current / macro.target) * 100;
        const met = pct >= 90;
        return (
          <motion.div key={key} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
            style={{ marginBottom: 8, padding: "10px 12px", background: selectedMacro === key ? macro.color + "11" : T.bg2,
              borderRadius: 8, border: `1px solid ${selectedMacro === key ? macro.color + "55" : T.border}`,
              cursor: "pointer" }} onClick={() => setSelectedMacro(selectedMacro === key ? null : key)}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <macro.icon size={16} color={macro.color} />
                <span style={{ fontSize: 10, color: T.text, ...mono, fontWeight: 600 }}>{macro.label}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: macro.color, ...orb }}>{macro.current}</span>
                <span style={{ fontSize: 8, color: T.muted, ...mono }}>/{macro.target}g</span>
              </div>
            </div>

            <div style={{ height: 6, background: T.bg3, borderRadius: 3, overflow: "hidden" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }} transition={{ duration: 0.8, delay: i * 0.15 }}
                style={{ height: "100%", background: `conic-gradient(from 0deg, ${macro.color}, ${macro.color}88)`,
                  borderRadius: 3, boxShadow: `0 0 10px ${macro.color}44` }} />
            </div>
            
            {selectedMacro === key && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.3 }}
                style={{ marginTop: 8, padding: "6px 8px", background: macro.color + "0d", borderRadius: 6, fontSize: 9, color: T.text, ...raj, lineHeight: 1.5 }}>
                {met ? "✅ Target met! Great job maintaining your surplus." : `Need ${macro.target - macro.current}g more to hit target. ${pct < 50 ? "Focus on this macro!" : "Almost there!"}`}
              </motion.div>
            )}
          </motion.div>
        );
      })}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 8, borderTop: `1px solid ${T.border}` }}>
        <span style={{ fontSize: 9, color: T.muted, ...mono }}>DAILY TARGET</span>
        <span style={{ fontSize: 11, color: T.green, ...raj, fontWeight: 700 }}>{totalTarget}g total</span>
      </div>
    </motion.div>
  );
};

export default NutritionMacroSplit;
