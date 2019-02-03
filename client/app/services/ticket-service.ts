import { get, set } from "@ember/object";
import Service, { inject as service } from "@ember/service";
import { Validations } from "ember-cp-validations";
import $ from "jquery";
import moment, { months } from "moment";
import Client from "nova/models/client";
import Holiday from "nova/models/holiday";
import Master from "nova/models/master";
import ServiceModel from "nova/models/service";
import Slot from "nova/models/slot";
import Ticket from "nova/models/ticket";

interface DateRange {
	from: [
		number,
		number,
		number,
	],
	to: [
		number,
		number,
		number,
	],
}

interface TimeRange {
	from: [
		number,
		number,
	],
	to: [
		number,
		number,
	],
}

export default class TicketService extends Service {
	ticket!: Ticket
	servicesByMaster: Service[] = []
	phone: string = ""
	isNewClient: boolean = false
	activeStep: string = "#master-step"
	validationMessage: string = ""
	hint: string = ""

	store = service("store")
	router = service("router")
	constants = service("constants-service")
	intl = service("intl")
	pickadateService = service("pickadate-service")
	pickatimeService = service("pickatime-service")
	notification = service("notification-service")

	changeStep(this: TicketService, prevStep: string, nextStep: string) {
		set(this, "activeStep", nextStep);

		$(".mt-step-col").removeClass("active");
		$(prevStep).addClass("done");
		$(nextStep)
			.removeClass("done")
			.addClass("active");
	}

	toggleMaster(this: TicketService, master: Master, event: MouseEvent) {
		const ticket = get(this, "ticket")

		const selectedItem = $(event.target).closest(".tile");
		const selectedMaster = get(ticket, "master");
		const isSameMaster = selectedMaster === master;

		if (selectedMaster && isSameMaster) {
			this._setTicketProperty("master", null);
			set(this, "servicesByMaster", []);
		} else if (selectedMaster && !isSameMaster) {
			this._setTicketProperty("master", master);

			$(".tile").each(function() {
				$(this).removeClass("selected");
			});
		} else {
			this._setTicketProperty("master", master);
		}

		$(selectedItem).toggleClass("selected");
		this.changeStep("#master-step", "#services-step");
		this.getServicesByMaster();
	}

	getServicesByMaster(this: TicketService) {
		const ticketService = this;
		const store = get(ticketService, "store")
		const ticket = get(ticketService, "ticket")
		const master = get(ticket, "master");

		if (get(master, "id")) {
			const services = store.query("service", {
				masterId: get(master, "id"),
			});

			services.then(() => {
				set(ticketService, "servicesByMaster", services);
			});
		} else {
			ticketService._showHint("ticket.hint.master.is.empty");
		}
	}

	toggleServiceItem(this: TicketService, serviceRecord: ServiceModel, event: MouseEvent) {
		const ticket = get(this, "ticket")
		const selectedItem = $(event.target).closest(".tile");
		const selectedServices = get(ticket, "services");
		const isServiceIncluded = selectedServices.includes(serviceRecord);

		if (isServiceIncluded) {
			selectedServices.removeObject(serviceRecord);
		} else {
			selectedServices.pushObject(serviceRecord);
		}

		this._calculateDurationAndCost(selectedServices);

		$(selectedItem).toggleClass("selected");
	}

	_calculateDurationAndCost(selectedServices: ServiceModel[]) {
		let totalCost = 0;
		let totalDuration = 0;

		selectedServices.forEach((item) => {
			totalCost += item.get("cost");
			totalDuration += item.get("time");
		});

		this._setTicketProperty("cost", totalCost);
		this._setTicketProperty("duration", totalDuration);
	}

	getHolidays(this: TicketService) {
		const ticketService = this;
		const store = get(ticketService, "store")

		const ticket = get(ticketService, "ticket")
		const master = get(ticket, "master")
		const masterId = get(master, "id")
		const duration = get(ticket, "duration")

		if (masterId && duration) {
			const pickadateService = get(this, "pickadateService")

			let holidays = store.query("holiday", {
				masterId,
				time: duration,
			});

			holidays.then(() => {
				holidays = holidays.toArray();
				const disableDates = ticketService._parseHolidays(holidays);
				const yesterday = moment().subtract(1, "days");

				pickadateService.setFunc("#ticket-date-picker", "disable", false);
				pickadateService.setFunc("#ticket-date-picker", "min", yesterday);
				pickadateService.setFunc("#ticket-date-picker", "disable", disableDates);
			});
		} else {
			ticketService._showHint("ticket.hint.services.is.empty");
		}
	}

	_parseHolidays(holidays: Holiday[]) {
		const datesArr: DateRange[] = [];

		holidays.forEach((item) => {
			const dateFrom = moment(item.get("dateFrom")).toObject();
			const dateTo = moment(item.get("dateTo")).toObject();

			const range: DateRange = {
				from: [dateFrom.years, dateFrom.months, dateFrom.date],
				to: [dateTo.years, dateTo.months, dateTo.date],
			};

			datesArr.push(range);
		});

		return datesArr;
	}

	onTicketDateChange(selectedDate: string) {
		const date = selectedDate;
		this._setTicketProperty("ticketDate", date);
		this.changeStep("#date-step", "#time-step");
		this.getTimeSlots();
	}

	getTimeSlots(this: TicketService) {
		const ticketService = this;
		const store = get(this, "store")

		const ticket = get(this, "ticket")
		const duration = get(ticket, "duration")
		const date = get(ticket, "ticketDate")
		const master = get(ticket, "master")
		const masterId = master.get("id")

		if (masterId && duration) {
			const pickatimeService = get(ticketService, "pickatimeService")

			const slots = store.query("slot", {
				masterId,
				time: duration,
				slotDate: date,
			});

			slots.then((timeSlots: Slot[]) => {
				timeSlots = timeSlots.toArray();
				if (timeSlots.length === 0) { return; }

				const parsedSlots = ticketService._parsedSlots(timeSlots);

				pickatimeService.setFunc("#ticket-time-picker", "disable", false);
				pickatimeService.setFunc("#ticket-time-picker", "min", parsedSlots.disabledMinTime);
				pickatimeService.setFunc("#ticket-time-picker", "max", parsedSlots.disabledMaxTime);
				pickatimeService.setFunc("#ticket-time-picker", "disable", parsedSlots.disabledTimeSlots);
			});
		} else {
			ticketService._showHint("ticket.hint.date.is.empty");
		}
	}

	_parsedSlots(timeSlots: Slot[]) {
		const timesArr: TimeRange[] = [];
		let minTime = [];
		let maxTime = [];

		timeSlots.forEach((item) => {
			const start = moment(item.get("start")).toObject();
			const end = moment(item.get("end")).toObject();

			const rangeObj: TimeRange = {
				from: [start.hours, start.minutes],
				to: [end.hours, end.minutes],
			};

			timesArr.push(rangeObj);
		});

		minTime = timesArr[0].to;
		maxTime = timesArr[timesArr.length - 1].from;

		return {
			disabledTimeSlots: timesArr,
			disabledMinTime: minTime,
			disabledMaxTime: maxTime,
		};
	}

	onTicketTimeChange(selectedTime: string) {
		this._setTicketProperty("time", selectedTime);
		this.changeStep("#time-step", "#client-step");
	}

	inputPhone(this: TicketService, value: string) {
		const constants = get(this, "constants")
		const phoneLength = get(constants, "PHONE_LENGTH")

		let phone = get(this, "phone")

		// todo подумать как сделать без двух if
		if (phone.length < phoneLength) {
			phone += value;
			phone = this._formatPhone(phone);
			this.set("phone", phone);
		}

		if (phone.length === phoneLength) {
			this._getClient(phone);
		}
	}

	_formatPhone(this: TicketService, phone: string) {
		phone = this._clearPhoneMask(phone);

		phone = phone
			.replace(/(^[^7-8])/, "+7$1")
			.replace(/(^[7-8])/, "+7")
			.replace(/(\+7)(\d{1,3})/, "$1($2)")
			.replace(/(\+7\(\d{3}\)\d{3})(\d{1})/, "$1-$2")
			.replace(/(\+7\(\d{3}\)\d{3}-\d{2})(\d{1})/, "$1-$2");

		return phone;
	}

	_clearPhoneMask(phone: string) {
		phone = phone
			.replace(/\+/, "")
			.replace(/-/g, "")
			.replace(/\(/, "")
			.replace(/\)/, "");

		return phone;
	}

	removeLastNumber(this: TicketService) {
		let phone = get(this, "phone")
		phone = this._clearPhoneMask(phone);

		phone = phone.slice(0, -1);
		phone = this._formatPhone(phone);

		set(this, "phone", phone); // почему-то если написать phone.slice(0,-1) строкой выше и сюда передавать просто phone то оно не работает
		this._resetClient();
	}

	clearPhoneNumber(this: TicketService) {
		set(this, "phone", "");
		this._resetClient();
	}

	_resetClient(this: TicketService) {
		this._setTicketProperty("client", null);
		set(this, "isNewClient", false);
	}

	_getClient(this: TicketService, phone: string) {
		const ticketService = this;
		const store = get(ticketService, "store");

		const client = store.queryRecord("client", {
			phone,
		});

		client.then(
			(cl: Client) => {
				ticketService._setClient(cl, false);
			},
			() => {
				ticketService._setClient(null, true);
			});
	}

	saveClient(this: TicketService, name: string) {
		const ticketService = this;
		const store = get(ticketService, "store");

		const client = store.createRecord("client", {
			firstname: name,
			phone: this.phone,
			enabled: false,
		});

		client
			.save()
			.then((cl: Client) => {
				ticketService._setClient(cl, false);
			});
	}

	_setClient(this: TicketService, client: Client, isNew: boolean) {
		set(this, "isNewClient", isNew);
		this._setTicketProperty("client", client);
	}

	_setTicketProperty(this: TicketService, prop: string, value: any) {
		const ticket = get(this, "ticket");
		set(ticket, prop, value);
		this.set("ticket", ticket);
		// this._validateTicketProperty(ticket, prop);
	}

	_validateTicketProperty(this: TicketService, ticket: Ticket, prop: string) {
		const isPropInvalid = get(ticket, `validations.attrs.${prop}.isInvalid`);
		let message: string
		let text: string

		if (isPropInvalid) {
			message = get(ticket, `validations.attrs.${prop}.message`);
			text = `${prop}: ${message}`;
			set(this, "validationMessage", text);
		}
	}

	_showHint(this: TicketService, translationCode: string) {
		const message = get(this, "intl").t(translationCode);
		set(this, "hint", message);
	}

	resetProperties(this: TicketService) {
		set(this, "servicesByMaster", []);
		set(this, "phone", "");
		set(this, "isNewClient", false);
		set(this, "activeStep", "#master-step");
	}

	saveTicket(this: TicketService) {
		const ticketService = this;
		const ticket = get(this, "ticket")
		const router = get(this, "router")
		const notification = get(this, "notification")

		ticket
			// валидация ломает создание записи
			.validate()
			.then(({ validations }: Validations) => {
				if (get(validations, "isValid")) {
					ticket
						.save()
						.then(() => {
							const ticketDate = moment(get(ticket, "ticketDate")).format("Do MMMM");
							const message = `Запись ${ticketDate} ${get(ticket, "time")} создана`;

							ticketService.resetProperties();
							router.transitionTo("auth.ticket");
							notification.info(message);
						},
							() => {
								notification.error("Произошла ошибка");
							});
				}
			}, () => {
			});
	},
}

declare module "@ember/service" {
	interface Registry {
		"ticket-service": TicketService;
	}
}
