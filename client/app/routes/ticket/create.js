import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model() {
        return Ember.RSVP.hash({
            ticket: this.get('store').createRecord('ticket'),
            masters: this.get('store').findAll('master'),
            //holidays: this.get('store').findAll('holiday'),            
        });
    },
});
