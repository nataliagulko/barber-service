import { classNames } from "@ember-decorators/component";
import { reads } from "@ember-decorators/object/computed";
import Component from "@ember/component";
import { get } from "@ember/object";
import { inject as service } from "@ember/service";
import WorkTime from "nova/models/work-time";

@classNames("form-inline")
export default class WorkTimeRow extends Component {
	workTime!: WorkTime

	constants = service("constants-service")

	@reads("constants.TIME_MASK")
	timeMask!: string

	change(this: WorkTimeRow) {
		const item = get(this, "workTime")
		item.wasChanged = true;
	}
}
