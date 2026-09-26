import { Link } from "react-router-dom";
import type { Event } from "../../types/event";
import { CATEGORY_LABELS } from "../../types/event";
import { formatDay, formatMonth, handleImageError } from "../../lib/format";
import { Badge } from "@/components/ui/badge";

// The core visual idea for the whole app: an event card reads like a
// ticket stub. The dashed line is a real perforation, not decoration —
// it separates the "stamped" date block from the event info, the same
// way a physical ticket does.
export default function EventCard({ event }: { event: Event }) {
  return (
    <Link
      to={`/events/${event.id}`}
      className="flex overflow-hidden rounded-base border-2 border-border bg-secondary-background shadow-shadow transition hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none"
    >
      <div className="flex w-24 flex-none flex-col items-center justify-center border-r-2 border-dashed border-border bg-main px-2 py-4 text-center">
        <span className="font-heading text-2xl leading-none text-main-foreground">
          {formatDay(event.datetime)}
        </span>
        <span className="mt-1 text-xs font-heading text-main-foreground">
          {formatMonth(event.datetime)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading">{event.name}</h3>
          <Badge>{CATEGORY_LABELS[event.category]}</Badge>
        </div>

        {event.image && (
          <img
            src={event.image}
            alt=""
            onError={handleImageError}
            className="aspect-[3/1] w-full rounded-base border-2 border-border object-cover"
          />
        )}

        <p className="text-sm font-base text-foreground/70">{event.location}</p>

        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {event.tags.map((tag) => (
              <Badge key={tag.id} variant="tag">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
