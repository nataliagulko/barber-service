import EmberObject from '@ember/object';
import RollbackAttributesMixinMixin from 'barbers/mixins/rollback-attributes-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | rollback attributes mixin', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let RollbackAttributesMixinObject = EmberObject.extend(RollbackAttributesMixinMixin);
    let subject = RollbackAttributesMixinObject.create();
    assert.ok(subject);
  });
});
