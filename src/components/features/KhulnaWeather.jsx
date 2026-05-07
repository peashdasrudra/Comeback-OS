import { motion, useSpring } from "framer-motion";
import { useState, useEffect } from "react";
import { Cloud, Sun, Thermometer } from "lucide-react";

const KhulnaWeather = () => {
  const [temperature, setTemperature] = useState(32);
  const [condition, setCondition] = useState("Partly Cloudy");
  const [humidity, setHumidity] = useState(78);
  
  const springTemp = useSpring(temperature, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTemperature(30 + Math.random() * 6);
      setHumidity(70 + Math.random() * 15);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-4 md:p-6"
      style={{ minHeight: 200 }}
    >
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            "linear-gradient(135deg, #ff880022, #ff006e11)",
            "linear-gradient(135deg, #00b4ff22, #00ff8811)",
            "linear-gradient(135deg, #ff880022, #ff006e11)"
          ]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Drifting Clouds */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${10 + i * 15}%`,
            left: `${-10 + i * 25}%`,
            opacity: 0.05 + (i * 0.03)
          }}
          animate={{ x: ["0%", "120%"] }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: "linear",
            delay: i * 3
          }}
        >
          <Cloud style={{ width: 40 + i * 10, height: 40 + i * 10, color: "#ffffff" }} />
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="p-2 bg-yellow-500/20 rounded-xl"
            >
              <Sun className="w-6 h-6 text-yellow-400" />
            </motion.div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white/90" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                Khulna Weather
              </h2>
              <p className="text-xs text-white/50" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                Real-time environmental data
              </p>
            </div>
          </div>
          <div className="text-right">
            <motion.div
              className="text-4xl font-bold text-yellow-300"
              style={{ fontFamily: "'Orbitron', monospace" }}
              animate={{ textShadow: ["0 0 10px #ff880044", "0 0 20px #ff880066", "0 0 10px #ff880044"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {temperature}°C
            </motion.div>
            <div className="text-[10px] text-white/40" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              {condition}
            </div>
          </div>
        </div>

        {/* Humidity Pulse */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-[11px] text-white/60" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                Humidity
              </span>
              <span className="text-[11px] font-bold text-blue-300" style={{ fontFamily: "'Orbitron', monospace" }}>
                {humidity}%
              </span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-blue-400"
                animate={{ width: `${humidity}%`, boxShadow: ["0 0 0px #00b4ff", "0 0 10px #00b4ff", "0 0 0px #00b4ff"] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "FEELS LIKE", value: `${temperature - 3}°C`, icon: "🌡️" },
            { label: "WIND", value: "12 km/h", icon: "💨" },
            { label: "UV INDEX", value: "8 (V. High)", icon: "☀️" }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="p-3 bg-white/5 rounded-xl text-center"
            >
              <div className="text-xl mb-1">{stat.icon}</div>
              <div className="text-[9px] text-white/30 mb-1" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                {stat.label}
              </div>
              <div className="text-xs font-bold text-white/80" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default KhulnaWeather;
