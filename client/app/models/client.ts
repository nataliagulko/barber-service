import { attr } from "@ember-decorators/data";
import { computed } from "@ember-decorators/object";
import { buildValidations, validator } from "ember-cp-validations";
import DS from "ember-data";

const Validations = buildValidations({
	email: [
		validator("format", {
			allowBlank: true,
			type: "email",
		}),
	],
	firstname: validator("presence", true),
	phone: [
		validator("presence", true),
		validator("format", {
			allowBlank: true,
			regex: /(\+7\(\d{3}\)\d{3}-\d{2})-(\d{1})/,
			type: "phone",
		}),
	],
});

export default class Client extends DS.Model.extend(Validations) {
	@attr("string") username!: string
	@attr("string") password!: string
	@attr("string") rpassword!: string
	@attr("string") email!: string
	@attr("string") phone!: string
	@attr("string") firstname!: string
	@attr("string") secondname!: string
	@attr("string") masterTZ!: string
	@attr("string") enabled!: string
	@attr("string") accountExpired!: string
	@attr("string") accountLocked!: string
	@attr("string") passwordExpired!: string

	@computed("firstname", "secondname")
	get fullname(): string {
		if (!this.secondname) {
			return this.firstname
		}

		return `${this.firstname} ${this.secondname}`
	}

	set fullname(value: string) {
		const [firstname, secondname] = value.split(" ")
		this.setProperties({ firstname, secondname })
	}
}

declare module "ember-data/types/registries/model" {
	export default interface ModelRegistry {
		"client": Client;
	}
}
