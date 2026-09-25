import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingState from '../ui/LoadingState'

// Same idea as ProtectedRoute, but for the organizer dashboard — only
// 'organizer' and 'admin' get past this one. A signed-in attendee is
// sent home rather than to /login, since logging in again wouldn't
// change anything for them.
export default function OrganizerRoute() {
  const { user, loading } = useAuth()

  if (loading) return <LoadingState />

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'organizer' && user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
