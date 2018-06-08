import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('master-schedule/time-picker', 'Integration | Component | master schedule/time picker', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{master-schedule/time-picker}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#master-schedule/time-picker}}
      template block text
    {{/master-schedule/time-picker}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
