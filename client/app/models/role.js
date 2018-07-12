import DS from 'ember-data';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
	authority: validator('presence', true),
	description: validator('presence', true),
});

export default DS.Model.extend(Validations, {
	authority: DS.attr('string'),
	description: DS.attr('string'),
});
