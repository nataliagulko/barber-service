import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('master-schedule/work-time-item', 'Integration | Component | master schedule/work time item', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{master-schedule/work-time-item}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#master-schedule/work-time-item}}
      template block text
    {{/master-schedule/work-time-item}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
