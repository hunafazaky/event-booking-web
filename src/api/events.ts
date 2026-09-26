import { api } from "../lib/api";
import type { Event, EventDetail, Category } from "../types/event";
import type { PageMeta } from "../types/api";

export interface EventListParams {
  search?: string;
  category?: Category;
  tag?: string;
  page?: number;
  limit?: number;
}

export interface EventListResult {
  events: Event[];
  meta: PageMeta;
}

export interface CreateEventInput {
  name: string;
  description: string;
  location: string;
  datetime: string; // RFC3339, e.g. from `date.toISOString()`
  category: Category;
  tags?: string[]; // e.g. ["Jujutsu Kaisen", "shounen"] — joined into one comma-separated field
  image: File;
}

export interface UpdateEventInput {
  name?: string;
  description?: string;
  location?: string;
  datetime?: string;
  category?: Category;
  // Leave undefined to keep the event's existing tags unchanged —
  // see the note on EventService.Update in the backend. Pass an
  // empty array to clear all tags, or a non-empty one to replace them.
  tags?: string[];
  image?: File;
}

function buildQuery(params: EventListParams): string {
  const search = new URLSearchParams();
  if (params.search) search.set("search", params.search);
  if (params.category) search.set("category", params.category);
  if (params.tag) search.set("tag", params.tag);
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

// Builds the multipart form both create and update send. `tags` is
// joined into a single comma-separated field because that's what the
// backend's PostForm("tags") parses — see parseTags on the Go side.
function buildEventForm(
  input: Partial<CreateEventInput | UpdateEventInput>,
): FormData {
  const form = new FormData();
  if (input.name !== undefined) form.set("name", input.name);
  if (input.description !== undefined)
    form.set("description", input.description);
  if (input.location !== undefined) form.set("location", input.location);
  if (input.datetime !== undefined) form.set("datetime", input.datetime);
  if (input.category !== undefined) form.set("category", input.category);
  if (input.tags !== undefined) form.set("tags", input.tags.join(","));
  if (input.image !== undefined) form.set("image", input.image);
  return form;
}

export const eventsApi = {
  list: (params: EventListParams = {}) =>
    api
      .getWithMeta<Event[], PageMeta>(`/events${buildQuery(params)}`, false)
      .then(({ data, meta }) => ({ events: data, meta })),

  // No `false` here (unlike list): if a token exists, sending it lets
  // the backend recognize the viewer as this event's organizer and
  // include the full attendee list. Works fine with no token too —
  // OptionalAuth on the backend never requires one.
  getById: (id: number) => api.get<EventDetail>(`/events/${id}`),

  getMine: () => api.get<Event[]>("/events/mine"),

  create: (input: CreateEventInput) =>
    api.post<Event>("/events", buildEventForm(input)),

  update: (id: number, input: UpdateEventInput) =>
    api.put<Event>(`/events/${id}`, buildEventForm(input)),

  delete: (id: number) => api.delete<null>(`/events/${id}`),
};
