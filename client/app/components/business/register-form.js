import Component from '@ember/component';
import { inject } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
    tabName: 'form',
    classNames: ['register-form'],
    notification: inject("notification-service"),
    constants: inject("constants-service"),
    phoneMask: readOnly("constants.PHONE_MASK"),

    actions: {
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
                            .then(() => {
                                businessRecord
                                    .validate()
                                    .then(({ validations }) => {
                                        if (validations.get('isValid')) {
                                            _this.set("showBusinessErrors", false);
                                            businessRecord.save()
                                                .then((b) => {
                                                    _this.get("notification").showInfoMessage(`Организация ${b.get("name")} создана`);
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
