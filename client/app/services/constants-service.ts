import Service from "@ember/service";

export default class ConstantsService extends Service {
	public PHONE_MASK: Array<RegExp | string> = ["+", "7", "(", /[1-9]/, /\d/, /\d/, ")", /\d/, /\d/, /\d/, "-", /\d/, /\d/, "-", /\d/, /\d/];
	public PHONE_LENGTH: number = 16;
	public TIME_MASK: Array<RegExp | string> = [/\d/, /\d/, ":", /\d/, /\d/];
	public DATE_MASK: Array<RegExp | string> = [/\d/, /\d/, ".", /\d/, /\d/, ".", /\d/, /\d/, /\d/, /\d/];
	public DEFUALT_DATE_FORMAT: string = "DD.MM.YYYY";
}

declare module "@ember/service" {
	interface Registry {
		"constants-service": ConstantsService;
	}
}
