import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('master/master-schedule', 'Integration | Component | master/master schedule', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{master/master-schedule}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#master/master-schedule}}
      template block text
    {{/master/master-schedule}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
