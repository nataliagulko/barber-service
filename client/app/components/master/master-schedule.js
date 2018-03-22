import Ember from 'ember';

export default Ember.Component.extend({
    didInsertElement() {
        const master = this.get("master"),
            workTimesRef = master.hasMany('workTimes');

        console.log(workTimesRef.ids());
    }
});
