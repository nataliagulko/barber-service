import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['mt-element-step'],
    ticketService: Ember.inject.service('ticket-service'),

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
