import { FC } from 'react'
import MINUTE_STEP from '../constants/MINUTE_STEP'
import Slot from '../models/Slot'
import { TIME_FORMAT } from '../constants/DATE_FORMAT'
import { TimePicker } from 'antd'
import moment from 'moment'
import { slots } from '../api/routes'
import { useTicketTime } from '../hooks/useTicketTime'

interface Props {
	slots: Slot[]
}

export const TicketTime: FC<Props> = ({ slots }) => {
	const { isInputDisabled, setDisabledHours, setDisabledMinutesBy } = useTicketTime(slots)

	const isDisabled = isInputDisabled()

	const handleDisabledHours = () => setDisabledHours()
	const handleDisabledMinutes = (hour: number) => setDisabledMinutesBy(hour)
	const handleChange = () => {}

	return (
		<TimePicker
			data-testid="ticket-time"
			defaultValue={moment(new Date(), TIME_FORMAT)}
			format={TIME_FORMAT}
			disabled={isDisabled}
			// hideDisabledOptions
			disabledHours={handleDisabledHours}
			disabledMinutes={handleDisabledMinutes}
			minuteStep={MINUTE_STEP}
		/>
	)
}
