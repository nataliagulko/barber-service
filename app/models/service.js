import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr(),
	cost: DS.attr(),
	time: DS.attr(),
	partOfList: DS.attr(),
	masters: DS.hasMany('master')
});
