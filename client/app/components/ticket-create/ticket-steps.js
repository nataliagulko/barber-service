import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
    classNames: ['mt-element-step'],
    ticketService: inject('ticket-service'),

    actions: {
        changeStep: function(stepSelector) {
            var ticketService = this.get('ticketService');
            ticketService.changeStep(stepSelector);
        },

        getServicesByMaster: function () {
            var ticketService = this.get('ticketService');
            ticketService.getServicesByMaster();
        },

        getHolidays: function () {
            var ticketService = this.get('ticketService');
            ticketService.getHolidays();
        },

        getTimeSlots: function () {
            var ticketService = this.get('ticketService');
            ticketService.getTimeSlots();
        }
    }
});
