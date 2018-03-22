import Ember from 'ember';
import RollbackAttributesMixinMixin from 'barbers/mixins/rollback-attributes-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | rollback attributes mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let RollbackAttributesMixinObject = Ember.Object.extend(RollbackAttributesMixinMixin);
  let subject = RollbackAttributesMixinObject.create();
  assert.ok(subject);
});
