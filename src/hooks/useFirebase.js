import { useState, useEffect, useCallback } from 'react'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
}

// Initialize Firebase
let fbApp, db, USER_DOC
try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    fbApp = initializeApp(firebaseConfig)
    db = getFirestore(fbApp)
    USER_DOC = doc(db, 'users', 'rudra')
  }
} catch (e) {
  console.warn('Firebase init failed:', e)
}

export function useFirebase() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(null)

  // Load state from Firebase or localStorage
  const loadState = useCallback(async () => {
    setIsLoading(true)
    try {
      if (USER_DOC) {
        const snap = await getDoc(USER_DOC)
        if (snap.exists()) {
          const d = snap.data()
          try { localStorage.setItem('comeback_os', JSON.stringify(d)) } catch {}
          setData(d)
          setIsLoading(false)
          return d
        }
      }
    } catch (e) {
      console.warn('Firebase read failed:', e)
    }
    // Fallback to localStorage
    try {
      const s = localStorage.getItem('comeback_os')
      if (s) {
        const parsed = JSON.parse(s)
        setData(parsed)
        setIsLoading(false)
        return parsed
      }
    } catch {}
    setIsLoading(false)
    return null
  }, [])

  // Save state with debounce
  const saveState = useCallback((newData) => {
    // Instant local write
    try { localStorage.setItem('comeback_os', JSON.stringify(newData)) } catch {}
    
    // Debounced Firebase write
    if (USER_DOC) {
      setTimeout(async () => {
        try {
          await setDoc(USER_DOC, newData)
        } catch (e) {
          console.warn('Firebase save failed:', e.message)
        }
      }, 3000)
    }
  }, [])

  useEffect(() => {
    loadState()
  }, [loadState])

  return { data, isLoading, loadState, saveState }
}

export default useFirebase