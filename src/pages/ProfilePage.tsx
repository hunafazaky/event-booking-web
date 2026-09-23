import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api/auth'
import { tagsApi } from '../api/tags'
import { ApiError } from '../lib/api'
import TagInput from '../components/ui/TagInput'

export default function ProfilePage() {
  const { user, refreshUser, signOut } = useAuth()
  const navigate = useNavigate()

  // --- Name ---
  const [name, setName] = useState(user?.name ?? '')
  const [savingName, setSavingName] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)
  const [nameSaved, setNameSaved] = useState(false)

  // --- Interests ---
  const [interests, setInterests] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [savingInterests, setSavingInterests] = useState(false)
  const [interestsError, setInterestsError] = useState<string | null>(null)
  const [interestsSaved, setInterestsSaved] = useState(false)

  // --- Delete account ---
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // Re-seed both editors whenever `user` changes (e.g. after
  // refreshUser), so they stay in sync with what's actually saved.
  useEffect(() => {
    if (user) {
      setName(user.name)
      setInterests(user.interests.map((t) => t.name))
    }
  }, [user])

  useEffect(() => {
    tagsApi.list().then((tags) => setSuggestions(tags.map((t) => t.name))).catch(() => {})
  }, [])

  if (!user) return null

  async function handleSaveName() {
    setSavingName(true)
    setNameError(null)
    setNameSaved(false)
    try {
      await authApi.updateProfile(name)
      await refreshUser()
      setNameSaved(true)
    } catch (err) {
      setNameError(err instanceof ApiError ? err.message : 'Failed to save name.')
    } finally {
      setSavingName(false)
    }
  }

  async function handleSaveInterests() {
    setSavingInterests(true)
    setInterestsError(null)
    setInterestsSaved(false)
    try {
      await authApi.updateInterests(interests)
      await refreshUser()
      setInterestsSaved(true)
    } catch (err) {
      setInterestsError(err instanceof ApiError ? err.message : 'Failed to save interests.')
    } finally {
      setSavingInterests(false)
    }
  }

  async function handleDeleteAccount() {
    if (!confirm('Delete your account? This cannot be undone.')) return
    setDeleting(true)
    setDeleteError(null)
    try {
      await authApi.deleteAccount()
      signOut()
      navigate('/', { replace: true })
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : 'Failed to delete account.')
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-2xl">Profile</h1>

      <div className="mt-8">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setNameSaved(false)
          }}
          className="mt-1 w-full rounded-lg border border-ink px-3 py-2 focus:outline-2 focus:outline-crimson"
        />
        {nameError && <p className="mt-2 text-sm text-crimson">{nameError}</p>}
        {nameSaved && !nameError && <p className="mt-2 text-sm text-ink-muted">Saved.</p>}
        <button
          onClick={handleSaveName}
          disabled={savingName || name === user.name}
          className="mt-3 rounded-full bg-crimson px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {savingName ? 'Saving…' : 'Save Name'}
        </button>
      </div>

      <p className="mt-6 text-ink-muted">{user.email}</p>
      <p className="mt-1 text-sm text-ink-muted capitalize">{user.role}</p>

      <div className="mt-8">
        <label className="text-sm font-medium">Favorite series</label>
        <p className="mt-1 text-xs text-ink-muted">
          Add anything — a series, a genre, a tag. Press Enter or comma after each one.
        </p>
        <div className="mt-2">
          <TagInput
            value={interests}
            onChange={(next) => {
              setInterests(next)
              setInterestsSaved(false)
            }}
            suggestions={suggestions}
            placeholder="e.g. Jujutsu Kaisen, shounen"
          />
        </div>

        {interestsError && <p className="mt-2 text-sm text-crimson">{interestsError}</p>}
        {interestsSaved && !interestsError && <p className="mt-2 text-sm text-ink-muted">Saved.</p>}

        <button
          onClick={handleSaveInterests}
          disabled={savingInterests}
          className="mt-4 rounded-full bg-crimson px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {savingInterests ? 'Saving…' : 'Save Interests'}
        </button>
      </div>

      <div className="mt-12 rounded-lg border border-crimson p-5">
        <p className="font-semibold text-crimson">Delete Account</p>
        <p className="mt-1 text-sm text-ink-muted">
          This permanently deletes your account. Events or bookings you've already created aren't
          removed — they'll just no longer show your name.
        </p>
        {deleteError && <p className="mt-2 text-sm text-crimson">{deleteError}</p>}
        <button
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="mt-3 rounded-full border border-crimson px-4 py-2 text-sm font-medium text-crimson disabled:opacity-50"
        >
          {deleting ? 'Deleting…' : 'Delete My Account'}
        </button>
      </div>
    </div>
  )
}
