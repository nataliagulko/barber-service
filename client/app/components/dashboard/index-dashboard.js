import Ember from 'ember';
import config from 'barbers/config/environment';

export default Ember.Component.extend({
    session: Ember.inject.service(),
    costAvg: "cost avg",

    didInsertElement() {
        this.send("getStatistic");
    },

    getAuthorizedStatistic: function (query, methodName) {
        let token;

        this.get("session").authorize('authorizer:token', (headerName, headerValue) => {
            token = headerValue;
        });

        return new Ember.RSVP.Promise(function (resolve, reject) {
            $.post({
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', token);
                },
                url: `${config.host}/${methodName}`,
                data: JSON.stringify(query),
                contentType: 'application/json; charset=utf-8',
                mimeType: 'application/json',
            }).then(function (data) {
                resolve(data);
            }, function (jqXHR) {
                reject(jqXHR);
            });
        });
    },

    actions: {
        getStatistic: function () {
            let query = {
                query: {
                    id: "1",
                    dateFrom: "12.04.2018",
                    dateTo: "12.05.2018"
                }
            };

            this.getAuthorizedStatistic(query, 'masterAjax/payStatistic')
                .then((data) => {
                    console.log(data);
                });
            this.getAuthorizedStatistic(query, 'masterAjax/clientStatistic')
                .then((data) => {
                    console.log(data);
                });
        }
    }
});
