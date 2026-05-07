import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Pause, Waves } from "lucide-react";

const questions = [
  "Describe a time when you overcame a significant challenge.",
  "How will your research contribute to the field of computer science?",
  "Describe your hometown and why it's special to you.",
  "Talk about a goal you achieved that you're proud of."
];

const IELTSSpeakingRecorder = ({ T, C, mono, orb, raj }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setDuration(d => d + 1);
        setAudioLevel(Math.random() * 100);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      style={{ ...C({ padding: "14px", marginBottom: 12, border: `1px solid ${T.blue}44` }) }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 9, color: T.blue, letterSpacing: 2, ...mono }}>🎙️ IELTS SPEAKING RECORDER</div>
        <Waves size={16} color={T.blue} />
      </div>

      {/* Question */}
      <motion.div key={currentQ} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        style={{ padding: "12px", background: T.blue + "0d", borderRadius: 8, marginBottom: 12, border: `1px solid ${T.blue}22` }}>
        <div style={{ fontSize: 8, color: T.blue, ...mono, marginBottom: 4 }}>QUESTION {currentQ + 1}/{questions.length}</div>
        <div style={{ fontSize: 12, color: T.text, ...raj, lineHeight: 1.6 }}>{questions[currentQ]}</div>
      </motion.div>

      {/* Waves Visualization */}
      <div style={{ height: 60, background: T.bg2, borderRadius: 8, marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 2, padding: "0 10px", overflow: "hidden" }}>
        {Array.from({ length: 40 }, (_, i) => (
          <motion.div key={i} animate={{ 
              height: isRecording ? `${20 + Math.random() * 60}%` : "8px",
              background: isRecording ? `linear-gradient(to top, ${T.blue}, ${T.cyan})` : T.bg3
            }} transition={{ duration: 0.3 }}
            style={{ width: 3, borderRadius: 2, flexShrink: 0 }} />
        ))}
      </div>

      {/* Timer & Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ ...orb, fontSize: 14, fontWeight: 700, color: isRecording ? T.red : T.text }}>{formatTime(duration)}</div>
        <div style={{ display: "flex", gap: 6 }}>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setIsRecording(!isRecording); if (!isRecording) setDuration(0); }}
            style={{ padding: "8px 16px", background: isRecording ? T.red + "22" : T.blue + "22", border: `1px solid ${isRecording ? T.red + "55" : T.blue + "44"}`,
              color: isRecording ? T.red : T.blue, borderRadius: 8, fontSize: 10, ...mono, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            {isRecording ? <><Square size={12} /> STOP</> : <><Mic size={12} /> RECORD</>}
          </motion.button>
        </div>
      </div>

      {/* Question Navigation */}
      <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 4 }}>
        {questions.map((_, i) => (
          <motion.button key={i} whileTap={{ scale: 0.9 }} onClick={() => setCurrentQ(i)}
            style={{ flexShrink: 0, width: 28, height: 28, borderRadius: "50%", border: `1px solid ${currentQ === i ? T.blue + "55" : T.border}`,
              background: currentQ === i ? T.blue + "22" : T.bg2, color: currentQ === i ? T.blue : T.muted, fontSize: 9, ...mono, cursor: "pointer" }}>
            {i + 1}
          </motion.button>
        ))}
      </div>

      {/* Band Score Estimate */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: duration > 60 ? 1 : 0 }}
        style={{ marginTop: 10, padding: "8px 10px", background: T.green + "0d", borderRadius: 6, border: `1px solid ${T.green}22`, display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 8, color: T.muted, ...mono }}>EST. BAND SCORE</span>
        <span style={{ fontSize: 11, color: T.green, ...raj, fontWeight: 700 }}>6.5 - 7.0</span>
      </motion.div>
    </motion.div>
  );
};

export default IELTSSpeakingRecorder;
