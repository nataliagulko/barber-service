import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ticket-modal/ticket-modal', 'Integration | Component | ticket modal/ticket modal', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ticket-modal/ticket-modal}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ticket-modal/ticket-modal}}
      template block text
    {{/ticket-modal/ticket-modal}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
