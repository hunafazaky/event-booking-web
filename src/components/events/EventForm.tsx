import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { CATEGORIES, CATEGORY_LABELS, type Category } from '../../types/event'
import { tagsApi } from '../../api/tags'
import { ApiError } from '../../lib/api'
import { handleImageError } from '../../lib/format'
import TagInput from '../ui/TagInput'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export interface EventFormValues {
  name: string
  description: string
  location: string
  datetimeLocal: string // <input type="datetime-local"> value — local time, no timezone
  category: Category | ''
  tags: string[]
}

interface EventFormProps {
  initialValues?: Partial<EventFormValues>
  initialImageUrl?: string
  // True for create (an event needs an image from the start), false
  // for edit (keep the existing image unless a new one is chosen).
  imageRequired?: boolean
  submitLabel: string
  onSubmit: (values: EventFormValues, image: File | null) => Promise<void>
}

// Shared by CreateEventPage and EditEventPage — same fields either
// way, they just differ in what's prefilled and whether an image is
// mandatory. The parent page owns what onSubmit actually does
// (create vs update + where to navigate after).
export default function EventForm({
  initialValues,
  initialImageUrl,
  imageRequired = false,
  submitLabel,
  onSubmit,
}: EventFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [location, setLocation] = useState(initialValues?.location ?? '')
  const [datetimeLocal, setDatetimeLocal] = useState(initialValues?.datetimeLocal ?? '')
  const [category, setCategory] = useState<Category | ''>(initialValues?.category ?? '')
  const [tags, setTags] = useState<string[]>(initialValues?.tags ?? [])

  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(initialImageUrl ?? null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    tagsApi
      .list()
      .then((tags) => setSuggestions(tags.map((t) => t.name)))
      .catch(() => {})
  }, [])

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setImage(file)
    if (file) setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (imageRequired && !image) {
      setError('Please choose an image.')
      return
    }
    if (!category) {
      setError('Please choose a category.')
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      await onSubmit({ name, description, location, datetimeLocal, category, tags }, image)
      // On success the parent navigates away — no need to reset
      // `submitting` here, the form is about to unmount.
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="name">Event name</Label>
        <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="datetime">Date &amp; time</Label>
        <Input
          id="datetime"
          type="datetime-local"
          required
          value={datetimeLocal}
          onChange={(e) => setDatetimeLocal(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label>Category</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Button
              key={c}
              type="button"
              variant={category === c ? 'default' : 'neutral'}
              size="sm"
              onClick={() => setCategory(c)}
            >
              {CATEGORY_LABELS[c]}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label>Fandom tags</Label>
        <div className="mt-2">
          <TagInput
            value={tags}
            onChange={setTags}
            suggestions={suggestions}
            placeholder="e.g. Jujutsu Kaisen, shounen"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="image">
          Event image{imageRequired ? '' : ' (leave blank to keep the current one)'}
        </Label>
        {preview && (
          <img
            src={preview}
            alt=""
            onError={handleImageError}
            className="mt-2 aspect-video w-full rounded-base border-2 border-border object-cover"
          />
        )}
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-2 w-full text-sm font-base"
        />
      </div>

      {error && <p className="text-sm font-base text-warning-foreground">{error}</p>}

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Saving…' : submitLabel}
      </Button>
    </form>
  )
}
