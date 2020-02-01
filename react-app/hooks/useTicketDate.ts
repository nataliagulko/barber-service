import DATE_FORMAT, { FORMAT_WITHOUT_TIMEZONE } from '../constants/DATE_FORMAT'
import { useEffect, useState } from 'react'

import Holiday from '../models/Holiday'
import Slot from '../models/Slot'
import User from '../test/dsl/User'
import { getDatesArray } from '../utils/getDatesArray'
import moment from 'moment'
import { slotsApi } from '../api/slots'

function disableDateByHoliday(holiday: Holiday, currentDate: moment.Moment) {
	const dateFrom = moment(holiday.dateFrom, FORMAT_WITHOUT_TIMEZONE)
	const dateTo = moment(holiday.dateTo, FORMAT_WITHOUT_TIMEZONE)
	return currentDate.isBetween(dateFrom, dateTo, 'day', '[]')
}

export function useTicketDate(
	setSlots: (slots: Slot[]) => void,
	holidays: Holiday[] = [],
	nonWorkDays: number[] = [],
	duration: number = 0,
	master?: User,
) {
	const [dates, setDates] = useState<moment.Moment[]>([])

	useEffect(() => {
		const getDates = () => setDates(getDatesArray(moment(), 30))

		getDates()
	}, [])

	const isDisabled = () => (currentDate: moment.Moment): boolean => {
		console.log(currentDate)
		if (currentDate) {
			const isNonWorkDay = nonWorkDays.includes(currentDate.day())

			let isHoliday = false

			for (let i = 0; i < holidays.length; i++) {
				if (disableDateByHoliday(holidays[i], currentDate)) {
					isHoliday = true
				} else {
					continue
				}
			}

			return isNonWorkDay || isHoliday
		}

		return false
	}

	const handleClick = () => async (value: moment.Moment | null) => {
		if (value && master && duration > 0) {
			const slots = await slotsApi.get(value.format(DATE_FORMAT), duration, master.id)
			setSlots(slots)
		}
	}

	return {
		dates,
		handleClick,
		isDisabled,
	}
}
