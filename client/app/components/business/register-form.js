import Component from '@ember/component';
import { inject } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
	notification: inject("notification-service"),
	constants: inject("constants-service"),
	phoneMask: readOnly("constants.PHONE_MASK"),
	intl: inject(),

	submit() {
		this.send("saveBusiness");
	},

	actions: {
		saveMaster: function (business) {
			const _this = this;
			const masterRecord = this.master;
			
			masterRecord.set("business", business);
			masterRecord.set("enabled", true);
			masterRecord.save()
				.then((master) => {
					const message = _this.get("intl").t("business.registration.success", {
						name: business.get("name"),
						master: master.get("firstname")
					});
					_this.get("notification").info(message);
					_this.get("router").transitionTo("login");
				});
		},

		saveBusiness: function () {
			const _this = this;
			const businessRecord = this.business;
			const masterRecord = this.master;

			// validate business
			businessRecord
				.validate()
				.then(({ validations }) => {
					if (validations.get('isValid')) {
						// then validate master
						masterRecord.validate()
							.then(({ validations }) => {
								if (validations.get('isValid')) {
									// and after save business
									businessRecord.save()
										.then((business) => {
											_this.send("saveMaster", business);
										});
								}
							});
					}
				});
		}
	}
});
