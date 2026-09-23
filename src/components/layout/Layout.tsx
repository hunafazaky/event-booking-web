import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// The shared shell every route renders inside — header nav + footer,
// with <Outlet /> standing in for whichever page matched the current
// URL. This is where auth-aware UI (showing different nav links
// signed in vs out) lives, so individual pages don't each have to
// check `user` just to decide what the header should say.
export default function Layout() {
  const { user, signOut } = useAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-ink">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/" className="font-display text-lg">
            Anime Events
          </Link>

          <div className="flex items-center gap-6 text-sm font-medium">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'text-crimson' : 'text-ink-muted')}
            >
              Events
            </NavLink>

            {user?.role === 'organizer' || user?.role === 'admin' ? (
              <NavLink
                to="/organizer"
                className={({ isActive }) => (isActive ? 'text-crimson' : 'text-ink-muted')}
              >
                My Events
              </NavLink>
            ) : null}

            {user ? (
              <>
                <NavLink
                  to="/bookings"
                  className={({ isActive }) => (isActive ? 'text-crimson' : 'text-ink-muted')}
                >
                  My Bookings
                </NavLink>
                <NavLink
                  to="/profile"
                  className={({ isActive }) => (isActive ? 'text-crimson' : 'text-ink-muted')}
                >
                  {user.name}
                </NavLink>
                <button onClick={signOut} className="cursor-pointer text-ink-muted">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="text-ink-muted">
                  Sign In
                </NavLink>
                <NavLink
                  to="/signup"
                  className="rounded-full bg-crimson px-4 py-1.5 text-white"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <Outlet />
      </main>

      <footer className="border-t border-line px-4 py-6 text-center text-sm text-ink-muted">
        Built by Zaky — a portfolio project for anime-community events.
      </footer>
    </div>
  )
}
