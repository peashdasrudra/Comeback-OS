import { motion } from "framer-motion";
import { useState } from "react";
import { Cigarette, DollarSign, Calendar, Trophy, CheckCircle2 } from "lucide-react";

const milestones = [
  { days: 7, label: "1 Week", reward: "Tk 700 saved", achieved: true, icon: "🥉" },
  { days: 14, label: "2 Weeks", reward: "Tk 1,400 saved", achieved: true, icon: "🥈" },
  { days: 30, label: "1 Month", reward: "Tk 3,000 saved", achieved: false, icon: "🥇" },
  { days: 90, label: "3 Months", reward: "Tk 9,000 saved", achieved: false, icon: "🏆" },
  { days: 180, label: "6 Months", reward: "Tk 18,000 saved", achieved: false, icon: "💎" },
  { days: 365, label: "1 Year", reward: "Tk 36,500 saved", achieved: false, icon: "👑" },
];

const SmokingMilestones = ({ T, C, mono, orb, raj }) => {
  const [daysSmokeFree, setDaysSmokeFree] = useState(12);
  const cigarettesPerDay = 10;
  const pricePerCigarette = 10;
  const totalSaved = daysSmokeFree * cigarettesPerDay * pricePerCigarette;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(168,85,247,0.3)" }}
      className="card-glow"
      style={{ ...C({ padding: "14px", marginBottom: 12 }), background: "linear-gradient(135deg, rgba(168,85,247,0.08), rgba(236,72,153,0.08))", backdropFilter: "blur(20px)" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 9, color: T.red, letterSpacing: 2, ...mono }}>🚭 SMOKING MILESTONES</div>
        <Cigarette size={16} color={T.red} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 12 }}>
        <div style={{ textAlign: "center", padding: "8px 4px", background: T.bg2, borderRadius: 8 }}>
          <Calendar size={14} color={T.green} style={{ marginBottom: 4 }} />
          <div style={{ fontSize: 7, color: T.muted, ...mono }}>DAYS FREE</div>
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
            style={{ ...orb, fontSize: 20, fontWeight: 900, color: T.green }}>{daysSmokeFree}</motion.div>
        </div>
        <div style={{ textAlign: "center", padding: "8px 4px", background: T.bg2, borderRadius: 8 }}>
          <DollarSign size={14} color={T.gold} style={{ marginBottom: 4 }} />
          <div style={{ fontSize: 7, color: T.muted, ...mono }}>TK SAVED</div>
          <div style={{ ...orb, fontSize: 14, fontWeight: 900, color: T.gold }}>{(totalSaved / 1000).toFixed(1)}k</div>
        </div>
        <div style={{ textAlign: "center", padding: "8px 4px", background: T.bg2, borderRadius: 8 }}>
          <Trophy size={14} color={T.orange} style={{ marginBottom: 4 }} />
          <div style={{ fontSize: 7, color: T.muted, ...mono }}>NEXT GOAL</div>
          <div style={{ ...orb, fontSize: 14, fontWeight: 900, color: T.orange }}>30d</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 8, color: T.muted, ...mono }}>Progress to 30 days</span>
          <span style={{ fontSize: 8, color: T.green, ...mono }}>{daysSmokeFree}/30</span>
        </div>
        <div style={{ height: 8, background: T.bg2, borderRadius: 4, overflow: "hidden" }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((daysSmokeFree / 30) * 100, 100)}%` }}
            transition={{ duration: 1 }}
            style={{ height: "100%", background: `linear-gradient(90deg, ${T.green}, ${T.blue})`, borderRadius: 4 }} />
        </div>
      </div>

      {/* Timeline */}
      <div style={{ position: "relative", paddingLeft: 24 }}>
        <div style={{ position: "absolute", left: 11, top: 0, bottom: 0, width: 2, background: T.border }} />
        {milestones.map((m, i) => (
          <motion.div key={m.days} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            style={{ position: "relative", marginBottom: 12, paddingLeft: 16 }}>
            <div style={{ position: "absolute", left: -20, top: 4, width: 12, height: 12, borderRadius: "50%",
              background: m.achieved ? T.green : T.bg2, border: `2px solid ${m.achieved ? T.green : T.border}`,
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              {m.achieved && <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.bg }} />}
            </div>
            <motion.div whileHover={{ scale: 1.02 }}
              style={{ padding: "8px 12px", background: m.achieved ? `${T.green}11` : T.bg2, borderRadius: 8,
                border: `1px solid ${m.achieved ? T.green + "44" : T.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 16 }}>{m.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, color: m.achieved ? T.green : T.text, ...raj, fontWeight: 600 }}>{m.label}</div>
                    <div style={{ fontSize: 8, color: T.muted, ...mono }}>{m.reward}</div>
                  </div>
                </div>
                {m.achieved && <CheckCircle2 size={16} color={T.green} />}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div style={{ fontSize: 8, color: T.muted, ...mono, marginTop: 8, textAlign: "center", padding: "6px 12px", background: T.bg2, borderRadius: 6 }}>
        💡 {cigarettesPerDay} cigs/day × Tk {pricePerCigarette} = Tk {cigarettesPerDay * pricePerCigarette}/day saved
      </div>
    </motion.div>
  );
};

export default SmokingMilestones;
