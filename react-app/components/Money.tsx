import { FC } from 'react'
import ROUBLE from '../constants/ROUBLE'

interface MoneyProps {
	sum: number
	role: string
}

export const Money: FC<MoneyProps> = ({ sum, role }) => (
	<>
		<span role={role}>{sum}</span>
		<span data-testid="rouble-sign">{ROUBLE}</span>
	</>
)
