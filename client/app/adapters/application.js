import DS from 'ember-data';
import config from '../config/environment';
import { singularize } from 'ember-inflector';
import { camelize } from '@ember/string';
import rsvp from 'rsvp';
import $ from 'jquery';
import { inject } from '@ember/controller';

export default DS.JSONAPIAdapter.extend({
	host: config.host,
	session: inject('session'),
	authorize(xhr) {
		let { access_token } = this.get('session.data.authenticated');
		xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
	},

	authorizedAjax: function (url, data) {
		return new rsvp.Promise(function (resolve, reject) {
			$.ajax({
				type: 'POST',
				url: url,
				dataType: 'json',
				data: data,
				contentType: 'application/json; charset=utf-8',
				mimeType: 'application/json',
			}).then(function (data) {
				resolve(data);
			}, function (jqXHR) {
				reject(jqXHR);
			});
		});
	},

	pathForType: function (type) {
		let camelized = camelize(type);
		return singularize(camelized);
	},

	findAll: function (store, type) {
		let url = this.buildURL(type.modelName, null, null, 'findAll');
		url = url + "Ajax/list";

		return this.authorizedAjax(url, null);
	},

	query: function (store, type, query) {
		let url = this.buildURL(type.modelName, null, null, 'findAll');
		const data = JSON.stringify(query);
		const methodName = query.methodName || "list";

		url = url + "Ajax/" + methodName;

		return this.authorizedAjax(url, data);
	},

	queryRecord: function (store, type, query) {
		let url = this.buildURL(type.modelName, null, null, 'findRecord');
		const data = JSON.stringify(query);
		const methodName = query.methodName || "get";

		url = url + "Ajax/" + methodName;

		return this.authorizedAjax(url, data);
	},

	createRecord: function (store, type, snapshot) {
		let url = this.buildURL(type.modelName + 'Ajax/create', null, null, 'createRecord');
		const data = JSON.stringify(this.serialize(snapshot, { includeId: true }));

		return this.authorizedAjax(url, data);
	},

	findRecord(store, type, id) {
		let url = this.buildURL(type.modelName + 'Ajax/get', null, null, 'findRecord');
		const data = JSON.stringify({
			data: {
				id: id
			}
		});

		return this.authorizedAjax(url, data);
	},

	updateRecord(store, type, snapshot) {
		const data = JSON.stringify(this.serialize(snapshot, { includeId: true }));
		const url = this.buildURL(type.modelName + 'Ajax/update', null, null, 'updateRecord');

		return this.authorizedAjax(url, data);
	},

	deleteRecord(store, type, snapshot) {
		const data = JSON.stringify(this.serialize(snapshot, { includeId: true }));
		const url = this.buildURL(type.modelName + 'Ajax/destroy', null, null, 'deleteRecord');

		return this.authorizedAjax(url, data);
	}
});
