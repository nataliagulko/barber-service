import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ticket-info-master-temp', 'Integration | Component | ticket info master temp', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ticket-info-master-temp}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ticket-info-master-temp}}
      template block text
    {{/ticket-info-master-temp}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
