import DS from 'ember-data';
import Service from './service';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
	serviceToGroups: validator('has-many')
});

export default Service.extend(Validations, {
	serviceToGroups: DS.hasMany("serviceToGroup", { inverse: null }),
});
