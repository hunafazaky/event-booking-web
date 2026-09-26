import { api } from "../lib/api";
import type { Booking } from "../types/booking";

export interface CreateBookingInput {
  phone: string;
  event_id: number;
}

export const bookingsApi = {
  create: (input: CreateBookingInput) => api.post<Booking>("/bookings", input),
  list: () => api.get<Booking[]>("/bookings"),
  delete: (id: number) => api.delete<null>(`/bookings/${id}`),
};
