import * as Sentry from "@sentry/react"

export function initSentry() {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: process.env.NODE_ENV,
    release: `comeback-os@${process.env.REACT_APP_VERSION || "1.0.0"}`,
  })
}

export const SentryErrorBoundary = Sentry.ErrorBoundary

export function captureException(error, context = {}) {
  Sentry.captureException(error, { extra: context })
}

export function captureMessage(message, level = "info") {
  Sentry.captureMessage(message, level)
}

export function setUser(user) {
  if (user) {
    Sentry.setUser({ id: user.id, email: user.email, username: user.name }
  } else {
    Sentry.setUser(null)
  }
}

export default { initSentry, SentryErrorBoundary, captureException, captureMessage, setUser }