package com.h2osis.sm

import com.h2osis.auth.User
import com.h2osis.constant.TicketStatus
import com.h2osis.model.Ticket
import grails.test.mixin.Mock
import grails.test.mixin.TestFor
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.services.ServiceUnitTestMixin} for usage instructions
 */
@TestFor(SMManagerService)
@Mock([Ticket, SMObjectState, SMTransition, User, SMManagerService])
class SMManagerServiceSpec extends Specification {

    def setup() {
        new SMTransition(objectType: SMObjectType.ticket, stateFrom: TicketStatus.NEW, stateTo: TicketStatus.ACCEPTED).save(flush: true)
        new SMTransition(objectType: SMObjectType.ticket, stateFrom: TicketStatus.ACCEPTED, stateTo: TicketStatus.COMPLETED).save(flush: true)
        new SMTransition(objectType: SMObjectType.ticket, stateFrom: TicketStatus.NEW, stateTo: TicketStatus.REJECTED).save(flush: true)
        new User(username: "master", password: "123", email: "sokolovep@gmail.com", fio: "fio", phone: "+7 (912)114-79-90").save(flush: true)
    }

    def cleanup() {
    }

    void "SMTest1"() {
        service.transObject(SMObjectType.ticket, 1L, TicketStatus.NEW)

        expect:
        service.isAbleTrans(SMObjectType.ticket, TicketStatus.NEW, TicketStatus.ACCEPTED) == true

    }

    void "SMTest2"() {
        service.transObject(SMObjectType.ticket, 1L, TicketStatus.NEW)
        service.transObject(SMObjectType.ticket, 2L, TicketStatus.ACCEPTED)

        expect:
        service.getObjectTransitions(SMObjectType.ticket, 1L)?.stateTo.contains(TicketStatus.ACCEPTED)
        service.getObjectTransitions(SMObjectType.ticket, 1L)?.stateTo.contains(TicketStatus.REJECTED)
        service.getObjectTransitions(SMObjectType.ticket, 2L)?.stateTo.contains(TicketStatus.COMPLETED)
        !service.getObjectTransitions(SMObjectType.ticket, 2L)?.stateTo?.contains(TicketStatus.REJECTED)
    }
}
