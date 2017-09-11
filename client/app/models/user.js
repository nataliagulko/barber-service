import DS from 'ember-data';

export default DS.Model.extend({
	username: DS.attr(),
	password: DS.attr(),
	email: DS.attr(),
	firstname: DS.attr(),
	secondname: DS.attr(),
	masterTZ: DS.attr(),
	enabled: DS.attr(),
	accountExpired: DS.attr(),
	accountLocked: DS.attr(),
	passwordExpired: DS.attr(),
	masters: DS.hasMany('user')
});
