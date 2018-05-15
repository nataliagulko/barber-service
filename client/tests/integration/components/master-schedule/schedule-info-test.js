import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('master-schedule/schedule-info', 'Integration | Component | master schedule/schedule info', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{master-schedule/schedule-info}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#master-schedule/schedule-info}}
      template block text
    {{/master-schedule/schedule-info}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
