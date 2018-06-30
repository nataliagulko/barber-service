import Component from '@ember/component';
import {inject} from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
	constants: inject("constants-service"),
	phoneMask: readOnly("constants.PHONE_MASK"),
	
	actions: {
		save: function() {
			const masterRecord = this.get("master"),
			_this = this;

            masterRecord.set("enabled", true);
			masterRecord
				.validate()
				.then(({ validations }) => {
					if (validations.get('isValid')) {
						masterRecord
							.save()
							.then(() => {
								_this.get("router").transitionTo('auth.master');
							});
					}
				});

		}
	}
});
