import { motion } from "framer-motion";
import CinematicWelcomeHUD from "./CinematicWelcomeHUD";
import InteractiveQuickActionGrid from "./InteractiveQuickActionGrid";
import RealTimeStatusIndicator from "./RealTimeStatusIndicator";
import StreakFlameVisualizer from "./StreakFlameVisualizer";

const Home = ({ streak, T, C, mono, orb, raj }) => {
  return (
    <div className="relative min-h-screen p-4 md:p-5 space-y-5 overflow-hidden particle-bg">

      {/* Ambient Neon Orbs */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute rounded-full top-[-10%] left-[10%] w-[480px] h-[480px] bg-[radial-gradient(circle,rgba(0,255,136,0.18),transparent_70%)] blur-[60px]" />
        <div className="absolute rounded-full bottom-[5%] right-[5%] w-[420px] h-[420px] bg-[radial-gradient(circle,rgba(0,180,255,0.14),transparent_70%)] blur-[70px]" />
        <div className="absolute rounded-full top-[40%] right-[-5%] w-[280px] h-[280px] bg-[radial-gradient(circle,rgba(255,0,110,0.10),transparent_70%)] blur-[50px]" />
        <div className="absolute rounded-full top-[5%] right-[20%] w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(255,215,0,0.08),transparent_70%)] blur-[40px]" />
      </div>

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, boxShadow: "0 28px 56px -12px rgba(0,255,136,0.22)" }}
        className="glass-card mb-5"
      >
        <CinematicWelcomeHUD />
      </motion.div>

      {/* Asymmetric Bento Grid */}
      <div className="grid grid-cols-3 gap-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="col-span-2"
        >
          <motion.div
            whileHover={{ y: -3, boxShadow: "0 20px 40px -10px rgba(0,180,255,0.2)" }}
            className="glass-card h-full"
          >
            <InteractiveQuickActionGrid />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
        >
          <motion.div
            whileHover={{ y: -3, boxShadow: "0 20px 40px -10px rgba(255,136,0,0.2)" }}
            className="glass-card min-h-[220px]"
          >
            <StreakFlameVisualizer T={T} C={C} mono={mono} orb={orb} raj={raj} streak={streak} />
          </motion.div>
        </motion.div>
      </div>

      {/* Real-time Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div
          whileHover={{ y: -2 }}
          className="glass-surface px-5 py-3"
        >
          <RealTimeStatusIndicator />
        </motion.div>
      </motion.div>

    </div>
  );
};

export default Home;