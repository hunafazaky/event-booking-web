import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// The first thing anyone sees, signed in or not — explains what this
// site actually is before asking anything of the visitor. The CTA
// below only shows for a signed-out visitor: a signed-in attendee
// doesn't need to be told to sign up, and an organizer already has
// their own dashboard link in the header.
export default function Hero() {
  const { user } = useAuth()

  return (
    <div className="border-b border-ink pb-10">
      <p className="font-semibold text-crimson">For the anime community</p>
      <h1 className="mt-2 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
        Find your next convention, market, or meetup.
      </h1>
      <p className="mt-4 max-w-md text-ink-muted">
        Conventions, doujin markets, screenings, cosplay contests, and game tournaments — posted
        by the community, for the community. Browse what's coming up, or start hosting your own.
      </p>

      {!user && (
        <div className="mt-6 flex gap-3">
          <Link to="/signup" className="rounded-full bg-crimson px-5 py-2.5 font-medium text-white">
            Sign Up
          </Link>
          <Link
            to="/login"
            className="rounded-full border border-ink px-5 py-2.5 font-medium text-ink"
          >
            Sign In
          </Link>
        </div>
      )}
    </div>
  )
}
