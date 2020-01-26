import { act, renderHook } from '@testing-library/react-hooks'

import Slot from '../models/Slot'
import { given } from '../test/dsl/index'
import moment from 'moment'
import { useTicketTime } from './useTicketTime'

const slots: Slot[] = [
	given
		.slot()
		.withStart('2020-01-23 00:45:00')
		.withEnd('2020-01-23 03:10:00')
		.build(),
	given
		.slot()
		.withStart('2020-01-23 09:30:00')
		.withEnd('2020-01-23 11:20:00')
		.build(),
]

describe('useTicketTime', () => {
	it('should be disabled when slots were not passed', () => {
		const { result } = renderHook(() => useTicketTime())
		let isInputDisabled = false

		act(() => {
			isInputDisabled = result.current.isInputDisabled()
		})

		expect(isInputDisabled).toBeTruthy()
	})

	it('should not be disabled when slots were passed', () => {
		const { result } = renderHook(() => useTicketTime(slots))
		let isInputDisabled = true

		act(() => {
			isInputDisabled = result.current.isInputDisabled()
		})

		expect(isInputDisabled).toBeFalsy()
	})

	it('should disable hours based on slots', () => {
		const { result } = renderHook(() => useTicketTime(slots))
		let disabledHours: number[] = []

		act(() => {
			disabledHours = result.current.setDisabledHours()
		})

		expect(disabledHours).toEqual<number[]>([0, 1, 2, 3, 9, 10, 11])
	})

	it.skip('should disable hours and minutes in past', () => {
		const { result } = renderHook(() => useTicketTime(slots))
		let disabledHours: number[] = []
		const now = moment().hour()

		act(() => {
			disabledHours = result.current.setDisabledHours()
		})

		const hours = [0, 1, 2, 3, 9, 10, 11, now].sort((a, b) => a - b)
		expect(disabledHours).toEqual<number[]>(hours)
	})

	it.each`
		hour  | expectedMinutes
		${0}  | ${[45, 50, 55]}
		${9}  | ${[30, 35, 40, 45, 50, 55]}
		${3}  | ${[0, 5, 10]}
		${11} | ${[0, 5, 10, 15, 20]}
	`('should disable $expectedMinutes minutes for $hour hour', ({ hour, expectedMinutes }) => {
		const { result } = renderHook(() => useTicketTime(slots))
		let disabledMinutes: number[] = []
		act(() => {
			result.current.setDisabledHours()
		})

		act(() => {
			disabledMinutes = result.current.setDisabledMinutesBy(hour)
		})

		expect(disabledMinutes).toEqual<number[]>(expectedMinutes)
	})

	// не давать выбирать прошедшие часы
	// час должен быть доступен, если есть доступные для записи минуты
})
