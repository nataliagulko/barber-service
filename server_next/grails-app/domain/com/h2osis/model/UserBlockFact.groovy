package com.h2osis.model

import com.h2osis.auth.User

class UserBlockFact {

    User user
    User master
    String comment

    static constraints = {
        comment nullable: true, blank: true
    }
}
