package com.h2osis.utils

import com.h2osis.auth.User
import com.h2osis.constant.TicketStatus
import com.h2osis.constant.TicketType
import com.h2osis.model.Holiday
import com.h2osis.model.Service
import com.h2osis.model.Ticket
import com.h2osis.model.UserBlockFact
import com.h2osis.model.WorkTime
import grails.transaction.Transactional
import org.joda.time.*
import org.joda.time.format.DateTimeFormat
import org.springframework.scheduling.annotation.Async

@Transactional
class SlotsService {

    def springSecurityService
    def ticketsService

    def getWorkTimeDate(DateTime date, String workTime, String timeZone) {
        Integer h = workTime.split(":")[0].length() == 1 ? workTime.split(":")[0][1].toInteger() : workTime.split(":")[0].toInteger()
        Integer m = workTime.split(":")[1].length() == 1 ? workTime.split(":")[1][1].toInteger() : workTime.split(":")[1].toInteger()
        DateTime dt = new DateTime(date).toDateTime(DateTimeZone.forTimeZone(TimeZone.getTimeZone(timeZone)))
        dt = dt.withHourOfDay(h).withMinuteOfHour(m).withSecondOfMinute(0)
        return dt
    }

    def getWorkTimeMinusTimeDate(DateTime date, String workTime, Long time, String timeZone) {
        Integer h = workTime.split(":")[0].length() == 1 ? workTime.split(":")[0][1].toInteger() : workTime.split(":")[0].toInteger()
        Integer m = workTime.split(":")[1].length() == 1 ? workTime.split(":")[1][1].toInteger() : workTime.split(":")[1].toInteger()
        DateTime dt = new DateTime(date).toDateTime(DateTimeZone.forTimeZone(TimeZone.getTimeZone(timeZone)))
        dt = dt.withHourOfDay(h).withMinuteOfHour(m).withSecondOfMinute(0)
        dt = dt.minusMinutes(time.intValue())
        return dt
    }

    def getWorkTimeDate(DateTime date, Long time) {
        return date.minusMinutes(time.intValue() - 1)
    }

    def isTicketInWorkTime(Ticket ticket, WorkTime workTime, String timeZone) {
        Date date = ticket.ticketDate
        DateTime dt = new DateTime(date).toDateTime(DateTimeZone.forTimeZone(TimeZone.getTimeZone(timeZone)))
        DateTime dtStart = new DateTime(date).toDateTime(DateTimeZone.forTimeZone(TimeZone.getTimeZone(timeZone)))
        DateTime dtEnd = new DateTime(date).toDateTime(DateTimeZone.forTimeZone(TimeZone.getTimeZone(timeZone)))
        Integer h = workTime.timeFrom.split(":")[0].length() == 1 ? workTime.timeFrom.split(":")[0][1].toInteger() : workTime.timeFrom.split(":")[0].toInteger()
        Integer m = workTime.timeFrom.split(":")[1].length() == 1 ? workTime.timeFrom.split(":")[1][1].toInteger() : workTime.timeFrom.split(":")[1].toInteger()
        dtStart = dtStart.withHourOfDay(h).withMinuteOfHour(m).withSecondOfMinute(0)
        h = workTime.timeTo.split(":")[0].length() == 1 ? workTime.timeTo.split(":")[0][1].toInteger() : workTime.timeTo.split(":")[0].toInteger()
        m = workTime.timeTo.split(":")[1].length() == 1 ? workTime.timeTo.split(":")[1][1].toInteger() : workTime.timeTo.split(":")[1].toInteger()
        dtEnd = dtEnd.withHourOfDay(h).withMinuteOfHour(m).withSecondOfMinute(0)
        return (dt.toDate().time <= dtEnd.toDate().time && dt.toDate().time >= dtStart.toDate().time)
    }

    def isTicketBeforeCanCreate(DateTime lastSlotEnd, DateTime ticketDate, Long time) {
        return (
                Minutes.minutesBetween(
                        lastSlotEnd.withSecondOfMinute(0).withMillisOfSecond(0),
                        ticketDate.withSecondOfMinute(0).withMillisOfSecond(0)
                ).getMinutes() >= (time - 1))
    }

    def getTicketEndDate(Ticket ticket, String timeZone) {
        Date date = ticket.ticketDate
        DateTime dt = changeTimeZone(date, timeZone)
        Float summTime = 0
        if (ticket.duration) {
            summTime = ticket.duration
        } else {
            if (ticket.type.equals(TicketType.HEAD) || ticket.guid == null) {
                ticket.services.each {
                    summTime = summTime + it.time
                }
            } else {
                Ticket headTicket = Ticket.findByGuidAndType(ticket.guid, TicketType.HEAD)
                headTicket.services.each {
                    summTime = summTime + it.time
                }
            }
        }
        dt = dt.plusMinutes(summTime.intValue())
        return dt
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

    def changeTimeZone(Date source, String timeZone) {
        changeTimeZone(new DateTime(source), timeZone)
    }

    def changeTimeZone(DateTime source, String timeZone) {
        DateTime response = new DateTime().toDateTime(DateTimeZone.forTimeZone(TimeZone.getTimeZone(timeZone)))
        response = response
                .withYear(source.year)
                .withMonthOfYear(source.monthOfYear)
                .withDayOfMonth(source.dayOfMonth)
                .withHourOfDay(source.hourOfDay)
                .withMinuteOfHour(source.minuteOfHour)
                .withSecondOfMinute(0)
                .withMillisOfSecond(0)
        return response
    }

    def getSlots(Long master, Long time, LocalDate date, Long currId) {
        getSlots(master, time, date, currId, "Asia/Baghdad")
    }

    def getSlots(Long master, Long time, LocalDate date, Long currId, String timeZone) {
        User ticketsMaster = User.get(master)
        List<WorkTime> workTimes = WorkTime.findAllByDayOfWeekAndMaster(date.getDayOfWeek(), ticketsMaster, [sort: 'timeFrom'])

        DateTime dt1 = date.toDateTime(new LocalTime("00:00"))
        DateTime dt2 = dt1.withHourOfDay(23).withMinuteOfHour(59).withSecondOfMinute(59)

        List<Ticket> ticketList = null
        if (currId) {
            Ticket curTicket = Ticket.findById(currId)
            if (curTicket) {
                ticketList = Ticket.findAllByMasterAndTypeAndTicketDateBetweenAndGuidNotEqualAndStatusNotEqualAndStatusNotEqual(ticketsMaster,
                        TicketType.SUB, dt1, dt2, curTicket.guid, TicketStatus.REJECTED, TicketStatus.DELETED, [sort: 'ticketDate'])
            }
        }
        if (ticketList == null) {
            ticketList = Ticket.findAllByMasterAndTypeAndTicketDateBetweenAndStatusNotEqualAndStatusNotEqual(ticketsMaster,
                    TicketType.SUB, dt1, dt2, TicketStatus.REJECTED, TicketStatus.DELETED, [sort: 'ticketDate'])
        }

        DateTime currentDT = new DateTime().toDateTime(DateTimeZone.forTimeZone(TimeZone.getTimeZone(timeZone)))
        DateTime masterCurrentDT = changeTimeZone(currentDT, ticketsMaster.masterTZAct)

        if (date.dayOfMonth == currentDT.dayOfMonth && date.monthOfYear == currentDT.monthOfYear) {
            Ticket blockTimeticket = new Ticket()
            blockTimeticket.setStatus(TicketStatus.ACCEPTED)
            if (workTimes.size() > 0) {
                String startTime = workTimes.get(0).timeFrom
                DateTime masterTicketDate = new DateTime().withHourOfDay(startTime.split(":")[0].toInteger())
                        .withMinuteOfHour(startTime.split(":")[1].toInteger()).withSecondOfMinute(0)
                blockTimeticket.setTicketDate(masterTicketDate.toDate())
                blockTimeticket.setTime(startTime)

                Integer blockDuration = Minutes.minutesBetween(
                        changeTimeZone(blockTimeticket.ticketDate, ticketsMaster.masterTZAct),
                        masterCurrentDT).minutes
                if (!(blockDuration.toString().endsWith('5') || blockDuration.toString().endsWith('0'))) {
                    Integer lastNum = blockDuration.toString()[blockDuration.toString().length() - 1].toInteger()
                    Integer durDiff = lastNum > 5 ? 10 - lastNum : 5 - lastNum
                    blockDuration = blockDuration + durDiff
                }
                if (blockDuration > 0) {
                    blockTimeticket.setDuration(blockDuration)
                    ticketList = [blockTimeticket].plus(ticketList)
                }
            }
        }

        List<Map<String, String>> response = new ArrayList<Map<String, String>>()


        if (workTimes) {
            workTimes.each {
                DateTime lastSlotStart = getWorkTimeDate(dt1, it.timeFrom, ticketsMaster.masterTZAct)
                DateTime lastSlotEnd = getWorkTimeDate(dt1, it.timeFrom, ticketsMaster.masterTZAct)

                if (!ticketList) {
                    Map<String, String> freePeriod = new HashMap<String, Date>()
                    freePeriod.put("start",
                            changeTimeZone(lastSlotStart, timeZone).toString("yyyy-MM-dd HH:mm:ss"))
                    freePeriod.put("end",
                            changeTimeZone(getWorkTimeDate(getWorkTimeDate(masterCurrentDT, it.timeTo, ticketsMaster.masterTZAct), time), timeZone)
                                    .toString("yyyy-MM-dd HH:mm:ss"))
                    response.add(freePeriod)

                } else {

                    for (int i = 0; i < ticketList.size(); i++) {
                        if (isTicketInWorkTime(ticketList.get(i), it, ticketsMaster.masterTZAct) &&
                                isTicketBeforeCanCreate(
                                        lastSlotEnd,
                                        changeTimeZone(ticketList.get(i).ticketDate, ticketsMaster.masterTZAct),
                                        time)) {
                            //lastSlotEnd = ticketList.get(i).ticketDate
                            Map<String, Date> freePeriod = new HashMap<String, Date>()
                            freePeriod.put("start",
                                    changeTimeZone(lastSlotStart, timeZone).toString("yyyy-MM-dd HH:mm:ss"))
                            freePeriod.put("end",
                                    changeTimeZone(getTicketStartMinusTime(ticketList.get(i), time, ticketsMaster.masterTZAct).plusMinutes(1), timeZone)
                                            .toString("yyyy-MM-dd HH:mm:ss"))
                            response.add(freePeriod)
                            lastSlotEnd = getTicketEndDate(ticketList.get(i), ticketsMaster.masterTZAct)
                        } else if (isTicketInWorkTime(ticketList.get(i), it, ticketsMaster.masterTZAct)) {
                            lastSlotEnd = getTicketEndDate(ticketList.get(i), ticketsMaster.masterTZAct)
                        }
                        lastSlotStart = getTicketEndDate(ticketList.get(i), ticketsMaster.masterTZAct)
                    }

                    if (isTicketBeforeCanCreate(lastSlotEnd, getWorkTimeDate(dt1, it.timeTo, ticketsMaster.masterTZAct), time)) {
                        Map<String, String> freePeriod = new HashMap<String, Date>()
                        freePeriod.put("start",
                                changeTimeZone(lastSlotStart, timeZone).toString("yyyy-MM-dd HH:mm:ss"))
                        freePeriod.put("end",
                                changeTimeZone(getWorkTimeDate(getWorkTimeDate(masterCurrentDT, it.timeTo, ticketsMaster.masterTZAct), time), timeZone)
                                        .toString("yyyy-MM-dd HH:mm:ss"))
                        response.add(freePeriod)
                    }
                }
            }
        }
        return response
    }

    def isTicketsOverlap(Ticket t1, Ticket t2) {

        String timeZone = t1.master.masterTZAct

        if ((t1.id != t2.id)) {
            Date start1 = t1.ticketDate
            Date start2 = t2.ticketDate
            Date end1 = getTicketEndDate(t1, timeZone).toDate()
            Date end2 = getTicketEndDate(t2, timeZone).toDate()

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
        LocalDateTime localDateTime = new LocalDateTime(date.toDate().time)
        if (normalSlots?.isEmpty()) {
            Holiday holiday = new Holiday()

            holiday.setDateFrom(localDateTime.withHourOfDay(0).withMinuteOfHour(0).withSecondOfMinute(0).toDate())
            holiday.setDateTo(localDateTime.withHourOfDay(23).withMinuteOfHour(59).withSecondOfMinute(59).toDate())
            holiday.setMaster(User.findById(master))
            holiday.setComment("fullday")
            holiday.save()
        } else {
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

        Holiday holiday
        List<Holiday> holidays = Holiday.findAllByDateToAndDateFromAndCommentAndMaster(
                localDateTime.withHourOfDay(23).withMinuteOfHour(59).withSecondOfMinute(59).toDate(),
                localDateTime.withHourOfDay(0).withMinuteOfHour(0).withSecondOfMinute(0).toDate(),
                "maxTime",
                User.findById(master)
        )
        if (holidays.isEmpty()) {
            holiday = new Holiday()
        } else {
            holiday = holidays.get(0)
        }
        holiday.setDateFrom(localDateTime.withHourOfDay(0).withMinuteOfHour(0).withSecondOfMinute(0).toDate())
        holiday.setDateTo(localDateTime.withHourOfDay(23).withMinuteOfHour(59).withSecondOfMinute(59).toDate())
        holiday.setMaster(User.findById(master))
        holiday.setComment("maxTime")
        holiday.setMaxTime(getMaxTime(User.findById(master), localDateTime.toDate()))
        holiday.save()
    }

    def getMaxTime(User master, Date date) {
        List<Map<String, String>> slots = getSlots(master.id, 0L,
                new LocalDate(date.time), null)
        List<Integer> timesArray = new ArrayList<Integer>()
        for (Map<String, String> period : slots) {
            timesArray.add(Math.abs(Minutes.minutesBetween(
                    DateTime.parse(period.get("start"), DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss")),
                    DateTime.parse(period.get("end"), DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss"))).minutes))
        }
        return Collections.max(timesArray)
    }

    def getDuration(Long time) {

        List<Service> services = Service.findAll("from Service order by time", [max:1])
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
                    Ticket.findAllByTicketDateBetweenAndMasterAndTypeAndStatusNotEqualAndStatusNotEqual(dt1, dt2, master, TicketType.HEAD, TicketStatus.REJECTED, TicketStatus.DELETED, [sort: 'ticketDate'])
            if (ticketList) {
                Integer firstPos = ticketList.findIndexOf { it.id.equals(firstTicket.id) }
                ticketList = ticketList.subList(firstPos, ticketList.size())
                List<User> clients = ticketList.user
                ticketsService.sendShiftSMS(clients)
                for (Integer i = 0; i < ticketList.size(); i++) {
                    if (time <= 0) {
                        break
                    }
                    Ticket it = ticketList.get(i)
                    Date ticketDate = it.ticketDate
                    DateTime newTicketDate = new DateTime(ticketDate)


                    if (i < ticketList.size() - 1) {
                        DateTime dtEndTicket = getTicketEndDate(it, TimeZone.getDefault().getID())
                        DateTime dtStartNextTicket = new DateTime(ticketList.get(i + 1).ticketDate)
                        Integer space = Minutes.minutesBetween(
                                dtEndTicket.withSecondOfMinute(0).withMillisOfSecond(0),
                                dtStartNextTicket.withSecondOfMinute(0).withMillisOfSecond(0)).minutes
                        if(space.equals(0)){
                            newTicketDate = newTicketDate.plusMinutes(time.toInteger())
                        } else {
                            if (space >= time) {
                                i = ticketList.size()
                                newTicketDate = newTicketDate.plusMinutes(time.toInteger())
                            } else {
                                newTicketDate = newTicketDate.plusMinutes(time.toInteger())
                                time = time - space
                            }
                        }
                    } else {
                        newTicketDate = newTicketDate.plusMinutes(time.toInteger())
                    }

                    it.setTicketDate(newTicketDate.toDate())
                    Integer h = newTicketDate.hourOfDay
                    Integer m = newTicketDate.minuteOfHour
                    String timeString = (h.toString().size() == 2 ? h.toString() : "0".concat(h.toString()))
                            .concat(":").concat(m.toString().size() == 2 ? m.toString() : "0".concat(m.toString()))
                    it.setTime(timeString)
                    it.save(flush: true)
                }
            }

        }
    }

    def getTicketStartMinusTime(Ticket ticket, Long time, String timeZone) {
        Date date = ticket.ticketDate
        DateTime dt = changeTimeZone(date, timeZone)
        dt = dt.minusMinutes(time.intValue())
        return dt
    }

    def getTicketDurationAct(Ticket ticket) {
        Float summTime = 0
        if (ticket.duration) {
            summTime = ticket.duration
        } else {
            if (ticket.type.equals(TicketType.HEAD) || ticket.guid == null) {
                ticket.services.each {
                    summTime = summTime + it.time
                }
            } else {
                Ticket headTicket = Ticket.findByGuidAndType(ticket.guid, TicketType.HEAD)
                headTicket.services.each {
                    summTime = summTime + it.time
                }
            }
        }
        return summTime.toLong()
    }

    def swapTickets(Long ticket1Id, Long ticket2Id) {
        try {
            Ticket ticket1 = Ticket.get(ticket1Id)
            Ticket ticket2 = Ticket.get(ticket2Id)
            if (getTicketDurationAct(ticket1).equals(getTicketDurationAct(ticket2))) {

                Date ticket1Date = ticket1.ticketDate
                String ticket1Time = ticket1.time

                ticket1.ticketDate = ticket2.ticketDate
                ticket1.time = ticket2.time

                ticket2.ticketDate = ticket1Date
                ticket2.time = ticket1Time

                ticket1.save(flush: true)
                ticket2.save(flush: true)
            }
        } catch (Exception e) {
            return e.toString()
        }
        return null
    }

}

