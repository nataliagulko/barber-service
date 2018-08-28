package com.h2osis.model

import com.h2osis.auth.Role
import com.h2osis.auth.User
import com.h2osis.auth.UserRole
import constant.AuthKeys
import com.h2osis.utils.BarberSecurityService
import grails.transaction.Transactional


@Transactional
class UsersService {

    def messageSource

    BarberSecurityService barberSecurityService

    def createUser(def params, def relationships) {

        if(!params.password && !params.rpassword){
            params.password = barberSecurityService.generator((('0'..'9')).join(), 6)
        }

        if (params.phone == null || params.phone == "") {
            return messageSource.getMessage("user.phone.null", null,  Locale.default)
        } else if (!User.findByPhone(params.phone)) {
            User user = new User(username: params.login,
                    password: params.password,
                    email: params.email,
                    secondname: params.secondname,
                    firstname: params.firstname,
                    phone: params.phone,
                    guid: UUID.randomUUID().toString(),
                    enabled: params.enabled ? params.enabled : true).save(flush: true)
            if (relationships && relationships.business.data.id) {
                Business business = Business.get(relationships.business.data.id)
                if (business) {
                    if (params.type == "master") {
                        business.addToMasters(user)
                    } else {
                        business.addToClients(user)
                    }
                    business.save(flush: true)
                }
            }
            String authority = params.type == "master" ? AuthKeys.MASTER : (params.type == "client"  ? AuthKeys.CLIENT : null)
            if (authority) {
                Role role = Role.findByAuthority(authority)
                new UserRole(user: user, role: role).save(flush: true);
            }
            return user
        } else {
            return messageSource.getMessage("user.double.phone", null, Locale.default)
        }
    }

    def saveUser(def params, User user) {
        if (params.firstname) {
            user.setFirstname(params.firstname)
        }
        if (params.secondname) {
            user.setSecondname(params.secondname)
        }
        if (params.worktimes) {
            List<Long> workTimesIds = new ArrayList<Long>()
            params.worktimes.split(",").each {
                workTimesIds.add(Long.parseLong(it))
            }
            Set<WorkTime> workTimes = WorkTime.findAllByIdInList(workTimesIds)
            if (workTimes) {
                Set<WorkTime> oldWorkTimes = WorkTime.findAllByMaster(user)
                if (oldWorkTimes) {
                    oldWorkTimes.each {
                        it.setMaster(null)
                        it.save(flush: true)
                    }
                }
                workTimes.each {
                    it.setMaster(user)
                    it.save(flush: true)
                }
            }
        }

        if (params.holidays) {
            List<Long> holidaysIds = new ArrayList<Long>()
            params.holidays.split(",").each {
                holidaysIds.add(Long.parseLong(it))
            }
            Set<Holiday> holidays = Holiday.findAllByIdInList(holidaysIds)
            if (holidays) {
                Set<Holiday> oldholidays = Holiday.findAllByMaster(user)
                if (oldholidays) {
                    oldholidays.each {
                        it.setMaster(null)
                        it.save(flush: true)
                    }
                }
                holidays.each {
                    it.setMaster(user)
                    it.save(flush: true)
                }
            }
        }

        if (params.businessId) {
            Business business = Business.get(params.businessId)
            if (business) {
                Business.findAllByMasters([user])?.each {
                    it.removeFromMasters(user)
                }
                business.addToMasters(user)
                business.save(flush: true)
            }
        }
        if (params.firstname || params.secondname) {
            user.save(flush: true)
        }
    }
}
