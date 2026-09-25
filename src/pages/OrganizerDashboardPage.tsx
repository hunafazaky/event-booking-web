import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { eventsApi } from '../api/events'
import type { Event } from '../types/event'
import { CATEGORY_LABELS } from '../types/event'
import { ApiError } from '../lib/api'
import { formatFullDateTime } from '../lib/format'
import LoadingState from '../components/ui/LoadingState'
import EmptyState from '../components/ui/EmptyState'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

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
        <h1 className="font-heading text-2xl">My Events</h1>
        <Link to="/organizer/new" className={buttonVariants({ size: 'sm' })}>
          + New Event
        </Link>
      </div>

      {loading && <LoadingState />}
      {error && <p className="mt-6 font-base text-warning-foreground">{error}</p>}

      {!loading && !error && events.length === 0 && (
        <div className="mt-6">
          <EmptyState
            message="You haven't created any events yet."
            action={{ label: 'Create your first event', to: '/organizer/new' }}
          />
        </div>
      )}

      {!loading && !error && events.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex flex-col gap-3 rounded-base border-2 border-border bg-secondary-background p-4 shadow-shadow sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading">{event.name}</h2>
                  <Badge>{CATEGORY_LABELS[event.category]}</Badge>
                </div>
                <p className="mt-1 text-sm font-base text-foreground/70">
                  {formatFullDateTime(event.datetime)}
                </p>
              </div>

              <div className="flex flex-none items-center gap-3 text-sm">
                <Link to={`/events/${event.id}`} className="font-heading text-foreground/70">
                  View
                </Link>
                <Link to={`/organizer/${event.id}/edit`} className="font-heading underline">
                  Edit
                </Link>

                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button variant="warning" size="sm" disabled={deletingId === event.id}>
                        {deletingId === event.id ? 'Deleting…' : 'Delete'}
                      </Button>
                    }
                  />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete "{event.name}"?</AlertDialogTitle>
                      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction variant="warning" onClick={() => handleDelete(event.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
