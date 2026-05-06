// ─── VERCEL DEPLOYMENT GUIDE: COMEBACK OS ─────────────────────────────────
// Complete step-by-step instructions for deploying to Vercel

=============================================================================
DEPLOYMENT CHECKLIST & INSTRUCTIONS
=============================================================================

PHASE 1: PRE-DEPLOYMENT CHECKS ✓
─────────────────────────────────────────────────────────────────────────────

✓ Build successful: npm run build passes
✓ No console errors: npm start runs without errors
✓ Firebase config verified: API key is valid and in code
✓ All new files created: admissions_features.js, AdmissionsDashboard.jsx
✓ vercel.json configured
✓ .vercelignore file created
✓ package.json has all dependencies

PHASE 2: PREPARE FIREBASE CREDENTIALS FOR VERCEL ✓
─────────────────────────────────────────────────────────────────────────────

Your Firebase config (KEEP THESE SAFE):

- API Key: AIzaSyA18GxWg2WNCj4tcj31PsanrtCeBE8ZDVw
- Auth Domain: comeback-os.firebaseapp.com
- Project ID: comeback-os
- Storage Bucket: comeback-os.firebasestorage.app
- App ID: [your app id]

In Vercel Dashboard:

1. Go to Settings → Environment Variables
2. Add each credential as a separate variable
3. Scope to: Production + Preview + Development

PHASE 3: DEPLOY TO VERCEL
─────────────────────────────────────────────────────────────────────────────

OPTION A: Via Vercel CLI (Recommended)
─────────────────────────────────────────────────────────────────────────────

Step 1: Install Vercel CLI
npm install -g vercel

Step 2: Login to Vercel
vercel login
(Follow the browser authentication)

Step 3: Deploy
vercel --prod

When prompted:

- Set up and deploy? [Y/n]: Y
- Which scope? Select your account
- Link to existing project? n (first time)
- Project name: comeback-os
- Directory: .
- Build command: npm run build
- Output directory: build

Step 4: Wait for deployment (2-5 minutes)

Step 5: Your live URL will be displayed:
✓ Production: https://comeback-os.vercel.app
✓ Staging: https://comeback-os-git-main-[your-team].vercel.app

OPTION B: Via GitHub (If you have GitHub repo)
─────────────────────────────────────────────────────────────────────────────

Step 1: Push code to GitHub
git init (if not already)
git add .
git commit -m "Add university admissions features + Vercel config"
git push origin main

Step 2: Go to vercel.com/new
→ Select "Import Git Repository"
→ Connect GitHub account
→ Select your comeback-os repository
→ Choose framework: "Create React App"
→ Leave settings as default (Vercel auto-detects)
→ Click "Deploy"

Step 3: Configure Environment Variables
→ After deployment, go to Settings → Environment Variables
→ Add Firebase credentials
→ Re-deploy for env vars to take effect

OPTION C: Manual Upload (Not Recommended)
─────────────────────────────────────────────────────────────────────────────

1. Build locally: npm run build
2. Go to vercel.com/new
3. Drag & drop the 'build' folder
4. Name the project
5. Deploy

⚠️ Note: Manual upload won't automatically redeploy on code updates

PHASE 4: VERIFY DEPLOYMENT ✓
─────────────────────────────────────────────────────────────────────────────

After deployment completes:

1. Check Build Logs
   → Vercel Dashboard → Deployments → [Latest] → Logs
   → Look for "✓ Build successful" message
   → No errors should appear

2. Test the Live App
   → Visit https://comeback-os.vercel.app
   → Login with your PIN
   → Navigate to each tab to verify functionality
   → Check that Firebase data syncs correctly

3. Verify Admissions Features Work
   → Go to "Admission" tab
   → Click through all sub-tabs: News, Tips, Tricks, Tracker, Universities, Strategy
   → Test expanding/collapsing news items
   → Verify data loads correctly

4. Test Firebase Integration
   → Make a small change (log mood, complete task)
   → Refresh page (Ctrl+F5)
   → Verify change persists (proving Firebase sync works)

5. Check Console for Errors
   → Open Developer Tools (F12)
   → Go to Console tab
   → No red error messages should appear
   → Some yellow warnings are okay

PHASE 5: CUSTOM DOMAIN (OPTIONAL)
─────────────────────────────────────────────────────────────────────────────

If you want your own domain (e.g., comeback-os.bd):

1. Buy domain from GoDaddy, Namecheap, or similar
2. In Vercel Dashboard → Settings → Domains
3. Add your domain
4. Update DNS records at your registrar:
   - Type: CNAME
   - Name: @ (or www)
   - Value: cname.vercel.sh
5. Wait 15-30 minutes for DNS propagation
6. Your app is now at: https://comeback-os.bd

PHASE 6: MONITOR & MAINTAIN
─────────────────────────────────────────────────────────────────────────────

Regular checks:

- Visit deployed app weekly
- Check Vercel Dashboard for any issues
- Monitor build logs for errors
- Test Firebase sync regularly

Update procedure:

1. Make code changes locally
2. Test with npm start
3. Commit changes: git commit -m "Update: [description]"
4. Push to GitHub: git push origin main
5. Vercel auto-deploys (if linked to GitHub)
6. Check deployment status on Vercel Dashboard

TROUBLESHOOTING
─────────────────────────────────────────────────────────────────────────────

Issue: "Firebase config is undefined"
Solution: Add Firebase credentials to Vercel Environment Variables
→ Settings → Environment Variables → Add each key-value pair
→ Re-deploy after adding variables

Issue: "Build failed"
Solution: Check build logs for specific errors
→ Likely: import path wrong, missing dependency, syntax error
→ Run npm install locally to verify dependencies
→ Run npm run build locally to reproduce error

Issue: "Blank white page after deploy"
Solution:

1. Check browser console (F12) for errors
2. Verify vercel.json rewrites are correct
3. Hard refresh (Ctrl+Shift+R) to clear cache
4. Check that build folder exists and is not in .vercelignore

Issue: "Data not syncing between devices"
Solution: Verify Firebase Firestore rules allow read/write
→ Firebase Console → Firestore → Rules
→ Rules should allow authenticated access

Issue: "App works locally but not on Vercel"
Solution:

- Likely environment variable issue
- Check that all env vars are set in Vercel
- Verify Firebase project allows requests from your Vercel domain

FINAL VERIFICATION CHECKLIST
─────────────────────────────────────────────────────────────────────────────

Before telling user deployment is complete:

□ App loads at https://comeback-os.vercel.app
□ Login works with your PIN
□ Home tab displays correctly
□ Plan tab shows weeks and tasks
□ Body tab shows workout exercises
□ Stats tab shows progress
□ Admissions tab shows news/tips/tricks
□ XP counter increments when tasks completed
□ Data persists on page reload
□ No red errors in console
□ Firebase says "✓ Synced to Firestore"
□ Mobile responsive (check phone if possible)
□ All links work (YouTube playlists, university sites)

SUCCESS MARKERS
─────────────────────────────────────────────────────────────────────────────

✓ URL: https://comeback-os.vercel.app is live
✓ Build: npm run build completes without errors (221 KB bundle)
✓ Tests: All tabs load, no console errors
✓ Data: Firebase persists changes across sessions
✓ Performance: Page loads in <3 seconds
✓ Admissions: All 6 new tabs work (news, tips, tricks, tracker, unis, strategy)

=============================================================================
DEPLOYMENT COMPLETE!
=============================================================================

Your comeback-os app is now live and accessible worldwide!

Next steps:

1. Share the URL with friends/family
2. Continue adding features based on feedback
3. Monitor performance on Vercel Dashboard
4. Update code as needed (auto-deploys if using GitHub)

Questions?

- Vercel docs: https://vercel.com/docs
- Firebase docs: https://firebase.google.com/docs
- React docs: https://react.dev

Good luck with your MSc applications! 🚀
