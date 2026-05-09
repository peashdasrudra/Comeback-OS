/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#00ff88", light: "#33ffaa", dark: "#00cc66" },
        secondary: { DEFAULT: "#00b4ff", light: "#33ccff", dark: "#0090cc" },
        accent: { DEFAULT: "#ff006e", light: "#ff3399", dark: "#cc0055" },
        success: "#00ff88",
        warning: "#ff8800",
        danger: "#ff2244",
        info: "#00b4ff",
        gold: "#ffd700",
        
        bg: { DEFAULT: "#020408", surface: "#060d12", card: "#0a1520", overlay: "#0d2030" },
        text: { primary: "#e8f8f0", secondary: "#a8d8c0", muted: "#3a6a5a", dim: "#2a5a3a" },
        border: { DEFAULT: "#0d2030", light: "#1a3040" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Fira Code", "monospace"],
        display: ["Orbitron", "sans-serif"],
        body: ["Rajdhani", "sans-serif"],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 255, 136, 0.3)",
        "glow-lg": "0 0 40px rgba(0, 255, 136, 0.4)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.3)",
        "glass-lg": "0 12px 48px rgba(0, 0, 0, 0.4)",
      },
      animation: {
        "shimmer": "shimmer 2s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "fade-up": "fade-up 0.5s ease-out forwards",
        "slide-in": "slide-in 0.4s ease-out forwards",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px var(--tw-shadow-color)" },
          "50%": { boxShadow: "0 0 20px var(--tw-shadow-color)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(-10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
