package com.h2osis.auth

class ChangePassRequest {

    Long userId
    String pass
    String code

    static constraints = {

        userId nullable: false
        pass nullable: false, blank: false
        code nullable: false, blank: false
    }
}
