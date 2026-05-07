import { motion } from "framer-motion";
import { useState } from "react";
import { Radar } from "lucide-react";

const scholarships = [
  { 
    name: "DAAD", country: "Germany", amount: "€934/month + travel", 
    criteria: [
      { label: "Academic Excellence", current: 85, required: 80, key: "academic" },
      { label: "Research Quality", current: 90, required: 75, key: "research" },
      { label: "Language Skills", current: 60, required: 70, key: "language" },
      { label: "Motivation", current: 95, required: 80, key: "motivation" },
      { label: "Publications", current: 40, required: 60, key: "publications" },
      { label: "International Exposure", current: 55, required: 50, key: "exposure" }
    ]
  },
  { 
    name: "Commonwealth", country: "UK", amount: "Full tuition + stipend",
    criteria: [
      { label: "Academic Excellence", current: 85, required: 85, key: "academic" },
      { label: "Financial Need", current: 90, required: 80, key: "need" },
      { label: "Development Impact", current: 80, required: 75, key: "impact" },
      { label: "Leadership", current: 85, required: 70, key: "leadership" },
      { label: "Career Plan", current: 75, required: 80, key: "career" },
      { label: "References", current: 88, required: 75, key: "references" }
    ]
  }
];

const ScholarshipRadar = ({ T, C, mono, orb, raj }) => {
  const [activeScholarship, setActiveScholarship] = useState(0);
  const [animatedValues, setAnimatedValues] = useState({});

  const current = scholarships[activeScholarship];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
      style={{ ...C({ padding: "14px", marginBottom: 12, border: `1px solid ${T.blue}44` }) }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 9, color: T.blue, letterSpacing: 2, ...mono }}>🎯 SCHOLARSHIP ELIGIBILITY RADAR</div>
        <Radar size={16} color={T.blue} />
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
        {scholarships.map((s, i) => (
          <motion.button key={s.name} whileTap={{ scale: 0.95 }} onClick={() => setActiveScholarship(i)}
            style={{ flex: 1, padding: "6px 8px", background: i === activeScholarship ? T.blue + "22" : T.bg2,
              border: `1px solid ${i === activeScholarship ? T.blue + "55" : T.border}`, borderRadius: 6, cursor: "pointer", textAlign: "center" }}>
            <div style={{ fontSize: 10, color: i === activeScholarship ? T.blue : T.muted, ...raj, fontWeight: 600 }}>{s.name}</div>
            <div style={{ fontSize: 7, color: T.muted, ...mono, marginTop: 2 }}>{s.country}</div>
          </motion.button>
        ))}
      </div>

      <div style={{ fontSize: 10, color: T.text, ...raj, marginBottom: 6 }}>{current.amount}</div>

      {/* Radar Criteria */}
      {current.criteria.map((c, i) => {
        const pct = (c.current / c.required) * 100;
        const met = c.current >= c.required;
        return (
          <motion.div key={c.key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ fontSize: 10, color: T.text, ...raj }}>{c.label}</span>
              <span style={{ fontSize: 9, color: met ? T.green : pct > 80 ? T.orange : T.red, ...mono }}>
                {c.current}/{c.required} {met ? "✓" : ""}
              </span>
            </div>
            <div style={{ height: 6, background: T.bg3, borderRadius: 3, overflow: "hidden", position: "relative" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }} transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{ height: "100%", background: `linear-gradient(90deg, ${met ? T.green : T.orange}, ${met ? "#34d399" : "#fb923c"})`, borderRadius: 3 }} />
              <motion.div animate={{ x: [`${Math.min(pct, 100)}%`, `${Math.min(pct, 100) - 5}%`, `${Math.min(pct, 100)}%`] }} transition={{ duration: 2, repeat: Infinity }}
                style={{ position: "absolute", top: -2, left: `calc(${Math.min(pct, 100)}% - 5px)`, width: 10, height: 10, borderRadius: "50%", background: met ? T.green : T.orange, boxShadow: `0 0 8px ${met ? T.green : T.orange}66` }} />
            </div>
          </motion.div>
        );
      })}

      <div style={{ marginTop: 10, padding: "8px 10px", background: T.bg2, borderRadius: 6, display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 9, color: T.muted, ...mono }}>GAP SCORE</span>
        <span style={{ fontSize: 11, color: T.orange, ...raj, fontWeight: 700 }}>
          {current.criteria.filter(c => c.current < c.required).length} criteria to improve
        </span>
      </div>
    </motion.div>
  );
};

export default ScholarshipRadar;
