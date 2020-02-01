import DATE_FORMAT from '../constants/DATE_FORMAT'
import { getDatesArray } from './getDatesArray'
import moment from 'moment'

const format = (d: moment.Moment) => d.format(DATE_FORMAT)

interface GetArrayTestArgs {
	firstDay: moment.Moment
	countOfDays: number
	expectedFrom: moment.Moment
	expectedTo: moment.Moment
}

describe('getDatesArray', () => {
	it.each`
		firstDay                             | countOfDays | expectedFrom                         | expectedTo
		${moment('23.01.2020', DATE_FORMAT)} | ${3}        | ${moment('23.01.2020', DATE_FORMAT)} | ${moment('25.01.2020', DATE_FORMAT)}
		${moment('23.01.2020', DATE_FORMAT)} | ${90}       | ${moment('23.01.2020', DATE_FORMAT)} | ${moment('21.04.2020', DATE_FORMAT)}
	`(
		'should return $countOfDays dates from $firstDay',
		({ firstDay, countOfDays, expectedFrom, expectedTo }: GetArrayTestArgs) => {
			const dates = getDatesArray(firstDay, countOfDays)
			const dayFrom = format(dates[0])
			const dayTo = format(dates.slice(-1)[0])
			const expectedDayFrom = format(expectedFrom)
			const expectedDayTo = format(expectedTo)

			expect(dates).toHaveLength(countOfDays)
			expect(dayFrom).toEqual(expectedDayFrom)
			expect(dayTo).toEqual(expectedDayTo)
		},
	)
})
