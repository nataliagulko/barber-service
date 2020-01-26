import { FC, ReactElement } from 'react'

import Holiday from '../models/Holiday'
import Service from '../models/Service'
import { ServiceList } from './ServiceList'
import { ServiceStepContent } from './ServiceStepContent'
import { Steps } from 'antd'
import User from '../models/User'

interface Props {
	services: Service[]
	client: User
	master: User
	holidays: Holiday[]
	nonWorkDays: number[]
}

interface Step {
	title: string
	content: ReactElement
}

export const CreateTicket: FC<Props> = ({ services }) => {
	const steps: Step[] = [
		{
			title: 'Услуги',
			content: <ServiceList services={services} />,
		},
	]

	return (
		<>
			<Steps current={0}>
				{steps.map(item => (
					<Steps.Step key={item.title} title={item.title} />
				))}
			</Steps>
			<div className="steps-content">{steps[0].content}</div>
		</>
	)
}
