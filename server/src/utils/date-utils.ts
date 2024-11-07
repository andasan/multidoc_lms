export interface FormattedDate {
    year: string;
    month: string;
    day: string;
}

/**
 * Calculates a business date that is a specified number of days before a given date
 * If the calculated date falls on a weekend, it moves to the previous Friday
 * @param date - The reference date string
 * @param daysBack - Number of days to go back (default: 20)
 * @returns Formatted date object with year, month, and day
 */
export const calculateBusinessDate = (date: string | Date, daysBack: number = 20): FormattedDate => {
    const targetDate = new Date(date);
    targetDate.setDate(targetDate.getDate() - daysBack);
    
    // If it's a weekend, move to the previous Friday
    const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 6 = Saturday
    if (dayOfWeek === 0) { // Sunday
        targetDate.setDate(targetDate.getDate() - 2);
    } else if (dayOfWeek === 6) { // Saturday
        targetDate.setDate(targetDate.getDate() - 1);
    }
    
    return {
        year: targetDate.getFullYear().toString().slice(-2),
        month: (targetDate.getMonth() + 1).toString().padStart(2, '0'),
        day: targetDate.getDate().toString().padStart(2, '0')
    };
};

/**
 * Formats a date object into a string in the format "YYMMDD"
 * @param date FormattedDate object
 * @returns Formatted date string
 */
export const formatDateToString = (date: FormattedDate): string => {
    return `${date.year}${date.month}${date.day}`;
};