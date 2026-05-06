// ─── INTEGRATION GUIDE: Adding Admissions Dashboard to App.js ────────────────
// Follow these steps to integrate the new university admissions features

/\*\*
STEP 1: Import the new components at the top of App.js
─────────────────────────────────────────────────────────────────────────────

Add these imports after existing imports:

```javascript
import AdmissionsDashboard from "./AdmissionsDashboard";
import {
  ADMISSIONS_NEWS,
  ADMISSIONS_TIPS,
  ADMISSIONS_TRICKS,
} from "./admissions_features";
```

STEP 2: Add state variables for admissions tracking (in AppMain)
─────────────────────────────────────────────────────────────────────────────

Add to your useState declarations:

```javascript
const [admissionsTab, setAdmissionsTab] = useState("dashboard");
const [applicationTracking, setApplicationTracking] = useState({
  kuet: { status: "planning", vivaDate: null, score: 0 },
  du: { status: "planning", vivaDate: null, score: 0 },
  buet: { status: "planning", vivaDate: null, score: 0 },
  ku: { status: "planning", vivaDate: null, score: 0 },
});
const [tipsRead, setTipsRead] = useState([]);
const [admissionNotes, setAdmissionNotes] = useState({});
```

STEP 3: Modify the "admission" tab in your tab switch statement
─────────────────────────────────────────────────────────────────────────────

Find this in your render section:

```javascript
case "admission":
  return <Admission />;
```

Replace with:

```javascript
case "admission":
  return (
    <div>
      {/* If using the new dashboard */}
      <AdmissionsDashboard
        T={T}
        orb={orb}
        mono={mono}
        raj={raj}
        C={C}
      />
    </div>
  );
```

STEP 4: Update persistence to include admissions data
─────────────────────────────────────────────────────────────────────────────

In your saveState() call, add:

```javascript
applicationTracking,
tipsRead,
admissionNotes,
admissionsTab,
```

STEP 5: Update initialization in loadState() to include
─────────────────────────────────────────────────────────────────────────────

Add to D (loaded data):

```javascript
const [applicationTracking] = useState(D.applicationTracking || {});
const [tipsRead] = useState(D.tipsRead || []);
const [admissionNotes] = useState(D.admissionNotes || {});
const [admissionsTab] = useState(D.admissionsTab || "dashboard");
```

STEP 6: Add XP rewards for admissions actions (optional but recommended)
─────────────────────────────────────────────────────────────────────────────

Create helper functions:

```javascript
const completeAdmissionAction = (actionType, xpAmount = 20) => {
  gainXP(xpAmount, `Admission action: ${actionType} ✅`);
};
```

Then call when user:

- Submits application: completeAdmissionAction("Application submitted", 50)
- Completes checklist item: completeAdmissionAction("Checklist item", 15)
- Reads a tip/trick: completeAdmissionAction("Read strategy", 10)

STEP 7: Add to Firebase sync
─────────────────────────────────────────────────────────────────────────────

Make sure these fields are included in your saveState() function:

```javascript
await setDoc(USER_DOC, {
  // ... existing fields ...
  applicationTracking,
  admissionNotes,
  tipsRead,
  admissionsTab,
});
```

STEP 8: (OPTIONAL) Enhance with real-time updates
─────────────────────────────────────────────────────────────────────────────

Add this useEffect to check for new admissions news daily:

```javascript
useEffect(() => {
  const lastCheck =
    localStorage.getItem("admissions_news_check") || new Date(0);
  const timeSinceCheck = Date.now() - new Date(lastCheck);

  if (timeSinceCheck > 86400000) {
    // 24 hours
    // Trigger notification about new news
    setXpToast({ amount: 0, label: "📢 New admissions news available!" });
    localStorage.setItem("admissions_news_check", new Date().toISOString());
  }
}, []);
```

TESTING CHECKLIST
─────────────────────────────────────────────────────────────────────────────
□ Import statements don't cause errors
□ AdmissionsDashboard renders without crashing
□ Can switch between tabs (news, tips, tricks, tracker, unis, strategy)
□ News items expand/collapse on click
□ Tips display properly with full content
□ University comparison works
□ Tracker shows all applications
□ XP gains trigger when actions completed
□ Data persists on page reload
□ Mobile responsiveness works (flex wrapping)

FIREBASE STRUCTURE (for reference)
─────────────────────────────────────────────────────────────────────────────
{
"users": {
"rudra": {
// ... existing fields ...
"applicationTracking": {
"kuet": { "status": "planning", "vivaDate": null, "score": 0 },
"du": { "status": "planning", "vivaDate": null, "score": 0 },
"buet": { "status": "planning", "vivaDate": null, "score": 0 },
"ku": { "status": "planning", "vivaDate": null, "score": 0 }
},
"admissionNotes": {
"kuet_prof_email": "Sent to Prof Sobhan on May 15",
"du_viva_prep": "Practice: explain CRO algorithm in 3 minutes"
},
"tipsRead": ["tip1", "tip5", "tip7"],
"admissionsTab": "news"
}
}
}

TROUBLESHOOTING
─────────────────────────────────────────────────────────────────────────────

Issue: "Cannot find module 'admissions_features.js'"
Solution: Make sure admissions_features.js is in same folder as App.js

Issue: Component doesn't appear in UI
Solution: Check that tab switch statement routes correctly to admission case

Issue: Data not persisting
Solution: Verify saveState() includes all new fields, Firebase doc has permissions

Issue: Styling looks broken
Solution: Pass all theme objects (T, orb, mono, raj, C) to AdmissionsDashboard

Issue: News/Tips not showing content
Solution: Check expandedNews/expandedTip state is being toggled on click
\*/
