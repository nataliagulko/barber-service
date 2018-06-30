package com.h2osis.model.ajax

import com.h2osis.model.Service
import com.h2osis.model.ServiceGroup
import com.h2osis.model.ServiceToGroup
import grails.converters.JSON
import grails.transaction.Transactional
import com.h2osis.auth.User
import com.h2osis.auth.Role
import com.h2osis.constant.AuthKeys


class ServiceToGroupAjaxController {

    static allowedMethods = [choose: ['POST', 'GET']]
    def springSecurityService

    def create() {
        def errors = []
        def principal = springSecurityService.principal
        User user = User.get(principal.id)
        if (user.authorities.authority.contains(Role.findByAuthority(AuthKeys.MASTER).authority)) {
            def data = request.JSON.data
            def attrs = data.attributes
            def relations = data.relationships
            if (data.type && data.type == "service-to-group") {
                ServiceToGroup serviceToGroup = new ServiceToGroup(serviceOrder: attrs.serviceOrder, serviceTimeout: attrs.serviceTimeout)
                Service service = Service.get(relations.service.data.id)
                ServiceGroup group = ServiceGroup.get(relations.serviceGroup.data.id)
                serviceToGroup.setService(service)
                serviceToGroup.setGroup(group)
                serviceToGroup.save(flush: true)
                JSON.use('serviceToGroups') {
                    render([data: serviceToGroup] as JSON)
                }
            } else {
                errors.add([
                        "status": 422,
                        "detail": g.message(code: "service.create.params.null"),
                        "source": [
                                "pointer": "data"
                        ]
                ])
                response.status = 422
                render([errors: errors] as JSON)
            }
        } else {
            render([errors: g.message(code: "service.create.not.admin")] as JSON)
        }
    }

    def update() {
        def errors = []
        def principal = springSecurityService.principal
        User user = User.get(principal.id)
        if (user.authorities.authority.contains(Role.findByAuthority(AuthKeys.MASTER).authority)) {
            def data = request.JSON.data
            def attrs = data.attributes
            def relations = data.relationships
            if (data.type && data.type == "service-to-group") {
                ServiceToGroup serviceToGroup = ServiceToGroup.get(data.id)
                serviceToGroup.setServiceOrder(attrs.serviceOrder)
                serviceToGroup.setServiceTimeout(attrs.serviceTimeout instanceof Integer ?
                        attrs.serviceTimeout : Long.parseLong(attrs.serviceTimeout))
                Service service = Service.get(relations.service.data.id)
                ServiceGroup group = ServiceGroup.get(relations.serviceGroup.data.id)
                serviceToGroup.setService(service)
                serviceToGroup.setGroup(group)
                serviceToGroup.save(flush: true)
                JSON.use('serviceToGroups') {
                    render([data: serviceToGroup] as JSON)
                }
            } else {
                errors.add([
                        "status": 422,
                        "detail": g.message(code: "service.create.params.null"),
                        "source": [
                                "pointer": "data"
                        ]
                ])
                response.status = 422
                render([errors: errors] as JSON)
            }
        } else {
            render([errors: g.message(code: "service.create.not.admin")] as JSON)
        }
    }

    def get(params) {
        def errors = []
        def data = params
        if (data.id) {
            ServiceToGroup serviceToGroup = ServiceToGroup.get(data.id)
            if (serviceToGroup) {
                JSON.use('serviceToGroups') {
                    render([data: serviceToGroup] as JSON)
                }
            } else {
                errors.add([
                        "status": 422,
                        "detail": g.message(code: "service.get.user.not.found"),
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
                    "detail": g.message(code: "service.get.id.null"),
                    "source": [
                            "pointer": "data"
                    ]
            ])
            response.status = 422
            render([errors: errors] as JSON)
        }
    }

    def destroy(params) {
        def principal = springSecurityService.principal
        User user = User.get(principal.id)
        if (user.authorities.authority.contains(Role.findByAuthority(AuthKeys.MASTER).authority)) {
            def data = params
            if (data.type && data.id) {
                ServiceToGroup serviceToGroup = ServiceToGroup.get(data.id)
                if (serviceToGroup) {
                    serviceToGroup.delete(flush: true)
                    render([errors: []] as JSON)
                } else {
                    render([errors: g.message(code: "serviceToGroup.not.found")] as JSON)
                }
            } else {
                render([errors: g.message(code: "serviceToGroup.get.id.null")] as JSON)
            }
        } else {
            render([errors: g.message(code: "serviceToGroup.delete.not.admin")] as JSON)
        }
    }
}
