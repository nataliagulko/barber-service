import DS from 'ember-data';

export default DS.Store.extend({

    getSlots() {
        alert('Custom Store');
    }
});