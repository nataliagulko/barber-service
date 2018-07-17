import DS from 'ember-data';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
	serviceGroup: validator('belongs-to'),
	service: validator('belongs-to'),
});

export default DS.Model.extend(Validations, {
	serviceGroup: DS.belongsTo("serviceGroup", { inverse: null }),
	service: DS.belongsTo("service"),
	serviceOrder: DS.attr(),
	serviceTimeout: DS.attr({
		defaultValue() { return 0; }
	}),
});
