import { Link } from 'react-router-dom'

interface EmptyStateProps {
  message: string
  action?: { label: string; to: string }
}

// Consistent "nothing here yet" block. The dashed border echoes the
// ticket-stub perforation used on EventCard — same visual language,
// not a new one introduced just for this.
export default function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="rounded-base border-2 border-dashed border-border py-12 text-center font-base text-foreground/70">
      <p>{message}</p>
      {action && (
        <Link to={action.to} className="mt-2 inline-block font-heading underline">
          {action.label}
        </Link>
      )}
    </div>
  )
}
