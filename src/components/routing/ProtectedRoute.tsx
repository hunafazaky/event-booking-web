import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingState from '../ui/LoadingState'

// Wraps a set of routes (via <Route element={<ProtectedRoute />}>) that
// require ANY signed-in user. For organizer-only routes, see
// OrganizerRoute below — it builds on this same pattern with an
// extra role check.
export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Still checking whether a saved token is valid. A brief loading
  // state here reads better than either a blank flash or bouncing to
  // /login and straight back once the check resolves.
  if (loading) return <LoadingState />

  if (!user) {
    // `state` carries where the person was headed, so LoginPage can
    // send them back there after a successful sign-in instead of
    // always landing on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
