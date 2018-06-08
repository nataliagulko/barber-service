import Component from '@ember/component';

export default Component.extend({
    classNames: ["progress"],

    actions: {
        selectWorkTime: function(id) {
            this.set("id", id);
        }
    }
});
