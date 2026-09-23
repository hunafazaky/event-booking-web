import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { bookingsApi } from '../api/bookings'
import type { Booking } from '../types/booking'
import { ApiError } from '../lib/api'
import { formatFullDateTime } from '../lib/format'

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<number | null>(null)

  useEffect(() => {
    bookingsApi
      .list()
      .then(setBookings)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load your bookings.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleCancel(id: number) {
    if (!confirm('Cancel this booking?')) return
    setCancellingId(id)
    try {
      await bookingsApi.delete(id)
      setBookings((prev) => prev.filter((b) => b.id !== id))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to cancel booking.')
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl">My Bookings</h1>

      {loading && <p className="mt-6 text-ink-muted">Loading…</p>}
      {error && <p className="mt-6 text-crimson">{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <p className="mt-6 text-ink-muted">
          You haven't booked anything yet.{' '}
          <Link to="/" className="font-medium text-crimson">
            Browse events
          </Link>
        </p>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-ink p-4"
            >
              <div>
                <Link to={`/events/${booking.event.id}`} className="font-semibold hover:underline">
                  {booking.event.name}
                </Link>
                <p className="mt-1 text-sm text-ink-muted">{formatFullDateTime(booking.event.datetime)}</p>
                <p className="text-sm text-ink-muted">{booking.event.location}</p>
                <p className="mt-1 text-sm">
                  Booking code: <span className="font-mono">{booking.booking_code}</span>
                </p>
              </div>

              <button
                onClick={() => handleCancel(booking.id)}
                disabled={cancellingId === booking.id}
                className="flex-none text-sm font-medium text-crimson disabled:opacity-50"
              >
                {cancellingId === booking.id ? 'Cancelling…' : 'Cancel'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
