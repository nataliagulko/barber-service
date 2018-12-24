import Service from '@ember/service';

export default class ConstantsService extends Service {
	PHONE_MASK: (RegExp | string)[] = []
	PHONE_LENGTH: number = 16
	TIME_MASK: (RegExp | string)[] = []
	DATE_MASK: (RegExp | string)[] = []
	DEFUALT_DATE_FORMAT: string = "DD.MM.YYYY"

	init(this: ConstantsService) {
		this._super(...arguments);

		this.set("PHONE_MASK", ['+', '7', '(', /[1-9]/, /\d/, /\d/, ')', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]);
		this.set("TIME_MASK", [/\d/, /\d/, ':', /\d/, /\d/]);
		this.set("DATE_MASK", [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/,]);
	}
}


declare module '@ember/service' {
	interface Registry {
		'constants-service': ConstantsService;
	}
}
