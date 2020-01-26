import { Checkbox, Form, List } from 'antd'
import { FC, SyntheticEvent, createRef } from 'react'

import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { Money } from './Money'
import Service from '../models/Service'

interface ServiceItemProps {
	service: Service
	handleClick: (time: number, cost: number) => void
}

export const ServiceItem: FC<ServiceItemProps> = ({ service, handleClick }) => {
	const handleCheckboxClick = (e: CheckboxChangeEvent) => {
		const isChecked = e.target.checked
		const time = isChecked ? service.time : -service.time
		const cost = isChecked ? service.cost : -service.cost

		handleClick(time, cost)
	}

	return (
		<List.Item role="service-item" key={service.id}>
			<Form.Item>
				<Checkbox data-testid="service-checkbox" onChange={handleCheckboxClick}>
					{service.name}
				</Checkbox>
			</Form.Item>
			<Money sum={service.cost} role="service-cost" />
			<span>
				<span role="service-time">{service.time}</span> мин
			</span>
		</List.Item>
	)
}
