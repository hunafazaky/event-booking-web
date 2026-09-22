import { useId, useState, type KeyboardEvent } from 'react'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[]
  placeholder?: string
}

// A chip-style tag editor: type a name, press Enter or comma to add
// it as a chip; Backspace on an empty input removes the last chip.
// `suggestions` (existing tag names from the backend) power a native
// <datalist> autocomplete, but typing any new name works too — tags
// are find-or-create on the backend, so there's no "invalid tag".
export default function TagInput({ value, onChange, suggestions = [], placeholder }: TagInputProps) {
  const [draft, setDraft] = useState('')
  const listId = useId()

  function addTag(raw: string) {
    const name = raw.trim()
    if (!name) return
    const exists = value.some((t) => t.toLowerCase() === name.toLowerCase())
    if (!exists) onChange([...value, name])
    setDraft('')
  }

  function removeTag(name: string) {
    onChange(value.filter((t) => t !== name))
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(draft)
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  return (
    <div className="rounded-lg border border-ink p-2">
      <div className="flex flex-wrap gap-1.5">
        {value.map((name) => (
          <span
            key={name}
            className="flex items-center gap-1 rounded-full bg-violet-soft px-2.5 py-1 text-xs font-medium text-violet"
          >
            {name}
            <button
              type="button"
              onClick={() => removeTag(name)}
              aria-label={`Remove ${name}`}
              className="text-violet/70 hover:text-violet"
            >
              ×
            </button>
          </span>
        ))}

        <input
          list={listId}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addTag(draft)}
          placeholder={value.length === 0 ? placeholder : undefined}
          className="min-w-32 flex-1 px-1 py-1 text-sm outline-none"
        />
        <datalist id={listId}>
          {suggestions.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>
    </div>
  )
}
