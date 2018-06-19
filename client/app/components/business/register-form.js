import Component from '@ember/component';
import { inject } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
    tabName: 'form',
    classNames: ['register-form'],
    constants: inject("constants-service"),
    phoneMask: readOnly("constants.PHONE_MASK"),

    actions: {
        saveBusinessAndUser: function () {
            const businessRecord = this.get("business");
            const masterRecord = this.get("master");

            masterRecord.set("enabled", true);
            masterRecord.save()
                .then(() => {
                    businessRecord.save();
                });
        }
    }
});
