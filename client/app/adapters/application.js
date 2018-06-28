import DS from 'ember-data';
import config from '../config/environment';
import { singularize } from 'ember-inflector';
import { camelize } from '@ember/string';
import TokenAuthorizerMixin from 'ember-simple-auth-token/mixins/token-authorizer';

export default DS.JSONAPIAdapter.extend(TokenAuthorizerMixin, {
	host: config.host,

	pathForType: function (type) {
		const camelized = camelize(type);
		return singularize(camelized);
	},

	buildURL: function (modelName, id, snapshot, requestType, query) {
		const host = this.get("host");

		const type = this.pathForType(modelName);
		const model = `${type}Ajax`;
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

		return `${host}/${model}/${method}${ids}`;
	},
});
