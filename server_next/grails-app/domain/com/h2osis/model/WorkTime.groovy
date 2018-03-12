package com.h2osis.model

import com.h2osis.auth.User

class WorkTime {

    String timeFrom // время С
    String timeTo // время ПО
    Integer dayOfWeek // номер дня недели
    User master

    Date dateFrom
    Date dateTo


    static constraints = {
        timeFrom nullable: false
        timeTo nullable: false
        dayOfWeek nullable: false
        master nullable: true

        dateFrom nullable: true
        dateTo nullable: true
    }

    String toString() {
       return timeFrom.concat(' ').concat(timeTo)
    }
}
