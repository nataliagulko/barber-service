import DS from 'ember-data';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
	name: validator('presence', true),
	cost: validator('number', {
		allowString: true,
		positive: true
	}),
	time: validator('number', {
		allowString: true,
		positive: true
	}),
	masters: validator('has-many')
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
	serviceToGroup: DS.belongsTo("serviceToGroup", { inverse: null }),
});
