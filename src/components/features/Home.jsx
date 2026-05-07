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
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full"
      >
        <CinematicWelcomeHUD />
      </motion.div>

      {/* Asymmetrical bento grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
          className="lg:col-span-2"
        >
          <motion.div
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            className="group bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] shadow-2xl shadow-black/50 rounded-3xl p-5 md:p-6 hover:shadow-[0_0_30px_rgba(0,180,255,0.12)] transition-shadow duration-500"
          >
            <InteractiveQuickActionGrid />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            className="group bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] shadow-2xl shadow-black/50 rounded-3xl p-5 md:p-6 hover:shadow-[0_0_30px_rgba(255,136,0,0.12)] transition-shadow duration-500"
          >
            <div className="w-full">
              <StreakFlameVisualizer T={T} C={C} mono={mono} orb={orb} raj={raj} streak={streak} />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          whileHover={{ scale: 1.005, y: -1 }}
          whileTap={{ scale: 0.995 }}
          className="bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] shadow-2xl shadow-black/50 rounded-3xl p-4 md:p-5 hover:shadow-[0_0_25px_rgba(52,211,153,0.1)] transition-shadow duration-500"
        >
          <RealTimeStatusIndicator />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
