import Ember from 'ember';

export default Ember.Mixin.create({
    rollback(model) {
        model.rollbackAttributes();
    }
});
