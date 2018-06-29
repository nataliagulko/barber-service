package com.h2osis.model.ajax

import com.h2osis.auth.User
import com.h2osis.utils.SlotsService
import grails.converters.JSON
import java.util.Date
import org.joda.time.LocalDate

class SlotAjaxController {

    def springSecurityService
    SlotsService slotsService
    static allowedMethods = [choose: ['POST', 'GET']]

    def list(params) {
        def data = params
        if (data.time && data.slotDate && data.masterId) {
            User master = User.get(data.masterId)
            List<Map<String, String>> response = slotsService.getSlotsInvert(master.id, data.getLong("time"),
                    new LocalDate(Date.parse("dd.MM.yyyy", data.slotDate).time), data.currentId ? Long.parseLong(data.currentId) : null)
            JSON.use('slots') {
                render([data: slotsService.getSlotDomains(response, master, params.getDate("date", "dd.MM.yyyy"))] as JSON)
            }
        } else {
            render([msg: g.message(code: "slots.not.found")] as JSON)
        }
    }
}
