import SlotModel from '../../models/Slot'

export default class Slot implements SlotModel {
	start: string
	end: string

	constructor() {
		this.start = ''
		this.end = ''
	}
}
