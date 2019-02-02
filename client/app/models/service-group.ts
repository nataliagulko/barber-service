import { hasMany } from "@ember-decorators/data";
import { buildValidations, validator } from "ember-cp-validations";
import Service from "./service";
import ServiceToGroup from "./service-to-group";

const Validations = buildValidations({
	servicesToGroup: validator("has-many", true),
});

export default class ServiceGroup extends Service.extend(Validations) {
	@hasMany("serviceToGroup") servicesToGroup!: ServiceToGroup[]
}

declare module "ember-data/types/registries/model" {
	interface ModelRegistry {
		"service-group": ServiceGroup;
	}
}
