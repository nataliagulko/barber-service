import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('master/work-time-row', 'Integration | Component | master/work time row', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{master/work-time-row}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#master/work-time-row}}
      template block text
    {{/master/work-time-row}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
