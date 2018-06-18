import Service from '@ember/service';

export default Service.extend({
	confirmDelete(store, type, id, typeString) {
		bootbox.confirm({
			size: "small",
			title: "Подтвердите удаление",
			message: "Удалить " + typeString + "?",
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
			callback: function(res) {
				if (res) {
					store.findRecord(type, id, { backgroundReload: false }).then(function(item) {
						item.destroyRecord();
					});
				}
			}
		});
	}
});
