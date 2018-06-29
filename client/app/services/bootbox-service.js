import Service from '@ember/service';

export default Service.extend({
	confirmDelete(store, type, id) {
		store.findRecord(type, id, { backgroundReload: false }).then(function (item) {
			item.destroyRecord();
		});
	}
});
