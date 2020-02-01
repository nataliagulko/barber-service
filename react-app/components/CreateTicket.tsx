import { Button, Col, Row, Steps, Typography } from 'antd'
import { FC, ReactElement, useState } from 'react'

import Holiday from '../models/Holiday'
import Service from '../models/Service'
import { ServiceList } from './ServiceList'
import Slot from '../models/Slot'
import { TicketDate } from './TicketDate'
import { TicketTime } from './TicketTime'
import User from '../models/User'
import { useCreateTicket } from '../hooks/useCreateTicket'

const { Text } = Typography

interface Props {
	services: Service[]
	client: User
	master: User
	holidays: Holiday[]
	nonWorkDays: number[]
}

interface Step {
	title: string
	disabled: boolean
	content: ReactElement
}

export const CreateTicket: FC<Props> = ({ services, master, holidays, nonWorkDays }) => {
	const [invertedSlots, setInvertedSlots] = useState<Slot[]>([])
	const {
		duration,
		cost,
		currentStep,
		getServiceTime,
		getServiceCost,
		goToNextStep,
		goToPrevStep,
	} = useCreateTicket()

	// TODO: Comment step and finish btn
	const steps: Step[] = [
		{
			title: 'Услуги',
			disabled: !(master && duration > 0),
			content: (
				<ServiceList services={services} getServiceTime={getServiceTime} getServiceCost={getServiceCost} />
			),
		},
		{
			title: 'Дата',
			disabled: !(invertedSlots && invertedSlots.length),
			content: (
				<TicketDate
					holidays={holidays}
					nonWorkDays={nonWorkDays}
					duration={duration}
					master={master}
					setInvertedSlots={setInvertedSlots}
				/>
			),
		},
		{
			title: 'Время',
			disabled: false,
			content: <TicketTime invertedSlots={invertedSlots} />,
		},
	]

	return (
		<>
			<Steps current={currentStep}>
				{steps.map(item => (
					<Steps.Step key={item.title} title={item.title} />
				))}
			</Steps>
			<div className="steps-content">{steps[currentStep].content}</div>
			<Row>
				<Col span={12}>
					<Text strong>Продолжительность</Text>
				</Col>
				<Col span={12}>
					<span data-testid="ticket-duration">{duration}</span>
				</Col>
			</Row>
			<Row>
				<Col span={12}>
					<Text strong>Стоимость</Text>
				</Col>
				<Col span={12}>
					<span data-testid="ticket-cost">{cost}</span>
				</Col>
			</Row>
			{currentStep > 0 && <Button onClick={goToPrevStep}>Назад</Button>}
			{currentStep < steps.length - 1 && (
				<Button type="primary" onClick={goToNextStep} disabled={steps[currentStep].disabled}>
					Дальше
				</Button>
			)}
		</>
	)
}
