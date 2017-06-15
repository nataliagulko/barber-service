package com.h2osis.utils

import grails.test.mixin.TestMixin
import grails.test.mixin.support.GrailsUnitTestMixin
import h2osis.barber.sms.SMSSender

/**
 * Created by esokolov on 07.11.2016.
 */
@TestMixin(GrailsUnitTestMixin)
class SMSSenderSpec {

    void "test"() {

        SMSSender sender = new SMSSender()

        //sender.send_sms("89818135783", "test", 0, "", "", 0, "", "maxsms=3");

    }
}
