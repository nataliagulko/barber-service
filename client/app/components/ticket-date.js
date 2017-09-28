import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['portlet', 'light', 'bordered', 'right-panel'],
	elementId: 'ticket-date',
	pickadateService: Ember.inject.service("pickadate-service"),

	didInsertElement() {
		var pickadateService = this.get("pickadateService"),
			// дизейблим даты для проверки стилей
			disableDateArr = [
				[2017, 8, 22],
				[2017, 8, 26]
			];

		pickadateService.set("#ticket-date-picker", "disable", disableDateArr);
	}
});
