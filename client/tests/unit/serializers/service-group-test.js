import { moduleForModel, test } from 'ember-qunit';

moduleForModel('service-group', 'Unit | Serializer | service group', {
  // Specify the other units that are required for this test.
  needs: ['serializer:service-group']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
