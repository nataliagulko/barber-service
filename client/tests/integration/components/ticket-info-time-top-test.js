import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ticket-info-time-top', 'Integration | Component | ticket info time top', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ticket-info-time-top}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ticket-info-time-top}}
      template block text
    {{/ticket-info-time-top}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
