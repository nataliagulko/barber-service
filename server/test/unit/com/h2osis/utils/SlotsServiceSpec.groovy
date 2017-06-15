package com.h2osis.utils

import com.h2osis.auth.User
import com.h2osis.model.Ticket
import com.h2osis.model.WorkTime
import grails.test.mixin.Mock
import grails.test.mixin.TestFor
import grails.test.mixin.TestMixin
import grails.test.mixin.support.GrailsUnitTestMixin
import org.joda.time.LocalDate
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.support.GrailsUnitTestMixin} for usage instructions
 */
@TestMixin(GrailsUnitTestMixin)
@TestFor(SlotsService)
@Mock([User, WorkTime, Ticket, SlotsService])
class SlotsServiceSpec extends Specification {

    //SlotsService slotsService

    def setup() {
        User testMaster = new User(username: "master", password: "123", email: "sokolovep@gmail.com", fio: "fio", phone: "+7 (912)114-79-90").save(flush: true)
        WorkTime wt1 = new WorkTime(timeFrom: '10:00', timeTo: '18:00', dayOfWeek: 0)
        wt1.setMaster(User.findByUsername('master'))
        wt1.save(flush: true)
        WorkTime wt2 = new WorkTime(timeFrom: '10:00', timeTo: '18:00', dayOfWeek: 1)
        wt2.setMaster(User.findByUsername('master'))
        wt2.save(flush: true)
        WorkTime wt3 = new WorkTime(timeFrom: '10:00', timeTo: '18:00', dayOfWeek: 2)
        wt3.setMaster(User.findByUsername('master'))
        wt3.save(flush: true)
        WorkTime wt4 = new WorkTime(timeFrom: '10:00', timeTo: '18:00', dayOfWeek: 3)
        wt4.setMaster(User.findByUsername('master'))
        wt4.save(flush: true)
        WorkTime wt5 = new WorkTime(timeFrom: '10:00', timeTo: '18:00', dayOfWeek: 4)
        wt5.setMaster(User.findByUsername('master'))
        wt5.save(flush: true)
        WorkTime wt6 = new WorkTime(timeFrom: '10:00', timeTo: '18:00', dayOfWeek: 5)
        wt6.setMaster(User.findByUsername('master'))
        wt6.save(flush: true)
        WorkTime wt7 = new WorkTime(timeFrom: '10:00', timeTo: '18:00', dayOfWeek: 6)
        wt7.setMaster(User.findByUsername('master'))
        wt7.save(flush: true)
        new Ticket(user: User.findByUsername('master'), master: User.findByUsername('master'),
                ticketDate: new LocalDate().withYear(2016).withMonthOfYear(9).withDayOfMonth(7).toDate(),
                time: "14:50", status: "NEW").save(flush: true, validate: false)
    }


    def cleanup() {
        User.deleteAll(User.all)
        WorkTime.deleteAll(WorkTime.all)
    }

    void "test"() {
        LocalDate date = new LocalDate().withYear(2016).withMonthOfYear(9).withDayOfMonth(7)
        def res = service.getSlots(User.findByUsername("master").id, 40, date, null)
        expect:
        res == [["start":"2016-09-07 10:00:00", "end":"2016-09-07 17:20:00"]]
    }
}
