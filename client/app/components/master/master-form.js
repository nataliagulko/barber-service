import Component from '@ember/component';
import { inject } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
	constants: inject("constants-service"),
	currentUser: inject("current-user-service"),
	phoneMask: readOnly("constants.PHONE_MASK"),

	actions: {
		save: function () {
			const _this = this;
			const masterRecord = this.master;
			const business = this.currentUser.get("business");

			masterRecord.set("enabled", false);
			masterRecord.set("business", business);
			masterRecord
				.validate()
				.then(({ validations }) => {
					if (validations.get('isValid')) {
						masterRecord
							.save()
							.then(() => {
								_this.get("router").transitionTo('auth.master');
							});
					}
				});

		}
	}
});
