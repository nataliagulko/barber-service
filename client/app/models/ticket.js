import DS from 'ember-data';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
	ticketDate: validator('date', {
		presence: true,
		after: 'now',
		precision: 'day',
		format: 'dd.MM.YYYY',
	}),
	time: validator('date', {
		presence: true,
		after: 'now',
		format: 'HH:mm',
	}),
	cost: validator('number', {
		allowString: true,
		gt: 0
	}),
	duration: validator('number', {
		allowString: true,
		gt: 0
	}),
	client: validator('belongs-to'),
	master: validator('belongs-to'),
	services: validator('has-many')	
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
