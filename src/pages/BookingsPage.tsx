import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { bookingsApi } from "../api/bookings";
import type { Booking } from "../types/booking";
import { ApiError } from "../lib/api";
import { formatFullDateTime } from "../lib/format";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    bookingsApi
      .list()
      .then(setBookings)
      .catch((err) =>
        setError(
          err instanceof ApiError
            ? err.message
            : "Failed to load your bookings.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  async function handleCancel(id: number) {
    setCancellingId(id);
    try {
      await bookingsApi.delete(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to cancel booking.",
      );
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl">My Bookings</h1>

      {loading && <LoadingState />}
      {error && (
        <p className="mt-6 font-base text-warning-foreground">{error}</p>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="mt-6">
          <EmptyState
            message="You haven't booked anything yet."
            action={{ label: "Browse events", to: "/" }}
          />
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col gap-3 rounded-base border-2 border-border bg-secondary-background p-4 shadow-shadow sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <Link
                  to={`/events/${booking.event.id}`}
                  className="font-heading hover:underline"
                >
                  {booking.event.name}
                </Link>
                <p className="mt-1 text-sm font-base text-foreground/70">
                  {formatFullDateTime(booking.event.datetime)}
                </p>
                <p className="text-sm font-base text-foreground/70">
                  {booking.event.location}
                </p>
                <p className="mt-1 text-sm font-base">
                  Booking code:{" "}
                  <span className="font-mono">{booking.booking_code}</span>
                </p>
              </div>

              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button
                      variant="warning"
                      size="sm"
                      disabled={cancellingId === booking.id}
                      className="flex-none"
                    >
                      {cancellingId === booking.id ? "Cancelling…" : "Cancel"}
                    </Button>
                  }
                />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Your spot at "{booking.event.name}" will be released.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep booking</AlertDialogCancel>
                    <AlertDialogAction
                      variant="warning"
                      onClick={() => handleCancel(booking.id)}
                    >
                      Cancel Booking
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
