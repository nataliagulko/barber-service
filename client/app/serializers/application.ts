import DS from "ember-data";
import { singularize } from "ember-inflector";

export default class Application extends DS.JSONAPISerializer.extend({
}) {
	keyForAttribute(key: string) {
		return key;
	}

	keyForRelationship(key: string) {
		return key;
	}

	payloadKeyFromModelName(modelName: string) {
		return singularize(modelName);
	}
}

declare module "ember-data/types/registries/serializer" {
	export default interface SerializerRegistry {
		"application": Application;
	}
}
