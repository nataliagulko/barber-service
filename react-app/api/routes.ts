export const services = {
	base: 'http://localhost:8080/services',
	list: () => services.base,
}

export const users = {
	base: 'http://localhost:8080/users',
	list: () => users.base,
	get: (id: number) => `${users.base}/${id}`,
}

export const holidays = {
	base: 'http://localhost:8080/holidays',
	list: (masterId: number) => `${holidays.base}`,
}

export const nonWorkDays = {
	base: 'http://localhost:8080/nonWorkDays',
	list: () => nonWorkDays.base,
}

export const slots = {
	base: 'http://localhost:8080/slots',
	get: (date: string, time: number, id: number, currentId?: number) => slots.base,
}
