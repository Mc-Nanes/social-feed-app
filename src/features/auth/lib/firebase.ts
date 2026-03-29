import { getApp, getApps, initializeApp } from 'firebase/app'
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
  type Auth,
} from 'firebase/auth'
import type { AuthSession } from '../types/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
}

const requiredKeys = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.appId,
]

let authInstance: Auth | null = null

export const isFirebaseConfigured = requiredKeys.every(
  (value) => typeof value === 'string' && value.trim().length > 0,
)

function getFirebaseAuth() {
  if (!isFirebaseConfigured) {
    return null
  }

  if (!authInstance) {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
    authInstance = getAuth(app)
  }

  return authInstance
}

function buildSessionFromGoogleProfile(profile: {
  displayName?: string | null
  email?: string | null
  photoURL?: string | null
}): AuthSession {
  const username =
    profile.displayName?.trim() ||
    profile.email?.split('@')[0]?.trim() ||
    'google-user'

  return {
    mode: 'google',
    username,
    displayName: profile.displayName ?? username,
    email: profile.email ?? null,
    photoUrl: profile.photoURL ?? null,
  }
}

export async function signInWithGoogle(): Promise<AuthSession> {
  const auth = getFirebaseAuth()

  if (!auth) {
    throw new Error('Firebase auth is not configured.')
  }

  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })

  const credentials = await signInWithPopup(auth, provider)

  return buildSessionFromGoogleProfile(credentials.user)
}

export async function signOutGoogle() {
  const auth = getFirebaseAuth()

  if (!auth) {
    return
  }

  await signOut(auth)
}
