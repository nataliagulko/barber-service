import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('submit-forget-code', 'Integration | Component | submit forget code', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{submit-forget-code}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#submit-forget-code}}
      template block text
    {{/submit-forget-code}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
