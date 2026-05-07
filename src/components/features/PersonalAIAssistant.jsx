import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Bot, Lightbulb, Sparkles, X } from "lucide-react";

const suggestions = [
  { text: "Your CRO+SHAP thesis is publishable. Keep going! 🎓", icon: "🎓", color: "#00ff88" },
  { text: "3.95 GPA + Debate Champion = Unstoppable combo 💪", icon: "💪", color: "#00b4ff" },
  { text: "IELTS 7.0 target is within reach. Practice daily! 📖", icon: "📖", color: "#ff8800" },
  { text: "50→60kg transformation is happening. Eat + lift! 🏋️", icon: "🏋️", color: "#ff006e" },
  { text: "BUET MSc application opens soon. Be ready! 🏛️", icon: "🏛️", color: "#a855f7" },
];

const PersonalAIAssistant = ({ T, C, mono, orb, raj }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const fullText = "Hey Peash! Your 3.95 GPA proves the comeback is real. Let's get that MSc admission.";

  useEffect(() => {
    if (!isOpen) { setTypedText(""); return; }
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCurrentSuggestion(prev => (prev + 1) % suggestions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(0,180,255,0.3)" }}
          className="card-glow"
          style={{ ...C({ padding: "14px", marginBottom: 12 }), background: "linear-gradient(135deg, rgba(0,180,255,0.08), rgba(168,85,247,0.08))", backdropFilter: "blur(20px)" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Bot size={18} color={T.blue} />
              <div>
                <div style={{ fontSize: 11, color: T.bright, ...raj, fontWeight: 700 }}>AI Assistant</div>
                <div style={{ fontSize: 7, color: T.muted, ...mono }}>Powered by Comeback-OS</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <X size={14} color={T.muted} />
            </button>
          </div>

          {/* Typing Animation */}
          <div style={{ padding: "10px 12px", background: T.bg2, borderRadius: 10, marginBottom: 12, minHeight: 50 }}>
            <div style={{ fontSize: 9, color: T.blue, ...mono, marginBottom: 4 }}>🤖 AI SAYS:</div>
            <div style={{ fontSize: 11, color: T.text, ...raj, lineHeight: 1.5 }}>
              {typedText}<span style={{ animation: "blink 1s infinite" }}>|</span>
            </div>
          </div>

          {/* Suggestion Cards */}
          <div style={{ fontSize: 8, color: T.muted, ...mono, marginBottom: 6 }}>SMART SUGGESTIONS</div>
          <motion.div key={currentSuggestion} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ padding: "8px 10px", background: T.bg2, borderRadius: 8,
              border: `1px solid ${suggestions[currentSuggestion].color}22` }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{suggestions[currentSuggestion].icon}</div>
            <div style={{ fontSize: 10, color: T.text, ...raj, lineHeight: 1.4 }}>
              {suggestions[currentSuggestion].text}
            </div>
          </motion.div>

          <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 8 }}>
            {suggestions.map((_, i) => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: "50%",
                background: i === currentSuggestion ? T.blue : T.border }} />
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default PersonalAIAssistant;
