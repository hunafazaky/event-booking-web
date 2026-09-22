/**
 * Mirrors internal/response.Envelope on the backend — every API
 * response, success or failure, has this shape. `data`/`meta` are
 * only present on success; `error` is only present on failure.
 */
export interface Envelope<T> {
  success: boolean
  message?: string
  data?: T
  meta?: unknown
  error?: string
}

/** Mirrors internal/dto.EventListMeta. */
export interface PageMeta {
  page: number
  limit: number
  total_rows: number
  total_page: number
}
