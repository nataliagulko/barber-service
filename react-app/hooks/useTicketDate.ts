import DATE_FORMAT, { FORMAT_WITHOUT_TIMEZONE } from '../constants/DATE_FORMAT'

import Holiday from '../models/Holiday'
import Slot from '../models/Slot'
import User from '../test/dsl/User'
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
	function isDisabledDate(currentDate: moment.Moment | undefined): boolean {
		if (currentDate) {
			const isNonWorkDay = nonWorkDays.includes(currentDate.day())

			const today = moment()
			const isPastDay = currentDate.isBefore(today)

			const threeMonthLater = today.add(3, 'month')
			const isMoreThanThreeMonth = currentDate.isSameOrAfter(threeMonthLater, 'day')

			let isHoliday = false

			for (let i = 0; i < holidays.length; i++) {
				if (disableDateByHoliday(holidays[i], currentDate)) {
					isHoliday = true
				} else {
					continue
				}
			}

			return isNonWorkDay || isPastDay || isMoreThanThreeMonth || isHoliday
		}
		return false
	}

	function isInputDisabled(): boolean {
		return master && duration > 0 ? false : true
	}

	async function handleDateChange(value: moment.Moment | null) {
		if (value && master && duration > 0) {
			const slots = await slotsApi.get(value.format(DATE_FORMAT), duration, master.id)
			setSlots(slots)
		}
	}

	return {
		isDisabledDate,
		handleDateChange,
		isInputDisabled,
	}
}
