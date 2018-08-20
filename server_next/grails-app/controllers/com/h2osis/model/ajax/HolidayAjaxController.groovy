package com.h2osis.model.ajax

import com.h2osis.auth.Role
import com.h2osis.auth.User
import com.h2osis.constant.AuthKeys
import com.h2osis.model.Holiday
import com.h2osis.model.Service
import com.h2osis.model.WorkTime
import com.h2osis.utils.NovaDateUtilService
import com.h2osis.utils.SearchService
import com.h2osis.utils.SlotsService
import grails.converters.JSON
import grails.transaction.Transactional
import org.joda.time.DateTime

class HolidayAjaxController {

    SearchService searchService
    def springSecurityService
    SlotsService slotsService
    NovaDateUtilService novaDateUtilService
    static allowedMethods = [choose: ['POST', 'GET']]

    def create() {
        def errors = []
        def principal = springSecurityService.principal
        User currentUser = User.get(principal.id)
        if (currentUser.authorities.authority.contains(Role.findByAuthority(AuthKeys.MASTER).authority)) {
            def data = request.JSON.data
            def attrs = data.attributes
            def master = data.relationships.master.data
            if (data.type && data.type == "holiday"
                    && data.relationships.master.data.id
                    && attrs.dateFrom
                    && attrs.dateTo) {
                Holiday holiday = new Holiday()
                holiday.setComment(attrs.comment)
                User user = User.get(master.id)
                if (user) {
                    DateTime dateFrom = novaDateUtilService.getMasterTZDateTimeDDMMYYYY(attrs.dateFrom, user)
                    DateTime dateTo = novaDateUtilService.getMasterTZDateTimeDDMMYYYY(attrs.dateTo, user)
                    holiday.setDateFrom(dateFrom.toDate())
                    holiday.setDateTo(dateTo.toDate())
                    holiday.setMaster(user)
                    holiday.save(flush: true)
                    JSON.use('holidays') {
                        render([data: holiday] as JSON)
                    }
                } else {
                    errors.add([
                            "status": 422,
                            "detail": g.message(code: "holiday.params.master.not.found"),
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
                        "detail": g.message(code: "holiday.params.null"),
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

    def get(params) {
        def errors = []
        def data = params
        if (data.id) {
            Holiday holiday = Holiday.get(data.id)
            if (holiday) {
                JSON.use('holidays') {
                    render([data: holiday] as JSON)
                }
            } else {
                errors.add([
                        "status": 422,
                        "detail": g.message(code: "holiday.not.found"),
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

    def update() {
        def errors = []
        def principal = springSecurityService.principal
        User currentUser = User.get(principal.id)
        if (currentUser.authorities.authority.contains(Role.findByAuthority(AuthKeys.MASTER).authority)) {
            def data = request.JSON.data
            def attrs = data.attributes
            def master = data.relationships.master.data
            if (data.type && data.type == "holiday"
                    && data.id) {
                Holiday holiday = Holiday.get(data.id)
                holiday.setComment(attrs.comment)
                User user = User.get(master.id)
                if (user) {
                    DateTime dateFrom = novaDateUtilService.getMasterTZDateTimeDDMMYYYY(attrs.dateFrom, user)
                    DateTime dateTo = novaDateUtilService.getMasterTZDateTimeDDMMYYYY(attrs.dateTo, user)
                    holiday.setDateFrom(dateFrom.toDate())
                    holiday.setDateTo(dateTo.toDate())
                    holiday.setMaster(user)
                }
                holiday.save(flush: true)
                // Service.search().createIndexAndWait()
                JSON.use('holidays') {
                    render([data: holiday] as JSON)
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
            errors.add([
                    "status": 422,
                    "detail": g.message(code: "holiday.create.only.admin"),
                    "source": [
                            "pointer": "data"
                    ]
            ])
            response.status = 422
            render([errors: errors] as JSON)
        }
    }

    def find(params) {
        def errors = []
        if (params.value) {
            String value = params.value
            List<Holiday> listOfHoliday = Holiday.findAllByComment(value)
            if (listOfHoliday) {
                JSON.use('holidays') {
                    render([data: listOfHoliday] as JSON)
                }
            } else {
                errors.add([
                        "status": 422,
                        "detail": g.message(code: "user.fine.not.found"),
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
                    "detail": g.message(code: "find.value.null"),
                    "source": [
                            "pointer": "data"
                    ]
            ])
            response.status = 422
            render([errors: errors] as JSON)
        }
    }

    def list(params) {
        def query = params
        if (query) {
            User user = User.get(query.masterId)
            if (user) {
                Set<WorkTime> workTimes = WorkTime.findAllByMaster(user)
                Set<Integer> workDays = new HashSet<Integer>()
                workTimes?.each {
                    workDays.add(it.dayOfWeek)
                }
                Set<Integer> nonWorkDays = workDays ? [0, 1, 2, 3, 4, 5, 6].minus(workDays) : [0, 1, 2, 3, 4, 5, 6]
                nonWorkDays.each { it++ }

                DateTime dateTimeCurrent = novaDateUtilService.getMasterTZDateTime(new DateTime(), user)
                List<Holiday> holidays
                if(params.showOnlyHolidays){
                    holidays  =
                            Holiday.findAllByMasterAndCommentNotEqualAndDateToGreaterThanAndCommentNotEqual(
                                    user, "maxTime", dateTimeCurrent, 'fullday', [sort: 'dateFrom'])
                                    ?.sort { a, b -> a.dateFrom <=> b.dateFrom }
                } else {
                    holidays  =
                    Holiday.findAllByMasterAndCommentNotEqualAndDateToGreaterThan(user, "maxTime", dateTimeCurrent, [sort: 'dateFrom'])?.plus(
                            Holiday.findAllByMasterAndCommentAndMaxTimeLessThanAndDateToGreaterThan(user,
                                    "maxTime", query.time ? query.time : slotsService.getDuration(1L),
                                    dateTimeCurrent,
                                    [sort: 'dateFrom']))?.sort { a, b -> a.dateFrom <=> b.dateFrom }
                }
                holidays?.each {
                    it.master.setPassword(null)
                }
                JSON.use('holidays') {
                    render([data: holidays] as JSON)
                }
            } else {
                errors.add([
                        "status": 422,
                        "detail": g.message(code: "holiday.not.found"),
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
                    "detail": g.message(code: "user.get.id.null"),
                    "source": [
                            "pointer": "data"
                    ]
            ])
            response.status = 422
            render([errors: errors] as JSON)
        }
    }

    @Transactional
    def destroy(params) {
        def errors = []
        def data = params
        if (data.id) {
            Holiday holiday = Holiday.get(data.id)
            if (holiday) {
                holiday.delete(flush: true)
                render([errors: []] as JSON)
            } else {
                errors.add([
                        "status": 422,
                        "detail": g.message(code: "holiday.not.found"),
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
                    "detail": g.message(code: "holiday.not.found"),
                    "source": [
                            "pointer": "data"
                    ]
            ])
            response.status = 422
            render([errors: errors] as JSON)
        }
    }
}
