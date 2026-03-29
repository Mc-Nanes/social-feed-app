import { useState, type ReactNode } from 'react'
import { clearSession, loadSession, saveSession } from '../lib/session-storage'
import {
  isFirebaseConfigured,
  signInWithGoogle,
  signOutGoogle,
} from '../lib/firebase'
import type { AuthSession } from '../types/auth'
import { AuthContext } from './auth-context'

interface AuthProviderProps {
  children: ReactNode
}

function createUsernameSession(username: string): AuthSession {
  return {
    mode: 'username',
    username: username.trim(),
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(() => loadSession())
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function loginWithUsername(username: string) {
    const normalizedUsername = username.trim()

    if (!normalizedUsername) {
      return
    }

    const nextSession = createUsernameSession(normalizedUsername)

    saveSession(nextSession)
    setErrorMessage(null)
    setSession(nextSession)
  }

  async function loginWithGoogle() {
    setIsAuthenticating(true)
    setErrorMessage(null)

    try {
      const nextSession = await signInWithGoogle()
      saveSession(nextSession)
      setSession(nextSession)
    } catch {
      setErrorMessage(
        'Google sign-in is unavailable right now. You can still enter with a username.',
      )
    } finally {
      setIsAuthenticating(false)
    }
  }

  async function logout() {
    setIsAuthenticating(true)

    try {
      if (session?.mode === 'google') {
        await signOutGoogle()
      }
    } finally {
      clearSession()
      setErrorMessage(null)
      setSession(null)
      setIsAuthenticating(false)
    }
  }

  function clearError() {
    setErrorMessage(null)
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isGoogleAvailable: isFirebaseConfigured,
        isAuthenticating,
        errorMessage,
        loginWithUsername,
        loginWithGoogle,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
