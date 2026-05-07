import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Code2, CheckCircle, Circle, Filter, Plus, X } from "lucide-react";

const problems = [];

const difficultyColors = {
  Easy: { bg: "#00ff8820", border: "#00ff8844", text: "#00ff88", glow: "#00ff8833" },
  Medium: { bg: "#00b4ff20", border: "#00b4ff44", text: "#00b4ff", glow: "#00b4ff33" },
  Hard: { bg: "#ff880020", border: "#ff880044", text: "#ff8800", glow: "#ff880033" }
};

const categories = ["All", "Array", "String", "Linked List", "Math", "Dynamic Programming"];

const CodingProblemTracker = () => {
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterSolved, setFilterSolved] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProblem, setNewProblem] = useState({ title: "", difficulty: "Medium", category: "Array" });

  const filteredProblems = problems.filter(p => {
    if (filterDifficulty !== "All" && p.difficulty !== filterDifficulty) return false;
    if (filterCategory !== "All" && p.category !== filterCategory) return false;
    if (filterSolved === "Solved" && !p.solved) return false;
    if (filterSolved === "Unsolved" && p.solved) return false;
    return true;
  });

  const solvedCount = problems.filter(p => p.solved).length;
  const easyCount = problems.filter(p => p.difficulty === "Easy" && p.solved).length;
  const mediumCount = problems.filter(p => p.difficulty === "Medium" && p.solved).length;
  const hardCount = problems.filter(p => p.difficulty === "Hard" && p.solved).length;

  const stats = [
    { label: "SOLVED", value: solvedCount, total: problems.length, color: "#00ff88" },
    { label: "EASY", value: easyCount, total: problems.filter(p => p.difficulty === "Easy").length, color: "#00ff88" },
    { label: "MEDIUM", value: mediumCount, total: problems.filter(p => p.difficulty === "Medium").length, color: "#00b4ff" },
    { label: "HARD", value: hardCount, total: problems.filter(p => p.difficulty === "Hard").length, color: "#ff8800" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-4 md:p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/20 rounded-xl">
            <Code2 className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white/90" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Coding Problem Tracker
            </h2>
            <p className="text-xs text-white/50" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              LeetCode-style problem log with difficulty ratings
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/20 border border-yellow-400/30 rounded-lg text-[10px] text-yellow-300 font-medium hover:bg-yellow-500/30 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add Problem
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-3 bg-white/5 rounded-xl text-center border border-white/5"
          >
            <div className="text-lg font-bold" style={{ fontFamily: "'Orbitron', monospace", color: stat.color }}>
              {stat.value}
              <span className="text-[10px] text-white/30">/{stat.total}</span>
            </div>
            <div className="text-[9px] text-white/30 mt-1" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              {stat.label}
            </div>
            <div className="mt-1.5 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: stat.color }}
                initial={{ width: 0 }}
                animate={{ width: `${(stat.value / stat.total) * 100}%` }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Filter className="w-4 h-4 text-white/40 mt-2" />
        <div className="flex flex-wrap gap-2">
          {["All", "Easy", "Medium", "Hard"].map(diff => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                filterDifficulty === diff
                  ? diff === "Easy" ? "bg-green-500/30 text-green-300 border border-green-400/50" :
                    diff === "Medium" ? "bg-blue-500/30 text-blue-300 border border-blue-400/50" :
                    diff === "Hard" ? "bg-orange-500/30 text-orange-300 border border-orange-400/50" :
                    "bg-white/30 text-white/70 border border-white/40"
                  : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
              }`}
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              {diff}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 ml-2">
          {["All", "Solved", "Unsolved"].map(filter => (
            <button
              key={filter}
              onClick={() => setFilterSolved(filter)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                filterSolved === filter
                  ? "bg-purple-500/30 text-purple-300 border border-purple-400/50"
                  : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
              }`}
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 ml-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                filterCategory === cat
                  ? "bg-cyan-500/30 text-cyan-300 border border-cyan-400/50"
                  : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
              }`}
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Problem List */}
      <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {filteredProblems.map((problem, index) => {
            const colors = difficultyColors[problem.difficulty];
            return (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.03 }}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  problem.solved
                    ? "bg-white/5 hover:bg-white/10"
                    : "bg-white/[0.02] hover:bg-white/5"
                }`}
                style={{ borderColor: problem.solved ? colors.border : "#ffffff10" }}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center gap-3">
                  {/* Status Icon */}
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="flex-shrink-0"
                  >
                    {problem.solved ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-white/20" />
                    )}
                  </motion.div>

                  {/* Problem Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${problem.solved ? "text-white/90" : "text-white/50"}`}
                            style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                        {problem.title}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded text-[9px] font-medium"
                        style={{
                          backgroundColor: colors.bg,
                          color: colors.text,
                          border: `1px solid ${colors.border}`
                        }}
                      >
                        {problem.difficulty}
                      </span>
                      <span className="text-[9px] text-white/30" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                        {problem.category}
                      </span>
                    </div>

                    {/* Solved Details */}
                    {problem.solved && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="flex items-center gap-3 mt-1"
                      >
                        <span className="text-[10px] text-white/30" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                          {problem.date}
                        </span>
                        <span className="text-[10px] text-white/30" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                          {problem.time}
                        </span>
                        <span className="text-[10px] text-white/30" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                          {problem.attempts} attempt{problem.attempts > 1 ? 's' : ''}
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Glow Effect for Solved */}
                  {problem.solved && (
                    <motion.div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: colors.text }}
                      animate={{ boxShadow: [`0 0 0px ${colors.glow}`, `0 0 10px ${colors.glow}`, `0 0 0px ${colors.glow}`] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 pt-4 border-t border-white/5">
        <div className="flex justify-between text-[10px] text-white/30 mb-2">
          <span style={{ fontFamily: "'Share Tech Mono', monospace" }}>OVERALL PROGRESS</span>
          <span style={{ fontFamily: "'Orbitron', monospace" }}>{Math.round((solvedCount / problems.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 via-blue-400 to-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${(solvedCount / problems.length) * 100}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      {/* Add Problem Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0a1520] border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white/90" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  Add New Problem
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-white/40 hover:text-white/60">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Problem title..."
                  value={newProblem.title}
                  onChange={(e) => setNewProblem({...newProblem, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/20 focus:border-yellow-400/50 focus:outline-none"
                />
                <div className="grid grid-cols-3 gap-2">
                  {["Easy", "Medium", "Hard"].map(diff => (
                    <button
                      key={diff}
                      onClick={() => setNewProblem({...newProblem, difficulty: diff})}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        newProblem.difficulty === diff
                          ? diff === "Easy" ? "bg-green-500/30 text-green-300 border border-green-400/50" :
                            diff === "Medium" ? "bg-blue-500/30 text-blue-300 border border-blue-400/50" :
                            "bg-orange-500/30 text-orange-300 border border-orange-400/50"
                          : "bg-white/5 text-white/50 border border-white/10"
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
                <select
                  value={newProblem.category}
                  onChange={(e) => setNewProblem({...newProblem, category: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 focus:border-yellow-400/50 focus:outline-none"
                >
                  {categories.filter(c => c !== "All").map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white/50 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 bg-yellow-500/20 border border-yellow-400/30 rounded-lg text-xs text-yellow-300 hover:bg-yellow-500/30 transition-colors"
                >
                  Add Problem
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CodingProblemTracker;
