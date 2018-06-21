import Component from '@ember/component';
import { inject } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
    notification: inject("notification-service"),
    constants: inject("constants-service"),
    phoneMask: readOnly("constants.PHONE_MASK"),

    submit() {
        this.send("saveMaster");
    },

    actions: {
        saveBusiness: function (master) {
            const _this = this;
            const businessRecord = this.get("business");

            businessRecord
                .validate()
                .then(({ validations }) => {
                    if (validations.get('isValid')) {
                        businessRecord.set("masters", [master]);
                        businessRecord.save()
                            .then((business) => {
                                _this.get("notification").showInfoMessage(`Организация ${business.get("name")} создана. ${master.get("firstname")}, используйте номер телефона и пароль для входа.`);
                                _this.get("router").transitionTo("login");
                            });
                    }
                });
        },

        saveMaster: function () {
            const _this = this;
            const masterRecord = this.get("master");
            const businessRecord = this.get("business");

            masterRecord.set("enabled", true);
            // validate master
            masterRecord
                .validate()
                .then(({ validations }) => {
                    if (validations.get('isValid')) {
                        // then validate business
                        businessRecord.validate()
                            .then(({ validations }) => {
                                if (validations.get('isValid')) {
                                    // and after save master
                                    masterRecord.save()
                                        .then((master) => {
                                            _this.send("saveBusiness", master);
                                        });
                                }
                            });
                    }
                });
        }
    }
});
