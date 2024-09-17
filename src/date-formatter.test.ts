import { describe, expect, test } from 'vitest';
import {
	DateFormatter,
	type RangeFormatOptions,
	type RangeType,
} from './date-formatter.js';
import { type Resolution, resolutions } from './utils.js';

const today = new Date('2023-09-16T12:00:00.000');
function joinDates(start: string, end: string) {
	return `${start}\u2009\u2013\u2009${end}`;
}
describe('format date range', () => {
	test('same month', () => {
		const from = new Date('2023-01-01T00:00:00.000');
		const to = new Date('2023-01-12T23:59:59.999');
		const formatter = new DateFormatter();
		expect(
			formatter.formatRangeToday(from, to, {
				today,
				locale: 'en-US',
			}),
		).toBe(joinDates('Jan 1', '12'));
	});
});

const locales = ['en-US', 'en-GB', 'pt-BR'] as const;

const defaultOptions: RangeFormatOptions & { today: Date } = {
	today,
	locale: 'en-US',
};

type Locale = (typeof locales)[number];

type ExpectedResults = Record<Locale, string>;

const formatRangeLocaleTestCases: {
	description: string;
	from: Date;
	to: Date;
	options?: Partial<RangeFormatOptions>;
	expectedType: RangeType | undefined;
	expected: ExpectedResults;
}[] = [
	{
		description: 'format date range same month',
		from: new Date('2023-08-01T00:00:00.000'),
		to: new Date('2023-08-12T23:59:59.999'),
		expectedType: 'sameMonth',
		expected: {
			'en-US': joinDates('Aug 1', '12'),
			'en-GB': '1\u201312 Aug',
			'pt-BR': joinDates('1', '12 de ago.'),
		},
	},
	{
		description: 'format date range different month',
		from: new Date('2023-01-03T00:00:00.000'),
		to: new Date('2023-05-29T23:59:59.999'),
		expectedType: 'sameYear',
		expected: {
			'en-US': joinDates('Jan 3', 'May 29'),
			'en-GB': joinDates('3 Jan', '29 May'),
			'pt-BR': joinDates('3 de jan.', '29 de mai.'),
		},
	},
	{
		description: 'format date range different year',
		from: new Date('2022-05-01T00:00:00.000'),
		to: new Date('2023-05-29T23:59:59.999'),
		expectedType: undefined,
		expected: {
			'en-US': joinDates('May 1, 2022', 'May 29, 2023'),
			'en-GB': joinDates('1 May 2022', '29 May 2023'),
			'pt-BR': joinDates('1 de mai. de 2022', '29 de mai. de 2023'),
		},
	},
	{
		description: 'format date range full day',
		from: new Date('2023-01-01T00:00:00.000'),
		to: new Date('2023-01-01T23:59:59.999'),
		expectedType: 'sameDay',
		expected: {
			'en-US': 'Jan 1',
			'en-GB': '1 Jan',
			'pt-BR': '1 de jan.',
		},
	},
	{
		description: 'format date range same day, different hours',
		from: new Date('2023-10-01T00:11:00.000'),
		to: new Date('2023-10-01T14:30:59.999'),
		expectedType: 'sameDay',
		expected: {
			'en-US': joinDates('Oct 1, 12:11\u202FAM', '2:31\u202FPM'),
			'en-GB': '1 Oct, 00:11\u201314:31',
			'pt-BR': joinDates('1 de out. 00:11', '14:31'),
		},
	},
	{
		description: 'format date range different days with time',
		from: new Date('2023-01-01T00:11:00.000'),
		to: new Date('2023-01-02T14:30:00.000'),
		expectedType: 'sameMonth',
		expected: {
			'en-US': joinDates('Jan 1, 12:11\u202FAM', 'Jan 2, 2:30\u202FPM'),
			'en-GB': joinDates('1 Jan, 00:11', '2 Jan, 14:30'),
			'pt-BR': joinDates('1 de jan., 00:11', '2 de jan., 14:30'),
		},
	},
	{
		description:
			'format date range different days with time,resolution seconds',
		from: new Date('2023-01-01T00:11:00.000'),
		to: new Date('2023-01-02T14:30:01.000'),
		options: { displayResolution: 'second' },
		expectedType: 'sameMonth',
		expected: {
			'en-US': joinDates('Jan 1, 12:11:00\u202FAM', 'Jan 2, 2:30:02\u202FPM'),
			'en-GB': joinDates('1 Jan, 00:11:00', '2 Jan, 14:30:02'),
			'pt-BR': joinDates('1 de jan., 00:11:00', '2 de jan., 14:30:02'),
		},
	},
	{
		description: 'format date range different days with single time',
		from: new Date('2023-01-01T00:11:00.000'),
		to: new Date('2023-01-02T23:59:59.999'),
		expectedType: 'sameMonth',
		expected: {
			'en-US': joinDates('Jan 1, 12:11\u202FAM', 'Jan 3, 12:00\u202FAM'),
			'en-GB': joinDates('1 Jan, 00:11', '3 Jan, 00:00'),
			'pt-BR': joinDates('1 de jan., 00:11', '3 de jan., 00:00'),
		},
	},
	{
		description: 'format date range different years with time',
		from: new Date('2022-12-01T00:11:00.000'),
		to: new Date('2023-12-02T14:30:00.000'),
		expectedType: undefined,
		expected: {
			'en-US': joinDates(
				'Dec 1, 2022, 12:11\u202FAM',
				'Dec 2, 2023, 2:30\u202FPM',
			),
			'en-GB': joinDates('1 Dec 2022, 00:11', '2 Dec 2023, 14:30'),
			'pt-BR': joinDates(
				'1 de dez. de 2022, 00:11',
				'2 de dez. de 2023, 14:30',
			),
		},
	},
	{
		description:
			'format date range different years with time, dateResolution: day',
		from: new Date('2022-01-01T00:11:00.000'),
		to: new Date('2023-01-02T14:30:00.000'),
		expectedType: undefined,
		options: {
			displayResolution: 'day',
		},
		expected: {
			'en-US': joinDates('Jan 1, 2022', 'Jan 2, 2023'),
			'en-GB': joinDates('1 Jan 2022', '2 Jan 2023'),
			'pt-BR': joinDates('1 de jan. de 2022', '2 de jan. de 2023'),
		},
	},
	{
		description: 'format date range full day another year',
		from: new Date('2022-01-01T00:00:00.000'),
		to: new Date('2022-01-01T23:59:59.999'),
		expectedType: 'sameDay',
		expected: {
			'en-US': 'Jan 1, 2022',
			'en-GB': '1 Jan 2022',
			'pt-BR': '1 de jan. de 2022',
		},
	},

	{
		description: 'format date range full month another year',
		from: new Date('2022-01-01T00:00:00.000'),
		to: new Date('2022-01-31T23:59:59.999'),
		expectedType: 'fullMonths',
		expected: {
			'en-US': 'January 2022',
			'en-GB': 'January 2022',
			'pt-BR': 'janeiro de 2022',
		},
	},
	{
		description: 'format date range full month this year',
		from: new Date('2023-01-01T00:00:00.000'),
		to: new Date('2023-01-31T23:59:59.999'),
		expectedType: 'fullMonths',
		expected: {
			'en-US': 'January',
			'en-GB': 'January',
			'pt-BR': 'janeiro',
		},
	},
	{
		description: 'format date range hour difference',
		from: new Date('2023-01-01T12:00:00.000'),
		to: new Date('2023-01-01T12:59:59.999'),
		expectedType: 'sameDay',
		expected: {
			'en-US': joinDates('Jan 1, 12', '1\u202FPM'),
			'en-GB': '1 Jan, 12–13',
			'pt-BR': '1 de jan. 12h - 13h',
		},
	},
	{
		description: 'format date range today, different hours',
		from: today,
		to: new Date(today.getTime() + 60 * 60 * 1000), // Today + 1 hour
		expectedType: 'sameDay',
		expected: {
			'en-US': joinDates('12:00', '1:00\u202FPM'),
			'en-GB': '12:00\u201313:00',
			'pt-BR': joinDates('12:00', '13:00'),
		},
	},
	{
		description: 'format date range full year',
		from: new Date('2023-01-01T00:00:00.000'),
		to: new Date('2023-12-31T23:59:59.999'),
		expectedType: 'fullYears',
		expected: {
			'en-US': '2023',
			'en-GB': '2023',
			'pt-BR': '2023',
		},
	},
	{
		description: 'format year range multiple years',
		from: new Date('2022-01-01T00:00:00.000'),
		to: new Date('2023-12-31T23:59:59.999'),
		expectedType: 'fullYears',
		expected: {
			'en-US': joinDates('2022', '2023'),
			'en-GB': '2022\u20132023',
			'pt-BR': joinDates('2022', '2023'),
		},
	},
	{
		description: 'format date range quarter, this year',
		from: new Date('2023-01-01 00:00:00.000'),
		to: new Date('2023-03-31 23:59:59.999'),
		expectedType: 'fullQuarters',
		expected: {
			'en-US': 'Q1',
			'en-GB': 'Q1',
			'pt-BR': 'Q1',
		},
	},
	{
		description: 'format date range quarter, multiple',
		from: new Date('2023-01-01 00:00:00.000'),
		to: new Date('2023-06-30 23:59:59.999'),
		expectedType: 'fullQuarters',
		expected: {
			'en-US': 'Q1\u2013Q2',
			'en-GB': 'Q1\u2013Q2',
			'pt-BR': 'Q1\u2013Q2',
		},
	},
	{
		description: 'format date range quarter, multiple years',
		from: new Date('2022-01-01 00:00:00.000'),
		to: new Date('2023-06-30 23:59:59.999'),
		expectedType: 'fullQuarters',
		expected: {
			'en-US': joinDates('Q1 2022', 'Q2 2023'),
			'en-GB': joinDates('Q1 2022', 'Q2 2023'),
			'pt-BR': joinDates('Q1 2022', 'Q2 2023'),
		},
	},
	{
		description: 'format date range quarter, another year',
		from: new Date('2022-01-01 00:00:00.000'),
		to: new Date('2022-03-31 23:59:59.999'),
		expectedType: 'fullQuarters',
		expected: {
			'en-US': 'Q1 2022',
			'en-GB': 'Q1 2022',
			'pt-BR': 'Q1 2022',
		},
	},
	{
		description: 'across two full months another year',
		from: new Date('2022-01-01T00:00:00.000'),
		to: new Date('2022-02-28T23:59:59.999'),
		expectedType: 'fullMonths',
		expected: {
			'en-US': joinDates('Jan', 'Feb 2022'),
			'en-GB': joinDates('Jan', 'Feb 2022'),
			'pt-BR': joinDates('jan.', 'fev. de 2022'),
		},
	},
	{
		description: 'across two full months this year',
		from: new Date('2023-01-01T00:00:00.000'),
		to: new Date('2023-02-28T23:59:59.999'),
		expectedType: 'fullMonths',
		expected: {
			'en-US': joinDates('Jan', 'Feb'),
			'en-GB': joinDates('Jan', 'Feb'),
			'pt-BR': joinDates('jan.', 'fev.'),
		},
	},
	{
		description: 'across two full months,across year',
		from: new Date('2022-01-01T00:00:00.000'),
		to: new Date('2023-02-28T23:59:59.999'),
		expectedType: 'fullMonths',
		expected: {
			'en-US': joinDates('Jan 2022', 'Feb 2023'),
			'en-GB': joinDates('Jan 2022', 'Feb 2023'),
			'pt-BR': joinDates('jan. de 2022', 'fev. de 2023'),
		},
	},
];

describe.each(locales)('format date range with locale %s', (locale) => {
	test.each(formatRangeLocaleTestCases)(
		'$description',
		({ from, to, options, expected, expectedType }) => {
			const formatter = new DateFormatter({
				onlyIntl: false,
				...defaultOptions,
				...options,
			});
			expect(
				formatter.getRangeType(from, to, {
					...defaultOptions,
					locale,
					...options,
				}),
			).toBe(expectedType);
			expect(
				formatter.formatRangeToday(from, to, {
					...defaultOptions,
					locale,
					...options,
				}),
			).toBe(expected[locale]);
		},
	);
});

const formatRangeTimezoneTestCases: {
	description: string;
	from: Date;
	to: Date;
	options?: Partial<RangeFormatOptions>;
	expectedType: RangeType | undefined;
	expected: ExpectedTimezoneResults;
}[] = [
	{
		description: 'format date range same month',
		from: new Date('2023-08-01T00:00:00.000Z'),
		to: new Date('2023-08-12T23:59:59.999Z'),
		options: { locale: 'en-UK' },
		expectedType: 'sameMonth',
		expected: {
			'Europe/Helsinki': { range: joinDates('1 Aug, 03', '13 Aug, 03') },
			'Europe/London': { range: joinDates('1 Aug, 01', '13 Aug, 01') },
			'Europe/Stockholm': { range: joinDates('1 Aug, 02', '13 Aug, 02') },
			'America/New_York': {
				type: 'sameYear',
				range: joinDates('31 Jul, 20', '12 Aug, 20'),
			},
			'Asia/Tokyo': {
				type: 'sameMonth',
				range: joinDates('1 Aug, 09', '13 Aug, 09'),
			},
		},
	},
];
const timezones = [
	'Europe/Stockholm',
	'America/New_York',
	'Asia/Tokyo',
	'Europe/Helsinki',
	'Europe/London',
] as const;
type Timezone = (typeof timezones)[number];

type ExpectedTimezoneResults = Record<
	Timezone,
	{ type?: RangeType; range: string }
>;
describe.each(timezones)('format date range with timezone %s', (timeZone) => {
	test.each(formatRangeTimezoneTestCases)(
		'$description tz',
		({ from, to, options, expected, expectedType }) => {
			const formatter = new DateFormatter({
				onlyIntl: false,
				...defaultOptions,
				...options,
			});
			expect(
				formatter.getRangeType(from, to, {
					...defaultOptions,
					timeZoneOptions: {
						timeZone: timeZone,
						show: false,
					},
					...options,
				}),
			).toBe(expected[timeZone]?.type ?? expectedType);
			expect(
				formatter.formatRangeToday(from, to, {
					...defaultOptions,
					timeZoneOptions: {
						timeZone: timeZone,
						show: false,
					},
					...options,
				}),
			).toBe(expected[timeZone].range);
		},
	);
});

const formatDateRangeDisplayResolutionInclusiveFullYear: {
	description: string;
	from: Date;
	to: Date;
	options?: Partial<RangeFormatOptions>;
	expectedDefault: { type: RangeType | undefined; range: string };
	expected: Partial<
		Record<Resolution, { type: RangeType | undefined; range: string }>
	>;
}[] = [
	{
		description: 'full year, year resolution',
		from: new Date('2022-01-01T00:00:00.000'),
		to: new Date('2023-12-31T23:59:59.000'),

		options: { dateResolution: 'year', boundary: 'inclusive' },
		expectedDefault: { type: 'fullYears', range: joinDates('2022', '2023') },
		expected: {},
	},
	{
		description: 'full year, month resolution',
		from: new Date('2022-01-01T00:00:00.000'),
		to: new Date('2023-12-31T23:59:59.000'),

		options: { dateResolution: 'month', boundary: 'inclusive' },
		expectedDefault: { type: 'fullYears', range: joinDates('2022', '2023') },
		expected: {},
	},
	{
		description: 'full year, day resolution',
		from: new Date('2022-01-01T00:00:00.000'),
		to: new Date('2023-12-31T23:59:59.000'),
		expectedDefault: { type: 'fullYears', range: joinDates('2022', '2023') },
		options: { dateResolution: 'day', boundary: 'inclusive' },

		expected: {},
	},
	{
		description: 'full year, minute resolution',
		from: new Date('2022-01-01T00:00:00.000'),
		to: new Date('2023-12-31T23:59:59.000'),
		expectedDefault: { type: 'fullYears', range: joinDates('2022', '2023') },
		options: { dateResolution: 'hour', boundary: 'inclusive' },

		expected: {},
	},
	{
		description: 'full year, day resolution',
		from: new Date('2022-01-01T00:00:00.000'),
		to: new Date('2023-12-31T23:59:59.000'),
		expectedDefault: { type: 'fullYears', range: joinDates('2022', '2023') },
		options: { dateResolution: 'minute', boundary: 'inclusive' },

		expected: {},
	},
	{
		description: 'full year, day resolution',
		from: new Date('2022-01-01T00:00:00.000'),
		to: new Date('2023-12-31T23:59:59.000'),
		expectedDefault: { type: 'fullYears', range: joinDates('2022', '2023') },
		options: { dateResolution: 'second', boundary: 'inclusive' },

		expected: {},
	},
];

const formatDateRangeDisplayResolutionInclusiveFullMonths: {
	description: string;
	from: Date;
	to: Date;
	options?: Partial<RangeFormatOptions>;
	expectedDefault: { type: RangeType | undefined; range: string };
	expected: Partial<
		Record<Resolution, { type: RangeType | undefined; range: string }>
	>;
}[] = [
	{
		description: 'full month, year resolution',
		from: new Date('2022-02-01T00:00:00.000'),
		to: new Date('2023-12-31T23:59:59.000'),
		options: { dateResolution: 'year', boundary: 'inclusive' },
		expected: {},
		expectedDefault: { type: 'fullYears', range: joinDates('2022', '2023') },
	},
	{
		description: 'full month, month resolution',
		from: new Date('2022-02-01T00:00:00.000'),
		to: new Date('2023-12-31T23:59:59.000'),

		options: { dateResolution: 'month', boundary: 'inclusive' },
		expectedDefault: {
			type: 'fullMonths',
			range: joinDates('Feb 2022', 'Dec 2023'),
		},
		expected: { year: { type: 'fullYears', range: joinDates('2022', '2023') } },
	},
	{
		description: 'full month, day resolution',
		from: new Date('2022-02-01T00:00:00.000'),
		to: new Date('2023-12-31T23:59:59.000'),

		options: { dateResolution: 'day', boundary: 'inclusive' },
		expectedDefault: {
			type: 'fullMonths',
			range: joinDates('Feb 2022', 'Dec 2023'),
		},
		expected: { year: { type: 'fullYears', range: joinDates('2022', '2023') } },
	},
	{
		description: 'full month, hour resolution',
		from: new Date('2022-02-01T00:00:00.000'),
		to: new Date('2023-12-31T23:59:59.000'),

		options: { dateResolution: 'hour', boundary: 'inclusive' },
		expectedDefault: {
			type: 'fullMonths',
			range: joinDates('Feb 2022', 'Dec 2023'),
		},
		expected: { year: { type: 'fullYears', range: joinDates('2022', '2023') } },
	},
	{
		description: 'full month, minute resolution',
		from: new Date('2022-02-01T00:00:00.000'),
		to: new Date('2023-12-31T23:59:59.000'),

		options: { dateResolution: 'minute', boundary: 'inclusive' },
		expectedDefault: {
			type: 'fullMonths',
			range: joinDates('Feb 2022', 'Dec 2023'),
		},
		expected: { year: { type: 'fullYears', range: joinDates('2022', '2023') } },
	},
	{
		description: 'full month, second resolution',
		from: new Date('2022-02-01T00:00:00.000'),
		to: new Date('2023-12-31T23:59:59.000'),

		options: { dateResolution: 'second', boundary: 'inclusive' },
		expectedDefault: {
			type: 'fullMonths',
			range: joinDates('Feb 2022', 'Dec 2023'),
		},
		expected: { year: { type: 'fullYears', range: joinDates('2022', '2023') } },
	},
];
const formatDateRangeDisplayResolutionInclusiveSameYear: {
	description: string;
	from: Date;
	to: Date;
	options?: Partial<RangeFormatOptions>;
	expectedDefault: { type: RangeType | undefined; range: string };
	expected: Partial<
		Record<Resolution, { type: RangeType | undefined; range: string }>
	>;
}[] = [
	{
		description: 'same year, year resolution',
		from: new Date('2022-02-01T00:00:00.000'),
		to: new Date('2022-10-15T23:59:59.000'),
		expectedDefault: { type: 'fullYears', range: '2022' },
		expected: {},
		options: { dateResolution: 'year', boundary: 'inclusive' },
	},
	{
		description: 'same year, month resolution',
		from: new Date('2022-02-01T00:00:00.000'),
		to: new Date('2022-10-15T23:59:59.000'),
		expectedDefault: {
			type: 'fullMonths',
			range: joinDates('Feb', 'Oct 2022'),
		},
		expected: {
			year: { type: 'fullYears', range: '2022' },
			month: { type: 'fullMonths', range: joinDates('Feb', 'Oct 2022') },
		},
		options: { dateResolution: 'month', boundary: 'inclusive' },
	},
	{
		description: 'same year, day resolution',
		from: new Date('2022-02-01T00:00:00.000'),
		to: new Date('2022-10-15T23:59:59.000'),
		expectedDefault: {
			type: 'sameYear',
			range: joinDates('Feb 1', 'Oct 15, 2022'),
		},
		expected: {
			year: { type: 'fullYears', range: '2022' },
			month: { type: 'fullMonths', range: joinDates('Feb', 'Oct 2022') },
		},
		options: { dateResolution: 'day', boundary: 'inclusive' },
	},
	{
		description: 'same year, hour resolution',
		options: { dateResolution: 'hour', boundary: 'inclusive' },
		from: new Date('2022-02-01T00:00:00.000'),
		to: new Date('2022-10-15T23:59:59.000'),
		expectedDefault: {
			type: 'sameYear',
			range: joinDates('Feb 1', 'Oct 15, 2022'),
		},
		expected: {
			year: { type: 'fullYears', range: '2022' },
			month: { type: 'fullMonths', range: joinDates('Feb', 'Oct 2022') },
		},
	},
	{
		description: 'same year, minute resolution',
		options: { dateResolution: 'minute', boundary: 'inclusive' },
		from: new Date('2022-02-01T00:00:00.000'),
		to: new Date('2022-10-15T23:59:59.000'),
		expectedDefault: {
			type: 'sameYear',
			range: joinDates('Feb 1', 'Oct 15, 2022'),
		},
		expected: {
			year: { type: 'fullYears', range: '2022' },
			month: { type: 'fullMonths', range: joinDates('Feb', 'Oct 2022') },
		},
	},
	{
		description: 'same year, second resolution',
		options: { dateResolution: 'second', boundary: 'inclusive' },
		from: new Date('2022-02-01T00:00:00.000'),
		to: new Date('2022-10-15T23:59:59.000'),
		expectedDefault: {
			type: 'sameYear',
			range: joinDates('Feb 1', 'Oct 15, 2022'),
		},
		expected: {
			year: { type: 'fullYears', range: '2022' },
			month: { type: 'fullMonths', range: joinDates('Feb', 'Oct 2022') },
		},
	},
];

const formatDateRangeDisplayResolutionInclusiveSameMonth: {
	description: string;
	from: Date;
	to: Date;
	options?: Partial<RangeFormatOptions>;
	expectedDefault: { type: RangeType | undefined; range: string };
	expected: Partial<
		Record<Resolution, { type: RangeType | undefined; range: string }>
	>;
}[] = [
	{
		description: 'same month, year resolution',
		from: new Date('2022-02-01T00:00:00.000'),
		to: new Date('2022-02-02T23:59:59.000'),
		expectedDefault: { type: 'fullYears', range: '2022' },
		expected: {},
		options: { dateResolution: 'year', boundary: 'inclusive' },
	},
	{
		description: 'same month, month resolution',
		from: new Date('2022-02-01T00:00:00.000'),
		to: new Date('2022-02-02T23:59:59.000'),
		expectedDefault: { type: 'fullMonths', range: 'February 2022' },
		expected: {
			year: { type: 'fullYears', range: '2022' },
		},
		options: { dateResolution: 'month', boundary: 'inclusive' },
	},
	{
		description: 'same month, day resolution',
		from: new Date('2022-02-01T00:00:00.000'),
		to: new Date('2022-02-02T23:59:59.000'),
		expectedDefault: {
			type: 'sameMonth',
			range: joinDates('Feb 1', '2, 2022'),
		},
		expected: {
			year: { type: 'fullYears', range: '2022' },
			month: { type: 'fullMonths', range: 'February 2022' },
		},
		options: { dateResolution: 'day', boundary: 'inclusive' },
	},
	{
		description: 'same month, hour resolution',
		options: { dateResolution: 'hour', boundary: 'inclusive' },
		from: new Date('2022-02-01T00:00:00.000'),
		to: new Date('2022-02-02T23:59:59.000'),
		expectedDefault: {
			type: 'sameMonth',
			range: joinDates('Feb 1', '2, 2022'),
		},
		expected: {
			year: { type: 'fullYears', range: '2022' },
			month: { type: 'fullMonths', range: 'February 2022' },
		},
	},
	{
		description: 'same month, minute resolution',
		options: { dateResolution: 'minute', boundary: 'inclusive' },
		from: new Date('2022-02-01T00:00:00.000'),
		to: new Date('2022-02-02T23:59:59.000'),
		expectedDefault: {
			type: 'sameMonth',
			range: joinDates('Feb 1', '2, 2022'),
		},
		expected: {
			year: { type: 'fullYears', range: '2022' },
			month: { type: 'fullMonths', range: 'February 2022' },
		},
	},
	{
		description: 'same month, second resolution',
		options: { dateResolution: 'second', boundary: 'inclusive' },
		from: new Date('2022-02-01T00:00:00.000'),
		to: new Date('2022-02-02T23:59:59.000'),
		expectedDefault: {
			type: 'sameMonth',
			range: joinDates('Feb 1', '2, 2022'),
		},
		expected: {
			year: { type: 'fullYears', range: '2022' },
			month: { type: 'fullMonths', range: 'February 2022' },
		},
	},
];
const formatDateRangeDisplayResolutionInclusiveSameDay: {
	description: string;
	from: Date;
	to: Date;
	options?: Partial<RangeFormatOptions>;
	expectedDefault: { type: RangeType | undefined; range: string };
	expected: Partial<
		Record<Resolution, { type: RangeType | undefined; range: string }>
	>;
}[] = [
	{
		description: 'same day, year resolution',
		from: new Date('2022-02-01T00:00:00.000'),
		to: new Date('2022-02-01T23:59:59.000'),
		expectedDefault: { type: 'fullYears', range: '2022' },
		expected: {},
		options: { dateResolution: 'year', boundary: 'inclusive' },
	},
	{
		description: 'same day, month resolution',
		from: new Date('2022-02-01T00:00:00.000'),
		to: new Date('2022-02-01T23:59:59.000'),
		expectedDefault: { type: 'fullMonths', range: 'February 2022' },
		expected: {
			year: { type: 'fullYears', range: '2022' },
		},
		options: { dateResolution: 'month', boundary: 'inclusive' },
	},
	{
		description: 'same day, day resolution',
		from: new Date('2022-02-01T00:00:00.000'),
		to: new Date('2022-02-01T23:59:59.000'),
		expectedDefault: { type: 'sameDay', range: 'Feb 1, 2022' },
		expected: {
			year: { type: 'fullYears', range: '2022' },
			month: { type: 'fullMonths', range: 'February 2022' },
		},
		options: { dateResolution: 'day', boundary: 'inclusive' },
	},
	{
		description: 'same day, hour resolution',
		options: { dateResolution: 'hour', boundary: 'inclusive' },
		from: new Date('2022-02-01T00:00:00.000'),
		to: new Date('2022-02-01T23:59:59.000'),
		expectedDefault: { type: 'sameDay', range: 'Feb 1, 2022' },
		expected: {
			year: { type: 'fullYears', range: '2022' },
			month: { type: 'fullMonths', range: 'February 2022' },
		},
	},
	{
		description: 'same day, minute resolution',
		options: { dateResolution: 'minute', boundary: 'inclusive' },
		from: new Date('2022-02-01T00:00:00.000'),
		to: new Date('2022-02-01T23:59:59.000'),
		expectedDefault: { type: 'sameDay', range: 'Feb 1, 2022' },
		expected: {
			year: { type: 'fullYears', range: '2022' },
			month: { type: 'fullMonths', range: 'February 2022' },
		},
	},
	{
		description: 'same day, second resolution',
		options: { dateResolution: 'second', boundary: 'inclusive' },
		from: new Date('2022-02-01T00:00:00.000'),
		to: new Date('2022-02-01T23:59:59.000'),
		expectedDefault: { type: 'sameDay', range: 'Feb 1, 2022' },
		expected: {
			year: { type: 'fullYears', range: '2022' },
			month: { type: 'fullMonths', range: 'February 2022' },
		},
	},
];
const formatDateRangeDisplayResolutionInclusiveDifferent: {
	description: string;
	from: Date;
	to: Date;
	options?: Partial<RangeFormatOptions>;
	expectedDefault: { type: RangeType | undefined; range: string };
	expected: Partial<
		Record<Resolution, { type: RangeType | undefined; range: string }>
	>;
}[] = [
	{
		description: 'different year, year resolution',
		from: new Date('2022-02-03T01:23:45.000'),
		to: new Date('2023-10-15T15:16:17.000'),
		expectedDefault: { type: 'fullYears', range: joinDates('2022', '2023') },
		expected: {},
		options: { dateResolution: 'year', boundary: 'inclusive' },
	},
	{
		description: 'different year, month resolution',
		from: new Date('2022-02-03T01:23:45.000'),
		to: new Date('2023-10-15T15:16:17.000'),
		expectedDefault: {
			type: 'fullMonths',
			range: joinDates('Feb 2022', 'Oct 2023'),
		},
		expected: {
			year: { type: 'fullYears', range: joinDates('2022', '2023') },
		},
		options: { dateResolution: 'month', boundary: 'inclusive' },
	},
	{
		description: 'different year, day resolution',
		from: new Date('2022-02-03T01:23:45.000'),
		to: new Date('2023-10-15T15:16:17.000'),
		expectedDefault: {
			type: undefined,
			range: joinDates('Feb 3, 2022', 'Oct 15, 2023'),
		},
		expected: {
			year: { type: 'fullYears', range: joinDates('2022', '2023') },
			month: { type: 'fullMonths', range: joinDates('Feb 2022', 'Oct 2023') },
		},
		options: { dateResolution: 'day', boundary: 'inclusive' },
	},
	{
		description: 'different year, hour resolution',
		from: new Date('2022-02-03T01:23:45.000'),
		to: new Date('2023-10-15T15:16:17.000'),
		options: { dateResolution: 'hour', boundary: 'inclusive' },
		expectedDefault: {
			type: undefined,
			range: joinDates('Feb 3, 2022, 1 AM', 'Oct 15, 2023, 4 PM'),
		},
		expected: {
			year: { type: 'fullYears', range: joinDates('2022', '2023') },
			month: { type: 'fullMonths', range: joinDates('Feb 2022', 'Oct 2023') },
			day: { type: undefined, range: joinDates('Feb 3, 2022', 'Oct 15, 2023') },
		},
	},
	{
		description: 'different year, minute resolution',
		from: new Date('2022-02-01T00:00:00.000'),
		to: new Date('2022-10-15T23:59:59.000'),

		options: { dateResolution: 'minute', boundary: 'inclusive' },
		expectedDefault: {
			type: 'sameYear',
			range: joinDates('Feb 1', 'Oct 15, 2022'),
		},
		expected: {
			year: { type: 'fullYears', range: '2022' },
			month: { type: 'fullMonths', range: joinDates('Feb', 'Oct 2022') },
		},
	},
	{
		description: 'same year, second resolution',
		options: { dateResolution: 'second', boundary: 'inclusive' },
		from: new Date('2022-02-01T00:00:00.000'),
		to: new Date('2022-10-15T23:59:59.000'),
		expectedDefault: {
			type: 'sameYear',
			range: joinDates('Feb 1', 'Oct 15, 2022'),
		},
		expected: {
			year: { type: 'fullYears', range: '2022' },
			month: { type: 'fullMonths', range: joinDates('Feb', 'Oct 2022') },
		},
	},
];

const formatDateRangeExclusive: {
	description: string;
	from: Date;
	to: Date;
	options?: Partial<RangeFormatOptions>;
	expectedDefault: { type: RangeType | undefined; range: string };
	expected: Partial<
		Record<Resolution, { type: RangeType | undefined; range: string }>
	>;
}[] = [
	{
		description: 'exclusive second, resolution',
		from: new Date('2022-02-01T00:00:00.000'),
		to: new Date('2024-01-01T01:34:00.000'),
		expectedDefault: {
			type: undefined,
			range: joinDates('Feb 1, 2022, 12:00 AM', 'Jan 1, 2024, 1:34 AM'),
		},

		expected: {
			year: { type: 'fullYears', range: joinDates('2022', '2024') },
			hour: {
				type: undefined,
				range: joinDates('Feb 1, 2022, 12 AM', 'Jan 1, 2024, 1 AM'),
			},
			day: { type: undefined, range: joinDates('Feb 1, 2022', 'Jan 1, 2024') },
			month: { type: 'fullMonths', range: joinDates('Feb 2022', 'Jan 2024') },
		},
		options: { dateResolution: 'second', boundary: 'exclusive' },
	},
	{
		description: 'exclusive, year resolution',
		from: new Date('2022-02-01T00:00:00.000'),
		to: new Date('2024-12-31T23:59:59.000'),
		expectedDefault: { type: 'fullYears', range: joinDates('2022', '2023') },
		expected: {},
		options: { dateResolution: 'year', boundary: 'exclusive' },
	},
];
const permutations: {
	testCases: {
		description: string;
		from: Date;
		to: Date;
		options?: Partial<RangeFormatOptions>;
		expectedDefault: { type: RangeType | undefined; range: string };
		expected: Partial<
			Record<Resolution, { type: RangeType | undefined; range: string }>
		>;
	}[];
}[] = [
	{ testCases: formatDateRangeDisplayResolutionInclusiveFullYear },
	{ testCases: formatDateRangeDisplayResolutionInclusiveFullMonths },
	{ testCases: formatDateRangeDisplayResolutionInclusiveSameYear },
	{ testCases: formatDateRangeDisplayResolutionInclusiveSameMonth },
	{ testCases: formatDateRangeDisplayResolutionInclusiveSameDay },
	{ testCases: formatDateRangeDisplayResolutionInclusiveDifferent },
	{ testCases: formatDateRangeExclusive },
];
for (const permutation of permutations) {
	describe.each(resolutions)(
		'FDR inclusive range, display %s',
		(resolution) => {
			test.each(permutation.testCases)(
				'$description',
				({ from, to, options, expected, expectedDefault }) => {
					const formatter = new DateFormatter({
						...defaultOptions,
						displayResolution: resolution,
						...options,
					});
					expect(
						formatter.getRangeType(from, to, {
							timeZoneOptions:
								defaultOptions.timeZoneOptions ?? options?.timeZoneOptions,
						}),
					).toBe(expected[resolution]?.type ?? expectedDefault.type);
					expect(
						formatter.formatRangeToday(from, to, {
							...defaultOptions,
							displayResolution: resolution,
							...options,
						}),
					).toBe(expected[resolution]?.range ?? expectedDefault.range);
				},
			);
		},
	);
}

const formatDateDisplayYear: {
	description: string;
	date: Date;
	options?: Partial<RangeFormatOptions>;
	expectedDefault: string;
	expected: Partial<Record<Resolution, string>>;
}[] = [
	{
		description: 'year, year resolution',
		date: new Date('2022-01-01T00:00:00.000'),
		expectedDefault: '2022',
		expected: { year: '2022', month: '2022' },
		options: { dateResolution: 'year', boundary: 'inclusive' },
	},
	{
		description: 'year month, year resolution',
		date: new Date('2022-02-01T00:00:00.000'),
		expectedDefault: '2022',
		expected: { year: '2022', month: '2022' },
		options: { dateResolution: 'year', boundary: 'inclusive' },
	},
	{
		description: 'year month day, year resolution',
		date: new Date('2022-02-03T00:00:00.000'),
		expectedDefault: '2022',
		expected: { year: '2022', month: '2022' },
		options: { dateResolution: 'year', boundary: 'inclusive' },
	},
	{
		description: 'year month day, year resolution',
		date: new Date('2022-02-03T00:00:00.000'),
		expectedDefault: '2022',
		expected: { year: '2022', month: '2022' },
		options: { dateResolution: 'year', boundary: 'inclusive' },
	},
	{
		description: 'year month day hour, year resolution',
		date: new Date('2022-02-03T01:00:00.000'),
		expectedDefault: '2022',
		expected: { year: '2022', month: '2022' },
		options: { dateResolution: 'year', boundary: 'inclusive' },
	},
	{
		description: 'year month day hour minute, year resolution',
		date: new Date('2022-02-03T01:02:00.000'),
		expectedDefault: '2022',
		expected: { year: '2022', month: '2022' },
		options: { dateResolution: 'year', boundary: 'inclusive' },
	},
	{
		description: 'year month day hour minute second, year resolution',
		date: new Date('2022-02-03T01:02:03.000'),
		expectedDefault: '2022',
		expected: { year: '2022', month: '2022' },
		options: { dateResolution: 'year', boundary: 'inclusive' },
	},
	{
		description:
			'year month day hour minute second millisecond, year resolution',
		date: new Date('2022-02-03T01:02:03.123'),
		expectedDefault: '2022',
		expected: { year: '2022', month: '2022' },
		options: { dateResolution: 'year', boundary: 'inclusive' },
	},
];
const formatDateDisplayMonth: {
	description: string;
	date: Date;
	options?: Partial<RangeFormatOptions>;
	expectedDefault: string;
	expected: Partial<Record<Resolution, string>>;
}[] = [
	{
		description: 'year, month resolution',
		date: new Date('2022-01-01T00:00:00.000'),
		expectedDefault: 'January 2022',
		expected: { year: '2022' },
		options: { dateResolution: 'month', boundary: 'inclusive' },
	},
	{
		description: 'year month, month resolution',
		date: new Date('2022-02-01T00:00:00.000'),
		expectedDefault: 'February 2022',
		expected: { year: '2022' },
		options: { dateResolution: 'month', boundary: 'inclusive' },
	},
	{
		description: 'year month day, month resolution',
		date: new Date('2022-02-03T00:00:00.000'),
		expectedDefault: 'February 2022',
		expected: { year: '2022' },
		options: { dateResolution: 'month', boundary: 'inclusive' },
	},
	{
		description: 'year month day, month resolution',
		date: new Date('2022-02-03T00:00:00.000'),
		expectedDefault: 'February 2022',
		expected: { year: '2022' },
		options: { dateResolution: 'month', boundary: 'inclusive' },
	},
	{
		description: 'year month day hour, month resolution',
		date: new Date('2022-02-03T01:00:00.000'),
		expectedDefault: 'February 2022',
		expected: { year: '2022' },
		options: { dateResolution: 'month', boundary: 'inclusive' },
	},
	{
		description: 'year month day hour minute, month resolution',
		date: new Date('2022-02-03T01:02:00.000'),
		expectedDefault: 'February 2022',
		expected: { year: '2022' },
		options: { dateResolution: 'month', boundary: 'inclusive' },
	},
	{
		description: 'year month day hour minute second, month resolution',
		date: new Date('2022-02-03T01:02:03.000'),
		expectedDefault: 'February 2022',
		expected: { year: '2022' },
		options: { dateResolution: 'month', boundary: 'inclusive' },
	},
	{
		description:
			'year month day hour minute second millisecond, month resolution',
		date: new Date('2022-02-03T01:02:03.123'),
		expectedDefault: 'February 2022',
		expected: { year: '2022' },
		options: { dateResolution: 'month', boundary: 'inclusive' },
	},
];

const formatDateDisplayDay: {
	description: string;
	date: Date;
	options?: Partial<RangeFormatOptions>;
	expectedDefault: string;
	expected: Partial<Record<Resolution, string>>;
}[] = [
	{
		description: 'year, day resolution',
		date: new Date('2022-01-01T00:00:00.000'),
		expectedDefault: 'January 1, 2022',
		expected: { year: '2022', month: 'January 2022' },
		options: { dateResolution: 'day', boundary: 'inclusive' },
	},
	{
		description: 'year month, day resolution',
		date: new Date('2022-02-03T00:00:00.000'),
		expectedDefault: 'February 3, 2022',
		expected: { year: '2022', month: 'February 2022' },
		options: { dateResolution: 'day', boundary: 'inclusive' },
	},
	{
		description: 'year month day, day resolution',
		date: new Date('2022-02-03T00:00:00.000'),
		expectedDefault: 'February 3, 2022',
		expected: { year: '2022', month: 'February 2022' },
		options: { dateResolution: 'day', boundary: 'inclusive' },
	},
	{
		description: 'year month day, day resolution',
		date: new Date('2022-02-03T00:00:00.000'),
		expectedDefault: 'February 3, 2022',
		expected: { year: '2022', month: 'February 2022', day: 'February 3, 2022' },
		options: { dateResolution: 'day', boundary: 'inclusive' },
	},
	{
		description: 'year month day hour, day resolution',
		date: new Date('2022-02-03T01:00:00.000'),
		expectedDefault: 'February 3, 2022',
		expected: { year: '2022', month: 'February 2022', day: 'February 3, 2022' },
		options: { dateResolution: 'day', boundary: 'inclusive' },
	},
	{
		description: 'year month day hour minute, day resolution',
		date: new Date('2022-02-03T01:02:00.000'),
		expectedDefault: 'February 3, 2022',
		expected: { year: '2022', month: 'February 2022', day: 'February 3, 2022' },
		options: { dateResolution: 'day', boundary: 'inclusive' },
	},
	{
		description: 'year month day hour minute second, day resolution',
		date: new Date('2022-02-03T01:02:03.000'),
		expectedDefault: 'February 3, 2022',
		expected: { year: '2022', month: 'February 2022', day: 'February 3, 2022' },
		options: { dateResolution: 'day', boundary: 'inclusive' },
	},
	{
		description:
			'year month day hour minute second millisecond, day resolution',
		date: new Date('2022-02-03T01:02:03.123'),
		expectedDefault: 'February 3, 2022',
		expected: { year: '2022', month: 'February 2022', day: 'February 3, 2022' },
		options: { dateResolution: 'day', boundary: 'inclusive' },
	},
];
const formatDateDisplayHour: {
	description: string;
	date: Date;
	options?: Partial<RangeFormatOptions>;
	expectedDefault: string;
	expected: Partial<Record<Resolution, string>>;
}[] = [
	{
		description: 'year, hour resolution',
		date: new Date('2022-01-01T00:00:00.000'),
		expectedDefault: 'January 1, 2022',
		expected: { year: '2022', month: 'January 2022' },
		options: { dateResolution: 'hour', boundary: 'inclusive' },
	},
	{
		description: 'year month, hour resolution',
		date: new Date('2022-02-03T00:00:00.000'),
		expectedDefault: 'February 3, 2022',
		expected: { year: '2022', month: 'February 2022' },
		options: { dateResolution: 'hour', boundary: 'inclusive' },
	},
	{
		description: 'year month day, hour resolution',
		date: new Date('2022-02-03T00:00:00.000'),
		expectedDefault: 'February 3, 2022',
		expected: { year: '2022', month: 'February 2022' },
		options: { dateResolution: 'hour', boundary: 'inclusive' },
	},
	{
		description: 'year month day, hour resolution',
		date: new Date('2022-02-03T00:00:00.000'),
		expectedDefault: 'February 3, 2022',
		expected: { year: '2022', month: 'February 2022' },
		options: { dateResolution: 'hour', boundary: 'inclusive' },
	},
	{
		description: 'year month day hour, hour resolution',
		date: new Date('2022-02-03T01:00:00.000'),
		expectedDefault: 'February 3, 2022 at 1 AM',
		expected: { year: '2022', month: 'February 2022', day: 'February 3, 2022' },
		options: { dateResolution: 'hour', boundary: 'inclusive' },
	},
	{
		description: 'year month day hour minute, hour resolution',
		date: new Date('2022-02-03T01:02:00.000'),
		expectedDefault: 'February 3, 2022 at 1 AM',
		expected: { year: '2022', month: 'February 2022', day: 'February 3, 2022' },
		options: { dateResolution: 'hour', boundary: 'inclusive' },
	},
	{
		description: 'year month day hour minute second, hour resolution',
		date: new Date('2022-02-03T01:02:03.000'),
		expectedDefault: 'February 3, 2022 at 1 AM',
		expected: { year: '2022', month: 'February 2022', day: 'February 3, 2022' },
		options: { dateResolution: 'hour', boundary: 'inclusive' },
	},
	{
		description:
			'year month day hour minute second millisecond, hour resolution',
		date: new Date('2022-02-03T01:02:03.123'),
		expectedDefault: 'February 3, 2022 at 1 AM',
		expected: { year: '2022', month: 'February 2022', day: 'February 3, 2022' },
		options: { dateResolution: 'hour', boundary: 'inclusive' },
	},
];
const formatDateDisplayMinute: {
	description: string;
	date: Date;
	options?: Partial<RangeFormatOptions>;
	expectedDefault: string;
	expected: Partial<Record<Resolution, string>>;
}[] = [
	{
		description: 'year, minute resolution',
		date: new Date('2022-01-01T00:00:00.000'),
		expectedDefault: 'January 1, 2022',
		expected: { year: '2022', month: 'January 2022' },
		options: { dateResolution: 'minute', boundary: 'inclusive' },
	},
	{
		description: 'year month, minute resolution',
		date: new Date('2022-02-03T00:00:00.000'),
		expectedDefault: 'February 3, 2022',
		expected: { year: '2022', month: 'February 2022' },
		options: { dateResolution: 'minute', boundary: 'inclusive' },
	},
	{
		description: 'year month day, minute resolution',
		date: new Date('2022-02-03T00:00:00.000'),
		expectedDefault: 'February 3, 2022',
		expected: { year: '2022', month: 'February 2022' },
		options: { dateResolution: 'minute', boundary: 'inclusive' },
	},
	{
		description: 'year month day, minute resolution',
		date: new Date('2022-02-03T00:00:00.000'),
		expectedDefault: 'February 3, 2022',
		expected: { year: '2022', month: 'February 2022' },
		options: { dateResolution: 'minute', boundary: 'inclusive' },
	},
	{
		description: 'year month day hour, minute resolution',
		date: new Date('2022-02-03T01:00:00.000'),
		expectedDefault: 'February 3, 2022 at 1 AM',
		expected: { year: '2022', month: 'February 2022', day: 'February 3, 2022' },
		options: { dateResolution: 'minute', boundary: 'inclusive' },
	},
	{
		description: 'year month day hour minute, minute resolution',
		date: new Date('2022-02-03T01:02:00.000'),
		expectedDefault: 'February 3, 2022 at 1:02 AM',
		expected: {
			year: '2022',
			month: 'February 2022',
			day: 'February 3, 2022',
			hour: 'February 3, 2022 at 1 AM',
		},
		options: { dateResolution: 'minute', boundary: 'inclusive' },
	},
	{
		description: 'year month day hour minute second, minute resolution',
		date: new Date('2022-02-03T01:02:03.000'),
		expectedDefault: 'February 3, 2022 at 1:02 AM',
		expected: {
			year: '2022',
			month: 'February 2022',
			day: 'February 3, 2022',
			hour: 'February 3, 2022 at 1 AM',
		},
		options: { dateResolution: 'minute', boundary: 'inclusive' },
	},
	{
		description:
			'year month day hour minute second millisecond, minute resolution',
		date: new Date('2022-02-03T01:02:03.123'),
		expectedDefault: 'February 3, 2022 at 1:02 AM',
		expected: {
			year: '2022',
			month: 'February 2022',
			day: 'February 3, 2022',
			hour: 'February 3, 2022 at 1 AM',
		},
		options: { dateResolution: 'minute', boundary: 'inclusive' },
	},
];

const formatDateDisplaySecond: {
	description: string;
	date: Date;
	options?: Partial<RangeFormatOptions>;
	expectedDefault: string;
	expected: Partial<Record<Resolution, string>>;
}[] = [
	{
		description: 'second, second resolution',
		date: new Date('2022-01-01T00:00:01.000'),
		expectedDefault: 'January 1, 2022',
		expected: {
			year: '2022',
			month: 'January 2022',
			second: 'January 1, 2022 at 12:00:01 AM',
		},
		options: { dateResolution: 'second', boundary: 'inclusive' },
	},
	{
		description: 'minute, second resolution',
		date: new Date('2022-01-01T00:01:00.000'),
		expectedDefault: 'January 1, 2022',
		expected: {
			year: '2022',
			month: 'January 2022',
			second: 'January 1, 2022 at 12:01 AM',
			minute: 'January 1, 2022 at 12:01 AM',
		},
		options: { dateResolution: 'second', boundary: 'inclusive' },
	},
	{
		description: 'hour, second resolution',
		date: new Date('2022-01-01T01:00:00.000'),
		expectedDefault: 'January 1, 2022',
		expected: {
			year: '2022',
			month: 'January 2022',
			hour: 'January 1, 2022 at 1 AM',
			second: 'January 1, 2022 at 1 AM',
			minute: 'January 1, 2022 at 1 AM',
		},
		options: { dateResolution: 'second', boundary: 'inclusive' },
	},
	{
		description: 'day, second resolution',
		date: new Date('2022-01-02T00:00:00.000'),
		expectedDefault: 'January 2, 2022',
		expected: { month: 'January 2022', year: '2022' },
		options: { dateResolution: 'second', boundary: 'inclusive' },
	},
	{
		description: 'year, second resolution',
		date: new Date('2022-01-01T00:00:00.000'),
		expectedDefault: 'January 1, 2022',
		expected: { year: '2022', month: 'January 2022' },
		options: { dateResolution: 'second', boundary: 'inclusive' },
	},
	{
		description: 'year month, second resolution',
		date: new Date('2022-02-03T00:00:00.000'),
		expectedDefault: 'February 3, 2022',
		expected: { year: '2022', month: 'February 2022' },
		options: { dateResolution: 'second', boundary: 'inclusive' },
	},
	{
		description: 'year month day, second resolution',
		date: new Date('2022-02-03T00:00:00.000'),
		expectedDefault: 'February 3, 2022',
		expected: { year: '2022', month: 'February 2022' },
		options: { dateResolution: 'second', boundary: 'inclusive' },
	},
	{
		description: 'year month day, second resolution',
		date: new Date('2022-02-03T00:00:00.000'),
		expectedDefault: 'February 3, 2022',
		expected: { year: '2022', month: 'February 2022' },
		options: { dateResolution: 'second', boundary: 'inclusive' },
	},
	{
		description: 'year month day hour, second resolution',
		date: new Date('2022-02-03T01:00:00.000'),
		expectedDefault: 'February 3, 2022 at 1 AM',
		expected: { year: '2022', month: 'February 2022', day: 'February 3, 2022' },
		options: { dateResolution: 'second', boundary: 'inclusive' },
	},
	{
		description: 'year month day hour minute, second resolution',
		date: new Date('2022-02-03T01:02:00.000'),
		expectedDefault: 'February 3, 2022 at 1:02 AM',
		expected: {
			year: '2022',
			month: 'February 2022',
			day: 'February 3, 2022',
			hour: 'February 3, 2022 at 1 AM',
		},
		options: { dateResolution: 'second', boundary: 'inclusive' },
	},
	{
		description: 'year month day hour minute second, second resolution',
		date: new Date('2022-02-03T01:02:03.000'),
		expectedDefault: 'February 3, 2022 at 1:02:03 AM',
		expected: {
			year: '2022',
			month: 'February 2022',
			day: 'February 3, 2022',
			hour: 'February 3, 2022 at 1 AM',
			minute: 'February 3, 2022 at 1:02 AM',
		},
		options: { dateResolution: 'second', boundary: 'inclusive' },
	},
	{
		description:
			'year month day hour minute second millisecond, second resolution',
		date: new Date('2022-02-03T01:02:03.123'),
		expectedDefault: 'February 3, 2022 at 1:02:03 AM',
		expected: {
			year: '2022',
			month: 'February 2022',
			day: 'February 3, 2022',
			hour: 'February 3, 2022 at 1 AM',
			minute: 'February 3, 2022 at 1:02 AM',
		},
		options: { dateResolution: 'second', boundary: 'inclusive' },
	},
];
const datePermutations: {
	testCases: {
		description: string;
		date: Date;
		options?: Partial<RangeFormatOptions>;
		expectedDefault: string;
		expected: Partial<Record<Resolution, string>>;
	}[];
}[] = [
	{ testCases: formatDateDisplayYear },
	{ testCases: formatDateDisplayMonth },
	{ testCases: formatDateDisplayDay },
	{ testCases: formatDateDisplayHour },
	{ testCases: formatDateDisplayMinute },
	{ testCases: formatDateDisplaySecond },
];
for (const permutation of datePermutations) {
	describe.each(resolutions)(
		'FDR inclusive range, display %s',
		(resolution) => {
			test.each(permutation.testCases)(
				'$description',
				({ date, options, expected, expectedDefault }) => {
					const formatter = new DateFormatter({
						...defaultOptions,
						displayResolution: resolution,
						...options,
					});
					expect(
						formatter.formatDate(date, {
							...defaultOptions,
							displayResolution: resolution,
							...options,
						}),
					).toBe(expected[resolution] ?? expectedDefault);
				},
			);
		},
	);
}
