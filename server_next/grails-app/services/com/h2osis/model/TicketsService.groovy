package com.h2osis.model

import com.h2osis.auth.User
import com.h2osis.constant.TicketStatus
import com.h2osis.constant.TicketType
import grails.transaction.Transactional
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat

@Transactional
class TicketsService {

    def slotsService
    def ticketSMService

    def createTicket(User user, def params) {

        User client = user
        User master = User.get(params.master.id)
        Set<Long> servIds = new HashSet<>()
        params.services.split(', ').each {
            servIds.add(Long.parseLong(it))
        }
        List<Service> services = Service.findAllByIdInList(servIds)
        if (!services) {
            return null
        }
        Ticket ticket = new Ticket(date: params.ticketDate, comment: params.comment)
        ticket.setUser(client)
        ticket.setMaster(master)
        ticket.setServices(services.toSet())
        ticket.setStatus(params.status)

        DateTime date = DateTimeFormat.forPattern("dd.MM.yyyy").parseDateTime(params.ticketDate)
        String time = params.time
        String[] splitTime = time.split(":")
        DateTime dateTime = date.withHourOfDay(splitTime[0].toInteger()).withMinuteOfHour(splitTime[1].toInteger())
                .withSecondOfMinute(0)

        ticket.setTicketDate(dateTime.toDate())
        ticket.setTime(params.time)
        ticket.setType(TicketType.HEAD)
        ticket.createSubTickets()
        ticket.save(flush: true)
        slotsService.syncFullDays(ticket, null, null)
        Ticket.search().createIndexAndWait()

        ticketSMService.ticketStatusUpdate(ticket.id, TicketStatus.NEW)
        return ticket
    }
}
