import Component from '@ember/component';
import { inject } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
	store: inject(),
	constants: inject("constants-service"),
	dateFormat: readOnly("constants.DEFUALT_DATE_FORMAT"),
	dateMask: readOnly("constants.DATE_MASK"),

	actions: {
		saveHoliday: function (holiday) {
			const _this = this;

			holiday
				.validate()
				.then(({ validations }) => {
					if (validations.get('isValid')) {
						holiday
							.save()
							.then(() => {
								_this.set("newHoliday", null);
							});
					}
				});
		},

		removeHoliday: function (holiday) {
			holiday.destroyRecord()
				.then(() => {
					this.set("newHoliday", null);
				});
		}
	}
});
