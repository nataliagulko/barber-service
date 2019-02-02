import { attr } from "@ember-decorators/data";
import { buildValidations, validator } from "ember-cp-validations";
import Model from "ember-data";

const Validations = buildValidations({
	authority: validator("presence", true),
	description: validator("presence", true),
});

export default class Role extends Model.extend(Validations) {
	@attr("string") authority!: string
	@attr("string") description!: string
}

declare module "ember-data" {
	interface ModelRegistry {
		"role": Role;
	}
}
