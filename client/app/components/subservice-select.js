import Ember from 'ember';

export default Ember.Component.extend({
	select2Service: Ember.inject.service("select2-service"),
	serviceService: Ember.inject.service("service-service"),
	selectedSubservices: Ember.computed.readOnly('serviceService.selectedSubservices'),

	didInsertElement: function() {
		var select2Service = this.get("select2Service");
		select2Service.initSelect2();
	},

	actions: {

		selectSubservice: function(subserviceId) {
			var serviceService = this.get("serviceService");
			var serviceToGroup = this.get("serviceToGroup");
			var serviceGroup = this.get("serviceGroup");

			serviceService.selectSubservice(subserviceId, serviceToGroup, serviceGroup);
		},
	}
});
