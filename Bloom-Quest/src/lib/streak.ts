import { differenceInCalendarDays, isSameDay, subDays } from 'date-fns';

/**
 * Updates the user's streak based on their activity.
 * Returns the new streak and lastActiveDate.
 */
export function calculateStreak(currentStreak: number, lastActiveDate: Date | string): { streak: number, lastActiveDate: Date } {
    const today = new Date();
    const lastActive = new Date(lastActiveDate);

    // If active today, no change in streak count, but ensure date is today (though it might already be)
    if (isSameDay(today, lastActive)) {
        return { streak: currentStreak, lastActiveDate: today };
    }

    // If active yesterday, increment streak
    if (isSameDay(subDays(today, 1), lastActive)) {
        return { streak: currentStreak + 1, lastActiveDate: today };
    }

    // If gap is larger than 1 day, reset streak to 1 (since they are active *now*)
    // Note: This function is called when a user performs an action (activity).
    // So if they were last active 5 days ago, and they do something today, streak becomes 1.
    return { streak: 1, lastActiveDate: today };
}

/**
 * Checks if the streak is broken (for display purposes on load, without updating DB yet)
 * Use this when just showing the User's state, but not performing an action.
 */
export function getDisplayStreak(currentStreak: number, lastActiveDate: Date | string): number {
    const today = new Date();
    const lastActive = new Date(lastActiveDate);

    if (isSameDay(today, lastActive) || isSameDay(subDays(today, 1), lastActive)) {
        return currentStreak;
    }

    return 0;
}
