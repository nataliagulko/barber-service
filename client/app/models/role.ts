import { attr } from "@ember-decorators/data";
import { buildValidations, validator } from "ember-cp-validations";
import DS from "ember-data";

const Validations = buildValidations({
	authority: validator("presence", true),
	description: validator("presence", true),
});

export default class Role extends DS.Model.extend(Validations) {
	@attr("string") authority!: string
	@attr("string") description!: string
}

declare module "ember-data/types/registries/model" {
	export default interface ModelRegistry {
		"role": Role;
	}
}
