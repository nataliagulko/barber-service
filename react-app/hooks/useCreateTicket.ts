import { useState } from 'react'

export const useCreateTicket = () => {
	const [duration, setDuration] = useState(0)
	const [cost, setCost] = useState(0)
	const [currentStep, setCurrentStep] = useState(0)

	const getServiceTime = (t: number) => setDuration(duration + t)
	const getServiceCost = (c: number) => setCost(cost + c)

	const goToNextStep = () => setCurrentStep(c => c + 1)
	const goToPrevStep = () => setCurrentStep(c => c - 1)

	return {
		duration,
		cost,
		currentStep,
		getServiceTime,
		getServiceCost,
		goToNextStep,
		goToPrevStep,
	}
}

export type UseCreateTicket = typeof useCreateTicket
