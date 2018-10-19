import Route from '@ember/routing/route';
import RollbackAttributesMixin from 'nova/mixins/rollback-attributes-mixin';
import { hash } from 'rsvp';

export default Route.extend(RollbackAttributesMixin, {
    model(params) {
		return hash({
			service: this.store.findRecord('service', params.id),
			masters: this.store.findAll('master')
		});
	},

	deactivate() {
		this._super(...arguments);

		const model = this.modelFor(this.routeName);
		this.rollback(model.service);
	}
});
