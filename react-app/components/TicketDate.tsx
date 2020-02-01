import { Button, DatePicker } from 'antd'
import DATE_FORMAT, { DATE_STRING } from '../constants/DATE_FORMAT'

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
	const { dates, isDisabled, handleClick } = useTicketDate(setSlots, holidays, nonWorkDays, duration, master)

	return (
		<div data-testid="ticket-date">
			{dates.map(d => (
				<Button key={d.toString()} size="large" disabled={isDisabled} onClick={handleClick}>
					{d.format(DATE_STRING)}
				</Button>
			))}
		</div>
	)
}
