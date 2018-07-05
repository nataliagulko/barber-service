import Service from '@ember/service';

export default Service.extend({
	PHONE_MASK: null,
	PHONE_LENGTH: 16,

    init() {
        this._super(...arguments);

        this.set("PHONE_MASK", ['+', '7', '(', /[1-9]/, /\d/, /\d/, ')', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]);
    }
});
