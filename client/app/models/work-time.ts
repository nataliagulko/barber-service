import { attr, belongsTo } from "@ember-decorators/data";
import { computed } from "@ember-decorators/object";
import { buildValidations, validator } from "ember-cp-validations";
import DS from "ember-data";
import Master from "./master";

const Validations = buildValidations({
	timeFrom: [
		validator("presence", true),
		validator("date", {
			precision: "hour",
			format: "HH:mm",
		}),
	],
	timeTo: [
		validator("presence", true),
		validator("dependent", {
			on: ["timeFrom"],
		}),
		validator("date", {
			precision: "hour",
			format: "HH:mm",
		}),
	],
	dayOfWeek: validator("presence", true),
	master: validator("belongs-to", true),
});

export default class WorkTime extends DS.Model.extend(Validations) {
	@attr("string") timeFrom!: string
	@attr("string") timeTo!: string
	@attr("string") dayOfWeek!: string
	@attr("string") dateFrom!: string
	@attr("string") dateTo!: string
	@belongsTo("master") master!: Master

	@computed("timeFrom", "timeTo")
	get timeRange(): string {
		return `${this.timeFrom}—${this.timeTo}`;
	}

	set timeRange(value: string) {
		const [timeFrom, timeTo] = value.split("—")
		this.setProperties({ timeFrom, timeTo })
	}
}

declare module "ember-data/types/registries/model" {
	export default interface ModelRegistry {
		"work-time": WorkTime;
	}
}
