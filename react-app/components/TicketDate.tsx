import { Button, DatePicker } from 'antd'

import DATE_FORMAT from '../constants/DATE_FORMAT'
import { FC } from 'react'
import Holiday from '../models/Holiday'
import Slot from '../models/Slot'
import User from '../test/dsl/User'
import moment from 'moment'
import { useTicketDate } from '../hooks/useTicketDate'

interface Props {
	holidays: Holiday[]
	nonWorkDays: number[]
	duration: number
	master: User
	setSlots: (slots: Slot[]) => void
}

export const TicketDate: FC<Props> = ({ holidays, nonWorkDays, duration, master, setSlots }) => {
	const { isInputDisabled, isDisabledDate, handleDateChange, dates, getDates } = useTicketDate(
		setSlots,
		holidays,
		nonWorkDays,
		duration,
		master,
	)

	const isDisabled = isInputDisabled()

	const handleDisabledDate = (currentDate: moment.Moment | undefined) => isDisabledDate(currentDate)
	const handleChange = (value: moment.Moment | null) => handleDateChange(value)

	return (
		<>
			<DatePicker
				id="ticket-date"
				data-testid="ticket-date"
				showToday={false}
				format={DATE_FORMAT}
				disabled={isDisabled}
				disabledDate={handleDisabledDate}
				onChange={handleChange}
			/>

			<div>
				{dates.map(d => (
					<Button key={d.toString()} size="large">
						{d.format(DATE_FORMAT)}
					</Button>
				))}
			</div>
		</>
	)
}
