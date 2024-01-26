import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function handleUserInputInt(value, min = 0, max = 300) {
  const numericValue = parseInt(value, 10);
  if (!isNaN(numericValue)) {
    return Math.min(max, Math.max(min, numericValue));
  }
}
