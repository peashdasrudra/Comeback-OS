import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Terminal, Mic, Send, CheckCircle, XCircle, Sparkles, RotateCcw } from "lucide-react";

const vivaQuestions = [
  {
    id: 1,
    question: "Explain the key difference between CRO and SHAP in interpretable machine learning.",
    hints: ["CRO uses competitive learning", "SHAP is based on game theory", "Both explain model predictions"],
    modelAnswer: "CRO (Competitive Randomization Optimization) uses a competitive learning framework where features compete to explain model behavior through randomized perturbations. SHAP (SHapley Additive exPlanations) is grounded in cooperative game theory, assigning each feature a Shapley value representing its contribution to the prediction. While both aim for interpretability, CRO focuses on feature competition dynamics, while SHAP provides unified measure across all feature combinations.",
    difficulty: "Hard",
    topic: "Interpretable ML"
  },
  {
    id: 2,
    question: "How does multi-omics integration improve cancer subtype prediction accuracy?",
    hints: ["Different biological layers", "Complementary information", "TCGA-BRCA example"],
    modelAnswer: "Multi-omics integration combines genomics, transcriptomics, methylation, and proteomics data to capture cancer heterogeneity from multiple biological perspectives. Each omics layer provides unique signals - genomics shows mutations, transcriptomics reveals expression changes, methylation indicates epigenetic regulation, and proteomics reflects functional protein levels. In TCGA-BRCA, integrating these layers achieved 94% subtype accuracy vs 78% using genomics alone, as molecular subtypes often require multi-level biological evidence.",
    difficulty: "Medium",
    topic: "Cancer Bioinformatics"
  },
  {
    id: 3,
    question: "What are the computational challenges in processing TCGA-BRCA dataset for subtype prediction?",
    hints: ["High dimensionality", "Missing data patterns", "Class imbalance"],
    modelAnswer: "TCGA-BRCA contains ~1100 samples with 20,000+ genomic features, creating the curse of dimensionality. Missing data is non-random - some omics layers have 30% missingness. Subtypes are imbalanced (TNBC ~15%, HER2+ ~20%, ER+ ~65%), requiring specialized loss functions. Additionally, batch effects across sequencing centers and feature correlation structures demand careful preprocessing and regularization techniques like elastic net or PCA.",
    difficulty: "Hard",
    topic: "Data Processing"
  },
  {
    id: 4,
    question: "Why is feature selection critical before applying SHAP to multi-omics data?",
    hints: ["Dimensionality reduction", "Computational cost", "Interpretability clarity"],
    modelAnswer: "With 20,000+ features across omics layers, SHAP's computational complexity becomes prohibitive (O(n²) for exact computation). More importantly, correlated features distort Shapley values - if genes in the same pathway are included, SHAP arbitrarily distributes importance among them. Feature selection reduces noise, removes redundant features, and ensures SHAP values represent biologically meaningful contributions rather than artifacts of feature correlation.",
    difficulty: "Medium",
    topic: "SHAP Methodology"
  },
  {
    id: 5,
    question: "Describe your thesis methodology for validating CRO vs SHAP performance.",
    hints: ["Cross-validation strategy", "Evaluation metrics", "Statistical tests"],
    modelAnswer: "I employ 10-fold stratified cross-validation with 3 repeats to ensure robust performance estimation. Primary metrics include Accuracy, F1-score (macro), and AUC-ROC for multi-class subtype prediction. For interpretability quality, I use faithfulness score (feature removal impact) and consistency across folds. Statistical significance is assessed via paired t-tests and Wilcoxon signed-rank tests. Additionally, I validate top features against known cancer biology pathways from MSigDB database.",
    difficulty: "Hard",
    topic: "Thesis Methodology"
  }
];

const VivaPrepSimulator = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const textareaRef = useRef(null);

  const currentQ = vivaQuestions[currentQIndex];

  useEffect(() => {
    if (showFeedback) {
      setIsTyping(true);
      setDisplayedText("");
      const text = currentQ.modelAnswer;
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(prev => prev + text[i]);
          i++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 15);
      return () => clearInterval(interval);
    }
  }, [showFeedback, currentQ]);

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;
    const wordCount = userAnswer.trim().split(/\s+/).length;
    const isGoodAnswer = wordCount > 30;
    const newScore = isGoodAnswer ? score + 20 : score + 5;
    setScore(newScore);
    setAnswers([...answers, { questionId: currentQ.id, answer: userAnswer, score: isGoodAnswer ? 20 : 5 }]);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setUserAnswer("");
    setDisplayedText("");
    setCurrentQIndex((prev) => (prev + 1) % vivaQuestions.length);
  };

  const handleReset = () => {
    setCurrentQIndex(0);
    setUserAnswer("");
    setShowFeedback(false);
    setScore(0);
    setAnswers([]);
    setDisplayedText("");
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setUserAnswer(prev => prev + " [Voice input simulated: Explain the difference between CRO and SHAP in multi-omics cancer prediction...]");
        setIsRecording(false);
      }, 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Terminal Header */}
      <div className="bg-black/40 border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-green-500/20 rounded-lg">
            <Terminal className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-green-300" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Viva Prep Simulator
            </h2>
            <p className="text-[10px] text-green-400/50" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              Thesis Defense · Question {currentQIndex + 1}/{vivaQuestions.length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-[10px] text-green-400/70" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            Score: <span className="text-green-300 font-bold">{score}</span>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4 text-white/40" />
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 md:p-6 font-mono" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
        {/* Question Display */}
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <div className="flex items-start gap-2 mb-3">
            <span className="text-green-400">$</span>
            <div className="flex-1">
              <div className="text-[10px] text-green-400/50 mb-1">QUESTION {String(currentQIndex + 1).padStart(2, '0')}</div>
              <div className="text-sm text-green-100 leading-relaxed">{currentQ.question}</div>
            </div>
          </div>

          {/* Topic & Difficulty Badges */}
          <div className="flex gap-2 ml-6">
            <span className={`px-2 py-0.5 rounded text-[10px] ${
              currentQ.difficulty === "Hard" ? "bg-red-500/20 text-red-300 border border-red-400/30" :
              currentQ.difficulty === "Medium" ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30" :
              "bg-green-500/20 text-green-300 border border-green-400/30"
            }`}>
              {currentQ.difficulty}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30">
              {currentQ.topic}
            </span>
          </div>
        </motion.div>

        {/* Answer Input */}
        {!showFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4"
          >
            <div className="flex items-start gap-2 mb-2">
              <span className="text-blue-400">></span>
              <textarea
                ref={textareaRef}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here... (or use voice input)"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white/80 placeholder:text-white/20 focus:border-green-400/50 focus:outline-none resize-none"
                rows={4}
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 ml-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={!userAnswer.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-lg text-green-300 text-xs font-medium hover:bg-green-500/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Answer
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={toggleRecording}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-xs font-medium transition-all ${
                  isRecording
                    ? "bg-red-500/20 border-red-400/30 text-red-300 animate-pulse"
                    : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                {isRecording ? "Recording..." : "Voice Input"}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* AI Feedback Section */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="border border-green-400/20 rounded-xl bg-green-500/5 p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-yellow-300 font-bold">AI FEEDBACK</span>
                <span className="ml-auto text-[10px] text-green-400/50">
                  {answers.find(a => a.questionId === currentQ.id)?.score === 20 ? (
                    <span className="flex items-center gap-1 text-green-300">
                      <CheckCircle className="w-3 h-3" /> Excellent (+20)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-yellow-300">
                      <XCircle className="w-3 h-3" /> Needs depth (+5)
                    </span>
                  )}
                </span>
              </div>

              {/* Typing Animation for Model Answer */}
              <div className="text-xs text-green-100/80 leading-relaxed mb-4">
                {displayedText}
                {isTyping && <span className="animate-pulse">|</span>}
              </div>

              {/* Hints */}
              <div className="border-t border-white/5 pt-3">
                <div className="text-[10px] text-white/30 mb-2">HINTS</div>
                <div className="flex flex-wrap gap-2">
                  {currentQ.hints.map((hint, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-white/40"
                    >
                      💡 {hint}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="mt-4 w-full py-2 bg-green-500/20 border border-green-400/30 rounded-lg text-green-300 text-xs font-medium hover:bg-green-500/30 transition-colors"
              >
                Next Question →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="mt-6 border-t border-white/5 pt-4">
          <div className="flex justify-between text-[10px] text-white/30 mb-2">
            <span>Progress</span>
            <span>{currentQIndex + 1}/{vivaQuestions.length} questions</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQIndex + 1) / vivaQuestions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VivaPrepSimulator;
