import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-xs">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-xl border shadow-lg ${
                toast.type === "success" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                toast.type === "error" ? "bg-red-500/10 border-red-500/30 text-red-400" :
                toast.type === "warning" ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
                "bg-blue-500/10 border-blue-500/30 text-blue-400"
              }`}
            >
              {toast.type === "success" && <CheckCircle size={16} />}
              {toast.type === "error" && <AlertCircle size={16} />}
              {toast.type === "warning" && <AlertCircle size={16} />}
              {toast.type === "info" && <Info size={16} />}
              <span className="text-sm flex-1">{toast.message}</span>
              <button
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={12} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};
