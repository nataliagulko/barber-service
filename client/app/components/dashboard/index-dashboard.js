import $ from 'jquery';
import moment from 'moment';
import TokenAuthorizerMixin from 'ember-simple-auth-token/mixins/token-authorizer';
import Component from '@ember/component';
import { inject } from '@ember/service';
import config from 'nova/config/environment';
import RSVP from 'rsvp';

export default Component.extend(TokenAuthorizerMixin, {
    session: inject(),

    didInsertElement() {
        this.send("getStatistic");
    },

    getAuthorizedStatistic: function (query, methodName) {
        return new RSVP.Promise(function (resolve, reject) {
            $.post({
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
                    this.set("costAvg", data.costAVG || 0);
                    this.set("costSUMM", data.costSUMM || 0);
                });
            this.getAuthorizedStatistic(query, 'masterAjax/clientStatistic')
                .then((/* data */) => {
                    // this.set("cost", data.costAVG);                    
                });
        }
    }
});
