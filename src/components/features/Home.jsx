import { motion } from "framer-motion";
import CinematicWelcomeHUD from "./CinematicWelcomeHUD";
import InteractiveQuickActionGrid from "./InteractiveQuickActionGrid";
import RealTimeStatusIndicator from "./RealTimeStatusIndicator";
import StreakFlameVisualizer from "./StreakFlameVisualizer";

const Home = (props) => {
  const { streak, T, C, mono, orb, raj } = props;

  return (
    <div className="relative min-h-screen p-4 md:p-6 space-y-6 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-24 left-1/3 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Full-width hero banner */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden p-6 mb-4"
      >
        <CinematicWelcomeHUD />
      </motion.div>

      {/* Asymmetrical bento grid */}
      <div className="grid grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
          className="col-span-2"
        >
          <motion.div
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden"
          >
            <InteractiveQuickActionGrid />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden p-5 min-h-[250px] relative"
          >
            <StreakFlameVisualizer T={T} C={C} mono={mono} orb={orb} raj={raj} streak={streak} />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          whileHover={{ scale: 1.005, y: -1 }}
          whileTap={{ scale: 0.995 }}
          className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden"
        >
          <RealTimeStatusIndicator />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
