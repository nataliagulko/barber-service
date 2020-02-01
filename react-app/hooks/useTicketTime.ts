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

const minuteStep = 5

export const parseSlotsToAvailableTime = (slots: Slot[]): string[] => {
	let availableTime: string[] = []

	slots.forEach(slot => {
		const start = moment(slot.start)
		const end = moment(slot.end)

		availableTime.push(start.format(TIME_FORMAT))

		let timeRange = moment(slot.start).add(minuteStep, 'm')
		while (timeRange.isBetween(start, end)) {
			availableTime.push(timeRange.format(TIME_FORMAT))
			timeRange = timeRange.add(minuteStep, 'm')
		}

		availableTime.push(end.format(TIME_FORMAT))
	})

	return availableTime
}

export function useTicketTime(invertedSlots: Slot[] = []) {
	const [time, setTime] = useState<string[]>([])

	useEffect(() => {
		setTime(parseSlotsToAvailableTime(invertedSlots))
	}, [invertedSlots.length])

	return { time }
}
