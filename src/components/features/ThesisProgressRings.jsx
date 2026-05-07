import { motion } from "framer-motion";
import { useState } from "react";
import { BookOpen, CheckCircle } from "lucide-react";

const chapters = [
  { num: 1, title: "Introduction", progress: 40, color: "#00ff88", pages: 12 },
  { num: 2, title: "Literature Review", progress: 70, color: "#00b4ff", pages: 25 },
  { num: 3, title: "Methodology", progress: 20, color: "#ff8800", pages: 30 },
  { num: 4, title: "Results & Analysis", progress: 5, color: "#ff006e", pages: 28 },
  { num: 5, title: "Conclusion", progress: 0, color: "#a855f7", pages: 10 },
];

const ThesisProgressRings = ({ T, C, mono, orb, raj }) => {
  const [active, setActive] = useState(null);
  const totalProgress = chapters.reduce((a, c) => a + c.progress, 0) / chapters.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(0,255,136,0.3)" }}
      className="card-glow"
      style={{ ...C({ padding: "14px", marginBottom: 12 }), background: "linear-gradient(135deg, rgba(0,255,136,0.08), rgba(0,180,255,0.08))", backdropFilter: "blur(20px)", border: `1px solid ${T.green}44` }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 9, color: T.green, letterSpacing: 2, ...mono }}>📖 THESIS PROGRESS</div>
        <BookOpen size={16} color={T.green} />
      </div>

      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 7, color: T.muted, ...mono, marginBottom: 4 }}>OVERALL COMPLETION</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${totalProgress}%` }}
            style={{ height: 8, background: `linear-gradient(90deg, ${T.green}, ${T.blue})`, borderRadius: 4, maxWidth: 200 }}
          />
          <span style={{ ...orb, fontSize: 14, fontWeight: 900, color: T.green }}>{totalProgress.toFixed(0)}%</span>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
        {chapters.map((ch, i) => {
          const radius = 28;
          const circumference = 2 * Math.PI * radius;
          const offset = circumference - (ch.progress / 100) * circumference;
          return (
            <motion.div key={ch.num} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              style={{ textAlign: "center", cursor: "pointer", width: 80 }}
              onClick={() => setActive(active === i ? null : i)}
            >
              <svg width={80} height={80} viewBox="0 0 80 80">
                <circle cx={40} cy={40} r={radius} fill="none" stroke={T.border} strokeWidth={4} />
                <motion.circle cx={40} cy={40} r={radius} fill="none"
                  stroke={ch.color} strokeWidth={4} strokeLinecap="round"
                  strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }} transition={{ duration: 1, delay: i * 0.2 }}
                  transform="rotate(-90 40 40)"
                />
                <text x={40} y={38} textAnchor="middle" fill={T.bright} fontSize={14} fontWeight={900} fontFamily="Orbitron">
                  {ch.progress}%
                </text>
                <text x={40} y={52} textAnchor="middle" fill={T.muted} fontSize={7} fontFamily="monospace">
                  Ch {ch.num}
                </text>
              </svg>
              <div style={{ fontSize: 9, color: T.text, ...raj, fontWeight: 600, marginTop: 4 }}>{ch.title}</div>
              <div style={{ fontSize: 7, color: T.muted, ...mono }}>{ch.pages} pages</div>
              {ch.progress >= 100 && <CheckCircle size={12} color={T.green} style={{ marginTop: 2 }} />}
            </motion.div>
          );
        })}
      </div>

      {active !== null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: 12, padding: "10px 12px", background: T.bg2, borderRadius: 8, border: `1px solid ${chapters[active].color}44` }}>
          <div style={{ fontSize: 11, color: chapters[active].color, ...raj, fontWeight: 700 }}>
            Chapter {chapters[active].num}: {chapters[active].title}
          </div>
          <div style={{ fontSize: 9, color: T.muted, ...mono, marginTop: 4 }}>
            Progress: {chapters[active].progress}% • Target: {chapters[active].pages} pages
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ThesisProgressRings;
