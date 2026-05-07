import { motion } from "framer-motion";
import { useState } from "react";
import { BookOpen, CheckCircle, Lock, FileText } from "lucide-react";

const chapters = [];

const ThesisChapterProgress = ({ T, C, mono, orb, raj }) => {
  const [chapterData, setChapterData] = useState(chapters);
  const totalPct = Math.round(chapterData.reduce((a, c) => a + c.pct, 0) / chapterData.length);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      style={{ ...C({ padding: "14px", marginBottom: 12, border: `1px solid ${T.green}44` }) }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 9, color: T.green, letterSpacing: 2, ...mono }}>📚 THESIS CHAPTER PROGRESS</div>
        <div style={{ ...orb, fontSize: 14, fontWeight: 900, color: T.green }}>{totalPct}%</div>
      </div>

      {/* Overall Ring */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, position: "relative" }}>
        <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="60" cy="60" r="50" fill="none" stroke={T.bg3} strokeWidth="8" />
          <motion.circle cx="60" cy="60" r="50" fill="none" 
            stroke={T.green} strokeWidth="8" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: totalPct / 100 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ filter: `drop-shadow(0 0 6px ${T.green}66)` }} />
        </svg>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
          <div style={{ ...orb, fontSize: 24, fontWeight: 900, color: T.bright }}>{totalPct}%</div>
          <div style={{ fontSize: 7, color: T.muted, ...mono }}>COMPLETE</div>
        </div>
      </div>

      {/* Chapter List */}
      {chapterData.map((ch, i) => (
        <motion.div key={ch.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
          style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, padding: "8px 10px",
            background: ch.status === "done" ? ch.color + "08" : T.bg2,
            borderRadius: 8, border: `1px solid ${ch.status === "done" ? ch.color + "44" : T.border}` }}>
          
          <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: "50%", 
            background: ch.status === "done" ? ch.color : T.bg3,
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            {ch.status === "done" ? <CheckCircle size={16} color="#fff" /> : <Lock size={14} color={T.muted} />}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: T.text, ...raj, fontWeight: 600 }}>Chapter {ch.id}: {ch.title}</span>
              <span style={{ fontSize: 9, color: ch.color, ...mono }}>{ch.pct}%</span>
            </div>
            <div style={{ height: 4, background: T.bg3, borderRadius: 2, overflow: "hidden" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${ch.pct}%` }} transition={{ duration: 0.8, delay: i * 0.15 }}
                style={{ height: "100%", background: `linear-gradient(90deg, ${ch.color}, ${ch.color}88)`, borderRadius: 2,
                  boxShadow: `0 0 8px ${ch.color}44` }} />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ThesisChapterProgress;
