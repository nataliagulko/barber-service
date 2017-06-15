package com.h2osis.model

import com.h2osis.auth.User

class Holiday {

    Date dateFrom
    Date dateTo
    User master
    String comment

    String toString() {
        return  dateFrom + "-" + dateTo + " " + comment
    }

    static constraints = {
        comment nullable: true
    }
}
