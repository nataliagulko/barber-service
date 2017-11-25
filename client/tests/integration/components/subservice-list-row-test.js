import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('subservice-list-row', 'Integration | Component | subservice list row', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{subservice-list-row}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#subservice-list-row}}
      template block text
    {{/subservice-list-row}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
