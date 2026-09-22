import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { authApi, type SignInInput, type SignUpInput } from '../api/auth'
import { getToken, setToken, clearToken } from '../lib/api'
import type { User } from '../types/user'

interface AuthContextValue {
  user: User | null
  // True only during the very first check on page load (do we already
  // have a valid token?). Pages can use this to show a spinner instead
  // of flashing a "signed out" state before that check finishes.
  loading: boolean
  signIn: (input: SignInInput) => Promise<void>
  signUp: (input: SignUpInput) => Promise<void>
  signOut: () => void
  // Re-fetches /auth/me — call this after anything that changes the
  // user's own data server-side but isn't itself a sign-in (e.g. after
  // updating interests), so the rest of the app sees the fresh value.
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // On first load: if a token is already saved (from a previous
  // visit), use it to fetch the current user instead of starting
  // signed out. An invalid/expired token just means the fetch fails —
  // clear it and fall back to signed-out rather than looping forever.
  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }

    authApi
      .getMe()
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setLoading(false))
  }, [])

  async function signIn(input: SignInInput) {
    const result = await authApi.signIn(input)
    setToken(result.token)
    setUser(result.user)
  }

  async function signUp(input: SignUpInput) {
    await authApi.signUp(input)
    // Sign-up doesn't return a token (the backend only hands one back
    // from /auth/signin) — chain straight into signing in with the
    // same credentials so the person lands logged in, not on a
    // separate "now go log in" step.
    await signIn({ email: input.email, password: input.password })
  }

  function signOut() {
    clearToken()
    setUser(null)
  }

  async function refreshUser() {
    setUser(await authApi.getMe())
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// The hook every component actually uses. Throwing when it's called
// outside a provider turns a silent `undefined` bug into an immediate,
// obvious error at the call site.
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
