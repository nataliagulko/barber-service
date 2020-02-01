import { act, renderHook } from '@testing-library/react-hooks'
import { parseSlotsToAvailableTime, useTicketTime } from './useTicketTime'

import Slot from '../models/Slot'
import { given } from '../test/dsl/index'
import moment from 'moment'

const invertedSlots: Slot[] = [
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
	it('should return available for select time', () => {
		const { result } = renderHook(() => useTicketTime(invertedSlots))

		expect(result.current.time).toHaveLength(53)
	})
})

const slots: Slot[] = [
	given
		.slot()
		.withStart('2020-01-23 09:00:00')
		.withEnd('2020-01-23 09:15:00')
		.build(),
	given
		.slot()
		.withStart('2020-01-23 10:50:00')
		.withEnd('2020-01-23 11:10:00')
		.build(),
	given
		.slot()
		.withStart('2020-01-23 14:00:00')
		.withEnd('2020-01-23 14:20:00')
		.build(),
]

describe('parseSlotToAvailableTime', () => {
	it('should return first slot.start time as first available time', () => {
		const availableTime = parseSlotsToAvailableTime(slots)

		expect(availableTime[0]).toEqual('09:00')
	})

	it('should return last slot.end time as last available time', () => {
		const availableTime = parseSlotsToAvailableTime(slots)

		expect(availableTime.slice(-1)[0]).toEqual('14:20')
	})

	it('should return range of time from first slot.start to last slot.end', () => {
		const availableTime = parseSlotsToAvailableTime(slots)

		expect(availableTime).toEqual([
			'09:00',
			'09:05',
			'09:10',
			'09:15',
			'10:50',
			'10:55',
			'11:00',
			'11:05',
			'11:10',
			'14:00',
			'14:05',
			'14:10',
			'14:15',
			'14:20',
		])
	})
})
