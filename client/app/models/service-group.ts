import { hasMany } from "@ember-decorators/data";
import { buildValidations, validator } from "ember-cp-validations";
import Service from "./service";

const Validations = buildValidations({
	servicesToGroup: validator("has-many", true),
});

export default class ServiceGroup extends Service.extend(Validations) {
	@hasMany("serviceToGroup") servicesToGroup!: DS.PromiseManyArray<ServiceToGroup>
}

declare module "ember-data" {
	interface ModelRegistry {
		"service-group": ServiceGroup;
	}
}
