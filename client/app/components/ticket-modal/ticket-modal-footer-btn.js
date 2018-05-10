import Ember from 'ember';

export default Ember.Component.extend({
    tagName: "button",
    classNames: ["btn"],
    store: Ember.inject.service("store"),
	bootbox: Ember.inject.service("bootbox-service"),

    click(e) {
        const act = this.get("act"),
            event = this.get("event");

        this.send(act, event);
    },

    actions: {
        remove: function (event) {
            const store = this.get("store");
            
            Ember.$("#ticket-modal").modal('hide');                        
            this.get("bootbox").confirmDelete(store, "ticket", event.id, "запись");
        },

        reject: function (event) {
            console.log("reject", event);
        },

        accept: function (event) {
            console.log("accept", event);
        }
    }
});
