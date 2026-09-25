import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { buttonVariants } from '@/components/ui/button'
import LanternsIllustration from './illustrations/LanternsIllustration'
import OrigamiIllustration from './illustrations/OrigamiIllustration'
import ConfettiIllustration from './illustrations/ConfettiIllustration'
import ToriiIllustration from './illustrations/ToriiIllustration'

const SLIDES = [LanternsIllustration, OrigamiIllustration, ConfettiIllustration, ToriiIllustration]
const INTERVAL_MS = 5000

// The first thing anyone sees, signed in or not — explains what this
// site actually is before asking anything of the visitor. The CTA
// below only shows for a signed-out visitor: a signed-in attendee
// doesn't need to be told to sign up, and an organizer already has
// their own dashboard link in the header.
export default function Hero() {
  const { user } = useAuth()
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length)
    }, INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-base border-2 border-border shadow-shadow">
      {/* Illustrations are stacked and crossfaded via opacity — only
          the active one is visible, but all four stay mounted so the
          transition doesn't pop/flash between them. */}
      <div className="absolute inset-0">
        {SLIDES.map((Illustration, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === active ? 1 : 0 }}
            aria-hidden={i !== active}
          >
            <Illustration />
          </div>
        ))}
        <div className="absolute inset-0 bg-white/50" />
      </div>

      <div className="relative px-6 py-12 sm:px-10 sm:py-16">
        <p className="inline-block rounded-base border-2 border-border bg-secondary-background px-3 py-1 text-sm font-heading">
          For the anime community
        </p>
        <h1 className="mt-4 max-w-2xl font-heading text-4xl leading-tight sm:text-5xl">
          Find your next convention, market, or meetup.
        </h1>
        <p className="mt-4 max-w-md font-base text-foreground/80">
          Conventions, doujin markets, screenings, cosplay contests, and game tournaments —
          posted by the community, for the community. Browse what's coming up, or start hosting
          your own.
        </p>

        {!user && (
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/signup" className={buttonVariants({ variant: 'default' })}>
              Sign Up
            </Link>
            <Link to="/login" className={buttonVariants({ variant: 'neutral' })}>
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
