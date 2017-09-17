import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import config from '../config/environment';
import Ember from 'ember';

export default DS.RESTAdapter.extend(DataAdapterMixin, {
	//namespace: 'api',
	authorizer: 'authorizer:token',
	host: config.host,
	headers: {
		withCredentials: true
	},
	pathForType: function(type) {
		var camelized = Ember.String.camelize(type);
		return Ember.String.singularize(camelized);
	},
	findAll: function(store, type, sinceToken) {
		var query, url;

		if (sinceToken) {
			query = { since: sinceToken };
		}

		url = this.buildURL(type.modelName, null, null, 'findAll');
		url = url + "Ajax/list";

		return this.ajax(url, 'POST', {
			data: query
		});
	},
	createRecord: function(store, type, snapshot) {
		let data = this.serialize(snapshot, { includeId: true }),
			url = this.buildURL(type.modelName, null, null, 'createRecord');

		url = url + 'Ajax/create';
		return new Ember.RSVP.Promise(function(resolve, reject) {
			Ember.$.ajax({
				type: 'POST',
				url: url,
				dataType: 'json',
				data: data
			}).then(function(data) {
				Ember.run(null, resolve, data);
			}, function(jqXHR) {
				jqXHR.then = null; // tame jQuery's ill mannered promises
				Ember.run(null, reject, jqXHR);
			});
		});
	}
});
