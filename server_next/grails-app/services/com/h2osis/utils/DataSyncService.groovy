package com.h2osis.utils

import com.h2osis.auth.User
import com.h2osis.model.Holiday
import com.h2osis.model.Ticket
import com.h2osis.sm.SMObjectState
import grails.transaction.Transactional
import org.joda.time.DateTime

@Transactional
class DataSyncService {

    SlotsService slotsService

    def syncMaxTimes(User master, int daysCount) {

        String masterTZ = master.masterTZAct
        DateTime masterCurrentDate = new DateTime()
        masterCurrentDate = slotsService.changeTimeZone(masterCurrentDate, masterTZ)

        Holiday.deleteAll(Holiday.findAllByDateTo(masterCurrentDate.minusDays(1).toDate()))

        Holiday.withTransaction {
            for (int i = 0; i < daysCount; i++) {
                DateTime checkDate = masterCurrentDate.plusDays(i)
                if (Holiday.countByDateToAndDateFromAndMaster(
                        checkDate.withHourOfDay(23).withMinuteOfHour(59).withSecondOfMinute(59).toDate(),
                        checkDate.withHourOfDay(0).withMinuteOfHour(0).withSecondOfMinute(0).toDate(),
                        master) == 0)
                    slotsService.syncFullDays(master.id, 1L, checkDate
                            .toLocalDate(), null)
            }
        }
    }

    def deleteOldSM(User master) {
        String masterTZ = master.masterTZAct
        DateTime masterCurrentDate = new DateTime()
        masterCurrentDate = slotsService.changeTimeZone(masterCurrentDate, masterTZ)
        List<Ticket> oldTickets = Ticket.findAllByMasterAndTicketDateLessThanAndTicketDateGreaterThan(master,
                masterCurrentDate.minusDays(1).toDate(), masterCurrentDate.minusDays(90).toDate())
        if(oldTickets) {
            SMObjectState.withTransaction {
                SMObjectState.deleteAll(SMObjectState.findAllByObjectIdInList(oldTickets.id))
            }
        }
    }

}
