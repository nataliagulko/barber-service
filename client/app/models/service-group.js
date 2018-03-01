import DS from 'ember-data';
import Service from './service';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
	servicesToGroup: validator('has-many')
});

export default Service.extend(Validations, {
	servicesToGroup: DS.hasMany("serviceToGroup", { inverse: null }),
});
