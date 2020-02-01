import { act, renderHook } from '@testing-library/react-hooks'

import DATE_FORMAT from '../constants/DATE_FORMAT'
import { given } from '../test/dsl'
import moment from 'moment'
import { slotsApi } from '../api/slots'
import { useTicketDate } from './useTicketDate'

jest.mock('../api/slots')

const today = given.date().build()

const threeDaysAfter = given
	.date()
	.after(today, 3, 'day')
	.build()

const sixDaysAfter = given
	.date()
	.after(threeDaysAfter, 3, 'day')
	.build()

const nineDaysAfter = given
	.date()
	.after(sixDaysAfter, 3, 'day')
	.build()

const twelveDaysAfter = given
	.date()
	.after(nineDaysAfter, 3, 'day')
	.build()

const holidays = [
	given
		.holiday()
		.withDateFrom(threeDaysAfter)
		.withDateTo(sixDaysAfter)
		.build(),
	given
		.holiday()
		.withDateFrom(nineDaysAfter)
		.withDateTo(twelveDaysAfter)
		.build(),
]

const duration = 60

const master = given
	.user()
	.withId(1)
	.build()

const setSlots = jest.fn()

describe('useTicketDate', () => {
	it.each`
		day                                           | dayString                        | holidays    | nonWorkDays
		${moment(today).day(7)}                       | ${'sunday and monday'}           | ${[]}       | ${[0, 1]}
		${moment(today).subtract(1, 'day')}           | ${'yesterday'}                   | ${[]}       | ${[]}
		${moment(today).add(3, 'month')}              | ${'date more than three month'}  | ${[]}       | ${[]}
		${moment(holidays[0].dateFrom)}               | ${'first day of first holiday'}  | ${holidays} | ${[]}
		${moment(holidays[0].dateFrom).add(1, 'day')} | ${'second day of first holiday'} | ${holidays} | ${[]}
		${moment(holidays[1].dateFrom)}               | ${'first day of second holiday'} | ${holidays} | ${[]}
		${moment(holidays[1].dateTo)}                 | ${'last day of second holiday'}  | ${holidays} | ${[]}
	`('should disable $dayString', ({ day, holidays, nonWorkDays }) => {
		const { result } = renderHook(() => useTicketDate(setSlots, holidays, nonWorkDays))
		let isDateDisabled = false

		act(() => {
			isDateDisabled = result.current.isDisabledDate(day)
		})

		expect(isDateDisabled).toBeTruthy()
	})

	it.each`
		day                                                | dayString                     | holidays
		${moment(holidays[0].dateFrom).subtract(1, 'day')} | ${'day before first holiday'} | ${holidays}
		${moment(holidays[0].dateTo).add(2, 'days')}       | ${'day between holidays'}     | ${holidays}
		${moment(holidays[1].dateTo).add(1, 'day')}        | ${'day after second holiday'} | ${holidays}
	`('should not disable $dayString', ({ day, holidays }) => {
		const { result } = renderHook(() => useTicketDate(setSlots, holidays))
		let isDateDisabled = true

		act(() => {
			isDateDisabled = result.current.isDisabledDate(day)
		})

		expect(isDateDisabled).toBeFalsy()
	})

	it('should be disabled if duration and masterId were not passed', () => {
		const { result } = renderHook(() => useTicketDate(setSlots))
		let isInputDisabled = false

		act(() => {
			isInputDisabled = result.current.isInputDisabled()
		})

		expect(isInputDisabled).toBeTruthy()
	})

	it('should not be disabled if duration and masterId were passed', () => {
		const { result } = renderHook(() => useTicketDate(setSlots, [], [], duration, master))
		let isInputDisabled = true

		act(() => {
			isInputDisabled = result.current.isInputDisabled()
		})

		expect(isInputDisabled).toBeFalsy()
	})

	it('should call slotsApi.get() on date change', () => {
		const today = moment()
		const { result } = renderHook(() => useTicketDate(setSlots, [], [], duration, master))

		act(() => {
			result.current.handleDateChange(today)
		})

		expect(slotsApi.get).toHaveBeenCalled()
	})

	it.each`
		firstDay                             | expected
		${moment()}                          | ${moment()}
		${moment('23.01.2020', DATE_FORMAT)} | ${moment('23.01.2020', DATE_FORMAT)}
	`(
		'should return three dates from $firstDay',
		({ firstDay, expected }: { firstDay: moment.Moment; expected: moment.Moment }) => {
			const { result } = renderHook(() => useTicketDate(setSlots, [], [], 0, undefined, firstDay))

			const dates = result.current.dates
			const [dayFrom, _, dayTo] = dates
			expect(dates).toHaveLength(3)
			expect(dayFrom.format(DATE_FORMAT)).toStrictEqual(expected.format(DATE_FORMAT))
			expect(dayTo.format(DATE_FORMAT)).toStrictEqual(expected.add(2, 'd').format(DATE_FORMAT))
		},
	)
})
