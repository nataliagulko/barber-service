import { fireEvent, render, waitForElement } from '@testing-library/react'

import DATE_FORMAT from '../../constants/DATE_FORMAT'
import Home from '../../pages'
import React from 'react'
import Service from '../../models/Service'
import { given } from '../../test/dsl/index'
import moment from 'moment'

const master = given
	.user()
	.withId(1)
	.build()

const services: Service[] = [
	given
		.service()
		.withMaster(master.id)
		.withName('Service 1')
		.withCost(100)
		.withTime(60)
		.build(),
	given
		.service()
		.withMaster(master.id)
		.withName('Service 2')
		.withCost(150)
		.withTime(70)
		.build(),
	given
		.service()
		.withMaster(master.id)
		.withName('Service 3')
		.withCost(200)
		.withTime(80)
		.build(),
]
const client = given
	.user()
	.withName('Ivan', 'Ivanov')
	.build()

const renderPage = () => render(<Home services={services} client={client} master={master} holidays={[]} />)

describe('Index page', () => {
	describe("should render client's", () => {
		it('first name', () => {
			const { getByText, getByRole } = renderPage()

			expect(getByText('Имя')).not.toBeNull()
			expect(getByRole('first-name')).toHaveTextContent('Ivan')
		})

		it('second name', () => {
			const { getByText, getByRole } = renderPage()

			expect(getByText('Фамилия')).not.toBeNull()
			expect(getByRole('second-name')).toHaveTextContent('Ivanov')
		})
	})

	it('should contain hardcoded master id', () => {
		const hardcodedMasterId = '1'
		const { getByTestId } = renderPage()

		const masterId = getByTestId('master-id')
		expect(masterId).not.toBeNull()
		expect(masterId).toHaveValue(hardcodedMasterId)
	})

	it('should render ticket date', () => {
		const { getByLabelText } = renderPage()

		expect(getByLabelText('Дата')).not.toBeNull()
	})

	describe('should render service', () => {
		it('list with items filtered by master', () => {
			const { getAllByRole } = renderPage()
			const serviceItemList = getAllByRole('service-item')

			expect(serviceItemList).toHaveLength(3)
		})

		it('with cost and time', () => {
			const { getAllByRole } = renderPage()

			expect(getAllByRole('service-cost')).not.toBeNull()
			expect(getAllByRole('service-time')).not.toBeNull()
		})

		it('cost with rouble sign', () => {
			const { getAllByTestId } = renderPage()

			const roubleSign = getAllByTestId('rouble-sign')[0]

			expect(roubleSign).not.toBeNull()
		})

		it('should select service on service item click', () => {
			const { getAllByRole } = renderPage()

			const serviceCheckbox = getAllByRole('service-item')[0].querySelector('input[type=checkbox]')
			serviceCheckbox && fireEvent.click(serviceCheckbox)

			expect(serviceCheckbox).toBeChecked()
		})
	})

	it('should render textarea for comment', () => {
		const { getByLabelText } = renderPage()

		expect(getByLabelText('Комментарий')).not.toBeNull()
	})

	describe('should add and subtract ticket', () => {
		it('duration when service was selected', async () => {
			const { getByRole, getAllByTestId, getAllByRole } = renderPage()
			const serviceCheckbox = getAllByTestId('service-checkbox')[0]

			// act 1
			fireEvent.click(serviceCheckbox)

			// assert 1
			const serviceTime = await waitForElement(() => getAllByRole('service-time')[0].textContent || '')
			expect(getByRole('duration')).toHaveTextContent(serviceTime)

			// act 2
			fireEvent.click(serviceCheckbox)

			// assert 2
			expect(getByRole('duration').textContent).toBe('0')
		})

		it('duration when several services were selected', async () => {
			const { getByRole, getAllByTestId, getAllByRole } = renderPage()
			const duration = getByRole('duration')
			const service1 = {
				checkbox: getAllByTestId('service-checkbox')[0],
				time: getAllByRole('service-time')[0],
			}
			const service2 = {
				checkbox: getAllByTestId('service-checkbox')[1],
				time: getAllByRole('service-time')[1],
			}
			const service3 = {
				checkbox: getAllByTestId('service-checkbox')[2],
				time: getAllByRole('service-time')[2],
			}

			// act 1
			fireEvent.click(service1.checkbox)
			fireEvent.click(service2.checkbox)
			fireEvent.click(service3.checkbox)

			// assert 1
			const summary = (services[0].time + services[1].time + services[2].time).toString()
			expect(duration).toHaveTextContent(summary)

			// act 2
			fireEvent.click(service2.checkbox)
			fireEvent.click(service3.checkbox)

			// assert 2
			expect(duration).toHaveTextContent(services[0].time.toString())
		})

		it('cost when service was selected', async () => {
			const { getByRole, getAllByTestId, getAllByRole } = renderPage()
			const cost = getByRole('cost')
			const serviceCheckbox = getAllByTestId('service-checkbox')[0]

			// act 1
			fireEvent.click(serviceCheckbox)

			// assert 1
			const serviceCost = await waitForElement(() => getAllByRole('service-cost')[0].textContent || '')
			expect(cost).toHaveTextContent(serviceCost)

			// act 2
			fireEvent.click(serviceCheckbox)

			// assert 2
			expect(cost.textContent).toBe('0')
		})

		it('cost when several services were selected', async () => {
			const { getByRole, getAllByTestId, getAllByRole } = renderPage()
			const cost = getByRole('cost')
			const service1 = {
				checkbox: getAllByTestId('service-checkbox')[0],
				cost: getAllByRole('service-cost')[0],
			}
			const service2 = {
				checkbox: getAllByTestId('service-checkbox')[1],
				cost: getAllByRole('service-cost')[1],
			}
			const service3 = {
				checkbox: getAllByTestId('service-checkbox')[2],
				cost: getAllByRole('service-cost')[2],
			}

			// act 1
			fireEvent.click(service1.checkbox)
			fireEvent.click(service2.checkbox)
			fireEvent.click(service3.checkbox)

			// assert 1
			const summary = (services[0].cost + services[1].cost + services[2].cost).toString()
			expect(cost).toHaveTextContent(summary)

			// act 2
			fireEvent.click(service2.checkbox)
			fireEvent.click(service3.checkbox)

			// assert 2
			expect(cost).toHaveTextContent(services[0].cost.toString())
		})
	})
})
