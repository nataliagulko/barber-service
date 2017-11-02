import DS from 'ember-data';

export default DS.Model.extend({
	services: DS.hasMany("service"),
	serviceGroups: DS.hasMany("serviceGroup"),
	serviceOrder: DS.attr(),
	serviceTimeout: DS.attr(),
});
