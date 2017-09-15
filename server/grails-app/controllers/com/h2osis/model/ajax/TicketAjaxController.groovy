package com.h2osis.model.ajax

import com.h2osis.auth.Role
import com.h2osis.auth.User
import com.h2osis.constant.AuthKeys
import com.h2osis.constant.TicketType
import com.h2osis.model.Service
import com.h2osis.model.Ticket
import com.h2osis.model.TicketsService
import com.h2osis.sm.TicketSMService
import com.h2osis.utils.SearchService
import com.h2osis.utils.SlotsService
import grails.converters.JSON
import grails.transaction.Transactional
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat

class TicketAjaxController {

    SearchService searchService
    SlotsService slotsService
    def springSecurityService
    TicketSMService ticketSMService
    TicketsService ticketsService
    static allowedMethods = [choose: ['POST', 'GET']]


    def get() {
        if (params.id) {
            Ticket ticket = Ticket.get(params.id)
            if (ticket) {
                render(ticket as JSON)
            } else {
                render([msg: g.message(code: "ticket.get.user.not.found")] as JSON)
            }
        } else {
            render([msg: g.message(code: "ticket.get.id.null")] as JSON)
        }
    }

    def find() {
        if (params.value) {
            String value = params.value
            List<Ticket> ticketList = searchService.ticketSearch(value)
            if (ticketList) {
                JSON.use('tickets') {
                    render([data:ticketList] as JSON)
                }
            } else {
                render([erorrs: g.message(code: "ticket.fine.not.found")] as JSON)
            }
        } else {
            render([erorrs: g.message(code: "find.value.null")] as JSON)
        }
    }

    def create() {
        if (params.master && params.services && params.date) {
            def principal = springSecurityService.principal
            User user = User.get(principal.id)

            if (!user.secondname && !user.firstname) {
                if (params.firstname && params.secondname) {
                    user.setFirstname(params.firstname)
                    user.setSecondname(params.secondname)
                    user.save(flush: true)
                } else {
                    render([errors: g.message(code: "ticket.fio.empty")] as JSON)
                    return
                }
            }

            Ticket ticket = ticketsService.createTicket(user, params)
            if (ticket) {
                JSON.use('tickets') {
                    render([data: ticket] as JSON)
                }
            } else {
                render([errors: g.message(code: "service.create.params.null")] as JSON)
            }
        } else {
            render([errors: g.message(code: "service.create.params.null")] as JSON)
        }
    }

    @Transactional
    def update() {
        def principal = springSecurityService.principal
        User user = User.get(principal.id)
        if (user.authorities.contains(Role.findByAuthority(AuthKeys.ADMIN))) {
            if (params.id) {
                Ticket ticket = Ticket.get(params.id)
                if (ticket) {
                    Ticket.withTransaction {
                        try {
                            if (params.status) {
                                String status = params.status
                                //if ([TicketStatus.ACCEPTED, TicketStatus.COMPLETED, TicketStatus.REJECTED].contains(status)) {
                                ticket.setStatus(status)
                                //}
                            }
                            if (params.comment) {
                                ticket.setComment(params.comment)
                            }
                            ticket.save(flush: true)
                            if (params.status) {
                                ticketSMService.ticketStatusUpdate(ticket.id, params.status)
                            }
                            Ticket.search().createIndexAndWait()

                            render([errors: 0] as JSON)
                        } catch (Exception e) {
                            render([erorrs: e.toString()] as JSON)
                        }
                    }
                }
            } else {
                render([erorrs: g.message(code: "ticket.create.params.null")] as JSON)
            }
        } else {
            render([erorrs: g.message(code: "ticket.edit.not.admin")] as JSON)
        }
    }

    def getTicketTransitions() {
        def principal = springSecurityService.principal
        User user = User.get(principal.id)
        if (user.authorities.contains(Role.findByAuthority(AuthKeys.ADMIN))) {
            if (params.id) {
                Ticket ticket = Ticket.get(params.id)
                if (ticket) {
                    render([transitions: ticket.ticketTransitions?.stateTo] as JSON)
                }
            } else {
                render([erorrs: g.message(code: "ticket.create.params.null")] as JSON)
            }
        } else {
            render([erorrs: g.message(code: "ticket.edit.not.admin")] as JSON)
        }
    }

    def delete() {
        def principal = springSecurityService.principal
        User user = User.get(principal.id)
        if (user.authorities.contains(Role.findByAuthority(AuthKeys.ADMIN))) {
            if (params.id) {
                Ticket ticket = Ticket.get(params.id)
                if (ticket) {
                    ticket.delete(flush: true)
                    Ticket.search().createIndexAndWait()
                    render([erorrs: 0] as JSON)
                } else {
                    render([erorrs: g.message(code: "ticket.get.user.not.found")] as JSON)
                }
            } else {
                render([erorrs: g.message(code: "ticket.get.id.null")] as JSON)
            }
        } else {
            render([erorrs: g.message(code: "ticket.delete.not.admin")] as JSON)
        }
    }

    def list() {
        List<Ticket> ticketList = Ticket.createCriteria().list(offset: params.offset) {

            if (params.user) {
                eq('user', User.get(params.user))
            }

            if (params.master) {
                eq('master', User.get(params.user))
            }

            if (params.service) {
                eq('service', Service.get(params.user))
            }

            if (params.date) {
                eq('ticketDate', params.getDate("date"))
            }

            if (params.dateFrom) {
                ge('ticketDate', params.getDate("dateFrom"))
            }

            if (params.dateTo) {
                le('ticketDate', params.getDate("dateTo"))
            }

            if (params.onlyHead) {
                eq('type', TicketType.HEAD)
            }

            if (params.onlySub) {
                eq('type', TicketType.SUB)
            }

            if (params.max) {
                def max = params.getInt('max')
                maxResults(max)
            }

            if (params.ticketDate) {
                DateTime dt1 = new DateTime(Date.parse("dd.MM.yyyy", params.ticketDate)).withHourOfDay(0).withMinuteOfHour(0).withSecondOfMinute(0)
                DateTime dt2 = dt1.withHourOfDay(23).withMinuteOfHour(59).withSecondOfMinute(59)
                between('ticketDate', dt1.toDate(), dt2.toDate())
            }
            if (params.ticketDatePeriod) {
                List<String> dates = params.ticketDatePeriod.split('-')
                if (dates.size() == 2) {
                    DateTime dt1 = new DateTime(Date.parse("dd.MM.yyyy", dates.get(0))).withHourOfDay(0).withMinuteOfHour(0).withSecondOfMinute(0)
                    DateTime dt2 = new DateTime(Date.parse("dd.MM.yyyy", dates.get(1))).withHourOfDay(23).withMinuteOfHour(59).withSecondOfMinute(59)
                    between('ticketDate', dt1.toDate(), dt2.toDate())
                }
            }

            if (params.ticketDateFrom && params.ticketDateTo) {
                DateTime dt1 = new DateTime(Date.parse("dd.MM.yyyy", params.ticketDateFrom)).withHourOfDay(0).withMinuteOfHour(0).withSecondOfMinute(0)
                DateTime dt2 = new DateTime(Date.parse("dd.MM.yyyy", params.ticketDateTo)).withHourOfDay(23).withMinuteOfHour(59).withSecondOfMinute(59)
                between('ticketDate', dt1.toDate(), dt2.toDate())
            }

            order('ticketDate')
            order('time')
        }
        if (ticketList) {
            ticketList.each {
                ticket ->
                    ticket.master?.setPassword(null)
                    ticket.user?.setPassword(null)
            }
            JSON.use('tickets') {
                render([data: ticketList] as JSON)
            }
        } else {
            render([erorrs: g.message(code: "ticket.fine.not.found")] as JSON)
        }
    }

    def validateTicket() {
        if (params.ids) {
            List<Long> ids = new ArrayList<Long>()
            params.ids.split(",").each { ids.add(Long.parseLong(it)) }
            List<Ticket> ticketList = Ticket.findAllByIdInList(ids)
            Map<Long, Set<Long>> result = new HashMap<Long, Set<Long>>()
            ticketList.each { curTicket ->
                List<Ticket> tickets = Ticket.findAllByMasterAndStatusAndTypeAndIdNotInList(curTicket.master, "accepted", TicketType.HEAD, ids)
                if (tickets) {
                    Set<Long> intersects = tickets.findAll { testTicket ->
                        (
                                slotsService.isTicketsOverlapNoJoda(curTicket, testTicket)
                        )
                    }?.id
                    if (intersects) {
                        result.put(curTicket.id, intersects)
                    }
                }
            }
            render result as JSON
        } else if (params.time && params.ticketDate && params.master && params.services) {

            Map<Long, Set<Long>> result = new HashMap<Long, Set<Long>>()
            Ticket curTicket = new Ticket()
            DateTime date = DateTimeFormat.forPattern("dd.MM.yyyy").parseDateTime(params.ticketDate)

            String time = params.time
            String h = time.split(":")[0]
            String m = time.split(":")[1]
            if (h.startsWith("0")) {
                h = h.substring(1)
            }
            if (m.startsWith("0")) {
                m = m.substring(1)
            }
            //DateTime time = DateTimeFormat.shortTime().parseDateTime(params.time)
            DateTime dateTime = date.withHourOfDay(Integer.parseInt(h)).withMinuteOfHour(Integer.parseInt(m))
                    .withSecondOfMinute(0)
            curTicket.setTicketDate(dateTime.toDate())
            curTicket.setTime(params.time)
            curTicket.setMaster(User.get(params.master))
            String services = params.services
            if (services) {
                Set<Long> servicesIds = new HashSet<Long>()
                services.split(",").each {
                    servicesIds.add(Long.parseLong(it))
                }
                Set<Service> servicesObjs = Service.findAllByIdInList(servicesIds)

                if (servicesObjs) {
                    curTicket.clearErrors()
                    curTicket.services = null
                    servicesObjs.each {
                        curTicket.addToServices(it)
                    }
                }
            }
            List<Ticket> tickets = Ticket.findAllByMasterAndStatusAndType(curTicket.master, "accepted", TicketType.HEAD)
            Set<Long> intersects = tickets.findAll { testTicket ->
                slotsService.isTicketsOverlap(curTicket, testTicket)
            }?.id

            if (intersects) {
                result.put(curTicket.ticketDate.time, intersects)
            }
            render([data: result] as JSON)
        } else {
            render([erorrs: g.message(code: "ticket.validate.ids.null")] as JSON)
        }
    }

    def jodaValidateTicket() {
        if (params.ids) {
            List<Long> ids = new ArrayList<Long>()
            params.ids.split(",").each { ids.add(Long.parseLong(it)) }
            List<Ticket> ticketList = Ticket.findAllByIdInList(ids)
            Map<Long, Set<Long>> result = new HashMap<Long, Set<Long>>()
            ticketList.each { curTicket ->
                List<Ticket> tickets = Ticket.findAllByMasterAndStatusAndTypeAndIdNotInList(curTicket.master, "accepted", TicketType.HEAD, ids)
                if (tickets) {
                    Set<Long> intersects = tickets.findAll { testTicket ->
                        slotsService.isTicketsOverlap(curTicket, testTicket)
                    }?.id
                    if (intersects) {
                        result.put(curTicket.id, intersects)
                    }
                }
            }
            render result as JSON
        } else if (params.time && params.ticketDate) {

            Map<Long, Set<Long>> result = new HashMap<Long, Set<Long>>()
            Ticket curTicket = new Ticket()
            DateTime date = DateTimeFormat.forPattern("dd.MM.yyyy").parseDateTime(params.ticketDate)
            DateTime time = DateTimeFormat.shortTime().parseDateTime(params.time)
            DateTime dateTime = date.withHourOfDay(time.getHourOfDay()).withMinuteOfHour(time.getMinuteOfHour())
                    .withSecondOfMinute(time.getSecondOfMinute())
            curTicket.setTicketDate(dateTime.toDate())
            curTicket.setTime(params.time)
            curTicket.setMaster(User.get(params.master))
            String services = params.services
            if (services) {
                Set<Long> servicesIds = new HashSet<Long>()
                services.split(",").each {
                    servicesIds.add(Long.parseLong(it))
                }
                Set<Service> servicesObjs = Service.findAllByIdInList(servicesIds)

                if (servicesObjs) {
                    curTicket.clearErrors()
                    curTicket.services = null
                    servicesObjs.each {
                        curTicket.addToServices(it)
                    }
                }
            }
            List<Ticket> tickets = Ticket.findAllByMasterAndStatusAndType(curTicket.master, "accepted", TicketType.HEAD)
            Set<Long> intersects = tickets.findAll { testTicket ->
                slotsService.isTicketsOverlap(curTicket, testTicket)
            }?.id

            if (intersects) {
                result.put(curTicket.ticketDate.time, intersects)
            }
            render([data: result] as JSON)
        } else {
            render([erorrs: g.message(code: "ticket.validate.ids.null")] as JSON)
        }
    }

    def shiftTickets() {
        if (params.id && params.time) {
            def principal = springSecurityService.principal
            User user = User.get(principal.id)
            if (user.authorities.contains(Role.findByAuthority(AuthKeys.ADMIN))) {
                try {
                    slotsService.shiftTickets(params.getLong("id"), user, params.getLong("time"))
                    render([data: "1"] as JSON)
                } catch (Exception e) {
                    render([erorrs: e.toString()] as JSON)
                }
            } else {
                render([erorrs: g.message(code: "ticket.shift.notmaster")] as JSON)
            }
        } else {
            render([erorrs: g.message(code: "ticket.shift.params.null")] as JSON)
        }
    }

    def swapTickets() {
        if (params.ticket1 && params.ticket2) {
            def result = slotsService.swapTickets(params.getLong("ticket1"), params.getLong("ticket2"))
            if (result) {
                render([erorrs: result] as JSON)
            } else {
                render([erorrs: "0"] as JSON)
            }
        } else {
            render([erorrs: g.message(code: "ticket.swap.params.null")] as JSON)
        }
    }
}
