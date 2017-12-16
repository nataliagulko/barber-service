import Ember from 'ember';

export default Ember.Component.extend({
    tagName: '',
    ticketService: Ember.inject.service('ticket-service'),

    actions: {
        selectMaster(master, e){
            var ticketService = this.get('ticketService');
            ticketService.selectMaster(master, e);
        }
    }
});
