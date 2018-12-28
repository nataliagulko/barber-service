import Service from "@ember/service";

export default class ConstantsService extends Service {
	PHONE_MASK: Array<RegExp | string> = ["+", "7", "(", /[1-9]/, /\d/, /\d/, ")", /\d/, /\d/, /\d/, "-", /\d/, /\d/, "-", /\d/, /\d/];
	PHONE_LENGTH: number = 16;
	TIME_MASK: Array<RegExp | string> = [/\d/, /\d/, ":", /\d/, /\d/];
	DATE_MASK: Array<RegExp | string> = [/\d/, /\d/, ".", /\d/, /\d/, ".", /\d/, /\d/, /\d/, /\d/];
	DEFUALT_DATE_FORMAT: string = "DD.MM.YYYY";
}

declare module "@ember/service" {
	interface Registry {
		"constants-service": ConstantsService;
	}
}
