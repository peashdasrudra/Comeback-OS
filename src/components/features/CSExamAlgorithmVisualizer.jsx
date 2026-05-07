import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, RotateCcw, Code, Zap } from "lucide-react";

const algorithms = [
  {
    name: "Bubble Sort",
    category: "Sorting",
    code: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
    steps: (arr) => {
      const steps = [];
      const a = [...arr];
      for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < a.length - i - 1; j++) {
          steps.push({ arr: [...a], compare: [j, j+1], swap: a[j] > a[j+1] });
          if (a[j] > a[j+1]) {
            [a[j], a[j+1]] = [a[j+1], a[j]];
            steps.push({ arr: [...a], swapped: [j, j+1] });
          }
        }
      }
      return steps;
    }
  },
  {
    name: "Binary Search",
    category: "Searching",
    code: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    steps: (arr, target) => {
      const steps = [];
      const sorted = [...arr].sort((a,b) => a-b);
      let left = 0, right = sorted.length - 1;
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        steps.push({ arr: sorted, left, right, mid, target });
        if (sorted[mid] === target) {
          steps.push({ arr: sorted, left, right, mid, target, found: true });
          break;
        }
        if (sorted[mid] < target) left = mid + 1;
        else right = mid - 1;
      }
      return steps;
    }
  },
  {
    name: "DFS (Graph)",
    category: "Graph",
    code: `function dfs(graph, start) {
  const visited = new Set();
  const result = [];
  
  function dfsHelper(node) {
    visited.add(node);
    result.push(node);
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        dfsHelper(neighbor);
      }
    }
  }
  
  dfsHelper(start);
  return result;
}`,
    steps: (graph, start) => {
      const steps = [];
      const visited = new Set();
      const result = [];
      
      function dfsHelper(node) {
        visited.add(node);
        result.push(node);
        steps.push({ visited: new Set(visited), current: node, result: [...result] });
        for (const neighbor of graph[node]) {
          if (!visited.has(neighbor)) {
            steps.push({ visited: new Set(visited), current: node, next: neighbor });
            dfsHelper(neighbor);
          }
        }
      }
      
      dfsHelper(start);
      return steps;
    }
  }
];

const CSExamAlgorithmVisualizer = () => {
  const [selectedAlgo, setSelectedAlgo] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [speed, setSpeed] = useState(800);
  const intervalRef = useRef(null);

  const algo = algorithms[selectedAlgo];
  const sampleData = [64, 34, 25, 12, 22, 11, 90];
  const graph = { A: ['B', 'C'], B: ['A', 'D', 'E'], C: ['A', 'F'], D: ['B'], E: ['B', 'F'], F: ['C', 'E'] };

  useEffect(() => {
    resetVisualization();
  }, [selectedAlgo]);

  const resetVisualization = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setSteps([]);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const startVisualization = () => {
    let newSteps;
    if (selectedAlgo === 0) newSteps = algo.steps(sampleData);
    else if (selectedAlgo === 1) newSteps = algo.steps(sampleData, 22);
    else newSteps = algo.steps(graph, 'A');
    
    setSteps(newSteps);
    setCurrentStep(0);
    setIsRunning(true);
    
    intervalRef.current = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= newSteps.length - 1) {
          setIsRunning(false);
          clearInterval(intervalRef.current);
          return prev;
        }
        return prev + 1;
      });
    }, speed);
  };

  const stepForward = () => {
    if (steps.length === 0) {
      let newSteps;
      if (selectedAlgo === 0) newSteps = algo.steps(sampleData);
      else if (selectedAlgo === 1) newSteps = algo.steps(sampleData, 22);
      else newSteps = algo.steps(graph, 'A');
      setSteps(newSteps);
      setCurrentStep(0);
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const currentStepData = steps[currentStep];

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
          <div className="p-2 bg-orange-500/20 rounded-xl">
            <Code className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white/90" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              CS Exam Algorithm Visualizer
            </h2>
            <p className="text-xs text-white/50" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              Step-by-step algorithm demos with highlighted code
            </p>
          </div>
        </div>
        <div className="text-xs text-white/40" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
          {algorithms[selectedAlgo].category}
        </div>
      </div>

      {/* Algorithm Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {algorithms.map((algo, index) => (
          <motion.button
            key={algo.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedAlgo(index)}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedAlgo === index
                ? "bg-orange-500/20 text-orange-300 border border-orange-400/30"
                : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
            }`}
          >
            {algo.name}
          </motion.button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Visualization Panel */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-[10px] text-white/30 mb-3" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            VISUALIZATION
          </div>

          {/* Array Visualization (Bubble Sort & Binary Search) */}
          {selectedAlgo < 2 && currentStepData && (
            <div className="space-y-4">
              <div className="flex items-end justify-center gap-1 h-32">
                {currentStepData.arr.map((val, idx) => {
                  const isComparing = currentStepData.compare && (idx === currentStepData.compare[0] || idx === currentStepData.compare[1]);
                  const isSwapped = currentStepData.swapped && (idx === currentStepData.swapped[0] || idx === currentStepData.swapped[1]);
                  const isMid = currentStepData.mid === idx;
                  const isRange = currentStepData.left !== undefined && idx >= currentStepData.left && idx <= currentStepData.right;
                  
                  return (
                    <motion.div
                      key={idx}
                      className="flex-1 max-w-[40px] rounded-t-lg flex items-end justify-center pb-1 text-[10px] font-bold"
                      style={{
                        height: `${(val / 90) * 100}%`,
                        backgroundColor: isSwapped ? "#ff006e" : isComparing || isMid ? "#00b4ff" : isRange ? "#00ff8833" : "#ffffff15",
                        border: isSwapped || isComparing || isMid ? `2px solid ${isSwapped ? "#ff006e" : "#00b4ff"}` : "none",
                        color: isSwapped || isComparing || isMid ? "#fff" : "#a8d8c0"
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {val}
                    </motion.div>
                  );
                })}
              </div>

              {/* Step Info */}
              <div className="text-[10px] text-white/40 text-center">
                {currentStepData.swapped && "Swapped elements"}
                {currentStepData.compare && "Comparing elements"}
                {currentStepData.found && "✓ Target found!"}
                {currentStepData.mid !== undefined && `Mid: ${currentStepData.mid}`}
              </div>
            </div>
          )}

          {/* Graph Visualization (DFS) */}
          {selectedAlgo === 2 && currentStepData && (
            <div className="relative h-48">
              <svg className="w-full h-full">
                {/* Edges */}
                {Object.entries(graph).map(([node, neighbors]) =>
                  neighbors.map(neighbor => (
                    <line
                      key={`${node}-${neighbor}`}
                      x1={`${getNodePos(node).x}%`}
                      y1={`${getNodePos(node).y}%`}
                      x2={`${getNodePos(neighbor).x}%`}
                      y2={`${getNodePos(neighbor).y}%`}
                      stroke="#ffffff20"
                      strokeWidth="1"
                    />
                  ))
                )}
                {/* Nodes */}
                {Object.keys(graph).map(node => {
                  const pos = getNodePos(node);
                  const isVisited = currentStepData.visited?.has(node);
                  const isCurrent = currentStepData.current === node;
                  return (
                    <motion.circle
                      key={node}
                      cx={`${pos.x}%`}
                      cy={`${pos.y}%`}
                      r="18"
                      fill={isCurrent ? "#00b4ff" : isVisited ? "#00ff88" : "#ffffff15"}
                      stroke={isCurrent ? "#00b4ff" : isVisited ? "#00ff88" : "#ffffff30"}
                      strokeWidth="2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    />
                  );
                })}
                {/* Node Labels */}
                {Object.keys(graph).map(node => {
                  const pos = getNodePos(node);
                  return (
                    <text
                      key={`label-${node}`}
                      x={`${pos.x}%`}
                      y={`${pos.y}%`}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#fff"
                      fontSize="10"
                      fontFamily="'Share Tech Mono', monospace"
                    >
                      {node}
                    </text>
                  );
                })}
              </svg>
            </div>
          )}

          {!currentStepData && (
            <div className="h-32 flex items-center justify-center text-xs text-white/30">
              Press Play to start visualization
            </div>
          )}
        </div>

        {/* Code Panel */}
        <div className="bg-black/40 border border-white/10 rounded-xl p-4 overflow-hidden">
          <div className="text-[10px] text-white/30 mb-3" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            CODE
          </div>
          <pre className="text-[11px] leading-relaxed overflow-x-auto" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            <code className="text-white/60">
              {algo.code.split('\n').map((line, idx) => (
                <motion.div
                  key={idx}
                  className={`px-2 py-0.5 rounded ${
                    currentStepData && idx === getHighlightLine() ? "bg-orange-500/20 text-orange-300" : ""
                  }`}
                  animate={currentStepData && idx === getHighlightLine() ? { backgroundColor: ["#ff880022", "#ff880044", "#ff880022"] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {line || ' '}
                </motion.div>
              ))}
            </code>
          </pre>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isRunning ? () => { setIsRunning(false); clearInterval(intervalRef.current); } : startVisualization}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-400/30 rounded-lg text-orange-300 text-xs font-medium hover:bg-orange-500/30 transition-colors"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isRunning ? "Pause" : "Play"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={stepForward}
            className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/50 hover:bg-white/10 transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetVisualization}
            className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/50 hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <input
            type="range"
            min="200"
            max="2000"
            step="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-24 accent-orange-400"
          />
          <span className="text-[10px] text-white/30 w-12" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            {speed}ms
          </span>
        </div>

        {/* Progress */}
        <div className="text-[10px] text-white/40" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
          Step {currentStep + 1}/{steps.length || '-'}
        </div>
      </div>
    </motion.div>
  );

  function getNodePos(node) {
    const positions = {
      A: { x: 50, y: 20 },
      B: { x: 25, y: 50 },
      C: { x: 75, y: 50 },
      D: { x: 10, y: 80 },
      E: { x: 50, y: 80 },
      F: { x: 90, y: 80 }
    };
    return positions[node] || { x: 50, y: 50 };
  }

  function getHighlightLine() {
    if (!currentStepData) return -1;
    if (selectedAlgo === 0) {
      if (currentStepData.swapped) return 4;
      if (currentStepData.compare) return 3;
      return 1;
    }
    if (selectedAlgo === 1) {
      if (currentStepData.found) return 4;
      if (currentStepData.mid !== undefined) return 3;
      return 2;
    }
    if (selectedAlgo === 2) {
      if (currentStepData.next) return 9;
      if (currentStepData.current) return 7;
      return 3;
    }
    return -1;
  }
};

export default CSExamAlgorithmVisualizer;
