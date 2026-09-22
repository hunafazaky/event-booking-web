import type { Event } from './event'

/** Mirrors internal/dto.BookingResponse. */
export interface Booking {
  id: number
  booking_code: string
  phone: string
  event: Event
}
