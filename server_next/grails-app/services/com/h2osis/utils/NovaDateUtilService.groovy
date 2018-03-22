package com.h2osis.utils

import com.h2osis.auth.User
import grails.transaction.Transactional
import org.joda.time.DateTime
import org.joda.time.DateTimeZone

@Transactional
class NovaDateUtilService {

    def getMasterTZDateTimeDDMMYYYY(String dateStr, User master) {
        def arr = dateStr.split("\\.")
        String timeZone = master.masterTZAct
        DateTime response = new DateTime().toDateTime(DateTimeZone.forTimeZone(TimeZone.getTimeZone(timeZone)))
        response = response
                .withYear(Integer.parseInt(arr[2]))
                .withMonthOfYear(Integer.parseInt(arr[1]))
                .withDayOfMonth(Integer.parseInt(arr[0]))
                .withHourOfDay(0)
                .withMinuteOfHour(0)
                .withSecondOfMinute(0)
                .withMillisOfSecond(0)
        return response
    }

    def getMasterTZDateTime(DateTime dt, User master) {
        String timeZone = master.masterTZAct
        DateTime response = new DateTime().toDateTime(DateTimeZone.forTimeZone(TimeZone.getTimeZone(timeZone)))
        response = response
                .withYear(dt.year)
                .withMonthOfYear(dt.monthOfYear)
                .withDayOfMonth(dt.dayOfMonth)
                .withHourOfDay(0)
                .withMinuteOfHour(0)
                .withSecondOfMinute(0)
                .withMillisOfSecond(0)
        return response
    }
}
