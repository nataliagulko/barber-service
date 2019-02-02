// import { buildValidations, validator } from "ember-cp-validations";
import { attr, hasMany } from "@ember-decorators/data";
import Model from "ember-data";

// const Validations = buildValidations({
// 	name: validator("presence", true),
// 	email: [
// 		validator("format", {
// 			type: "email",
// 			allowBlank: true,
// 		}),
// 	],
// 	phone: [
// 		validator("format", {
// 			type: "phone",
// 			allowBlank: true,
// 			regex: /(\+7\(\d{3}\)\d{3}-\d{2})-(\d{1})/,
// 		}),
// 	],
// 	masters: validator("has-many"),
// 	clients: validator("has-many"),
// });

export default class BusinessModel extends Model {
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
		"business": BusinessModel;
	}
}
