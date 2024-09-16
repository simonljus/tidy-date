import { addDay, addHour, addMinute, addMonth, addSecond, addYear, dayEnd, dayStart, hourEnd, hourStart, minuteEnd, minuteStart, monthEnd, monthStart, offset, removeOffset, yearEnd, yearStart } from "@formkit/tempo";
import { getEndOfQuarter, getStartOfQuarter, isSameDay, isSameMinute, isSameMonth, isSameSecond, isSameYear, secondEnd, secondStart } from "./utils.js";

export const resolutions = [
	'year',
	'month',
	'day',
	'hour',
	'minute',
	'second',
] as const;
const rangeTypes = [
	'fullYears',
	'fullQuarters',
	'fullMonths',
	'sameDay',
	'sameMonth',
	'sameYear',
] as const;
type Brand<B extends string> = Record<`__${B}`, B>;
type Branded<T, B extends string> = T & Brand<B>;

type BoundedDate = Branded<Date, 'bounded'>;
type ZonedDate = Branded<Date, 'zoned'>;
type AdjustedDate = BoundedDate & ZonedDate;
export type Resolution = typeof resolutions[number]
export type RangeType = typeof rangeTypes[number]
export type RangeFormatOptions = {
	/**
	 * Display the date(s) with locale
	 */
	locale: Intl.LocalesArgument;
	/**
	 * The timezone of the event, show the timezone or not
	 */
	timeZoneOptions?: { timeZone: string; show: boolean };

	/**
	 * Only display dates with Intl format
	 */
	onlyIntl?: boolean;
	/**
	 * How much detail should be given in the string representation
	 */
	displayResolution?: Resolution;
	/**
	 * How accurate are the dates
	 */
	dateResolution?: Resolution;
	/**
	 * Is the end date inclusive or exclusive, depends on dateResolution
	 */
	boundary?: 'inclusive' | 'exclusive';
};

function fulfillsResolution(
	resolution: Resolution,
	resolutionToFulfill: Resolution,
) {
	return (
		resolutions.indexOf(resolution) >=
		resolutions.indexOf(resolutionToFulfill)
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
function isStartOfYear(
	date: Date,
	{ resolution }: { resolution: Resolution },
): boolean {
	return isSameDate(yearStart(date), date, { resolution });
}
function isEndOfYear(
	date: Date,
	{ resolution }: { resolution: Resolution },
): boolean {
	return isSameDate(yearEnd(date), date, { resolution });
}
function isSameDate(
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
			return isSameSecond(dateA, dateB);
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
function isStartOfMonth(
	date: Date,
	{ resolution }: { resolution: Resolution },
) {
	return isSameDate(monthStart(date), date, { resolution });
}

function isEndOfMonth(
	date: Date,
	{ resolution }: { resolution: Resolution },
): boolean {
	return isSameDate(monthEnd(date), date, { resolution });
}

function toZonedDate(date: Date, timeZone: string | undefined) {
	if (!timeZone) {
		return date as ZonedDate;
	}
	const offsetToTimezone = offset(date, timeZone);
	const adjusted = removeOffset(date, offsetToTimezone);
	return adjusted as ZonedDate;
}

function startOf(date: Date, resolution: Resolution) {
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
function endOf(date: Date, resolution: Resolution) {
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

function lowerResolution(resolution: Resolution) {
	const foundIndex = resolutions.indexOf(resolution);
	const adjustedIndex = foundIndex ? foundIndex - 1 : foundIndex;
	const lowered = resolutions[adjustedIndex] ?? resolutions[0];
	return lowered;
}
function addResolution(date: Date, resolution: Resolution, amount: number) {
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

export class DateFormatter{
	private dateResolution: Resolution;
	private displayResolution: Resolution;
	private boundary: 'inclusive' | 'exclusive';
	private onlyIntl: boolean;
    constructor(options?:Pick<RangeFormatOptions,'boundary' |'dateResolution' | 'displayResolution' | 'onlyIntl'>){
		this.dateResolution = options?.dateResolution ?? 'second';
		const displayResolution = options?.displayResolution ?? 'minute';
		this.displayResolution = fulfillsResolution(
			this.dateResolution,
			displayResolution,
		)
			? displayResolution
			: this.dateResolution;
		this.boundary = options?.boundary ?? 'inclusive';
		this.onlyIntl = options?.onlyIntl ?? true;
    }

    public formatRange(from: Date,to:Date, options : {locale:Intl.LocalesArgument}){
        return new Intl.DateTimeFormat(options.locale).formatRange(from, to)
    }
	
    public formatRangeToday(from: Date,to:Date, options : {today?: Date ,locale:Intl.LocalesArgument}){
        return new Intl.DateTimeFormat(options.locale).formatRange(from, to)
    }
    public getRangeType(from: Date,to:Date,options?: Pick<RangeFormatOptions,'timeZoneOptions'> ): RangeType | undefined{
        const { from: fromZoned, to: toZoned } = this.adjustDates(from, to, {
			timeZone: options?.timeZoneOptions?.timeZone,
		});
		const sameDay = isSameDay(fromZoned, toZoned);
		const sameMonth = isSameMonth(fromZoned, toZoned);
		const sameYear = isSameYear(fromZoned, toZoned);
		
		const displayResolution = this.displayResolution;
		if (isFullYears(fromZoned, toZoned, { resolution: displayResolution })) {
			return 'fullYears';
		}
		if (isFullQuarters(fromZoned, toZoned, { resolution: displayResolution })) {
			return 'fullQuarters';
		}
		if (isFullMonths(fromZoned, toZoned, { resolution: displayResolution })) {
			return 'fullMonths';
		}
		if (sameDay && fulfillsResolution(displayResolution, 'day')) {
			return 'sameDay';
		}
		if (sameMonth && fulfillsResolution(displayResolution, 'month')) {
			return 'sameMonth';
		}
		if (sameYear) {
			return 'sameYear';
		}
		return undefined;
    }
	private adjustStartDate(
		date: Date,
		{
			timeZone,
		}: {
			timeZone: string | undefined;
		},
	): AdjustedDate {
		const zoned = toZonedDate(date, timeZone);
		return startOf(zoned, this.displayResolution) as AdjustedDate;
	}
	
	private adjustEndDate(
		date: Date,
		{
			timeZone,
		}: {
			timeZone: string | undefined;
		},
	): AdjustedDate {
		const zoned = toZonedDate(date, timeZone);
		const displayResolution = this.displayResolution;
		const dateResolution = this.dateResolution;
		if (this.boundary === 'inclusive') {
			return endOf(zoned, displayResolution) as AdjustedDate;
		}
		const startZoned = startOf(zoned, lowerResolution(displayResolution));
		if (!isSameDate(startZoned, zoned, { resolution: dateResolution })) {
			return endOf(zoned, displayResolution) as AdjustedDate;
		}
		return endOf(
			addResolution(zoned, dateResolution, -1),
			displayResolution,
		) as AdjustedDate;
	}
	private adjustDates(
		from: Date,
		to: Date,
		{
			timeZone,
		}: {
			timeZone: string | undefined;
		},
	): { from: AdjustedDate; to: AdjustedDate } {
		return {
			from: this.adjustStartDate(from, {
				timeZone,
			}),
			to: this.adjustEndDate(to, { timeZone }),
		};
	}
}