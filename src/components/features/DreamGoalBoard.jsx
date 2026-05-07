import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { Gem, TrendingUp, MapPin } from "lucide-react";

const dreams = [
  { icon: "🏍️", title: "Royal Enfield Hunter 350", tag: "Near Term", cost: "Tk 1.8L", progress: 15, color: "#ef4444", year: "2027" },
  { icon: "🚗", title: "Hyundai Creta / Kia Seltos", tag: "Mid Term", cost: "Tk 25L", progress: 5, color: "#3b82f6", year: "2029" },
  { icon: "🏠", title: "Duplex House in Khulna", tag: "Long Term", cost: "Tk 80L", progress: 2, color: "#f59e0b", year: "2032" },
  { icon: "🌍", title: "MS/PhD Abroad (Germany/Canada)", tag: "Heart Goal", cost: "Funded", progress: 60, color: "#10b981", year: "2027" },
  { icon: "💰", title: "Financial Freedom (Tk 5Cr+)", tag: "Ultimate", cost: "Tk 5Cr", progress: 1, color: "#a855f7", year: "2040" },
  { icon: "🏆", title: "Top 0.1% Life Legacy", tag: "Legacy", cost: "Priceless", progress: 10, color: "#ff006e", year: "2045" },
];

const DreamGoalBoard = ({ T, C, mono, orb, raj }) => {
  const [activeDream, setActiveDream] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(234,179,8,0.3)" }}
      className="card-glow"
      style={{ ...C({ padding: "14px", marginBottom: 12 }), background: "linear-gradient(135deg, rgba(234,179,8,0.08), rgba(249,115,22,0.08))", backdropFilter: "blur(20px)", border: `1px solid ${T.gold}44` }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 9, color: T.gold, letterSpacing: 2, ...mono }}>🏆 DREAM GOAL BOARD</div>
        <Gem size={16} color={T.gold} />
      </div>

      <div style={{ position: "relative", overflow: "hidden", borderRadius: 12, marginBottom: 12 }}>
        {/* Parallax background images */}
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", inset: 0, opacity: 0.08, background: `radial-gradient(circle at 30% 40%, ${T.gold}, transparent 60%), radial-gradient(circle at 70% 60%, ${T.blue}, transparent 60%)`,
            zIndex: 0 }}
        />
        <div style={{ position: "relative", zIndex: 1, padding: 12, background: T.bg2, borderRadius: 12 }}>
          <div style={{ fontSize: 8, color: T.muted, ...mono, marginBottom: 10 }}>VISION BOARD — PARALLAX</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {dreams.map((d, i) => (
              <motion.div key={d.title} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 300 } }}
                style={{ padding: "10px 8px", background: activeDream === i ? `${d.color}11` : T.bg1,
                  borderRadius: 10, border: `1px solid ${activeDream === i ? d.color + "44" : T.border}`,
                  cursor: "pointer", textAlign: "center" }}
                onClick={() => setActiveDream(activeDream === i ? null : i)}
              >
                <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 3 + i * 0.5, repeat: Infinity }}
                  style={{ fontSize: 28, marginBottom: 6 }}>{d.icon}</motion.div>
                <div style={{ fontSize: 9, color: T.text, ...raj, fontWeight: 600, marginBottom: 3 }}>{d.title}</div>
                <div style={{ fontSize: 7, color: d.color, ...mono, fontWeight: 600 }}>{d.tag}</div>
                <div style={{ height: 3, background: T.bg, borderRadius: 2, marginTop: 6, overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${d.progress}%` }}
                    transition={{ duration: 1, delay: i * 0.15 }}
                    style={{ height: "100%", background: d.color, borderRadius: 2 }} />
                </div>
                <div style={{ fontSize: 6, color: T.muted, ...mono, marginTop: 3 }}>{d.progress}%</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {activeDream !== null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ padding: "10px 12px", background: T.bg2, borderRadius: 8, border: `1px solid ${dreams[activeDream].color}44` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 12, color: dreams[activeDream].color, ...raj, fontWeight: 700 }}>
                {dreams[activeDream].icon} {dreams[activeDream].title}
              </div>
              <div style={{ fontSize: 8, color: T.muted, ...mono, marginTop: 2 }}>
                <MapPin size={8} style={{ display: "inline", marginRight: 3 }} />
                Target: {dreams[activeDream].year} • {dreams[activeDream].cost}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ ...orb, fontSize: 20, fontWeight: 900, color: dreams[activeDream].color }}>
                {dreams[activeDream].progress}%
              </div>
              <div style={{ fontSize: 6, color: T.muted, ...mono }}>PROGRESS</div>
            </div>
          </div>
        </motion.div>
      )}

      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 10 }}>
        <motion.div animate={{ x: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity }}
          style={{ ...orb, fontSize: 10, color: T.gold, fontWeight: 700 }}>🇩🇪 GERMANY</motion.div>
        <motion.div animate={{ x: [5, -5, 5] }} transition={{ duration: 4, repeat: Infinity }}
          style={{ ...orb, fontSize: 10, color: T.blue, fontWeight: 700 }}>🇨🇦 CANADA</motion.div>
      </div>
    </motion.div>
  );
};

export default DreamGoalBoard;
