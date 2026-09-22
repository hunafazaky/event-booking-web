import { Link } from 'react-router-dom'
import type { Event } from '../../types/event'
import { formatDay, formatMonth } from '../../lib/format'
import CategoryBadge from '../ui/CategoryBadge'
import TagChip from '../ui/TagChip'

// The core visual idea for the whole app: an event card reads like a
// ticket stub. The dashed line is a real perforation, not decoration —
// it separates the "stamped" date block from the event info, the same
// way a physical ticket does.
export default function EventCard({ event }: { event: Event }) {
  return (
    <Link
      to={`/events/${event.id}`}
      className="flex overflow-hidden rounded-lg border border-ink bg-white transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--color-ink)]"
    >
      <div className="flex w-24 flex-none flex-col items-center justify-center border-r border-dashed border-ink bg-crimson-soft px-2 py-4 text-center">
        <span className="font-display text-2xl leading-none">{formatDay(event.datetime)}</span>
        <span className="mt-1 text-xs font-semibold text-crimson">{formatMonth(event.datetime)}</span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold">{event.name}</h3>
          <CategoryBadge category={event.category} />
        </div>

        <p className="text-sm text-ink-muted">{event.location}</p>

        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {event.tags.map((tag) => (
              <TagChip key={tag.id} name={tag.name} />
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
