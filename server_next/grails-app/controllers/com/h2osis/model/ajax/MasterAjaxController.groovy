package com.h2osis.model.ajax

import com.h2osis.auth.Role
import com.h2osis.auth.User
import com.h2osis.auth.UserRole
import com.h2osis.constant.AuthKeys
import com.h2osis.constant.TicketStatus
import com.h2osis.model.*
import com.h2osis.utils.BarberSecurityService
import com.h2osis.utils.NovaDateUtilService
import com.h2osis.utils.NovaUtilsService
import com.h2osis.utils.SearchService
import grails.converters.JSON
import grails.transaction.Transactional

class MasterAjaxController {

    SearchService searchService
    def springSecurityService
    BarberSecurityService barberSecurityService
    UsersService usersService
    NovaUtilsService novaUtilsService
    NovaDateUtilService novaDateUtilService
    static allowedMethods = [choose: ['POST', 'GET']]

    def create() {
        def errors = []
        def data = request.JSON.data
        def attrs = data.attributes
        if (attrs.phone && ((attrs.password && attrs.rpassword) || (attrs.password && !attrs.rpassword) || (!attrs.password && !attrs.rpassword))) {
            if (attrs.password.equals(attrs.rpassword) || (attrs.password && !attrs.rpassword) || (!attrs.password && !attrs.rpassword)) {
                def result = usersService.createUser(attrs)
                if (result instanceof User) {
                    //result.setPassword(null)
                    Role role = Role.findByAuthority(AuthKeys.MASTER)
                    new UserRole(user: result, role: role).save(flush: true);
                    JSON.use('masters') {
                        render([data: result] as JSON)
                    }
                } else {
                    render([errors: { result }] as JSON)
                }
            } else {
                errors.add([
                        "status": 422,
                        "detail": g.message(code: "auth.reg.pass2.fail"),
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
                    "detail": g.message(code: "user.phone.and.pass.null"),
                    "source": [
                            "pointer": "data"
                    ]
            ])
            response.status = 422
            render([errors: errors] as JSON)
        }
    }

    def get(params) {
		def data = params
        if (data && data.id) {
            User user = User.get(data.id)
            if (user) {
                user.setPassword(null)
                //render([user: user, holidays: Holiday.findAllByMaster(user), worktTmesMap: worktTmesMap] as JSON)
                JSON.use('masters') {
                    render([data: user] as JSON)
                }
            } else {
                render([errors: { g.message(code: "user.get.user.not.found") }] as JSON)
            }
        } else {
            def query = request.JSON.query
            if (query && query.phone) {
                User user = User.findByPhone(query.phone)
                if (!user) {
                    user = User.findByPhone(novaUtilsService.getFullPhone(query.phone))
                }
                if (user) {
                    user.setPassword(null)
                    JSON.use('clients') {
                        render([data: user] as JSON)
                    }
                } else {
                    render([errors:
                                    novaUtilsService.getErrorsSingleArrayJSON(g.message(code: "user.get.user.by.phone.not.found"))] as JSON)
                }
            } else {
                render([errors: novaUtilsService.getErrorsSingleArrayJSON(g.message(code: "user.get.id.null"))] as JSON)
            }
        }
    }

    def update() {
        def data = request.JSON.data
        if (data.id) {
            User user = User.get(data.id)
            if (user) {
                usersService.saveUser(data.attributes, user)
                JSON.use('masters') {
                    render([data: user] as JSON)
                }
            } else {
                render([errors: { g.message(code: "user.get.user.not.found") }] as JSON)
            }
        } else {
            render([errors: { g.message(code: "user.get.id.null") }] as JSON)
        }
    }

    def find() {
        if (params.value) {
            String value = params.value
            List<User> listOfUsers = searchService.userSearch(value)
            if (listOfUsers) {
                listOfUsers.each { it -> it.setPassword(null) }
                render(listOfUsers as JSON)
            } else {
                render([msg: g.message(code: "user.fine.not.found")] as JSON)
            }
        } else {
            render([msg: g.message(code: "find.value.null")] as JSON)
        }
    }

    def block() {
        def principal = springSecurityService.principal
        User user = User.get(principal.id)
        if (user.authorities.authority.contains(Role.findByAuthority(AuthKeys.MASTER).authority)) {
            if (params.id) {
                User blockingUser = User.get(params.id)
                if (blockingUser) {
                    blockingUser.setEnabled(false)
                    blockingUser.setAccountLocked(true)
                    blockingUser.save(flush: true)
                    render([code: 0] as JSON)
                } else {
                    render([msg: g.message(code: "user.get.user.not.found")] as JSON)
                }
            } else {
                render([msg: g.message(code: "user.get.id.null")] as JSON)
            }
        } else {
            render([msg: g.message(code: "user.block.not.admin")] as JSON)
        }
    }

    def getWorktimes() {
        if (params.id) {
            User user = User.get(params.id)
            if (user) {
                user.setPassword(null)
                List<WorkTime> workTimes = WorkTime.findAllByMaster(user)
                Map<Integer, List<WorkTime>> worktTmesMap = new HashMap<Integer, List<WorkTime>>()
                if (workTimes) {
                    workTimes.each {
                        if (!worktTmesMap.get(it.dayOfWeek)) {
                            worktTmesMap.put(it.dayOfWeek, new ArrayList<WorkTime>())
                        }
                        worktTmesMap.get(it.dayOfWeek).add(it)
                    }
                }
                worktTmesMap.each {
                    it.value = it.value.sort {
                        it.timeFrom
                    }
                }
                render(view: "/user/worktime", model: [worktTmesMap: worktTmesMap])
            } else {
                render([msg: g.message(code: "user.get.user.not.found")] as JSON)
            }
        } else {
            render([msg: g.message(code: "user.get.id.null")] as JSON)
        }
    }

    def getHolidays() {
        if (params.id) {
            User user = User.get(params.id)
            if (user) {
                user.setPassword(null)
                render(view: "/user/holidays", model: [holidays: Holiday.findAllByMaster(user, [sort: 'dateFrom'])])
            } else {
                render([msg: g.message(code: "user.get.user.not.found")] as JSON)
            }
        } else {
            render([msg: g.message(code: "user.get.id.null")] as JSON)
        }
    }

    def getHolidaysJson() {
        if (params.id) {
            User user = User.get(params.id)
            if (user) {
                Set<WorkTime> workTimes = WorkTime.findAllByMaster(user)
                Set<Integer> workDays = new HashSet<Integer>()
                workTimes?.each {
                    workDays.add(it.dayOfWeek)
                }
                Set<Integer> nonWorkDays = workDays ? [0, 1, 2, 3, 4, 5, 6].minus(workDays) : [0, 1, 2, 3, 4, 5, 6]
                nonWorkDays.each { it++ }

                List<Holiday> holidays =
                        Holiday.findAllByMasterAndCommentNotEqual(user, "maxTime", [sort: 'dateFrom'])?.plus(
                                Holiday.findAllByMasterAndCommentAndMaxTimeLessThan(user, "maxTime", params.time ? params.time : slotsService.getDuration(1L),
                                        [sort: 'dateFrom']))?.sort { a, b -> a.dateFrom <=> b.dateFrom }
                holidays?.each {
                    it.master.setPassword(null)
                }
                render([holidays: holidays, nonWorkDays: nonWorkDays] as JSON)
            } else {
                render([msg: g.message(code: "user.get.user.not.found")] as JSON)
            }
        } else {
            render([msg: g.message(code: "user.get.id.null")] as JSON)
        }
    }

    @Transactional
    def saveWorkTime() {
        WorkTime workTime = new WorkTime()

        if (params.id) {
            workTime = WorkTime.get(params.id)
        }

        if (params.dayOfWeek && params.timeFrom && params.timeTo && params.master) {
            workTime.setTimeFrom(params.timeFrom)
            workTime.setTimeTo(params.timeTo)
            workTime.setMaster(User.get(params.master))
            workTime.setDayOfWeek(Integer.parseInt(params.dayOfWeek))
            workTime.save(flush: true)
            render([id: workTime.id] as JSON)
        } else {
            render([msg: g.message(code: "workTime.params.null")] as JSON)
        }
    }

    @Transactional
    def saveHoliday() {
        Holiday holiday = new Holiday()

        if (params.id) {
            holiday = Holiday.get(params.id)
        }

        if (params.dateFrom && params.dateTo && params.master) {
            Date dateFrom = Date.parse('dd.MM.yyyy', params.dateFrom)
            Date dateTo = Date.parse('dd.MM.yyyy', params.dateTo)

            holiday.setMaster(User.get(params.master))
            holiday.setDateFrom(dateFrom)
            holiday.setDateTo(dateTo)
            holiday.setComment(params.comment)
            holiday.save(flush: true)
            render([id: holiday.id] as JSON)
        } else {
            render([msg: g.message(code: "holiday.params.null")] as JSON)
        }
    }

    @Transactional
    def deleteWorkTime() {
        if (params.id) {
            WorkTime workTime = WorkTime.get(params.id)
            if (workTime) {
                workTime.delete(flush: true)
            }
            render([code: 0] as JSON)
        } else {
            render([msg: g.message(code: "params.id.null")] as JSON)
        }
    }

    @Transactional
    def deleteHoliday() {
        if (params.id) {
            Holiday holiday = Holiday.get(params.id)
            if (holiday) {
                holiday.delete(flush: true)
            }
            render([code: 0] as JSON)
        } else {
            render([msg: g.message(code: "params.id.null")] as JSON)
        }
    }

    @Transactional
    def saveByPhone() {
        if (params.phone) {
            if (!User.findByPhone(params.phone)) {
                User user = new User()
                user.setPhone(params.phone)
                String pass = barberSecurityService.generator((('A'..'Z') + ('0'..'9') + ['!', '?']).join(), 6)
                user.setPassword(pass)
                user.save(flush: true)
                if (params.businessId) {
                    Business business = Business.get(params.businessId)
                    if (business) {

                        Business.findAllByMasters([user])?.each {
                            it.removeFromMasters(user)
                        }

                        Business.findAllByClients([user])?.each {
                            it.removeFromClients(user)
                        }

                        if (params.userRole) {
                            business.addToClients(user)
                        } else if (params.masterRole) {
                            business.addToMasters(user)
                        }
                        business.save(flush: true)

                    }
                }
                String authority = params.masterRole ? AuthKeys.MASTER : (params.userRole ? AuthKeys.CLIENT : null)
                if (authority) {
                    Role role = Role.findByAuthority(authority)
                    new UserRole(user: user, role: role).save(flush: true);
                }
                render([id: user.id] as JSON)
            } else {
                render([msg: g.message(code: "user.double.phone")] as JSON)
            }
        } else {
            render([msg: g.message(code: "user.phone.null")] as JSON)
        }
    }

    @Transactional
    def blockUser() {
        if (params.id) {
            def principal = springSecurityService.principal
            User master = User.get(principal.id)
            String authorities = springSecurityService?.authentication?.authorities?.toString()
            if (master && authorities.contains("ROLE_ADMIN")) {
                UserBlockFact userBlockFact = new UserBlockFact()
                userBlockFact.setComment(params.comment)
                userBlockFact.setMaster(master)
                User user = User.get(params.id)
                if (user && !UserBlockFact.findByMasterAndUser(master, user)) {
                    userBlockFact.setUser(User)
                    userBlockFact.save(flush: true)
                } else {
                    render([msg: g.message(code: "user.block.user.not.found")] as JSON)
                }
            } else {
                render([msg: g.message(code: "user.block.id.null")] as JSON)
            }
        } else {
            render([msg: g.message(code: "user.block.not.master")] as JSON)
        }
    }

    @Transactional
    def unBlockUser() {
        if (params.id) {
            def principal = springSecurityService.principal
            User master = User.get(principal.id)
            String authorities = springSecurityService?.authentication?.authorities?.toString()
            if (master && authorities.contains("ROLE_ADMIN")) {
                User user = User.get(params.id)
                UserBlockFact userBlockFact = UserBlockFact.findByMasterAndUser(master, user)
                if (user && userBlockFact) {
                    userBlockFact.delete(flush: true)
                } else {
                    render([msg: g.message(code: "user.block.user.not.found")] as JSON)
                }
            } else {
                render([msg: g.message(code: "user.block.id.null")] as JSON)
            }
        } else {
            render([msg: g.message(code: "user.block.not.master")] as JSON)
        }
    }

    def getOrgMasters() {
        def data = request.JSON.data
        def attrs = data.attributes
    }

    def list() {
        List<User> userList = UserRole.findAllByRole(Role.findByAuthority("ROLE_ADMIN")).user
        if (userList) {

            JSON.use('masters') {
                render([data: userList.findAll { it.enabled == true }] as JSON)
            }
        } else {
            render([errors: { g.message(code: "user.fine.not.found") }] as JSON)
        }
    }

    def destroy() {
        def data = request.JSON.data
        if (data.id) {
            User user = User.get(data.id)
            if (user) {
                user.setEnabled(false)
                user.save(flush: true)
                render([errors: []] as JSON)

            } else {
                render([errors: { g.message(code: "user.get.user.not.found") }] as JSON)
            }
        } else {
            render([errors: { g.message(code: "user.get.id.null") }] as JSON)
        }
    }

    def clientStatistic() {
        def data = request.JSON.query
        if (data.id) {
            User user = User.get(data.id)
            user = user == null ?
                    User.get(springSecurityService.principal.id) : user
            if (user) {
                def result = Ticket.executeQuery("select user from Ticket where master_id = $user and type = 'HEAD' group by user_id ")
                JSON.use('clients') {
                    if(data.noUserList){
                        render([cnt: result?.size()] as JSON)
                    }else {
                        render([data: result, cnt: result?.size()] as JSON)
                    }
                }
            } else {
                render([errors: { g.message(code: "user.get.user.not.found") }] as JSON)
            }
        } else {
            render([errors: { g.message(code: "user.get.id.null") }] as JSON)
        }
    }

    def payStatistic(){
        def data = request.JSON.query
        if (data.id) {
            User user = User.get(data.id)
            user = user == null ?
                    User.get(springSecurityService.principal.id) : user
            if (user) {
                Date dateFrom = novaDateUtilService.getMasterTZDateTimeDDMMYYYY(data.dateFrom, user).toDate()
                Date dateTo = novaDateUtilService.getMasterTZDateTimeDDMMYYYY(data.dateTo, user).toDate()
                String ticketStatus = data.ticketStatus ? data.ticketStatus : TicketStatus.ACCEPTED
                def costAVG = Ticket.executeQuery("select avg(cost) from Ticket where master_id = $user and ticketDate between $dateFrom and $dateTo and status = $ticketStatus")
                def costSUMM = Ticket.executeQuery("select sum(cost) from Ticket where master_id = $user and ticketDate between $dateFrom and $dateTo and status = $ticketStatus")
                render([costAVG: costAVG?.get(0), costSUMM:costSUMM?.get(0)] as JSON)
            } else {
                render([errors: { g.message(code: "user.get.user.not.found") }] as JSON)
            }
        } else {
            render([errors: { g.message(code: "user.get.id.null") }] as JSON)
        }
    }


}
