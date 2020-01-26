import Holiday from './Holiday'
import HolidayModel from '../../models/Holiday'

export default class HolidayBuilder {
	holiday: HolidayModel

	constructor() {
		this.holiday = new Holiday()
	}

	withDateFrom(date: string): HolidayBuilder {
		this.holiday = {
			...this.holiday,
			dateFrom: date,
		}
		return this
	}

	withDateTo(date: string): HolidayBuilder {
		this.holiday = {
			...this.holiday,
			dateTo: date,
		}
		return this
	}

	build(): HolidayModel {
		return this.holiday
	}
}
