import { motion } from "framer-motion";

const trainingSteps = [
  { time: "00:00:01", text: "Initializing Multi-Omics Cancer Classification pipeline..." },
  { time: "00:00:03", text: "Loading genomic datasets [TCGA-BRCA, METABRIC]..." },
  { time: "00:00:07", text: "Preprocessing RNA-Seq + miRNA expression matrices..." },
  { time: "00:00:12", text: "Encoding clinical features with embedding layer..." },
  { time: "00:00:18", text: "Building multi-modal fusion architecture..." },
  { time: "00:00:25", text: "Compiling model: Adam optimizer, LR=3e-4..." },
  { time: "00:00:28", text: "Epoch 1/50 — Loss: 0.682 | AUC: 0.713" },
  { time: "00:00:35", text: "Epoch 5/50 — Loss: 0.441 | AUC: 0.842" },
  { time: "00:00:47", text: "Epoch 12/50 — Loss: 0.298 | AUC: 0.901 ← CHECKPOINT" },
];

const ResearchComputeNode = () => {
  const progress = 24;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.6, delay: 0.7, ease: "easeOut" }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900/80 border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>
        <span className="text-zinc-500 text-[10px] font-mono flex-1 text-center">
          compute-node-01 — Multi-Omics Cancer Classification
        </span>
      </div>

      {/* Terminal body */}
      <div className="p-4 font-mono text-[11px] leading-relaxed min-h-[220px] overflow-hidden">
        {trainingSteps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 + i * 0.15, duration: 0.3 }}
            className="flex gap-2 mb-1"
          >
            <span className="text-zinc-600 shrink-0">[{step.time}]</span>
            <span className="text-zinc-300">{step.text}</span>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ delay: 2.8, duration: 0.8, repeat: Infinity }}
          className="text-emerald-400 inline-block"
        >
          █
        </motion.div>
      </div>

      {/* Futuristic progress bar */}
      <div className="px-4 pb-4">
        <div className="flex justify-between mb-1.5">
          <span className="text-zinc-500 text-[9px] font-mono">TRAINING PROGRESS</span>
          <span className="text-emerald-400 text-[9px] font-mono font-bold">{progress}%</span>
        </div>
        <div className="h-2 bg-zinc-900/80 rounded-full overflow-hidden border border-zinc-800/50">
          <motion.div
            className="h-full rounded-full relative"
            style={{
              background: "linear-gradient(90deg, #00ff88, #00b4ff, #00ff88)",
              backgroundSize: "200% 100%",
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ delay: 1.5, duration: 2, ease: "easeInOut" }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)", backgroundSize: "200% 100%" }}
            />
            <motion.div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-4 rounded-sm"
              style={{ background: "#00ff88", boxShadow: "0 0 8px #00ff88, 0 0 16px #00ff88" }}
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </motion.div>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-zinc-600 text-[8px] font-mono">EPOCH 12/50</span>
          <span className="text-zinc-600 text-[8px] font-mono">ETA: ~14 min</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ResearchComputeNode;
