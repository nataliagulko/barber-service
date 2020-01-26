import Slot from './Slot'
import SlotModel from '../../models/Slot'

export default class SlotBuilder {
	slot: SlotModel

	constructor() {
		this.slot = new Slot()
	}

	withStart(start: string): SlotBuilder {
		this.slot = {
			...this.slot,
			start,
		}
		return this
	}

	withEnd(end: string): SlotBuilder {
		this.slot = {
			...this.slot,
			end,
		}
		return this
	}

	build(): SlotModel {
		return this.slot
	}
}
