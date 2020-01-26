import Slot from '../models/Slot'
import { slots } from './routes'

export const slotsApi = {
	get: async (date: string, time: number, id: number, currentId?: number): Promise<Slot[]> => {
		const res = await fetch(slots.get(date, time, id, currentId), {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json; charset=utf-8',
			},
		})

		if (!res.ok) throw new Error('Error occured' + res.statusText)

		return await res.json()
	},
}

export type SlotsApi = typeof slotsApi
