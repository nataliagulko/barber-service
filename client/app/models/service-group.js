import DS from 'ember-data';

export default DS.Model.extend({
	services: DS.hasMany('service')
});
