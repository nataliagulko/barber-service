import Ember from 'ember';

export default Ember.Component.extend({
    // classNames: ['portlet', 'light', 'bordered', 'right-panel'],
    tagName: '',
    // elementId: 'ticket-master',
    ticketService: Ember.inject.service("ticket-service"),
    activeStep: Ember.computed.readOnly("ticketService.activeStep")
});
