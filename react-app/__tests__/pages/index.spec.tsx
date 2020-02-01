import { act, fireEvent, render } from '@testing-library/react'

import Home from '../../pages'
import React from 'react'
import Service from '../../models/Service'
import { given } from '../../test/dsl/index'

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

const renderPage = () =>
	render(<Home services={services} client={client} master={master} holidays={[]} nonWorkDays={[]} />)

describe('Create ticket page', () => {
	it('should render service step title', () => {
		const { queryByText } = renderPage()

		const servicesStep = queryByText('Услуги')

		expect(servicesStep).not.toBeNull()
	})

	it('should render service list', () => {
		const { queryByTestId } = renderPage()

		const servicesList = queryByTestId('service-list')

		expect(servicesList).not.toBeNull()
	})

	it('should render date step title', () => {
		const { queryByText } = renderPage()

		const dateStep = queryByText('Дата')

		expect(dateStep).not.toBeNull()
	})

	it.skip('should show date when "Дальше" button clicked', () => {
		const { queryByTestId, getByText } = renderPage()

		act(() => {
			const next = getByText('Дальше')
			fireEvent.click(next)
		})

		const date = queryByTestId('ticket-date')
		expect(date).not.toBeNull()
	})

	it.skip('should show button "Назад" when next page was selected', () => {
		const { getByText, queryByText } = renderPage()

		act(() => {
			const nextButton = getByText('Дальше')
			fireEvent.click(nextButton)
		})

		const previousButton = queryByText('Назад')
		expect(previousButton).not.toBeNull()
	})

	it.skip('should show date when "Назад" button clicked', () => {
		const { queryByTestId, getByText } = renderPage()

		act(() => {
			const nextButton = getByText('Дальше')
			fireEvent.click(nextButton)
		})
		const date = queryByTestId('ticket-date')
		expect(date).not.toBeNull()

		act(() => {
			const previousButton = getByText('Назад')
			fireEvent.click(previousButton)
		})

		const serviceList = queryByTestId('service-list')
		expect(serviceList).not.toBeNull()
	})
})
