import { camelize } from "@ember/string";
import DS from "ember-data";
import { singularize } from "ember-inflector";
import TokenAuthorizerMixin from "ember-simple-auth-token/mixins/token-authorizer";
import config from "../config/environment";

export default class Application extends DS.JSONAPIAdapter.extend(TokenAuthorizerMixin) {
	host = config.host

	pathForType(type: string) {
		const camelized = camelize(type);
		return singularize(camelized);
	}

	buildURL(modelName: string | undefined, id: string | null, snapshot: DS.Snapshot | null, requestType: string, query?: {}): string {
		const host = this.host;

		const type = typeof modelName !== "undefined" ? this.pathForType(modelName) : ""
		const model = `${type}Ajax`;
		const ids = id ? `/${id}` : "";

		let method;

		switch (requestType) {
			case "findAll":
				method = "list";
				break;
			case "findRecord":
				method = "get";
				break;
			case "createRecord":
				method = "create";
				break;
			case "updateRecord":
				method = "update";
				break;
			case "deleteRecord":
				method = "destroy";
				break;
			case "query":
				method = query.methodName ? query.methodName : "list";
				break;
			case "queryRecord":
				method = query.methodName ? query.methodName : "get";
				break;
		}

		return `${host}/${model}/${method}${ids}`;
	}
}

declare module "ember-data/types/registries/adapter" {
	export default interface AdapterRegistry {
		"application": Application;
	}
}
