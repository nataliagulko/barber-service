import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import config from '../config/environment';
import Ember from 'ember';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
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
		let data = JSON.stringify(this.serialize(snapshot)),
			url = this.buildURL(type.modelName, null, null, 'createRecord');

		url = url + 'Ajax/create';
		return new Ember.RSVP.Promise(function(resolve, reject) {
			Ember.$.ajax({
				type: 'POST',
				url: url,
				dataType: 'json',
				data: data,
				contentType: 'application/json'
			}).then(function(data) {
				Ember.run(null, resolve, data);
			}, function(jqXHR) {
				jqXHR.then = null; // tame jQuery's ill mannered promises
				Ember.run(null, reject, jqXHR);
			});
		});
	},
	findRecord(store, type, id, snapshot) {
		var url = this.buildURL(type.modelName, null, null, 'findRecord');
		url = url + 'Ajax/get';
		let data = JSON.stringify({
			data: {
				"id": id
			}
		});
		console.log(data);

		return new Ember.RSVP.Promise(function(resolve, reject) {
			Ember.$.ajax({
				type: 'POST',
				url: url,
				dataType: 'json',
				data: data,
				contentType: 'application/json'
			}).then(function(data) {
				resolve(data);
			}, function(jqXHR) {
				reject(jqXHR);
			});
		});
	}
});
