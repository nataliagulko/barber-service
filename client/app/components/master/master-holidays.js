import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
	store: inject(),

	actions: {
		addHoliday: function () {
			const holidayRecord = this.get("store").createRecord("holiday", {
				master: this.get("master")
			});
			this.set("newHoliday", holidayRecord);
		}
	}
});
