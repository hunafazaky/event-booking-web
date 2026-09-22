import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { user } = useAuth()
  return <p>Profile for {user?.name} — favorite series editor goes here.</p>
}
