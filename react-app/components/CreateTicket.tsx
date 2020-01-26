import { Col, Form, Input, Row, TimePicker } from 'antd'
import { FC, useEffect, useState } from 'react'
import moment, { Moment } from 'moment'

import Holiday from '../models/Holiday'
import { Money } from './Money'
import Service from '../models/Service'
import { ServiceList } from './ServiceList'
import Slot from '../models/Slot'
import { TicketDate } from './TicketDate'
import { TicketTime } from './TicketTime'
import User from '../models/User'
import { slotsApi } from '../api/slots'

interface Props {
	services: Service[]
	client: User
	master: User
	holidays: Holiday[]
	nonWorkDays: number[]
}

export const CreateTicket: FC<Props> = ({ services, client, master, holidays, nonWorkDays }) => {
	const [duration, setDuration] = useState(0)
	const [cost, setCost] = useState(0)
	const [slots, setSlots] = useState<Slot[]>([])

	const getServiceTime = (t: number) => setDuration(duration + t)
	const getServiceCost = (c: number) => setCost(cost + c)
	// const getSlots = async () => await slotsApi.get(date, duration, master.id).then(res => {
	// 	setSlots(res)
	// })

	return (
		<Row>
			<Col xs={{ span: 24 }}>
				<Form layout="horizontal">
					<Form.Item label="Имя">
						<span className="ant-form-text" role="first-name">
							{client.firstname}
						</span>
					</Form.Item>
					<Form.Item label="Фамилия">
						<span className="ant-form-text" role="second-name">
							{client.secondname}
						</span>
					</Form.Item>
					<Input hidden value={master.id} data-testid="master-id" />
					<Form.Item label="Услуги">
						<ServiceList
							services={services}
							getServiceTime={getServiceTime}
							getServiceCost={getServiceCost}
						/>
					</Form.Item>
					<Form.Item label="Дата" htmlFor="ticket-date">
						<TicketDate
							holidays={holidays}
							nonWorkDays={nonWorkDays}
							duration={duration}
							master={master}
							setSlots={setSlots}
						/>
					</Form.Item>
					<Form.Item label="Время" htmlFor="ticket-time">
						<TicketTime slots={slots} />
					</Form.Item>
					<Form.Item label="Комментарий" htmlFor="ticket-comment">
						<Input.TextArea id="ticket-comment" />
					</Form.Item>
					<Form.Item label="Продолжительность">
						<span className="ant-form-text">
							<span role="duration">{duration}</span> мин
						</span>
					</Form.Item>
					<Form.Item label="Стоимость">
						<Money sum={cost} role="cost" />
					</Form.Item>
				</Form>
			</Col>
		</Row>
	)
}
