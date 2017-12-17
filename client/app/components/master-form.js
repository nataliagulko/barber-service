import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		save: function() {
			const masterRecord = this.get("master"),
			_this = this;

			masterRecord
				.validate()
				.then(({ validations }) => {
					if (validations.get('isValid')) {
						masterRecord
							.save()
							.then(() => {
								_this.get("router").transitionTo('master');
							});
					}
				});

		}
	}
});
