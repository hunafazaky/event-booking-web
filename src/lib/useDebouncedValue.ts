import { useEffect, useState } from 'react'

// Delays updating the returned value until `value` has stopped
// changing for `delayMs` — used on the search box so typing doesn't
// fire a request on every keystroke.
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timeout)
  }, [value, delayMs])

  return debounced
}
