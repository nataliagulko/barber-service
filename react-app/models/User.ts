export default interface User {
	id: number
	username?: string
	password?: string
	email?: string
	firstname?: string
	secondname?: string
	phone?: string
	masterTZ?: string

	enabled?: boolean
	accountExpired?: boolean
	accountLocked?: boolean
	passwordExpired?: boolean
}
