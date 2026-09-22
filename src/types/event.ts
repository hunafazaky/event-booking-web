import type { Tag } from './tag'
import type { User } from './user'

/** Mirrors internal/model.Category's six constants. */
export type Category =
  | 'convention'
  | 'doujin_market'
  | 'screening'
  | 'cosplay_contest'
  | 'game_tournament'
  | 'meetup'

// Paired with the type above for building <select> options — keeping
// one source of truth for "every category" instead of listing them
// again wherever a dropdown is needed.
export const CATEGORIES: Category[] = [
  'convention',
  'doujin_market',
  'screening',
  'cosplay_contest',
  'game_tournament',
  'meetup',
]

/** Human-readable label for a category value, e.g. for a <select>. */
export const CATEGORY_LABELS: Record<Category, string> = {
  convention: 'Convention',
  doujin_market: 'Doujin Market',
  screening: 'Screening',
  cosplay_contest: 'Cosplay Contest',
  game_tournament: 'Game Tournament',
  meetup: 'Meetup',
}

/** Mirrors internal/dto.EventResponse. */
export interface Event {
  id: number
  name: string
  description: string
  location: string
  image: string
  datetime: string // RFC3339 — parse with `new Date(...)` when displaying
  category: Category
  tags: Tag[]
  user: User
  created_at: string
}

/** Mirrors internal/dto.BookingSummaryResponse. */
export interface BookingSummary {
  id: number
  booking_code: string
  phone: string
  user: User
}

/** Mirrors internal/dto.EventDetailResponse. */
export interface EventDetail extends Event {
  bookings: BookingSummary[]
}
