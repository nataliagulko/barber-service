import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['portlet', 'light', 'bordered', 'right-panel'],
	elementId: 'ticket-time',
	pickatimeService: Ember.inject.service("pickatime-service"),

	didInsertElement() {
		var pickatimeService = this.get("pickatimeService"),
		// дизейблим время для проверки стилей
		disableTimeArr = [
			[2, 30],
			[9, 0]
		];

		pickatimeService.set("#ticket-time-picker", "disable", disableTimeArr);
		}
});
