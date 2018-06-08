import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ticket-list/calendar-filters', 'Integration | Component | ticket list/calendar filters', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ticket-list/calendar-filters}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ticket-list/calendar-filters}}
      template block text
    {{/ticket-list/calendar-filters}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
