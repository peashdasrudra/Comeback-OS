import React from 'react'
import ReactDOM from 'react-dom/client'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingState from './components/LoadingState'
import { ThemeProvider } from './components/ThemeProvider'
import { ToastProvider } from './components/ToastProvider'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <ThemeProvider>
      <ToastProvider>
        <React.Suspense fallback={<LoadingState />}>
          <App />
        </React.Suspense>
      </ToastProvider>
    </ThemeProvider>
  </ErrorBoundary>
)