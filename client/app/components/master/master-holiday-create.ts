import { reads } from "@ember-decorators/object/computed";
import Component from "@ember/component";
import { get, set } from "@ember/object";
import { inject as service } from "@ember/service";
import { Validations } from "ember-cp-validations";
import Holiday from "nova/models/holiday";

export default class MasterHolidayCreate extends Component {
	newHoliday!: Holiday | null

	store = service("store")
	constants = service("constants-service")

	@reads("constants.DEFUALT_DATE_FORMAT")
	dateFormat!: string

	@reads("constants.DATE_MASK")
	dateMask!: string

	actions = {
		saveHoliday(this: MasterHolidayCreate, holiday: Holiday) {
			const masterHolidayCreate = this;

			holiday
				.validate()
				.then(({ validations }: Validations) => {
					if (get(validations, "isValid")) {
						holiday
							.save()
							.then(() => {
								set(masterHolidayCreate, "newHoliday", null);
							});
					}
				});
		},

		removeHoliday(this: MasterHolidayCreate, holiday: Holiday) {
			const masterHolidayCreate = this;

			holiday.destroyRecord()
				.then(() => {
					set(masterHolidayCreate, "newHoliday", null);
				});
		},
	}
}
