import DS from 'ember-data';
import { computed } from '@ember/object';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
	timeFrom: validator('presence', true),
	timeTo: [
		validator('presence', true),
		validator('dependent', {
			on: ['timeFrom']
		})
	],
	dayOfWeek: validator('presence', true),
	master: validator('belongs-to')
});

export default DS.Model.extend(Validations, {
	timeFrom: DS.attr(),
	timeTo: DS.attr(),
	dayOfWeek: DS.attr(),
	dateFrom: DS.attr(),
	dateTo: DS.attr(),
	master: DS.belongsTo('master'),
	timeRange: computed('timeFrom', 'timeTo', function () {
		return `${this.get('timeFrom')}—${this.get('timeTo')}`;
	})
});
