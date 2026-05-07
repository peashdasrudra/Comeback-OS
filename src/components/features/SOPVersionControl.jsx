import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FileText, GitBranch, Plus, Clock, CheckCircle, ArrowRight } from "lucide-react";

const sopVersions = [
  {
    id: 1,
    version: "v1.0",
    date: "2026-02-15",
    title: "Initial Draft - KUET MSc CSE",
    status: "archived",
    changes: ["Basic academic background", "Research interests overview", "Simple structure"],
    wordCount: 847,
    highlights: [],
    isActive: false
  },
  {
    id: 2,
    version: "v1.5",
    date: "2026-03-01",
    title: "Added Research Experience",
    status: "archived",
    changes: ["Added thesis topic details", "CRO vs SHAP methodology", "TCGA-BRCA & METABRIC datasets"],
    wordCount: 1245,
    highlights: ["Research methodology", "Dataset justification"],
    isActive: false
  },
  {
    id: 3,
    version: "v2.0",
    date: "2026-03-20",
    title: "Stronger Motivation & Goals",
    status: "archived",
    changes: ["Comeback story integration (32/100 → 3.95 GPA)", "Debate championship achievement", "Clear research goals for KUET"],
    wordCount: 1598,
    highlights: ["Comeback narrative", "Achievement highlights", "Research alignment"],
    isActive: false
  },
  {
    id: 4,
    version: "v2.5",
    date: "2026-04-10",
    title: "Faculty Alignment & Refinement",
    status: "archived",
    changes: ["Added specific KUET faculty matches", "Refined cancer bioinformatics focus", "Improved flow and transitions"],
    wordCount: 1823,
    highlights: ["Faculty matching", "Focus sharpening"],
    isActive: false
  },
  {
    id: 5,
    version: "v3.0",
    date: "2026-05-05",
    title: "Final Polish & BUET/DU Variants",
    status: "active",
    changes: ["Created BUET variant (emphasis on systems)", "Created DU variant (computational focus)", "Proofread & final edits", "Added DAAD scholarship paragraph"],
    wordCount: 2104,
    highlights: ["Multi-university ready", "Scholarship aligned", "Fully polished"],
    isActive: true
  }
];

const SOPVersionControl = () => {
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleVersionClick = (id) => {
    if (compareMode) {
      if (compareIds.includes(id)) {
        setCompareIds(compareIds.filter(cid => cid !== id));
      } else if (compareIds.length < 2) {
        setCompareIds([...compareIds, id]);
      }
    } else {
      setSelectedVersion(selectedVersion === id ? null : id);
    }
  };

  const getVersionById = (id) => sopVersions.find(v => v.id === id);

  const activeVersion = sopVersions.find(v => v.isActive);

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
          <div className="p-2 bg-indigo-500/20 rounded-xl">
            <GitBranch className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white/90" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              SOP Version Control
            </h2>
            <p className="text-xs text-white/50" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              Timeline of SOP drafts with diff highlights
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCompareMode(!compareMode);
              setCompareIds([]);
              setSelectedVersion(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
              compareMode
                ? "bg-blue-500/30 text-blue-300 border border-blue-400/50"
                : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
            }`}
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            {compareMode ? "Exit Compare" : "Compare"}
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/20 border border-indigo-400/30 rounded-lg text-[10px] text-indigo-300 font-medium hover:bg-indigo-500/30 transition-colors"
          >
            <Plus className="w-3 h-3" />
            New Draft
          </motion.button>
        </div>
      </div>

      {/* Active Draft Banner */}
      {activeVersion && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-3 bg-indigo-500/10 border border-indigo-400/30 rounded-xl flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-xs text-indigo-300" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              ACTIVE DRAFT
            </span>
            <span className="text-xs text-white/60">
              {activeVersion.version} · {activeVersion.wordCount} words
            </span>
          </div>
          <span className="text-[10px] text-white/40">
            {activeVersion.date}
          </span>
        </motion.div>
      )}

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/5" />

        {sopVersions.map((version, index) => (
          <motion.div
            key={version.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-14 pb-6 last:pb-0"
          >
            {/* Timeline Node */}
            <div className="absolute left-4 top-2">
              <motion.div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  version.isActive
                    ? "border-indigo-400 bg-indigo-400/20"
                    : "border-white/20 bg-white/5"
                }`}
                animate={version.isActive ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {version.isActive && <CheckCircle className="w-3 h-3 text-indigo-400" />}
              </motion.div>
            </div>

            {/* Version Card */}
            <motion.div
              onClick={() => handleVersionClick(version.id)}
              whileHover={{ x: 4 }}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                compareMode && compareIds.includes(version.id)
                  ? "border-blue-400/50 bg-blue-500/10"
                  : version.isActive
                  ? "border-indigo-400/30 bg-indigo-500/5"
                  : selectedVersion === version.id
                  ? "border-white/20 bg-white/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-bold text-white/90" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                    {version.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/40" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                    {version.version}
                  </span>
                  {version.isActive && (
                    <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[9px] font-medium border border-indigo-400/30">
                      ACTIVE
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 mb-3 text-[10px] text-white/40">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {version.date}
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {version.wordCount} words
                </span>
              </div>

              {/* Changes */}
              <AnimatePresence>
                {(selectedVersion === version.id || compareMode) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 border-t border-white/5">
                      <div className="text-[9px] text-white/30 mb-2" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                        CHANGES
                      </div>
                      <div className="space-y-1">
                        {version.changes.map((change, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-2 text-[11px] text-white/60"
                          >
                            <ArrowRight className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                            {change}
                          </motion.div>
                        ))}
                      </div>

                      {/* Highlights */}
                      {version.highlights.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {version.highlights.map((hl, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-green-500/10 border border-green-400/20 rounded text-[10px] text-green-300"
                            >
                              {hl}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Compare View */}
      <AnimatePresence>
        {compareMode && compareIds.length === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 p-4 bg-white/5 border border-blue-400/20 rounded-xl"
          >
            <div className="text-[10px] text-blue-400 mb-3" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              COMPARING: {getVersionById(compareIds[0])?.version} vs {getVersionById(compareIds[1])?.version}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {compareIds.map(id => {
                const v = getVersionById(id);
                return v ? (
                  <div key={id} className="p-3 bg-white/5 rounded-lg">
                    <div className="text-xs text-white/70 mb-2">{v.version} · {v.wordCount} words</div>
                    <div className="space-y-1">
                      {v.changes.map((c, i) => (
                        <div key={i} className="text-[10px] text-white/50">• {c}</div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create New Draft Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0a1520] border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-white/90 mb-4" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                Create New SOP Draft
              </h3>
              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-[10px] text-white/40 mb-1 block">VERSION</label>
                  <input
                    type="text"
                    defaultValue={`v${sopVersions.length + 1}.0`}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 focus:border-indigo-400/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-white/40 mb-1 block">TITLE</label>
                  <input
                    type="text"
                    placeholder="Enter draft title..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/20 focus:border-indigo-400/50 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white/50 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 bg-indigo-500/20 border border-indigo-400/30 rounded-lg text-xs text-indigo-300 hover:bg-indigo-500/30 transition-colors"
                >
                  Create Draft
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SOPVersionControl;
