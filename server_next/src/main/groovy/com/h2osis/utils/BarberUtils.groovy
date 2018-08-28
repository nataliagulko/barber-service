package com.h2osis.utils

import constant.AuthKeys
import grails.plugin.springsecurity.SpringSecurityUtils

/**
 * Created by esokolov on 21.03.2017.
 */
class BarberUtils {

    static def masterUrl = "/ticket/"
    static def userUrl = "/main/"

   static String determRedirectUrl() {

        boolean hasMaster = SpringSecurityUtils.ifAllGranted(AuthKeys.MASTER) || SpringSecurityUtils.ifAllGranted(AuthKeys.SUPER_MASTER)
        boolean hasClient= SpringSecurityUtils.ifAllGranted(AuthKeys.CLIENT)

        if (hasMaster) {
            return masterUrl;
        } else if (hasClient) {
            return userUrl
        } else {
            return null
        }
    }
}
