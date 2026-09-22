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
