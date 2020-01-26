import { ServiceApi } from '../service'

export const serviceApi: ServiceApi = {
	list: jest.fn(async () => [
		{
			id: 1,
			name: 'Service 1',
			cost: 100,
			time: 60,
			partOfList: false,
		},
		{
			id: 2,
			name: 'Service 2',
			cost: 150,
			time: 70,
			partOfList: false,
		},
		{
			id: 3,
			name: 'Service 3',
			cost: 200,
			time: 80,
			partOfList: false,
		},
	]),
}
