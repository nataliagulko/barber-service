import { SlotsApi } from '../slots'

export const slotsApi: SlotsApi = {
	get: jest.fn(async () => [
		{
			start: '',
			end: '',
		},
	]),
}
