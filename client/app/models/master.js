import DS from 'ember-data';
import { computed } from '@ember/object';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
    firstname: validator('presence', true),
    secondname: validator('presence', true),
    email: [
        validator('format', {
            type: 'email',
            allowBlank: true
        })
    ],
    phone: [
        validator('presence', true),
        validator('format', {
            type: 'phone',
            allowBlank: false,
			regex: /(\+7\(\d{3}\)\d{3}-\d{2})-(\d{1})/
        })
    ],
    password: [
        validator('length', {
            min: 6,
            max: 20
        }),
        validator('format', {
            allowBlank: true,
            regex: /((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20})/,
            messageKey: 'auth.registration.password.validation.message'
        })
    ],
    rpassword: [
        validator('confirmation', {
            on: 'password',
            allowBlank: true
        })
	],
    role: validator('has-many'),
    business: validator('belongs-to'),
});

export default DS.Model.extend(Validations, {
    username: DS.attr('string'),
    password: DS.attr('string'),
    rpassword: DS.attr('string'),
    email: DS.attr('string'),
    firstname: DS.attr('string'),
    secondname: DS.attr('string'),
    phone: DS.attr('string'),
    masterTZ: DS.attr('string'),
    enabled: DS.attr('boolean'),
    accountExpired: DS.attr('boolean'),
    accountLocked: DS.attr('boolean'),
    passwordExpired: DS.attr('boolean'),
    role: DS.hasMany('role', { async: true }),
    business: DS.belongsTo('business', { async: true }),
    fullname: computed('firstname', 'secondname', function () {
        return `${this.firstname} ${this.secondname}`;
	}),
});
