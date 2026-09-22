import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { eventsApi } from '../api/events'
import { bookingsApi } from '../api/bookings'
import type { EventDetail } from '../types/event'
import { ApiError } from '../lib/api'
import { formatFullDateTime } from '../lib/format'
import { useAuth } from '../context/AuthContext'
import CategoryBadge from '../components/ui/CategoryBadge'
import TagChip from '../components/ui/TagChip'

export default function EventDetailPage() {
  const { id } = useParams()
  const eventId = Number(id)
  const { user } = useAuth()

  const [event, setEvent] = useState<EventDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    eventsApi
      .getById(eventId)
      .then(setEvent)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load event.'))
      .finally(() => setLoading(false))
  }, [eventId])

  if (loading) return <p className="text-ink-muted">Loading event…</p>
  if (error) return <p className="text-crimson">{error}</p>
  if (!event) return null

  const isOwnEvent = user?.id === event.user.id

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2">
        <img
          src={event.image}
          alt={event.name}
          className="aspect-video w-full rounded-lg border border-ink object-cover"
        />

        <div className="mt-4 flex items-center gap-2">
          <CategoryBadge category={event.category} />
          <span className="text-sm text-ink-muted">
            {event.bookings.length} {event.bookings.length === 1 ? 'person' : 'people'} going
          </span>
        </div>

        <h1 className="mt-2 font-display text-3xl">{event.name}</h1>
        <p className="mt-1 text-ink-muted">{formatFullDateTime(event.datetime)}</p>
        <p className="text-ink-muted">{event.location}</p>

        {event.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {event.tags.map((tag) => (
              <TagChip key={tag.id} name={tag.name} />
            ))}
          </div>
        )}

        <p className="mt-6 max-w-prose whitespace-pre-line leading-relaxed">
          {event.description}
        </p>

        <p className="mt-6 text-sm text-ink-muted">Organized by {event.user.name}</p>
      </div>

      <div className="md:col-span-1">
        <BookingBox event={event} isOwnEvent={isOwnEvent} signedIn={!!user} />
      </div>
    </div>
  )
}

function BookingBox({
  event,
  isOwnEvent,
  signedIn,
}: {
  event: EventDetail
  isOwnEvent: boolean
  signedIn: boolean
}) {
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bookingCode, setBookingCode] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const booking = await bookingsApi.create({ phone, event_id: event.id })
      setBookingCode(booking.booking_code)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to book this event.')
    } finally {
      setSubmitting(false)
    }
  }

  const boxClasses = 'rounded-lg border border-ink p-5'

  if (isOwnEvent) {
    return (
      <div className={boxClasses}>
        <p className="text-sm text-ink-muted">This is your event.</p>
      </div>
    )
  }

  if (!signedIn) {
    return (
      <div className={boxClasses}>
        <p className="text-sm">
          <Link to="/login" className="font-medium text-crimson">
            Sign in
          </Link>{' '}
          to book this event.
        </p>
      </div>
    )
  }

  if (bookingCode) {
    return (
      <div className={boxClasses}>
        <p className="font-semibold">You're booked!</p>
        <p className="mt-1 text-sm text-ink-muted">
          Booking code: <span className="font-mono text-ink">{bookingCode}</span>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={boxClasses}>
      <label htmlFor="phone" className="text-sm font-medium">
        Phone number
      </label>
      <input
        id="phone"
        type="tel"
        required
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="e.g. 08123456789"
        className="mt-1 w-full rounded-lg border border-ink px-3 py-2 focus:outline-2 focus:outline-crimson"
      />

      {error && <p className="mt-2 text-sm text-crimson">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-3 w-full rounded-full bg-crimson px-4 py-2 font-medium text-white disabled:opacity-50"
      >
        {submitting ? 'Booking…' : 'Book This Event'}
      </button>
    </form>
  )
}
