import Component from "@ember/component";
import { get, set } from "@ember/object";
import { inject as service } from "@ember/service";
import Holiday from "nova/models/holiday";
import Master from "nova/models/master";

export default class MasterHoliday extends Component {
	master!: Master
	newHoliday!: Holiday

	store = service("store")

	actions = {
		addHoliday(this: MasterHoliday) {
			const masterHoliday = this;

			const holidayRecord = get(masterHoliday, "store").createRecord("holiday", {
				master: get(masterHoliday, "master"),
			});

			set(masterHoliday, "newHoliday", holidayRecord);
		},
	}
}
