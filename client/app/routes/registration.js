import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import { hash } from 'rsvp';

export default Route.extend(UnauthenticatedRouteMixin, {
    model() {
        const store = this.get('store');

        return hash({
            business: store.createRecord('business'),
            master: store.createRecord('master'),
        });
    }
});
