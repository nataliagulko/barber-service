import { FC } from 'react'
import { List } from 'antd'
import Service from '../models/Service'
import { ServiceItem } from './ServiceItem'

interface ServiceListProps {
	services: Service[]
	getServiceTime: (time: number) => void
	getServiceCost: (cost: number) => void
}

export const ServiceList: FC<ServiceListProps> = ({ services, getServiceTime, getServiceCost }) => {
	const handleItemClick = (time: number, cost: number) => {
		getServiceTime(time)
		getServiceCost(cost)
	}

	return services ? (
		<div role="service-list">
			<List
				bordered
				dataSource={services}
				renderItem={(service: Service) => <ServiceItem service={service} handleClick={handleItemClick} />}
			/>
		</div>
	) : null
}
