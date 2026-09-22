import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api/auth'
import { tagsApi } from '../api/tags'
import { ApiError } from '../lib/api'
import TagInput from '../components/ui/TagInput'

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()

  const [interests, setInterests] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  // Seed the editor from the user's current interests once they're
  // available. Re-runs if `user` changes (e.g. after refreshUser), so
  // the chips stay in sync with what's actually saved.
  useEffect(() => {
    if (user) setInterests(user.interests.map((t) => t.name))
  }, [user])

  useEffect(() => {
    tagsApi.list().then((tags) => setSuggestions(tags.map((t) => t.name))).catch(() => {})
  }, [])

  if (!user) return null

  async function handleSave() {
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      await authApi.updateInterests(interests)
      await refreshUser()
      setSaved(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save interests.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-2xl">{user.name}</h1>
      <p className="text-ink-muted">{user.email}</p>
      <p className="mt-1 text-sm text-ink-muted capitalize">{user.role}</p>

      <div className="mt-8">
        <label className="text-sm font-medium">Favorite series</label>
        <p className="mt-1 text-xs text-ink-muted">
          Add anything — a series, a genre, a tag. Press Enter or comma after each one.
        </p>
        <div className="mt-2">
          <TagInput
            value={interests}
            onChange={setInterests}
            suggestions={suggestions}
            placeholder="e.g. Jujutsu Kaisen, shounen"
          />
        </div>

        {error && <p className="mt-2 text-sm text-crimson">{error}</p>}
        {saved && !error && <p className="mt-2 text-sm text-ink-muted">Saved.</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-4 rounded-full bg-crimson px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Interests'}
        </button>
      </div>
    </div>
  )
}
