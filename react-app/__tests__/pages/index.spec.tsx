import { UseCreateTicket, useCreateTicket } from '../../hooks/useCreateTicket'
import { act, fireEvent, render, waitForElement } from '@testing-library/react'

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

	it('should disable button "Дальше" if services are not chosen', () => {
		const { getByText } = renderPage()

		expect(getByText('Дальше')).toBeDisabled()
	})
})
