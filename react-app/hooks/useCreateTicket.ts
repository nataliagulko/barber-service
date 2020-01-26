import { useState } from 'react'

export const useCreateTicket = () => {
	const [duration, setDuration] = useState(0)
	const [cost, setCost] = useState(0)

	const getServiceTime = (t: number) => setDuration(duration + t)
	const getServiceCost = (c: number) => setCost(cost + c)

	return {
		duration,
		cost,
		getServiceTime,
		getServiceCost,
	}
}
