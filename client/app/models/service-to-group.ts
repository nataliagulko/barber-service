import { attr, belongsTo } from "@ember-decorators/data";
import { buildValidations, validator } from "ember-cp-validations";
import DS from "ember-data";
import Service from "./service";
import ServiceGroup from "./service-group";

const Validations = buildValidations({
	serviceGroup: validator("belongs-to", true),
	service: validator("belongs-to", true),
});

export default class ServiceToGroup extends DS.Model.extend(Validations) {
	@attr("number") serviceOrder!: number
	@attr("number", { defaultValue: 0 }) serviceTimeout!: number
	@belongsTo serviceGroup!: ServiceGroup
	@belongsTo service!: Service
}

declare module "ember-data/types/registries/model" {
	interface ModelRegistry {
		"service-to-group": ServiceToGroup;
	}
}
