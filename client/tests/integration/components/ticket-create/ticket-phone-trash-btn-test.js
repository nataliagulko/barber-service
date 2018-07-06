import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ticket-phone-trash-btn', 'Integration | Component | ticket phone trash btn', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ticket-phone-trash-btn}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ticket-phone-trash-btn}}
      template block text
    {{/ticket-phone-trash-btn}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
