import DS from 'ember-data';
import config from '../config/environment';
import { singularize } from 'ember-inflector';
import { camelize } from '@ember/string';
import rsvp from 'rsvp';
import $ from 'jquery';
import { inject } from '@ember/service';
import TokenAuthorizerMixin from 'ember-simple-auth-token/mixins/token-authorizer';

export default DS.JSONAPIAdapter.extend(TokenAuthorizerMixin, {
	host: config.host,

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

	buildURL: function (modelName, id, snapshot, requestType, query) {
		this._super(...arguments);

		const host = this.get("host");
		const model = `${modelName}Ajax`;
		const ids = id ? `/${id}` : '';
		let method;

		switch (requestType) {
			case 'findAll':
				method = 'list';
				break;
			case 'findRecord':
				method = 'get';
				break;
			case 'createRecord':
				method = 'create';
				break;
			case 'updateRecord':
				method = 'update';
				break;
			case 'deleteRecord':
				method = 'destroy';
				break;
			case 'query':
				method = query.methodName ? query.methodName : 'list';
				break;
			case 'queryRecord':
			method = query.methodName ? query.methodName : 'get';
				break;
		}

		console.log(requestType);
		return `${host}/${model}/${method}${ids}`;
	},

	// query: function (store, type, query) {
	// 	let url = this.buildURL(type.modelName, null, null, 'findAll');
	// 	const data = JSON.stringify(query);
	// 	const methodName = query.methodName || "list";

	// 	url = url + "Ajax/" + methodName;

	// 	return this.authorizedAjax(url, data);
	// },

	// queryRecord: function (store, type, query) {
	// 	let url = this.buildURL(type.modelName, null, null, 'findRecord');
	// 	const data = JSON.stringify(query);
	// 	const methodName = query.methodName || "get";

	// 	url = url + "Ajax/" + methodName;

	// 	return this.authorizedAjax(url, data);
	// },

	// createRecord: function (store, type, snapshot) {
	// 	let url = this.buildURL(type.modelName + 'Ajax/create', null, null, 'createRecord');
	// 	const data = JSON.stringify(this.serialize(snapshot, { includeId: true }));

	// 	return this.authorizedAjax(url, data);
	// },

	// findRecord(store, type, id) {
	// 	let url = this.buildURL(type.modelName + 'Ajax/get', null, null, 'findRecord');
	// 	const data = JSON.stringify({
	// 		data: {
	// 			id: id
	// 		}
	// 	});

	// 	return this.authorizedAjax(url, data);
	// },

	// updateRecord(store, type, snapshot) {
	// 	const data = JSON.stringify(this.serialize(snapshot, { includeId: true }));
	// 	const url = this.buildURL(type.modelName + 'Ajax/update', null, null, 'updateRecord');

	// 	return this.authorizedAjax(url, data);
	// },

	// deleteRecord(store, type, snapshot) {
	// 	const data = JSON.stringify(this.serialize(snapshot, { includeId: true }));
	// 	const url = this.buildURL(type.modelName + 'Ajax/destroy', null, null, 'deleteRecord');

	// 	return this.authorizedAjax(url, data);
	// }
});
