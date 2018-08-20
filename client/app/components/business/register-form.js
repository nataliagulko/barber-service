import Component from '@ember/component';
import { inject } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
	notification: inject("notification-service"),
	constants: inject("constants-service"),
	phoneMask: readOnly("constants.PHONE_MASK"),

	submit() {
		this.send("saveBusiness");
	},

	actions: {
		saveMaster: function (business) {
			const _this = this;
			const masterRecord = this.get("master");
			
			masterRecord.set("business", business);
			masterRecord.save()
				.then((master) => {
					const message = _this.get("i18n").t("business.registration.success", {
						name: business.get("name"),
						master: master.get("firstname")
					});
					_this.get("notification").showInfoMessage(message);
					_this.get("router").transitionTo("login");
				});
		},

		saveBusiness: function () {
			const _this = this;
			const businessRecord = this.get("business");
			const masterRecord = this.get("master");

			businessRecord.set("enabled", true);
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
