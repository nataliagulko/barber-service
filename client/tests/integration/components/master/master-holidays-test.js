import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('master/master-holidays', 'Integration | Component | master/master holidays', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{master/master-holidays}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#master/master-holidays}}
      template block text
    {{/master/master-holidays}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
