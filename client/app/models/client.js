import DS from 'ember-data';
import { computed } from '@ember/object';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
    firstname: validator('presence', true),
    phone: [
        validator('presence', true),
        validator('format', {
            type: 'phone',
            allowBlank: true,
            regex: /(\+7\(\d{3}\)\d{3}-\d{2})-(\d{1})/
        })
    ],
    email: [
        validator('format', {
            type: 'email',
            allowBlank: true
        })
    ]
});

export default DS.Model.extend(Validations, {
    username: DS.attr(),
    password: DS.attr(),
    rpassword: DS.attr(),
    email: DS.attr(),
    phone: DS.attr(),
    firstname: DS.attr(),
    secondname: DS.attr(),
    masterTZ: DS.attr(),
    enabled: DS.attr(),
    accountExpired: DS.attr(),
    accountLocked: DS.attr(),
    passwordExpired: DS.attr(),
    fullname: computed('firstname', 'secondname', function() {
        if (!this.secondname) {
            return this.firstname;  
        }
        
        return `${this.firstname} ${this.secondname}`;
    })
});