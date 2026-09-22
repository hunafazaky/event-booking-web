import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { eventsApi } from '../api/events'
import type { Event } from '../types/event'
import { ApiError } from '../lib/api'
import { formatFullDateTime } from '../lib/format'
import CategoryBadge from '../components/ui/CategoryBadge'

export default function OrganizerDashboardPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Tracks which event a delete is in flight for, so only that row's
  // button shows "Deleting…" instead of every row at once.
  const [deletingId, setDeletingId] = useState<number | null>(null)

  function load() {
    setLoading(true)
    setError(null)
    eventsApi
      .getMine()
      .then(setEvents)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load your events.'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleDelete(id: number) {
    if (!confirm('Delete this event? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await eventsApi.delete(id)
      setEvents((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete event.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">My Events</h1>
        <Link to="/organizer/new" className="rounded-full bg-crimson px-4 py-2 text-sm font-medium text-white">
          + New Event
        </Link>
      </div>

      {loading && <p className="mt-6 text-ink-muted">Loading…</p>}
      {error && <p className="mt-6 text-crimson">{error}</p>}

      {!loading && !error && events.length === 0 && (
        <p className="mt-6 text-ink-muted">You haven't created any events yet.</p>
      )}

      {!loading && !error && events.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-ink p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold">{event.name}</h2>
                  <CategoryBadge category={event.category} />
                </div>
                <p className="mt-1 text-sm text-ink-muted">{formatFullDateTime(event.datetime)}</p>
              </div>

              <div className="flex flex-none items-center gap-3 text-sm">
                <Link to={`/events/${event.id}`} className="text-ink-muted">
                  View
                </Link>
                <Link to={`/organizer/${event.id}/edit`} className="font-medium text-crimson">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(event.id)}
                  disabled={deletingId === event.id}
                  className="font-medium text-crimson disabled:opacity-50"
                >
                  {deletingId === event.id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
