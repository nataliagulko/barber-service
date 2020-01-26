import Holiday from '../models/Holiday'
import { holidays } from './routes'

export const holidayApi = {
	list: async (masterId: number): Promise<Holiday[]> => {
		const res = await fetch(holidays.list(masterId), {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json; charset=utf-8',
			},
		})

		if (!res.ok) throw new Error('Error occured' + res.statusText)

		return await res.json()
	},
}

export type HolidayApi = typeof holidayApi
