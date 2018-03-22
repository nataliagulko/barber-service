import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
	timeFrom: DS.attr(),
	timeTo: DS.attr(),
	dayOfWeek: DS.attr(),
	dateFrom: DS.attr(),
	dateTo: DS.attr(),
	master: DS.belongsTo('master'),
	timeRange: Ember.computed('timeFrom', 'timeTo', function() {
        return `${this.get('timeFrom')}—${this.get('timeTo')}`;
    })
});
