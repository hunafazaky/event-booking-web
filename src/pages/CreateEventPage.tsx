import { useNavigate } from "react-router-dom";
import { eventsApi } from "../api/events";
import EventForm, {
  type EventFormValues,
} from "../components/events/EventForm";
import type { Category } from "../types/event";

export default function CreateEventPage() {
  const navigate = useNavigate();

  async function handleSubmit(values: EventFormValues, image: File | null) {
    // EventForm already validated category is chosen and image exists
    // (imageRequired=true below) before calling this.
    await eventsApi.create({
      name: values.name,
      description: values.description,
      location: values.location,
      datetime: new Date(values.datetimeLocal).toISOString(),
      category: values.category as Category,
      tags: values.tags,
      image: image!,
    });
    navigate("/organizer");
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-heading text-2xl">Create Event</h1>
      <div className="mt-6">
        <EventForm
          imageRequired
          submitLabel="Create Event"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
