import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service("store"),
	select2Service: Ember.inject.service("select2-service"),
	serviceService: Ember.inject.service("service-service"),
	servicesToGroup: Ember.computed.readOnly('serviceService.servicesToGroup'),
	selectedSubservices: Ember.computed.readOnly('serviceService.selectedSubservices'),
	isRowAddingDisabled: Ember.computed.readOnly('serviceService.isRowAddingDisabled'),

	didInsertElement: function() {
		// add first empty row
		this.send("addServiceToGroup");
	},

	actions: {
		addServiceToGroup: function() {
			var select2Service = this.get("select2Service");
			var serviceService = this.get("serviceService");

			select2Service.initSelect2();
			serviceService.addServiceToGroup();
		},

		selectSubservice: function(subserviceId) {
			var serviceService = this.get("serviceService");

			serviceService.selectSubservice(subserviceId);
		},

		removeServiceToGroup: function(subserviceId) {
			var serviceService = this.get("serviceService");

			serviceService.removeServiceToGroup(subserviceId);
		},

		reorderSubservices: function(groupModel) {
			var serviceService = this.get("serviceService");

			serviceService.reorderSubservices(groupModel);
		}
	}

});
