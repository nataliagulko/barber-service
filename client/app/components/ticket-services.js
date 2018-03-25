import Ember from 'ember';

export default Ember.Component.extend({
    // classNames: ['portlet', 'light', 'bordered', 'right-panel'],
    // elementId: 'ticket-services',
    tagName: '',
    ticketService: Ember.inject.service("ticket-service"),
    servicesByMaster: Ember.computed.readOnly("ticketService.servicesByMaster"),
    activeStep: Ember.computed.readOnly("ticketService.activeStep")
});
