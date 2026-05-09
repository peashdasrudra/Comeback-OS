import { create } from 'zustand'

export const useAppStore = create((set, get) => ({
  // XP & Level
  xp: 0,
  level: 1,
  addXP: (amount, reason) => {
    const newXP = get().xp + amount
    const newLevel = Math.floor(newXP / 500) + 1
    set({ xp: newXP, level: newLevel })
    if (newLevel > get().level) {
      // Trigger level up notification
      console.log(`🎉 Level up! Now level ${newLevel}`)
    }
    return newXP
  },

  // Theme
  theme: 'dark',
  toggleTheme: () => set(state => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

  // Notifications
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = Date.now()
    set(state => ({ toasts: [...state.toasts, { id, message, type }] }))
    setTimeout(() => {
      set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }))
    }, 3000)
  },

  // Habits
  habits: [],
  toggleHabit: (id) => set(state => ({
    habits: state.habits.map(h => 
      h.id === id ? { ...h, lastDone: new Date().toDateString(), streak: h.streak + 1 } : h
    )
  })),

  // Tasks
  tasks: {},
  toggleTask: (taskId) => set(state => ({
    tasks: { ...state.tasks, [taskId]: !state.tasks[taskId] }
  })),

  // Streak
  streak: 0,
  incrementStreak: () => set(state => ({ streak: state.streak + 1 })),
  resetStreak: () => set({ streak: 0 }),

  // Weight log
  weightLog: [{ weight: 50, date: 'May 6' }],
  addWeight: (weight) => set(state => ({
    weightLog: [...state.weightLog, { weight, date: new Date().toLocaleDateString() }]
  })),

  // Daily log
  dailyLog: [],
  addDailyEntry: (entry) => set(state => ({
    dailyLog: [...state.dailyLog, { ...entry, date: new Date().toDateString() }]
  })),

  // Achievements
  achievements: {},
  unlockAchievement: (id) => set(state => ({
    achievements: { ...state.achievements, [id]: true }
  })),

  // Water count
  waterCount: 0,
  addWater: () => set(state => ({ waterCount: Math.min(state.waterCount + 1, 8) })),
  resetWater: () => set({ waterCount: 0 }),

  // Mood
  mood: '😊',
  setMood: (mood) => set({ mood }),

  // Documents checked
  docChecks: {},
  toggleDocument: (id) => set(state => ({
    docChecks: { ...state.docChecks, [id]: !state.docChecks[id] }
  })),
}))
