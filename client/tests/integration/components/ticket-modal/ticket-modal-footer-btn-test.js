import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ticket-modal/ticket-modal-footer-btn', 'Integration | Component | ticket modal/ticket modal footer btn', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ticket-modal/ticket-modal-footer-btn}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ticket-modal/ticket-modal-footer-btn}}
      template block text
    {{/ticket-modal/ticket-modal-footer-btn}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
