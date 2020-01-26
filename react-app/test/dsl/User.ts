import UserModel from '../../models/User'

export default class User implements UserModel {
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

	constructor() {
		this.id = 0
		this.username = ''
		this.password = ''
		this.email = ''
		this.firstname = ''
		this.secondname = ''
		this.phone = ''
		this.masterTZ = ''
		this.enabled = true
		this.accountExpired = false
		this.accountLocked = false
		this.passwordExpired = false
	}
}
