import User from './User'

export default interface WorkTime {
	timeFrom: string
	timeTo: string
	dayOfWeek: number
	master: User
}
