import moment from 'moment';
import $ from 'jquery';
import Service from '@ember/service';
import { inject } from '@ember/service';

export default Service.extend({
	store: inject("store"),
	routing: inject('-routing'),
	constants: inject("constants-service"),
	pickadateService: inject("pickadate-service"),
	pickatimeService: inject("pickatime-service"),
	notification: inject("notification-service"),

	ticket: null,
	servicesByMaster: [],
	phone: "",
	isNewClient: false,
	activeStep: '#master-step',
	validationMessage: null,

	changeStep(prevStep, nextStep) {
		this.set("activeStep", nextStep);

		$('.mt-step-col').removeClass('active');
		$(prevStep).addClass('done');
		$(nextStep)
			.removeClass('done')
			.addClass('active');
	},

	toggleMaster(master, event) {
		const ticket = this.ticket;

		let selectedItem = $(event.target).closest('.tile');
		let selectedMaster = ticket.get("master");
		let isSameMaster = selectedMaster === master;

		if (selectedMaster && isSameMaster) {
			this._setTicketProperty("master", null);
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
		this.changeStep("#master-step", "#services-step");
		this.getServicesByMaster();
	},

	getServicesByMaster() {
		const _this = this;
		const store = this.store;
		const ticket = this.ticket;
		const master = ticket.get("master");

		let services = store.query("service", {
			masterId: master.get("id")
		});

		services.then(function () {
			_this.set("servicesByMaster", services);
		});
	},

	toggleServiceItem(service, event) {
		const ticket = this.ticket;
		const selectedItem = $(event.target).closest('.tile');
		let selectedServices = ticket.get("services");
		const isServiceIncluded = selectedServices.includes(service);

		if (isServiceIncluded) {
			selectedServices.removeObject(service);
		}
		else {
			selectedServices.pushObject(service);
		}

		this._calculateDurationAndCost(selectedServices);

		$(selectedItem).toggleClass('selected');
	},

	_calculateDurationAndCost(selectedServices) {
		let totalCost = 0;
		let totalDuration = 0;

		selectedServices.forEach(function (item) {
			totalCost += item.get("cost");
			totalDuration += item.get("time");
		});

		this._setTicketProperty("cost", totalCost);
		this._setTicketProperty("duration", totalDuration);
	},

	getHolidays() {
		const _this = this;
		const store = this.store;
		const pickadateService = this.pickadateService;

		const ticket = this.ticket;
		const master = ticket.get("master");
		const duration = ticket.get("duration");

		let holidays = store.query("holiday", {
			masterId: master.get("id"),
			time: duration
		});

		holidays.then(function () {
			holidays = holidays.toArray();
			const disableDates = _this._parseHolidays(holidays);
			const yesterday = moment().subtract(1, 'days');

			pickadateService.set("#ticket-date-picker", "disable", false);
			pickadateService.set("#ticket-date-picker", "min", yesterday);
			pickadateService.set("#ticket-date-picker", "disable", disableDates);
		});
	},

	_parseHolidays(holidays) {
		let datesArr = [];

		holidays.forEach(function (item) {
			const dateFrom = moment(item.get("dateFrom")).toObject();
			const dateTo = moment(item.get("dateTo")).toObject();

			const range = {
				"from": [dateFrom.years, dateFrom.months, dateFrom.date],
				"to": [dateTo.years, dateTo.months, dateTo.date]
			};

			datesArr.push(range);
		});

		return datesArr;
	},

	onTicketDateChange(selectedDate) {
		const date = selectedDate;
		this._setTicketProperty("ticketDate", date);
		this.changeStep("#date-step", "#time-step");
		this.getTimeSlots();
	},

	getTimeSlots() {
		const _this = this;
		const store = this.store;
		const pickatimeService = this.pickatimeService;

		const ticket = this.ticket;
		const duration = ticket.get("duration");
		const date = ticket.get("ticketDate");
		const master = ticket.get("master");

		let slots = store.query("slot", {
			masterId: master.get("id"),
			time: duration,
			slotDate: date
		});

		slots.then((timeSlots) => {
			timeSlots = timeSlots.toArray();
			if (timeSlots.length === 0) { return; }

			const parsedSlots = _this._parsedSlots(timeSlots);

			pickatimeService.set("#ticket-time-picker", "disable", false);
			pickatimeService.set("#ticket-time-picker", "min", parsedSlots.disabledMinTime);
			pickatimeService.set("#ticket-time-picker", "max", parsedSlots.disabledMaxTime);
			pickatimeService.set("#ticket-time-picker", "disable", parsedSlots.disabledTimeSlots);
		});
	},

	_parsedSlots(timeSlots) {
		let timesArr = [];
		let minTime = 0;
		let maxTime = 0;

		timeSlots.forEach(function (item) {
			const start = moment(item.get("start")).toObject();
			const end = moment(item.get("end")).toObject();

			const rangeObj = {
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
		this._setTicketProperty("time", selectedTime);
		this.changeStep("#time-step", "#client-step");
	},

	inputPhone(value) {
		const constants = this.constants;
		const phoneLength = constants.PHONE_LENGTH;

		let phone = this.phone;

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
		let phone = this.phone;
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
		this._setTicketProperty("client", null);
		this.set("isNewClient", false);
	},

	_getClient(phone) {
		const store = this.store,
			_this = this;

		let client = store.queryRecord("client", {
			phone: phone
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
		const store = this.store,
			_this = this;

		let client = store.createRecord("client", {
			firstname: name,
			phone: this.phone,
			enabled: false
		});

		client
			.save()
			.then((cl) => {
				_this._setClient(cl, false);
			});
	},

	_setClient(client, isNew) {
		this.set("isNewClient", isNew);
		this._setTicketProperty("client", client);
	},

	_setTicketProperty(prop, value) {
		let ticket = this.ticket;
		ticket.set(prop, value);
		this.set("ticket", ticket);
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

	resetProperties() {
		this.set("servicesByMaster", null);
		this.set("phone", null);
		this.set("isNewClient", false);
		this.set("activeStep", '#master-step');
	},

	saveTicket() {
		const ticket = this.ticket,
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

							_this.resetProperties();
							_this.get("routing").transitionTo('auth.ticket');
							_this.get("notification").showInfoMessage(message);
						});
				}
			}, () => {
			});
	}
});