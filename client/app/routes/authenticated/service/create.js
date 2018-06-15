import Route from '@ember/routing/route';
import RollbackAttributesMixin from 'barbers/mixins/rollback-attributes-mixin';
import { hash } from 'rsvp';

export default Route.extend(RollbackAttributesMixin, {
    model() {
        const store = this.get('store');

        return hash({
            service: store.createRecord('service'),
            serviceGroup: store.createRecord('serviceGroup'),
            masters: store.findAll('master'),
            subservices: store.query('service', {
                query: {
                    onlySimpleService: true
                }
            }),
        });
    },

    deactivate() {
        this._super(...arguments);

        const model = this.modelFor(this.routeName);
        this.rollback(model.service);
        this.rollback(model.serviceGroup);
    }
});
