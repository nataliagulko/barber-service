import Component from '@ember/component';
import { inject } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
    notification: inject("notification-service"),
    constants: inject("constants-service"),
    phoneMask: readOnly("constants.PHONE_MASK"),

    actions: {
        saveBusiness: function () {
            console.log("submit");
            const _this = this;
            const businessRecord = this.get("business");

            businessRecord
                .validate()
                .then(({ validations }) => {

                    if (validations.get('isValid')) {
                        _this.set("showBusinessErrors", false);
                        // businessRecord.set("masters", [master]);
                        // businessRecord.save()
                        //     .then((business) => {
                        //         _this.get("notification").showInfoMessage(`Организация ${business.get("name")} создана. ${master.get("firstname")}, используйте номер телефона и пароль для входа.`);
                        //         _this.get("router").transitionTo("login");
                        //     });
                    } else {
                        _this.set("showBusinessErrors", true);
                    }
                });
        },

        saveBusinessAndUser: function () {
            const _this = this;
            const businessRecord = this.get("business");
            const masterRecord = this.get("master");

            masterRecord.set("enabled", true);
            masterRecord
                .validate()
                .then(({ validations }) => {

                    if (validations.get('isValid')) {
                        _this.set("showMasterErrors", false);
                        masterRecord.save()
                            .then((master) => {

                                businessRecord
                                    .validate()
                                    .then(({ validations }) => {

                                        if (validations.get('isValid')) {
                                            _this.set("showBusinessErrors", false);
                                            businessRecord.set("masters", [master]);
                                            businessRecord.save()
                                                .then((business) => {
                                                    _this.get("notification").showInfoMessage(`Организация ${business.get("name")} создана. ${master.get("firstname")}, используйте номер телефона и пароль для входа.`);
                                                    _this.get("router").transitionTo("login");
                                                });
                                        } else {
                                            _this.set("showBusinessErrors", true);
                                        }
                                    });
                            });
                    } else {
                        _this.set("showMasterErrors", true);
                    }
                });
        }
    }
});
