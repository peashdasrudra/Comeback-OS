import { createContext, useContext, useReducer, useCallback, useRef, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// ─── FIREBASE (Env Vars) ───
let db = null;
let USER_DOC = null;

try {
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyA18GxWg2WNCj4tcj31PsanrtCeBE8ZDVw",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "comeback-os.firebaseapp.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "comeback-os",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "comeback-os.firebasestorage.app",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "536594041438",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:536594041438:web:39f3763fe00631215b82cf"
  };
  
  const fbApp = initializeApp(firebaseConfig);
  db = getFirestore(fbApp);
  USER_DOC = doc(db, "users", "rudra");
} catch (e) {
  console.warn("Firebase init failed, using localStorage only:", e.message);
}

// ─── THEME ───
export const T = {
  bg:"#020408",bg1:"#060d12",bg2:"#0a1520",bg3:"#0d1e2e",
  border:"#0d2030",border2:"#1a3040",
  green:"#00ff88",blue:"#00b4ff",orange:"#ff8800",
  pink:"#ff006e",gold:"#ffd700",red:"#ff2244",cyan:"#00ffff",
  dim:"#2a5a3a",muted:"#3a6a5a",text:"#a8d8c0",bright:"#e8f8f0",
};

// ─── INITIAL STATE ───
const initialState = {
  xp: 0,
  quoteIdx: 0,
  workoutDay: 1,
  waterCount: 0,
  weightLog: [{weight:50, date:"May 6"}],
  dailyLog: [],
  habits: [
    {id:1, name:"Read thesis paper", color:T.green, streak:0, lastDone:""},
    {id:2, name:"Code 1 hour", color:T.blue, streak:0, lastDone:""},
    {id:3, name:"Gym workout", color:T.pink, streak:0, lastDone:""},
    {id:4, name:"Apply university", color:T.orange, streak:0, lastDone:""}
  ],
  mood: null,
  moodLog: [],
  sleepLog: [],
  sleepHours: "",
  sleepQuality: "Great",
  calorieLog: [],
  calInput: "",
  calLabel: "",
  dailyLogText: "",
  todayIntention: {text:"", date:""},
  intentionInput: "",
  challengeDone: {},
  burnoutDismissed: "",
  activeWeek: 1,
  tab: "home",
  sidebarOpen: false,
  tasksDone: {},
  taskNotes: {},
  openNote: null,
  workoutData: [],
  DAYS: [
    {day:1, name:"Push Power", icon:"💪", color:"#ff006e", sub:"Chest, Shoulders, Triceps", level:"ESSENTIAL", exercises:[{name:"Push-ups", sets:3, reps:12, done:[false,false,false]},{name:"Pike Push-ups", sets:3, reps:8, done:[false,false,false]},{name:"Tricep Dips", sets:3, reps:10, done:[false,false,false]}]},
    {day:2, name:"Pull Strength", icon:"🏋️", color:"#00b4ff", sub:"Back, Biceps, Rear Delts", level:"BEGINNER", exercises:[{name:"Doorframe Rows", sets:3, reps:12, done:[false,false,false]},{name:"Towel Bicep Curls", sets:3, reps:15, done:[false,false,false]},{name:"Reverse Snow Angels", sets:3, reps:10, done:[false,false,false]}]},
    {day:3, name:"Leg Explosion", icon:"🦵", color:"#00ff88", sub:"Quads, Hamstrings, Calves", level:"ESSENTIAL", exercises:[{name:"Bodyweight Squats", sets:3, reps:15, done:[false,false,false]},{name:"Lunges", sets:3, reps:10, done:[false,false,false]},{name:"Calf Raises", sets:3, reps:20, done:[false,false,false]}]},
    {day:4, name:"Core & Abs", icon:"🔥", color:"#ff8800", sub:"Abs, Obliques, Lower Back", level:"BEGINNER", exercises:[{name:"Crunches", sets:3, reps:15, done:[false,false,false]},{name:"Plank", sets:3, reps:30, done:[false,false,false]},{name:"Leg Raises", sets:3, reps:10, done:[false,false,false]}]},
    {day:5, name:"Full Body", icon:"⚡", color:"#a855f7", sub:"Compound Movements", level:"INTERMEDIATE", exercises:[{name:"Burpees", sets:3, reps:8, done:[false,false,false]},{name:"Mountain Climbers", sets:3, reps:20, done:[false,false,false]},{name:"Jump Squats", sets:3, reps:10, done:[false,false,false]}]},
    {day:6, name:"Active Recovery", icon:"🧘", color:"#ffd700", sub:"Mobility & Light Stretching", level:"ESSENTIAL", exercises:[{name:"Full Body Stretch", sets:1, reps:1, done:[false]},{name:"Walking", sets:1, reps:1, done:[false]}]},
    {day:7, name:"REST DAY", icon:"😴", color:"#3a6a5a", sub:"Complete Recovery", level:"ESSENTIAL", exercises:[]}
  ]
};

// ─── REDUCER ───
function appReducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE': return { ...state, ...action.payload };
    case 'SET_TAB': return { ...state, tab: action.payload };
    case 'SET_SIDEBAR': return { ...state, sidebarOpen: action.payload };
    case 'GAIN_XP': return { ...state, xp: state.xp + action.payload };
    case 'TAKE_XP': return { ...state, xp: Math.max(0, state.xp - action.payload) };
    case 'SET_QUOTE_IDX': return { ...state, quoteIdx: action.payload };
    case 'SET_WORKOUT_DAY': return { ...state, workoutDay: action.payload };
    case 'SET_WATER_COUNT': return { ...state, waterCount: action.payload };
    case 'SET_WEIGHT_LOG': return { ...state, weightLog: action.payload };
    case 'SET_DAILY_LOG': return { ...state, dailyLog: action.payload };
    case 'SET_HABITS': return { ...state, habits: action.payload };
    case 'SET_MOOD': return { ...state, mood: action.payload };
    case 'SET_MOOD_LOG': return { ...state, moodLog: action.payload };
    case 'SET_SLEEP_LOG': return { ...state, sleepLog: action.payload };
    case 'SET_SLEEP_HOURS': return { ...state, sleepHours: action.payload };
    case 'SET_SLEEP_QUALITY': return { ...state, sleepQuality: action.payload };
    case 'SET_CALORIE_LOG': return { ...state, calorieLog: action.payload };
    case 'SET_CAL_INPUT': return { ...state, calInput: action.payload };
    case 'SET_CAL_LABEL': return { ...state, calLabel: action.payload };
    case 'SET_DAILY_LOG_TEXT': return { ...state, dailyLogText: action.payload };
    case 'SET_TODAY_INTENTION': return { ...state, todayIntention: action.payload };
    case 'SET_INTENTION_INPUT': return { ...state, intentionInput: action.payload };
    case 'SET_CHALLENGE_DONE': return { ...state, challengeDone: action.payload };
    case 'SET_BURNOUT_DISMISSED': return { ...state, burnoutDismissed: action.payload };
    case 'SET_ACTIVE_WEEK': return { ...state, activeWeek: action.payload };
    case 'SET_TASKS_DONE': return { ...state, tasksDone: action.payload };
    case 'SET_TASK_NOTES': return { ...state, taskNotes: action.payload };
    case 'SET_OPEN_NOTE': return { ...state, openNote: action.payload };
    case 'SET_WORKOUT_DATA': return { ...state, workoutData: action.payload };
    default: return state;
  }
}

// ─── CONTEXT ───
const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const saveTimer = useRef(null);

  // Load state from Firebase/localStorage
  useEffect(() => {
    async function load() {
      if (db && USER_DOC) {
        try {
          const snap = await getDoc(USER_DOC);
          if (snap.exists()) {
            const d = snap.data();
            localStorage.setItem("comeback_os", JSON.stringify(d));
            dispatch({ type: 'LOAD_STATE', payload: d });
            return;
          }
        } catch {}
      }
      try {
        const s = localStorage.getItem("comeback_os");
        if (s) dispatch({ type: 'LOAD_STATE', payload: JSON.parse(s) });
      } catch {}
    }
    load();
  }, []);

  // Debounced save
  const saveState = useCallback((state) => {
    try { localStorage.setItem("comeback_os", JSON.stringify(state)); } catch {}
    if (db && USER_DOC) {
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        try { await setDoc(USER_DOC, state); } catch (e) { console.warn("Firebase save failed:", e.message); }
      }, 3000);
    }
  }, []);

  // Auto-save on state change
  useEffect(() => {
    saveState(state);
  }, [state, saveState]);

  // Action helpers
  const gainXP = useCallback((amt) => {
    dispatch({ type: 'GAIN_XP', payload: amt });
    if (navigator.vibrate) navigator.vibrate(50);
  }, []);

  const takeXP = useCallback((amt) => {
    dispatch({ type: 'TAKE_XP', payload: amt });
  }, []);

  // Setter helpers
  const setTab = useCallback((payload) => dispatch({ type: 'SET_TAB', payload }), []);
  const setSidebarOpen = useCallback((payload) => dispatch({ type: 'SET_SIDEBAR', payload }), []);
  const setMood = useCallback((payload) => dispatch({ type: 'SET_MOOD', payload }), []);
  const setMoodLog = useCallback((payload) => dispatch({ type: 'SET_MOOD_LOG', payload }), []);
  const setSleepLog = useCallback((payload) => dispatch({ type: 'SET_SLEEP_LOG', payload }), []);
  const setSleepHours = useCallback((payload) => dispatch({ type: 'SET_SLEEP_HOURS', payload }), []);
  const setSleepQuality = useCallback((payload) => dispatch({ type: 'SET_SLEEP_QUALITY', payload }), []);
  const setWaterCount = useCallback((payload) => dispatch({ type: 'SET_WATER_COUNT', payload }), []);
  const setCalorieLog = useCallback((payload) => dispatch({ type: 'SET_CALORIE_LOG', payload }), []);
  const setCalInput = useCallback((payload) => dispatch({ type: 'SET_CAL_INPUT', payload }), []);
  const setCalLabel = useCallback((payload) => dispatch({ type: 'SET_CAL_LABEL', payload }), []);
  const setDailyLog = useCallback((payload) => dispatch({ type: 'SET_DAILY_LOG', payload }), []);
  const setDailyLogText = useCallback((payload) => dispatch({ type: 'SET_DAILY_LOG_TEXT', payload }), []);
  const setTasksDone = useCallback((payload) => dispatch({ type: 'SET_TASKS_DONE', payload }), []);
  const setTaskNotes = useCallback((payload) => dispatch({ type: 'SET_TASK_NOTES', payload }), []);
  const setOpenNote = useCallback((payload) => dispatch({ type: 'SET_OPEN_NOTE', payload }), []);
  const setActiveWeek = useCallback((payload) => dispatch({ type: 'SET_ACTIVE_WEEK', payload }), []);
  const setWorkoutDay = useCallback((payload) => dispatch({ type: 'SET_WORKOUT_DAY', payload }), []);

  return (
    <AppContext.Provider value={{
      ...state,
      dispatch,
      gainXP,
      takeXP,
      setTab,
      setSidebarOpen,
      setMood,
      setMoodLog,
      setSleepLog,
      setSleepHours,
      setSleepQuality,
      setWaterCount,
      setCalorieLog,
      setCalInput,
      setCalLabel,
      setDailyLog,
      setDailyLogText,
      setTasksDone,
      setTaskNotes,
      setOpenNote,
      setActiveWeek,
      setWorkoutDay,
      TODAY: new Date().toDateString(),
      T,
      WEEKS: [
        {week:1, phase:1, dates:"May 6-12", thesis:["Read 2 papers","Write literature review"], csprep:["Arrays & Strings","Dynamic Programming"], ielts:["Speaking practice","Writing task 1"], admission:["Submit KUET form","Prepare documents"], blocker:"Need to finalize research topic", milestone:"Complete thesis chapter 1 draft"},
        {week:2, phase:1, dates:"May 13-19", thesis:["Finalize research topic","Methodology outline"], csprep:["Graph algorithms","Tree traversal"], ielts:["Reading practice","Listening test"], admission:["BUET application","SOP draft"], blocker:"", milestone:"Submit KUET application"},
        {week:3, phase:1, dates:"May 20-26", thesis:["Implementation start","Code setup"], csprep:["Sorting & Searching","Greedy algorithms"], ielts:["Writing task 2","Vocabulary building"], admission:["KU application","Transcript collection"], blocker:"", milestone:"Complete 50% of thesis ch1"},
        {week:4, phase:1, dates:"May 27-Jun 2", thesis:["Data collection","Analysis framework"], csprep:["Dynamic Programming","Backtracking"], ielts:["Full mock test","Feedback review"], admission:["DU inquiry","Recommendation letters"], blocker:"", milestone:"SOP first draft ready"},
        {week:5, phase:2, dates:"Jun 3-9", thesis:["Results analysis","Graph generation"], csprep:["System Design","OOP concepts"], ielts:["Speaking mock","Pronunciation"], admission:["Track all deadlines","Scholarship research"], blocker:"", milestone:"Complete methodology chapter"},
        {week:6, phase:2, dates:"Jun 10-16", thesis:["Chapter 2 draft","Citation management"], csprep:["Database questions","SQL practice"], ielts:["Writing feedback","Grammar focus"], admission:["Apply KUET","Follow up BUET"], blocker:"", milestone:"3 applications submitted"},
        {week:7, phase:2, dates:"Jun 17-23", thesis:["Results interpretation","Statistical tests"], csprep:["Networking basics","OS fundamentals"], ielts:["Reading提速","Time management"], admission:["KU application","Interview prep"], blocker:"", milestone:"Thesis 60% complete"},
        {week:8, phase:2, dates:"Jun 24-30", thesis:["Chapter 3 writing","Experiment docs"], csprep:["HTML/CSS/JS","React basics"], ielts:["Writing task 2","Essay structure"], admission:["DU application","Document notarization"], blocker:"", milestone:"5 universities applied"},
        {week:9, phase:3, dates:"Jul 1-7", thesis:["Final experiments","Data validation"], csprep:["Advanced React","State management"], ielts:["Full mock test","Weakness focus"], admission:["VIVA preparation","Mock interview"], blocker:"", milestone:"Thesis 80% complete"},
        {week:10, phase:3, dates:"Jul 8-14", thesis:["Chapter 4 draft","Results discussion"], csprep:["Node.js basics","API design"], ielts:["Speaking confidence","Fluency"], admission:["Wait for responses","Plan B universities"], blocker:"", milestone:"All 4 unis applied"},
        {week:11, phase:3, dates:"Jul 15-21", thesis:["Conclusion chapter","Future work"], csprep:["Python questions","Algorithm complexity"], ielts:["Final mock","Score prediction"], admission:["VIVA dates","Presentation prep"], blocker:"", milestone:"Thesis draft complete"},
        {week:12, phase:3, dates:"Jul 22-28", thesis:["Full draft review","Supervisor feedback"], csprep:["CS exam mock","Time management"], ielts:["Last minute tips","Relaxation"], admission:["VIVA practice","Q&A preparation"], blocker:"", milestone:"VIVA ready"},
        {week:13, phase:4, dates:"Jul 29-Aug 4", thesis:["Final edits","Formatting check"], csprep:["Review weak areas","Quick revision"], ielts:["Rest well","Stay confident"], admission:["Attend VIVAs","Follow up"], blocker:"", milestone:"Thesis submission ready"},
        {week:14, phase:4, dates:"Aug 5-11", thesis:["Submit thesis","Presentation prep"], csprep:["Final cs exam prep","Key concepts"], ielts:["Results day","Celebrate!"], admission:["VIVA results","Acceptance letters"], blocker:"", milestone:"Thesis submitted!"},
        {week:15, phase:4, dates:"Aug 12-15", thesis:["Celebrate!","Plan next steps"], csprep:["Relax","Enjoy break"], ielts:["Party!","Share results"], admission:["Choose university","Enrollment"], blocker:"", milestone:"Comeback complete! 🎉"}
      ]
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
