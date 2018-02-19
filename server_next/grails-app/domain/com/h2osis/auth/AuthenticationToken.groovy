package com.h2osis.auth

class AuthenticationToken {

    String tokenValue
    String username

    Date refreshed = new Date()

    static mapping = {
        version false
    }

    def afterLoad() {
        if (refreshed < new Date() - 1) {
            refreshed = new Date()
            it.save()
        }
    }

}
