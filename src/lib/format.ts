import type { SyntheticEvent } from 'react'

// Ticket-stub date formatting — day number big, month abbreviation
// small and capitalized, mirroring how a physical event ticket or a
// tear-off calendar page shows a date. Locale is hardcoded to en-US
// for consistency; swap this if the app ever needs to localize.

export function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { day: '2-digit' })
}

export function formatMonth(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
}

export function formatFullDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

// Converts an RFC3339 string (from the API) into the local-time value
// an <input type="datetime-local"> expects ("YYYY-MM-DDTHH:mm") — used
// to prefill the edit form. The reverse direction (form -> API) is
// just `new Date(inputValue).toISOString()`, no helper needed.
export function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// Swaps a broken <img> (e.g. an ImageKit URL that 404s) for a
// placehold.co placeholder. Clears onerror first so a failing
// placeholder itself can't loop forever re-triggering this handler.
export function handleImageError(e: SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget
  img.onerror = null
  img.src = 'https://placehold.co/800x450?text=No+Image'
}
