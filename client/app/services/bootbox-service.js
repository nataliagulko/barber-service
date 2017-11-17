
import Ember from 'ember';

export default Ember.Service.extend({
	confirmDelete(store, type, id) {
		bootbox.confirm({
			size: "small",
			title: "Подтвердите удаление",
			message: "Удалить мастера?",
			buttons: {
				confirm: {
					label: 'Удалить',
					className: 'btn-danger'
				},
				cancel: {
					label: 'Отмена',
					className: 'btn-default'
				}
			},
			callback: function() {
				store.findRecord(type, id, { backgroundReload: false }).then(function(item) {
					item.destroyRecord();
				});
			}
		});
	}
});
