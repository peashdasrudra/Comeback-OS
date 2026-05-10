import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Droplets, Smile, BookOpen, Scale, Utensils } from "lucide-react";

export default function QuickLog({
  T, raj, mono,
  waterCount, setWaterCount,
  gainXP, TODAY,
  setTab, setShowMoodModal, setShowFoodModal, setShowWarLogModal
}) {
  const [isOpen, setIsOpen] = useState(false);

  const items = [
    {
      label: "+1 Water",
      icon: <Droplets className="w-4 h-4 text-sky-400" />,
      color: "rgba(56, 189, 248, 0.15)",
      borderColor: "rgba(56, 189, 248, 0.4)",
      action: () => {
        const nx = waterCount + 1;
        setWaterCount(nx);
        if (nx === 8) gainXP(15, "Hydrated! 💧", "hydration", true);
        else gainXP(1, "+1 Water 💧", null);
      },
    },
    {
      label: "Log Mood",
      icon: <Smile className="w-4 h-4 text-amber-400" />,
      color: "rgba(251, 191, 36, 0.15)",
      borderColor: "rgba(251, 191, 36, 0.4)",
      action: () => setShowMoodModal(true),
    },
    {
      label: "War Log",
      icon: <BookOpen className="w-4 h-4 text-emerald-400" />,
      color: "rgba(52, 211, 153, 0.15)",
      borderColor: "rgba(52, 211, 153, 0.4)",
      action: () => setShowWarLogModal(true),
    },
    {
      label: "Weight",
      icon: <Scale className="w-4 h-4 text-rose-400" />,
      color: "rgba(251, 113, 133, 0.15)",
      borderColor: "rgba(251, 113, 133, 0.4)",
      action: () => setTab("progress"),
    },
    {
      label: "Log Meal",
      icon: <Utensils className="w-4 h-4 text-orange-400" />,
      color: "rgba(251, 146, 60, 0.15)",
      borderColor: "rgba(251, 146, 60, 0.4)",
      action: () => setShowFoodModal(true),
    },
  ];

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.1 } },
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1900] bg-black/60 backdrop-blur-[6px]"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed bottom-[140px] right-4 flex flex-col gap-3 items-end"
              onClick={(e) => e.stopPropagation()}
            >
              {items.map((item, idx) => (
                <motion.button
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, x: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    item.action();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl border shadow-lg transition-all duration-200"
                  style={{
                    background: "rgba(10, 15, 30, 0.8)",
                    backdropFilter: "blur(12px)",
                    borderColor: item.borderColor || T.border,
                    color: T.bright,
                    boxShadow: `0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`,
                  }}
                >
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg"
                    style={{ background: item.color }}
                  >
                    {item.icon}
                  </div>
                  <span style={{ ...raj, fontSize: 13, fontWeight: 600, letterSpacing: "0.5px" }}>
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="fixed bottom-20 right-4 w-12 h-12 rounded-full flex items-center justify-center border-none cursor-pointer shadow-xl"
        style={{
          background: `linear-gradient(135deg, ${T.green}, ${T.blue})`,
          zIndex: isOpen ? 1901 : 150,
          boxShadow: `0 0 20px rgba(0, 255, 136, 0.4)`,
        }}
        animate={{
          rotate: isOpen ? 135 : 0,
          scale: isOpen ? 1.05 : 1,
        }}
        whileHover={{
          scale: 1.12,
          boxShadow: `0 0 30px rgba(0, 255, 136, 0.6)`,
        }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Plus className="w-5 h-5 text-[#020408]" />
      </motion.button>
    </>
  );
}
