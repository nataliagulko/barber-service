import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function () {
  this.route('not-found', { path: '/*path' });
  this.route('login');
  this.route('auth', { page: '/' }, function () {
    this.route('ticket', function () {
      this.route('create');
    });
    this.route('service', function () {
      this.route('create');
      this.route('edit', { path: '/edit/:id' });
    });
    this.route('master', function () {
      this.route('create');
      this.route('edit', { path: '/edit/:master_id' });
      this.route('work-time', { path: '/:master_id/work-time' });
    });
    this.route('service-group', function () {
      this.route('edit', { path: '/edit/:id' });
    });
  });
  this.route('registration');
});

export default Router;
