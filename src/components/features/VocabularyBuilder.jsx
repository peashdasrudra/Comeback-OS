import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { BookOpen, RotateCw, Check, X, Sparkles } from "lucide-react";

const vocabList = [
  { word: "Comprehensive", meaning: "Complete; including all aspects", example: "A comprehensive analysis of the data was conducted.", level: "Academic" },
  { word: "Substantiate", meaning: "To provide evidence to support a claim", example: "The findings substantiate the initial hypothesis.", level: "Academic" },
  { word: "Correlation", meaning: "A mutual relationship between two things", example: "There is a strong correlation between exercise and health.", level: "Academic" },
  { word: "Hypothesis", meaning: "A proposed explanation for a phenomenon", example: "The hypothesis was tested through multiple experiments.", level: "Academic" },
  { word: "Paradigm", meaning: "A typical example or pattern of something", example: "This study represents a new paradigm in cancer research.", level: "Academic" },
  { word: "Empirical", meaning: "Based on observation or experience", example: "Empirical evidence supports this theory.", level: "Academic" },
  { word: "Synthesize", meaning: "Combine different ideas into a coherent whole", example: "The paper synthesizes findings from multiple studies.", level: "Academic" },
  { word: "Validate", meaning: "Check accuracy or validity of something", example: "The results validate our approach to the problem.", level: "Academic" }
];

const VocabularyBuilder = ({ T, C, mono, orb, raj }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setisFlipped] = useState(false);
  const [learned, setLearned] = useState([]);
  const [direction, setDirection] = useState(1);

  const current = vocabList[currentIndex];

  const nextCard = (dir) => {
    setDirection(dir);
    setisFlipped(false);
    setCurrentIndex(prev => {
      let next = prev + dir;
      if (next < 0) next = vocabList.length - 1;
      if (next >= vocabList.length) next = 0;
      return next;
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      style={{ ...C({ padding: "14px", marginBottom: 12, border: `1px solid ${T.purple}44` }) }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 9, color: T.purple, letterSpacing: 2, ...mono }}>🔤 VOCABULARY BUILDER</div>
        <BookOpen size={16} color={T.purple} />
      </div>

      {/* Progress */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 9, ...mono }}>
        <span style={{ color: T.muted }}>Card {currentIndex + 1}/{vocabList.length}</span>
        <span style={{ color: T.green }}>Learned: {learned.length}</span>
      </div>

      {/* Flashcard */}
      <div style={{ perspective: 1000, marginBottom: 16 }}>
        <AnimatePresence mode="wait">
          <motion.div key={currentIndex} initial={{ opacity: 0, rotateY: direction > 0 ? 90 : -90 }}
            animate={{ opacity: 1, rotateY: isFlipped ? 180 : 0 }}
            exit={{ opacity: 0, rotateY: direction > 0 ? -90 : 90 }}
            transition={{ duration: 0.4 }}
            onClick={() => setisFlipped(!isFlipped)}
            style={{ width: "100%", height: 180, position: "relative", transformStyle: "preserve-3d", cursor: "pointer" }}>
            
            {/* Front */}
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden",
              padding: "20px", background: `linear-gradient(135deg, ${T.bg2}, ${T.bg3})`, borderRadius: 12,
              border: `1px solid ${T.purple}33`, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <Sparkles size={20} color={T.purple} style={{ marginBottom: 12 }} />
              <div style={{ ...orb, fontSize: 24, fontWeight: 900, color: T.bright, textAlign: "center" }}>{current.word}</div>
              <div style={{ fontSize: 8, color: T.purple, ...mono, marginTop: 8, letterSpacing: 1 }}>{current.level.toUpperCase()}</div>
              <div style={{ fontSize: 8, color: T.muted, ...mono, marginTop: 12 }}>TAP TO FLIP</div>
            </div>

            {/* Back */}
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)",
              padding: "16px", background: `linear-gradient(135deg, ${T.purple}11, ${T.bg2})`, borderRadius: 12,
              border: `1px solid ${T.purple}33`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 10, color: T.purple, ...mono, marginBottom: 6, letterSpacing: 1 }}>MEANING</div>
              <div style={{ fontSize: 13, color: T.text, ...raj, lineHeight: 1.5, marginBottom: 10 }}>{current.meaning}</div>
              <div style={{ fontSize: 10, color: T.purple, ...mono, marginBottom: 4, letterSpacing: 1 }}>EXAMPLE</div>
              <div style={{ fontSize: 10, color: T.muted, ...raj, lineHeight: 1.6, fontStyle: "italic" }}>"{current.example}"</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => nextCard(-1)}
          style={{ padding: "8px 12px", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, cursor: "pointer" }}>
          ←
        </motion.button>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
          if (!learned.includes(currentIndex)) setLearned([...learned, currentIndex]);
        }}
          style={{ padding: "8px 16px", background: learned.includes(currentIndex) ? T.green + "22" : T.blue + "22",
            border: `1px solid ${learned.includes(currentIndex) ? T.green + "55" : T.blue + "44"}`, borderRadius: 8, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 4, fontSize: 9, ...mono, color: learned.includes(currentIndex) ? T.green : T.blue }}>
          {learned.includes(currentIndex) ? <><Check size={12} /> LEARNED</> : <><X size={12} /> MARK LEARNED</>}
        </motion.button>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => nextCard(1)}
          style={{ padding: "8px 12px", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, cursor: "pointer" }}>
          →
        </motion.button>
      </div>
    </motion.div>
  );
};

export default VocabularyBuilder;
