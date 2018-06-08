import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('master-schedule/master-schedule', 'Integration | Component | master schedule/master schedule', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{master-schedule/master-schedule}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#master-schedule/master-schedule}}
      template block text
    {{/master-schedule/master-schedule}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
