import Service from '../models/Service'
import fetch from 'isomorphic-unfetch'
import { services } from './routes'

export const serviceApi = {
	list: async (masterId: number): Promise<Service[]> => {
		// filter by masterId
		const res = await fetch(services.list(), {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json; charset=utf-8',
			},
		})

		if (!res.ok) throw new Error('Error occured' + res.statusText)

		return await res.json()
	},
}

export type ServiceApi = typeof serviceApi
