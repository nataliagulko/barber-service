import DS from 'ember-data';

export default DS.Model.extend({
	services: DS.hasMany("service"),
	serviceGroup: DS.hasMany("serviceGroup"),
	serviceOrder: DS.attr(),
	serviceTimeout: DS.attr(),
});
