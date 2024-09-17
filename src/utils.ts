import {
	addDay,
	addHour,
	addMinute,
	addMonth,
	addSecond,
	addYear,
	applyOffset,
	dayEnd,
	dayStart,
	diffDays,
	diffHours,
	diffMinutes,
	diffSeconds,
	hourEnd,
	hourStart,
	minuteEnd,
	minuteStart,
	monthEnd,
	monthStart,
	offset,
	removeOffset,
	sameYear,
	yearEnd,
	yearStart,
} from '@formkit/tempo';

export const resolutions = [
	'year',
	'month',
	'day',
	'hour',
	'minute',
	'second',
] as const;

export type Resolution = (typeof resolutions)[number];

type Brand<B extends string> = Record<`__${B}`, B>;
type Branded<T, B extends string> = T & Brand<B>;

type BoundedDate = Branded<Date, 'bounded'>;
type ZonedDate = Branded<Date, 'zoned'>;
export type AdjustedDate = BoundedDate & ZonedDate;

export function isSameYear(dateA: Date, dateB: Date) {
	return sameYear(dateA, dateB);
}
export function isSameMonth(dateA: Date, dateB: Date) {
	return diffDays(monthStart(dateA), monthStart(dateB)) === 0;
}
export function isSameDay(dateA: Date, dateB: Date) {
	return diffHours(dayStart(dateA), dayStart(dateB)) === 0;
}
export function isSameHour(dateA: Date, dateB: Date) {
	return diffMinutes(hourStart(dateA), hourStart(dateB)) === 0;
}
export function isSameMinute(dateA: Date, dateB: Date) {
	return diffSeconds(minuteStart(dateA), minuteStart(dateB)) === 0;
}
export function isSameSecond(dateA: Date, dateB: Date) {
	return diffSeconds(dateA, dateB) === 0;
}

/**
 *
 * @param date
 * @returns a Date object for the end of the given second
 */
function secondEnd(date: Date) {
	const copy = new Date(date);
	copy.setMilliseconds(999);
	return copy;
}
function secondStart(date: Date) {
	const copy = new Date(date);
	copy.setMilliseconds(0);
	return copy;
}

function getStartOfQuarter(date: Date) {
	const clone = new Date(date);
	const month = clone.getMonth();
	for (let monthIndex = 0; monthIndex < 12; monthIndex += 3) {
		if (month <= monthIndex + 2) {
			clone.setMonth(monthIndex);
			break;
		}
	}
	return monthStart(clone);
}
function getEndOfQuarter(date: Date) {
	const clone = new Date(date);
	const month = clone.getMonth();
	for (let monthIndex = 2; monthIndex < 12; monthIndex += 3) {
		if (month <= monthIndex) {
			clone.setMonth(monthIndex);
			break;
		}
	}
	return monthEnd(clone);
}

const MONTHS_IN_QUARTER = 3;
export function getQuarter(date: Date) {
	const month = date.getMonth();
	return Math.floor(month / MONTHS_IN_QUARTER);
}
export function isSameQuarter(dateA: Date, dateB: Date) {
	return isSameYear(dateA, dateB) && getQuarter(dateA) === getQuarter(dateB);
}

export function fulfillsResolution(
	resolution: Resolution,
	resolutionToFulfill: Resolution,
) {
	return (
		resolutions.indexOf(resolution) >= resolutions.indexOf(resolutionToFulfill)
	);
}
/**
 * Example Jan 1 yearA - Dec 31 yearB
 * @param from
 * @param to
 * @returns
 */
function isFullYears(
	from: Date,
	to: Date,
	{ resolution }: { resolution: Resolution },
): boolean {
	return isStartOfYear(from, { resolution }) && isEndOfYear(to, { resolution });
}
export function isStartOfYear(
	date: Date,
	{ resolution }: { resolution: Resolution },
): boolean {
	return isSameDate(yearStart(date), date, { resolution });
}
export function isEndOfYear(
	date: Date,
	{ resolution }: { resolution: Resolution },
): boolean {
	return isSameDate(yearEnd(date), date, { resolution });
}
export function isSameDate(
	dateA: Date,
	dateB: Date,
	{ resolution }: { resolution: Resolution },
): boolean {
	switch (resolution) {
		case 'year': {
			return isSameYear(dateA, dateB);
		}
		case 'month': {
			return isSameMonth(dateA, dateB);
		}
		case 'day': {
			return isSameDay(dateA, dateB);
		}
		case 'hour': {
			return isSameHour(dateA, dateB);
		}
		case 'minute': {
			return isSameMinute(dateA, dateB);
		}
		case 'second': {
			return isSameSecond(dateA, dateB);
		}
	}
}
/**
 * Example Apr 1 yearA - Sep 30 yearB
 * @param from
 * @param to
 * @returns
 */
function isFullQuarters(
	from: Date,
	to: Date,
	{ resolution }: { resolution: Resolution },
) {
	return (
		isStartOfQuarter(from, { resolution }) && isEndOfQuarter(to, { resolution })
	);
}

function isStartOfQuarter(
	date: Date,
	{ resolution }: { resolution: Resolution },
) {
	return isSameDate(getStartOfQuarter(date), date, { resolution });
}

function isEndOfQuarter(
	date: Date,
	{ resolution }: { resolution: Resolution },
) {
	return isSameDate(getEndOfQuarter(date), date, { resolution });
}
function isFullMonths(
	from: Date,
	to: Date,
	{ resolution }: { resolution: Resolution },
) {
	return (
		isStartOfMonth(from, { resolution }) && isEndOfMonth(to, { resolution })
	);
}
export function isStartOfMonth(
	date: Date,
	{ resolution }: { resolution: Resolution },
) {
	return isSameDate(monthStart(date), date, { resolution });
}

export function isEndOfMonth(
	date: Date,
	{ resolution }: { resolution: Resolution },
): boolean {
	return isSameDate(monthEnd(date), date, { resolution });
}

export function toZonedDate(date: Date, timeZone: string | undefined) {
	if (!timeZone) {
		return date as ZonedDate;
	}
	const offsetToTimezone = offset(date, timeZone);
	const adjusted = removeOffset(date, offsetToTimezone);
	return adjusted as ZonedDate;
}

export function startOf(date: Date, resolution: Resolution) {
	switch (resolution) {
		case 'year':
			return yearStart(date);
		case 'month':
			return monthStart(date);
		case 'day':
			return dayStart(date);
		case 'hour':
			return hourStart(date);
		case 'minute':
			return minuteStart(date);
		case 'second':
			return secondStart(date);
	}
}
export function endOf(date: Date, resolution: Resolution) {
	switch (resolution) {
		case 'year':
			return yearEnd(date);
		case 'month':
			return monthEnd(date);
		case 'day':
			return dayEnd(date);
		case 'hour':
			return hourEnd(date);
		case 'minute':
			return minuteEnd(date);
		case 'second':
			return secondEnd(date);
	}
}

export function lowerResolution(resolution: Resolution) {
	const foundIndex = resolutions.indexOf(resolution);
	const adjustedIndex = foundIndex ? foundIndex - 1 : foundIndex;
	const lowered = resolutions[adjustedIndex] ?? resolutions[0];
	return lowered;
}
export function addResolution(
	date: Date,
	resolution: Resolution,
	amount: number,
) {
	switch (resolution) {
		case 'year':
			return addYear(date, amount);
		case 'month':
			return addMonth(date, amount);
		case 'day':
			return addDay(date, amount);
		case 'hour':
			return addHour(date, amount);
		case 'minute':
			return addMinute(date, amount);
		case 'second':
			return addSecond(date, amount);
	}
}

export function isStartOfDay(
	date: Date,
	{ resolution }: { resolution: Resolution },
) {
	return isSameDate(dayStart(date), date, { resolution });
}

export function isStartOfHour(
	date: Date,
	{ resolution }: { resolution: Resolution },
) {
	return isSameDate(hourStart(date), date, { resolution });
}
export function isStartOfMinute(
	date: Date,
	{ resolution }: { resolution: Resolution },
) {
	return isSameDate(minuteStart(date), date, { resolution });
}
export function isEndOfHour(
	date: Date,
	{ resolution }: { resolution: Resolution },
) {
	return isSameDate(hourEnd(date), date, { resolution });
}
export function isEndOfMinute(
	date: Date,
	{ resolution }: { resolution: Resolution },
) {
	return isSameDate(minuteEnd(date), date, { resolution });
}

export function isEndOfDay(
	date: Date,
	{ resolution }: { resolution: Resolution },
) {
	return isSameDate(dayEnd(date), date, { resolution });
}

export function removeZoned({
	originalDate,
	zonedDate,
	timeZone,
}: { originalDate: Date; zonedDate: ZonedDate; timeZone: string | undefined }) {
	if (!timeZone) {
		return zonedDate;
	}
	const offsetToTimezone = offset(originalDate, timeZone);
	return applyOffset(zonedDate, offsetToTimezone);
}
export function getRangeType(
	from: Date,
	to: Date,
	options: { resolution: Resolution },
) {
	const { resolution } = options;

	const sameDay = isSameDay(from, to);
	const sameMonth = isSameMonth(from, to);
	const sameYear = isSameYear(from, to);
	if (isFullYears(from, to, { resolution })) {
		return 'fullYears';
	}
	if (isFullQuarters(from, to, { resolution: resolution })) {
		return 'fullQuarters';
	}
	if (isFullMonths(from, to, { resolution: resolution })) {
		return 'fullMonths';
	}
	if (sameDay && fulfillsResolution(resolution, 'day')) {
		return 'sameDay';
	}
	if (sameMonth && fulfillsResolution(resolution, 'month')) {
		return 'sameMonth';
	}
	if (sameYear) {
		return 'sameYear';
	}
	return undefined;
}
