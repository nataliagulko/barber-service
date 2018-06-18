import $ from 'jquery';
import Component from '@ember/component';
import { inject } from '@ember/service';
import config from 'barbers/config/environment';

export default Component.extend({
    notification: inject("notification-service"),

    actions: {
        checkCode: function () {
            const params = $(".forget-form").serialize();
            const notification = this.get('notification');

            $.post({
                url: config.host + '/register/submitChangePassRequest',
                data: params
            }).then((response) => {
                if (!response.error) {
                    this.set('isLoginShown', true);
                    notification.showInfoMessage(`Доступ восстановлен`);
                } else {
                    notification.showErrorMessage(response.error);
                }
            });
        }
    }
});
