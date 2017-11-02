import { moduleForModel, test } from 'ember-qunit';

moduleForModel('service-to-group', 'Unit | Serializer | service to group', {
  // Specify the other units that are required for this test.
  needs: ['serializer:service-to-group']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
