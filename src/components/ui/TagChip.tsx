// Tags always render in soft violet — see CategoryBadge for why the
// color pairing matters here.
export default function TagChip({ name }: { name: string }) {
  return (
    <span className="inline-block rounded-full bg-violet-soft px-2.5 py-1 text-xs font-medium text-violet">
      {name}
    </span>
  )
}
