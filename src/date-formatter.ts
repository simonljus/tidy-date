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
	hourEnd,
	hourStart,
	minuteEnd,
	minuteStart,
	monthEnd,
	monthStart,
	offset,
	removeOffset,
	yearEnd,
	yearStart,
} from '@formkit/tempo';
import {
	getEndOfQuarter,
	getQuarter,
	getStartOfQuarter,
	isSameDay,
	isSameMinute,
	isSameMonth,
	isSameQuarter,
	isSameSecond,
	isSameYear,
	secondEnd,
	secondStart,
} from './utils.js';

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
export type Resolution = (typeof resolutions)[number];
export type RangeType = (typeof rangeTypes)[number];
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

function isStartOfDay(date: Date, { resolution }: { resolution: Resolution }) {
	return isSameDate(dayStart(date), date, { resolution });
}

function isStartOfHour(date: Date, { resolution }: { resolution: Resolution }) {
	return isSameDate(hourStart(date), date, { resolution });
}
function isStartOfMinute(
	date: Date,
	{ resolution }: { resolution: Resolution },
) {
	return isSameDate(minuteStart(date), date, { resolution });
}
function isEndOfHour(date: Date, { resolution }: { resolution: Resolution }) {
	return isSameDate(hourEnd(date), date, { resolution });
}
function isEndOfMinute(date: Date, { resolution }: { resolution: Resolution }) {
	return isSameDate(minuteEnd(date), date, { resolution });
}

function isEndOfDay(date: Date, { resolution }: { resolution: Resolution }) {
	return isSameDate(dayEnd(date), date, { resolution });
}
function removeZoned({
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

export class DateFormatter {
	private dateResolution: Resolution;
	private displayResolution: Resolution;
	private boundary: 'inclusive' | 'exclusive';
	private onlyIntl: boolean;
	constructor(
		options?: Pick<
			RangeFormatOptions,
			'boundary' | 'dateResolution' | 'displayResolution' | 'onlyIntl'
		>,
	) {
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

	public formatRange(
		from: Date,
		to: Date,
		{
			locale,
			timeZoneOptions,
		}: Pick<RangeFormatOptions, 'locale' | 'timeZoneOptions'>,
	) {
		const { from: fromZoned, to: toZoned } = this.adjustDates(from, to, {
			timeZone: timeZoneOptions?.timeZone,
		});
		const sameMonth = isSameMonth(fromZoned, toZoned);
		const dateRangeType = this.getRangeType(fromZoned, toZoned);

		if (dateRangeType === 'fullQuarters' && !this.onlyIntl) {
			return this.formatRangeFullQuarters(fromZoned, toZoned, {
				locale,
				thisYear: false,
			});
		}

		const { showMonth, showDay, showHour, showMinute, showSecond } =
			this.getRangePartsToShow(fromZoned, toZoned);
		const { from: fromIntl, to: toIntl } = this.adjustDatesForDisplayIntl(
			from,
			to,
			{
				showTime: showHour || showMinute || showSecond,
				timeZone: timeZoneOptions?.timeZone,
			},
		);
		return new Intl.DateTimeFormat(locale, {
			month:
				dateRangeType === 'fullMonths' && sameMonth
					? 'long'
					: showMonth
						? 'short'
						: undefined,
			year: 'numeric',
			day: showDay ? 'numeric' : undefined,
			hour: showHour ? 'numeric' : undefined,
			minute: showMinute ? 'numeric' : undefined,
			second: showSecond ? 'numeric' : undefined,
			timeZone: timeZoneOptions?.timeZone,
			timeZoneName: timeZoneOptions?.show ? 'short' : undefined,
		}).formatRange(fromIntl, toIntl);
	}

	public formatRangeToday(
		from: Date,
		to: Date,
		{
			today,
			locale,
			timeZoneOptions,
		}: Pick<
			RangeFormatOptions & { today: Date },
			'today' | 'timeZoneOptions' | 'locale'
		>,
	) {
		const todayZoned = toZonedDate(today, timeZoneOptions?.timeZone);
		const { from: fromZoned, to: toZoned } = this.adjustDates(from, to, {
			timeZone: timeZoneOptions?.timeZone,
		});
		const sameMonth = isSameMonth(fromZoned, toZoned);
		const sameYear = isSameYear(fromZoned, toZoned);
		const thisYear = sameYear && isSameYear(fromZoned, todayZoned);
		const dateRangeType = this.getRangeType(fromZoned, toZoned);

		if (dateRangeType === 'fullQuarters' && !this.onlyIntl) {
			return this.formatRangeFullQuarters(fromZoned, toZoned, {
				locale,
				thisYear,
			});
		}

		const { showMonth, showDay, showYear, showHour, showMinute, showSecond } =
			this.formatRangePartsToShowToday(fromZoned, toZoned, {
				today: todayZoned,
			});

		const { from: fromIntl, to: toIntl } = this.adjustDatesForDisplayIntl(
			from,
			to,
			{
				showTime: showHour || showMinute || showSecond,
				timeZone: timeZoneOptions?.timeZone,
			},
		);
		return new Intl.DateTimeFormat(locale, {
			month:
				dateRangeType === 'fullMonths' && sameMonth
					? 'long'
					: showMonth
						? 'short'
						: undefined,
			year: showYear ? 'numeric' : undefined,
			day: showDay ? 'numeric' : undefined,
			hour: showHour ? 'numeric' : undefined,
			minute: showMinute ? 'numeric' : undefined,
			second: showSecond ? 'numeric' : undefined,
			timeZoneName: timeZoneOptions?.show ? 'shortOffset' : undefined,
			timeZone: timeZoneOptions?.timeZone,
		}).formatRange(fromIntl, toIntl);
	}
	private _getRangePartsToShowToday(
		from: Date,
		to: Date,
		{ today }: { today: Date },
	): Record<
		| 'showHour'
		| 'showMinute'
		| 'showSecond'
		| 'showDay'
		| 'showMonth'
		| 'showYear',
		boolean
	> {
		const sameDay = isSameDay(from, to);
		const sameMonth = isSameMonth(from, to);
		const sameYear = isSameYear(from, to);
		const thisYear = sameYear && isSameYear(from, today);
		const thisMonth = sameMonth && isSameMonth(from, today);
		const thisDay = sameDay && isSameDay(from, today);
		const { showDay, showMonth, showHour, showMinute, showSecond } =
			this.getRangePartsToShow(from, to);

		return {
			showHour,
			showMinute,
			showSecond,
			showDay: showDay && !thisDay,
			showMonth: showMonth && !thisMonth,
			showYear: !thisYear,
		};
	}
	public formatRangePartsToShowToday(
		from: Date,
		to: Date,
		{
			today,

			timeZone,
		}: {
			today: Date;

			timeZone?: string;
		},
	): Record<
		| 'showHour'
		| 'showMinute'
		| 'showSecond'
		| 'showDay'
		| 'showMonth'
		| 'showYear',
		boolean
	> {
		const { from: fromZoned, to: toZoned } = this.adjustDates(from, to, {
			timeZone: timeZone,
		});
		const todayZoned = toZonedDate(today, timeZone);
		const parts = this._getRangePartsToShowToday(fromZoned, toZoned, {
			today: todayZoned,
		});
		const { showDay, showHour, showMinute, showMonth, showSecond, showYear } =
			parts;
		const showSomething =
			showDay || showMonth || showHour || showMinute || showSecond || showYear;

		return { ...parts, showYear: showYear || !showSomething };
	}
	public getRangeType(
		from: Date,
		to: Date,
		options?: Pick<RangeFormatOptions, 'timeZoneOptions'>,
	): RangeType | undefined {
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
	private formatRangeFullQuarters(
		from: Date,
		to: Date,
		{ locale, thisYear }: { locale: Intl.LocalesArgument; thisYear: boolean },
	) {
		if (isSameQuarter(from, to)) {
			const year = thisYear
				? ''
				: new Intl.DateTimeFormat(locale, {
						year: thisYear ? undefined : 'numeric',
					}).format(from);
			return [`Q${getQuarter(from) + 1}`, year]
				.filter((str) => str.length > 0)
				.join(' ');
		}
		if (thisYear) {
			return [`Q${getQuarter(from) + 1}`, `Q${getQuarter(to) + 1}`].join(
				'\u2013',
			);
		}
		const fromYear = new Intl.DateTimeFormat(locale, {
			year: 'numeric',
		}).format(from);
		const fromQuarter = [`Q${getQuarter(from) + 1}`, fromYear]
			.filter((str) => str.length > 0)
			.join(' ');
		const toYear = new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(
			to,
		);
		const toQuarter = [`Q${getQuarter(to) + 1}`, toYear]
			.filter((str) => str.length > 0)
			.join(' ');
		return [fromQuarter, toQuarter].join('\u2009\u2013\u2009');
	}
	private getRangePartsToShow(
		from: Date,
		to: Date,
		{ timeZoneOptions }: Pick<RangeFormatOptions, 'timeZoneOptions'> = {},
	): Record<
		'showMonth' | 'showDay' | 'showHour' | 'showMinute' | 'showSecond',
		boolean
	> {
		const { from: fromZoned, to: toZoned } = this.adjustDates(from, to, {
			timeZone: timeZoneOptions?.timeZone,
		});
		const displayResolution = this.displayResolution;
		const showMonth =
			fulfillsResolution(displayResolution, 'month') &&
			(!isStartOfYear(fromZoned, { resolution: displayResolution }) ||
				!isEndOfYear(toZoned, { resolution: displayResolution }));
		const showDay =
			fulfillsResolution(displayResolution, 'day') &&
			(!isStartOfMonth(fromZoned, { resolution: displayResolution }) ||
				!isEndOfMonth(toZoned, { resolution: displayResolution }));
		const showHour =
			fulfillsResolution(displayResolution, 'hour') &&
			(!isStartOfDay(fromZoned, { resolution: displayResolution }) ||
				!isEndOfDay(toZoned, { resolution: displayResolution }));
		const showMinute =
			fulfillsResolution(displayResolution, 'minute') &&
			(!isStartOfHour(fromZoned, { resolution: displayResolution }) ||
				!isEndOfHour(toZoned, { resolution: displayResolution }));
		const showSecond =
			fulfillsResolution(displayResolution, 'second') &&
			(!isStartOfMinute(fromZoned, { resolution: displayResolution }) ||
				!isEndOfMinute(toZoned, { resolution: displayResolution }));
		return {
			showMonth,
			showDay,
			showHour,
			showMinute,
			showSecond,
		};
	}
	private adjustEndDateForDisplay(
		date: Date,
		{
			showTime,
			timeZone,
		}: {
			timeZone: string | undefined;
			showTime: boolean;
		},
	): AdjustedDate {
		const zoned = toZonedDate(date, timeZone);
		const boundary = this.boundary;
		const dateResolution = this.dateResolution;
		const displayResolution = this.displayResolution;
		if (boundary === 'inclusive') {
			if (showTime && fulfillsResolution(dateResolution, 'hour')) {
				const added = addResolution(zoned, dateResolution, 1);
				return endOf(added, displayResolution) as AdjustedDate;
			}
			return endOf(zoned, displayResolution) as AdjustedDate;
		}

		const startZoned = startOf(zoned, lowerResolution(displayResolution));

		if (
			showTime ||
			!isSameDate(startZoned, zoned, { resolution: dateResolution })
		) {
			return endOf(zoned, displayResolution) as AdjustedDate;
		}

		return endOf(
			addResolution(zoned, dateResolution, -1),
			displayResolution,
		) as AdjustedDate;
	}
	private adjustEndDateForDisplayIntl(
		date: Date,
		{
			showTime,
			timeZone,
		}: {
			timeZone: string | undefined;
			showTime: boolean;
		},
	): AdjustedDate {
		const adjusted = this.adjustEndDateForDisplay(date, {
			showTime,
			timeZone,
		});
		return removeZoned({
			originalDate: date,
			zonedDate: adjusted,
			timeZone,
		}) as AdjustedDate;
	}

	private adjustStartDateForDisplayIntl(
		date: Date,
		{
			timeZone,
		}: {
			timeZone: string | undefined;
		},
	): AdjustedDate {
		const adjusted = this.adjustStartDate(date, {
			timeZone,
		});
		return removeZoned({
			originalDate: date,
			zonedDate: adjusted,
			timeZone,
		}) as AdjustedDate;
	}

	private adjustDatesForDisplayIntl(
		from: Date,
		to: Date,
		{
			timeZone,
			showTime,
		}: {
			timeZone: string | undefined;
			showTime: boolean;
		},
	): { from: AdjustedDate; to: AdjustedDate } {
		return {
			from: this.adjustStartDateForDisplayIntl(from, {
				timeZone,
			}),
			to: this.adjustEndDateForDisplayIntl(to, {
				timeZone,
				showTime,
			}),
		};
	}
}
