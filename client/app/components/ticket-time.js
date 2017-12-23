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
		pickatimeService.set("#ticket-time-picker", "min", [9, 0]);
		pickatimeService.set("#ticket-time-picker", "max", [19, 0]);
        pickatimeService.on("#ticket-time-picker", "set", function(selectedTime) {
            var time = $('input[name=time_input_submit]').val(),
                date = $('.ticket-info-date-top__date').text();

            $('.ticket-info-time-top').removeClass('hidden');
            $('.ticket-info-time-top__time').text(time);
            $('.ticket-info-date__date').text(date + ', ' + time);
        });
	}
});
