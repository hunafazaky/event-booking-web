import { useState } from 'react'
import { useLocation, useNavigate, Link, type Location } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ApiError } from '../lib/api'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await signIn({ email, password })
      // ProtectedRoute stashes where the person was headed in
      // location.state.from before bouncing them here — send them
      // back there instead of always landing on the home page.
      const from = (location.state as { from?: Location })?.from
      navigate(from ?? '/', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to sign in.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="font-display text-2xl">Sign In</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink px-3 py-2 focus:outline-2 focus:outline-crimson"
          />
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink px-3 py-2 focus:outline-2 focus:outline-crimson"
          />
        </div>

        {error && <p className="text-sm text-crimson">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-crimson px-4 py-2 font-medium text-white disabled:opacity-50"
        >
          {submitting ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <p className="mt-4 text-sm text-ink-muted">
        Don't have an account?{' '}
        <Link to="/signup" className="font-medium text-crimson">
          Sign up
        </Link>
      </p>
    </div>
  )
}
