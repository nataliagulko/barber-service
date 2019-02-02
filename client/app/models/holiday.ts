import { attr, belongsTo } from "@ember-decorators/data";
import { buildValidations, validator } from "ember-cp-validations";
import Model from "ember-data";

const Validations = buildValidations({
	dateFrom: [
		validator("presence", true),
		validator("date", {
			precision: "day",
			format: "DD.MM.YYYY",
		}),
	],
	dateTo: [
		validator("presence", true),
		validator("date", {
			precision: "day",
			format: "DD.MM.YYYY",
		}),
	],
	master: validator("belongs-to", true),
});

export default class Holiday extends Model.extend(Validations) {
	@attr("string") dateFrom!: string
	@attr("string") dateTo!: string
	@attr("string") comment!: string
	@belongsTo("master") master: PromiseObject<Master>;
}

declare module "ember-data" {
	interface ModelRegistry {
		"holiday": Holiday;
	}
}
