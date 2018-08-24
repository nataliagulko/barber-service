package com.h2osis.sm

import constant.TicketType
import com.h2osis.model.Ticket
import grails.transaction.Transactional

@Transactional
class TicketSMService extends SMManagerService {

    @Transactional
    def ticketStatusUpdate(Long ticketId, String status) {
        Ticket ticket = Ticket.get(ticketId)
        if (ticket) {
            if (ticket.type && ticket.type.equals(TicketType.HEAD)) {
                List<String> transitions = ticket.ticketTransitions?.stateTo
                if (transitions && !transitions.contains(status)) {
                    throw new Exception("Wrong ticket state!")
                }
                transObject(SMObjectType.ticket, ticket.id, status)
                def subTickets = ticket.subTickets
                if (subTickets) {
                    subTickets.each {
                        it.setStatus(ticket.status)
                        it.save(flush: true);
                    }
                }
            }
        }
    }
}
