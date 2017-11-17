import DS from 'ember-data';

export default DS.Model.extend({
    username: DS.attr(),
    password: DS.attr(),
    rpassword: DS.attr(),
    email: DS.attr(),
    firstname: DS.attr(),
    secondname: DS.attr(),
    phone: DS.attr(),
    masterTZ: DS.attr(),
    enabled: DS.attr(),
    accountExpired: DS.attr(),
    accountLocked: DS.attr(),
    passwordExpired: DS.attr(),
    holiday: DS.hasMany('holiday'),
    services: DS.hasMany('service'),
    worktimes: DS.hasMany('worktime'),
});