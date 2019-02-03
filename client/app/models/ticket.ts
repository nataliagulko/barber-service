import { attr, belongsTo, hasMany } from "@ember-decorators/data";
import { buildValidations, validator } from "ember-cp-validations";
import DS from "ember-data";
import moment from "moment";
import Client from "./client";
import Master from "./master";
import Service from "./service";

const Validations = buildValidations({
	ticketDate: [
		validator("presence", true),
		validator("date", {
			after: moment().subtract(1, "days"),
			precision: "day",
			format: "DD.MM.YYYY",
		}),
	],
	time: [
		validator("presence", true),
		validator("date", {
			format: "HH:mm",
		}),
	],
	cost: validator("number", {
		allowString: true,
		gt: 0,
	}),
	duration: validator("number", {
		allowString: true,
		gt: 0,
	}),
	client: [
		validator("presence", true),
		validator("belongs-to", true),
	],
	master: [
		validator("presence", true),
		validator("belongs-to", true),
	],
	services: [
		validator("presence", true),
		validator("has-many", true),
	],
});

export default class Ticket extends DS.Model.extend(Validations) {
	@attr("string") ticketDate!: string
	@attr("string") time!: string
	@attr("string") status!: string
	@attr("string") comment!: string
	@attr("string") guid!: string
	@attr("string") type!: string
	@attr("string") cost!: string
	@attr("string") duration!: string
	@belongsTo client!: Client
	@belongsTo master!: Master
	@hasMany services!: Service[]
}

declare module "ember-data/types/registries/model" {
	interface ModelRegistry {
		"ticket": Ticket;
	}
}
