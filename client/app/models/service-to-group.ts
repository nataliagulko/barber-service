import { attr, belongsTo } from "@ember-decorators/data";
import { buildValidations, validator } from "ember-cp-validations";
import Model from "ember-data";
import ServiceGroup from "./service-group";

const Validations = buildValidations({
	serviceGroup: validator("belongs-to", true),
	service: validator("belongs-to", true),
});

export default class ServiceToGroup extends Model.extend(Validations) {
	@attr("number") serviceOrder!: number
	@attr("number", { defaultValue: 0 }) serviceTimeout!: number
	@belongsTo("serviceGroup") serviceGroup!: PromiseObject<ServiceGroup>
	@belongsTo("service") service!: PromiseObject<Service>
}

declare module "ember-data" {
	interface ModelRegistry {
		"service-to-group": ServiceToGroup;
	}
}
