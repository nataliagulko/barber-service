import { nonWorkDays } from './routes'

export const nonWorkDaysApi = {
	list: async (): Promise<number[]> => {
		const res = await fetch(nonWorkDays.list(), {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json; charset=utf-8',
			},
		})

		if (!res.ok) throw new Error('Error occured' + res.statusText)

		return await res.json()
	},
}

export type NonWorkDaysApi = typeof nonWorkDaysApi
