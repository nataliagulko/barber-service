import ServiceModel from '../../models/Service'
import User from '../../models/User'

export default class Service implements ServiceModel {
	id: number
	cost: number
	name: string
	partOfList: boolean
	time: number
	masters: User[]

	constructor() {
		this.id = 1
		this.cost = 100
		this.name = 'service 1'
		this.partOfList = false
		this.time = 60
		this.masters = []
	}
}
