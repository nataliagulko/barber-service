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

		const servicesStep = queryByTestId('service-list')

		expect(servicesStep).not.toBeNull()
	})

	it('should render ticket duration and cost', () => {
		const { queryByText, queryByTestId } = renderPage()

		const ticketDuration = queryByText('Продолжительность')
		const ticketDurationValue = queryByTestId('ticket-duration')
		const ticketCost = queryByText('Стоимость')
		const ticketCostValue = queryByTestId('ticket-cost')

		expect(ticketDuration).not.toBeNull()
		expect(ticketDurationValue).not.toBeNull()
		expect(ticketCost).not.toBeNull()
		expect(ticketCostValue).not.toBeNull()
	})

	it('should calculate ticket duration when service was selected', () => {
		const { getByTestId, getAllByTestId } = renderPage()

		const serviceCheckbox = getAllByTestId('service-checkbox')[0]
		act(() => {
			fireEvent.click(serviceCheckbox)
		})

		const ticketDurationValue = getByTestId('ticket-duration')
		expect(ticketDurationValue).toHaveTextContent('60')
	})

	it('should calculate ticket duration when several services were selected', () => {
		const { getByTestId, getAllByTestId } = renderPage()

		act(() => {
			const serviceCheckbox = getAllByTestId('service-checkbox')[0]
			fireEvent.click(serviceCheckbox)
		})
		act(() => {
			const serviceCheckbox1 = getAllByTestId('service-checkbox')[1]
			fireEvent.click(serviceCheckbox1)
		})

		const ticketDurationValue = getByTestId('ticket-duration')
		expect(ticketDurationValue).toHaveTextContent('130')
	})

	it('should calculate ticket cost when service was selected', () => {
		const { getByTestId, getAllByTestId } = renderPage()

		const serviceCheckbox = getAllByTestId('service-checkbox')[0]
		act(() => {
			fireEvent.click(serviceCheckbox)
		})

		const ticketDurationValue = getByTestId('ticket-cost')
		expect(ticketDurationValue).toHaveTextContent('100')
	})

	it('should calculate ticket cost when several services were selected', () => {
		const { getByTestId, getAllByTestId } = renderPage()

		act(() => {
			const serviceCheckbox = getAllByTestId('service-checkbox')[0]
			fireEvent.click(serviceCheckbox)
		})
		act(() => {
			const serviceCheckbox1 = getAllByTestId('service-checkbox')[1]
			fireEvent.click(serviceCheckbox1)
		})

		const ticketDurationValue = getByTestId('ticket-cost')
		expect(ticketDurationValue).toHaveTextContent('250')
	})
})
