import { describe, expect, test } from 'vitest';
import {
	fulfillsResolution,
	getQuarter,
	isEndOfMonth,
	isEndOfYear,
	isSameDay,
	isSameHour,
	isSameMinute,
	isSameMonth,
	isSameQuarter,
	isSameSecond,
	isSameYear,
	isStartOfDay,
	isStartOfHour,
	isStartOfMinute,
	isStartOfMonth,
	isStartOfYear,
} from './utils.js';

describe('same year', () => {
	test('start end', () => {
		const from = new Date('2023-01-01T00:00:00.000');
		const to = new Date('2023-12-31T23:59:59.999');

		expect(isSameYear(from, to)).toBe(true);
	});
	test('new year', () => {
		const from = new Date('2022-12-31T23:59:59.999');
		const to = new Date('2023-01-01T00:00:00.000');

		expect(isSameYear(from, to)).toBe(false);
	});
	test('different years', () => {
		const from = new Date('2022-08-20T12:34:56.123');
		const to = new Date('2023-04-15T09:10:11.123');

		expect(isSameYear(from, to)).toBe(false);
	});
	test('same year', () => {
		const from = new Date('2023-04-15T09:10:11.123');
		const to = new Date('2023-08-20T12:34:56.123');

		expect(isSameYear(from, to)).toBe(true);
	});
	test('same time', () => {
		const from = new Date('2023-01-01T00:00:00.000');
		const to = new Date('2023-12-31T23:59:59.999');
		expect(isSameYear(from, from)).toBe(true);
		expect(isSameYear(to, to)).toBe(true);
	});
});

describe('same month', () => {
	test('start end', () => {
		const from = new Date('2023-03-01T00:00:00.000');
		const to = new Date('2023-03-31T23:59:59.999');

		expect(isSameMonth(from, to)).toBe(true);
	});
	test('new month', () => {
		const from = new Date('2023-03-31T23:59:59.999');
		const to = new Date('2023-04-01T00:00:00.000');

		expect(isSameMonth(from, to)).toBe(false);
	});
	test('different months', () => {
		const from = new Date('2022-08-20T12:34:56.123');
		const to = new Date('2023-04-15T09:10:11.123');

		expect(isSameMonth(from, to)).toBe(false);
	});
	test('different months same year', () => {
		const from = new Date('2023-04-22T09:10:11.123');
		const to = new Date('2023-08-05T12:34:56.123');

		expect(isSameMonth(from, to)).toBe(false);
	});
	test('different year same month', () => {
		const from = new Date('2022-04-01T09:10:11.123');
		const to = new Date('2023-04-05T12:34:56.123');

		expect(isSameMonth(from, to)).toBe(false);
	});
	test('same month', () => {
		const from = new Date('2023-08-15T09:10:11.123');
		const to = new Date('2023-08-20T12:34:56.123');

		expect(isSameMonth(from, to)).toBe(true);
	});
	test('same time', () => {
		const from = new Date('2023-01-01T00:00:00.000');
		const to = new Date('2023-12-31T23:59:59.999');
		expect(isSameMonth(from, from)).toBe(true);
		expect(isSameMonth(to, to)).toBe(true);
	});
});

describe('same day', () => {
	test('start end', () => {
		const from = new Date('2023-03-01T00:00:00.000');
		const to = new Date('2023-03-01T23:59:59.999');

		expect(isSameDay(from, to)).toBe(true);
	});
	test('new day', () => {
		const from = new Date('2023-04-02T23:59:59.999');
		const to = new Date('2023-04-03T00:00:00.000');

		expect(isSameDay(from, to)).toBe(false);
	});
	test('different days', () => {
		const from = new Date('2022-08-20T12:34:56.123');
		const to = new Date('2023-04-15T09:10:11.123');

		expect(isSameDay(from, to)).toBe(false);
	});
	test('different month,same day', () => {
		const from = new Date('2023-04-05T09:10:11.123');
		const to = new Date('2023-06-05T12:34:56.123');
		expect(isSameDay(from, to)).toBe(false);
	});
	test('different year, same day', () => {
		const from = new Date('2022-04-22T09:10:11.123');
		const to = new Date('2023-04-22T12:34:56.123');
		expect(isSameDay(from, to)).toBe(false);
	});
	test('same day', () => {
		const from = new Date('2023-08-15T09:10:11.123');
		const to = new Date('2023-08-15T12:34:56.123');

		expect(isSameDay(from, to)).toBe(true);
	});
	test('same time', () => {
		const from = new Date('2023-01-01T00:00:00.000');
		const to = new Date('2023-12-31T23:59:59.999');
		expect(isSameDay(from, from)).toBe(true);
		expect(isSameDay(to, to)).toBe(true);
	});
});
describe('same hour', () => {
	test('start end', () => {
		const from = new Date('2023-03-01T00:00:00.000');
		const to = new Date('2023-03-01T00:59:59.999');

		expect(isSameHour(from, to)).toBe(true);
	});
	test('new hour', () => {
		const from = new Date('2023-04-02T10:59:59.999');
		const to = new Date('2023-04-02T11:00:00.000');

		expect(isSameHour(from, to)).toBe(false);
	});
	test('different days', () => {
		const from = new Date('2022-08-20T12:34:56.123');
		const to = new Date('2023-04-15T09:10:11.123');

		expect(isSameHour(from, to)).toBe(false);
	});
	test('different year, same hour', () => {
		const from = new Date('2022-04-22T09:10:11.123');
		const to = new Date('2023-04-22T09:34:56.123');
		expect(isSameHour(from, to)).toBe(false);
	});
	test('different month,same hour', () => {
		const from = new Date('2023-04-05T09:10:11.123');
		const to = new Date('2023-05-05T09:34:56.123');
		expect(isSameHour(from, to)).toBe(false);
	});
	test('different day,same hour', () => {
		const from = new Date('2023-08-15T09:10:11.123');
		const to = new Date('2023-08-16T09:10:11.123');

		expect(isSameHour(from, to)).toBe(false);
	});
	test('same hour', () => {
		const from = new Date('2023-08-16T09:01:11.123');
		const to = new Date('2023-08-16T09:10:11.123');

		expect(isSameHour(from, to)).toBe(true);
	});
	test('same time', () => {
		const from = new Date('2023-01-01T00:00:00.000');
		const to = new Date('2023-12-31T23:59:59.999');
		expect(isSameHour(from, from)).toBe(true);
		expect(isSameHour(to, to)).toBe(true);
	});
});

describe('same minute', () => {
	test('start end', () => {
		const from = new Date('2023-03-02T04:05:00.000');
		const to = new Date('2023-03-02T04:05:59.999');

		expect(isSameMinute(from, to)).toBe(true);
	});
	test('new minute', () => {
		const from = new Date('2023-04-02T11:05:59.999');
		const to = new Date('2023-04-02T11:06:00.000');

		expect(isSameMinute(from, to)).toBe(false);
	});
	test('different dates', () => {
		const from = new Date('2022-08-20T12:34:56.123');
		const to = new Date('2023-04-15T09:10:11.346');

		expect(isSameMinute(from, to)).toBe(false);
	});
	test('different year', () => {
		const from = new Date('2022-04-22T09:10:11.123');
		const to = new Date('2023-04-22T09:10:11.123');
		expect(isSameMinute(from, to)).toBe(false);
	});
	test('different month', () => {
		const from = new Date('2023-04-05T09:10:11.123');
		const to = new Date('2023-05-05T09:10:11.123');
		expect(isSameMinute(from, to)).toBe(false);
	});
	test('different day', () => {
		const from = new Date('2023-08-15T09:10:11.123');
		const to = new Date('2023-08-16T09:10:11.123');

		expect(isSameMinute(from, to)).toBe(false);
	});
	test('different hour', () => {
		const from = new Date('2023-08-15T09:10:11.123');
		const to = new Date('2023-08-15T10:10:11.123');

		expect(isSameMinute(from, to)).toBe(false);
	});
	test('different minute', () => {
		const from = new Date('2023-08-15T10:09:11.123');
		const to = new Date('2023-08-15T10:10:11.123');

		expect(isSameMinute(from, to)).toBe(false);
	});
	test('same minute', () => {
		const from = new Date('2023-08-16T09:01:11.123');
		const to = new Date('2023-08-16T09:01:24.567');

		expect(isSameMinute(from, to)).toBe(true);
	});
	test('same time', () => {
		const from = new Date('2023-01-01T00:00:00.000');
		const to = new Date('2023-12-31T23:59:59.999');
		expect(isSameMinute(from, from)).toBe(true);
		expect(isSameMinute(to, to)).toBe(true);
	});
});

describe('same second', () => {
	test('start end', () => {
		const from = new Date('2023-03-02T04:05:06.000');
		const to = new Date('2023-03-02T04:05:06.999');

		expect(isSameSecond(from, to)).toBe(true);
	});
	test('new second', () => {
		const from = new Date('2023-04-02T11:05:06.999');
		const to = new Date('2023-04-02T11:05:07.000');

		expect(isSameSecond(from, to)).toBe(false);
	});
	test('different dates', () => {
		const from = new Date('2022-08-20T12:34:56.123');
		const to = new Date('2023-04-15T09:10:11.346');

		expect(isSameSecond(from, to)).toBe(false);
	});
	test('different year', () => {
		const from = new Date('2022-04-22T09:10:11.123');
		const to = new Date('2023-04-22T09:10:11.123');
		expect(isSameSecond(from, to)).toBe(false);
	});
	test('different month', () => {
		const from = new Date('2023-04-05T09:10:11.123');
		const to = new Date('2023-05-05T09:10:11.123');
		expect(isSameSecond(from, to)).toBe(false);
	});
	test('different day', () => {
		const from = new Date('2023-08-15T09:10:11.123');
		const to = new Date('2023-08-16T09:10:11.123');

		expect(isSameSecond(from, to)).toBe(false);
	});
	test('different hour', () => {
		const from = new Date('2023-08-15T09:10:11.123');
		const to = new Date('2023-08-15T10:10:11.123');

		expect(isSameSecond(from, to)).toBe(false);
	});
	test('different minute', () => {
		const from = new Date('2023-08-15T10:09:11.123');
		const to = new Date('2023-08-15T10:10:11.123');

		expect(isSameSecond(from, to)).toBe(false);
	});
	test('different second', () => {
		const from = new Date('2023-08-15T10:10:11.123');
		const to = new Date('2023-08-15T10:10:12.123');

		expect(isSameSecond(from, to)).toBe(false);
	});
	test('same second', () => {
		const from = new Date('2023-08-16T09:01:11.123');
		const to = new Date('2023-08-16T09:01:11.567');

		expect(isSameSecond(from, to)).toBe(true);
	});
	test('same time', () => {
		const from = new Date('2023-01-01T00:00:00.000');
		const to = new Date('2023-12-31T23:59:59.999');
		expect(isSameSecond(from, from)).toBe(true);
		expect(isSameSecond(to, to)).toBe(true);
	});
});

describe('same quarter', () => {
	test('start end', () => {
		const from = new Date('2023-04-01T00:00:00.000');
		const to = new Date('2023-06-30T23:59:59.999');

		expect(isSameQuarter(from, to)).toBe(true);
	});
	test('new quarter', () => {
		const from = new Date('2023-03-31T23:59:59.999');
		const to = new Date('2023-04-01T00:00:00.000');

		expect(isSameQuarter(from, to)).toBe(false);
	});
	test('different dates', () => {
		const from = new Date('2022-08-20T12:34:56.123');
		const to = new Date('2023-04-15T09:10:11.346');

		expect(isSameQuarter(from, to)).toBe(false);
	});
	test('different year', () => {
		const from = new Date('2022-04-22T09:10:11.123');
		const to = new Date('2023-04-22T09:10:11.123');
		expect(isSameQuarter(from, to)).toBe(false);
	});
	test('different month,same quarter', () => {
		const from = new Date('2023-05-05T09:10:11.123');
		const to = new Date('2023-06-05T09:10:11.123');
		expect(isSameSecond(from, to)).toBe(false);
	});
	test('different month,different quarter', () => {
		const from = new Date('2023-04-05T09:10:11.123');
		const to = new Date('2023-07-05T09:10:11.123');
		expect(isSameSecond(from, to)).toBe(false);
	});
	test('different day', () => {
		const from = new Date('2023-08-15T09:10:11.123');
		const to = new Date('2023-08-16T09:10:11.123');

		expect(isSameQuarter(from, to)).toBe(true);
	});
	test('different hour', () => {
		const from = new Date('2023-08-15T09:10:11.123');
		const to = new Date('2023-08-15T10:10:11.123');

		expect(isSameQuarter(from, to)).toBe(true);
	});
	test('different minute', () => {
		const from = new Date('2023-08-15T10:09:11.123');
		const to = new Date('2023-08-15T10:10:11.123');

		expect(isSameQuarter(from, to)).toBe(true);
	});
	test('different second', () => {
		const from = new Date('2023-08-15T10:10:11.123');
		const to = new Date('2023-08-15T10:10:12.123');

		expect(isSameQuarter(from, to)).toBe(true);
	});
	test('same time', () => {
		const from = new Date('2023-01-01T00:00:00.000');
		const to = new Date('2023-12-31T23:59:59.999');
		expect(isSameDay(from, from)).toBe(true);
		expect(isSameDay(to, to)).toBe(true);
	});
});

describe('get quarter', () => {
	test('first quarter', () => {
		const firstMonth = new Date('2023-01-02T01:23:45.678');
		const secondMonth = new Date('2023-02-02T01:23:45.678');
		const thirdMonth = new Date('2023-03-02T01:23:45.678');
		expect(getQuarter(firstMonth)).toBe(0);
		expect(getQuarter(secondMonth)).toBe(0);
		expect(getQuarter(thirdMonth)).toBe(0);
	});
	test('second quarter', () => {
		const firstMonth = new Date('2023-04-02T01:23:45.678');
		const secondMonth = new Date('2023-05-02T01:23:45.678');
		const thirdMonth = new Date('2023-06-02T01:23:45.678');
		expect(getQuarter(firstMonth)).toBe(1);
		expect(getQuarter(secondMonth)).toBe(1);
		expect(getQuarter(thirdMonth)).toBe(1);
	});
	test('third quarter', () => {
		const firstMonth = new Date('2023-07-02T01:23:45.678');
		const secondMonth = new Date('2023-08-02T01:23:45.678');
		const thirdMonth = new Date('2023-09-02T01:23:45.678');
		expect(getQuarter(firstMonth)).toBe(2);
		expect(getQuarter(secondMonth)).toBe(2);
		expect(getQuarter(thirdMonth)).toBe(2);
	});
	test('fourth quarter', () => {
		const firstMonth = new Date('2023-10-02T01:23:45.678');
		const secondMonth = new Date('2023-11-02T01:23:45.678');
		const thirdMonth = new Date('2023-12-02T01:23:45.678');
		expect(getQuarter(firstMonth)).toBe(3);
		expect(getQuarter(secondMonth)).toBe(3);
		expect(getQuarter(thirdMonth)).toBe(3);
	});
});

describe('fulfills resolution', () => {
	test('year', () => {
		expect(fulfillsResolution('year', 'year')).toBe(true);
		expect(fulfillsResolution('month', 'year')).toBe(true);
		expect(fulfillsResolution('day', 'year')).toBe(true);
		expect(fulfillsResolution('hour', 'year')).toBe(true);
		expect(fulfillsResolution('minute', 'year')).toBe(true);
		expect(fulfillsResolution('second', 'year')).toBe(true);
	});
	test('hour', () => {
		expect(fulfillsResolution('year', 'hour')).toBe(false);
		expect(fulfillsResolution('month', 'hour')).toBe(false);
		expect(fulfillsResolution('day', 'hour')).toBe(false);
		expect(fulfillsResolution('hour', 'hour')).toBe(true);
		expect(fulfillsResolution('minute', 'hour')).toBe(true);
		expect(fulfillsResolution('second', 'hour')).toBe(true);
	});
	test('second', () => {
		expect(fulfillsResolution('year', 'second')).toBe(false);
		expect(fulfillsResolution('month', 'second')).toBe(false);
		expect(fulfillsResolution('day', 'second')).toBe(false);
		expect(fulfillsResolution('hour', 'second')).toBe(false);
		expect(fulfillsResolution('minute', 'second')).toBe(false);
		expect(fulfillsResolution('second', 'second')).toBe(true);
	});
});

describe('start of year', () => {
	test('year', () => {
		const date = new Date('2023-02-03T01:02:03.456');
		expect(isStartOfYear(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfYear(date, { resolution: 'month' })).toBe(false);
		expect(isStartOfYear(date, { resolution: 'day' })).toBe(false);
		expect(isStartOfYear(date, { resolution: 'hour' })).toBe(false);
		expect(isStartOfYear(date, { resolution: 'minute' })).toBe(false);
		expect(isStartOfYear(date, { resolution: 'second' })).toBe(false);
	});
	test('year, month', () => {
		const date = new Date('2023-01-03T01:02:03.456');
		expect(isStartOfYear(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfYear(date, { resolution: 'month' })).toBe(true);
		expect(isStartOfYear(date, { resolution: 'day' })).toBe(false);
		expect(isStartOfYear(date, { resolution: 'hour' })).toBe(false);
		expect(isStartOfYear(date, { resolution: 'minute' })).toBe(false);
		expect(isStartOfYear(date, { resolution: 'second' })).toBe(false);
	});
	test('year, month,day', () => {
		const date = new Date('2023-01-01T01:02:03.456');
		expect(isStartOfYear(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfYear(date, { resolution: 'month' })).toBe(true);
		expect(isStartOfYear(date, { resolution: 'day' })).toBe(true);
		expect(isStartOfYear(date, { resolution: 'hour' })).toBe(false);
		expect(isStartOfYear(date, { resolution: 'minute' })).toBe(false);
		expect(isStartOfYear(date, { resolution: 'second' })).toBe(false);
	});
	test('year, month,day, hour', () => {
		const date = new Date('2023-01-01T00:02:03.456');
		expect(isStartOfYear(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfYear(date, { resolution: 'month' })).toBe(true);
		expect(isStartOfYear(date, { resolution: 'day' })).toBe(true);
		expect(isStartOfYear(date, { resolution: 'hour' })).toBe(true);
		expect(isStartOfYear(date, { resolution: 'minute' })).toBe(false);
		expect(isStartOfYear(date, { resolution: 'second' })).toBe(false);
	});
	test('year, month,day, hour, minute', () => {
		const date = new Date('2023-01-01T00:00:03.456');
		expect(isStartOfYear(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfYear(date, { resolution: 'month' })).toBe(true);
		expect(isStartOfYear(date, { resolution: 'day' })).toBe(true);
		expect(isStartOfYear(date, { resolution: 'hour' })).toBe(true);
		expect(isStartOfYear(date, { resolution: 'minute' })).toBe(true);
		expect(isStartOfYear(date, { resolution: 'second' })).toBe(false);
	});
	test('year, month,day, hour, minute, second', () => {
		const date = new Date('2023-01-01T00:00:00.456');
		expect(isStartOfYear(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfYear(date, { resolution: 'month' })).toBe(true);
		expect(isStartOfYear(date, { resolution: 'day' })).toBe(true);
		expect(isStartOfYear(date, { resolution: 'hour' })).toBe(true);
		expect(isStartOfYear(date, { resolution: 'minute' })).toBe(true);
		expect(isStartOfYear(date, { resolution: 'second' })).toBe(true);
	});
	test('year, month,day, hour, minute, second,millisecond', () => {
		const date = new Date('2023-01-01T00:00:00.000');
		expect(isStartOfYear(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfYear(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfYear(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfYear(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfYear(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfYear(date, { resolution: 'year' })).toBe(true);
	});
});

describe('end of year', () => {
	test('year', () => {
		const date = new Date('2023-02-03T01:02:03.456');
		expect(isEndOfYear(date, { resolution: 'year' })).toBe(true);
		expect(isEndOfYear(date, { resolution: 'month' })).toBe(false);
		expect(isEndOfYear(date, { resolution: 'day' })).toBe(false);
		expect(isEndOfYear(date, { resolution: 'hour' })).toBe(false);
		expect(isEndOfYear(date, { resolution: 'minute' })).toBe(false);
		expect(isEndOfYear(date, { resolution: 'second' })).toBe(false);
	});
	test('year, month', () => {
		const date = new Date('2023-12-03T01:02:03.456');
		expect(isEndOfYear(date, { resolution: 'year' })).toBe(true);
		expect(isEndOfYear(date, { resolution: 'month' })).toBe(true);
		expect(isEndOfYear(date, { resolution: 'day' })).toBe(false);
		expect(isEndOfYear(date, { resolution: 'hour' })).toBe(false);
		expect(isEndOfYear(date, { resolution: 'minute' })).toBe(false);
		expect(isEndOfYear(date, { resolution: 'second' })).toBe(false);
	});
	test('year, month,day', () => {
		const date = new Date('2023-12-31T01:02:03.456');
		expect(isEndOfYear(date, { resolution: 'year' })).toBe(true);
		expect(isEndOfYear(date, { resolution: 'month' })).toBe(true);
		expect(isEndOfYear(date, { resolution: 'day' })).toBe(true);
		expect(isEndOfYear(date, { resolution: 'hour' })).toBe(false);
		expect(isEndOfYear(date, { resolution: 'minute' })).toBe(false);
		expect(isEndOfYear(date, { resolution: 'second' })).toBe(false);
	});
	test('year, month,day, hour', () => {
		const date = new Date('2023-12-31T23:02:03.456');
		expect(isEndOfYear(date, { resolution: 'year' })).toBe(true);
		expect(isEndOfYear(date, { resolution: 'month' })).toBe(true);
		expect(isEndOfYear(date, { resolution: 'day' })).toBe(true);
		expect(isEndOfYear(date, { resolution: 'hour' })).toBe(true);
		expect(isEndOfYear(date, { resolution: 'minute' })).toBe(false);
		expect(isEndOfYear(date, { resolution: 'second' })).toBe(false);
	});
	test('year, month,day, hour, minute', () => {
		const date = new Date('2023-12-31T23:59:03.456');
		expect(isEndOfYear(date, { resolution: 'year' })).toBe(true);
		expect(isEndOfYear(date, { resolution: 'month' })).toBe(true);
		expect(isEndOfYear(date, { resolution: 'day' })).toBe(true);
		expect(isEndOfYear(date, { resolution: 'hour' })).toBe(true);
		expect(isEndOfYear(date, { resolution: 'minute' })).toBe(true);
		expect(isEndOfYear(date, { resolution: 'second' })).toBe(false);
	});
	test('year, month,day, hour, minute, second', () => {
		const date = new Date('2023-12-31T23:59:59.456');
		expect(isEndOfYear(date, { resolution: 'year' })).toBe(true);
		expect(isEndOfYear(date, { resolution: 'month' })).toBe(true);
		expect(isEndOfYear(date, { resolution: 'day' })).toBe(true);
		expect(isEndOfYear(date, { resolution: 'hour' })).toBe(true);
		expect(isEndOfYear(date, { resolution: 'minute' })).toBe(true);
		expect(isEndOfYear(date, { resolution: 'second' })).toBe(true);
	});
	test('year, month,day, hour, minute, second,millisecond', () => {
		const date = new Date('2023-12-31T23:59:59.999');
		expect(isEndOfYear(date, { resolution: 'year' })).toBe(true);
		expect(isEndOfYear(date, { resolution: 'year' })).toBe(true);
		expect(isEndOfYear(date, { resolution: 'year' })).toBe(true);
		expect(isEndOfYear(date, { resolution: 'year' })).toBe(true);
		expect(isEndOfYear(date, { resolution: 'year' })).toBe(true);
		expect(isEndOfYear(date, { resolution: 'year' })).toBe(true);
	});
});

describe('start of month', () => {
	test('month', () => {
		const date = new Date('2023-02-03T01:02:03.456');
		expect(isStartOfMonth(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfMonth(date, { resolution: 'month' })).toBe(true);
		expect(isStartOfMonth(date, { resolution: 'day' })).toBe(false);
		expect(isStartOfMonth(date, { resolution: 'hour' })).toBe(false);
		expect(isStartOfMonth(date, { resolution: 'minute' })).toBe(false);
		expect(isStartOfMonth(date, { resolution: 'second' })).toBe(false);
	});
	test('month,day', () => {
		const date = new Date('2023-02-01T01:02:03.456');
		expect(isStartOfMonth(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfMonth(date, { resolution: 'month' })).toBe(true);
		expect(isStartOfMonth(date, { resolution: 'day' })).toBe(true);
		expect(isStartOfMonth(date, { resolution: 'hour' })).toBe(false);
		expect(isStartOfMonth(date, { resolution: 'minute' })).toBe(false);
		expect(isStartOfMonth(date, { resolution: 'second' })).toBe(false);
	});
	test('month,day, hour', () => {
		const date = new Date('2023-02-01T00:02:03.456');
		expect(isStartOfMonth(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfMonth(date, { resolution: 'month' })).toBe(true);
		expect(isStartOfMonth(date, { resolution: 'day' })).toBe(true);
		expect(isStartOfMonth(date, { resolution: 'hour' })).toBe(true);
		expect(isStartOfMonth(date, { resolution: 'minute' })).toBe(false);
		expect(isStartOfMonth(date, { resolution: 'second' })).toBe(false);
	});
	test('month,day, hour, minute', () => {
		const date = new Date('2023-02-01T00:00:03.456');
		expect(isStartOfMonth(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfMonth(date, { resolution: 'month' })).toBe(true);
		expect(isStartOfMonth(date, { resolution: 'day' })).toBe(true);
		expect(isStartOfMonth(date, { resolution: 'hour' })).toBe(true);
		expect(isStartOfMonth(date, { resolution: 'minute' })).toBe(true);
		expect(isStartOfMonth(date, { resolution: 'second' })).toBe(false);
	});
	test('month,day, hour, minute, second', () => {
		const date = new Date('2023-02-01T00:00:00.456');
		expect(isStartOfMonth(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfMonth(date, { resolution: 'month' })).toBe(true);
		expect(isStartOfMonth(date, { resolution: 'day' })).toBe(true);
		expect(isStartOfMonth(date, { resolution: 'hour' })).toBe(true);
		expect(isStartOfMonth(date, { resolution: 'minute' })).toBe(true);
		expect(isStartOfMonth(date, { resolution: 'second' })).toBe(true);
	});
	test('month,day, hour, minute, second,millisecond', () => {
		const date = new Date('2023-02-01T00:00:00.000');
		expect(isStartOfMonth(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfMonth(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfMonth(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfMonth(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfMonth(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfMonth(date, { resolution: 'year' })).toBe(true);
	});
});

describe('end of month', () => {
	test('month', () => {
		const date = new Date('2023-03-04T01:02:03.456');
		expect(isEndOfMonth(date, { resolution: 'year' })).toBe(true);
		expect(isEndOfMonth(date, { resolution: 'month' })).toBe(true);
		expect(isEndOfMonth(date, { resolution: 'day' })).toBe(false);
		expect(isEndOfMonth(date, { resolution: 'hour' })).toBe(false);
		expect(isEndOfMonth(date, { resolution: 'minute' })).toBe(false);
		expect(isEndOfMonth(date, { resolution: 'second' })).toBe(false);
	});
	test('month,day', () => {
		const date = new Date('2023-03-31T01:02:03.456');
		expect(isEndOfMonth(date, { resolution: 'year' })).toBe(true);
		expect(isEndOfMonth(date, { resolution: 'month' })).toBe(true);
		expect(isEndOfMonth(date, { resolution: 'day' })).toBe(true);
		expect(isEndOfMonth(date, { resolution: 'hour' })).toBe(false);
		expect(isEndOfMonth(date, { resolution: 'minute' })).toBe(false);
		expect(isEndOfMonth(date, { resolution: 'second' })).toBe(false);
	});
	test('month day, hour', () => {
		const date = new Date('2023-03-31T23:02:03.456');
		expect(isEndOfMonth(date, { resolution: 'year' })).toBe(true);
		expect(isEndOfMonth(date, { resolution: 'month' })).toBe(true);
		expect(isEndOfMonth(date, { resolution: 'day' })).toBe(true);
		expect(isEndOfMonth(date, { resolution: 'hour' })).toBe(true);
		expect(isEndOfMonth(date, { resolution: 'minute' })).toBe(false);
		expect(isEndOfMonth(date, { resolution: 'second' })).toBe(false);
	});
	test('month,day, hour, minute', () => {
		const date = new Date('2023-03-31T23:59:03.456');
		expect(isEndOfMonth(date, { resolution: 'year' })).toBe(true);
		expect(isEndOfMonth(date, { resolution: 'month' })).toBe(true);
		expect(isEndOfMonth(date, { resolution: 'day' })).toBe(true);
		expect(isEndOfMonth(date, { resolution: 'hour' })).toBe(true);
		expect(isEndOfMonth(date, { resolution: 'minute' })).toBe(true);
		expect(isEndOfMonth(date, { resolution: 'second' })).toBe(false);
	});
	test('month,day, hour, minute, second', () => {
		const date = new Date('2023-03-31T23:59:59.456');
		expect(isEndOfMonth(date, { resolution: 'year' })).toBe(true);
		expect(isEndOfMonth(date, { resolution: 'month' })).toBe(true);
		expect(isEndOfMonth(date, { resolution: 'day' })).toBe(true);
		expect(isEndOfMonth(date, { resolution: 'hour' })).toBe(true);
		expect(isEndOfMonth(date, { resolution: 'minute' })).toBe(true);
		expect(isEndOfMonth(date, { resolution: 'second' })).toBe(true);
	});
	test('month,day, hour, minute, second,millisecond', () => {
		const date = new Date('2023-03-31T23:59:59.999');
		expect(isEndOfMonth(date, { resolution: 'year' })).toBe(true);
		expect(isEndOfMonth(date, { resolution: 'year' })).toBe(true);
		expect(isEndOfMonth(date, { resolution: 'year' })).toBe(true);
		expect(isEndOfMonth(date, { resolution: 'year' })).toBe(true);
		expect(isEndOfMonth(date, { resolution: 'year' })).toBe(true);
		expect(isEndOfMonth(date, { resolution: 'year' })).toBe(true);
	});
});

describe('start of day', () => {
	test('day', () => {
		const date = new Date('2023-02-03T01:02:03.456');
		expect(isStartOfDay(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfDay(date, { resolution: 'month' })).toBe(true);
		expect(isStartOfDay(date, { resolution: 'day' })).toBe(true);
		expect(isStartOfDay(date, { resolution: 'hour' })).toBe(false);
		expect(isStartOfDay(date, { resolution: 'minute' })).toBe(false);
		expect(isStartOfDay(date, { resolution: 'second' })).toBe(false);
	});
	test('day, hour', () => {
		const date = new Date('2023-02-03T00:02:03.456');
		expect(isStartOfDay(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfDay(date, { resolution: 'month' })).toBe(true);
		expect(isStartOfDay(date, { resolution: 'day' })).toBe(true);
		expect(isStartOfDay(date, { resolution: 'hour' })).toBe(true);
		expect(isStartOfDay(date, { resolution: 'minute' })).toBe(false);
		expect(isStartOfDay(date, { resolution: 'second' })).toBe(false);
	});
	test('day, hour, minute', () => {
		const date = new Date('2023-02-03T00:00:03.456');
		expect(isStartOfDay(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfDay(date, { resolution: 'month' })).toBe(true);
		expect(isStartOfDay(date, { resolution: 'day' })).toBe(true);
		expect(isStartOfDay(date, { resolution: 'hour' })).toBe(true);
		expect(isStartOfDay(date, { resolution: 'minute' })).toBe(true);
		expect(isStartOfDay(date, { resolution: 'second' })).toBe(false);
	});
	test('day, hour, minute, second', () => {
		const date = new Date('2023-02-03T00:00:00.456');
		expect(isStartOfDay(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfDay(date, { resolution: 'month' })).toBe(true);
		expect(isStartOfDay(date, { resolution: 'day' })).toBe(true);
		expect(isStartOfDay(date, { resolution: 'hour' })).toBe(true);
		expect(isStartOfDay(date, { resolution: 'minute' })).toBe(true);
		expect(isStartOfDay(date, { resolution: 'second' })).toBe(true);
	});
	test('day, hour, minute, second,millisecond', () => {
		const date = new Date('2023-02-03T00:00:00.000');
		expect(isStartOfDay(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfDay(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfDay(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfDay(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfDay(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfDay(date, { resolution: 'year' })).toBe(true);
	});
});

describe('start of hour', () => {
	test('hour', () => {
		const date = new Date('2023-02-03T04:01:03.456');
		expect(isStartOfHour(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfHour(date, { resolution: 'month' })).toBe(true);
		expect(isStartOfHour(date, { resolution: 'day' })).toBe(true);
		expect(isStartOfHour(date, { resolution: 'hour' })).toBe(true);
		expect(isStartOfHour(date, { resolution: 'minute' })).toBe(false);
		expect(isStartOfHour(date, { resolution: 'second' })).toBe(false);
	});
	test('hour, minute', () => {
		const date = new Date('2023-02-03T04:00:03.456');
		expect(isStartOfHour(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfHour(date, { resolution: 'month' })).toBe(true);
		expect(isStartOfHour(date, { resolution: 'day' })).toBe(true);
		expect(isStartOfHour(date, { resolution: 'hour' })).toBe(true);
		expect(isStartOfHour(date, { resolution: 'minute' })).toBe(true);
		expect(isStartOfHour(date, { resolution: 'second' })).toBe(false);
	});
	test('hour, minute, second', () => {
		const date = new Date('2023-02-03T04:00:00.456');
		expect(isStartOfHour(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfHour(date, { resolution: 'month' })).toBe(true);
		expect(isStartOfHour(date, { resolution: 'day' })).toBe(true);
		expect(isStartOfHour(date, { resolution: 'hour' })).toBe(true);
		expect(isStartOfHour(date, { resolution: 'minute' })).toBe(true);
		expect(isStartOfHour(date, { resolution: 'second' })).toBe(true);
	});
	test('hour, minute, second,millisecond', () => {
		const date = new Date('2023-02-03T04:00:00.000');
		expect(isStartOfHour(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfHour(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfHour(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfHour(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfHour(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfHour(date, { resolution: 'year' })).toBe(true);
	});
});

describe('start of minute', () => {
	test('hour, minute', () => {
		const date = new Date('2023-02-03T04:01:03.456');
		expect(isStartOfMinute(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfMinute(date, { resolution: 'month' })).toBe(true);
		expect(isStartOfMinute(date, { resolution: 'day' })).toBe(true);
		expect(isStartOfMinute(date, { resolution: 'hour' })).toBe(true);
		expect(isStartOfMinute(date, { resolution: 'minute' })).toBe(true);
		expect(isStartOfMinute(date, { resolution: 'second' })).toBe(false);
	});
	test('minute, second', () => {
		const date = new Date('2023-02-03T04:01:00.456');
		expect(isStartOfMinute(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfMinute(date, { resolution: 'month' })).toBe(true);
		expect(isStartOfMinute(date, { resolution: 'day' })).toBe(true);
		expect(isStartOfMinute(date, { resolution: 'hour' })).toBe(true);
		expect(isStartOfMinute(date, { resolution: 'minute' })).toBe(true);
		expect(isStartOfMinute(date, { resolution: 'second' })).toBe(true);
	});
	test('minute, second,millisecond', () => {
		const date = new Date('2023-02-03T04:01:00.000');
		expect(isStartOfMinute(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfMinute(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfMinute(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfMinute(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfMinute(date, { resolution: 'year' })).toBe(true);
		expect(isStartOfMinute(date, { resolution: 'year' })).toBe(true);
	});
});
