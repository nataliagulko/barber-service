import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model() {
        return this.store.query(
            'ticket',
            {
                query: {
                    onlyHead: true,
                    ticketDateFrom: "03.03.2018",
                    ticketDateTo: "10.03.2018"
                }
            },
            {
                include: "client"
            }
        )
    },
});
