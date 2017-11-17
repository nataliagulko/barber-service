import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('login');
  this.route('ticket', function() {
    this.route('create');
  });
  this.route('service', function() {
    this.route('create');
  });
  this.route('master', function() {
    this.route('create');
    this.route('edit', { path: '/edit/:id' });
  });
  this.route('not-found', { path: '/*path' });
});

export default Router;
