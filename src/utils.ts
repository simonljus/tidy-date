import { dayStart, diffDays, diffHours, diffMinutes, diffSeconds, minuteStart, monthStart, yearStart } from "@formkit/tempo";

export function isSameMonth(dateA: Date, dateB: Date) {
	return diffDays(monthStart(dateA), monthStart(dateB)) === 0;
}
export function isSameYear(dateA: Date, dateB: Date) {
	return diffDays(yearStart(dateA), yearStart(dateB)) === 0;
}
export function isSameDay(dateA: Date, dateB: Date) {
	return diffHours(dayStart(dateA), dayStart(dateB)) === 0;
}
export function isSameMinute(dateA: Date, dateB: Date) {
	return diffMinutes(minuteStart(dateA), minuteStart(dateB)) === 0;
}
export function isSameSecond(dateA: Date, dateB: Date) {
	return diffSeconds(dateA, dateB) === 0;
}

/**
 *
 * @param date
 * @returns a Date object for the end of the given second
 */
export function secondEnd(date: Date) {
	const copy = new Date(date);
	copy.setMilliseconds(999);
	return copy;
}
export function secondStart(date: Date) {
	const copy = new Date(date);
	copy.setMilliseconds(0);
	return copy;
}