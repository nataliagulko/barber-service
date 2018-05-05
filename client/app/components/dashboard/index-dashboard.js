import Ember from 'ember';
import config from 'barbers/config/environment';

export default Ember.Component.extend({
    session: Ember.inject.service(),
    costAvg: "cost avg",

    didInsertElement() {
        this.send("getStatistic");
    },

    actions: {
        getStatistic: function () {
            let token;

            this.get("session").authorize('authorizer:token', (headerName, headerValue) => {
                token = headerValue;
            });

            let query = {
                query: {
                    dateFrom: "10.04.2018",
                    dateTo: "05.05.2018"
                }
            };

            $.post({
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', token);
                },
                url: config.host + '/masterAjax/payStatistic',
                data: JSON.stringify(query)
            }).then((response) => {
                console.log(response);
                //this.set("costAvg", response.costAVG);
            }, () => {

            });
        }
    }
});
