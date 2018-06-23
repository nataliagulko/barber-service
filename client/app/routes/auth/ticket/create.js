import Route from '@ember/routing/route';
import RollbackAttributesMixin from 'nova/mixins/rollback-attributes-mixin';
import { hash } from 'rsvp';
import { inject } from '@ember/service';
import { alias } from '@ember/object/computed';

export default Route.extend(RollbackAttributesMixin, {
	ticketService: inject("ticket-service"),
	ticket: alias("ticketService.ticket"),

    model() {
		const ticket = this.get('store').createRecord('ticket');
		this.set("ticket", ticket);

        return hash({
            masters: this.get('store').findAll('master')
        });
    },

	deactivate() {
		this._super(...arguments);

		const model = this.modelFor(this.routeName);
		this.rollback(model.ticket);
	}
});
