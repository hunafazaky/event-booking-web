import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/routing/ProtectedRoute'
import OrganizerRoute from './components/routing/OrganizerRoute'
import HomePage from './pages/HomePage'
import EventDetailPage from './pages/EventDetailPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ProfilePage from './pages/ProfilePage'
import BookingsPage from './pages/BookingsPage'
import OrganizerDashboardPage from './pages/OrganizerDashboardPage'
import CreateEventPage from './pages/CreateEventPage'
import EditEventPage from './pages/EditEventPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public */}
        <Route index element={<HomePage />} />
        <Route path="events/:id" element={<EventDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />

        {/* Any signed-in user */}
        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="bookings" element={<BookingsPage />} />
        </Route>

        {/* Organizer/admin only */}
        <Route element={<OrganizerRoute />}>
          <Route path="organizer" element={<OrganizerDashboardPage />} />
          <Route path="organizer/new" element={<CreateEventPage />} />
          <Route path="organizer/:id/edit" element={<EditEventPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
