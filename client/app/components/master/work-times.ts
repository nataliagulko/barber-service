import Component from "@ember/component";
import { get, set } from "@ember/object";
import { inject as service } from "@ember/service";
import { Validations } from "ember-cp-validations";
import _ from "lodash";
import Master from "nova/models/master";
import WorkTime from "nova/models/work-time";

export interface Time {
	dayOfWeek: string
	start: string | null
	end: string | null
	lunchStart: string | null
	lunchEnd: string | null
	ids: string[] | null
	wasChanged: boolean
	checked: boolean
}

export default class WorkTimes extends Component {
	workTimes!: WorkTime[]
	jointWorkTimes!: WorkTime[]
	master!: Master
	errors!: any

	store = service("store")
	router = service("router")

	didInsertElement(this: WorkTimes) {
		const component = this
		const workTimes = get(component, "workTimes").toArray();
		let jointWorkTimes = [];

		const workingDays = component.buildWordingDays(workTimes);
		const weekend = component.buildWeekend(workTimes);
		jointWorkTimes = workingDays.concat(weekend);

		jointWorkTimes = _.sortBy(jointWorkTimes, "dayOfWeek");
		set(component, "jointWorkTimes", jointWorkTimes);
	}

	buildWordingDays(this: WorkTimes, workTimes: WorkTime[]) {
		const times: Time[] = []
		const workTimesByDayOfWeek = _.groupBy(workTimes, "data.dayOfWeek");

		_.forEach(workTimesByDayOfWeek, (workTime) => {
			let item: Time;

			if (workTime.length > 1) {
				item = {
					dayOfWeek: workTime[0].get("dayOfWeek"),
					start: workTime[0].get("timeFrom"),
					end: workTime[1].get("timeTo"),
					lunchStart: workTime[0].get("timeTo"),
					lunchEnd: workTime[1].get("timeFrom"),
					ids: [workTime[0].get("id"), workTime[1].get("id")],
					wasChanged: false,
					checked: true,
				};
			} else {
				item = {
					dayOfWeek: workTime[0].get("dayOfWeek"),
					start: workTime[0].get("timeFrom"),
					end: workTime[0].get("timeTo"),
					lunchStart: null,
					lunchEnd: null,
					ids: [workTime[0].get("id")],
					wasChanged: false,
					checked: true,
				};
			}

			times.push(item);
		});

		return times;
	}

	buildWeekend(this: WorkTimes, workTimes: WorkTime[]) {
		const daysOfWeek = ["0", "1", "2", "3", "4", "5", "6"];
		const times: Time[] = [];

		daysOfWeek.forEach((day) => {
			const dayOfWeek = _.find(workTimes, _.iteratee(["data.dayOfWeek", day]));

			if (typeof dayOfWeek === "undefined") {
				times.push({
					dayOfWeek: day,
					start: null,
					end: null,
					lunchStart: null,
					lunchEnd: null,
					ids: null,
					wasChanged: false,
					checked: false,
				});
			}
		});

		return times;
	}

	removeWorkTimes(this: WorkTimes, item: Time, needTransition = false) {
		const component = this
		const router = get(component, "router")
		const store = get(component, "store")
		const ids = get(item, "ids")

		if (ids) {
			ids.forEach((id) => {
				store.findRecord("workTime", id, { backgroundReload: false })
					.then((record: WorkTime) => {
						record.destroyRecord();
						if (needTransition) {
							router.transitionTo("auth.master");
						}
					});
			})
		}
	}

	saveTwoWorkTimes(this: WorkTimes, item: Time) {
		const component = this
		const router = get(component, "router")
		const store = get(component, "store")
		const master = get(component, "master")

		const record1 = store.createRecord("workTime", {
			timeFrom: item.start,
			timeTo: item.lunchStart,
			dayOfWeek: item.dayOfWeek,
			master,
		});

		const record2 = store.createRecord("workTime", {
			timeFrom: item.lunchEnd,
			timeTo: item.end,
			dayOfWeek: item.dayOfWeek,
			master,
		});

		record1
			.validate()
			.then(({ validations }: Validations) => {
				if (get(validations, "isValid")) {
					record1.save()
						.then(() => {
							record2
								.validate()
								.then(({ validations: r2Validations }: Validations) => {
									if (get(r2Validations, "isValid")) {
										record2.save()
											.then(() => {
												router.transitionTo("auth.master");
											});
									} else {
										set(component, "errors", get(validations, "errors"))
									}
								});
						});
				} else {
					set(component, "errors", get(validations, "errors"))
				}
			});
	}

	saveOneWorkTime(this: WorkTimes, item: Time) {
		const component = this
		const router = get(component, "router");
		const store = get(component, "store");
		const master = get(component, "master");

		const record = store.createRecord("workTime", {
			timeFrom: item.start,
			timeTo: item.end,
			dayOfWeek: item.dayOfWeek,
			master,
		});

		record
			.validate()
			.then(({ validations }: Validations) => {
				if (get(validations, "isValid")) {
					record.save();
					router.transitionTo("auth.master");
				} else {
					component.set("errors", get(validations, "errors"));
				}
			});
	}

	updateWorkTimes(this: WorkTimes, item: Time) {
		this.removeWorkTimes(item);
		if (item.lunchEnd && item.lunchStart) {
			this.saveTwoWorkTimes(item);
		} else {
			this.saveOneWorkTime(item);
		}
	}

	saveChangedWorkTimes(this: WorkTimes, changedWorkTimes: Time[]) {
		const component = this;

		_.forEach(changedWorkTimes, (item) => {
			if (item.ids && !item.checked && item.ids.length > 0) {
				component.removeWorkTimes(item, true);
			} else if (item.checked && !item.ids) {
				if (item.lunchEnd || item.lunchStart) {
					component.saveTwoWorkTimes(item);
				} else {
					component.saveOneWorkTime(item);
				}
			} else if (item.checked && item.ids) {
				component.updateWorkTimes(item);
			}
		});
	}

	actions = {
		saveWorkTimes(this: WorkTimes) {
			const component = this
			const router = get(component, "router")
			const jointWorkTimes = get(component, "jointWorkTimes")
			const changedWorkTimes = _.filter(jointWorkTimes, { wasChanged: true });

			if (changedWorkTimes.length) {
				component.saveChangedWorkTimes(changedWorkTimes);
			} else {
				router.transitionTo("auth.master");
			}
		},
	}
}
