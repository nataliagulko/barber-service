import Component from '@ember/component';

export default Component.extend({
    tabName: 'form',
    classNames: ['register-form'],

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
