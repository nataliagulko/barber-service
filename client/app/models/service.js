import DS from 'ember-data';
import { validator, buildValidations } from 'ember-cp-validations';
import { computed } from '@ember/object';

const Validations = buildValidations({
	name: validator('presence', true),
	cost: validator('number', {
		allowString: true,
		gt: 0
	}),
	time: validator('number', {
		allowString: true,
		gt: 0
	}),
	// masters: validator('has-many'),
});

export default DS.Model.extend(Validations, {
	name: DS.attr('string'),
	cost: DS.attr('number', {
		defaultValue() { return 0; }
	}),
	time: DS.attr('number', {
		defaultValue() { return 0; }
	}),
	partOfList: DS.attr('boolean'),
	masters: DS.hasMany('master'),
});
