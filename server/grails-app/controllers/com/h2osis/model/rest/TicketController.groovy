package com.h2osis.model.rest

import com.h2osis.auth.Role
import com.h2osis.auth.User
import com.h2osis.constant.AuthKeys
import com.h2osis.constant.TicketType
import com.h2osis.model.Service
import com.h2osis.model.Ticket
import grails.converters.JSON
import grails.transaction.Transactional
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat
import org.joda.time.LocalDate

import static org.springframework.http.HttpStatus.*

@Transactional(readOnly = true)
class TicketController {

    def slotsService
    def springSecurityService

    static allowedMethods = [save: "POST", update: "PUT", delete: ["GET", "POST"]]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        List<Ticket> list = Ticket.getHeadTickets(params)
        respond list, model: [ticketInstanceCount: Ticket.countByType(TicketType.HEAD)]
    }

    def show(Ticket ticketInstance) {
        respond ticketInstance
    }

    def create() {
        respond new Ticket(params)
    }

    @Transactional
    def save(Ticket ticketInstance) {
        if (ticketInstance == null) {
            notFound()
            return
        }

        String services = params.services
        if (services) {
            Set<Long> servicesIds = new HashSet<Long>()
            services.split(",").each {
                servicesIds.add(Long.parseLong(it))
            }
            Set<Service> servicesObjs = Service.findAllByIdInList(servicesIds)

            if (servicesObjs) {
                ticketInstance.clearErrors()
                ticketInstance.services = null
                servicesObjs.each {
                    ticketInstance.addToServices(it)
                }
                ticketInstance.validate()
            }
        }

        if (ticketInstance.hasErrors()) {
            respond ticketInstance.errors, view: 'create'
            return
        }

        ticketInstance.save flush: true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'ticket.label', default: 'Ticket'), ticketInstance.id])
                redirect ticketInstance
            }
            '*' { respond ticketInstance, [status: CREATED] }
        }
    }

    def edit(Ticket ticketInstance) {
        respond ticketInstance
    }

    @Transactional
    def update(Ticket ticketInstance) {
        if (ticketInstance == null) {
            notFound()
            return
        }

        String services = params.services
        if (services) {
            Set<Long> servicesIds = new HashSet<Long>()
            services.split(",").each {
                servicesIds.add(Long.parseLong(it))
            }
            Set<Service> servicesObjs = Service.findAllByIdInList(servicesIds)

            if (servicesObjs) {
                ticketInstance.clearErrors()
                ticketInstance.services = null
                servicesObjs.each {
                    ticketInstance.addToServices(it)
                }
                ticketInstance.validate()
            }
        }

        if (ticketInstance.hasErrors()) {
            respond ticketInstance.errors, view: 'edit'
            return
        }

        ticketInstance.save flush: true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'Ticket.label', default: 'Ticket'), ticketInstance.id])
                redirect ticketInstance
            }
            '*' { respond ticketInstance, [status: OK] }
        }
    }

    @Transactional
    def delete(Ticket ticketInstance) {

        if (ticketInstance == null) {
            notFound()
            return
        }

        try {
            Long master = ticketInstance.master.id
            Long duration = ticketInstance.duration
            LocalDate date = new LocalDate(ticketInstance.ticketDate.time)
            slotsService.syncFullDays(master, duration, date, ticketInstance.id, true)
            ticketInstance.delete()



            flash.message = message(code: 'default.deleted.message', args: [message(code: 'Ticket.label', default: 'Ticket'), ticketInstance.id])
            redirect action: "index"
        } catch (Exception e) {
            render(view: "../login/denied")
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'ticket.label', default: 'Ticket'), params.id])
                redirect action: "index", method: "GET"
            }
            '*' { render status: NOT_FOUND }
        }
    }
    def listAjax() {
        List<Ticket> ticketList = Ticket.ticketList(params)
        if (ticketList) {
            ticketList.each {
                ticket ->
                    ticket.master?.setPassword(null)
                    ticket.user?.setPassword(null)
            }
            render(template: "list", model:[ticketList:ticketList])
        } else {
            render([msg: g.message(code: "ticket.fine.not.found")])
        }
    }

    def shiftTickets() {
        if (params.id && params.time) {
            def principal = springSecurityService.principal
            User user = User.get(principal.id)
            if (user.authorities.contains(Role.findByAuthority(AuthKeys.ADMIN))) {
                try {
                    slotsService.shiftTickets(params.getLong("id"), user, params.getLong("time"))
                    render([code: "1"] as JSON)
                } catch (Exception e) {
                    render([msg: e.toString()] as JSON)
                }
            } else {
                render([msg: g.message(code: "ticket.shift.notmaster")] as JSON)
            }
        } else {
            render([msg: g.message(code: "ticket.shift.params.null")] as JSON)
        }
    }

    def swapTickets() {
        if (params.ticket1 && params.ticket2) {
            def result = slotsService.swapTickets(params.getLong("ticket1"), params.getLong("ticket2"))
            if (result) {
                render([msg: result] as JSON)
            } else {
                render([code: "0"] as JSON)
            }
        } else {
            render([msg: g.message(code: "ticket.swap.params.null")] as JSON)
        }
    }
}
