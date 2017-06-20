package com.h2osis.model.ajax

import com.h2osis.auth.Role
import com.h2osis.auth.User
import com.h2osis.constant.AuthKeys
import com.h2osis.model.WorkTime
import com.h2osis.utils.SearchService
import com.h2osis.utils.SlotsService
import grails.converters.JSON
import org.joda.time.LocalDate

class WorkTimeAjaxController {

    SearchService searchService
    def springSecurityService
    SlotsService slotsService
    static allowedMethods = [choose: ['POST', 'GET']]

    def get() {
        if (params.id) {
            WorkTime workTime = WorkTime.get(params.id)
            if (workTime) {
                render(workTime as JSON)
            } else {
                render([msg: g.message(code: "service.get.user.not.found")] as JSON)
            }
        } else {
            render([msg: g.message(code: "service.get.id.null")] as JSON)
        }
    }

    def create() {
        def principal = springSecurityService.principal
        User user = User.get(principal.id)
        if (user.authorities.contains(Role.findByAuthority(AuthKeys.ADMIN))) {
            if (params.timeTo && params.timeFrom && params.dayOfWeek) {
                WorkTime workTime = new WorkTime(timeTo: params.timeTo, timeFrom: params.timeFrom, dayOfWeek: params.dayOfWeek)
                workTime.save(flush: true)
                render(workTime as JSON)
            } else {
                render([msg: g.message(code: "worktime.create.params.null")] as JSON)
            }
        } else {
            render([msg: g.message(code: "worktime.create.not.admin")] as JSON)
        }
    }

    def delete() {
        def principal = springSecurityService.principal
        User user = User.get(principal.id)
        if (user.authorities.contains(Role.findByAuthority(AuthKeys.ADMIN))) {
            if (params.id) {
                WorkTime workTime = WorkTime.get(params.id)
                if (workTime) {
                    workTime.delete(flush: true)
                    render([code: 0] as JSON)
                } else {
                    render([msg: g.message(code: "worktime.get.user.not.found")] as JSON)
                }
            } else {
                render([msg: g.message(code: "worktime.get.id.null")] as JSON)
            }
        } else {
            render([msg: g.message(code: "worktime.delete.not.admin")] as JSON)
        }
    }

    def getSlots() {
        if (params.time && params.date && params.id) {
            User master = User.get(params.id)
            List<Map<String, String>> response = slotsService.getSlots(master.id, params.getLong("time"),
                    new LocalDate(params.getDate("date", "dd.MM.yyyy").time), params.currentId?Long.parseLong(params.currentId):null)
            render(response as JSON)
        } else {
            render([msg: g.message(code: "slots.not.found")] as JSON)
        }
    }

    def getSlotsInvert() {
        if (params.time && params.date && params.id) {
            User master = User.get(params.id)
            List<Map<String, String>> response = slotsService.getSlotsInvert(master.id, params.getLong("time"),
                    new LocalDate(params.getDate("date", "dd.MM.yyyy").time), params.currentId?Long.parseLong(params.currentId):null)
            render(response as JSON)
        } else {
            render([msg: g.message(code: "slots.not.found")] as JSON)
        }
    }
}
