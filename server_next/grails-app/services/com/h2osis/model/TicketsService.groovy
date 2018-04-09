package com.h2osis.model

import com.h2osis.auth.User
import com.h2osis.constant.TicketStatus
import com.h2osis.constant.TicketType
import com.h2osis.utils.NovaDateUtilService
import grails.transaction.Transactional
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat

@Transactional
class TicketsService {

    def slotsService
    def ticketSMService
    NovaDateUtilService novaDateUtilService

    def createTicket(User user, def params, def relations) {

        User client = user
        User master = User.get(relations.master.data.id)
        Set<Long> servIds = new HashSet<>()
        relations.services.data.each {
            servIds.add(Long.parseLong(it.id))
        }
        List<Service> services = Service.findAllByIdInList(servIds)
        if (!services) {
            return null
        }
        Ticket ticket = new Ticket(ticketDate: novaDateUtilService.getMasterTZDateTimeDDMMYYYY(params.ticketDate, master), comment: params.comment)
        ticket.setUser(client)
        ticket.setMaster(master)
        ticket.setServices(services.toSet())
        ticket.setStatus(params.status ? params.status : TicketStatus.NEW)

        DateTime date = novaDateUtilService.getMasterTZDateTimeDDMMYYYY(params.ticketDate, master)
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
        //Ticket.search().createIndexAndWait()

        ticketSMService.ticketStatusUpdate(ticket.id, TicketStatus.NEW)
        return ticket
    }
}
