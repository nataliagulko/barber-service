import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr(),
	inn: DS.attr(),
	description: DS.attr(),
	phone: DS.attr(),
	address: DS.attr(),
	email: DS.attr(),
	mode: DS.attr()
});
