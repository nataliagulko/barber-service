import { attr, belongsTo, hasMany } from "@ember-decorators/data";
import { computed } from "@ember-decorators/object";
import { buildValidations, validator } from "ember-cp-validations";
import DS from "ember-data";
import Business from "./business";
import Role from "./role";

const Validations = buildValidations({
	firstname: validator("presence", true),
	secondname: validator("presence", true),
	email: [
		validator("format", {
			type: "email",
			allowBlank: true,
		}),
	],
	phone: [
		validator("presence", true),
		validator("format", {
			type: "phone",
			allowBlank: false,
			regex: /(\+7\(\d{3}\)\d{3}-\d{2})-(\d{1})/,
		}),
	],
	password: [
		validator("length", {
			min: 6,
			max: 20,
		}),
		validator("format", {
			allowBlank: true,
			regex: /((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20})/,
			messageKey: "auth.registration.password.validation.message",
		}),
	],
	rpassword: [
		validator("confirmation", {
			on: "password",
			allowBlank: true,
		}),
	],
	role: validator("has-many", true),
	business: validator("belongs-to", true),
});

export default class Master extends DS.Model.extend(Validations) {
	@attr("string") username!: string
	@attr("string") password!: string
	@attr("string") rpassword!: string
	@attr("string") email!: string
	@attr("string") firstname!: string
	@attr("string") secondname!: string
	@attr("string") phone!: string
	@attr("string") masterTZ!: string
	@attr("boolean") enabled!: boolean
	@attr("boolean") accountExpired!: boolean
	@attr("boolean") accountLocked!: boolean
	@attr("boolean") passwordExpired!: boolean
	@hasMany("role", { async: true }) roles!: Role[]
	@belongsTo("business", { async: true }) business!: Business

	@computed("fullname")
	get getFullName(): string {
		if (!this.secondname) {
			return this.firstname
		}

		return `${this.firstname} ${this.secondname}`
	}
}

declare module "ember-data/types/registries/model" {
	interface ModelRegistry {
		"master": Master
	}
}
