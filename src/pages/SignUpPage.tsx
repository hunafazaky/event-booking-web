import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ApiError } from '../lib/api'
import type { Role } from '../types/user'

export default function SignUpPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('attendee')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await signUp({ name, email, password, role })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to sign up.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="font-display text-2xl">Sign Up</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink px-3 py-2 focus:outline-2 focus:outline-crimson"
          />
        </div>

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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink px-3 py-2 focus:outline-2 focus:outline-crimson"
          />
        </div>

        <fieldset>
          <legend className="text-sm font-medium">I want to</legend>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setRole('attendee')}
              className={
                role === 'attendee'
                  ? 'flex-1 rounded-lg bg-ink px-3 py-2 text-sm text-white'
                  : 'flex-1 rounded-lg border border-line px-3 py-2 text-sm text-ink-muted'
              }
            >
              Attend events
            </button>
            <button
              type="button"
              onClick={() => setRole('organizer')}
              className={
                role === 'organizer'
                  ? 'flex-1 rounded-lg bg-ink px-3 py-2 text-sm text-white'
                  : 'flex-1 rounded-lg border border-line px-3 py-2 text-sm text-ink-muted'
              }
            >
              Organize events
            </button>
          </div>
          <p className="mt-1 text-xs text-ink-muted">This can't be changed after signing up yet.</p>
        </fieldset>

        {error && <p className="text-sm text-crimson">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-crimson px-4 py-2 font-medium text-white disabled:opacity-50"
        >
          {submitting ? 'Signing up…' : 'Sign Up'}
        </button>
      </form>

      <p className="mt-4 text-sm text-ink-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-crimson">
          Sign in
        </Link>
      </p>
    </div>
  )
}
