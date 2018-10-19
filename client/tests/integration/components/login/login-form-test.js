import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | Login | login form', function(hooks) {
  setupRenderingTest(hooks);

  skip('it renders', function(assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs`{{login/login-form}}`);

    assert.dom('*').hasText('');

    // Template block usage:
    this.render(hbs`
      {{#login/login-form}}
        template block text
      {{/login/login-form}}
    `);

    assert.dom('*').hasText('template block text');
  });
});
