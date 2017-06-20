package com.h2osis.model.ajax

import com.h2osis.auth.Role
import com.h2osis.auth.User
import com.h2osis.constant.AuthKeys
import com.h2osis.model.Business
import com.h2osis.model.Service
import com.h2osis.utils.SearchService
import grails.converters.JSON

class BusinessAjaxController {

    SearchService searchService
    def springSecurityService
    static allowedMethods = [choose: ['POST', 'GET']]

    def get() {
        if (params.id) {
            Business business = Business.get(params.id)
            if (business) {
                render(business as JSON)
            } else {
                render([msg: g.message(code: "business.get.user.not.found")] as JSON)
            }
        } else {
            render([msg: g.message(code: "business.get.id.null")] as JSON)
        }
    }

    def create() {
        def principal = springSecurityService.principal
        User user = User.get(principal.id)
        if (user.authorities.contains(Role.findByAuthority(AuthKeys.ADMIN))) {
            if (params.name && params.inn) {
                Business business = new Service(name: params.name, in: params.inn)
                business.save(flush: true)
                Business.search().createIndexAndWait()
                render(business as JSON)
            } else {
                render([msg: g.message(code: "business.create.params.null")] as JSON)
            }
        } else {
            render([msg: g.message(code: "business.create.not.admin")] as JSON)
        }
    }

    def delete() {
        def principal = springSecurityService.principal
        User user = User.get(principal.id)
        if (user.authorities.contains(Role.findByAuthority(AuthKeys.ADMIN))) {
            if (params.id) {
                Business business = Business.get(params.id)
                if (business) {
                    business.delete(flush: true)
                    Business.search().createIndexAndWait()
                    render([code: 0] as JSON)
                } else {
                    render([msg: g.message(code: "business.get.user.not.found")] as JSON)
                }
            } else {
                render([msg: g.message(code: "business.get.id.null")] as JSON)
            }
        } else {
            render([msg: g.message(code: "business.delete.not.admin")] as JSON)
        }
    }

    def find() {
        if (params.value) {
            String value = params.value
            List<Business> businessList = searchService.businessSearch(value)
            if (businessList) {
                render(businessList as JSON)
            } else {
                render([msg: g.message(code: "business.fine.not.found")] as JSON)
            }
        } else {
            render([msg: g.message(code: "business.value.null")] as JSON)
        }
    }


}
