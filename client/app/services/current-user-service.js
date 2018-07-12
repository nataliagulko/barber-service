import Service from '@ember/service';
import { inject } from '@ember/service';
import { isEmpty } from '@ember/utils';
import RSVP from 'rsvp';

export default Service.extend({
	session: inject('session'),
	store: inject(),
	master: null,

	load() {
		let phone = this.get('session.data.authenticated.username');

		if (!isEmpty(phone)) {
			return this.get('store').queryRecord('master', { phone }).then((master) => {
				this.set('master', master);
			});
		} else {
			return RSVP.resolve();
		}
	}
});
