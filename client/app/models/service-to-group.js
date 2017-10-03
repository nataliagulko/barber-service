import DS from 'ember-data';

export default DS.Model.extend({
	service: DS.attr(),
	group: DS.attr(),
	serviceOrder: DS.attr(),
	serviceTimeout: DS.attr(),
});
