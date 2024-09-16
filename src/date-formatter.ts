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
export class DateFormatter{
    constructor(options?:Pick<RangeFormatOptions,'boundary' |'dateResolution' | 'displayResolution' | 'onlyIntl'>){

    }

    public formatRange(from: Date,to:Date, options : {locale:Intl.LocalesArgument}){
        return new Intl.DateTimeFormat(options.locale).formatRange(from, to)
    }
    public formatRangeToday(from: Date,to:Date, options : {today?: Date ,locale:Intl.LocalesArgument}){
        return new Intl.DateTimeFormat(options.locale).formatRange(from, to)
    }
    public getRangeType(from: Date,to:Date,options?: Pick<RangeFormatOptions,'timeZoneOptions'> ): RangeType | undefined{
        return undefined
    }
}