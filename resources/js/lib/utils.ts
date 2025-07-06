import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format a date string in the format "Jul 6, 2025 01:00:01 A.M."
 * @param dateString - The date string to format
 * @param timezone - The timezone to use for formatting (defaults to user's timezone)
 * @returns Formatted date string
 */
export function formatDate(dateString: string, timezone?: string): string {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);

        // Check if the date is valid
        if (isNaN(date.getTime())) {
            return dateString;
        }

        const options: Intl.DateTimeFormatOptions = {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            timeZone: timezone
        };

        return new Intl.DateTimeFormat('en-US', options).format(date);
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

/**
 * Get the user's timezone from localStorage or use the default
 * @returns The user's timezone
 */
export function getUserTimezone(): string {
    // Try to get the timezone from localStorage first
    const storedTimezone = localStorage.getItem('reportTimezone');
    if (storedTimezone) {
        return storedTimezone;
    }

    // If not in localStorage, try to get from the user object in the window
    try {
        // @ts-ignore - Assuming window.user is set by the server
        const userTimezone = window.user?.timezone;
        if (userTimezone) {
            return userTimezone;
        }
    } catch (error) {
        console.error('Error getting user timezone:', error);
    }

    // Default to 'Europe/London' if no timezone is found
    return 'Europe/London';
}
