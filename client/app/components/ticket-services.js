import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['portlet', 'light', 'bordered', 'right-panel'],
    elementId: 'ticket-services',
    ticketService: Ember.inject.service("ticket-service"),
    servicesByMaster: Ember.computed.readOnly("ticketService.servicesByMaster")
});
