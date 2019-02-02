import Service from "@ember/service";

export default class TicketService extends Service {
	activeStep: string
	ticket: any
	servicesByMaster: any[]
	phone: string
	isNewClient: boolean
	validationMessage: string
	hint: string

	changeStep(prevStep: string, nextStep: string): void
	toggleMaster(master: any, event: MouseEvent): void
	getServicesByMaster(): void
	toggleServiceItem(service: any, event: MouseEvent): void
	getHolidays(): void
	onTicketDateChange(selectedDate: any): void
	getTimeSlots(): void
	onTicketTimeChange(selectedTime: any): void
	inputPhone(value: string): void
	removeLastNumber(): void
	clearPhoneNumber(): void
	saveClient(name: string): void
	resetProperties(): void
	saveTicket(): void
}

declare module '@ember/service' {
	interface Registry {
		"ticket-service": TicketService;
	}
}