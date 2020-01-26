import User from './User'

export default interface Service {
	id: number
	name: string
	cost: number
	time: number
	partOfList: boolean
	masters: User[]
}
