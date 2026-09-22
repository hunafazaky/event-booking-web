import { useParams } from 'react-router-dom'

export default function EventDetailPage() {
  const { id } = useParams()
  return <p>Event #{id} detail goes here.</p>
}
