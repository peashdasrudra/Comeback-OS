import { motion } from "framer-motion";

const Me = () => {
  return (
    <div className="flex flex-col gap-5">
      {/* 🪪 ELITE HERO ID CARD */}
      <div className="relative overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-2xl">
        {/* Glow inside the card */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[50px] rounded-full" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center border-2 border-emerald-300/30 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <span className="text-2xl text-white">⚔️</span>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Peash Das Rudra
            </h1>
            <p className="text-xs text-emerald-400 font-mono mt-1">
              NUBTK • CSE • Khulna
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 relative z-10">
          <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 font-orbitron">
            Thesis Mission
          </div>
          <p className="text-sm text-gray-300 font-medium">
            Interpretable ML for Cancer Subtype Prediction using CRO and SHAP
          </p>
          <p className="text-xs text-emerald-500/80 mt-2 font-mono">
            Supervisor: Md. Riaz Mahmud
          </p>
        </div>
      </div>

      {/* 🧵 CONNECTED ACADEMIC TIMELINE */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-2xl">
        <div className="text-[10px] font-orbitron text-gray-400 mb-6 tracking-widest uppercase">
          Academic Record
        </div>

        {/* THE THREAD (border-l-2 creates the line) */}
        <div className="relative border-l-2 border-emerald-500/30 ml-3 pl-6 flex flex-col gap-8">
          {[
            {
              title: "BSc CSE",
              year: "2026",
              grade: "3.95 / 4.00",
              badge: "🎓 TOP OF BATCH",
              active: true,
            },
            {
              title: "HSC",
              year: "2020",
              grade: "5.0 / 5.0",
              badge: "🏅 GOLDEN A+",
            },
            {
              title: "SSC",
              year: "2018",
              grade: "5.0 / 5.0",
              badge: "🏅 GOLDEN A+",
            },
            {
              title: "JSC",
              year: "2015",
              grade: "5.0 / 5.0",
              badge: "🥇 SCHOLARSHIP",
            },
            {
              title: "PSC",
              year: "2012",
              grade: "5.0 / 5.0",
              badge: "🥇 SCHOLARSHIP",
            },
          ].map((item, idx) => (
            <div key={idx} className="relative">
              {/* THE DOT (Absolute positioned to sit on the line) */}
              <div
                className={`absolute -left-[31px] top-1.5 w-[14px] h-[14px] rounded-full border-2 bg-[#020408] ${
                  item.active
                    ? "border-emerald-400 shadow-[0_0_12px_#34d399]"
                    : "border-emerald-700"
                }`}
              />

              <div className="flex justify-between items-start">
                <div>
                  <h3
                    className={`font-bold ${item.active ? "text-emerald-400 text-lg" : "text-gray-200"}`}
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">
                    {item.year}
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className={`font-black ${item.active ? "text-white" : "text-yellow-400"}`}
                  >
                    {item.grade}
                  </div>
                  <div className="text-[9px] font-bold tracking-wider mt-1 px-2 py-0.5 bg-white/10 rounded-full inline-block text-gray-300">
                    {item.badge}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Me;
