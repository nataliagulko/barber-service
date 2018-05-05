import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    notifications: Ember.inject.service("toast"),

    model() {
        return Ember.RSVP.hash({
			allEvents: []
		});
    },

    activate(arg) {
        this._super(...arguments);

        console.log("activate ", arg);
        let notifications = this.get('notifications');

        notifications.success('Запись на 5 мая 10:00', 'Запись добавлена');
    },
});
