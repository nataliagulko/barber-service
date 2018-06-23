import moment from 'moment';
import $ from 'jquery';
import Service from '@ember/service';
import { inject } from '@ember/service';

export default Service.extend({
	store: inject("store"),
	routing: inject('-routing'),
	pickadateService: inject("pickadate-service"),
	pickatimeService: inject("pickatime-service"),
	notification: inject("notification-service"),

	ticket: null,
	ticketDate: null,
	ticketTime: null,
	servicesByMaster: [],
	selectedServices: [],
	cost: null,
	duration: null,
	phone: "",
	client: null,
	isNewClient: false,
	activeStep: '#master-step',
	validationMessage: null,

	changeStep(step) {
		this.set("activeStep", step);

		// убираем активное состояние со всех шагов и добавляем выбранному
		$('.mt-step-col').removeClass('active');
		$(step).addClass('active');
	},

	toggleMaster(master, event) {
		const ticket = this.get("ticket");

		let selectedItem = $(event.target).closest('.tile');
		let selectedMaster = ticket.get("master");
		let isSameMaster = selectedMaster === master;

		if (selectedMaster && isSameMaster) {
			this._setTicketProperty("master", master);
			this.set("servicesByMaster", []);
		}
		else if (selectedMaster && !isSameMaster) {
			this._setTicketProperty("master", master);

			$('.tile').each(function () {
				$(this).removeClass('selected');
			});
		}
		else {
			this._setTicketProperty("master", master);
		}

		$(selectedItem).toggleClass('selected');
	},

	getServicesByMaster() {
		const _this = this;
		const store = this.get("store");
		const ticket = this.get("ticket");
		const master = ticket.get("master");

		let services = store.query("service", {
			query: {
				masterId: master.id
			}
		});

		services.then(function () {
			_this.set("servicesByMaster", services);
		});
	},

	toggleServiceItem(service, event) {
		let selectedItem = $(event.target).closest('.tile'),
			selectedServices = this.get("selectedServices"),
			isServiceIncluded = selectedServices.includes(service);

		if (isServiceIncluded) {
			selectedServices.removeObject(service);
		}
		else {
			selectedServices.pushObject(service);
		}

		if (selectedServices.get("length") === 0) {
			$('.ticket-info-services-top').addClass('hidden');
		}
		else {
			$('.ticket-info-services-top').removeClass('hidden');
		}

		this._setTicketProperty("services", selectedServices);
		this._calculateDurationAndCost();

		$(selectedItem).toggleClass('selected');
	},

	_calculateDurationAndCost() {
		let selectedServices = this.get("selectedServices"),
			totalCost = 0,
			totalDuration = 0;

		selectedServices.forEach(function (item) {
			totalCost += item.get("cost");
			totalDuration += item.get("time");
		});
		this.set("cost", totalCost);
		this._setTicketProperty("cost", totalCost);
		this.set("duration", totalDuration);
		this._setTicketProperty("duration", totalDuration);
	},

	getHolidays() {
		const _this = this;
		const store = this.get("store");
		const pickadateService = this.get("pickadateService");

		const ticket = this.get("ticket");
		const master = ticket.get("master");
		const duration = this.get("duration");

		let holidays = store.query("holiday", {
			query: {
				masterId: master.id,
				time: duration
			}
		});

		holidays.then(function () {
			holidays = holidays.toArray();
			let disableDates = _this._parseHolidays(holidays),
				yesterday = moment().subtract(1, 'days');

			pickadateService.set("#ticket-date-picker", "disable", false);
			pickadateService.set("#ticket-date-picker", "min", yesterday);
			pickadateService.set("#ticket-date-picker", "disable", disableDates);
		});
	},

	_parseHolidays(holidays) {
		let datesArr = [];

		holidays.forEach(function (item) {
			const dateFrom = moment(item.get("dateFrom")).toObject(),
				dateTo = moment(item.get("dateTo")).toObject();

			let range = {
				"from": [dateFrom.years, dateFrom.months, dateFrom.date],
				"to": [dateTo.years, dateTo.months, dateTo.date]
			};

			datesArr.push(range);
		});

		return datesArr;
	},

	onTicketDateChange(selectedDate) {
		const date = selectedDate;
		this.set("ticketDate", date);
		this._setTicketProperty("ticketDate", date);
	},

	getTimeSlots() {
		const _this = this;
		const store = this.get("store");
		const pickatimeService = this.get("pickatimeService");

		const ticket = this.get("ticket");
		const duration = this.get("duration");
		const date = this.get("ticketDate");
		const master = ticket.get("master");

		let slots = store.query("slot", {
			query: {
				masterId: master.id,
				time: duration,
				slotDate: date
			},
		});

		slots.then((timeSlots) => {
			timeSlots = timeSlots.toArray();
			if (timeSlots.length === 0) { return; }

			let parsedSlots = _this._parsedSlots(timeSlots);

			pickatimeService.set("#ticket-time-picker", "disable", false);
			pickatimeService.set("#ticket-time-picker", "min", parsedSlots.disabledMinTime);
			pickatimeService.set("#ticket-time-picker", "max", parsedSlots.disabledMaxTime);
			pickatimeService.set("#ticket-time-picker", "disable", parsedSlots.disabledTimeSlots);
		});
	},

	_parsedSlots(timeSlots) {
		let timesArr = [],
			minTime = 0,
			maxTime = 0;

		timeSlots.forEach(function (item) {
			const start = moment(item.get("start")).toObject(),
				end = moment(item.get("end")).toObject();

			var rangeObj = {
				"from": [start.hours, start.minutes],
				"to": [end.hours, end.minutes]
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
	},

	onTicketTimeChange(selectedTime) {
		$('.ticket-info-time-top').removeClass('hidden');
		this.set("ticketTime", selectedTime);
		this._setTicketProperty("time", selectedTime);
	},

	inputPhone(value) {
		let phone = this.get("phone");

		const phoneLength = 16;

		//todo подумать как сделать без двух if
		if (phone.length < phoneLength) {
			phone += value;
			phone = this._formatPhone(phone);
			this.set("phone", phone);
		}

		if (phone.length === phoneLength) {
			this._getClient(phone);
		}
	},

	_formatPhone(phone) {
		phone = this._clearPhoneMask(phone);

		phone = phone
			.replace(/(^[^7-8])/, "+7$1")
			.replace(/(^[7-8])/, "+7")
			.replace(/(\+7)(\d{1,3})/, "$1($2)")
			.replace(/(\+7\(\d{3}\)\d{3})(\d{1})/, "$1-$2")
			.replace(/(\+7\(\d{3}\)\d{3}-\d{2})(\d{1})/, "$1-$2");

		return phone;
	},

	_clearPhoneMask(phone) {
		phone = phone
			.replace(/\+/, '')
			.replace(/-/g, '')
			.replace(/\(/, '')
			.replace(/\)/, '');

		return phone;
	},

	removeLastNumber() {
		let phone = this.get("phone");
		phone = this._clearPhoneMask(phone);

		phone = phone.slice(0, -1);
		phone = this._formatPhone(phone, "##(###)###-##-##");

		this.set("phone", phone); //почему-то если написать phone.slice(0,-1) строкой выше и сюда передавать просто phone то оно не работает
		this._resetClient();
	},

	clearPhoneNumber() {
		this.set("phone", "");
		this._resetClient();
	},

	_resetClient() {
		this.set("client", null);
		this.set("isNewClient", false);
	},

	_getClient(phone) {
		const store = this.get("store"),
			_this = this;

		let client = store.queryRecord("client", {
			query: {
				phone: phone
			},
		});

		client.then(
			(cl) => {
				_this._setClient(cl, false);
			},
			() => {
				_this._setClient(null, true);
			});
	},

	saveClient(name) {
		const store = this.get("store"),
			_this = this;

		let client = store.createRecord("client", {
			firstname: name,
			phone: this.get("phone"),
			password: "emptyPass123",
			rpassword: "emptyPass123"
		});

		// need validate client too
		client
			.save()
			.then((cl) => {
				_this._setClient(cl, false);
			});
	},

	_setClient(client, isNew) {
		this.set("isNewClient", isNew);
		this.set("client", client);
		this._setTicketProperty("client", client);
	},

	_setTicketProperty(prop, value) {
		let ticket = this.get("ticket");
		ticket.set(prop, value);
		this.set("ticket", ticket);

		console.log("ticket", this.get("ticket"));

		this._validateTicketProperty(ticket, prop);
	},

	_validateTicketProperty(ticket, prop) {
		const isPropInvalid = ticket.get(`validations.attrs.${prop}.isInvalid`);
		let message, text;

		this.set("validationMessage", message);

		if (isPropInvalid) {
			message = ticket.get(`validations.attrs.${prop}.message`);
			text = `${prop}: ${message}`;
			this.set("validationMessage", text);
		}
	},

	saveTicket() {
		const ticket = this.get("ticket"),
			_this = this;

		ticket
			.validate()
			.then(({ validations }) => {
				if (validations.get('isValid')) {
					ticket
						.save()
						.then(() => {
							const ticketDate = moment(ticket.get("ticketDate")).format("Do MMMM");
							let message = `Запись ${ticketDate} ${ticket.get("time")} создана`;

							_this.get("routing").transitionTo('auth.ticket');
							_this.get("notification").showInfoMessage(message);
							_this.set("ticket", null);
						});
				}
			}, () => {
			});
	}
});