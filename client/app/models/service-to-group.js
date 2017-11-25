import DS from 'ember-data';

export default DS.Model.extend({
	serviceGroups: DS.hasMany("serviceGroup", { inverse: null }),
	service: DS.belongsTo("service"),
	serviceOrder: DS.attr(),
	serviceTimeout: DS.attr(),
});
