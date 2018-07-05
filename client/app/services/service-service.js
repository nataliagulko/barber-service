import Service from '@ember/service';
import { inject } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Service.extend({
	store: inject("store"),
	serviceToGroupService: inject("service-to-group-service"),
	servicesToGroup: readOnly('serviceToGroupService.servicesToGroup'),

	saveServiceGroup: function (serviceGroupRecord, masters, _this) {
		const servicesToGroup = this.get("servicesToGroup");

		serviceGroupRecord.set("masters", masters);
		serviceGroupRecord
			.save()
			.then(function (record) {
				servicesToGroup.forEach(function (item, ind) {
					item.set("serviceGroup", record);
					item.set("serviceOrder", ind);
					item.save();
				});
				_this.get("router").transitionTo('service');
			});
	}
});
