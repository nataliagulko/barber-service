import DS from 'ember-data';
import moment from 'moment';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
	ticketDate: [
		validator('presence', true),
		validator('date', {
			presence: true,
			after: moment().subtract(1, 'days'),
			precision: 'day',
			format: 'DD.MM.YYYY',
		})
	],
	time: [
		validator('presence', true),
		validator('date', {
			presence: true,
			format: 'HH:mm',
		})
	],
	cost: validator('number', {
		allowString: true,
		gt: 0
	}),
	duration: validator('number', {
		allowString: true,
		gt: 0
	}),
	client: [
		// validator('presence', true),
		validator('belongs-to')
	],
	master: [
		validator('presence', true),
		validator('belongs-to')
	],
	services: [
		validator('presence', true),
		validator('has-many')
	],
});

export default DS.Model.extend(Validations, {
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
