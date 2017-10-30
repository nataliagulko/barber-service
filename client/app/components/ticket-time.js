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
        pickatimeService.on("#ticket-time-picker", "set", function(selectedTime) {
            var time = $('input[name=time_input_submit]').val(),
                date = $('.ticket-info-date-temp__date').text();

            $('.ticket-info-time-temp').removeClass('hidden');
            $('.ticket-info-time-temp__time').text(time);
            $('.ticket-info-date__date').text(date + ', ' + time);
        });
	}
});
