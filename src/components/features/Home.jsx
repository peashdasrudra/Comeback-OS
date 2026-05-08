import { motion } from "framer-motion";
import CinematicWelcomeHUD from "./CinematicWelcomeHUD";
import InteractiveQuickActionGrid from "./InteractiveQuickActionGrid";
import RealTimeStatusIndicator from "./RealTimeStatusIndicator";
import StreakFlameVisualizer from "./StreakFlameVisualizer";

const Home = (props) => {
  const { streak, T, C, mono, orb, raj } = props;

  return (
    <div className="relative min-h-screen p-4 md:p-5 space-y-5 overflow-hidden">

      {/* ✅ FIX 3: PREMIUM AMBIENT NEON ORBS — dramatically brightened from /5 → /20+
           These are the "light sources" behind glass panels. Without them, blur = grey mud.
           With them, blur = frosted neon glass. */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true" style={{ zIndex: 0 }}>
        {/* Primary green orb — top-left, the hero light source */}
        <div
          className="absolute rounded-full"
          style={{
            top: "-10%",
            left: "10%",
            width: 480,
            height: 480,
            background: "radial-gradient(circle, rgba(0,255,136,0.18) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        {/* Blue orb — bottom-right */}
        <div
          className="absolute rounded-full"
          style={{
            bottom: "5%",
            right: "5%",
            width: 420,
            height: 420,
            background: "radial-gradient(circle, rgba(0,180,255,0.14) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        {/* Pink/orange accent — mid-right */}
        <div
          className="absolute rounded-full"
          style={{
            top: "40%",
            right: "-5%",
            width: 280,
            height: 280,
            background: "radial-gradient(circle, rgba(255,0,110,0.10) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        {/* Gold pulse — top-right corner */}
        <div
          className="absolute rounded-full"
          style={{
            top: "5%",
            right: "20%",
            width: 200,
            height: 200,
            background: "radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* ── HERO BANNER (full-width) ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, boxShadow: "0 28px 56px -12px rgba(0,255,136,0.22)" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ position: "relative", zIndex: 1 }}
        // ✅ The glass card wrapper — child component CinematicWelcomeHUD is transparent inside
        className="bg-white/[0.04] backdrop-blur-3xl border border-white/10 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.35)] overflow-hidden mb-5"
      >
        <CinematicWelcomeHUD />
      </motion.div>

      {/* ── ASYMMETRIC BENTO GRID ── */}
      <div className="grid grid-cols-3 gap-4" style={{ position: "relative", zIndex: 1 }}>
        {/* Quick Actions — 2/3 width */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
          className="col-span-2"
        >
          <motion.div
            whileHover={{ y: -3, boxShadow: "0 20px 40px -10px rgba(0,180,255,0.2)" }}
            // ✅ The outer glass card — InteractiveQuickActionGrid is transparent inside
            className="bg-white/[0.04] backdrop-blur-3xl border border-white/10 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.35)] overflow-hidden h-full"
          >
            <InteractiveQuickActionGrid />
          </motion.div>
        </motion.div>

        {/* Streak Flame — 1/3 width */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            whileHover={{ y: -3, boxShadow: "0 20px 40px -10px rgba(255,136,0,0.2)" }}
            className="bg-white/[0.04] backdrop-blur-3xl border border-white/10 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.35)] overflow-hidden min-h-[220px]"
          >
            <StreakFlameVisualizer T={T} C={C} mono={mono} orb={orb} raj={raj} streak={streak} />
          </motion.div>
        </motion.div>
      </div>

      {/* ── REAL-TIME STATUS BAR ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
        style={{ position: "relative", zIndex: 1 }}
      >
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white/[0.04] backdrop-blur-3xl border border-white/10 rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.3)] overflow-hidden px-5 py-3"
        >
          <RealTimeStatusIndicator />
        </motion.div>
      </motion.div>

    </div>
  );
};

export default Home;
