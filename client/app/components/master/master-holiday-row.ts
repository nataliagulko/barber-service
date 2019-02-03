import { reads } from "@ember-decorators/object/computed";
import Component from "@ember/component";
import { inject as service } from "@ember/service";
import Holiday from "nova/models/holiday";

export default class MasterHolidayRow extends Component {
	constants = service("constants-service")

	@reads("constants.DEFUALT_DATE_FORMAT")
	dateFormat!: string

	actions = {
		remove(holiday: Holiday) {
			holiday.destroyRecord();
		},
	}
}
