import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Music, Volume2 } from "lucide-react";

const AcousticVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState(440);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    
    const draw = () => {
      ctx.fillStyle = 'rgba(2, 4, 8, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < 48; i++) {
        const x = (i / 48) * canvas.width;
        const barHeight = Math.random() * canvas.height * 0.8;
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, '#00ff88');
        gradient.addColorStop(1, '#00b4ff');
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, canvas.width / 48 - 2, barHeight);
      }
      
      animationId = requestAnimationFrame(draw);
    };
    
    draw();
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying]);

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
          <div className="p-2 bg-purple-500/20 rounded-xl">
            <Music className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white/90" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Acoustic Visualizer
            </h2>
            <p className="text-xs text-white/50" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              Dynamic audio-wave simulation
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            isPlaying 
              ? "bg-purple-500/20 text-purple-300 border border-purple-400/30" 
              : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
          }`}
        >
          {isPlaying ? "Stop" : "Play"}
        </motion.button>
      </div>

      {/* Canvas Waveform */}
      <div className="mb-6 h-32 bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden relative">
        <canvas 
          ref={canvasRef}
          width={800}
          height={128}
          className="w-full h-full"
        />
        {isPlaying && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              boxShadow: ["0 0 20px #a855f722", "0 0 40px #a855f744", "0 0 20px #a855f722"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>

      {/* Frequency Selector */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-[11px] text-white/60" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Frequency
          </span>
          <span className="text-[11px] font-bold" style={{ color: "#a855f7", fontFamily: "'Orbitron', monospace" }}>
            {frequency} Hz
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="2000"
          value={frequency}
          onChange={(e) => setFrequency(Number(e.target.value))}
          className="w-full accent-purple-400"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "BAND", value: "Rock", icon: "🎸" },
          { label: "FREQ", value: frequency + "Hz", icon: "🎵" },
          { label: "STATUS", value: isPlaying ? "Active" : "Idle", icon: isPlaying ? "🟢" : "⚫️" }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="p-3 bg-white/5 rounded-xl text-center"
          >
            <div className="text-xl mb-1">{stat.icon}</div>
            <div className="text-[9px] text-white/30 mb-1" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              {stat.label}
            </div>
            <div className="text-xs font-bold text-white/80" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AcousticVisualizer;
