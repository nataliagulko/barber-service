package com.h2osis.model.ajax

import com.h2osis.auth.Role
import com.h2osis.auth.User
import com.h2osis.constant.AuthKeys
import com.h2osis.model.Business
import com.h2osis.utils.SearchService
import grails.converters.JSON

class BusinessAjaxController {

    SearchService searchService
    def springSecurityService
    static allowedMethods = [choose: ['POST', 'GET']]

    def get() {
        def data = request.JSON.data
        if (data && data.id) {
            Business business = Business.get(data.id)
            if (business) {
                JSON.use('business') {
                    render([data: business] as JSON)
                }
            } else {
                render([msg: g.message(code: "business.get.user.not.found")] as JSON)
            }
        } else {
            render([msg: g.message(code: "business.get.id.null")] as JSON)
        }
    }

    def create() {
        def errors = []
        def data = request.JSON.data
        def attrs = data.attributes
        def relationships = data.relationships
        if (attrs.name && attrs.address && relationships.masters) {
            Business business = new Business()

            relationships.masters.data.id.each {
                business.addToMasters(User.get(new Long(it)))
            }

            business.name = attrs.name
            business.inn = attrs.inn
            business.description = attrs.description
            business.phone = attrs.phone
            business.address = attrs.address
            business.email = attrs.email
            business.mode = attrs.mode

            business.smsCentrLogin = attrs.smsCentrLogin
            business.smsCentrPass = attrs.smsCentrPass
            business.guid = UUID.randomUUID().toString()


            business.save(flush: true)
            JSON.use('business') {
                render([data: business] as JSON)
            }
        } else {
            errors.add([
                    "status": 422,
                    "detail": g.message(code: "business.create.params.null"),
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
        def data = request.JSON.data
        def attrs = data.attributes
        def principal = springSecurityService.principal
        User user = User.get(principal.id)
        Business business = Business.get(data.id)
        if (business && user.authorities.authority.contains(Role.findByAuthority(AuthKeys.MASTER).authority)) {
            if (attrs.name && attrs.address) {
                business.name = attrs.name
                business.inn = attrs.inn
                business.description = attrs.description
                business.phone = attrs.phone
                business.address = attrs.address
                business.email = attrs.email
                business.mode = attrs.mode

                business.smsCentrLogin = attrs.smsCentrLogin
                business.smsCentrPass = attrs.smsCentrPass

                business.save(flush: true)
                JSON.use('business') {
                    render([data: business] as JSON)
                }
            } else {
                errors.add([
                        "status": 422,
                        "detail": g.message(code: "business.update.params.null"),
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
                    "detail": g.message(code: "business.update.not.admin"),
                    "source": [
                            "pointer": "data"
                    ]
            ])
            response.status = 422
            render([errors: errors] as JSON)
        }
    }

    def destroy() {
        def errors = []
        def data = request.JSON.data
        if (data.id) {
            Business business = Business.get(data.id)
            if (business) {
                business.delete(flush: true)
                render([errors: []] as JSON)
            } else {
                errors.add([
                        "status": 422,
                        "detail": g.message(code: "user.get.user.not.found"),
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

    def find() {
        def errors = []
        def data = request.JSON.query
        if (data && data.value) {
            String value = data.value
            List<Business> businessList = Business.findAllByNameOrGuid(value, value)
            if (businessList) {
                JSON.use('business') {
                    render([data: businessList] as JSON)
                }
            } else {
                errors.add([
                        "status": 422,
                        "detail": g.message(code: "business.fine.not.found"),
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
                    "detail": g.message(code: "business.value.null"),
                    "source": [
                            "pointer": "data"
                    ]
            ])
            response.status = 422
            render([errors: errors] as JSON)
        }
    }

    def list() {
        def errors = []
        List<Business> businessList
        def data = request.JSON.query
        if (data && data.value) {
            String value = data.value
            businessList = Business.findAllByNameOrGuidOrPhone(value, value, value)
        } else {
            businessList = Business.all
        }

        if (businessList) {
            JSON.use('business') {
                render([data: businessList] as JSON)
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
    }
}
