import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import config from '../config/environment';
import Ember from 'ember';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
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
		let url = this.buildURL(type.modelName + 'Ajax/create', null, null, 'createRecord'),
			data = JSON.stringify(this.serialize(snapshot));

		return authorizedAjax(this.get("session"), url, data);
	},

	findRecord(store, type, id, query) {
		let url = this.buildURL(type.modelName + 'Ajax/get', null, null, 'findRecord'),
			data = JSON.stringify({
				data: {
					id: id
				}
			});

		return authorizedAjax(this.get("session"), url, data);
	},

	updateRecord(store, type, snapshot) {
		let data = JSON.stringify(this.serialize(snapshot, { includeId: true })),
		url = this.buildURL(type.modelName + 'Ajax/update', null, null, 'updateRecord');

		return authorizedAjax(this.get("session"), url, data);
	}
});

export default function authorizedAjax(session, url, data) {
	let token;

	session.authorize('authorizer:token', (headerName, headerValue) => {
		token = headerValue;
	});

	return new Ember.RSVP.Promise(function(resolve, reject) {
		Ember.$.ajax({
			beforeSend: function(xhr) {
				xhr.setRequestHeader('Authorization', token);
			},
			type: 'POST',
			url: url,
			dataType: 'json',
			data: data,
			contentType: 'application/json; charset=utf-8',
			mimeType: 'application/json',
		}).then(function(data) {
			resolve(data);
		}, function(jqXHR) {
			reject(jqXHR);
		});
	});
}
