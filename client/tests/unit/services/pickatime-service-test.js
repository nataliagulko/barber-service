import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | pickatime serice', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:pickatime-serice');
    assert.ok(service);
  });
});
