import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
    store: inject(),
    bootbox: inject("bootbox-service"),
    classNames: ["progress"],

    actions: {
        removeWorkTime: function (id) {
            const store = this.get("store");
            this.get("bootbox").confirmDelete(store, "workTime", id, "рабочее время");
        }
    }
});
