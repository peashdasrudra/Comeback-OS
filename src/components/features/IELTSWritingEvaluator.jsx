import { motion } from "framer-motion";
import { useState } from "react";
import { PenTool, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";

const criteria = [
  { id: "task", label: "Task Response", score: 6.5, color: "#3b82f6" },
  { id: "coherence", label: "Coherence & Cohesion", score: 7.0, color: "#10b981" },
  { id: "lexical", label: "Lexical Resource", score: 6.0, color: "#f59e0b" },
  { id: "grammar", label: "Grammatical Range", score: 6.5, color: "#8b5cf6" }
];

const IELTSWritingEvaluator = ({ T, C, mono, orb, raj }) => {
  const [task, setTask] = useState(1);
  const [text, setText] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  const overall = (criteria.reduce((a, c) => a + c.score, 0) / criteria.length).toFixed(1);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      style={{ ...C({ padding: "14px", marginBottom: 12, border: `1px solid ${T.gold}44` }) }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 9, color: T.gold, letterSpacing: 2, ...mono }}>✍️ IELTS WRITING EVALUATOR</div>
        <div style={{ fontSize: 8, color: T.muted, ...mono }}>Task {task}</div>
      </div>

      {/* Task Selector */}
      <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
        {[1, 2].map(t => (
          <motion.button key={t} whileTap={{ scale: 0.95 }} onClick={() => { setTask(t); setShowFeedback(false); }}
            style={{ flex: 1, padding: "6px", background: task === t ? T.gold + "22" : T.bg2, border: `1px solid ${task === t ? T.gold + "55" : T.border}`,
              color: task === t ? T.gold : T.muted, borderRadius: 6, fontSize: 9, ...mono, cursor: "pointer" }}>
            TASK {t}
          </motion.button>
        ))}
      </div>

      {/* Writing Area */}
      <textarea value={text} onChange={e => { setText(e.target.value); setShowFeedback(false); }}
        placeholder={`Write your Task ${task} response here... (minimum ${task === 1 ? '150' : '250'} words)`}
        style={{ width: "100%", minHeight: 120, background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8,
          padding: 10, color: T.text, fontSize: 11, ...raj, lineHeight: 1.7, resize: "vertical", boxSizing: "border-box", marginBottom: 8 }} />

      {/* Word Count */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 9, ...mono }}>
        <span style={{ color: wordCount >= (task === 1 ? 150 : 250) ? T.green : T.orange }}>
          {wordCount} words {wordCount >= (task === 1 ? 150 : 250) ? "✓" : ""}
        </span>
        <span style={{ color: T.muted }}>Target: {task === 1 ? 150 : 250}+ words</span>
      </div>

      {/* Evaluate Button */}
      <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowFeedback(true)}
        disabled={wordCount < 50}
        style={{ width: "100%", padding: "10px", background: wordCount >= 50 ? T.gold + "22" : T.bg3, border: `1px solid ${T.gold}44`,
          color: wordCount >= 50 ? T.gold : T.muted, borderRadius: 8, fontSize: 10, ...mono, cursor: wordCount >= 50 ? "pointer" : "not-allowed", marginBottom: 12 }}>
        EVALUATE
      </motion.button>

      {/* Feedback Section */}
      {showFeedback && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.5 }}>
          <div style={{ padding: "10px", background: T.bg2, borderRadius: 8, border: `1px solid ${T.gold}33` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 10, color: T.muted, ...mono }}>OVERALL BAND</span>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}
                style={{ ...orb, fontSize: 20, fontWeight: 900, color: T.gold }}>{overall}</motion.div>
            </div>

            {criteria.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 9, color: T.text, ...raj }}>{c.label}</span>
                  <span style={{ fontSize: 10, color: c.color, ...mono, fontWeight: 600 }}>{c.score}</span>
                </div>
                <div style={{ height: 4, background: T.bg3, borderRadius: 2, overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(c.score / 9) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                    style={{ height: "100%", background: c.color, borderRadius: 2, boxShadow: `0 0 6px ${c.color}44` }} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default IELTSWritingEvaluator;
