import Route from '@ember/routing/route';
import RollbackAttributesMixin from 'nova/mixins/rollback-attributes-mixin';
import { hash } from 'rsvp';

export default Route.extend({
    model(params) {
        return hash(RollbackAttributesMixin, {
            serviceGroup: this.get('store').findRecord('service-group', params.id),
            masters: this.get('store').findAll('master'),
            subservices: this.get('store').findAll('service'),
        });
    },

    deactivate() {
        this._super(...arguments);

        const model = this.modelFor(this.routeName);
        this.rollback(model.serviceGroup);
    }
});
