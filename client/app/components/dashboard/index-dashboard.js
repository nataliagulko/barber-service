import Component from '@ember/component';
import { inject } from '@ember/service';
import config from 'barbers/config/environment';
import moment from 'moment';
import RSVP from 'rsvp';
import $ from 'jquery';

export default Component.extend({
    session: inject(),

    didInsertElement() {
        this.send("getStatistic");
    },

    getAuthorizedStatistic: function (query, methodName) {
        let token;

        this.get("session").authorize('authorizer:token', (headerName, headerValue) => {
            token = headerValue;
        });

        return new RSVP.Promise(function (resolve, reject) {
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
            let now = moment().format("DD.MM.YYYY"),
                monthAgo = moment().subtract(1, 'months').format("DD.MM.YYYY");

            let query = {
                query: {
                    id: "1",
                    dateFrom: monthAgo,
                    dateTo: now
                }
            };

            this.getAuthorizedStatistic(query, 'masterAjax/payStatistic')
                .then((data) => {
                    this.set("costAvg", data.costAVG);
                    this.set("costSUMM", data.costSUMM);
                });
            this.getAuthorizedStatistic(query, 'masterAjax/clientStatistic')
                .then((/* data */) => {
                    // this.set("cost", data.costAVG);                    
                });
        }
    }
});
