import Ember from 'ember';

export default Ember.Component.extend({
    tagName: "button",
    classNames: ["btn"],

    click(e) {
        console.log("click", this.get("event"));
    },

    actions: {
        submitRemove: () => {
            console.log("submitRemove");
        }
    }
});
