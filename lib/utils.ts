import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string to a more readable format
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "No date"

  const date = new Date(dateString)

  // Check if date is valid
  if (isNaN(date.getTime())) return "Invalid date"

  // Format: Month Day, Year (e.g., "Jan 1, 2023")
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

/**
 * Format milliseconds to a time string (HH:MM:SS)
 * @param ms - Milliseconds to format
 * @returns Formatted time string
 */
export function formatTime(ms: number): string {
  if (!ms) return "00:00:00"

  // Convert milliseconds to seconds
  let seconds = Math.floor(ms / 1000)

  // Calculate hours, minutes, and remaining seconds
  const hours = Math.floor(seconds / 3600)
  seconds %= 3600
  const minutes = Math.floor(seconds / 60)
  seconds %= 60

  // Format with leading zeros
  const formattedHours = String(hours).padStart(2, "0")
  const formattedMinutes = String(minutes).padStart(2, "0")
  const formattedSeconds = String(seconds).padStart(2, "0")

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}

/**
 * Format a date string to include date and time
 * @param dateString - The date string to format
 * @returns Formatted date and time string
 */
export function formatDateTime(dateString: string): string {
  if (!dateString) return "No date"

  const date = new Date(dateString)

  // Check if date is valid
  if (isNaN(date.getTime())) return "Invalid date"

  // Format: Month Day, Year at HH:MM (e.g., "Jan 1, 2023 at 14:30")
  return (
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    " at " +
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  )
}
