import User from './User'

export default interface Holiday {
	id: number
	dateFrom: string
	dateTo: string
	master: User
	comment: string
	maxTime: number
}
