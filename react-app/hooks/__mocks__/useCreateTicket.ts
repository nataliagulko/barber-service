import { UseCreateTicket } from '../useCreateTicket'

export const useCreateTicket: UseCreateTicket = jest.fn(() => ({
	duration: 0,
	cost: 0,
	currentStep: 0,
	getServiceTime: jest.fn,
	getServiceCost: jest.fn,
	goToNextStep: jest.fn,
	goToPrevStep: jest.fn,
}))
