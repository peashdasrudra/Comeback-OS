// ─── ADMISSIONS DASHBOARD — ULTRA EDITION ─────────────────────────────
// XP system, achievements, pomodoro, notes, search, quotes, confetti, glass morphism
// Last Updated: May 6, 2026

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ADMISSIONS_NEWS, ADMISSIONS_TIPS, ADMISSIONS_TRICKS, ADMISSIONS_TRACKER_TEMPLATE,
  FINAL_ADMISSION_STRATEGY, INTERVIEW_PREP, SOP_TEMPLATES, SCHOLARSHIP_GUIDE,
  ALL_UNIVERSITIES, DAILY_PULSE, VIVA_PRACTICE_QUESTIONS, DOCUMENT_READINESS,
  RESEARCH_PAPER_TRACKER, QUICK_STATS, MOTIVATIONAL_QUOTES, ACHIEVEMENTS,
} from "./admissions_features.js";

const GLOW = (color) => `0 0 8px ${color}44, 0 0 20px ${color}22`;
const STRONG_GLOW = (color) => `0 0 10px ${color}55, 0 0 25px ${color}33, 0 0 50px ${color}11`;
const GLASS = (bg) => `linear-gradient(135deg, ${bg}88, ${bg}44)`;

const LEVELS = [
  { level: 1, name: "Initiate", xp: 0, icon: "🌱" },
  { level: 2, name: "Seeker", xp: 100, icon: "📖" },
  { level: 3, name: "Scholar", xp: 300, icon: "📚" },
  { level: 4, name: "Researcher", xp: 600, icon: "🔬" },
  { level: 5, name: "Warrior", xp: 1000, icon: "⚔️" },
  { level: 6, name: "Strategist", xp: 1500, icon: "🧠" },
  { level: 7, name: "Champion", xp: 2500, icon: "🏆" },
  { level: 8, name: "Legend", xp: 4000, icon: "👑" },
  { level: 9, name: "Mythic", xp: 6000, icon: "💎" },
  { level: 10, name: "Comeback King", xp: 10000, icon: "🔥" },
];

function getLevel(xp) {
  let lvl = LEVELS[0];
  for (const l of LEVELS) { if (xp >= l.xp) lvl = l; }
  const next = LEVELS.find(l => l.xp > xp);
  return { ...lvl, nextXp: next ? next.xp : lvl.xp + 5000, prevXp: lvl.xp };
}

function Confetti({ active }) {
  if (!active) return null;
  const colors = ["#ff2244", "#00ff88", "#00b4ff", "#ff8800", "#a855f7", "#fbbf24", "#ec4899"];
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }}>
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
          width: 8 + Math.random() * 8, height: 8 + Math.random() * 8,
          background: colors[i % colors.length], borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          animation: `confettiBurst ${0.8 + Math.random() * 0.6}s ease-out forwards`,
          animationDelay: `${Math.random() * 0.3}s`,
        }} />
      ))}
    </div>
  );
}

function AnimatedCounter({ value, color, fontSize, prefix = "", suffix = "" }) {
  return (
    <span style={{ fontFamily: "'Orbitron',monospace", fontSize, fontWeight: 900, color, animation: "countUp .5s ease-out" }}>
      {prefix}{value}{suffix}
    </span>
  );
}

function StatCard({ label, value, icon, color, sub, delay = 0 }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        background: `rgba(255,255,255,0.05)`, border: `1px solid ${color}44`,
        borderRadius: 20, padding: "12px 10px", textAlign: "center",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        boxShadow: GLOW(color),
        animation: `fadeInUp .4s ease-out ${delay}ms both`,
      }}
    >
      <div style={{ fontSize: 18 }}>{icon}</div>
      <AnimatedCounter value={value} color={color} fontSize={16} />
      <div style={{ fontSize: 8, color: "#3a6a5a", fontFamily: "'Share Tech Mono',monospace", marginTop: 2, letterSpacing: 1 }}>{label}</div>
      {sub && <div style={{ fontSize: 7, color: "#2a5a3a", marginTop: 3 }}>{sub}</div>}
    </motion.div>
  );
}

function PriorityBadge({ priority }) {
  const colors = { CRITICAL: "#ff2244", HIGH: "#ff8800", MEDIUM: "#00b4ff", LOW: "#00ff88" };
  const c = colors[priority] || "#3a6a5a";
  return (
    <span style={{ fontSize: 7, background: c + "22", color: c, padding: "2px 6px", borderRadius: 4, fontFamily: "'Share Tech Mono',monospace", fontWeight: 700, letterSpacing: 1 }}>
      {priority}
    </span>
  );
}

function ProgressBar({ pct, color, height = 4, animated = true }) {
  return (
    <div className="bg-white/5 rounded overflow-hidden" style={{ height }}>
      <div style={{
        width: `${pct}%`, height: "100%", background: color,
        transition: "width .8s ease", borderRadius: height,
        animation: animated ? "progressBar 1s ease-out" : "none",
        backgroundSize: "200% 100%",
        backgroundImage: `linear-gradient(90deg, ${color}, ${color}cc, ${color})`,
        boxShadow: `0 0 10px ${color}`,
      }} />
    </div>
  );
}

function GlassCard({ children, borderColor, bg, padding = 14, style = {}, glow, hover = true }) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.01, y: -2 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white/[0.03] backdrop-blur-2xl rounded-2xl"
      style={{
        border: `1px solid ${borderColor || "rgba(255,255,255,0.08)"}`,
        padding, boxShadow: glow || "0 8px 32px rgba(0,0,0,0.3)",
        ...(bg ? { background: GLASS(bg) } : {}),
        ...style,
      }}
    >{children}</motion.div>
  );
}

export function AdmissionsDashboard({ T, orb, mono, raj, C }) {
  const [activeTab, setActiveTab] = useState("pulse");
  const [expandedNews, setExpandedNews] = useState(null);
  const [expandedTip, setExpandedTip] = useState(null);
  const [selectedUni, setSelectedUni] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [selectedSOP, setSelectedSOP] = useState("kuet");
  const [selectedScholarship, setSelectedScholarship] = useState("daad");
  const [copiedSOP, setCopiedSOP] = useState(false);
  const [vivaQ, setVivaQ] = useState(null);
  const [vivaTimer, setVivaTimer] = useState(0);
  const [vivaRunning, setVivaRunning] = useState(false);
  const [vivaScore, setVivaScore] = useState(0);
  const [showVivaAnswer, setShowVivaAnswer] = useState(false);
  const [docChecks, setDocChecks] = useState({});
  const [profLog, setProfLog] = useState([]);
  const [newProf, setNewProf] = useState({ name: "", uni: "", email: "", area: "", date: "", response: "not_sent", notes: "" });
  const [todayIdx, setTodayIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [notes, setNotes] = useState("");
  const [quote, setQuote] = useState(null);
  const [confettiActive, setConfettiActive] = useState(false);
  const [showAchievement, setShowAchievement] = useState(null);
  const [tabTransition, setTabTransition] = useState(true);
  const [now, setNow] = useState(Date.now());
  const [pomodoroMode, setPomodoroMode] = useState("work");
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroSessions, setPomodoroSessions] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [expandedUniSections, setExpandedUniSections] = useState({});

  const searchInputRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    setTodayIdx(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
    const saved = localStorage.getItem("comeback_os");
    if (saved) {
      try {
        const d = JSON.parse(saved);
        if (d.profLog) setProfLog(d.profLog);
        if (d.docChecks) setDocChecks(d.docChecks);
        if (d.xp) setXp(d.xp);
        if (d.bookmarks) setBookmarks(d.bookmarks);
        if (d.notes) setNotes(d.notes);
        if (d.pomodoroSessions) setPomodoroSessions(d.pomodoroSessions);
        if (d.lastVisit) {
          const last = new Date(d.lastVisit);
          const today = new Date();
          const diff = Math.floor((today - last) / 86400000);
          if (diff === 1) setStreak(s => s + 1);
          else if (diff > 1) setStreak(1);
          else setStreak(s => Math.max(s, 1));
        } else setStreak(1);
      } catch {}
    } else { setStreak(1); }
    setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
  }, []);

  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const lvl = useMemo(() => getLevel(xp), [xp]);

  const save = useCallback((updates) => {
    const saved = localStorage.getItem("comeback_os");
    const d = saved ? JSON.parse(saved) : {};
    const next = { ...d, ...updates, lastVisit: new Date().toISOString() };
    localStorage.setItem("comeback_os", JSON.stringify(next));
  }, []);

  const addXp = useCallback((amount) => {
    setXp(prev => {
      const next = prev + amount;
      const oldLvl = getLevel(prev).level;
      const newLvl = getLevel(next).level;
      if (newLvl > oldLvl) {
        setShowAchievement({ icon: getLevel(next).icon, name: `Level ${newLvl}: ${getLevel(next).name}`, desc: "Level Up!", color: T.gold });
        triggerConfetti();
      }
      save({ xp: next });
      return next;
    });
  }, [save, T.gold]);

  const triggerConfetti = useCallback(() => {
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 1500);
  }, []);

  const checkAchievements = useCallback((id) => {
    const ach = ACHIEVEMENTS.find(a => a.id === id);
    if (ach) {
      setShowAchievement(ach);
      triggerConfetti();
      addXp(ach.xp);
      setTimeout(() => setShowAchievement(null), 3000);
    }
  }, [triggerConfetti, addXp]);

  const toggleDoc = useCallback((id) => {
    setDocChecks(prev => {
      const next = { ...prev, [id]: !prev[id] };
      save({ docChecks: next });
      if (next[id]) {
        const total = Object.values(next).filter(Boolean).length;
        if (total === 5) checkAchievements("doc_5");
        if (total === DOCUMENT_READINESS.length) checkAchievements("doc_all");
      }
      return next;
    });
  }, [save, checkAchievements]);

  const addProf = useCallback(() => {
    if (!newProf.name) return;
    const entry = { ...newProf, id: Date.now().toString() };
    const next = [...profLog, entry];
    setProfLog(next);
    save({ profLog: next });
    setNewProf({ name: "", uni: "", email: "", area: "", date: "", response: "not_sent", notes: "" });
    addXp(15);
    if (next.length === 1) checkAchievements("prof_first");
    if (next.length === 5) checkAchievements("prof_5");
  }, [newProf, profLog, save, addXp, checkAchievements]);

  const updateProfResponse = useCallback((id, resp) => {
    const next = profLog.map(p => p.id === id ? { ...p, response: resp } : p);
    setProfLog(next);
    save({ profLog: next });
  }, [profLog, save]);

  const toggleBookmark = useCallback((uniId) => {
    setBookmarks(prev => {
      const next = prev.includes(uniId) ? prev.filter(b => b !== uniId) : [...prev, uniId];
      save({ bookmarks: next });
      if (next.length === 1 && !prev.includes(uniId)) checkAchievements("bookmark_1");
      return next;
    });
  }, [save, checkAchievements]);

  const saveNotes = useCallback((text) => {
    setNotes(text);
    save({ notes: text });
  }, [save]);

  const handleTab = useCallback((tabId) => {
    setTabTransition(false);
    setTimeout(() => { setActiveTab(tabId); setTabTransition(true); }, 80);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "/" && !e.ctrlKey) { e.preventDefault(); searchInputRef.current?.focus(); }
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); searchInputRef.current?.focus(); }
      if (e.key === "?" && e.shiftKey) { e.preventDefault(); setShowShortcuts(s => !s); }
      if (e.key === "Escape") { setShowShortcuts(false); setSearchQuery(""); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!vivaRunning || vivaTimer <= 0) return;
    const t = setTimeout(() => setVivaTimer(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [vivaRunning, vivaTimer]);

  useEffect(() => {
    if (!pomodoroRunning || pomodoroTime <= 0) {
      if (pomodoroRunning && pomodoroTime === 0) {
        setPomodoroRunning(false);
        if (pomodoroMode === "work") {
          const next = pomodoroSessions + 1;
          setPomodoroSessions(next);
          save({ pomodoroSessions: next });
          addXp(25);
          if (next === 1) checkAchievements("pomodoro_1");
          if (next === 10) checkAchievements("pomodoro_10");
          triggerConfetti();
          setPomodoroMode("break");
          setPomodoroTime(5 * 60);
        } else {
          setPomodoroMode("work");
          setPomodoroTime(25 * 60);
        }
      }
      return;
    }
    const t = setTimeout(() => setPomodoroTime(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [pomodoroRunning, pomodoroTime, pomodoroMode, pomodoroSessions, save, addXp, checkAchievements, triggerConfetti]);

  const startViva = useCallback((q) => {
    setVivaQ(q); setVivaTimer(q.timeLimit); setVivaRunning(true); setShowVivaAnswer(false);
  }, []);
  const randomViva = useCallback(() => {
    startViva(VIVA_PRACTICE_QUESTIONS[Math.floor(Math.random() * VIVA_PRACTICE_QUESTIONS.length)]);
  }, [startViva]);
  const doneViva = useCallback(() => {
    setVivaRunning(false); setVivaScore(s => {
      const next = s + 1;
      if (next === 1) checkAchievements("viva_1");
      if (next === 5) checkAchievements("viva_5");
      if (next === 10) checkAchievements("viva_10");
      return next;
    });
    addXp(20);
  }, [checkAchievements, addXp]);

  const copySOP = (text) => {
    navigator.clipboard.writeText(text).then(() => { setCopiedSOP(true); setTimeout(() => setCopiedSOP(false), 2000); });
  };

  const shuffleQuote = () => {
    setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
  };

  const docPct = Math.round((DOCUMENT_READINESS.filter(d => docChecks[d.id]).length / DOCUMENT_READINESS.length) * 100);
  const researchPct = Math.round((RESEARCH_PAPER_TRACKER.milestones.filter(m => m.status === "done").length / RESEARCH_PAPER_TRACKER.milestones.length) * 100);
  const checklistPct = Math.round((ADMISSIONS_TRACKER_TEMPLATE.checklist.filter(c => docChecks[c.item]).length / ADMISSIONS_TRACKER_TEMPLATE.checklist.length) * 100);
  const pulse = DAILY_PULSE[todayIdx];
  const completedChecklist = ADMISSIONS_TRACKER_TEMPLATE.checklist.filter(c => docChecks[c.item]).length;
  if (completedChecklist === 5) checkAchievements?.("checklist_5");

  const filteredUnis = useMemo(() => {
    if (!searchQuery) return ALL_UNIVERSITIES;
    const q = searchQuery.toLowerCase();
    return ALL_UNIVERSITIES.filter(u =>
      u.name.toLowerCase().includes(q) || u.fullName.toLowerCase().includes(q) ||
      u.location.toLowerCase().includes(q) || u.tier.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const tabs = [
    { id: "pulse", label: "⚡ PULSE" }, { id: "dashboard", label: "🚀 HQ" },
    { id: "unis", label: "🏛️ UNIS" }, { id: "compare", label: "📊 MATRIX" },
    { id: "pomodoro", label: "🍅 FOCUS" }, { id: "notes", label: "📝 NOTES" },
    { id: "news", label: "📢 NEWS" }, { id: "tips", label: "💡 TIPS" },
    { id: "tricks", label: "⚡ TRICKS" }, { id: "viva", label: "🎤 VIVA" },
    { id: "sop", label: "✍️ SOP" }, { id: "profs", label: "📧 PROFS" },
    { id: "docs", label: "📂 DOCS" }, { id: "research", label: "🔬 RES" },
    { id: "scholarship", label: "🎓 FUNDS" }, { id: "tracker", label: "📋 TRACK" },
    { id: "strategy", label: "🎯 PLAN" },
  ];

  const getCountdown = (dateStr) => {
    const diff = Math.ceil((new Date(dateStr) - now) / 86400000);
    if (diff < 0) return { text: "PASSED", urgent: false, color: T.muted };
    if (diff === 0) return { text: "TODAY", urgent: true, color: T.red };
    if (diff < 7) return { text: `${diff}d`, urgent: true, color: T.red };
    if (diff < 30) return { text: `${diff}d`, urgent: true, color: T.orange };
    return { text: `${diff}d`, urgent: false, color: T.gold };
  };

  const xpToNext = lvl.nextXp - xp;
  const xpProgress = Math.round(((xp - lvl.prevXp) / (lvl.nextXp - lvl.prevXp)) * 100);

  return (
    <div className="relative bg-transparent p-3">
      <Confetti active={confettiActive} />

      {/* Achievement Popup */}
      {showAchievement && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 10000,
          background: "rgba(0,0,0,0.9)", backdropFilter: "blur(20px)", border: `2px solid ${T.gold}66`,
          borderRadius: 16, padding: "16px 24px", textAlign: "center",
          boxShadow: `0 0 60px ${T.gold}44`, animation: "slideDown .5s ease-out",
          maxWidth: 320,
        }}>
          <div style={{ fontSize: 32, marginBottom: 6, animation: "heartbeat 1s ease-in-out" }}>{showAchievement.icon}</div>
          <div style={{ fontSize: 9, color: T.gold, letterSpacing: 3, ...mono, marginBottom: 4 }}>ACHIEVEMENT UNLOCKED</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.bright, ...raj }}>{showAchievement.name}</div>
          <div style={{ fontSize: 10, color: T.text, ...raj, marginTop: 4 }}>{showAchievement.desc}</div>
          {showAchievement.xp > 0 && <div style={{ fontSize: 9, color: T.cyan, ...mono, marginTop: 4 }}>+{showAchievement.xp} XP</div>}
        </div>
      )}

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 9998,
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => setShowShortcuts(false)}>
          <div style={{
            background: "rgba(10,20,30,0.95)", backdropFilter: "blur(20px)", border: `1px solid ${T.cyan}44`,
            borderRadius: 16, padding: 20, maxWidth: 400, width: "90%", animation: "scaleIn .3s ease-out",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 12, color: T.cyan, letterSpacing: 2, ...mono, marginBottom: 12 }}>⌨️ KEYBOARD SHORTCUTS</div>
            {[["/", "Focus search"], ["Ctrl+K", "Focus search"], ["?", "Toggle shortcuts"], ["Esc", "Close modals"]].map(([key, desc]) => (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${T.border}` }}>
                <kbd style={{ ...mono, fontSize: 10, color: T.gold, background: T.gold + "22", padding: "2px 8px", borderRadius: 4 }}>{key}</kbd>
                <span style={{ fontSize: 10, color: T.text, ...raj }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TOP BAR: XP, Streak, Search, Quote ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: "8px 10px", marginBottom: 10,
        }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: T.green + "22", border: `2px solid ${T.green}`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
              boxShadow: GLOW(T.green), animation: "glowPulse 2s ease-in-out infinite",
            }}>{lvl.icon}</div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.bright, ...raj }}>
                {lvl.name} <span style={{ color: T.muted, fontSize: 9 }}>Lv.{lvl.level}</span>
              </div>
              <div style={{ width: 120, marginTop: 3 }}>
                <ProgressBar pct={xpProgress} color={T.green} height={4} />
              </div>
              <div style={{ fontSize: 7, color: T.muted, ...mono }}>{xp} XP · {xpToNext} to next</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              fontSize: 9, color: T.orange, ...mono, fontWeight: 700,
              background: T.orange + "15", border: `1px solid ${T.orange}33`, borderRadius: 6, padding: "3px 8px",
            }}>🔥 {streak}d streak</div>
            <button onClick={shuffleQuote} style={{
              background: "transparent", border: "none", color: T.muted, cursor: "pointer", fontSize: 14, padding: 2,
            }} title="New quote">✨</button>
          </div>
        </div>
        {quote && (
          <div style={{
            fontSize: 9, color: T.text, ...raj, fontStyle: "italic", lineHeight: 1.5,
            borderLeft: `2px solid ${T.gold}44`, paddingLeft: 8, padding: "4px 0",
          }}>
            "{quote.q}" <span style={{ color: T.gold, fontSize: 8 }}>— {quote.a}</span>
          </div>
        )}
        <div style={{ marginTop: 6, position: "relative" }}>
          <input ref={searchInputRef} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search unis, professors, docs...  (press /)"
            style={{
              width: "100%", background: "rgba(0,0,0,0.3)", border: `1px solid ${searchQuery ? T.cyan + "55" : T.border}`,
              borderRadius: 8, padding: "5px 10px", color: T.text, fontSize: 9, ...mono,
              outline: "none", transition: "border-color .2s",
            }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} style={{
              position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
              background: "transparent", border: "none", color: T.muted, cursor: "pointer", fontSize: 12,
            }}>✕</button>
          )}
        </div>
      </motion.div>

      {/* ── TAB NAVIGATION ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        ref={searchRef}
        style={{
          display: "flex", gap: 3, marginBottom: 12, overflowX: "auto", paddingBottom: 6,
          borderBottom: `1px solid rgba(255,255,255,0.1)`, scrollbarWidth: "thin",
        }}
      >
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => handleTab(tab.id)} style={{
            padding: "5px 10px", borderRadius: 6, border: "none",
            background: activeTab === tab.id ? T.cyan + "25" : "transparent",
            color: activeTab === tab.id ? T.cyan : T.muted,
            fontSize: 9, cursor: "pointer", fontFamily: mono.fontFamily,
            fontWeight: activeTab === tab.id ? 700 : 400,
            boxShadow: activeTab === tab.id ? `0 0 8px ${T.cyan}33` : "none",
            whiteSpace: "nowrap", flexShrink: 0, transition: "all .2s",
            position: "relative", overflow: "hidden",
          }}>{tab.label}</button>
        ))}
      </motion.div>

      {/* ── CONTENT WITH TRANSITIONS ── */}
      <div style={{ animation: tabTransition ? "fadeIn .3s ease-out" : "none" }}>

        {/* ═══════════════════ DAILY PULSE ═══════════════════ */}
        {activeTab === "pulse" && (
          <div>
            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 10 }}>
              ⚡ TODAY'S ADMISSION FOCUS · {["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"][todayIdx]}
            </div>
            <GlassCard borderColor={T.green + "44"} bg={T.green} glow={STRONG_GLOW(T.green)} padding={16} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14, background: T.green + "22",
                  border: `2px solid ${T.green}`, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, flexShrink: 0, boxShadow: GLOW(T.green),
                  animation: "heartbeat 2s ease-in-out infinite",
                }}>{pulse.focus.split(" ")[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, color: T.green, letterSpacing: 2, ...mono, marginBottom: 4 }}>TODAY'S FOCUS</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: T.bright, ...raj, marginBottom: 6 }}>{pulse.focus}</div>
                  <div style={{ fontSize: 11, color: T.text, lineHeight: 1.7, ...raj, marginBottom: 10 }}>{pulse.task}</div>
                  <div style={{
                    background: T.gold + "11", border: `1px solid ${T.gold}33`, borderRadius: 8, padding: 10,
                    fontSize: 10, color: T.gold, lineHeight: 1.6, ...raj,
                  }}>💡 {pulse.motivation}</div>
                  <div style={{ fontSize: 9, color: T.cyan, ...mono, marginTop: 8 }}>+{pulse.xp} XP · Complete today's focus</div>
                </div>
              </div>
            </GlassCard>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 12 }}>
              {QUICK_STATS.atAGlance.slice(0, 6).map((s, i) => (
                <StatCard key={i} label={s.label} value={s.value} icon={s.icon} color={[T.green, T.cyan, T.gold, T.blue, T.pink, T.orange][i]} delay={i * 80} />
              ))}
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 9, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 8 }}>📊 YOUR READINESS</div>
              {[
                { label: "Documents", pct: docPct, color: T.green },
                { label: "Research", pct: researchPct, color: T.blue },
                { label: "Checklist", pct: checklistPct, color: T.cyan },
                { label: "Professor Outreach", pct: profLog.length > 0 ? Math.min(100, Math.round((profLog.filter(p => p.response === "positive").length / 3) * 100)) : 0, color: T.gold },
                { label: "Viva Practice", pct: Math.min(100, vivaScore * 10), color: T.pink },
              ].map((b, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 9, color: T.text, ...raj }}>{b.label}</span>
                    <span style={{ fontSize: 9, color: b.color, ...mono, fontWeight: 700 }}>{b.pct}%</span>
                  </div>
                  <ProgressBar pct={b.pct} color={b.color} height={6} />
                </div>
              ))}
            </div>

            <div style={{ fontSize: 9, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 8 }}>📅 THIS WEEK</div>
            {DAILY_PULSE.map((d, i) => (
              <div key={i} style={{
                ...C({ padding: "8px 10px", marginBottom: 4, border: `1px solid ${i === todayIdx ? T.green + "55" : T.border}`, background: i === todayIdx ? T.green + "11" : "transparent", transition: "all .2s" }),
                animation: `slideInLeft .3s ease-out ${i * 50}ms both`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 9, color: i === todayIdx ? T.green : T.muted, ...mono, fontWeight: i === todayIdx ? 700 : 400 }}>{d.day}</span>
                  <span style={{ fontSize: 10, color: i === todayIdx ? T.bright : T.text, ...raj }}>{d.focus}</span>
                  <span style={{ fontSize: 8, color: T.cyan, ...mono }}>+{d.xp}XP</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══════════════════ POMODORO FOCUS TIMER ═══════════════════ */}
        {activeTab === "pomodoro" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 10 }}>🍅 DEEP FOCUS TIMER</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
              {["work", "break"].map(m => (
                <button key={m} onClick={() => { setPomodoroMode(m); setPomodoroTime(m === "work" ? 25 * 60 : 5 * 60); setPomodoroRunning(false); }} style={{
                  padding: "6px 16px", borderRadius: 8, border: `1px solid ${pomodoroMode === m ? (m === "work" ? T.green : T.cyan) : T.border}`,
                  background: pomodoroMode === m ? (m === "work" ? T.green + "22" : T.cyan + "22") : "transparent",
                  color: pomodoroMode === m ? (m === "work" ? T.green : T.cyan) : T.muted,
                  fontSize: 10, cursor: "pointer", ...mono, fontWeight: 700, transition: "all .2s",
                }}>{m === "work" ? "🎯 Work (25m)" : "☕ Break (5m)"}</button>
              ))}
            </div>
            <div style={{
              ...orb, fontSize: 56, fontWeight: 900, marginBottom: 8,
              color: pomodoroMode === "work" ? (pomodoroTime <= 60 ? T.red : T.green) : T.cyan,
              textShadow: `0 0 30px ${(pomodoroMode === "work" ? T.green : T.cyan)}44`,
              animation: pomodoroRunning ? "glowPulse 2s ease-in-out infinite" : "none",
            }}>{Math.floor(pomodoroTime / 60)}:{String(pomodoroTime % 60).padStart(2, "0")}</div>
            <div style={{ fontSize: 9, color: T.muted, ...mono, marginBottom: 16 }}>{pomodoroRunning ? "🔴 FOCUSING" : pomodoroTime === 0 ? "✅ DONE" : "⏸️ PAUSED"}</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
              <button onClick={() => setPomodoroRunning(!pomodoroRunning)} style={{
                padding: "10px 24px", borderRadius: 10,
                background: pomodoroRunning ? T.orange + "22" : T.green + "22",
                border: `2px solid ${pomodoroRunning ? T.orange : T.green}`,
                color: pomodoroRunning ? T.orange : T.green, fontSize: 12, cursor: "pointer", ...mono, fontWeight: 700,
                boxShadow: GLOW(pomodoroRunning ? T.orange : T.green),
              }}>{pomodoroRunning ? "⏸ PAUSE" : "▶ START"}</button>
              <button onClick={() => { setPomodoroRunning(false); setPomodoroTime(pomodoroMode === "work" ? 25 * 60 : 5 * 60); }} style={{
                padding: "10px 24px", borderRadius: 10, background: T.bg2, border: `1px solid ${T.border}`,
                color: T.muted, fontSize: 12, cursor: "pointer", ...mono,
              }}>↺ RESET</button>
            </div>
            <GlassCard borderColor={T.gold + "33"} bg={T.gold} padding={14} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 9, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 8 }}>📊 SESSION STATS</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                <div><AnimatedCounter value={pomodoroSessions} color={T.gold} fontSize={20} /><div style={{ fontSize: 7, color: T.muted, ...mono }}>Sessions</div></div>
                <div><AnimatedCounter value={pomodoroSessions * 25} color={T.green} fontSize={20} /><div style={{ fontSize: 7, color: T.muted, ...mono }}>Minutes</div></div>
                <div><AnimatedCounter value={Math.round(pomodoroSessions * 25 / 60)} color={T.cyan} fontSize={20} suffix="h" /><div style={{ fontSize: 7, color: T.muted, ...mono }}>Hours</div></div>
              </div>
            </GlassCard>
            <div style={{ fontSize: 9, color: T.muted, ...mono, lineHeight: 1.8 }}>
              <div>💡 <strong style={{ color: T.text }}>Tip:</strong> Each Pomodoro = 25 min focus + 5 min break</div>
              <div>🎯 Complete 4 sessions → take a longer 15-min break</div>
              <div>📝 Use notes tab to track what you studied</div>
            </div>
          </div>
        )}

        {/* ═══════════════════ PERSONAL NOTES ═══════════════════ */}
        {activeTab === "notes" && (
          <div>
            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 10 }}>📝 PERSONAL NOTES · Auto-saved</div>
            <GlassCard borderColor={T.cyan + "33"} bg={T.cyan} padding={14}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 9, color: T.cyan, ...mono }}>Quick thoughts, ideas, reminders</span>
                <span style={{ fontSize: 8, color: T.muted, ...mono }}>{notes.length} chars</span>
              </div>
              <textarea value={notes} onChange={e => saveNotes(e.target.value)}
                placeholder="What's on your mind? Study plans, ideas, reminders..."
                style={{
                  width: "100%", minHeight: 200, background: "rgba(0,0,0,0.3)", border: `1px solid ${T.border}`,
                  borderRadius: 8, padding: 10, color: T.text, fontSize: 10, ...raj, lineHeight: 1.7,
                  outline: "none", resize: "vertical", fontFamily: "inherit",
                }}
              />
            </GlassCard>
          </div>
        )}

        {/* ═══════════════════ QUICK DASHBOARD ═══════════════════ */}
        {activeTab === "dashboard" && (
          <div>
            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 10 }}>🚀 ADMISSIONS COMMAND CENTER</div>
            <GlassCard borderColor={T.green + "55"} glow={STRONG_GLOW(T.green)} padding={16} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 9, color: T.green, letterSpacing: 3, ...mono, marginBottom: 4 }}>🎯 YOUR PROFILE</div>
                  <div style={{ ...orb, fontSize: 20, fontWeight: 900, color: T.bright }}>PEASH RUDRA</div>
                  <div style={{ fontSize: 10, color: T.muted, ...mono, marginTop: 2 }}>NUBTK · CSE · 3.95/4.00 · Khulna</div>
                </div>
                <div style={{
                  width: 56, height: 56, borderRadius: 12, background: T.green + "22",
                  border: `2px solid ${T.green}`, display: "flex", alignItems: "center", justifyContent: "center",
                  flexDirection: "column", boxShadow: GLOW(T.green), animation: "glowPulse 2s ease-in-out infinite",
                }}>
                  <div style={{ ...orb, fontSize: 20, fontWeight: 900, color: T.green }}>A+</div>
                  <div style={{ fontSize: 7, color: T.green, ...mono }}>ELITE</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
                {[
                  { l: "GPA vs Min", v: "+43%", c: T.green }, { l: "Home Unis", v: "2", c: T.green },
                  { l: "Research", v: "Novel", c: T.blue }, { l: "Debate", v: "National", c: T.gold },
                  { l: "Leadership", v: "Gen Sec", c: T.orange }, { l: "Comeback", v: "32→3.95", c: T.pink },
                ].map((s, i) => (
                  <div key={i} style={{ background: s.c + "11", border: `1px solid ${s.c}22`, borderRadius: 8, padding: "8px 6px", textAlign: "center", transition: "transform .2s" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: s.c, ...raj }}>{s.v}</div>
                    <div style={{ fontSize: 7, color: T.muted, ...mono, marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <div style={{ fontSize: 9, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 8 }}>🏛️ YOUR UNIVERSITY PIPELINE</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
              {[...ALL_UNIVERSITIES].sort((a, b) => b.yourChance - a.yourChance).map((u, i) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  whileHover={{ scale: 1.01, y: -2 }}
                  onClick={() => { setSelectedUni(u.id); handleTab("unis"); }}
                  className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl p-5 mb-4 cursor-pointer relative overflow-hidden"
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 22 }}>{u.icon}</span>
                      <div>
                        <div style={{ ...orb, fontSize: 14, fontWeight: 900, color: T.bright }}>{u.name}</div>
                        <div style={{ fontSize: 8, color: u.color, ...mono, opacity: 0.8 }}>{u.tier} Tier · {u.location}</div>
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      style={{
                        padding: "6px 14px", borderRadius: 10,
                        background: `rgba(255,255,255,0.06)`,
                        backdropFilter: "blur(8px)",
                        border: `1.5px solid ${u.yourChance >= 80 ? T.green : u.yourChance >= 60 ? T.orange : T.red}`,
                        boxShadow: `0 0 16px ${(c => c)(u.yourChance >= 80 ? T.green : u.yourChance >= 60 ? T.orange : T.red)}33`,
                      }}
                    >
                      <AnimatedCounter value={u.yourChance} color={u.yourChance >= 80 ? T.green : u.yourChance >= 60 ? T.orange : T.red} fontSize={18} suffix="%" />
                    </motion.div>
                  </div>
                  <div className="h-1 bg-white/5 rounded overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${u.yourChance}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded"
                      style={{
                        background: u.yourChance >= 80 ? T.green : u.yourChance >= 60 ? T.orange : T.red,
                        boxShadow: `0 0 10px ${u.yourChance >= 80 ? T.green : u.yourChance >= 60 ? T.orange : T.red}`,
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div style={{ fontSize: 9, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 8 }}>⏰ KEY DEADLINES</div>
            {ADMISSIONS_TRACKER_TEMPLATE.scholarshipTimeline.slice(0, 6).map((item, i) => {
              const cd = getCountdown(item.date);
              return (
                <div key={i} style={{
                  ...C({ padding: "8px 10px", marginBottom: 4, border: `1px solid ${cd.urgent ? T.red + "44" : T.border}`, background: cd.urgent ? T.red + "08" : "transparent", transition: "all .2s" }),
                  animation: `slideInLeft .3s ease-out ${i * 50}ms both`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 10, color: T.bright, ...raj, fontWeight: 600 }}>{item.program}</div>
                      <div style={{ fontSize: 8, color: T.muted, ...mono }}>{item.stage} · {item.notes}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <AnimatedCounter value={cd.text} color={cd.color} fontSize={10} />
                      <div style={{ fontSize: 7, color: T.muted, ...mono }}>{item.date}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══════════════════ ALL UNIVERSITIES ═══════════════════ */}
        {activeTab === "unis" && (
          <div>
            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 10 }}>
              🏛️ {searchQuery ? `SEARCH RESULTS (${filteredUnis.length})` : "ALL 9 PUBLIC UNIVERSITIES · RANKED BY YOUR FIT"}
            </div>
            <div style={{ display: "flex", gap: 4, marginBottom: 10, overflowX: "auto" }}>
              {["ALL", "S+", "S", "A+", "A", "B+"].map(tier => (
                <button key={tier} onClick={() => setSelectedUni(tier === "ALL" ? null : tier)} style={{
                  padding: "4px 10px", borderRadius: 5, border: `1px solid ${selectedUni === tier || (tier === "ALL" && !selectedUni) ? T.cyan + "55" : "transparent"}`,
                  background: selectedUni === tier || (tier === "ALL" && !selectedUni) ? T.cyan + "15" : "transparent",
                  color: selectedUni === tier || (tier === "ALL" && !selectedUni) ? T.cyan : T.muted,
                  fontSize: 8, cursor: "pointer", fontFamily: mono.fontFamily, fontWeight: 700, whiteSpace: "nowrap", transition: "all .2s",
                }}>{tier}</button>
              ))}
              {bookmarks.length > 0 && (
                <button onClick={() => setSelectedUni("__bookmarked__")} style={{
                  padding: "4px 10px", borderRadius: 5, border: `1px solid ${selectedUni === "__bookmarked__" ? T.gold + "55" : T.gold + "33"}`,
                  background: selectedUni === "__bookmarked__" ? T.gold + "15" : "transparent",
                  color: T.gold, fontSize: 8, cursor: "pointer", fontFamily: mono.fontFamily, fontWeight: 700, whiteSpace: "nowrap", transition: "all .2s",
                }}>🔖 Saved</button>
              )}
            </div>
            {filteredUnis.filter(u => !selectedUni || (selectedUni === "__bookmarked__" ? bookmarks.includes(u.id) : u.tier === selectedUni)).map((u, i) => {
              const sec = expandedUniSections[u.id] || {};
              const toggleSec = (s) => setExpandedUniSections(prev => ({ ...prev, [u.id]: { ...(prev[u.id] || {}), [s]: !prev[u.id]?.[s] } }));
              return (
              <GlassCard key={u.id} borderColor={u.color + "33"} bg={u.color} glow={GLOW(u.color)} padding={0} style={{ marginBottom: 12, animation: `fadeInUp .4s ease-out ${i * 60}ms both`, overflow: "hidden" }}>
                {/* Header - always visible */}
                <div style={{ padding: "14px 14px 10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontSize: 24, animation: "float 3s ease-in-out infinite" }}>{u.icon}</span>
                        <div>
                          <div style={{ ...orb, fontSize: 15, fontWeight: 900, color: T.bright }}>{u.name}</div>
                          <div style={{ fontSize: 8, color: u.color, ...mono, opacity: 0.8 }}>{u.fullName}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 8, background: u.color + "22", color: u.color, padding: "2px 6px", borderRadius: 4, ...mono }}>{u.tier} Tier</span>
                        <span style={{ fontSize: 8, background: "rgba(255,255,255,0.08)", color: T.muted, padding: "2px 6px", borderRadius: 4, ...mono }}>📍 {u.location}</span>
                        {bookmarks.includes(u.id) && <span style={{ fontSize: 8, background: T.gold + "22", color: T.gold, padding: "2px 6px", borderRadius: 4 }}>🔖 Saved</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: "center", flexShrink: 0, display: "flex", gap: 8, alignItems: "center" }}>
                      <button onClick={() => toggleBookmark(u.id)} style={{
                        background: "transparent", border: "none", cursor: "pointer", fontSize: 16, padding: 4,
                        filter: bookmarks.includes(u.id) ? "none" : "grayscale(1)", transition: "all .2s",
                      }}>{bookmarks.includes(u.id) ? "🔖" : "📑"}</button>
                      <motion.div
                        whileHover={{ scale: 1.08 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        style={{
                          width: 52, height: 52, borderRadius: 14, background: `rgba(255,255,255,0.05)`,
                          backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                          border: `2px solid ${(c => c)(u.yourChance >= 80 ? T.green : u.yourChance >= 60 ? T.orange : T.red)}`,
                          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                          boxShadow: `0 0 12px ${(c => c)(u.yourChance >= 80 ? T.green : u.yourChance >= 60 ? T.orange : T.red)}44, 0 0 30px ${(c => c)(u.yourChance >= 80 ? T.green : u.yourChance >= 60 ? T.orange : T.red)}22`,
                        }}
                      >
                        <AnimatedCounter value={u.yourChance} color={u.yourChance >= 80 ? T.green : u.yourChance >= 60 ? T.orange : T.red} fontSize={16} suffix="%" />
                        <div style={{ fontSize: 6, color: T.muted, ...mono }}>{u.label}</div>
                      </motion.div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 4, marginBottom: 10 }}>
                    {[{ l: "Prestige", v: u.prestige }, { l: "Research", v: u.research }, { l: "Career", v: u.career }, { l: "Campus", v: u.campus }, { l: "Difficulty", v: u.difficulty }].map((s, si) => (
                      <div key={si} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: s.v >= 8 ? T.green : s.v >= 6 ? T.orange : T.red, ...mono }}>{s.v}/10</div>
                        <div style={{ fontSize: 6, color: T.muted, ...mono }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: T.green + "08", border: `1px solid ${T.green}22`, borderRadius: 8, padding: 10, marginBottom: 10 }}>
                    <div style={{ fontSize: 8, color: T.green, letterSpacing: 2, ...mono, marginBottom: 4 }}>✅ WHY APPLY</div>
                    <div style={{ fontSize: 10, color: T.text, lineHeight: 1.6, ...raj }}>{u.whyApply}</div>
                  </div>
                  <div style={{ height: 3, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden", marginBottom: 10 }}>
                    <div style={{
                      width: `${u.yourChance}%`, height: "100%",
                      background: u.yourChance >= 80 ? T.green : u.yourChance >= 60 ? T.orange : T.red,
                      borderRadius: 4,
                      boxShadow: `0 0 10px ${u.yourChance >= 80 ? T.green : u.yourChance >= 60 ? T.orange : T.red}, 0 0 20px ${u.yourChance >= 80 ? T.green : u.yourChance >= 60 ? T.orange : T.red}33`,
                      transition: "width .8s ease",
                    }} />
                  </div>
                </div>
                {/* Collapsible sections */}
                <div style={{ borderTop: `1px solid ${u.color}22` }}>
                  {/* Quick Info toggle */}
                  <button onClick={() => toggleSec("info")} style={{
                    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 14px", background: "transparent", border: "none", cursor: "pointer",
                    borderBottom: sec.info ? `1px solid ${u.color}22` : "none",
                  }}>
                    <span style={{ fontSize: 8, color: u.color, letterSpacing: 2, ...mono, fontWeight: 700 }}>📋 QUICK INFO</span>
                    <span style={{ fontSize: 10, color: T.muted, transition: "transform .2s", transform: sec.info ? "rotate(180deg)" : "none" }}>▼</span>
                  </button>
                  {sec.info && (
                    <div style={{ padding: "10px 14px", animation: "slideDown .3s ease-out" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 9, marginBottom: 8 }}>
                        <div><span style={{ color: T.muted, ...mono }}>Min CGPA:</span> <span style={{ color: T.green, ...mono, fontWeight: 700 }}>{u.minCGPA}</span></div>
                        <div><span style={{ color: T.muted, ...mono }}>Exam:</span> <span style={{ color: T.bright, ...mono }}>{u.examFormat}</span></div>
                        <div><span style={{ color: T.muted, ...mono }}>Fee:</span> <span style={{ color: T.gold, ...mono }}>{u.fee}</span></div>
                        <div><span style={{ color: T.muted, ...mono }}>Intake:</span> <span style={{ color: T.bright, ...mono }}>{u.intake}</span></div>
                      </div>
                      <a href={u.website} target="_blank" rel="noopener noreferrer" style={{
                        display: "inline-block", fontSize: 9, color: u.color, background: u.color + "22", border: `1px solid ${u.color}55`,
                        padding: "4px 10px", borderRadius: 5, textDecoration: "none", ...mono,
                      }}>VISIT WEBSITE →</a>
                    </div>
                  )}
                  {/* Professors toggle */}
                  <button onClick={() => toggleSec("profs")} style={{
                    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 14px", background: "transparent", border: "none", cursor: "pointer",
                    borderTop: `1px solid ${u.color}11`, borderBottom: sec.profs ? `1px solid ${u.color}22` : "none",
                  }}>
                    <span style={{ fontSize: 8, color: T.cyan, letterSpacing: 2, ...mono, fontWeight: 700 }}>👨‍🏫 PROFESSORS ({u.professors.length})</span>
                    <span style={{ fontSize: 10, color: T.muted, transition: "transform .2s", transform: sec.profs ? "rotate(180deg)" : "none" }}>▼</span>
                  </button>
                  {sec.profs && (
                    <div style={{ padding: "10px 14px", animation: "slideDown .3s ease-out" }}>
                      {u.professors.map((p, pi) => (
                        <div key={pi} style={{ marginBottom: pi < u.professors.length - 1 ? 6 : 0, padding: "8px 10px", background: "rgba(0,0,0,0.2)", borderRadius: 6 }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 10, color: T.bright, ...raj, fontWeight: 600 }}>{p.name}</span>
                            <span style={{ fontSize: 8, color: p.match >= 90 ? T.green : T.orange, ...mono }}>{p.match} match</span>
                          </div>
                          <div style={{ fontSize: 8, color: T.muted, ...mono }}>{p.area}</div>
                          <div style={{ fontSize: 8, color: T.cyan, ...raj, marginTop: 2 }}>{p.note}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Process toggle */}
                  <button onClick={() => toggleSec("process")} style={{
                    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 14px", background: "transparent", border: "none", cursor: "pointer",
                    borderTop: `1px solid ${u.color}11`,
                  }}>
                    <span style={{ fontSize: 8, color: T.gold, letterSpacing: 2, ...mono, fontWeight: 700 }}>📋 ADMISSION PROCESS ({u.process.length} steps)</span>
                    <span style={{ fontSize: 10, color: T.muted, transition: "transform .2s", transform: sec.process ? "rotate(180deg)" : "none" }}>▼</span>
                  </button>
                  {sec.process && (
                    <div style={{ padding: "10px 14px", animation: "slideDown .3s ease-out" }}>
                      {u.process.map((step, si) => (
                        <div key={si} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: si < u.process.length - 1 ? 6 : 0 }}>
                          <span style={{ width: 18, height: 18, borderRadius: "50%", background: u.color + "22", border: `1px solid ${u.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: u.color, flexShrink: 0 }}>{si + 1}</span>
                          <span style={{ fontSize: 9, color: T.text, ...raj, lineHeight: 1.4 }}>{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </GlassCard>
              );
            })}
          </div>
        )}

        {/* ═══════════════════ COMPARISON MATRIX ═══════════════════ */}
        {activeTab === "compare" && (
          <div>
            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 10 }}>📊 9-UNIVERSITY COMPARISON MATRIX</div>
            <GlassCard borderColor={T.border} padding={10} style={{ marginBottom: 12, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600, fontSize: 9 }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${T.border}` }}>
                    {["Uni", "Tier", "Chance", "Prestige", "Research", "Career", "Location", "CGPA", "Fee", "Intake"].map(h => (
                      <th key={h} style={{ padding: "6px 4px", color: T.muted, ...mono, fontSize: 7, textAlign: "center", letterSpacing: 1 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ALL_UNIVERSITIES.map((u, i) => (
                    <tr key={u.id} style={{ borderBottom: `1px solid ${T.border}`, animation: `fadeIn .3s ease-out ${i * 50}ms both` }}>
                      <td style={{ padding: "8px 4px" }}><span style={{ fontSize: 12 }}>{u.icon}</span><span style={{ ...mono, fontWeight: 700, color: u.color, marginLeft: 4 }}>{u.name}</span></td>
                      <td style={{ textAlign: "center", ...mono, color: u.color, fontWeight: 700 }}>{u.tier}</td>
                      <td style={{ textAlign: "center", ...mono, fontWeight: 900, color: u.yourChance >= 80 ? T.green : u.yourChance >= 60 ? T.orange : T.red }}>{u.yourChance}%</td>
                      <td style={{ textAlign: "center", color: u.prestige >= 8 ? T.green : T.text }}>{u.prestige}</td>
                      <td style={{ textAlign: "center", color: u.research >= 8 ? T.green : T.text }}>{u.research}</td>
                      <td style={{ textAlign: "center", color: u.career >= 8 ? T.green : T.text }}>{u.career}</td>
                      <td style={{ ...mono, fontSize: 8 }}>{u.location}</td>
                      <td style={{ ...mono, fontSize: 8, textAlign: "center" }}>{u.minCGPA.split("/")[0]}</td>
                      <td style={{ ...mono, fontSize: 8, textAlign: "center" }}>{u.fee}</td>
                      <td style={{ ...mono, fontSize: 7 }}>{u.intake.split(" ")[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlassCard>
            <div>
              <div style={{ fontSize: 9, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 8 }}>📈 YOUR FIT SCORE</div>
              {[...ALL_UNIVERSITIES].sort((a, b) => b.yourChance - a.yourChance).map((u, i) => (
                <div key={u.id} style={{ marginBottom: 8, animation: `slideInLeft .3s ease-out ${i * 60}ms both` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 10, color: T.bright, ...raj }}>{u.icon} {u.name} <span style={{ color: T.muted, fontSize: 8 }}>({u.location})</span></span>
                    <span style={{ fontSize: 10, color: u.yourChance >= 80 ? T.green : T.orange, ...mono, fontWeight: 700 }}>{u.yourChance}%</span>
                  </div>
                  <ProgressBar pct={u.yourChance} color={u.yourChance >= 80 ? T.green : u.yourChance >= 60 ? T.orange : T.red} height={8} />
                  <div style={{ fontSize: 8, color: T.muted, ...mono, marginTop: 2 }}>{u.status}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════ NEWS ═══════════════════ */}
        {activeTab === "news" && (
          <div>
            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 10 }}>📢 LIVE ADMISSIONS NEWS · Verified May 5, 2026</div>
            {ADMISSIONS_NEWS.map((news, i) => {
              const color = news.category === "kuet" ? T.green : news.category === "du" ? "#a855f7" : news.category === "buet" ? T.blue : news.category === "ku" ? T.orange : T.cyan;
              return (
                <GlassCard key={news.id} borderColor={color + "33"} padding={12} style={{ marginBottom: 6, cursor: "pointer", animation: `fadeInUp .3s ease-out ${i * 50}ms both` }}
                  onClick={() => setExpandedNews(expandedNews === news.id ? null : news.id)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                        <span>{news.icon}</span>
                        <span style={{ fontSize: 8, color: T.cyan, ...mono, fontWeight: 700 }}>{news.source}</span>
                        <PriorityBadge priority={news.priority} />
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: T.bright, ...raj }}>{news.title}</div>
                      {expandedNews === news.id && <div style={{ fontSize: 10, color: T.text, lineHeight: 1.6, ...raj, marginTop: 6 }}>{news.desc}</div>}
                    </div>
                    <span style={{ fontSize: 8, color: T.muted, ...mono, flexShrink: 0, marginLeft: 8 }}>{news.date}</span>
                  </div>
                  {expandedNews === news.id && news.actionUrl && (
                    <a href={news.actionUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 8, fontSize: 9, color: T.cyan, background: T.cyan + "22", border: `1px solid ${T.cyan}55`, padding: "4px 10px", borderRadius: 5, textDecoration: "none", ...mono }}>VISIT →</a>
                  )}
                </GlassCard>
              );
            })}
          </div>
        )}

        {/* ═══════════════════ TIPS ═══════════════════ */}
        {activeTab === "tips" && (
          <div>
            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 10 }}>💡 12 PROVEN STRATEGIES</div>
            {ADMISSIONS_TIPS.map((tip, i) => (
              <GlassCard key={tip.id} borderColor={T.cyan + "33"} padding={12} style={{ marginBottom: 6, cursor: "pointer", animation: `slideInLeft .3s ease-out ${i * 50}ms both` }}
                onClick={() => setExpandedTip(expandedTip === tip.id ? null : tip.id)}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{tip.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: T.cyan, ...raj }}>{tip.title}</span>
                      <PriorityBadge priority={tip.priority} />
                    </div>
                    <span style={{ fontSize: 7, color: T.muted, ...mono, letterSpacing: 1 }}>[{tip.category.toUpperCase()}]</span>
                    {expandedTip === tip.id && <div style={{ fontSize: 10, color: T.text, lineHeight: 1.6, ...raj, marginTop: 6 }}>{tip.content}</div>}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* ═══════════════════ TRICKS ═══════════════════ */}
        {activeTab === "tricks" && (
          <div>
            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 10 }}>⚡ 12 INSIDER TRICKS</div>
            {ADMISSIONS_TRICKS.map((trick, i) => (
              <GlassCard key={trick.id} borderColor={T.gold + "33"} bg={i % 2 === 0 ? T.gold : undefined} padding={12} style={{ marginBottom: 6, animation: `fadeInUp .3s ease-out ${i * 50}ms both` }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{trick.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: T.gold, ...raj, marginBottom: 4 }}>{trick.title}</div>
                    <span style={{ fontSize: 7, color: T.muted, ...mono, letterSpacing: 1 }}>[{trick.category.toUpperCase()}]</span>
                    <div style={{ fontSize: 10, color: T.text, lineHeight: 1.6, ...raj, marginTop: 4 }}>{trick.content}</div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* ═══════════════════ VIVA PRACTICE ═══════════════════ */}
        {activeTab === "viva" && (
          <div>
            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 10 }}>🎤 VIVA PRACTICE MODE</div>
            <GlassCard borderColor={T.pink + "33"} padding={14} style={{ marginBottom: 12, textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                <div><AnimatedCounter value={vivaScore} color={T.pink} fontSize={24} /><div style={{ fontSize: 7, color: T.muted, ...mono }}>Completed</div></div>
                <div><AnimatedCounter value={vivaScore * 20} color={T.gold} fontSize={24} /><div style={{ fontSize: 7, color: T.muted, ...mono }}>XP Earned</div></div>
              </div>
            </GlassCard>
            {!vivaQ ? (
              <div>
                <div style={{ fontSize: 12, color: T.bright, ...raj, marginBottom: 12, textAlign: "center" }}>
                  You are a National Debate Champion.<br />These questions are SOFTBALLS for you.
                </div>
                <button onClick={randomViva} style={{
                  display: "block", width: "100%", padding: 14, borderRadius: 12,
                  background: `linear-gradient(135deg, ${T.pink}33, ${T.cyan}22)`,
                  border: `2px solid ${T.pink}55`, color: T.pink, fontSize: 12,
                  cursor: "pointer", fontFamily: orb.fontFamily, fontWeight: 900,
                  boxShadow: GLOW(T.pink), marginBottom: 12, transition: "all .2s",
                }}>🎲 RANDOM VIVA QUESTION</button>
                <div style={{ fontSize: 9, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 8 }}>📋 ALL QUESTIONS</div>
                {VIVA_PRACTICE_QUESTIONS.map((q, i) => (
                  <GlassCard key={i} borderColor={q.difficulty === "Hard" ? T.red + "33" : q.difficulty === "Medium" ? T.orange + "33" : T.green + "33"}
                    padding={10} style={{ marginBottom: 4, cursor: "pointer", animation: `slideInLeft .3s ease-out ${i * 30}ms both` }}
                    onClick={() => startViva(q)}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 10, color: T.text, ...raj, fontWeight: 600 }}>{q.q}</span>
                      <span style={{ fontSize: 7, color: q.difficulty === "Hard" ? T.red : T.orange, ...mono }}>{q.difficulty}</span>
                    </div>
                    <span style={{ fontSize: 7, color: T.muted, ...mono }}>[{q.category}] · {q.timeLimit}s</span>
                  </GlassCard>
                ))}
              </div>
            ) : (
              <div>
                <div style={{ textAlign: "center", marginBottom: 12 }}>
                  <div style={{
                    ...orb, fontSize: 48, fontWeight: 900,
                    color: vivaTimer <= 10 ? T.red : vivaTimer <= 30 ? T.orange : T.green,
                    textShadow: `0 0 30px ${vivaTimer <= 10 ? T.red : T.green}44`,
                    animation: vivaRunning ? "textGlow 1.5s ease-in-out infinite" : "none",
                  }}>{Math.floor(vivaTimer / 60)}:{String(vivaTimer % 60).padStart(2, "0")}</div>
                  <div style={{ fontSize: 8, color: T.muted, ...mono, marginTop: 4 }}>{vivaRunning ? "🔴 SPEAKING..." : "⏸ PAUSED"}</div>
                </div>
                <GlassCard borderColor={T.pink + "33"} bg={T.pink} padding={14} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 8, color: T.pink, letterSpacing: 2, ...mono, marginBottom: 6 }}>QUESTION</div>
                  <div style={{ fontSize: 13, color: T.bright, ...raj, fontWeight: 600, lineHeight: 1.5 }}>{vivaQ.q}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    <PriorityBadge priority={vivaQ.difficulty === "Hard" ? "CRITICAL" : vivaQ.difficulty === "Medium" ? "HIGH" : "MEDIUM"} />
                    <span style={{ fontSize: 7, color: T.muted, ...mono }}>{vivaQ.category}</span>
                  </div>
                </GlassCard>
                <GlassCard borderColor={T.cyan + "22"} bg={T.cyan} padding={10} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 8, color: T.cyan, letterSpacing: 2, ...mono, marginBottom: 4 }}>💡 HINT</div>
                  <div style={{ fontSize: 10, color: T.text, lineHeight: 1.6, ...raj }}>{vivaQ.hint}</div>
                </GlassCard>
                <button onClick={() => setShowVivaAnswer(!showVivaAnswer)} style={{
                  width: "100%", padding: 10, borderRadius: 8, marginBottom: showVivaAnswer ? 8 : 12,
                  background: T.bg2, border: `1px solid ${T.border}`, color: T.cyan,
                  fontSize: 10, cursor: "pointer", ...mono, transition: "all .2s",
                }}>{showVivaAnswer ? "▲ HIDE IDEAL ANSWER" : "▼ SHOW IDEAL ANSWER"}</button>
                {showVivaAnswer && (
                  <GlassCard borderColor={T.green + "33"} padding={12} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 8, color: T.green, letterSpacing: 2, ...mono, marginBottom: 6 }}>✅ IDEAL ANSWER</div>
                    <div style={{ fontSize: 10, color: T.text, lineHeight: 1.7, ...raj }}>{vivaQ.idealAnswer}</div>
                  </GlassCard>
                )}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setVivaRunning(!vivaRunning)} style={{
                    flex: 1, padding: 10, borderRadius: 8,
                    background: vivaRunning ? T.orange + "22" : T.green + "22",
                    border: `1px solid ${vivaRunning ? T.orange : T.green}`,
                    color: vivaRunning ? T.orange : T.green, fontSize: 10, cursor: "pointer", ...mono, transition: "all .2s",
                  }}>{vivaRunning ? "⏸ PAUSE" : "▶ START TIMER"}</button>
                  <button onClick={doneViva} style={{
                    flex: 1, padding: 10, borderRadius: 8, background: T.green + "22", border: `1px solid ${T.green}`,
                    color: T.green, fontSize: 10, cursor: "pointer", ...mono, transition: "all .2s",
                  }}>✅ DONE</button>
                  <button onClick={randomViva} style={{
                    padding: 10, borderRadius: 8, background: T.pink + "22", border: `1px solid ${T.pink}`,
                    color: T.pink, fontSize: 10, cursor: "pointer", ...mono, transition: "all .2s",
                  }}>🎲</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════ SOP TEMPLATES ═══════════════════ */}
        {activeTab === "sop" && (
          <div>
            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 10 }}>✍️ SOP TEMPLATES — 1-PAGE STATEMENTS</div>
            <div style={{ display: "flex", gap: 4, marginBottom: 10, overflowX: "auto" }}>
              {Object.keys(SOP_TEMPLATES).map(key => (
                <button key={key} onClick={() => { setSelectedSOP(key); setCopiedSOP(false); }} style={{
                  padding: "4px 10px", borderRadius: 5, border: "none",
                  background: selectedSOP === key ? T.cyan + "25" : "transparent",
                  color: selectedSOP === key ? T.cyan : T.muted,
                  fontSize: 9, cursor: "pointer", fontFamily: mono.fontFamily, fontWeight: 700, transition: "all .2s",
                }}>{key.toUpperCase()}</button>
              ))}
            </div>
            <GlassCard borderColor={T.cyan + "33"} padding={14} style={{ marginBottom: 10 }}>
              <div style={{ whiteSpace: "pre-wrap", fontSize: 10, color: T.text, lineHeight: 1.8, ...raj }}>
                {SOP_TEMPLATES[selectedSOP]}
              </div>
            </GlassCard>
            <button onClick={() => copySOP(SOP_TEMPLATES[selectedSOP])} style={{
              padding: "8px 16px", borderRadius: 6, border: `1px solid ${copiedSOP ? T.green : T.cyan}`,
              background: copiedSOP ? T.green + "22" : T.cyan + "22",
              color: copiedSOP ? T.green : T.cyan, fontSize: 10, cursor: "pointer", ...mono, fontWeight: 600, transition: "all .2s",
            }}>{copiedSOP ? "✅ COPIED" : "📋 COPY"}</button>
          </div>
        )}

        {/* ═══════════════════ PROFESSOR TRACKER ═══════════════════ */}
        {activeTab === "profs" && (
          <div>
            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 10 }}>📧 PROFESSOR CONTACT TRACKER</div>
            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 4, marginBottom: 12 }}>
              {[
                { l: "Total", v: profLog.length, c: T.cyan },
                { l: "Sent", v: profLog.filter(p => p.response === "sent").length, c: T.blue },
                { l: "No Reply", v: profLog.filter(p => p.response === "no_reply").length, c: T.orange },
                { l: "Positive", v: profLog.filter(p => p.response === "positive").length, c: T.green },
                { l: "Negative", v: profLog.filter(p => p.response === "negative").length, c: T.red },
              ].map((s, i) => (
                <div key={i} style={{ background: s.c + "11", border: `1px solid ${s.c}22`, borderRadius: 8, padding: "8px 4px", textAlign: "center", animation: `scaleIn .3s ease-out ${i * 50}ms both` }}>
                  <AnimatedCounter value={s.v} color={s.c} fontSize={16} />
                  <div style={{ fontSize: 7, color: T.muted, ...mono }}>{s.l}</div>
                </div>
              ))}
            </div>
            {/* Add form */}
            <GlassCard borderColor={T.cyan + "33"} bg={T.cyan} padding={12} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 9, color: T.cyan, letterSpacing: 2, ...mono, marginBottom: 8 }}>+ ADD PROFESSOR</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                <input value={newProf.name} onChange={e => setNewProf(p => ({ ...p, name: e.target.value }))} placeholder="Professor name" style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${T.border}`, borderRadius: 6, padding: "6px 8px", color: T.text, fontSize: 9, ...mono, outline: "none" }} />
                <input value={newProf.uni} onChange={e => setNewProf(p => ({ ...p, uni: e.target.value }))} placeholder="University" style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${T.border}`, borderRadius: 6, padding: "6px 8px", color: T.text, fontSize: 9, ...mono, outline: "none" }} />
                <input value={newProf.email} onChange={e => setNewProf(p => ({ ...p, email: e.target.value }))} placeholder="Email" style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${T.border}`, borderRadius: 6, padding: "6px 8px", color: T.text, fontSize: 9, ...mono, outline: "none" }} />
                <input value={newProf.area} onChange={e => setNewProf(p => ({ ...p, area: e.target.value }))} placeholder="Research area" style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${T.border}`, borderRadius: 6, padding: "6px 8px", color: T.text, fontSize: 9, ...mono, outline: "none" }} />
                <input value={newProf.date} onChange={e => setNewProf(p => ({ ...p, date: e.target.value }))} placeholder="Date contacted" style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${T.border}`, borderRadius: 6, padding: "6px 8px", color: T.text, fontSize: 9, ...mono, outline: "none" }} />
                <select value={newProf.response} onChange={e => setNewProf(p => ({ ...p, response: e.target.value }))} style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${T.border}`, borderRadius: 6, padding: "6px 8px", color: T.text, fontSize: 9, ...mono, outline: "none" }}>
                  <option value="not_sent">Not Sent</option><option value="sent">Sent</option><option value="no_reply">No Reply</option><option value="positive">Positive</option><option value="negative">Negative</option>
                </select>
              </div>
              <input value={newProf.notes} onChange={e => setNewProf(p => ({ ...p, notes: e.target.value }))} placeholder="Notes" style={{ width: "100%", marginTop: 6, background: "rgba(0,0,0,0.3)", border: `1px solid ${T.border}`, borderRadius: 6, padding: "6px 8px", color: T.text, fontSize: 9, ...mono, outline: "none" }} />
              <button onClick={addProf} style={{ marginTop: 8, padding: "6px 14px", borderRadius: 6, background: T.cyan + "22", border: `1px solid ${T.cyan}`, color: T.cyan, fontSize: 9, cursor: "pointer", ...mono, fontWeight: 700, transition: "all .2s" }}>+ ADD TO LOG</button>
            </GlassCard>
            {/* Contact log */}
            <div style={{ fontSize: 9, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 8 }}>📋 CONTACT LOG ({profLog.length} entries)</div>
            {profLog.length === 0 && <div style={{ fontSize: 10, color: T.muted, ...mono, textAlign: "center", padding: 20, background: "rgba(0,0,0,0.2)", borderRadius: 10, border: `1px dashed ${T.border}` }}>No professors logged yet. Start reaching out!</div>}
            {profLog.map((p, i) => {
              const statusColor = p.response === "positive" ? T.green : p.response === "negative" ? T.red : p.response === "no_reply" ? T.orange : p.response === "sent" ? T.blue : T.muted;
              return (
              <GlassCard key={p.id} borderColor={statusColor + "33"} padding={10} style={{ marginBottom: 6, animation: `slideInLeft .3s ease-out ${i * 50}ms both` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: T.bright, ...raj, fontWeight: 600 }}>{p.name}</span>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontSize: 8, color: statusColor, ...mono, fontWeight: 700, background: statusColor + "15", padding: "2px 6px", borderRadius: 4 }}>{p.response.replace("_", " ")}</span>
                    <select value={p.response} onChange={e => updateProfResponse(p.id, e.target.value)} style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${T.border}`, borderRadius: 4, color: T.text, fontSize: 8, ...mono, outline: "none" }}>
                      <option value="not_sent">Not Sent</option>
                      <option value="sent">Sent</option>
                      <option value="no_reply">No Reply</option>
                      <option value="positive">Positive</option>
                      <option value="negative">Negative</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 8, marginBottom: 4 }}>
                  <div><span style={{ color: T.muted, ...mono }}>🏛️</span> {p.uni}</div>
                  <div><span style={{ color: T.muted, ...mono }}>🔬</span> {p.area}</div>
                  {p.email && <div><span style={{ color: T.muted, ...mono }}>📧</span> <span style={{ color: T.cyan }}>{p.email}</span></div>}
                  {p.date && <div><span style={{ color: T.muted, ...mono }}>📅</span> {p.date}</div>}
                </div>
                {p.notes && <div style={{ fontSize: 9, color: T.text, ...raj, marginTop: 4, padding: "4px 8px", background: "rgba(0,0,0,0.15)", borderRadius: 4 }}>{p.notes}</div>}
              </GlassCard>
              );
            })}
          </div>
        )}

        {/* ═══════════════════ DOCUMENT READINESS ═══════════════════ */}
        {activeTab === "docs" && (
          <div>
            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 10 }}>📂 DOCUMENT READINESS · {docPct}% Complete</div>
            <div style={{ marginBottom: 12 }}>
              <ProgressBar pct={docPct} color={docPct >= 80 ? T.green : docPct >= 50 ? T.orange : T.red} height={10} />
            </div>
            {DOCUMENT_READINESS.map((doc, i) => {
              const checked = !!docChecks[doc.id];
              return (
                <div key={doc.id} onClick={() => toggleDoc(doc.id)} style={{
                  ...C({ padding: 10, marginBottom: 4, border: `1px solid ${checked ? T.green + "44" : doc.priority === "CRITICAL" ? T.red + "33" : T.border}`, cursor: "pointer", background: checked ? T.green + "08" : "transparent", display: "flex", gap: 8, alignItems: "flex-start", transition: "all .2s" }),
                  animation: `slideInLeft .3s ease-out ${i * 30}ms both`,
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    border: `2px solid ${checked ? T.green : T.border}`,
                    background: checked ? T.green + "22" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: T.green, fontSize: 12, transition: "all .3s ease",
                  }}>{checked ? "✓" : ""}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                      <span style={{ fontSize: 10, color: checked ? T.green : T.bright, ...raj, fontWeight: checked ? 700 : 400 }}>{doc.item}</span>
                      <PriorityBadge priority={doc.priority} />
                    </div>
                    <span style={{ fontSize: 8, color: T.muted, ...mono }}>{doc.note}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══════════════════ RESEARCH TRACKER ═══════════════════ */}
        {activeTab === "research" && (
          <div>
            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 10 }}>🔬 CRO+SHAP RESEARCH TRACKER · {researchPct}%</div>
            <GlassCard borderColor={T.blue + "33"} bg={T.blue} padding={12} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 8, color: T.blue, letterSpacing: 2, ...mono, marginBottom: 6 }}>📄 THESIS TITLE</div>
              <div style={{ fontSize: 11, color: T.bright, ...raj, fontWeight: 600, lineHeight: 1.6 }}>{RESEARCH_PAPER_TRACKER.title}</div>
            </GlassCard>
            <div style={{ fontSize: 9, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 8 }}>📋 MILESTONES</div>
            {RESEARCH_PAPER_TRACKER.milestones.map((m, i) => (
              <GlassCard key={i} borderColor={m.status === "done" ? T.green + "33" : m.status === "in_progress" ? T.orange + "33" : T.border}
                padding={8} style={{ marginBottom: 4, display: "flex", gap: 8, alignItems: "center", animation: `slideInLeft .3s ease-out ${i * 40}ms both` }}>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                  background: m.status === "done" ? T.green + "33" : m.status === "in_progress" ? T.orange + "33" : "rgba(0,0,0,0.3)",
                  border: `2px solid ${m.status === "done" ? T.green : m.status === "in_progress" ? T.orange : T.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, color: m.status === "done" ? T.green : T.muted,
                  animation: m.status === "in_progress" ? "glowPulse 2s ease-in-out infinite" : "none",
                }}>{m.status === "done" ? "✓" : i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: m.status === "done" ? T.green : T.text, ...raj, fontWeight: m.status === "in_progress" ? 600 : 400 }}>{m.phase}</div>
                  <div style={{ fontSize: 8, color: T.muted, ...mono }}>{m.date} · {m.note}</div>
                </div>
                <span style={{ fontSize: 7, color: m.status === "done" ? T.green : m.status === "in_progress" ? T.orange : T.muted, ...mono, textTransform: "uppercase" }}>{m.status}</span>
              </GlassCard>
            ))}
            <div style={{ marginTop: 12, fontSize: 9, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 8 }}>🎯 TARGET JOURNALS</div>
            {RESEARCH_PAPER_TRACKER.targetJournals.map((j, i) => (
              <GlassCard key={i} borderColor={T.gold + "22"} padding={10} style={{ marginBottom: 6, animation: `fadeInUp .3s ease-out ${i * 50}ms both` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: T.bright, ...raj, fontWeight: 600 }}>{j.name}</span>
                  <span style={{ fontSize: 8, color: j.match >= 88 ? T.green : T.orange, ...mono }}>IF: {j.impactFactor}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, fontSize: 8 }}>
                  <span style={{ color: T.muted, ...mono }}>Review: {j.reviewTime}</span>
                  <span style={{ color: T.muted, ...mono }}>Fee: {j.fee}</span>
                  <span style={{ color: T.gold, ...mono, fontWeight: 700 }}>{j.match}% match</span>
                </div>
                <div style={{ fontSize: 8, color: T.cyan, ...raj, marginTop: 4 }}>{j.note}</div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* ═══════════════════ SCHOLARSHIP ═══════════════════ */}
        {activeTab === "scholarship" && (
          <div>
            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 10 }}>🎓 INTERNATIONAL SCHOLARSHIP GUIDE</div>
            <div style={{ display: "flex", gap: 4, marginBottom: 10, overflowX: "auto" }}>
              {Object.keys(SCHOLARSHIP_GUIDE).map(key => (
                <button key={key} onClick={() => setSelectedScholarship(key)} style={{
                  padding: "4px 10px", borderRadius: 5, border: "none",
                  background: selectedScholarship === key ? T.gold + "25" : "transparent",
                  color: selectedScholarship === key ? T.gold : T.muted,
                  fontSize: 9, cursor: "pointer", fontFamily: mono.fontFamily, fontWeight: 700, transition: "all .2s",
                }}>{key.toUpperCase()}</button>
              ))}
            </div>
            {SCHOLARSHIP_GUIDE[selectedScholarship] && (() => {
              const s = SCHOLARSHIP_GUIDE[selectedScholarship];
              return (
                <div>
                  <GlassCard borderColor={T.gold + "33"} bg={T.gold} padding={12} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.gold, ...raj, marginBottom: 8 }}>{s.name}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 9 }}>
                      <div><span style={{ color: T.muted, ...mono }}>Deadline:</span> <span style={{ color: T.gold, ...mono, fontWeight: 700 }}>{s.deadline}</span></div>
                      <div><span style={{ color: T.muted, ...mono }}>Duration:</span> <span style={{ color: T.gold, ...mono }}>{s.duration}</span></div>
                    </div>
                    <div style={{ fontSize: 10, color: T.text, lineHeight: 1.6, ...raj, marginTop: 8 }}><strong style={{ color: T.gold }}>Eligibility:</strong> {s.eligibility}</div>
                    <div style={{ fontSize: 10, color: T.text, lineHeight: 1.6, ...raj, marginTop: 6 }}><strong style={{ color: T.gold }}>Funding:</strong> {s.funding}</div>
                  </GlassCard>
                  <div style={{ fontSize: 9, color: T.cyan, letterSpacing: 2, ...mono, marginBottom: 6 }}>💡 TIPS</div>
                  {s.tips.map((tip, i) => (
                    <GlassCard key={i} borderColor={T.cyan + "22"} padding="6px 10px" style={{ marginBottom: 4, display: "flex", gap: 6, animation: `slideInLeft .3s ease-out ${i * 40}ms both` }}>
                      <span style={{ fontSize: 9, color: T.cyan, ...mono, flexShrink: 0 }}>{i + 1}.</span>
                      <span style={{ fontSize: 10, color: T.text, ...raj, lineHeight: 1.5 }}>{tip}</span>
                    </GlassCard>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* ═══════════════════ TRACKER ═══════════════════ */}
        {activeTab === "tracker" && (
          <div>
            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 10 }}>📋 APPLICATION TRACKER</div>
            {ADMISSIONS_TRACKER_TEMPLATE.applications.map((app, i) => (
              <GlassCard key={app.id} borderColor={(app.uni.toLowerCase().includes("du") ? "#a855f7" : app.uni.toLowerCase().includes("kuet") ? T.green : app.uni.toLowerCase().includes("buet") ? T.blue : T.orange) + "33"}
                padding={10} style={{ marginBottom: 6, animation: `fadeInUp .3s ease-out ${i * 60}ms both` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: app.uni.toLowerCase().includes("du") ? "#a855f7" : app.uni.toLowerCase().includes("kuet") ? T.green : app.uni.toLowerCase().includes("buet") ? T.blue : T.orange, ...raj }}>{app.uni}</span>
                  <PriorityBadge priority={app.priority} />
                </div>
                <span style={{ fontSize: 8, color: T.muted, ...mono }}>Deadline: {app.deadline}</span>
                <div style={{ fontSize: 9, color: T.text, ...raj, marginTop: 4 }}>{app.notes}</div>
              </GlassCard>
            ))}
            <div style={{ marginTop: 12, fontSize: 9, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 8 }}>✓ CHECKLIST ({checklistPct}%)</div>
            {ADMISSIONS_TRACKER_TEMPLATE.checklist.map((item, i) => (
              <div key={item.item} onClick={() => { toggleDoc(item.item); }} style={{
                display: "flex", gap: 8, padding: "8px 0", borderBottom: `1px solid ${T.border}`, cursor: "pointer", alignItems: "center",
                animation: `slideInLeft .2s ease-out ${i * 20}ms both`,
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 5, border: `2px solid ${docChecks[item.item] ? T.green : T.border}`,
                  background: docChecks[item.item] ? T.green + "22" : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, color: T.green, flexShrink: 0, transition: "all .3s ease",
                }}>{docChecks[item.item] ? "✓" : ""}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: docChecks[item.item] ? T.green : T.text, ...raj }}>{item.item}</div>
                  <div style={{ fontSize: 8, color: T.muted, ...mono }}>Deadline: {item.deadline}</div>
                </div>
                <PriorityBadge priority={item.priority} />
              </div>
            ))}
          </div>
        )}

        {/* ═══════════════════ STRATEGY ═══════════════════ */}
        {activeTab === "strategy" && (
          <div style={{ fontSize: 10, color: T.text, ...raj, lineHeight: 1.8 }}>
            <GlassCard borderColor={T.green + "33"} glow={STRONG_GLOW(T.green)} padding={14}>
              <div style={{ whiteSpace: "pre-wrap" }}>{FINAL_ADMISSION_STRATEGY}</div>
            </GlassCard>
            <div style={{ marginTop: 12, fontSize: 9, color: T.muted, ...mono, textAlign: "center", padding: 10 }}>
              Last Updated: May 5, 2026 · All links verified
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdmissionsDashboard;
