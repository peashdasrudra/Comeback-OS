import DashboardOverview from "./DashboardOverview";
import CinematicWelcomeHUD from "./CinematicWelcomeHUD";
import InteractiveQuickActionGrid from "./InteractiveQuickActionGrid";
import RealTimeStatusIndicator from "./RealTimeStatusIndicator";
import CinematicEnvironmentalWidget from "./CinematicEnvironmentalWidget";
import RevOpsCommandCenterSnippet from "./RevOpsCommandCenterSnippet";
import ResearchComputeNode from "./ResearchComputeNode";
import MultiOmicsDataExplorer from "./MultiOmicsDataExplorer";
import CitationNetworkVisualizer from "./CitationNetworkVisualizer";
import VivaPrepSimulator from "./VivaPrepSimulator";
import SOPVersionControl from "./SOPVersionControl";
import ResearchMilestoneTracker from "./ResearchMilestoneTracker";
import CSExamAlgorithmVisualizer from "./CSExamAlgorithmVisualizer";
import CodingProblemTracker from "./CodingProblemTracker";
import KhulnaWeather from "./KhulnaWeather";
import TacticalAnalytics from "./TacticalAnalytics";
import ComebackTimeline from "./ComebackTimeline";
import BodyTransformation from "./BodyTransformation";
import UniComparisonMatrix from "./UniComparisonMatrix";
import AcousticVisualizer from "./AcousticVisualizer";
import FreelanceTracker from "./FreelanceTracker";
import BattleModeToggle from "./BattleModeToggle";
import RevOpsCommand from "./RevOpsCommand";
import AppStatusPipeline from "./AppStatusPipeline";
import ScholarshipRadar from "./ScholarshipRadar";
import ThesisChapterProgress from "./ThesisChapterProgress";
import WorkoutPRTracker from "./WorkoutPRTracker";
import StreakFlameVisualizer from "./StreakFlameVisualizer";
import NutritionMacroSplit from "./NutritionMacroSplit";
import MoodAmbientLighting from "./MoodAmbientLighting";
import IELTSSpeakingRecorder from "./IELTSSpeakingRecorder";
import IELTSWritingEvaluator from "./IELTSWritingEvaluator";
import VocabularyBuilder from "./VocabularyBuilder";

const Home = (props) => {
  const { mood, setMood, moodLog, setMoodLog, sleepLog, setSleepLog, sleepHours, setSleepHours, sleepQuality, setSleepQuality, waterCount, setWaterCount, calorieLog, setCalorieLog, calInput, setCalInput, calLabel, setCalLabel, dailyLog, setDailyLog, dailyLogText, setDailyLogText, streak, isBurnout, setBurnoutDismissed, challengeDone, challengeKey, todayChallenge, todayIntention, setTodayIntention, intentionInput, setIntentionInput, xp, xpLevel, xpPct, dailyScore, scoreColor, scoreGrade, tp, wGained, workoutDay, DAYS, TODAY, WEEKS, weekPct, activeWeek, setActiveWeek, gainXP, takeXP, setShowQuoteModal, setShowMscDeadlines, setShowWeeklyReview, quoteIdx, setQuoteIdx, T, orb, mono, raj, gt, C, getRank, getDailyScore, totalPct, dayPct, LiveClock, Ring, setTab } = props;

  const todayMoods = [{ e: "😤", l: "GRINDING" }, { e: "💪", l: "STRONG" }, { e: "😐", l: "OKAY" }, { e: "😴", l: "TIRED" }, { e: "🔥", l: "ON FIRE" }];
  const totalCal = calorieLog.reduce((a, c) => a + c.cal, 0);
  const r = getRank(xp);
  const moodEmojis = { GRINDING: "😤", STRONG: "💪", OKAY: "😐", TIRED: "😴", "ON FIRE": "🔥" };
  const moodScores = { GRINDING: 80, STRONG: 90, "ON FIRE": 100, OKAY: 60, TIRED: 40 };
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000).toDateString();
    const entry = moodLog.filter(m => m.date === d).slice(-1)[0];
    return { d, mood: entry?.mood || null, score: entry ? moodScores[entry.mood] || 50 : 0 };
  });
  const todaySleep = sleepLog.find(s => s.date === TODAY);
  const isWeeklyReviewDay = new Date().getDay() === 0;

  const checklistItems = [
    moodLog.some(e => e.date === TODAY),
    !!sleepLog.find(x => x.date === TODAY),
    waterCount >= 8,
    dayPct(workoutDay) === 100,
    dailyLog.some(e => e.date === TODAY),
    calorieLog.reduce((a, c) => a + c.cal, 0) >= 2800,
    false,
    todayIntention.date === TODAY
  ];
  const completedCount = checklistItems.filter(Boolean).length;
  const checklistPct = Math.round((completedCount / 8) * 100);

   return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
       <DashboardOverview />
       <CinematicWelcomeHUD />
       <RealTimeStatusIndicator />
       <InteractiveQuickActionGrid />
 
       <KhulnaWeather />
       <TacticalAnalytics />
       <CinematicEnvironmentalWidget />
       <RevOpsCommandCenterSnippet />
       <RevOpsCommand />
       <ResearchComputeNode />
        <MultiOmicsDataExplorer />
        <CitationNetworkVisualizer />
        <VivaPrepSimulator />
        <SOPVersionControl />
        <ResearchMilestoneTracker />
        <CSExamAlgorithmVisualizer />
        <CodingProblemTracker />
        <ComebackTimeline />
        <BodyTransformation />
        <UniComparisonMatrix />
        <AcousticVisualizer />
        <FreelanceTracker />
        <BattleModeToggle />
        <AppStatusPipeline T={T} C={C} mono={mono} orb={orb} raj={raj} />
        <ScholarshipRadar T={T} C={C} mono={mono} orb={orb} raj={raj} />
        <ThesisChapterProgress T={T} C={C} mono={mono} orb={orb} raj={raj} />
        <WorkoutPRTracker T={T} C={C} mono={mono} orb={orb} raj={raj} />
        <StreakFlameVisualizer T={T} C={C} mono={mono} orb={orb} raj={raj} streak={streak} />
        <NutritionMacroSplit T={T} C={C} mono={mono} orb={orb} raj={raj} totalCalories={totalCal} />
        <MoodAmbientLighting T={T} C={C} mono={mono} orb={orb} raj={raj} currentMood={mood} onMoodChange={setMood} />
        <IELTSSpeakingRecorder T={T} C={C} mono={mono} orb={orb} raj={raj} />
        <IELTSWritingEvaluator T={T} C={C} mono={mono} orb={orb} raj={raj} />
        <VocabularyBuilder T={T} C={C} mono={mono} orb={orb} raj={raj} />

      {/* ── BURNOUT ALERT ── */}
      {isBurnout && (
        <div style={{ ...C({ padding: "12px 14px", marginBottom: 12, border: `1px solid ${T.red}`, animation: "burnout 2s infinite" }) }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, color: T.red, fontWeight: 700, ...orb }}>⚠️ BURNOUT RISK DETECTED</div>
              <div style={{ fontSize: 11, color: T.muted, ...raj, marginTop: 3 }}>{streak} days straight. Take a mindful rest — it's not weakness, it's maintenance.</div>
            </div>
            <button onClick={() => setBurnoutDismissed(TODAY)} style={{ fontSize: 10, color: T.muted, background: "transparent", border: `1px solid ${T.border}`, borderRadius: 6, padding: "4px 10px", cursor: "pointer", ...mono, flexShrink: 0, marginLeft: 10 }}>OK</button>
          </div>
        </div>
      )}

      {/* ── DAILY CHALLENGE ── */}
      <div style={{ ...C({ padding: "14px", marginBottom: 12, border: `1px solid ${challengeDone[challengeKey] ? T.gold + "88" : T.gold + "33"}`, background: challengeDone[challengeKey] ? "linear-gradient(135deg,#1a1200,#0a0800)" : "transparent", animation: !challengeDone[challengeKey] ? "challengePulse 3s infinite" : "none" }) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 9, color: T.gold, letterSpacing: 2, ...mono }}>⚔️ DAILY CHALLENGE</div>
          {challengeDone[challengeKey] ? <span style={{ fontSize: 9, color: T.gold, background: T.gold + "22", padding: "2px 8px", borderRadius: 10, ...mono }}>✓ COMPLETED +{todayChallenge.xp}XP</span> : <span style={{ fontSize: 9, color: T.muted, ...mono }}>+{todayChallenge.xp} XP</span>}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 24 }}>{todayChallenge.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: challengeDone[challengeKey] ? T.gold : T.bright, fontWeight: 600, ...raj, textDecoration: challengeDone[challengeKey] ? "line-through" : "none" }}>{todayChallenge.text}</div>
            {challengeDone[challengeKey] && <div style={{ fontSize: 10, color: T.gold, ...mono, marginTop: 3 }}>🏆 NAILED IT — comeback confirmed</div>}
          </div>
        </div>
      </div>

      {/* ── TODAY'S INTENTION ── */}
      <div style={{ ...C({ padding: "12px 14px", marginBottom: 12, border: `1px solid ${T.cyan}33`, background: "linear-gradient(135deg,#020d0d,#020408)" }) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: todayIntention.date === TODAY ? 8 : 6 }}>
          <div style={{ fontSize: 9, color: T.cyan, letterSpacing: 2, ...mono }}>🎯 TODAY'S INTENTION</div>
          {todayIntention.date === TODAY && <button onClick={() => setTodayIntention({ text: "", date: "" })} style={{ fontSize: 9, color: T.muted, background: "transparent", border: `1px solid ${T.border}`, borderRadius: 5, padding: "2px 7px", cursor: "pointer", ...mono }}>RESET</button>}
        </div>
        {todayIntention.date === TODAY ? (
          <div style={{ fontSize: 13, color: T.cyan, ...raj, fontWeight: 600, lineHeight: 1.5, fontStyle: "italic" }}>"{todayIntention.text}"</div>
        ) : (
          <div style={{ display: "flex", gap: 6 }}>
            <input value={intentionInput} onChange={e => setIntentionInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && intentionInput.trim()) { setTodayIntention({ text: intentionInput.trim(), date: TODAY }); setIntentionInput(""); gainXP(5, "Intention set 🎯", "intention", true); e.preventDefault(); } }}
              placeholder="Set your ONE intention for today..." style={{ flex: 1, background: T.bg2, border: `1px solid ${T.cyan}33`, borderRadius: 7, padding: "8px 10px", color: T.bright, fontSize: 12, ...raj }} />
            <button onClick={() => { if (intentionInput.trim()) { setTodayIntention({ text: intentionInput.trim(), date: TODAY }); setIntentionInput(""); gainXP(5, "Intention set 🎯", "intention", true); } }} className="btn-tap" style={{ padding: "8px 12px", background: T.cyan + "22", border: `1px solid ${T.cyan}44`, color: T.cyan, borderRadius: 7, fontSize: 11, ...mono, cursor: "pointer" }}>SET</button>
          </div>
        )}
      </div>

      {/* ── DAILY SCORE + BANNER ── */}
      <div style={{ ...C({ padding: "18px", marginBottom: 12, background: "linear-gradient(135deg,#020d08,#041520,#020408)", border: `1px solid ${T.green}44`, position: "relative", overflow: "hidden" }) }}>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,transparent,transparent 28px,#00ff0806 29px),repeating-linear-gradient(90deg,transparent,transparent 28px,#00ff0806 29px)", pointerEvents: "none" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: T.dim, letterSpacing: 4, ...mono }}>OPERATION // ULTIMATE COMEBACK</div>
            <div style={{ ...orb, fontSize: 22, fontWeight: 900, ...gt(T.green), marginTop: 4 }}>RUDRA</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 2, ...raj }}>{new Date().getHours() < 5 ? "🌙 Working late — legendary dedication" : new Date().getHours() < 12 ? "🌅 Good morning — make today count" : new Date().getHours() < 17 ? "☀️ Afternoon grind — stay locked in" : "🌆 Evening session — finish strong"}</div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 8 }}>
              <div style={{ fontSize: 9, color: r.color, ...mono, background: r.color + "22", padding: "2px 8px", borderRadius: 10 }}>⚡ {r.title}</div>
              <div style={{ fontSize: 9, color: T.gold, ...mono }}>{xp} XP · LVL {xpLevel}</div>
            </div>
          </div>
          {/* Daily Score Circle */}
          <div style={{ textAlign: "center", flexShrink: 0, marginLeft: 10 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", border: `3px solid ${scoreColor}`, background: `${scoreColor}15`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `0 0 16px ${scoreColor}44`, animation: "scoreCount .5s ease" }}>
              <div style={{ ...orb, fontSize: 20, fontWeight: 900, color: scoreColor, lineHeight: 1 }}>{scoreGrade}</div>
              <div style={{ fontSize: 8, color: scoreColor, ...mono }}>{dailyScore}</div>
            </div>
            <div style={{ fontSize: 7, color: T.muted, ...mono, marginTop: 3 }}>TODAY</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
          <div style={{ flex: 1, height: 7, background: "#041a0e", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: `${tp}%`, height: "100%", background: `linear-gradient(90deg,${T.blue},${T.green})`, boxShadow: `0 0 12px ${T.green}55`, borderRadius: 4, transition: "width .8s" }} />
          </div>
          <span style={{ ...orb, fontSize: 13, fontWeight: 700, ...gt(T.green) }}>{tp}%</span>
        </div>
        <LiveClock />
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          <button onClick={() => setShowMscDeadlines(true)} style={{ fontSize: 9, color: T.blue, background: T.blue + "11", border: `1px solid ${T.blue}33`, borderRadius: 6, padding: "3px 10px", cursor: "pointer", ...mono }}>🏛️ MSc Deadlines</button>
          {isWeeklyReviewDay && <button onClick={() => setShowWeeklyReview(true)} style={{ fontSize: 9, color: T.gold, background: T.gold + "11", border: `1px solid ${T.gold}33`, borderRadius: 6, padding: "3px 10px", cursor: "pointer", ...mono }}>📋 Weekly Review</button>}
        </div>
        {/* Rank XP bar */}
        <div style={{ marginTop: 10, borderTop: `1px solid ${T.border}`, paddingTop: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 8, color: r.color, ...mono }}>{r.title}</span>
            <span style={{ fontSize: 8, color: T.muted, ...mono }}>{xpPct}/100 to LVL {xpLevel + 1}</span>
          </div>
          <div style={{ height: 4, background: T.bg2, borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: `${xpPct}%`, height: "100%", background: `linear-gradient(90deg,${r.color},${T.gold})`, boxShadow: `0 0 6px ${r.color}55`, borderRadius: 2, transition: "width .5s" }} />
          </div>
        </div>
        {/* Rotating motivational quote */}
        <div onClick={() => { setQuoteIdx(q => (q + 1) % 20); setShowQuoteModal(true); }} style={{ marginTop: 10, borderTop: `1px solid ${T.border}`, paddingTop: 8, cursor: "pointer" }}>
          <div style={{ fontSize: 9, color: T.dim, letterSpacing: 2, ...mono, marginBottom: 4 }}>💬 TAP FOR FUEL</div>
          <div key={quoteIdx} style={{ fontSize: 11, color: T.text, ...raj, lineHeight: 1.6, fontStyle: "italic", animation: "quoteFade .5s ease" }}>"{quoteIdx < 20 ? ["The people who mocked you at 32/100 haven't seen what you score when you're angry.", "A 3.95 GPA after they wrote you off isn't luck. It's a statement.", "Every Golden A+ was evidence. The private university was a detour, not the destination.", "The comeback isn't just about getting in. It's about showing them who was wrong.", "You didn't survive all of that to be ordinary. The machine is warmed up now.", "They saw the 32. They didn't see the 3.95 coming. Let them be surprised again.", "National Debate Champion. 3.95 GPA. Cancer research thesis. Tell me again how you failed.", "Your dreams — the bike, the house, the life abroad — none of them are impossible for who you actually are.", "The fall was public. The comeback will be louder.", "You are not the 32. You are the 3.95 that followed it."][quoteIdx] : "The people who mocked you at 32/100 haven't seen what you score when you're angry."}"</div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 12 }}>
        {[
          { l: "THESIS", v: `${tp}%`, c: T.green },
          { l: "WEIGHT", v: `+${wGained}kg`, c: T.pink },
          { l: "STREAK", v: `${streak}d 🔥`, c: T.gold },
          { l: "SCORE", v: dailyScore, c: scoreColor }
        ].map((s, i) => (
          <div key={i} style={{ ...C({ padding: "10px 4px", textAlign: "center", border: `1px solid ${s.c}22` }) }}>
            <div style={{ ...orb, fontSize: 15, fontWeight: 900, ...gt(s.c) }}>{s.v}</div>
            <div style={{ fontSize: 7, color: T.muted, letterSpacing: 1, marginTop: 2, ...mono }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* ── TODAY'S PROGRESS CHECKLIST ── */}
      <div style={{ ...C({ padding: "14px", marginBottom: 12, border: `1px solid ${T.green}22` }) }}>
        <div style={{ fontSize: 9, color: T.green, letterSpacing: 2, ...mono, marginBottom: 10 }}>📋 TODAY'S PROGRESS</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {[
            { label: "Mood logged", done: moodLog.some(e => e.date === TODAY), color: T.cyan, icon: "🧠" },
            { label: "Sleep logged", done: !!sleepLog.find(x => x.date === TODAY), color: "#a855f7", icon: "😴" },
            { label: "Water 8/8", done: waterCount >= 8, color: T.blue, icon: "💧" },
            { label: "Workout", done: dayPct(workoutDay) === 100, color: DAYS[workoutDay - 1].color, icon: "💪" },
            { label: "War log entry", done: dailyLog.some(e => e.date === TODAY), color: T.green, icon: "📓" },
            { label: "Calories 2800+", done: calorieLog.reduce((a, c) => a + c.cal, 0) >= 2800, color: T.orange, icon: "🔥" },
            { label: "Habits done", done: false, color: T.gold, icon: "🔁" },
            { label: "Intention set", done: todayIntention.date === TODAY, color: T.cyan, icon: "🎯" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: item.done ? item.color + "11" : "transparent", border: `1px solid ${item.done ? item.color + "44" : T.border}`, borderRadius: 8, padding: "7px 10px", transition: "all .3s" }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
              <span style={{ flex: 1, fontSize: 10, color: item.done ? item.color : T.muted, ...raj, fontWeight: item.done ? 600 : 400, textDecoration: item.done ? "none" : "none" }}>{item.label}</span>
              <span style={{ fontSize: 12, color: item.done ? item.color : T.border }}>{item.done ? "✓" : "○"}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, height: 5, background: T.bg2, borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${checklistPct}%`, background: `linear-gradient(90deg,${T.blue},${T.green})`, borderRadius: 3, transition: "width .8s" }} />
        </div>
        <div style={{ fontSize: 8, color: T.muted, ...mono, marginTop: 4, textAlign: "right" }}>{completedCount}/8 COMPLETED</div>
      </div>

      {/* ── MOOD TREND CHART ── */}
      <div style={{ ...C({ padding: "14px", marginBottom: 12, border: `1px solid ${T.cyan}22` }) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 9, color: T.cyan, letterSpacing: 2, ...mono }}>🧠 TODAY'S MENTAL STATE</div>
          {mood && <button onClick={() => { setMood(null); setMoodLog(p => p.filter(e => e.date !== TODAY)); takeXP(5, "Mood cleared ↩", "mood"); }} style={{ fontSize: 9, color: T.muted, background: "transparent", border: `1px solid ${T.border}`, borderRadius: 6, padding: "2px 8px", cursor: "pointer", ...mono }}>✕ CLEAR</button>}
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          {todayMoods.map(m => (
            <button key={m.l} onClick={() => {
              const first = !moodLog.some(e => e.date === TODAY);
              setMood(m.l);
              setMoodLog(p => [...p.filter(e => e.date !== TODAY), { mood: m.l, emoji: m.e, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), date: TODAY }]);
              if (first) gainXP(5, "Mood logged 🧠", "mood", true);
              if (new Date().getHours() < 8) gainXP(25, "Early Bird! 🌅", "early_bird", true);
            }} className="btn-tap" style={{ flex: 1, padding: "8px 2px", background: mood === m.l ? T.cyan + "22" : "transparent", border: `1.5px solid ${mood === m.l ? T.cyan : T.border}`, borderRadius: 8, cursor: "pointer", textAlign: "center", transition: "all .2s" }}>
              <div style={{ fontSize: 18 }}>{m.e}</div>
              <div style={{ fontSize: 7, color: mood === m.l ? T.cyan : T.muted, ...mono, marginTop: 2 }}>{m.l}</div>
            </button>
          ))}
        </div>
        {/* 7-day mood trend */}
        <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 10 }}>
          <div style={{ fontSize: 8, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 6 }}>7-DAY MOOD TREND</div>
          <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 40 }}>
            {last7Days.map((d, i) => {
              const h = d.score > 0 ? Math.max(8, Math.round((d.score / 100) * 36)) : 4;
              const isToday = i === 6;
              const mColor = d.score >= 80 ? T.green : d.score >= 60 ? T.blue : d.score >= 40 ? T.orange : T.red;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  {d.mood && <span style={{ fontSize: 9 }}>{moodEmojis[d.mood] || "•"}</span>}
                  <div style={{ width: "100%", height: h, background: d.score > 0 ? (isToday ? T.cyan : mColor + "88") : T.border, borderRadius: 2, border: isToday ? `1px solid ${T.cyan}` : "none", transition: "height .5s", boxShadow: isToday ? `0 0 6px ${T.cyan}44` : "none" }} />
                  <div style={{ fontSize: 6, color: isToday ? T.cyan : T.dim, ...mono }}>{new Date(d.d).toLocaleDateString([], { weekday: "narrow" })}</div>
                </div>
              );
            })}
          </div>
        </div>
        {mood && <div style={{ fontSize: 10, color: T.cyan, marginTop: 8, textAlign: "center", ...mono }}>Current: {mood} — stay locked in ⚡</div>}
      </div>

      {/* ── SLEEP TRACKER ── */}
      <div style={{ ...C({ padding: "14px", marginBottom: 12, border: `1px solid ${"#a855f7"}22` }) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 9, color: "#a855f7", letterSpacing: 2, ...mono }}>😴 SLEEP TRACKER</div>
          {todaySleep && <div style={{ fontSize: 10, color: "#a855f7", ...mono }}>{todaySleep.hours}h · {todaySleep.quality}</div>}
        </div>
        {!todaySleep ? (
          <div style={{ display: "flex", gap: 6 }}>
            <input value={sleepHours} onChange={e => setSleepHours(e.target.value)} type="number" placeholder="Hours slept" style={{ flex: 1, background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 7, padding: "7px 10px", color: T.bright, fontSize: 12, ...mono }} min="1" max="12" step="0.5" />
            <select value={sleepQuality} onChange={e => setSleepQuality(e.target.value)} style={{ flex: 1, background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 7, padding: "7px 10px", color: T.text, fontSize: 11, ...mono }}>
              {["Great", "Good", "Okay", "Poor", "Terrible"].map(q => <option key={q} value={q}>{q}</option>)}
            </select>
            <button onClick={() => {
              const h = parseFloat(sleepHours);
              if (!isNaN(h) && h > 0) {
                setSleepLog(l => [...l.filter(x => x.date !== TODAY), { date: TODAY, hours: h, quality: sleepQuality }]);
                setSleepHours("");
                const xpAmt = h >= 7 && h <= 9 ? 20 : h >= 6 ? 10 : 5;
                gainXP(xpAmt, `Sleep logged 😴 ${h}h`, "sleep", true);
              }
            }} className="btn-tap" style={{ padding: "7px 12px", background: "#a855f722", border: "1px solid #a855f755", color: "#a855f7", borderRadius: 7, fontSize: 11, ...mono, cursor: "pointer" }}>LOG</button>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {Array.from({ length: 9 }, (_, i) => {
                const isOn = (i + 1) <= todaySleep.hours;
                const optimal = i >= 6 && i <= 8;
                return <div key={i} style={{ flex: 1, height: 16, borderRadius: 3, background: isOn ? (optimal ? "#a855f7" : "#a855f766") : T.border, transition: "all .3s", boxShadow: isOn && optimal ? "0 0 6px #a855f766" : "none" }} />;
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <span style={{ fontSize: 8, color: T.muted, ...mono }}>1h</span>
              <span style={{ fontSize: 8, color: "#a855f7", ...mono }}>Optimal: 7–9h</span>
              <span style={{ fontSize: 8, color: T.muted, ...mono }}>9h</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
              <span style={{ fontSize: 10, ...raj, color: T.text }}>Quality: <strong style={{ color: "#a855f7" }}>{todaySleep.quality}</strong></span>
              <button onClick={() => setSleepLog(l => l.filter(x => x.date !== TODAY))} style={{ fontSize: 9, color: T.muted, background: "transparent", border: `1px solid ${T.border}`, borderRadius: 5, padding: "2px 7px", cursor: "pointer", ...mono }}>EDIT</button>
            </div>
          </div>
        )}
      </div>

      {/* ── WATER ── */}
      <div style={{ ...C({ padding: "14px", marginBottom: 10, border: `1px solid ${T.blue}22` }) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 9, color: T.blue, letterSpacing: 2, ...mono }}>💧 WATER INTAKE</div>
          <div style={{ ...orb, fontSize: 14, fontWeight: 700, color: waterCount >= 8 ? T.green : T.blue }}>{waterCount}/8 glasses</div>
        </div>
        <div style={{ display: "flex", gap: 5, marginBottom: 6 }}>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} onClick={() => {
              if (i === waterCount) { const nx = waterCount + 1; setWaterCount(nx); if (nx === 8) gainXP(15, "Hydrated! 💧", "hydration", true); }
              else if (i < waterCount) setWaterCount(i);
            }} style={{ flex: 1, height: 30, borderRadius: 5, background: i < waterCount ? T.blue + "44" : "transparent", border: `1.5px solid ${i < waterCount ? T.blue : T.border}`, cursor: "pointer", transition: "all .2s", boxShadow: i < waterCount ? `0 0 5px ${T.blue}44` : "none" }} />
          ))}
        </div>
        <div style={{ fontSize: 8, color: T.muted, ...mono }}>Tap next to fill · Tap filled to undo</div>
      </div>

      {/* ── CALORIES ── */}
      <div style={{ ...C({ padding: "14px", marginBottom: 10, border: `1px solid ${T.orange}22` }) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 9, color: T.orange, letterSpacing: 2, ...mono }}>🔥 CALORIES</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ ...orb, fontSize: 13, fontWeight: 700, color: totalCal >= 2800 ? T.green : T.orange }}>{totalCal}/2800</div>
            {calorieLog.length > 0 && <button onClick={() => { takeXP(calorieLog.length * 3, "Meals cleared ↩"); setCalorieLog([]); }} style={{ fontSize: 8, color: T.muted, background: "transparent", border: `1px solid ${T.border}`, borderRadius: 5, padding: "2px 6px", cursor: "pointer", ...mono }}>CLEAR</button>}
          </div>
        </div>
        <div style={{ height: 4, background: T.bg2, borderRadius: 2, overflow: "hidden", marginBottom: 8 }}>
          <div style={{ width: `${Math.min(100, (totalCal / 2800) * 100)}%`, height: "100%", background: `linear-gradient(90deg,${T.orange},${T.green})`, borderRadius: 2, transition: "width .5s" }} />
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          <input value={calLabel} onChange={e => setCalLabel(e.target.value)} placeholder="Meal name..." style={{ flex: 2, background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 7, padding: "7px 10px", color: T.bright, fontSize: 11, ...raj }} />
          <input value={calInput} onChange={e => setCalInput(e.target.value)} type="number" placeholder="cal" style={{ flex: 1, background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 7, padding: "7px 10px", color: T.bright, fontSize: 11, ...mono }} />
          <button onClick={() => { const v = parseInt(calInput); if (!isNaN(v) && v > 0) { setCalorieLog(l => [...l, { id: Date.now(), label: calLabel || "Meal", cal: v, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]); setCalInput(""); setCalLabel(""); gainXP(3, "Meal logged 🍽️"); } }} className="btn-tap" style={{ padding: "7px 12px", background: T.orange + "33", border: `1px solid ${T.orange}55`, color: T.orange, borderRadius: 7, fontSize: 11, ...mono, cursor: "pointer" }}>LOG</button>
        </div>
        {calorieLog.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 150, overflowY: "auto" }}>
            {calorieLog.map((x, i) => (
              <div key={x.id || i} style={{ display: "flex", alignItems: "center", gap: 8, background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 6, padding: "5px 10px" }}>
                <span style={{ fontSize: 9, color: T.dim, ...mono, flexShrink: 0 }}>{x.time}</span>
                <span style={{ flex: 1, fontSize: 11, color: T.text, ...raj }}>{x.label}</span>
                <span style={{ ...orb, fontSize: 11, color: T.orange, fontWeight: 700, flexShrink: 0 }}>{x.cal} cal</span>
                <button onClick={() => { setCalorieLog(l => l.filter((_, j) => j !== i)); takeXP(3, "Meal removed ↩"); }} style={{ background: "transparent", border: "none", color: T.muted, fontSize: 16, cursor: "pointer", lineHeight: 1 }}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── DAILY WAR LOG ── */}
      <div style={{ ...C({ padding: "14px", marginBottom: 10, border: `1px solid ${T.green}22` }) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 9, color: T.green, letterSpacing: 2, ...mono }}>📓 DAILY WAR LOG</div>
          <span style={{ fontSize: 9, color: T.muted, ...mono }}>{dailyLog.length} entries</span>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          <input value={dailyLogText} onChange={e => setDailyLogText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && dailyLogText.trim()) { setDailyLog(p => [{ id: Date.now(), text: dailyLogText, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), date: TODAY }, ...p]); setDailyLogText(""); gainXP(5, "Entry logged 📓"); e.preventDefault(); } }}
            placeholder="Log a thought, win, or blocker... (Enter)" style={{ flex: 1, background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 7, padding: "8px 12px", color: T.bright, fontSize: 12, ...raj }} />
          <button onClick={() => { if (dailyLogText.trim()) { setDailyLog(p => [{ id: Date.now(), text: dailyLogText, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), date: TODAY }, ...p]); setDailyLogText(""); gainXP(5, "Entry logged 📓"); } }} className="btn-tap" style={{ padding: "8px 12px", background: T.green + "33", border: `1px solid ${T.green}55`, color: T.green, borderRadius: 7, fontSize: 11, ...mono, cursor: "pointer" }}>ADD</button>
        </div>
        {dailyLog.slice(0, 6).map((l, i) => (
          <div key={l.id || i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "5px 0", borderBottom: i < Math.min(5, dailyLog.length - 1) ? `1px solid ${T.border}` : "none" }}>
            <span style={{ fontSize: 8, color: T.dim, ...mono, marginTop: 2, flexShrink: 0 }}>{l.time}</span>
            <span style={{ flex: 1, fontSize: 11, color: T.text, lineHeight: 1.5, ...raj }}>→ {l.text}</span>
            <button onClick={() => { setDailyLog(p => p.filter((_, j) => j !== i)); takeXP(5, "Entry removed ↩"); }} style={{ background: "transparent", border: "none", color: T.muted, fontSize: 14, cursor: "pointer", lineHeight: 1 }}>×</button>
          </div>
        ))}
        {dailyLog.length > 6 && <div style={{ fontSize: 9, color: T.muted, ...mono, marginTop: 6, textAlign: "center" }}>{dailyLog.length - 6} older entries hidden</div>}
      </div>

      {/* ── PHASE OVERVIEW ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
        {[1, 2, 3, 4].map(ph => {
          const ws = WEEKS.filter(w => w.phase === ph);
          const avg = ws.reduce((a, w) => a + weekPct(w.week), 0) / ws.length;
          const col = ["#00ff88", "#00b4ff", "#ff8800", "#ff006e"][ph - 1];
          return (
            <div key={ph} className="hovlift" onClick={() => setTab("plan")} style={{ ...C({ padding: "12px", border: `1px solid ${col}33`, cursor: "pointer" }) }}>
              <div style={{ fontSize: 8, color: col, letterSpacing: 2, ...mono }}>PHASE {ph}</div>
              <div style={{ ...orb, fontSize: 16, fontWeight: 900, color: T.bright, margin: "4px 0 6px" }}>{Math.round(avg)}%</div>
              <div style={{ height: 3, background: T.bg2, borderRadius: 2, overflow: "hidden" }}><div style={{ width: `${avg}%`, height: "100%", background: col, transition: "width .6s" }} /></div>
            </div>
          );
        })}
      </div>

      {/* ── WEEK AT A GLANCE ── */}
      <div style={{ ...C({ padding: "12px 14px", marginBottom: 10, border: `1px solid ${T.blue}22` }) }}>
        <div style={{ fontSize: 9, color: T.blue, letterSpacing: 2, ...mono, marginBottom: 10 }}>📅 THIS WEEK AT A GLANCE</div>
        <div style={{ display: "flex", gap: 5 }}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
            const today = new Date().getDay();
            const dayNum = i === 6 ? 0 : i + 1;
            const isToday = today === dayNum;
            const isPast = today > dayNum || (today === 0 && dayNum !== 0);
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ fontSize: 7, color: isToday ? T.blue : T.dim, ...mono }}>{day}</div>
                <div style={{ width: "100%", aspectRatio: "1", borderRadius: 6, background: isToday ? T.blue + "33" : isPast ? T.border + "88" : T.bg2, border: `1px solid ${isToday ? T.blue : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: isToday ? `0 0 8px ${T.blue}44` : "none" }}>
                  {isToday && <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.blue, boxShadow: `0 0 6px ${T.blue}` }} />}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontSize: 8, color: T.muted, ...mono }}>WEEK {Math.ceil((new Date() - new Date(2026, 2, 20)) / 604800000) + 1 > 0 && Math.ceil((new Date() - new Date(2026, 2, 20)) / 604800000) + 1 <= 15 ? Math.ceil((new Date() - new Date(2026, 2, 20)) / 604800000) + 1 : "—"} OF 15</span>
          <span style={{ fontSize: 8, color: T.green, ...mono }}>PHASE {WEEKS.find(w => w.week === activeWeek)?.phase || 1} · {["FOUNDATION", "IMPLEMENTATION", "EXPERIMENTS", "WRITING"][(WEEKS.find(w => w.week === activeWeek)?.phase || 1) - 1]}</span>
        </div>
      </div>

      {/* ── TODAY'S WORKOUT ── */}
      <div className="hovlift" onClick={() => setTab("body")} style={{ ...C({ padding: "14px", cursor: "pointer", border: `1px solid ${DAYS[workoutDay - 1].color}44` }) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 9, color: T.muted, letterSpacing: 2, ...mono }}>TODAY'S WORKOUT</div>
            <div style={{ ...orb, fontSize: 14, fontWeight: 700, color: T.bright, marginTop: 3 }}>{DAYS[workoutDay - 1].icon} {DAYS[workoutDay - 1].name}</div>
            <div style={{ fontSize: 11, color: T.muted, ...raj, marginTop: 2 }}>{DAYS[workoutDay - 1].sub}</div>
          </div>
          <Ring pct={dayPct(workoutDay)} size={58} stroke={5} color={DAYS[workoutDay - 1].color} label={`${dayPct(workoutDay)}%`} />
        </div>
      </div>
    </div>
  );
};

export default Home;
