import DS from 'ember-data';

export default DS.Model.extend({
	timeFrom: DS.attr(),
	timeTo: DS.attr(),
	dayOfWeek: DS.attr(),
	master: DS.attr()
});
