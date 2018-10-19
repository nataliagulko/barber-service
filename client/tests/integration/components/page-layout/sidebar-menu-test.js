import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | sidebar menu', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{sidebar-menu}}`);

    assert.dom('*').hasText('');

    // Template block usage:
    await render(hbs`
      {{#sidebar-menu}}
        template block text
      {{/sidebar-menu}}
    `);

    assert.dom('*').hasText('template block text');
  });
});
