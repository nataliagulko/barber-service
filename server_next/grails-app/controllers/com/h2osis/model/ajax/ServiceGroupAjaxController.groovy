package com.h2osis.model.ajax

import com.h2osis.auth.Role
import com.h2osis.auth.User
import com.h2osis.constant.AuthKeys
import com.h2osis.model.Service
import com.h2osis.model.ServiceGroup
import com.h2osis.model.ServiceToGroup
import grails.converters.JSON
import grails.transaction.Transactional

class ServiceGroupAjaxController {

    static allowedMethods = [choose: ['POST', 'GET']]
    def springSecurityService
    def sessionFactory

    def create() {
        def errors = []
        def principal = springSecurityService.principal
        User currentUser = User.get(principal.id)
        if (currentUser.authorities.authority.contains(Role.findByAuthority(AuthKeys.MASTER).authority)) {
            def data = request.JSON.data
            def attrs = data.attributes
            if (data.type && data.type == "service-group" && attrs.name && attrs.cost && attrs.time) {
                ServiceGroup serviceGroup = new ServiceGroup(name: attrs.name, cost: attrs.cost, time: attrs.time)
                if(!attrs.cost || !attrs.time){
                    serviceGroup.updateFields()
                }
                if (data.relationships.masters) {
                    List mastersIdsList = new ArrayList<Long>()
                    data.relationships.masters.data.id.each {
                        it -> mastersIdsList.add(it)
                    }
                    Set<User> masters = new HashSet<User>()
                    masters.addAll(User.findAllByIdInList(mastersIdsList))
                    serviceGroup.setMasters(masters)
                }
                serviceGroup.save(flush: true)
                render(template: "/serviceGroup/serviceGroup", model: [serviceGroup: serviceGroup])
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
            errors.add([
                    "status": 422,
                    "detail": g.message(code: "service.create.not.admin"),
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
        User user = User.get(principal.id)
        if (user.authorities.authority.contains(Role.findByAuthority(AuthKeys.MASTER).authority)) {
            def data = request.JSON.data
            def attrs = data.attributes
            if (data.type && data.type == "service-group") {
                ServiceGroup serviceGroup = ServiceGroup.get(data.id)
                serviceGroup.setName(attrs.name)
                serviceGroup.setCost(attrs.cost)
                serviceGroup.setTime(attrs.time)
                if(!attrs.cost || !attrs.time){
                    serviceGroup.updateFields()
                }
                if (data.relationships?.masters) {
                    List mastersIdsList = new ArrayList<Long>()
                    data.relationships.masters.data.id.each {
                        it -> mastersIdsList.add(it)
                    }
                    if(mastersIdsList) {
                        Set<User> masters = new HashSet<User>()
                        masters.addAll(User.findAllByIdInList(mastersIdsList))
                        serviceGroup.setMasters(masters)
                    }
                }
                serviceGroup.save(flush: true)
                render(template: "/serviceGroup/serviceGroup", model: [serviceGroup: serviceGroup])
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
            errors.add([
                    "status": 422,
                    "detail": g.message(code: "service.create.not.admin"),
                    "source": [
                            "pointer": "data"
                    ]
            ])
            response.status = 422
            render([errors: errors] as JSON)
        }
    }

    def get(params) {
        def errors = []
        def data = params
        if (data.id) {
            ServiceGroup serviceGroup = ServiceGroup.get(data.id)
            if (serviceGroup) {
                render(template: "/serviceGroup/serviceGroup", model: [serviceGroup: serviceGroup])
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

    @Transactional
    def destroy(params) {
        def errors = []
        def principal = springSecurityService.principal
        User user = User.get(principal.id)
        if (user.authorities.authority.contains(Role.findByAuthority(AuthKeys.MASTER).authority)) {
            def data = params
            if (data.id) {
                ServiceGroup serviceGroup = ServiceGroup.get(data.id)
                if (serviceGroup) {
                    final session = sessionFactory.currentSession
                    final String query = "select ticket_services_id from  ticket_service where service_id = $serviceGroup.id limit 1"
                    final sqlQuery = session.createSQLQuery(query)
                    final ticketByService = sqlQuery.with {
                        list()
                    }
                    if (ticketByService) {
                        errors.add([
                                "status": 422,
                                "detail": message(code: "service.in.tickets"),
                                "source": [
                                        "pointer": "data"
                                ]
                        ])
                        response.status = 422
                        render([errors: errors] as JSON)
                    } else {
                        ServiceToGroup.deleteAll(ServiceToGroup.findAllByGroup(serviceGroup))
                        serviceGroup.delete(flush: true)
                        response.status = 204
                        render([errors: []] as JSON)
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
        } else {
            errors.add([
                    "status": 422,
                    "detail": g.message(code: "service.delete.not.admin"),
                    "source": [
                            "pointer": "data"
                    ]
            ])
            response.status = 422
            render([errors: errors] as JSON)
        }
    }
}
