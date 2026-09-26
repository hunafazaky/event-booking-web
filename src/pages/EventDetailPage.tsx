import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { eventsApi } from "../api/events";
import { bookingsApi } from "../api/bookings";
import type { EventDetail } from "../types/event";
import { CATEGORY_LABELS } from "../types/event";
import { ApiError } from "../lib/api";
import { formatFullDateTime, handleImageError } from "../lib/format";
import { useAuth } from "../context/AuthContext";
import LoadingState from "../components/ui/LoadingState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EventDetailPage() {
  const { id } = useParams();
  const eventId = Number(id);
  const { user } = useAuth();

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    eventsApi
      .getById(eventId)
      .then(setEvent)
      .catch((err) =>
        setError(
          err instanceof ApiError ? err.message : "Failed to load event.",
        ),
      )
      .finally(() => setLoading(false));
  }, [eventId]);

  if (loading) return <LoadingState label="Loading event…" />;
  if (error)
    return <p className="font-base text-warning-foreground">{error}</p>;
  if (!event) return null;

  const isOwnEvent = user?.id === event.user.id;

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2">
        <img
          src={event.image}
          alt={event.name}
          onError={handleImageError}
          className="aspect-video w-full rounded-base border-2 border-border object-cover shadow-shadow"
        />

        <div className="mt-4 flex items-center gap-2">
          <Badge>{CATEGORY_LABELS[event.category]}</Badge>
          <span className="text-sm font-base text-foreground/70">
            {event.attendee_count}{" "}
            {event.attendee_count === 1 ? "person" : "people"} going
          </span>
        </div>

        <h1 className="mt-2 font-heading text-3xl">{event.name}</h1>
        <p className="mt-1 font-base text-foreground/70">
          {formatFullDateTime(event.datetime)}
        </p>
        <p className="font-base text-foreground/70">{event.location}</p>

        {event.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {event.tags.map((tag) => (
              <Badge key={tag.id} variant="tag">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        <p className="mt-6 max-w-prose whitespace-pre-line font-base leading-relaxed">
          {event.description}
        </p>

        <p className="mt-6 text-sm font-base text-foreground/70">
          Organized by {event.user.name}
        </p>
      </div>

      <div className="md:col-span-1">
        <BookingBox event={event} isOwnEvent={isOwnEvent} signedIn={!!user} />
      </div>
    </div>
  );
}

// bookingsApi.create returns the full Booking shape (id, code, phone,
// event); event.your_booking is the reduced BookingSummary shape (id,
// code, phone, user) — different DTOs on the backend for different
// endpoints. This box only ever needs id + booking_code, so it uses
// the minimal shape both satisfy rather than picking one and fighting
// the other's type.
type BookingLite = { id: number; booking_code: string };

function BookingBox({
  event,
  isOwnEvent,
  signedIn,
}: {
  event: EventDetail;
  isOwnEvent: boolean;
  signedIn: boolean;
}) {
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Seeded from the server (event.your_booking) rather than starting
  // null every time — this is what fixes "still shows the booking
  // form after I already booked and came back to this page".
  const [booking, setBooking] = useState<BookingLite | null>(
    event.your_booking,
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const created = await bookingsApi.create({ phone, event_id: event.id });
      setBooking(created);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to book this event.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCancel() {
    if (!booking) return;
    if (!confirm("Cancel this booking?")) return;
    setSubmitting(true);
    setError(null);
    try {
      await bookingsApi.delete(booking.id);
      setBooking(null);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to cancel booking.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (isOwnEvent) {
    return (
      <Card>
        <CardContent>
          <p className="text-sm font-base text-foreground/70">
            This is your event.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!signedIn) {
    return (
      <Card>
        <CardContent>
          <p className="text-sm font-base">
            <Link to="/login" className="font-heading underline">
              Sign in
            </Link>{" "}
            to book this event.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (booking) {
    return (
      <Card>
        <CardContent className="flex flex-col gap-3">
          <div>
            <p className="font-heading">You're booked!</p>
            <p className="mt-1 text-sm font-base text-foreground/70">
              Booking code:{" "}
              <span className="font-mono text-foreground">
                {booking.booking_code}
              </span>
            </p>
          </div>

          {error && (
            <p className="text-sm font-base text-warning-foreground">{error}</p>
          )}

          <Button
            variant="warning"
            size="sm"
            onClick={handleCancel}
            disabled={submitting}
          >
            {submitting ? "Cancelling…" : "Cancel booking"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 08123456789"
              className="mt-1"
            />
          </div>

          {error && (
            <p className="text-sm font-base text-warning-foreground">{error}</p>
          )}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Booking…" : "Book This Event"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
