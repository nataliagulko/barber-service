import DS from 'ember-data';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
	dateFrom: [
		validator('presence', true),
		validator('date', {
			precision: 'day',
			format: 'DD.MM.YYYY',
		})
	],
	dateTo: [
		validator('presence', true),
		validator('date', {
			precision: 'day',
			format: 'DD.MM.YYYY',
		})
	],
	master: validator('belongs-to')
});

export default DS.Model.extend(Validations, {
	dateFrom: DS.attr(),
	dateTo: DS.attr(),
	comment: DS.attr(),
	master: DS.belongsTo('master'),
});
