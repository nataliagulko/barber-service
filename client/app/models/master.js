import DS from 'ember-data';
import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
    firstname: validator('presence', true),
    secondname: validator('presence', true),
    phone: validator('presence', true),
    email: [
        validator('format', {
            type: 'email',
            allowBlank: true
        })
    ],
    password: [
        // validator('presence', true),
        validator('length', {
            min: 6,
            max: 20
        })
    ],
    rpassword: [
        // validator('presence', true),
        validator('confirmation', {
            on: 'password',
            message: '{description} do not match',
            description: 'Passwords'
        })
    ]
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
    fullname: Ember.computed('firstname', 'secondname', function() {
        return `${this.get('firstname')} ${this.get('secondname')}`;
    })
});
