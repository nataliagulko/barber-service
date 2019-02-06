import { attr, hasMany } from "@ember-decorators/data";
import { buildValidations, validator } from "ember-cp-validations";
import DS from "ember-data";
import Client from "./client";
import Master from "./master";

const Validations = buildValidations({
	name: validator("presence", true),
	email: [
		validator("format", {
			allowBlank: true,
			type: "email",
		}),
	],
	phone: [
		validator("format", {
			allowBlank: true,
			type: "phone",
			regex: /(\+7\(\d{3}\)\d{3}-\d{2})-(\d{1})/,
		}),
	],
	masters: validator("has-many", true),
	clients: validator("has-many", true),
});

export default class Business extends DS.Model.extend(Validations) {
	@attr("string") name!: string;
	@attr("string") inn!: string;
	@attr("string") phone!: string;
	@attr("string") address!: string;
	@attr("string") email!: string;
	@attr("string") mode!: string;
	@attr("string") smsCentrLogin!: string;
	@attr("string") smsCentrPass!: string;
	@attr("string") guid!: string;
	@attr("string") code!: string;
	@hasMany("master") masters!: Master[]
	@hasMany("client") clients!: Client[]
}

declare module "ember-data/types/registries/model" {
	export default interface ModelRegistry {
		"business": Business;
	}
}
