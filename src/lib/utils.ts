import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Standard shadcn/ui helper: merges conditional class names (clsx)
// then resolves conflicting Tailwind classes so the last one wins
// (twMerge) — e.g. cn('px-2', condition && 'px-4') correctly keeps
// only px-4 instead of emitting both.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
