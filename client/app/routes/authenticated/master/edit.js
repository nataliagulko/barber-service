import Route from '@ember/routing/route';
import RollbackAttributesMixin from 'barbers/mixins/rollback-attributes-mixin';

export default Route.extend(RollbackAttributesMixin, {
	model(params) {
		return this.store.findRecord('master', params.master_id);
	},

	deactivate() {
		this._super(...arguments);

		const model = this.modelFor(this.routeName);
		this.rollback(model);
	}
});