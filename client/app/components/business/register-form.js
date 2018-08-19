import Component from '@ember/component';
import { inject } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
	notification: inject("notification-service"),
	constants: inject("constants-service"),
	phoneMask: readOnly("constants.PHONE_MASK"),

	submit() {
		this.send("saveMaster");
	},

	actions: {
		saveBusiness: function (master) {
			const _this = this;
			const businessRecord = this.get("business");
			
			businessRecord.get("masters").pushObject(master);
			businessRecord.save()
				.then((business) => {
					const message = _this.get("i18n").t("business.registration.success", {
						name: business.get("name"),
						master: master.get("firstname")
					});
					_this.get("notification").showInfoMessage(message);
					_this.get("router").transitionTo("login");
				});
		},

		saveMaster: function () {
			const _this = this;
			const masterRecord = this.get("master");
			const businessRecord = this.get("business");

			masterRecord.set("enabled", true);
			// validate master
			masterRecord
				.validate()
				.then(({ validations }) => {
					if (validations.get('isValid')) {
						// then validate business
						businessRecord.validate()
							.then(({ validations }) => {
								if (validations.get('isValid')) {
									// and after save master
									masterRecord.save()
										.then((master) => {
											_this.send("saveBusiness", master);
										});
								}
							});
					}
				});
		}
	}
});
