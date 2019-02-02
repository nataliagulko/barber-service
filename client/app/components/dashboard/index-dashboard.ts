import Component from "@ember/component";
import { get, set } from "@ember/object";
import { inject as service } from "@ember/service";
import TokenAuthorizerMixin from "ember-simple-auth-token/mixins/token-authorizer";
import $ from "jquery";
import moment from "moment";
import config from "nova/config/environment";
import RSVP from "rsvp";

interface IQuery {
	query: {
		id: number,
		dateFrom: string,
		dateTo: string,
	}
}

interface IPayStatisticData {
	costAVG: number,
	costSUMM: number
}

interface IClientStatisticData {
	cnt: number,
}

export default class IndexDashboard extends Component.extend(TokenAuthorizerMixin) {
	costAvg!: number
	costSUMM!: number
	clientCount!: number

	session = service("session");

	didInsertElement() {
		this.send("getStatistic");
	}

	getAuthorizedStatistic(this: IndexDashboard, query: IQuery, methodName: string) {
		const data = get(this, "session").data
		const token = data ? data.authenticated.access_token : null

		return new RSVP.Promise((resolve, reject) => {
			$.post({
				contentType: "application/json; charset=utf-8",
				data: JSON.stringify(query),
				headers: {
					Authorization: "Bearer " + token,
				},
				mimeType: "application/json",
				url: `${config.host}/${methodName}`,
			}).then((d) => {
				resolve(d);
			}, (jqXHR) => {
				reject(jqXHR);
			});
		});
	}

	actions = {
		getStatistic(this: IndexDashboard) {
			const indexDashboard = this;
			const now = moment().format("DD.MM.YYYY");
			const monthAgo = moment().subtract(1, "months").format("DD.MM.YYYY");

			const query = {
				query: {
					dateFrom: monthAgo,
					dateTo: now,
					id: 1,
				},
			};

			this.getAuthorizedStatistic(query, "masterAjax/payStatistic")
				.then((data: IPayStatisticData) => {
					set(indexDashboard, "costAvg", data.costAVG || 0);
					set(indexDashboard, "costSUMM", data.costSUMM || 0);
				});

			this.getAuthorizedStatistic(query, "masterAjax/clientStatistic")
				.then((data: IClientStatisticData) => {
					this.set("clientCount", data.cnt);
				});
		},
	}
}
