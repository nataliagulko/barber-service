import Component from '@ember/component';
import { inject } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
	store: inject("store"),
	serviceToGroupService: inject("service-to-group-service"),
	servicesToGroup: readOnly('serviceToGroupServicesToGroup'),
	isRowAddingDisabled: readOnly('serviceToGroupService.isRowAddingDisabled'),

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
