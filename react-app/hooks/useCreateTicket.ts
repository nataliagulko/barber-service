import { useState } from 'react'

export const useCreateTicket = () => {
	const [duration, setDuration] = useState(0)
	const [cost, setCost] = useState(0)
	const [current, setCurrent] = useState(0)

	const getServiceTime = (t: number) => setDuration(duration + t)
	const getServiceCost = (c: number) => setCost(cost + c)

	const next = () => setCurrent(c => c + 1)
	// const prev = () => setCurrent(c => c - 1)

	return {
		duration,
		cost,
		current,
		getServiceTime,
		getServiceCost,
		next,
	}
}
