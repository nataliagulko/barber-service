import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
    classNames: ['mt-element-step'],
    ticketService: inject('ticket-service'),

    actions: {        
        getMasters: function() {
            const ticketService = this.ticketService;
            ticketService.changeStep("", "#master-step");
        },

        getServicesByMaster: function () {
            const ticketService = this.ticketService;
            ticketService.getServicesByMaster();
            ticketService.changeStep("#master-step", "#services-step");
        },

        getHolidays: function () {
            const ticketService = this.ticketService;
            ticketService.getHolidays();
            ticketService.changeStep("#services-step", "#date-step");
        },

        getTimeSlots: function () {
            const ticketService = this.ticketService;
            ticketService.getTimeSlots();
            ticketService.changeStep("#date-step", "#time-step");           
        },

        getClient: function () {
            const ticketService = this.ticketService;
            ticketService.changeStep("#time-step", "#client-step");
        },
    }
});
