import Ember from 'ember';

export default Ember.Service.extend({
	store: Ember.inject.service("store"),
	serviceToGroupService: Ember.inject.service("service-to-group-service"),
	servicesToGroup: Ember.computed.readOnly('serviceToGroupService.servicesToGroup'),

	saveService: function (serviceRecord, masters, _this) {
		serviceRecord.set("masters", masters);
		serviceRecord
			.save()
			.then(() => {
				_this.get("router").transitionTo('service');
			});
	},

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
