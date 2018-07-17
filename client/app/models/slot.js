import DS from 'ember-data';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
	master: validator('belongs-to'),
	slotDate: [
		validator('date', {
			precision: 'day',
			format: 'DD.MM.YYYY',
		})
	],
});

export default DS.Model.extend(Validations, {
	start: DS.attr(),
	end: DS.attr(),
	slotDate: DS.attr(),
	master: DS.belongsTo('master'),
});
