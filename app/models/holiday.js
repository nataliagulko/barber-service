import DS from 'ember-data';

export default DS.Model.extend({
	dateFrom: DS.attr(),
	dateTo: DS.attr(),
	master: DS.attr(),
	comment: DS.attr()
});
