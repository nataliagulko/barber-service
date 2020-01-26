import HolidayModel from '../../models/Holiday'
import User from './User'

export default class Holiday implements HolidayModel {
	id: number
	dateFrom: string
	dateTo: string
	master: User
	comment: string
	maxTime: number

	constructor() {
		this.id = 0
		this.dateFrom = ''
		this.dateTo = ''
		this.master = new User()
		this.comment = ''

		this.maxTime = 0
	}
}
