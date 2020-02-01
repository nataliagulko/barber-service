import { Button, Calendar, Row, Typography } from 'antd'

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
	setInvertedSlots: (slots: Slot[]) => void
}

export const TicketDate: FC<Props> = ({ holidays, nonWorkDays, duration, master, setInvertedSlots }) => {
	const { isDisabledDate, handleDateChange } = useTicketDate(
		setInvertedSlots,
		holidays,
		nonWorkDays,
		duration,
		master,
	)

	const handleDisabledDate = (currentDate: moment.Moment | undefined) => isDisabledDate(currentDate)
	const handleChange = (value: moment.Moment | undefined) => handleDateChange(value)

	return (
		<Calendar
			fullscreen={false}
			disabledDate={handleDisabledDate}
			onSelect={handleChange}
			headerRender={({ value }) => {
				return (
					<Row type="flex" justify="space-between" align="middle" style={{ padding: '8px 5px' }}>
						{/* TODO: месяцы можно листать кнопками влево/вправо */}
						<Button icon="left" />
						<Typography.Text>{value.format('MMMM')}</Typography.Text>
						<Button icon="right" />
					</Row>
				)
			}}
		/>
	)
}
