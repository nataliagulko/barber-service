import { useEffect, useState } from 'react'

import MINUTE_STEP from '../constants/MINUTE_STEP'
import Slot from '../models/Slot'
import { TIME_FORMAT } from '../constants/DATE_FORMAT'
import moment from 'moment'

interface DisabledTime {
	hour: number
	minutes: number[]
}

const range = (start: number, stop: number, step = 1) =>
	Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step)

export const parseSlotsToAvailableTime = (slots: Slot[]): string[] => {
	let availableTime: string[] = []

	slots.forEach(slot => {
		const start = moment(slot.start)
		const end = moment(slot.end)

		availableTime.push(start.format(TIME_FORMAT))

		let timeRange = moment(slot.start).add(5, 'm')
		while (timeRange.isBetween(start, end)) {
			availableTime.push(timeRange.format(TIME_FORMAT))
			timeRange = timeRange.add(5, 'm')
		}

		availableTime.push(end.format(TIME_FORMAT))
	})

	return availableTime
}

export function useTicketTime(invertedSlots: Slot[] = []) {
	const [hours, setHours] = useState<number[]>([])
	const [time, setTime] = useState<DisabledTime[]>([])

	useEffect(() => {
		parseSlotsToTime()
	}, [invertedSlots.length])

	function isInputDisabled(): boolean {
		return invertedSlots && invertedSlots.length > 0 ? false : true
	}

	function parseSlotsToTime() {
		let disabledMinutesByHour: DisabledTime[] = []
		let disabledHours: number[] = []

		invertedSlots.forEach(s => {
			const startHour = moment(s.start).hour()
			const endHour = moment(s.end).hour()
			const hourRange = range(startHour, endHour)

			disabledHours = [...disabledHours, ...hourRange]

			const startMinutes = moment(s.start).minute()
			const endMinutes = moment(s.end).minute()

			disabledMinutesByHour = [
				...disabledMinutesByHour,
				{ hour: startHour, minutes: range(startMinutes, 55, MINUTE_STEP) },
				{ hour: endHour, minutes: range(0, endMinutes, MINUTE_STEP) },
			]
		})

		setHours(disabledHours)
		setTime(disabledMinutesByHour)
	}

	function setDisabledHours(): number[] {
		return hours
	}

	function setDisabledMinutesBy(hour: number): number[] {
		const disabledTimeByHour = time.filter(dt => dt.hour === hour)
		const [minutes] = disabledTimeByHour.map(({ minutes }) => minutes)
		return minutes
	}

	return {
		setDisabledHours,
		setDisabledMinutesBy,
		isInputDisabled,
	}
}
