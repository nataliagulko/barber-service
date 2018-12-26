import Service from "@ember/service";

export default class ConstantsService extends Service {
	public PHONE_MASK: Array<RegExp | string> = [];
	public PHONE_LENGTH: number = 16;
	public TIME_MASK: Array<RegExp | string> = [];
	public DATE_MASK: Array<RegExp | string> = [];
	public DEFUALT_DATE_FORMAT: string = "DD.MM.YYYY";

	public init(this: ConstantsService) {
		this._super(...arguments);

		this.set("PHONE_MASK", ["+", "7", "(", /[1-9]/, /\d/, /\d/, ")", /\d/, /\d/, /\d/, "-", /\d/, /\d/, "-", /\d/, /\d/]);
		this.set("TIME_MASK", [/\d/, /\d/, ":", /\d/, /\d/]);
		this.set("DATE_MASK", [/\d/, /\d/, ".", /\d/, /\d/, ".", /\d/, /\d/, /\d/, /\d/]);
	}
}

declare module "@ember/service" {
	interface Registry {
		"constants-service": ConstantsService;
	}
}
