import { CATEGORY_LABELS, type Category } from '../../types/event'

// Category always renders in ink/white — a solid, opaque badge — so
// its look is visually distinct from TagChip's soft-violet treatment.
// That contrast IS the signal for "this is the event's kind, not a
// fandom label" — no legend needed once you've seen it twice.
export default function CategoryBadge({ category }: { category: Category }) {
  return (
    <span className="inline-block rounded-full bg-ink px-2.5 py-1 text-xs font-medium text-white">
      {CATEGORY_LABELS[category]}
    </span>
  )
}
