import { act, renderHook } from '@testing-library/react-hooks'

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
		${moment(holidays[0].dateFrom)}               | ${'first day of first holiday'}  | ${holidays} | ${[]}
		${moment(holidays[0].dateFrom).add(1, 'day')} | ${'second day of first holiday'} | ${holidays} | ${[]}
		${moment(holidays[1].dateFrom)}               | ${'first day of second holiday'} | ${holidays} | ${[]}
		${moment(holidays[1].dateTo)}                 | ${'last day of second holiday'}  | ${holidays} | ${[]}
	`('should disable $dayString', ({ day, holidays, nonWorkDays }) => {
		const { result } = renderHook(() => useTicketDate(setSlots, holidays, nonWorkDays))
		let isDateDisabled = false

		act(() => {
			isDateDisabled = result.current.isDisabled()(day)
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
			isDateDisabled = result.current.isDisabled()(day)
		})

		expect(isDateDisabled).toBeFalsy()
	})

	it('should call slotsApi.get on date change', () => {
		const today = moment()
		const { result } = renderHook(() => useTicketDate(setSlots, [], [], duration, master))

		act(() => {
			result.current.handleClick()(today)
		})

		expect(slotsApi.get).toHaveBeenCalled()
	})
})
