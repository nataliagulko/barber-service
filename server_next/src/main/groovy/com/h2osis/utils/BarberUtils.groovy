package com.h2osis.utils

import grails.plugin.springsecurity.SpringSecurityUtils

/**
 * Created by esokolov on 21.03.2017.
 */
class BarberUtils {

    static def adminUrl = "/ticket/"
    static def userUrl = "/main/"

   static String determRedirectUrl() {

        boolean hasAdmin = SpringSecurityUtils.ifAllGranted("ROLE_ADMIN")
        boolean hasUser = SpringSecurityUtils.ifAllGranted("ROLE_USER")

        if (hasAdmin) {
            return adminUrl;
        } else if (hasUser) {
            return userUrl
        } else {
            return null
        }
    }
}
