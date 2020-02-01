import moment, { unitOfTime } from 'moment'

export const getDatesArray = (firstDay: moment.Moment, countOfDays: number) =>
	Array.apply(null, Array(countOfDays)).map((_, index) => moment(firstDay).add(index, 'd'))
