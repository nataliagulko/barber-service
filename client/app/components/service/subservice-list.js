import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service("store"),
	serviceToGroupService: Ember.inject.service("service-to-group-service"),
	servicesToGroup: Ember.computed.readOnly('serviceToGroupService.servicesToGroup'),
	isRowAddingDisabled: Ember.computed.readOnly('serviceToGroupService.isRowAddingDisabled'),

	didInsertElement: function() {
		var serviceGroup = this.get("serviceGroup"),
			serviceToGroupService = this.get("serviceToGroupService");

		serviceToGroupService.showSubservices(serviceGroup, this);
	},

	actions: {
		addServiceToGroup: function() {
			var serviceToGroupService = this.get("serviceToGroupService");

			serviceToGroupService.addServiceToGroup();
		},

		removeServiceToGroup: function(subservice) {
			var serviceToGroupService = this.get("serviceToGroupService");
			var serviceGroup = this.get("serviceGroup");

			serviceToGroupService.removeServiceToGroup(subservice, serviceGroup);
		},

		reorderSubservices: function(groupModel) {
			var serviceToGroupService = this.get("serviceToGroupService");

			serviceToGroupService.reorderSubservices(groupModel);
		},

		inputServiceToGroupTimeout: function() {
			var serviceToGroupService = this.get("serviceToGroupService");
			var serviceGroup = this.get("serviceGroup");

			serviceToGroupService.inputServiceToGroupTimeout(serviceGroup);
		},

		selectSubservice: function(serviceToGroup, subservice) {
			var serviceToGroupService = this.get("serviceToGroupService"),
				serviceGroup = this.get("serviceGroup");

			serviceToGroupService.selectSubservice(serviceToGroup, subservice, serviceGroup);
		}
	}
});
