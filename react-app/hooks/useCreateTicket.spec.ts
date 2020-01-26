import { act, renderHook } from '@testing-library/react-hooks'

import { useCreateTicket } from './useCreateTicket'

const renderCustomHook = () => renderHook(() => useCreateTicket())

describe('useCreateTicket', () => {
	describe('should calculate ticket duration', () => {
		it('when service was selected', () => {
			const { result } = renderCustomHook()

			act(() => {
				result.current.getServiceTime(30)
			})

			expect(result.current.duration).toBe(30)
		})

		it('when several services were selected', () => {
			const { result } = renderCustomHook()

			act(() => {
				result.current.getServiceTime(30)
			})
			act(() => {
				result.current.getServiceTime(40)
			})

			expect(result.current.duration).toBe(70)
		})

		it('when service was unselected', () => {
			const { result } = renderCustomHook()

			act(() => {
				result.current.getServiceTime(30)
			})
			act(() => {
				result.current.getServiceTime(-30)
			})

			expect(result.current.duration).toBe(0)
		})
	})

	describe('should calculate ticket cost', () => {
		it('when service was selected', () => {
			const { result } = renderCustomHook()

			act(() => {
				result.current.getServiceCost(200)
			})

			expect(result.current.cost).toBe(200)
		})

		it('when several services were selected', () => {
			const { result } = renderCustomHook()

			act(() => {
				result.current.getServiceCost(200)
			})
			act(() => {
				result.current.getServiceCost(400)
			})

			expect(result.current.cost).toBe(600)
		})

		it('when service was unselected', () => {
			const { result } = renderCustomHook()

			act(() => {
				result.current.getServiceCost(200)
			})
			act(() => {
				result.current.getServiceCost(-200)
			})

			expect(result.current.cost).toBe(0)
		})
	})

	it('should change current step when nextStep was called', () => {
		const { result } = renderCustomHook()

		act(() => {
			result.current.next()
		})

		expect(result.current.current).toBe(1)
	})
})
