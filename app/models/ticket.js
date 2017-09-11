import DS from 'ember-data';

export default DS.Model.extend({
	user: DS.attr(),
	master: DS.attr(),
	ticketDate: DS.attr(),
	time: DS.attr(),
	status: DS.attr(),
	comment: DS.attr(),
	guid: DS.attr(),
	type: DS.attr(),
	cost: DS.attr(),
	duration: DS.attr()
	services: DS.hasMany('service'),
	subTickets: DS.hasMany('ticket'),
});
