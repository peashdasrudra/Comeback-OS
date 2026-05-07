import { motion } from "framer-motion";
import { useState } from "react";
import { Mic, Volume2, Award, Brain } from "lucide-react";

const waveformBars = Array.from({ length: 48 }, (_, i) => ({
  height: 20 + Math.random() * 60 + Math.sin(i * 0.5) * 15,
  delay: i * 0.05,
}));

const bandScores = [
  { band: 7.5, date: "May 20", color: "#10b981", label: "Speaking" },
  { band: 7.0, date: "May 15", color: "#00b4ff", label: "Listening" },
  { band: 6.5, date: "May 10", color: "#f59e0b", label: "Reading" },
  { band: 6.0, date: "May 5", color: "#ef4444", label: "Writing" },
];

const IELTSWaveform = ({ T, C, mono, orb, raj }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [activeBand, setActiveBand] = useState(null);
  const currentBand = 7.5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(168,85,247,0.3)" }}
      className="card-glow"
      style={{ ...C({ padding: "14px", marginBottom: 12 }), background: "linear-gradient(135deg, rgba(168,85,247,0.08), rgba(59,130,246,0.08))", backdropFilter: "blur(20px)" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 9, color: T.blue, letterSpacing: 2, ...mono }}>🎙️ IELTS WAVEFORM</div>
        <Brain size={16} color={T.blue} />
      </div>

      {/* Band Score Overlay */}
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ display: "inline-block", padding: "12px 24px", background: `${T.blue}11`, borderRadius: 16,
            border: `2px solid ${T.blue}44` }}>
          <div style={{ fontSize: 7, color: T.muted, ...mono, marginBottom: 4 }}>AI BAND SCORE</div>
          <div style={{ ...orb, fontSize: 32, fontWeight: 900, color: T.blue }}>{currentBand}</div>
          <div style={{ fontSize: 9, color: T.green, ...raj, fontWeight: 600, marginTop: 2 }}>Target: 7.0 ✅</div>
        </motion.div>
      </div>

      {/* Waveform Visualizer */}
      <div style={{ background: T.bg2, borderRadius: 12, padding: "16px 12px", marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 8, color: T.muted, ...mono }}>AUDIO WAVEFORM</div>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setIsRecording(!isRecording)}
            style={{ padding: "4px 12px", borderRadius: 20, border: `1px solid ${isRecording ? T.red : T.border}`,
              background: isRecording ? `${T.red}22` : "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            <Mic size={12} color={isRecording ? T.red : T.muted} />
            <span style={{ fontSize: 8, color: isRecording ? T.red : T.muted, ...mono }}>{isRecording ? "REC" : "REC"}</span>
          </motion.button>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 80, justifyContent: "center" }}>
          {waveformBars.map((bar, i) => (
            <motion.div key={i} animate={{ height: isRecording ? [bar.height / 2, bar.height, bar.height / 2] : bar.height / 2 }}
              transition={{ duration: 0.8, repeat: isRecording ? Infinity : 0, delay: bar.delay }}
              style={{ width: 3, background: isRecording ? `linear-gradient(180deg, ${T.blue}, ${T.cyan})` : T.border,
                borderRadius: 2, minHeight: 4 }}
            />
          ))}
        </div>
        {isRecording && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}
            style={{ textAlign: "center", marginTop: 8, fontSize: 8, color: T.red, ...mono }}>
            ● RECORDING... 0:47
          </motion.div>
        )}
      </div>

      {/* Band History */}
      <div style={{ background: T.bg2, borderRadius: 12, padding: 12 }}>
        <div style={{ fontSize: 8, color: T.muted, ...mono, marginBottom: 8 }}>SCORE HISTORY</div>
        {bandScores.map((score, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px",
              marginBottom: 4, borderRadius: 6, background: activeBand === i ? `${score.color}11` : "transparent",
              cursor: "pointer" }}
            onClick={() => setActiveBand(activeBand === i ? null : i)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Award size={12} color={score.color} />
              <div>
                <div style={{ fontSize: 10, color: T.text, ...raj, fontWeight: 600 }}>{score.label}</div>
                <div style={{ fontSize: 7, color: T.muted, ...mono }}>{score.date}</div>
              </div>
            </div>
            <div style={{ ...orb, fontSize: 16, fontWeight: 900, color: score.color }}>{score.band}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default IELTSWaveform;
