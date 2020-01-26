import User from './User'
import UserModel from '../../models/User'

export default class UserBuilder {
	user: UserModel

	constructor() {
		this.user = new User()
	}

	withName(firstname: string, secondname: string): UserBuilder {
		this.user = {
			...this.user,
			firstname,
			secondname,
		}
		return this
	}

	withId(id: number): UserBuilder {
		this.user = {
			id,
		}
		return this
	}

	build(): UserModel {
		return this.user
	}
}
