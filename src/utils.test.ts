import { describe, expect, test } from 'vitest';
import { isSameDay, isSameMonth, isSameYear } from './utils.js';

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
