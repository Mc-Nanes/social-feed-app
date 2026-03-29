export type AuthMode = 'username' | 'google'

export interface AuthSession {
  mode: AuthMode
  username: string
  displayName?: string | null
  email?: string | null
  photoUrl?: string | null
}

export interface AuthContextValue {
  session: AuthSession | null
  isGoogleAvailable: boolean
  isAuthenticating: boolean
  errorMessage: string | null
  loginWithUsername: (username: string) => void
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}
