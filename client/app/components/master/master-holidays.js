import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
	store: inject(),

	actions: {
		addHoliday: function () {
			const holidayRecord = this.store.createRecord("holiday", {
				master: this.master
			});
			this.set("newHoliday", holidayRecord);
		}
	}
});
