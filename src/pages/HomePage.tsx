import { useEffect, useState } from "react";
import { eventsApi } from "../api/events";
import { tagsApi } from "../api/tags";
import { CATEGORIES, CATEGORY_LABELS, type Category } from "../types/event";
import type { Event } from "../types/event";
import type { Tag } from "../types/tag";
import { ApiError } from "../lib/api";
import { useDebouncedValue } from "../lib/useDebouncedValue";
import EventCard from "../components/events/EventCard";
import Pagination from "../components/ui/Pagination";
import Hero from "../components/home/Hero";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const [category, setCategory] = useState<Category | "">("");
  const [tag, setTag] = useState("");
  const [page, setPage] = useState(1);

  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  const [events, setEvents] = useState<Event[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // The tag-filter chip row only needs the full tag list once — it
  // doesn't depend on any of the filters below.
  useEffect(() => {
    tagsApi
      .list()
      .then(setAvailableTags)
      .catch(() => setAvailableTags([]));
  }, []);

  // Any filter changing should reset back to page 1 — staying on
  // page 3 of a newly-narrowed result set would likely be empty.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, tag]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    eventsApi
      .list({
        search: debouncedSearch,
        category: category || undefined,
        tag: tag || undefined,
        page,
      })
      .then(({ events, meta }) => {
        setEvents(events);
        setTotalPages(meta.total_page);
      })
      .catch((err) => {
        setError(
          err instanceof ApiError ? err.message : "Failed to load events.",
        );
      })
      .finally(() => setLoading(false));
  }, [debouncedSearch, category, tag, page]);

  return (
    <div>
      <Hero />

      <h2 className="mt-10 font-heading text-2xl">Upcoming Events</h2>

      <div className="mt-6 flex flex-col gap-4">
        <Input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events by name or description"
        />

        <div className="flex flex-wrap gap-2">
          <Button
            variant={category === "" ? "default" : "neutral"}
            size="sm"
            onClick={() => setCategory("")}
          >
            All categories
          </Button>
          {CATEGORIES.map((c) => (
            <Button
              key={c}
              variant={category === c ? "default" : "neutral"}
              size="sm"
              onClick={() => setCategory(c)}
            >
              {CATEGORY_LABELS[c]}
            </Button>
          ))}
        </div>

        {availableTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {availableTags.map((t) => (
              <button
                key={t.id}
                onClick={() => setTag(tag === t.name ? "" : t.name)}
              >
                <Badge
                  variant="tag"
                  className={
                    tag === t.name ? "ring-2 ring-ring ring-offset-2" : ""
                  }
                >
                  {t.name}
                </Badge>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        {loading && <LoadingState label="Loading events…" />}
        {error && <p className="font-base text-warning-foreground">{error}</p>}

        {!loading && !error && events.length === 0 && (
          <EmptyState message="No events match these filters yet." />
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
  );
}
