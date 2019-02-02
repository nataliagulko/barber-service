import { attr, belongsTo } from "@ember-decorators/data";
import { buildValidations, validator } from "ember-cp-validations";
import Model from "ember-data";
import Master from "./master";

const Validations = buildValidations({
	master: validator("belongs-to", true),
	slotDate: [
		validator("date", {
			precision: "day",
			format: "DD.MM.YYYY",
		}),
	],
});

export default class Slot extends Model.extend(Validations) {
	@attr("string") start!: string
	@attr("string") end!: string
	@attr("string") slotDate!: string
	@belongsTo("master") master!: PromiseObject<Master>
}

declare module "ember-data" {
	interface ModelRegistry {
		"slot": Slot;
	}
}
