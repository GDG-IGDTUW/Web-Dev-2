import { differenceInCalendarDays } from 'date-fns';

// Withering configuration
export const WITHERING_CONFIG = {
    INACTIVITY_THRESHOLD_DAYS: 3, // Plant starts withering after 3 days
    XP_PENALTY_PER_DAY: 50, // 50 XP penalty per day of inactivity
};

/**
 * Checks if a user's plant should be withered based on lastActiveDate
 * and calculates XP penalty if applicable.
 * 
 * @param lastActiveDate - The user's last active date
 * @param currentXp - The user's current XP
 * @returns Object containing isWithered status and new XP value
 */
export function checkWithering(lastActiveDate: Date | string, currentXp: number): { 
    isWithered: boolean; 
    newXp: number; 
    daysInactive: number 
} {
    const today = new Date();
    const lastActive = new Date(lastActiveDate);
    const daysInactive = differenceInCalendarDays(today, lastActive);

    // If user was active recently (within threshold), no withering
    if (daysInactive < WITHERING_CONFIG.INACTIVITY_THRESHOLD_DAYS) {
        return {
            isWithered: false,
            newXp: currentXp,
            daysInactive: 0
        };
    }

    // Calculate days over the threshold
    const daysOverThreshold = daysInactive - WITHERING_CONFIG.INACTIVITY_THRESHOLD_DAYS;
    
    // Calculate XP penalty
    const xpPenalty = daysOverThreshold * WITHERING_CONFIG.XP_PENALTY_PER_DAY;
    const newXp = Math.max(0, currentXp - xpPenalty); // XP can't go below 0

    return {
        isWithered: true,
        newXp,
        daysInactive
    };
}

/**
 * Resets the withering state when user becomes active again
 */
export function resetWithering() {
    return {
        isWithered: false,
        lastActiveDate: new Date()
    };
}