import { FORMAT_WITHOUT_TIMEZONE } from '../../constants/DATE_FORMAT'
import moment from 'moment'

type Moment = moment.Moment | string | undefined

export default class DateBuilder {
	date: string
	formatted: string

	constructor() {
		this.date = moment().format(FORMAT_WITHOUT_TIMEZONE)
		this.formatted = moment().format('LL')
	}

	before(end: Moment, count: number, unit: 'week' | 'day' | 'month'): DateBuilder {
		const res = moment(end).subtract(count, unit)
		this.date = res.format(FORMAT_WITHOUT_TIMEZONE)
		this.formatted = res.format('LL')

		return this
	}

	after(start: Moment, count: number, unit: 'week' | 'day' | 'month'): DateBuilder {
		const res = moment(start).add(count, unit)
		this.date = res.format(FORMAT_WITHOUT_TIMEZONE)
		this.formatted = res.format('LL')

		return this
	}

	format(): string {
		return this.formatted
	}

	build(): string {
		return this.date
	}
}
