import { motion } from "framer-motion";
import { useState } from "react";
import { Moon, Smile, TrendingUp } from "lucide-react";

const data = [
  { sleep: 5.5, mood: 3, date: "May 6" },
  { sleep: 6, mood: 3, date: "May 7" },
  { sleep: 4.5, mood: 2, date: "May 8" },
  { sleep: 7, mood: 4, date: "May 9" },
  { sleep: 8, mood: 5, date: "May 10" },
  { sleep: 6.5, mood: 4, date: "May 11" },
  { sleep: 5, mood: 3, date: "May 12" },
  { sleep: 7.5, mood: 5, date: "May 13" },
  { sleep: 8, mood: 5, date: "May 14" },
  { sleep: 6, mood: 4, date: "May 15" },
  { sleep: 9, mood: 5, date: "May 16" },
  { sleep: 7, mood: 4, date: "May 17" },
  { sleep: 6, mood: 3, date: "May 18" },
  { sleep: 8, mood: 5, date: "May 19" },
  { sleep: 7.5, mood: 4, date: "May 20" },
];

const SleepMoodCorrelator = ({ T, C, mono, orb, raj }) => {
  const [hovered, setHovered] = useState(null);
  const sleepRange = [4, 9];
  const moodRange = [1, 5];
  const correlation = 0.87;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(0,255,136,0.3)" }}
      className="card-glow"
      style={{ ...C({ padding: "14px", marginBottom: 12 }), background: "linear-gradient(135deg, rgba(0,255,136,0.08), rgba(0,180,255,0.08))", backdropFilter: "blur(20px)" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 9, color: T.blue, letterSpacing: 2, ...mono }}>🌙 SLEEP ↔ MOOD</div>
        <TrendingUp size={16} color={T.blue} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 12 }}>
        <div style={{ textAlign: "center", padding: "8px 4px", background: T.bg2, borderRadius: 8 }}>
          <Moon size={14} color={T.blue} style={{ marginBottom: 4 }} />
          <div style={{ fontSize: 7, color: T.muted, ...mono }}>AVG SLEEP</div>
          <div style={{ ...orb, fontSize: 16, fontWeight: 900, color: T.blue }}>6.8h</div>
        </div>
        <div style={{ textAlign: "center", padding: "8px 4px", background: T.bg2, borderRadius: 8 }}>
          <Smile size={14} color={T.green} style={{ marginBottom: 4 }} />
          <div style={{ fontSize: 7, color: T.muted, ...mono }}>AVG MOOD</div>
          <div style={{ ...orb, fontSize: 16, fontWeight: 900, color: T.green }}>4.0</div>
        </div>
        <div style={{ textAlign: "center", padding: "8px 4px", background: T.bg2, borderRadius: 8 }}>
          <TrendingUp size={14} color={T.pink} style={{ marginBottom: 4 }} />
          <div style={{ fontSize: 7, color: T.muted, ...mono }}>CORRELATION</div>
          <div style={{ ...orb, fontSize: 16, fontWeight: 900, color: T.pink }}>{correlation}</div>
        </div>
      </div>

      <div style={{ position: "relative", background: T.bg2, borderRadius: 12, padding: 12, height: 220 }}>
        <div style={{ fontSize: 7, color: T.muted, ...mono, marginBottom: 8 }}>SLEEP (h) → MOOD (1-5)</div>
        <svg width="100%" height="180" viewBox="0 0 300 180">
          {/* Grid */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <line key={i} x1={40} y1={150 - i * 30} x2={290} y2={150 - i * 30}
              stroke={T.border} strokeWidth={0.5} strokeDasharray="2 2" />
          ))}
          {/* Axes */}
          <line x1={40} y1={150} x2={290} y2={150} stroke={T.muted} strokeWidth={1} />
          <line x1={40} y1={0} x2={40} y2={150} stroke={T.muted} strokeWidth={1} />
          {/* Points and lines */}
          {data.map((d, i) => {
            const x = 40 + ((d.sleep - sleepRange[0]) / (sleepRange[1] - sleepRange[0])) * 250;
            const y = 150 - ((d.mood - moodRange[0]) / (moodRange[1] - moodRange[0])) * 120;
            return (
              <g key={i}>
                {i > 0 && (
                  <motion.line
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    x1={40 + ((data[i-1].sleep - sleepRange[0]) / (sleepRange[1] - sleepRange[0])) * 250}
                    y1={150 - ((data[i-1].mood - moodRange[0]) / (moodRange[1] - moodRange[0])) * 120}
                    x2={x} y2={y}
                    stroke={T.blue} strokeWidth={1.5} opacity={0.4}
                  />
                )}
                <motion.circle
                  initial={{ r: 0 }} animate={{ r: hovered === i ? 8 : 5 }}
                  transition={{ duration: 0.3 }}
                  cx={x} cy={y} fill={T.blue} opacity={0.8}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
                {hovered === i && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <rect x={x - 35} y={y - 35} width={70} height={22} rx={4} fill={T.bg1} opacity={0.9} />
                    <text x={x} y={y - 20} textAnchor="middle" fill={T.bright} fontSize={8} fontFamily="monospace">
                      {d.date}: {d.sleep}h → {d.mood}/5
                    </text>
                  </motion.g>
                )}
              </g>
            );
          })}
          {/* Y-axis labels */}
          {[1, 2, 3, 4, 5].map(i => (
            <text key={i} x={35} y={155 - i * 30} textAnchor="end" fill={T.muted} fontSize={8} fontFamily="monospace">
              {i}
            </text>
          ))}
          {/* X-axis labels */}
          {[4, 5, 6, 7, 8, 9].map((h, i) => (
            <text key={h} x={40 + i * 50} y={162} textAnchor="middle" fill={T.muted} fontSize={8} fontFamily="monospace">
              {h}h
            </text>
          ))}
        </svg>
      </div>
      <div style={{ fontSize: 8, color: T.muted, ...mono, marginTop: 8, textAlign: "center" }}>
        💡 Strong positive correlation — more sleep = better next-day mood
      </div>
    </motion.div>
  );
};

export default SleepMoodCorrelator;
