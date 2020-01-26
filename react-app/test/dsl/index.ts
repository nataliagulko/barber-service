import DateBuilder from './DateBuilder'
import HolidayBuilder from './HolidayBuilder'
import ServiceBuilder from './ServiceBuilder'
import SlotBuilder from './SlotBuilder'
import UserBuilder from './UserBuilder'

export const given = {
	service: () => new ServiceBuilder(),
	user: () => new UserBuilder(),
	holiday: () => new HolidayBuilder(),
	date: () => new DateBuilder(),
	slot: () => new SlotBuilder(),
}
