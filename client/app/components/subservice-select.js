import Ember from 'ember';

export default Ember.Component.extend({
	serviceService: Ember.inject.service("service-service"),
	selectedSubservice: null,
	selectedSubservices: Ember.computed.readOnly('serviceService.selectedSubservices'),


	actions: {
		selectSubservice: function(subservice) {
			this.set("selectedSubservice", subservice);
			var serviceService = this.get("serviceService");
			var serviceToGroup = this.get("serviceToGroup");
			var serviceGroup = this.get("serviceGroup");

			serviceService.selectSubservice(subservice, serviceToGroup, serviceGroup);
		}
	}
});
