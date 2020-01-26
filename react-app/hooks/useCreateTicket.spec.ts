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
})
