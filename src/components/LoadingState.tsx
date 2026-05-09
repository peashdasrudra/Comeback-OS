import { motion } from "framer-motion";

const LoadingState = () => {
  return (
    <div className="min-h-screen bg-[#020408] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-green-500/30 border-t-green-400 rounded-full mx-auto mb-4"
        />
        <p className="text-green-400 text-sm font-mono tracking-wider">Loading...</p>
      </motion.div>
    </div>
  );
};

export default LoadingState;
