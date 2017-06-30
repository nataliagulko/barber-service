package com.h2osis.utils

import com.h2osis.auth.User
import com.h2osis.constant.TicketStatus
import com.h2osis.constant.TicketType
import com.h2osis.model.*
import grails.transaction.Transactional
import org.joda.time.*
import org.joda.time.format.DateTimeFormat

@Transactional
class SlotsService {

    def springSecurityService

    def getWorkTimeDate(Date date, String workTime) {

        Calendar workDate = Calendar.getInstance();
        workDate.setTime(date);
        workDate.set(Calendar.HOUR_OF_DAY, Integer.parseInt(workTime.split(":")[0]));
        workDate.set(Calendar.MINUTE, Integer.parseInt(workTime.split(":")[1]));
        workDate.set(Calendar.SECOND, 0);
        workDate.set(Calendar.MILLISECOND, 0);
        return workDate.time
    }

    def getWorkTimeDate(Date date, String workTime, Long time) {

        Calendar workDate = Calendar.getInstance();
        workDate.setTime(date);
        workDate.set(Calendar.HOUR_OF_DAY, Integer.parseInt(workTime.split(":")[0]));
        workDate.set(Calendar.MINUTE, Integer.parseInt(workTime.split(":")[1]));
        workDate.set(Calendar.SECOND, 0);
        workDate.set(Calendar.MILLISECOND, 0);
        workDate.minus(Calendar.MINUTE, time)
        return workDate.time
    }

    def getWorkTimeDate(Date date, Long time) {
        DateTime dt = new DateTime(date)
        return dt.minusMinutes(time.intValue()-1).toDate()
    }

    def isTicketInWorkTime(Ticket ticket, WorkTime workTime) {
        Date date = ticket.ticketDate
        Calendar workDateStart = Calendar.getInstance();
        workDateStart.setTime(date);
        workDateStart.set(Calendar.HOUR_OF_DAY, Integer.parseInt(workTime.timeFrom.split(":")[0]));
        workDateStart.set(Calendar.MINUTE, Integer.parseInt(workTime.timeFrom.split(":")[1]));

        Calendar workDateEnd = Calendar.getInstance();
        workDateEnd.setTime(date);
        workDateEnd.set(Calendar.HOUR_OF_DAY, Integer.parseInt(workTime.timeTo.split(":")[0]));
        workDateEnd.set(Calendar.MINUTE, Integer.parseInt(workTime.timeTo.split(":")[1]));

        return (workDateStart.time.time <= date.time && workDateEnd.time.time >= date.time)
    }

    def isTicketBeforeCanCreate(Date lastSlotEnd, Date ticketDate, Long time) {
        return (
                Minutes.minutesBetween(
                        new LocalDateTime(lastSlotEnd),
                        new LocalDateTime(ticketDate)
                ).getMinutes() >= time)
    }

    def getTicketEndDate(Ticket ticket) {
        Date date = ticket.ticketDate
        Calendar response = Calendar.getInstance();
        response.setTime(date);
        Float summTime = 0
        ticket.services.each {
            summTime = summTime + it.time
        }

        response.add(Calendar.MINUTE, summTime.intValue())
        return response.time
    }

    def getSlotsInvert(Long master, Long time, LocalDate date, Long currId) {
        List<Map<String, String>> normalSlots = getSlots(master, time, date, currId)
        List<Map<String, String>> response = new ArrayList<Map<String, String>>()

        String newSlotStart = new LocalDate(date).toLocalDateTime(new LocalTime("00:00")).toDate().format("yyyy-MM-dd HH:mm:ss")

        if (normalSlots) {
            for (Map<String, String> item : normalSlots) {
                Map<String, Date> freePeriod = new HashMap<String, Date>()
                freePeriod.put("start", newSlotStart)
                freePeriod.put("end", item.get("start"))
                response.add(freePeriod)
                newSlotStart = item.get("end")
            }

            Map<String, Date> freePeriod = new HashMap<String, Date>()
            freePeriod.put("start", newSlotStart)
            freePeriod.put("end", new LocalDate(date).toLocalDateTime(new LocalTime("23:59")).toDate().format("yyyy-MM-dd HH:mm:ss"))
            response.add(freePeriod)

        } else {
            Map<String, String> period = new HashMap<String, Date>()
            period.put("start", new LocalDate(date).toLocalDateTime(new LocalTime("00:00")).toDate().format("yyyy-MM-dd HH:mm:ss"))
            period.put("end",
                    new LocalDate(date).toLocalDateTime(new LocalTime("23:59:59")).toDate().format("yyyy-MM-dd HH:mm:ss"))
            response.add(period)
        }
        return response
    }

    def getSlots(Long master, Long time, LocalDate date, Long currId) {
        User ticketsMaster = User.get(master)
        List<WorkTime> workTimes = WorkTime.findAllByDayOfWeekAndMaster(date.getDayOfWeek(), ticketsMaster, [sort: 'timeFrom'])

        DateTime dt1 = date.toDateTime(new LocalTime("00:00"))
        DateTime dt2 = dt1.withHourOfDay(23).withMinuteOfHour(59).withSecondOfMinute(59)

        List<Ticket> ticketList = null
        if (currId) {
            Ticket curTicket = Ticket.findById(currId)
            if (curTicket) {
                ticketList = Ticket.findAllByMasterAndTypeAndTicketDateBetweenAndGuidNotEqualAndStatusNotEqual(ticketsMaster, TicketType.SUB, dt1, dt2, curTicket.guid, TicketStatus.REJECTED, [sort: 'ticketDate'])
            }
        }
        if (ticketList == null) {
            ticketList = Ticket.findAllByMasterAndTypeAndTicketDateBetweenAndStatusNotEqual(ticketsMaster, TicketType.SUB, dt1, dt2, TicketStatus.REJECTED, [sort: 'ticketDate'])
        }

        List<Map<String, String>> response = new ArrayList<Map<String, String>>()

        if (workTimes) {
            workTimes.each {
                Date lastSlotStart = getWorkTimeDate(date.toDate(), it.timeFrom)
                Date lastSlotEnd = getWorkTimeDate(date.toDate(), it.timeFrom)

                if (!ticketList) {
                    Map<String, String> freePeriod = new HashMap<String, Date>()
                    freePeriod.put("start", lastSlotStart.format("yyyy-MM-dd HH:mm:ss"))
                    freePeriod.put("end",
                            getWorkTimeDate(getWorkTimeDate(date.toDate(), it.timeTo), time).format("yyyy-MM-dd HH:mm:ss"))
                    response.add(freePeriod)

                } else {

                    for (int i = 0; i < ticketList.size(); i++) {
                        if (isTicketInWorkTime(ticketList.get(i), it) &&
                                isTicketBeforeCanCreate(lastSlotEnd, ticketList.get(i).ticketDate, time)) {
                            //lastSlotEnd = ticketList.get(i).ticketDate
                            Map<String, Date> freePeriod = new HashMap<String, Date>()
                            freePeriod.put("start", lastSlotStart.format("yyyy-MM-dd HH:mm:ss"))
                            freePeriod.put("end",
                                    getWorkTimeDate(ticketList.get(i).ticketDate, time).format("yyyy-MM-dd HH:mm:ss"))
                            response.add(freePeriod)
                            lastSlotEnd = getTicketEndDate(ticketList.get(i))
                        } else if (isTicketInWorkTime(ticketList.get(i), it)) {
                            lastSlotEnd = getTicketEndDate(ticketList.get(i))
                        }
                        lastSlotStart = getTicketEndDate(ticketList.get(i))
                    }

                    if (isTicketBeforeCanCreate(lastSlotEnd, getWorkTimeDate(date.toDate(), it.timeTo), time)) {
                        Map<String, String> freePeriod = new HashMap<String, Date>()
                        freePeriod.put("start", lastSlotStart.format("yyyy-MM-dd HH:mm:ss"))
                        freePeriod.put("end",
                                getWorkTimeDate(getWorkTimeDate(date.toDate(), it.timeTo), time).format("yyyy-MM-dd HH:mm:ss"))
                        response.add(freePeriod)
                    }
                }
            }
        }
        return response
    }

    def isTicketsOverlap(Ticket t1, Ticket t2) {

        if ((t1.id != t2.id)) {
            Date start1 = t1.ticketDate
            Date start2 = t2.ticketDate
            Date end1 = getTicketEndDate(t1)
            Date end2 = getTicketEndDate(t2)

            Interval interval1 = new Interval(start1.time, end1.time)
            Interval interval2 = new Interval(start2.time, end2.time)

            return interval1.overlap(interval2)
        } else {
            return false
        }
    }

    private int timeCompare(String time1, String time2) {
        DateTime dateTime = DateTimeFormat.shortTime().parseDateTime(time1)
        DateTime dateTime2 = DateTimeFormat.shortTime().parseDateTime(time2)
        return dateTime.compareTo(dateTime2)
    }

    private String getTicketEndTime(Ticket ticket) {
        Set<Service> serviceSet = Service.findAllByIdInList(ticket.services.id)
        Long time = 0L
        if (serviceSet) {
            serviceSet.each {
                time = time + it.time
            }
        }
        DateTime dateTime = DateTimeFormat.shortTime().parseDateTime(ticket.time)
        dateTime = dateTime.plusMinutes(time.intValue())
        return dateTime.toString(DateTimeFormat.forPattern("HH:mm"))
    }

    def isTicketsOverlapNoJoda(Ticket t1, Ticket t2) {
        if ((t1.id != t2.id)) {
            return (
                    (timeCompare(t2.time, t1.time) < 0 && timeCompare(getTicketEndTime(t2), getTicketEndTime(t1)) > 0)
                            || ((timeCompare(t2.time, t1.time) > 0) && (timeCompare(getTicketEndTime(t2), getTicketEndTime(t1)) < 0))
                            || (
                            (timeCompare(t2.time, t1.time) < 0) &&
                                    (timeCompare(getTicketEndTime(t2), getTicketEndTime(t1)) < 0) &&
                                    (timeCompare(getTicketEndTime(t2), t1.time) > 0)
                    )
                            || (
                            (timeCompare(t2.time, t1.time) > 0) &&
                                    (timeCompare(t2.time, getTicketEndTime(t1)) < 0) &&
                                    (timeCompare(getTicketEndTime(t2), getTicketEndTime(t1)) > 0)
                    ))
        } else {
            return false
        }
    }

    @Transactional
    def syncFullDays(Ticket ticket, Date date, Long id) {
        syncFullDays(ticket.master.id, ticket.duration, new LocalDate((date == null ? ticket.ticketDate : date).time), id, false)
    }

    @Transactional
    def syncFullDays(Ticket ticket, Date date, Long id, Boolean flush) {
        syncFullDays(ticket.master.id, ticket.duration, new LocalDate((date == null ? ticket.ticketDate : date).time), id, flush)
    }

    @Transactional
    def syncFullDays(Long master, Long duration, LocalDate date, Long id) {
        syncFullDays(master, duration, date, id, false)
    }

    @Transactional
    def syncFullDays(Long master, Long duration, LocalDate date, Long id, Boolean flush) {
        List<Map<String, String>> normalSlots = getSlots(master, getDuration(duration), date, id)
        if (normalSlots?.isEmpty()) {
            Holiday holiday = new Holiday()
            LocalDateTime localDateTime = new LocalDateTime(date.toDate().time)
            holiday.setDateFrom(localDateTime.withHourOfDay(0).withMinuteOfHour(0).withSecondOfMinute(0).toDate())
            holiday.setDateTo(localDateTime.withHourOfDay(23).withMinuteOfHour(59).withSecondOfMinute(59).toDate())
            holiday.setMaster(User.findById(master))
            holiday.setComment("fullday")
            holiday.save()
        } else {
            LocalDateTime localDateTime = new LocalDateTime(date.toDate().time)
            List<Holiday> holidays = Holiday.findAllByDateToAndDateFromAndCommentAndMaster(
                    localDateTime.withHourOfDay(23).withMinuteOfHour(59).withSecondOfMinute(59).toDate(),
                    localDateTime.withHourOfDay(0).withMinuteOfHour(0).withSecondOfMinute(0).toDate(),
                    "fullday",
                    User.findById(master)
            )
            holidays?.each {
                it.delete(flush: flush)
            }
        }
    }

    def getDuration(Long time) {

        List<Service> services = Service.list(max: 1, order: 'time')
        return services == null ? time : services.get(0).time

    }

    def getMasters() {
        def principal = springSecurityService.principal
        User user = User.get(principal.id)
        Set<UserBlockFact> blocks = UserBlockFact.findAllByUser(user)
        Set<User> masters = User.masters
        if (blocks) {
            Set<User> blockedMasters = User.findAllByIdInList(blocks.master.id)
            masters = masters.minus(blockedMasters)
        }
        return masters
    }

    //свдигаем тикеты начиная с ticketId на time минут
    @Transactional
    def shiftTickets(Long ticketId, User master, Long time) {
        Ticket firstTicket = Ticket.get(ticketId)
        if (firstTicket) {
            DateTime dt1 = new DateTime(firstTicket.ticketDate).withHourOfDay(0).withMinuteOfHour(0).withSecondOfMinute(0)
            DateTime dt2 = dt1.withHourOfDay(23).withMinuteOfHour(59).withSecondOfMinute(59)
            List<Ticket> ticketList =
                    Ticket.findAllByTicketDateBetweenAndMaster(dt1, dt2, master, [sort: 'ticketDate'])
            if(ticketList){
                Integer firstPos = ticketList.findIndexOf {it.id.equals(firstTicket.id)}
                ticketList.subList(firstPos, ticketList.size()-1)
                List<User> clients = ticketList.user
                ticketList.each {
                    Date ticketDate = it.ticketDate
                    DateTime newTicketDate = new DateTime(ticketDate)
                    newTicketDate = newTicketDate.plusMinutes(time.toInteger())
                    it.setTicketDate(newTicketDate.toDate())
                    Integer h = newTicketDate.hourOfDay
                    Integer m = newTicketDate.minuteOfHour
                    String timeString  = h.toString().size()==2?h.toString():"0".concat(h.toString())
                    .concat(":").concat(m.toString().size()==2?m.toString():"0".concat(m.toString()))
                    it.setTime(timeString)
                    it.save(flush: true)
                }
            }

        }
    }

}

