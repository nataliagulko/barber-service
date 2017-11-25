import DS from 'ember-data';
import {singularize} from 'ember-inflector';

export default DS.JSONAPISerializer.extend({
	keyForAttribute(key) {
		return key;
	},

	keyForRelationship(key) {
		return key;
	},

	payloadKeyFromModelName: function(modelName) {
	  return singularize(modelName);
	}
});
