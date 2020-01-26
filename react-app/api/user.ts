import User from '../models/User'
import { users } from './routes'

export const userApi = {
	get: async (id: number): Promise<User> => {
		const res = await fetch(users.get(id), {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json; charset=utf-8',
			},
		})

		if (!res.ok) throw new Error('Error occured' + res.statusText)

		return await res.json()
	},
}

export type UserApi = typeof userApi
