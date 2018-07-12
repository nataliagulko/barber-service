import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('master/master-holiday-create', 'Integration | Component | master/master holiday create', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{master/master-holiday-create}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#master/master-holiday-create}}
      template block text
    {{/master/master-holiday-create}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
