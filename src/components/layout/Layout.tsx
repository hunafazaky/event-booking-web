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
      <header className="border-b border-slate-200">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="font-semibold">
            Anime Events
          </Link>

          <div className="flex items-center gap-4 text-sm">
            <NavLink to="/">Events</NavLink>

            {user?.role === 'organizer' || user?.role === 'admin' ? (
              <NavLink to="/organizer">My Events</NavLink>
            ) : null}

            {user ? (
              <>
                <NavLink to="/profile">{user.name}</NavLink>
                <button onClick={signOut} className="cursor-pointer">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Sign In</NavLink>
                <NavLink to="/signup">Sign Up</NavLink>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
        Built by Zaky — a portfolio project for anime-community events.
      </footer>
    </div>
  )
}
