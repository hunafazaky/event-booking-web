import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { buttonVariants } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

// Plain helper (not shaped like NavLink's render-prop signature) so it
// can be called from both the desktop nav and the mobile sheet without
// fighting React Router's own type for the className render-prop.
function navLinkClass(isActive: boolean) {
  return cn('font-heading text-sm', isActive ? 'text-foreground' : 'text-foreground/60')
}

// The shared shell every route renders inside — header nav + footer,
// with <Outlet /> standing in for whichever page matched the current
// URL. This is where auth-aware UI (showing different nav links
// signed in vs out) lives, so individual pages don't each have to
// check `user` just to decide what the header should say.
export default function Layout() {
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  function handleSignOut() {
    closeMenu()
    signOut()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b-2 border-border bg-secondary-background">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/" className="font-heading text-lg">
            AdaMatsuri
          </Link>

          {/* Desktop nav — hidden below sm, the Sheet below covers mobile instead */}
          <div className="hidden items-center gap-6 sm:flex">
            <NavLink to="/" className={({ isActive }) => navLinkClass(isActive)}>
              Events
            </NavLink>

            {(user?.role === 'organizer' || user?.role === 'admin') && (
              <NavLink to="/organizer" className={({ isActive }) => navLinkClass(isActive)}>
                My Events
              </NavLink>
            )}

            {user ? (
              <>
                <NavLink to="/bookings" className={({ isActive }) => navLinkClass(isActive)}>
                  My Bookings
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => navLinkClass(isActive)}>
                  {user.name}
                </NavLink>
                <button onClick={signOut} className="font-heading text-sm text-foreground/60">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="font-heading text-sm text-foreground/60">
                  Sign In
                </Link>
                <Link to="/signup" className={buttonVariants({ size: 'sm' })}>
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger + drawer */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              className={cn(buttonVariants({ variant: 'neutral', size: 'icon' }), 'sm:hidden')}
            >
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-3/4 sm:hidden">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-5 px-4">
                <NavLink
                  to="/"
                  onClick={closeMenu}
                  className={({ isActive }) => navLinkClass(isActive)}
                >
                  Events
                </NavLink>

                {(user?.role === 'organizer' || user?.role === 'admin') && (
                  <NavLink
                    to="/organizer"
                    onClick={closeMenu}
                    className={({ isActive }) => navLinkClass(isActive)}
                  >
                    My Events
                  </NavLink>
                )}

                {user ? (
                  <>
                    <NavLink
                      to="/bookings"
                      onClick={closeMenu}
                      className={({ isActive }) => navLinkClass(isActive)}
                    >
                      My Bookings
                    </NavLink>
                    <NavLink
                      to="/profile"
                      onClick={closeMenu}
                      className={({ isActive }) => navLinkClass(isActive)}
                    >
                      {user.name}
                    </NavLink>
                    <button
                      onClick={handleSignOut}
                      className="text-left font-heading text-sm text-foreground/60"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="font-heading text-sm text-foreground/60"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={closeMenu}
                      className={buttonVariants({ className: 'w-fit' })}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <Outlet />
      </main>

      <footer className="border-t-2 border-border px-4 py-6 text-center text-sm text-foreground/60">
        Built by Zaky — a portfolio project for the anime community.
      </footer>
    </div>
  )
}
