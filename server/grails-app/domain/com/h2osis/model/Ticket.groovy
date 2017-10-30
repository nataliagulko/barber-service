package com.h2osis.model

import com.h2osis.auth.User
import com.h2osis.constant.TicketType
import com.h2osis.sm.SMObjectType
import org.joda.time.DateTime
import org.joda.time.LocalTime

import java.time.LocalDate

class Ticket {

    transient slotsService, SMManagerService


    User user // клиент
    User master // мастер
    Date ticketDate // дата и время записи
    String time //время
    String status // статус из union (новый - new, подтверждено - accepted, отклонено - rejected, complete - завершен)
    String comment // комментарии к записи
    String guid
    String type
    Long cost
    Long duration

    Date dateCreated
    Date lastUpdated

    static hasMany = [services: Service, subTickets: Ticket]

    static transients = ['subTickets', 'slotsService']


    static mapping = {
        status defaultValue: "'NEW'"
        type defaultValue: "'HEAD'"
        user lazy: false
        services lazy: false
    }

    static constraints = {
        user()
        master()
        services nullable: false, minSize: 1
        ticketDate nullable: false
        time widget: "time", nullable: false
        status display: false
        comment nullable: true, minSize: 0, maxSize: 255
        guid nullable: true, display: false
        type nullable: true, display: false
        cost nullable: true
        duration nullable: true
        dateCreated nullable: true
        lastUpdated nullable: true
    }

    static search = {
        comment index: 'tokenized'
        status index: 'tokenized'
        ticketDate date: 'day'
        user indexEmbedded: [depth: 1]
        master indexEmbedded: [depth: 1]
        services indexEmbedded: [depth: 1]
    }

    def beforeInsert() {
        updateDate()
        createSubTickets()
        updateFields()
        dateCreated = new Date()
    }

    def beforeUpdate() {
        updateDate()
        updateFields()
        if (this.type && this.type.equals(TicketType.HEAD)) {
            updateSubTicketsDate()
            slotsService.syncFullDays(this, this.getPersistentValue("ticketDate"), null)
        }
        lastUpdated = new Date()
    }

    def updateSubTicketsDate() {
        List<Ticket> subs = this.getSubTickets()
        DateTime currDate = new DateTime(this.ticketDate)
        String time = this.time
        subs?.each { subTicket ->
            subTicket.setTicketDate(currDate.toDate())
            Integer h = currDate.hourOfDay
            Integer m = currDate.minuteOfHour
            String currTime = (h < 10 ? "0".concat(h.toString()) : h.toString()).concat(":").concat(m < 10 ? "0".concat(m.toString()) : m.toString())
            subTicket.setTime(currTime)
            subTicket.save()
            Integer timeDiff = slotsService.getTicketDurationAct(subTicket).intValue()
            currDate = currDate.plusMinutes(timeDiff)
        }
    }

    def updateStatuses(){
        Ticket.findAllByGuid(this.guid)?.each {
            it.setStatus(this.status)
            it.save()
        }
    }

    def delete() {
        Ticket.deleteAll(Ticket.findAllByGuid(this.guid))
    }

    def beforeValidate() {
        updateDate()
        updateFields()
    }

    def updateFields() {
        Long allDuration = 0L
        Long allCost = 0L
        Set<Service> services = this.services
        if (services) {
            services.each {
                allDuration += it.time
                allCost += it.cost
            }
        }
        duration = allDuration
        cost = allCost
    }

    def updateDate() {
        if (time && time.contains(":")) {
            //DateTime time = DateTimeFormat.shortTime().parseDateTime(time)
            String h = time.split(":")[0]
            String m = time.split(":")[1]
            if (h.startsWith("0")) {
                h = h.substring(1)
            }
            if (m.startsWith("0")) {
                m = m.substring(1)
            }
            DateTime oldDate = new DateTime(ticketDate)
            DateTime dateTime = oldDate.withHourOfDay(Integer.parseInt(h)).withMinuteOfHour(Integer.parseInt(m))
                    .withSecondOfMinute(0)
            ticketDate = dateTime.toDate()
        }
    }

    def deleteSubTickets() {
        Ticket.deleteAll(this.getSubTickets())
    }

    def createSubTickets() {
        if (this.type && this.type.equals(TicketType.HEAD)) {
            String guid = UUID.randomUUID().toString()
            this.setGuid(guid)
            LocalTime localTime = new LocalTime(this.time)

            this.services?.each {
                if (it.class == Service.class) {
                    Ticket subTicket = new Ticket()
                    subTicket.setGuid(guid)
                    subTicket.setUser(this.getUser())
                    subTicket.setMaster(this.getMaster())
                    subTicket.setTicketDate(this.getTicketDate())
                    subTicket.setTime(localTime.toString("HH:mm"))
                    localTime = localTime.plusMinutes(it.time.intValue())
                    subTicket.setStatus(this.getStatus())
                    subTicket.setComment(this.getComment())
                    subTicket.addToServices(it)
                    subTicket.setType(TicketType.SUB)
                    subTicket.save()
                } else if (it.class == ServiceGroup.class) {
                    Set<ServiceToGroup> serviceToGroupSet = ServiceToGroup.findAllByGroup(it)
                    if (serviceToGroupSet) {
                        serviceToGroupSet.each { subService ->
                            Ticket subTicket = new Ticket()
                            subTicket.setGuid(guid)
                            subTicket.setUser(this.getUser())
                            subTicket.setMaster(this.getMaster())
                            subTicket.setTicketDate(this.getTicketDate())
                            subTicket.setTime(localTime.toString("HH:mm"))
                            localTime = localTime.plusMinutes(subService.service.time.intValue())
                            localTime = localTime.plusMinutes(subService.serviceTimeout.intValue())
                            subTicket.setStatus(this.getStatus())
                            subTicket.setComment(this.getComment())
                            subTicket.setType(TicketType.SUB)
                            subTicket.addToServices(subService.service)
                            subTicket.save()
                        }
                    }
                }
            }
        }
    }

    String toString() {
        if (ticketDate && user && master) {
            return ticketDate.format("dd-MM HH:mm").concat(' ').concat(user.toString()).concat('/').concat(master.toString())
        } else {
            return id
        }
    }

    def getSubTickets() {
        if (this.guid) {
            return Ticket.findAllByGuidAndType(this.guid, TicketType.SUB)
        } else {
            return null
        }
    }

    def getTicketTransitions() {
        return SMManagerService.getObjectTransitions(SMObjectType.ticket, id)
    }

    static def getHeadTickets(def params) {
        return Ticket.createCriteria().list(offset: params.offset) {
            eq('type', TicketType.HEAD)
            if (params.max) {
                maxResults((params.max))
            }

            if (params.master) {
                eq('master', User.get(params.master))
            }
            if (params.user) {
                eq('user', User.get(params.user))
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
    }

    static def ticketList(def params) {
        List<Ticket> ticketList = Ticket.createCriteria().list(offset: params.offset == null ? 0L : Long.parseLong(params.offset)) {

            if (params.user) {
                user {
                    eq('id', Long.parseLong(params.user))
                }
            }

            if (params.master) {
                master {
                    eq('id', Long.parseLong(params.master))
                }
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
        return ticketList
    }
}
