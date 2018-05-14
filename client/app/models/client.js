import DS from 'ember-data';
import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
    firstname: validator('presence', true),
    phone: validator('presence', true),
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
    fullname: Ember.computed('firstname', 'secondname', function() {
        if (!this.get('secondname')) {
            return this.get('firstname');  
        }
        
        return `${this.get('firstname')} ${this.get('secondname')}`;
    })
});