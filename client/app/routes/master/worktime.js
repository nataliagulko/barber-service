import Route from '@ember/route';
import { hash } from 'rsvp';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import RollbackAttributesMixin from 'barbers/mixins/rollback-attributes-mixin';

export default Route.extend(AuthenticatedRouteMixin, RollbackAttributesMixin, {
    model(params) {
        return hash({
            workTimes: this.get("store").query("workTime", {
                query: {
                    masterId: params.id
                }
            }),
            master: this.get('store').findRecord('master', params.id)
        });
    }
});
