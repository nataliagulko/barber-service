import DS from 'ember-data';

export default DS.Model.extend({
	ticketDate: DS.attr(),
	time: DS.attr(),
	status: DS.attr(),
	comment: DS.attr(),
	guid: DS.attr(),
	type: DS.attr(),
	cost: DS.attr(),
	duration: DS.attr(),
	client: DS.belongsTo('client', { async: true }),
	master: DS.belongsTo('master', { async: true }),
	services: DS.hasMany('service', { async: true }),
});
