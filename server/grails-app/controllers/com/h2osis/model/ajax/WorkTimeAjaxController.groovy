package com.h2osis.model.ajax

import com.h2osis.auth.Role
import com.h2osis.auth.User
import com.h2osis.constant.AuthKeys
import com.h2osis.model.Holiday
import com.h2osis.model.Service
import com.h2osis.model.WorkTime
import com.h2osis.utils.SlotsService
import grails.converters.JSON
import grails.transaction.Transactional
import org.joda.time.LocalDate

class WorkTimeAjaxController {

    def springSecurityService
    SlotsService slotsService
    static allowedMethods = [choose: ['POST', 'GET']]

    def update() {
        def errors = []
        def principal = springSecurityService.principal
        User currentUser = User.get(principal.id)
        if (currentUser.authorities.contains(Role.findByAuthority(AuthKeys.ADMIN))) {
            def data = request.JSON.data
            def attrs = data.attributes
            def master = data.relationships.master.data
            if (data.type && data.type == "workTime"
                    && data.id) {
                WorkTime workTime = WorkTime.get(data.id)
                workTime.setTimeFrom(attrs.timeFrom)
                workTime.setTimeTo(attrs.timeTo)
                workTime.setDayOfWeek(attrs.dayOfWeek instanceof String ? Integer.parseInt(attrs.dayOfWeek) : attrs.dayOfWeek)
                User user = User.get(master.id)
                if (user) {
                    workTime.setMaster(user)
                    workTime.save(flush: true)
                    Service.search().createIndexAndWait()
                    JSON.use('worktimes') {
                        render([data: workTime] as JSON)
                    }
                }
            } else {
                errors.add([
                        "status": 422,
                        "detail": g.message(code: "params.id.null"),
                        "source": [
                                "pointer": "data"
                        ]
                ])
                response.status = 422
                render([errors: errors] as JSON)
            }
        } else {
            render([errors: g.message(code: "holiday.create.only.admin")] as JSON)
        }
    }

    def get() {
        def errors = []
        def data = request.JSON.data
        if (data.id) {
            WorkTime workTime = WorkTime.get(data.id)
            if (workTime) {
                JSON.use('worktimes') {
                    render([data: workTime] as JSON)
                }
            } else {
                errors.add([
                        "status": 422,
                        "detail": g.message(code: "workTime.not.found"),
                        "source": [
                                "pointer": "data"
                        ]
                ])
                response.status = 422
                render([errors: errors] as JSON)
            }
        } else {
            errors.add([
                    "status": 422,
                    "detail": g.message(code: "params.id.null"),
                    "source": [
                            "pointer": "data"
                    ]
            ])
            response.status = 422
            render([errors: errors] as JSON)
        }
    }

    def create() {
        def errors = []
        def principal = springSecurityService.principal
        User currentUser = User.get(principal.id)
        if (currentUser.authorities.contains(Role.findByAuthority(AuthKeys.ADMIN))) {
            def data = request.JSON.data
            def attrs = data.attributes
            def master = data.relationships.master.data
            if (data.type && data.type == "workTime"
                    && data.relationships.master.data.id
                    && attrs.timeFrom
                    && attrs.timeTo
                    && attrs.dayOfWeek) {
                WorkTime workTime = new WorkTime()
                workTime.setTimeFrom(attrs.timeFrom)
                workTime.setTimeTo(attrs.timeTo)
                workTime.setDayOfWeek(attrs.dayOfWeek instanceof String ? Integer.parseInt(attrs.dayOfWeek) : attrs.dayOfWeek)
                User user = User.get(master.id)
                if (user) {
                    workTime.setMaster(user)
                    workTime.save(flush: true)
                    Service.search().createIndexAndWait()
                    JSON.use('worktimes') {
                        render([data: workTime] as JSON)
                    }
                } else {
                    errors.add([
                            "status": 422,
                            "detail": g.message(code: "workTime.params.master.not.found"),
                            "source": [
                                    "pointer": "data"
                            ]
                    ])
                    response.status = 422
                    render([errors: errors] as JSON)
                }
            } else {
                errors.add([
                        "status": 422,
                        "detail": g.message(code: "workTime.params.null"),
                        "source": [
                                "pointer": "data"
                        ]
                ])
                response.status = 422
                render([errors: errors] as JSON)
            }
        } else {
            render([errors: g.message(code: "workTime.create.only.admin")] as JSON)
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
                    new LocalDate(params.getDate("date", "dd.MM.yyyy").time), params.currentId ? Long.parseLong(params.currentId) : null)
            render(response as JSON)
        } else {
            render([msg: g.message(code: "slots.not.found")] as JSON)
        }
    }

    def getSlotsInvert() {
        def data = request.JSON.query
        if (data.time && data.date && data.id) {
            User master = User.get(data.id)
            List<Map<String, String>> response = slotsService.getSlotsInvert(master.id, data.getLong("time"),
                    new LocalDate(Date.parse("dd.MM.yyyy", data.date).time), data.currentId ? Long.parseLong(data.currentId) : null)
            // render(response as JSON)
            JSON.use('workTimes') {
                render([data: response] as JSON)
            }
        } else {
            render([msg: g.message(code: "slots.not.found")] as JSON)
        }
    }

    @Transactional
    def destroy() {
        def data = request.JSON.data
        if (data.id) {
            WorkTime workTime = WorkTime.get(data.id)
            if (workTime) {
                workTime.delete(flush: true)
                render([errors: []] as JSON)

            } else {
                render([errors: { g.message(code: "workTime.not.found") }] as JSON)
            }
        } else {
            render([errors: { g.message(code: "workTime.not.found") }] as JSON)
        }
    }

    def list() {
        def data = request.JSON.data
        def query = request.JSON.query
        if (query) {
            User user = User.get(query.masterId)
            if (user) {
                Set<WorkTime> workTimes = WorkTime.findAllByMaster(user)
                JSON.use('worktimes') {
                    render([data: workTimes] as JSON)
                }
            } else {
                render([msg: g.message(code: "user.get.user.not.found")] as JSON)
            }
        } else {
            render([msg: g.message(code: "user.get.id.null")] as JSON)
        }
    }
}
