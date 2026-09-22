import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { eventsApi } from '../api/events'
import EventForm, { type EventFormValues } from '../components/events/EventForm'
import type { EventDetail, Category } from '../types/event'
import { toDatetimeLocalValue } from '../lib/format'
import { ApiError } from '../lib/api'

export default function EditEventPage() {
  const { id } = useParams()
  const eventId = Number(id)
  const navigate = useNavigate()

  const [event, setEvent] = useState<EventDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    eventsApi
      .getById(eventId)
      .then(setEvent)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load event.'))
      .finally(() => setLoading(false))
  }, [eventId])

  async function handleSubmit(values: EventFormValues, image: File | null) {
    await eventsApi.update(eventId, {
      name: values.name,
      description: values.description,
      location: values.location,
      datetime: new Date(values.datetimeLocal).toISOString(),
      category: values.category as Category,
      tags: values.tags,
      // undefined (not chosen) means "keep the existing image" —
      // buildEventForm on the API side only sends the field when set.
      image: image ?? undefined,
    })
    navigate('/organizer')
  }

  if (loading) return <p className="text-ink-muted">Loading event…</p>
  if (error) return <p className="text-crimson">{error}</p>
  if (!event) return null

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display text-2xl">Edit Event</h1>
      <div className="mt-6">
        <EventForm
          submitLabel="Save Changes"
          initialImageUrl={event.image}
          initialValues={{
            name: event.name,
            description: event.description,
            location: event.location,
            datetimeLocal: toDatetimeLocalValue(event.datetime),
            category: event.category,
            tags: event.tags.map((t) => t.name),
          }}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
