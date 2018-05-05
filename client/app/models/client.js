import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
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
    tickets: DS.hasMany('ticket'),
    fullname: Ember.computed('firstname', 'secondname', function() {
        if (!this.get('secondname')) {
            return this.get('firstname');  
        }
        
        return `${this.get('firstname')} ${this.get('secondname')}`;
    })
});
