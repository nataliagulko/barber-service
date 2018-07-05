import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
	store: inject("store"),

	actions: {
		save: function () {
			const serviceRecord = this.get("service");
			console.log(serviceRecord.get("masters").toArray())

			serviceRecord
				.validate()
				.then(({ validations }) => {
					if (validations.get('isValid')) {
						// serviceRecord
						// 	.save()
						// 	.then(() => {
						// 		_this.get("router").transitionTo('service');
						// 	});
					}
				});

		}
	}
});
