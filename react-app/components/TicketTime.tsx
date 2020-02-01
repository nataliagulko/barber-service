import { Button, TimePicker } from 'antd'

import { FC } from 'react'
import MINUTE_STEP from '../constants/MINUTE_STEP'
import Slot from '../models/Slot'
import { TIME_FORMAT } from '../constants/DATE_FORMAT'
import moment from 'moment'
import { slots } from '../api/routes'
import { useTicketTime } from '../hooks/useTicketTime'

interface Props {
	invertedSlots: Slot[]
}

export const TicketTime: FC<Props> = ({ invertedSlots }) => {
	const { time } = useTicketTime(invertedSlots)

	return (
		<>
			{time.map(t => (
				<Button key={t} size="large" style={{ marginBottom: '8px', marginRight: '6px' }}>
					{t}
				</Button>
			))}
		</>
	)
}
