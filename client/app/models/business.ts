import { attr, hasMany } from "@ember-decorators/data";
import { buildValidations, validator } from "ember-cp-validations";
import Model from "ember-data";
import Client from "./client";

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

export default class Business extends Model.extend(Validations) {
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
	@hasMany("master") masters!: PromiseManyArray<Master>;
	@hasMany("client") clients!: PromiseManyArray<Client>;
}

declare module "ember-data" {
	interface ModelRegistry {
		"business": Business;
	}
}
