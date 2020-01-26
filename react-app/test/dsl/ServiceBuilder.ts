import Service from './Service'
import ServiceModel from '../../models/Service'

export default class ServiceBuilder {
	service: ServiceModel

	constructor() {
		this.service = new Service()
	}

	withName(name: string): ServiceBuilder {
		this.service = {
			...this.service,
			name,
		}

		return this
	}

	withCost(cost: number): ServiceBuilder {
		this.service = {
			...this.service,
			cost,
		}
		return this
	}

	withTime(time: number): ServiceBuilder {
		this.service = {
			...this.service,
			time,
		}

		return this
	}

	withMaster(id: number): ServiceBuilder {
		this.service = {
			...this.service,
			masters: [{ ...this.service.masters, id }],
		}
		return this
	}

	build(): ServiceModel {
		return this.service
	}
}
