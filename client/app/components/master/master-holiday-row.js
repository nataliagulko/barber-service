import Component from '@ember/component';
import { inject } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
	constants: inject("constants-service"),
	dateFormat: readOnly("constants.DEFUALT_DATE_FORMAT"),

	actions: {
		remove: function (holiday) {
			holiday.destroyRecord();
		}
	}
});
