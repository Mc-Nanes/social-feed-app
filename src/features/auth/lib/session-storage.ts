import type { AuthSession } from '../types/auth'

const AUTH_STORAGE_KEY = 'codeleap.auth-session'

function isAuthSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== 'object') {
    return false
  }

  const session = value as Partial<AuthSession>

  return (
    (session.mode === 'username' || session.mode === 'google') &&
    typeof session.username === 'string' &&
    session.username.trim().length > 0
  )
}

export function loadSession(): AuthSession | null {
  if (typeof window === 'undefined') {
    return null
  }

  const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY)

  if (!rawSession) {
    return null
  }

  try {
    const parsedSession = JSON.parse(rawSession) as unknown

    if (!isAuthSession(parsedSession)) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
      return null
    }

    return {
      ...parsedSession,
      username: parsedSession.username.trim(),
    }
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export function saveSession(session: AuthSession) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export function clearSession() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}
