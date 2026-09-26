import type { Tag } from "./tag";

/** Mirrors internal/model.Role's three constants. */
export type Role = "attendee" | "organizer" | "admin";

/** Mirrors internal/dto.UserResponse. */
export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  interests: Tag[];
}
