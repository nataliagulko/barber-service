import Component from '@ember/component';
import { inject } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
    tagName: '',
    ticketService: inject("ticket-service"),
    ticket: readOnly("ticketService.ticket"),
    servicesByMaster: readOnly("ticketService.servicesByMaster"),
    activeStep: readOnly("ticketService.activeStep"),
    filter: null,
    filteredServices: null,

    actions: {
        getHolidays: function () {
            const ticketService = this.ticketService;
            ticketService.getHolidays();
            ticketService.changeStep("#services-step", "#date-step");
        },

        filterServices: function () {
            const filter = this.filter;
            const servicesByMaster = this.servicesByMaster;

            if (filter && filter.length > 2) {
                const fs = servicesByMaster.filter(function (item) {
                    const i = item.get("name").toLowerCase();
                    const f = filter.toLowerCase();
                    return i.indexOf(f) !== -1;
                });

                this.set("filteredServices", fs);
            }
            else {
                this.set("filteredServices", null);
            }
        }
    }
});
