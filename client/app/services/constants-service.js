import Service from '@ember/service';

export default Service.extend({
    PHONE_MASK: null,

    init() {
        this._super(...arguments);

        this.set("PHONE_MASK", ['+', '7', '(', /[1-9]/, /\d/, /\d/, ')', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]);
    }
});
