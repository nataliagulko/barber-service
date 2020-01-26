import { useEffect, useState } from 'react'

import MINUTE_STEP from '../constants/MINUTE_STEP'
import Slot from '../models/Slot'
import moment from 'moment'

interface DisabledTime {
	hour: number
	minutes: number[]
}

const range = (start: number, stop: number, step = 1) =>
	Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step)

export function useTicketTime(slots: Slot[] = []) {
	const [hours, setHours] = useState<number[]>([])
	const [time, setTime] = useState<DisabledTime[]>([])

	useEffect(() => {
		parseSlotsToTime()
	}, [slots.length])

	function isInputDisabled(): boolean {
		return slots && slots.length > 0 ? false : true
	}

	function parseSlotsToTime() {
		let disabledMinutesByHour: DisabledTime[] = []
		let disabledHours: number[] = []

		slots.forEach(s => {
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
