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
        def data = request.JSON.data
        if (data.id) {
            Ticket ticket = Ticket.get(data.id)
            if (ticket) {
                JSON.use('tickets') {
                    render(ticket as JSON)
                }
            } else {
                render([msg: g.message(code: "ticket.get.user.not.found")] as JSON)
            }
        } else {
            render([msg: g.message(code: "ticket.get.id.null")] as JSON)
        }
    }

    def find() {
        def data = request.JSON.data
        if (data.value) {
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
        def data = request.JSON.data
        def attrs = data.attributes
        def relations = data.relationships
        if (data.type && data.type == "ticket" && relations.master && relations.client && relations.services && attrs.ticketDate) {
            User user = User.get(relations.client.data.id)

            // if (!user.secondname && !user.firstname) {
            //     if (attrs.firstname && attrs.secondname) {
            //         user.setFirstname(attrs.firstname)
            //         user.setSecondname(attrs.secondname)
            //         user.save(flush: true)
            //     } else {
            //         render([errors: g.message(code: "ticket.fio.empty")] as JSON)
            //         return
            //     }
            // }

            Ticket ticket = ticketsService.createTicket(user, attrs, relations)
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
        if (user.authorities.authority.contains(Role.findByAuthority(AuthKeys.ADMIN).authority)) {
            def data = request.JSON.data
            def attrs = data.attributes
            if (data.id) {
                Ticket ticket = Ticket.get(data.id)
                if (ticket) {
                    Ticket.withTransaction {
                        try {
                            if (attrs.status) {
                                String status = attrs.status
                                //if ([TicketStatus.ACCEPTED, TicketStatus.COMPLETED, TicketStatus.REJECTED].contains(status)) {
                                ticket.setStatus(status)
                                //}
                            }
                            if (attrs.comment) {
                                ticket.setComment(attrs.comment)
                            }
                            ticket.save(flush: true)
                            if (attrs.status) {
                                ticketSMService.ticketStatusUpdate(ticket.id, attrs.status)
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
        if (user.authorities.authority.contains(Role.findByAuthority(AuthKeys.ADMIN).authority)) {
            def data = request.JSON.data
            if (data.id) {
                Ticket ticket = Ticket.get(data.id)
                if (ticket) {
                    render([data: [transitions: ticket.ticketTransitions?.stateTo]] as JSON)
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
        if (user.authorities.authority.contains(Role.findByAuthority(AuthKeys.ADMIN).authority)) {
            def data = request.JSON.data
            if (data.id) {
                Ticket ticket = Ticket.get(data.id)
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
        def data = request.JSON.data
        def query = request.JSON.query
        def errors = []

        List<Ticket> ticketList = Ticket.createCriteria().list(offset: query.offset) {

            if (query.user) {
                eq('user', User.get(query.user))
            }

            if (query.master) {
                eq('master', User.get(query.user))
            }

            if (query.service) {
                eq('service', Service.get(query.user))
            }

            if (query.onlyHead) {
                eq('type', TicketType.HEAD)
            }

            if (query.onlySub) {
                eq('type', TicketType.SUB)
            }

            if (query.max) {
                def max = Integer.parseInt(query.max)
                maxResults(max)
            }

            if (query.ticketDate) {
                DateTime dt1 = new DateTime(Date.parse("dd.MM.yyyy", query.ticketDate)).withHourOfDay(0).withMinuteOfHour(0).withSecondOfMinute(0)
                DateTime dt2 = dt1.withHourOfDay(23).withMinuteOfHour(59).withSecondOfMinute(59)
                between('ticketDate', dt1.toDate(), dt2.toDate())
            }
            if (query.ticketDatePeriod) {
                List<String> dates = query.ticketDatePeriod.split('-')
                if (dates.size() == 2) {
                    DateTime dt1 = new DateTime(Date.parse("dd.MM.yyyy", dates.get(0))).withHourOfDay(0).withMinuteOfHour(0).withSecondOfMinute(0)
                    DateTime dt2 = new DateTime(Date.parse("dd.MM.yyyy", dates.get(1))).withHourOfDay(23).withMinuteOfHour(59).withSecondOfMinute(59)
                    between('ticketDate', dt1.toDate(), dt2.toDate())
                }
            }

            if (query.ticketDateFrom && query.ticketDateTo) {
                DateTime dt1 = new DateTime(Date.parse("dd.MM.yyyy", query.ticketDateFrom)).withHourOfDay(0).withMinuteOfHour(0).withSecondOfMinute(0)
                DateTime dt2 = new DateTime(Date.parse("dd.MM.yyyy", query.ticketDateTo)).withHourOfDay(23).withMinuteOfHour(59).withSecondOfMinute(59)
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
            errors.add([
                    "status": 422,
                    "detail": g.message(code: "ticket.fine.not.found"),
                    "source": [
                            "pointer": "data"
                    ]
            ])
            response.status = 422
            render([errors: errors] as JSON)
        }
    }

    def validateTicket() {
        def data = request.JSON.data
        def attrs = data.attributes
        if (data.ids) {
            List<Long> ids = new ArrayList<Long>()
            data.ids.split(",").each { ids.add(Long.parseLong(it)) }
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
        } else if (attrs.time && attrs.ticketDate && attrs.master && attrs.services) {

            Map<Long, Set<Long>> result = new HashMap<Long, Set<Long>>()
            Ticket curTicket = new Ticket()
            DateTime date = DateTimeFormat.forPattern("dd.MM.yyyy").parseDateTime(attrs.ticketDate)

            String time = attrs.time
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
            curTicket.setTime(attrs.time)
            curTicket.setMaster(User.get(attrs.master))
            String services = attrs.services
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
        def data = request.JSON.data
        def attrs = data.attributes
        if (data.ids) {
            List<Long> ids = new ArrayList<Long>()
            data.ids.split(",").each { ids.add(Long.parseLong(it)) }
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
        } else if (attrs.time && attrs.ticketDate) {

            Map<Long, Set<Long>> result = new HashMap<Long, Set<Long>>()
            Ticket curTicket = new Ticket()
            DateTime date = DateTimeFormat.forPattern("dd.MM.yyyy").parseDateTime(attrs.ticketDate)
            DateTime time = DateTimeFormat.shortTime().parseDateTime(attrs.time)
            DateTime dateTime = date.withHourOfDay(time.getHourOfDay()).withMinuteOfHour(time.getMinuteOfHour())
                    .withSecondOfMinute(time.getSecondOfMinute())
            curTicket.setTicketDate(dateTime.toDate())
            curTicket.setTime(attrs.time)
            curTicket.setMaster(User.get(attrs.master))
            String services = attrs.services
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
        def data = request.JSON.data
        if (data.id && data.time) {
            def principal = springSecurityService.principal
            User user = User.get(principal.id)
            if (user.authorities.authority.contains(Role.findByAuthority(AuthKeys.ADMIN).authority)) {
                try {
                    slotsService.shiftTickets(Long.parseLong(data.id), user,Long.parseLong(data.time))
                    render([data: "0"] as JSON)
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
        def data = request.JSON.data
        if (data.ticket1 && data.ticket2) {
            def result = slotsService.swapTickets(Long.parseLong(data.ticket1), Long.parseLong(data.ticket2))
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
