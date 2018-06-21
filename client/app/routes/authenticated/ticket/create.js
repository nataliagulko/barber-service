import Route from '@ember/routing/route';
import RollbackAttributesMixin from 'nova/mixins/rollback-attributes-mixin';
import { hash } from 'rsvp';

export default Route.extend(RollbackAttributesMixin, {
    model() {
        return hash({
            ticket: this.get('store').createRecord('ticket'),
            masters: this.get('store').findAll('master')
        });
    },

	deactivate() {
		this._super(...arguments);

		const model = this.modelFor(this.routeName);
		this.rollback(model.ticket);
	}
});
