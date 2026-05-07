import { motion, useSpring, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { Network, BookOpen, Link2, Zap } from "lucide-react";

const thesisNodes = [
  { id: 1, label: "CRO vs SHAP", type: "thesis", color: "#00ff88", size: 40, x: 50, y: 50 },
  { id: 2, label: "SHAP (2017)", type: "paper", color: "#00b4ff", size: 28, x: 20, y: 30 },
  { id: 3, label: "LIME (2016)", type: "paper", color: "#00b4ff", size: 26, x: 80, y: 25 },
  { id: 4, label: "CRO (2020)", type: "paper", color: "#ff8800", size: 30, x: 25, y: 75 },
  { id: 5, label: "TCGA-BRCA", type: "dataset", color: "#ff006e", size: 32, x: 75, y: 70 },
  { id: 6, label: "METABRIC", type: "dataset", color: "#ff006e", size: 30, x: 60, y: 85 },
  { id: 7, label: "Multi-omics Cancer", type: "domain", color: "#ffd700", size: 34, x: 40, y: 60 },
  { id: 8, label: "XGBoost", type: "method", color: "#a855f7", size: 24, x: 15, y: 50 },
  { id: 9, label: "Random Forest", type: "method", color: "#a855f7", size: 24, x: 85, y: 50 },
  { id: 10, label: "Interpretability", type: "concept", color: "#00ffff", size: 26, x: 50, y: 15 },
  { id: 11, label: "Subtype Prediction", type: "goal", color: "#00ff88", size: 28, x: 50, y: 90 },
  { id: 12, label: "Feature Selection", type: "method", color: "#a855f7", size: 22, x: 30, y: 40 },
];

const edges = [
  { source: 1, target: 2 }, { source: 1, target: 3 }, { source: 1, target: 4 },
  { source: 1, target: 5 }, { source: 1, target: 6 }, { source: 1, target: 7 },
  { source: 2, target: 8 }, { source: 2, target: 12 }, { source: 3, target: 8 },
  { source: 4, target: 9 }, { source: 5, target: 7 }, { source: 6, target: 7 },
  { source: 7, target: 10 }, { source: 7, target: 11 }, { source: 8, target: 12 },
  { source: 9, target: 11 }, { source: 10, target: 11 },
];

const nodeVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.08,
      type: "spring",
      stiffness: 200,
      damping: 15
    }
  }),
  drag: {
    scale: 1.2,
    transition: { type: "spring", stiffness: 300, damping: 10 }
  }
};

const CitationNetworkVisualizer = () => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodes, setNodes] = useState(thesisNodes);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const springConfig = { stiffness: 200, damping: 20 };
  const rotateX = useSpring(rotation.x, springConfig);
  const rotateY = useSpring(rotation.y, springConfig);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotation({ x: y * 10, y: x * 10 });
  };

  const handleNodeDrag = (id, newX, newY) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, x: newX, y: newY } : n));
  };

  const getConnectedNodes = (nodeId) => {
    const connected = new Set();
    edges.forEach(e => {
      if (e.source === nodeId) connected.add(e.target);
      if (e.target === nodeId) connected.add(e.source);
    });
    return connected;
  };

  const connectedToHovered = hoveredNode ? getConnectedNodes(hoveredNode) : new Set();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-4 md:p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-xl">
            <Network className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white/90" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Citation Network Visualizer
            </h2>
            <p className="text-xs text-white/50" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              3D force-directed graph of thesis references
            </p>
          </div>
        </div>
        <div className="text-xs text-white/40" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
          {nodes.length} nodes · {edges.length} edges
        </div>
      </div>

      {/* 3D Graph Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setRotation({ x: 0, y: 0 })}
        className="relative bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden"
        style={{ height: 400, perspective: 1000 }}
      >
        <motion.div
          className="relative w-full h-full"
          style={{
            rotateX: rotateX,
            rotateY: rotateY,
            transformStyle: "preserve-3d"
          }}
        >
          {/* SVG Edges */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            {edges.map((edge, i) => {
              const source = nodes.find(n => n.id === edge.source);
              const target = nodes.find(n => n.id === edge.target);
              if (!source || !target) return null;
              const isHighlighted = hoveredNode && (hoveredNode === source.id || hoveredNode === target.id);
              return (
                <motion.line
                  key={i}
                  x1={`${source.x}%`}
                  y1={`${source.y}%`}
                  x2={`${target.x}%`}
                  y2={`${target.y}%`}
                  stroke={isHighlighted ? "#00ff88" : "#ffffff10"}
                  strokeWidth={isHighlighted ? 2 : 1}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: i * 0.05 }}
                  style={{ filter: isHighlighted ? "drop-shadow(0 0 4px #00ff88)" : "none" }}
                />
              );
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((node, index) => {
            const isHovered = hoveredNode === node.id;
            const isConnected = connectedToHovered.has(node.id);
            const isDimmed = hoveredNode && !isHovered && !isConnected;

            return (
              <motion.div
                key={node.id}
                custom={index}
                variants={nodeVariants}
                initial="hidden"
                animate="visible"
                whileDrag="drag"
                drag
                dragMomentum={false}
                onDrag={(_, info) => {
                  const container = containerRef.current;
                  if (!container) return;
                  const rect = container.getBoundingClientRect();
                  const newX = ((info.point.x - rect.left) / rect.width) * 100;
                  const newY = ((info.point.y - rect.top) / rect.height) * 100;
                  handleNodeDrag(node.id, Math.max(5, Math.min(95, newX)), Math.max(5, Math.min(95, newY)));
                }}
                style={{
                  position: "absolute",
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: isHovered ? 10 : 2,
                }}
                className="cursor-grab active:cursor-grabbing"
                onHoverStart={() => setHoveredNode(node.id)}
                onHoverEnd={() => setHoveredNode(null)}
                onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
              >
                <motion.div
                  className="rounded-xl border backdrop-blur-md flex items-center justify-center"
                  style={{
                    width: node.size,
                    height: node.size,
                    backgroundColor: `${node.color}15`,
                    borderColor: isHovered ? node.color : `${node.color}44`,
                    boxShadow: isHovered ? `0 0 20px ${node.color}44, 0 0 40px ${node.color}22` : "none",
                    opacity: isDimmed ? 0.3 : 1,
                  }}
                  whileHover={{ scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  {node.type === "thesis" && <BookOpen className="w-5 h-5" style={{ color: node.color }} />}
                  {node.type === "paper" && <Link2 className="w-4 h-4" style={{ color: node.color }} />}
                  {node.type === "dataset" && <Zap className="w-4 h-4" style={{ color: node.color }} />}
                  {(node.type === "method" || node.type === "domain" || node.type === "concept" || node.type === "goal") &&
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: node.color }} />
                  }
                </motion.div>
                {/* Label */}
                <motion.div
                  className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0.7 }}
                  style={{ fontSize: 9, color: isHovered ? node.color : "#a8d8c0", fontFamily: "'Share Tech Mono', monospace" }}
                >
                  {node.label}
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-2" style={{ zIndex: 20 }}>
          {[
            { label: "Thesis", color: "#00ff88" },
            { label: "Paper", color: "#00b4ff" },
            { label: "Dataset", color: "#ff006e" },
            { label: "Method", color: "#a855f7" },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5 px-2 py-1 bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[10px] text-white/60" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Instruction */}
        <div className="absolute bottom-3 right-3 text-[10px] text-white/30" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
          Drag nodes · Hover to explore
        </div>
      </div>

      {/* Selected Node Details */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 bg-white/5 border border-white/10 rounded-xl"
          >
            {(() => {
              const node = nodes.find(n => n.id === selectedNode);
              if (!node) return null;
              const connected = getConnectedNodes(node.id);
              return (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: node.color }} />
                    <span className="text-sm font-bold text-white/90" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                      {node.label}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{
                      backgroundColor: `${node.color}20`,
                      color: node.color,
                      fontFamily: "'Share Tech Mono', monospace"
                    }}>
                      {node.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-white/50 mb-2" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                    Connected to: {connected.size} nodes
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(connected).map(cId => {
                      const cNode = nodes.find(n => n.id === cId);
                      return cNode ? (
                        <span key={cId} className="px-2 py-1 bg-white/5 rounded-lg text-[11px] text-white/60"
                              style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                          {cNode.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CitationNetworkVisualizer;
