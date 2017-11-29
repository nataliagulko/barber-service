import DS from 'ember-data';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
	name: validator('presence', true),
	cost: validator('presence', true),
	time: validator('presence', true),
	masters: validator('presence', true)
});

export default DS.Model.extend(Validations, {
	name: DS.attr(),
	cost: DS.attr(),
	time: DS.attr(),
	partOfList: DS.attr(),
	masters: DS.hasMany('master'),
	serviceToGroup: DS.belongsTo("serviceToGroup", { inverse: null }),
});
