package com.h2osis.model

import com.h2osis.auth.User

class Holiday {

    Date dateFrom
    Date dateTo
    User master
    String comment
    Long maxTime

    String toString() {
        return  dateFrom + "-" + dateTo + " " + comment
    }

    static constraints = {
        comment nullable: true
        maxTime nullable: true, blank: true
    }
}
