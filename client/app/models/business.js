import DS from 'ember-data';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
    name: validator('presence', true),
    email: [
        validator('format', {
            type: 'email',
            allowBlank: true
        })
	],
	phone: [
        validator('format', {
            type: 'phone',
            allowBlank: true,
            regex: /(\+7\(\d{3}\)\d{3}-\d{2})-(\d{1})/
        })
    ]
});
export default DS.Model.extend(Validations, {
	name: DS.attr(),
	inn: DS.attr(),
	description: DS.attr(),
	phone: DS.attr(),
	address: DS.attr(),
	email: DS.attr(),
	mode: DS.attr(),
	smsCentrLogin: DS.attr(),
	smsCentrPass: DS.attr(),
	guid: DS.attr(),
	masters: DS.hasMany('master'),
	clients: DS.hasMany('client'),
});
