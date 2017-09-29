import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		saveMaster: function(master) {
			master.save();
		}
	}
});
