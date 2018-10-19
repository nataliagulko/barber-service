import Component from '@ember/component';
import { inject } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
	store: inject("store"),
	serviceToGroupService: inject("service-to-group-service"),
	servicesToGroup: readOnly('serviceToGroupService.servicesToGroup'),

	actions: {
		save: function () {
			const _this = this;
			const serviceGroupRecord = this.serviceGroup;
			const servicesToGroup = this.servicesToGroup;

			serviceGroupRecord
				.validate()
				.then(({ validations }) => {
					if (validations.get('isValid')) {
						serviceGroupRecord
							.save()
							.then(function (record) {
								servicesToGroup.forEach(function (item, ind) {
									item.set("serviceGroup", record);
									item.set("serviceOrder", ind);
									item.save();
								});
								_this.get("router").transitionTo('auth.service');
							});
					}
				});
		}
	}
});
