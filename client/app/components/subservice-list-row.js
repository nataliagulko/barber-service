import Ember from 'ember';

export default Ember.Component.extend({
	tagName: "tr",
	store: Ember.inject.service("store"),
	select2Service: Ember.inject.service("select2-service"),
	serviceService: Ember.inject.service("service-service"),

	didInsertElement: function() {
		var select2Service = this.get("select2Service");
		select2Service.initSelect2();
	},

	actions: {
		
	}
});
