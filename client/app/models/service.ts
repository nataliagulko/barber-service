import { attr, hasMany } from "@ember-decorators/data";
import { buildValidations, validator } from "ember-cp-validations";
import DS from "ember-data";
import Master from "./master";

const Validations = buildValidations({
	name: validator("presence", true),
	cost: validator("number", {
		allowString: true,
		gt: 0,
	}),
	time: validator("number", {
		allowString: true,
		gt: 0,
	}),
	masters: validator("has-many", true),
});

export default class Service extends DS.Model.extend(Validations) {
	@attr("string") name!: string
	@attr("number", { defaultValue: 0 }) cost!: number
	@attr("number", { defaultValue: 0 }) time!: number
	@attr("boolean") partOfList!: boolean
	@hasMany masters!: Master[]
}

declare module "ember-data/types/registries/model" {
	interface ModelRegistry {
		"service": Service;
	}
}
