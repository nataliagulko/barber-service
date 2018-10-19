import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | master/work times', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{master/work-times}}`);

    assert.dom('*').hasText('');

    // Template block usage:
    await render(hbs`
      {{#master/work-times}}
        template block text
      {{/master/work-times}}
    `);

    assert.dom('*').hasText('template block text');
  });
});
