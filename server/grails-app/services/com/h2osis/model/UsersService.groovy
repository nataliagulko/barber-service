package com.h2osis.model

import com.h2osis.auth.Role
import com.h2osis.auth.User
import com.h2osis.auth.UserRole
import com.h2osis.constant.AuthKeys
import grails.transaction.Transactional


@Transactional
class UsersService {

    def messageSource

    def createUser(def params) {

        if (params.password == null || params.phone == null || params.phone == "") {
            return messageSource.getMessage("user.phone.and.pass.null", Locale.default)
        } else if (!User.findByPhone(params.phone)) {
            User user = new User(username: params.login,
                    password: params.password,
                    email: params.email,
                    secondname: params.secondname,
                    firstname: params.firstname,
                    phone: params.phone).save(flush: true)
            if (params.businessId) {
                Business business = Business.get(params.businessId)
                if (business) {
                    if (params.userRole) {
                        business.addToClients(user)
                    } else if (params.masterRole) {
                        business.addToMasters(user)
                    }
                    business.save(flush: true)
                }
            }
            String authority = params.masterRole ? AuthKeys.ADMIN : (params.userRole ? AuthKeys.USER : null)
            if (authority) {
                Role role = Role.findByAuthority(authority)
                new UserRole(user: user, role: role).save(flush: true);
            }
            User.search().createIndexAndWait()
        } else {
            return messageSource.getMessage("user.double.phone", Locale.default)
        }
    }
}
