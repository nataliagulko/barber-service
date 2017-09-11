import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import config from '../config/environment';

export default DS.RESTAdapter.extend(DataAdapterMixin, {
	namespace: 'api',
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

		return this.ajax(url + "Ajax/list", 'POST', {
			data: query
		});
	},
});
