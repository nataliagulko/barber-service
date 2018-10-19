import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | bootbox service', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:bootbox-service');
    assert.ok(service);
  });
});
