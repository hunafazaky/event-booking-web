import { useEffect, useState } from 'react'
import { eventsApi } from '../api/events'
import { tagsApi } from '../api/tags'
import { CATEGORIES, CATEGORY_LABELS, type Category } from '../types/event'
import type { Event } from '../types/event'
import type { Tag } from '../types/tag'
import { ApiError } from '../lib/api'
import { useDebouncedValue } from '../lib/useDebouncedValue'
import EventCard from '../components/events/EventCard'
import Pagination from '../components/ui/Pagination'

export default function HomePage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search)

  const [category, setCategory] = useState<Category | ''>('')
  const [tag, setTag] = useState('')
  const [page, setPage] = useState(1)

  const [availableTags, setAvailableTags] = useState<Tag[]>([])

  const [events, setEvents] = useState<Event[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // The tag-filter chip row only needs the full tag list once — it
  // doesn't depend on any of the filters below.
  useEffect(() => {
    tagsApi.list().then(setAvailableTags).catch(() => setAvailableTags([]))
  }, [])

  // Any filter changing should reset back to page 1 — staying on
  // page 3 of a newly-narrowed result set would likely be empty.
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, category, tag])

  useEffect(() => {
    setLoading(true)
    setError(null)

    eventsApi
      .list({ search: debouncedSearch, category: category || undefined, tag: tag || undefined, page })
      .then(({ events, meta }) => {
        setEvents(events)
        setTotalPages(meta.total_page)
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Failed to load events.')
      })
      .finally(() => setLoading(false))
  }, [debouncedSearch, category, tag, page])

  return (
    <div>
      <h1 className="font-display text-3xl">Upcoming Anime Events</h1>
      <p className="mt-2 text-ink-muted">
        Conventions, screenings, doujin markets, and more from the community.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events by name or description"
          className="rounded-lg border border-ink px-4 py-2 focus:outline-2 focus:outline-crimson"
        />

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory('')}
            className={
              category === ''
                ? 'rounded-full bg-ink px-3 py-1 text-sm text-white'
                : 'rounded-full border border-line px-3 py-1 text-sm text-ink-muted'
            }
          >
            All categories
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={
                category === c
                  ? 'rounded-full bg-ink px-3 py-1 text-sm text-white'
                  : 'rounded-full border border-line px-3 py-1 text-sm text-ink-muted'
              }
            >
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>

        {availableTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {availableTags.map((t) => (
              <button
                key={t.id}
                onClick={() => setTag(tag === t.name ? '' : t.name)}
                className={
                  tag === t.name
                    ? 'rounded-full bg-violet px-2.5 py-1 text-xs font-medium text-white'
                    : 'rounded-full bg-violet-soft px-2.5 py-1 text-xs font-medium text-violet'
                }
              >
                {t.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        {loading && <p className="text-ink-muted">Loading events…</p>}
        {error && <p className="text-crimson">{error}</p>}

        {!loading && !error && events.length === 0 && (
          <p className="text-ink-muted">No events match these filters yet.</p>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  )
}
