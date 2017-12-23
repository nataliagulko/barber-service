package com.h2osis.model.ajax

import com.h2osis.auth.Role
import com.h2osis.auth.User
import com.h2osis.constant.AuthKeys
import com.h2osis.model.Service
import com.h2osis.model.ServiceGroup
import com.h2osis.model.ServiceToGroup
import com.h2osis.model.Ticket
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
        if (currentUser.authorities.contains(Role.findByAuthority(AuthKeys.ADMIN))) {
            def data = request.JSON.data
            def attrs = data.attributes
            if (data.type && data.type == "service-group" && attrs.name && attrs.cost && attrs.time) {
                ServiceGroup serviceGroup = new ServiceGroup(name: attrs.name, cost: attrs.cost, time: attrs.time)
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
                serviceGroup.search().createIndexAndWait()
                JSON.use('serviceGroups') {
                    render([data: serviceGroup] as JSON)
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
        if (user.authorities.contains(Role.findByAuthority(AuthKeys.ADMIN))) {
            def data = request.JSON.data
            def attrs = data.attributes
            if (data.type && data.type == "service-group") {
                ServiceGroup serviceGroup = ServiceGroup.get(data.id)
                serviceGroup.setName(attrs.name)
                if (data.relationships?.masters) {
                    List mastersIdsList = new ArrayList<Long>()
                    data.relationships.masters.data.id.each {
                        it -> mastersIdsList.add(it)
                    }
                    Set<User> masters = new HashSet<User>()
                    masters.addAll(User.findAllByIdInList(mastersIdsList))
                    serviceGroup.setMasters(masters)
                }
                serviceGroup.save(flush: true)
                JSON.use('serviceGroups') {
                    render([data: serviceGroup] as JSON)
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

    def get() {
        def errors = []
        def data = request.JSON.data
        if (data.id) {
            ServiceGroup serviceGroup = ServiceGroup.get(data.id)
            if (serviceGroup) {
                JSON.use('serviceGroups') {
                    render([data: serviceGroup] as JSON)
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

    def getSubServices() {
        if (params.id) {
            ServiceGroup group = ServiceGroup.get(params.id)
            if (group) {
                render(view: "/serviceGroup/subServices", model: [subservices: ServiceToGroup.findAllByGroup(group, [sort: 'serviceOrder'])])
            } else {
                render([msg: g.message(code: "services.group.not.found")] as JSON)
            }
        } else {
            render([msg: g.message(code: "services.group.id.null")] as JSON)
        }
    }

    @Transactional
    def saveSubService() {
        if (params.service && params.id && params.serviceOrder && params.serviceTimeout) {
            ServiceGroup group = ServiceGroup.get(params.id)
            if (!group) {
                render([msg: g.message(code: "services.group.not.found")] as JSON)
            } else {
                ServiceToGroup serviceToGroup = null
                if (params.serviceToGroup) {
                    serviceToGroup = ServiceToGroup.get(params.serviceToGroup)
                } else {
                    serviceToGroup = new ServiceToGroup()
                }
                serviceToGroup.setService(Service.get(Long.parseLong(params.service)))
                serviceToGroup.setServiceTimeout(Long.parseLong(params.serviceTimeout))
                serviceToGroup.setServiceOrder(Long.parseLong(params.serviceOrder))
                serviceToGroup.setGroup(group)
                serviceToGroup.save(flush: true)
                render([id: serviceToGroup.id] as JSON)
            }
        } else {
            render([msg: g.message(code: "services.group.params.null")] as JSON)
        }
    }

    @Transactional
    def deleteSubService() {
        if (params.id && params.groupId) {
            Service service = Service.get(params.id)
            ServiceGroup group = ServiceGroup.get(params.groupId)
            if (service) {
                ServiceToGroup serviceToGroup = ServiceToGroup.findByServiceAndGroup(service, group)
                if (serviceToGroup) {
                    serviceToGroup.delete(flush: true)
                }
            }
            render([code: 0] as JSON)
        } else {
            render([msg: g.message(code: "params.id.null")] as JSON)
        }
    }

    @Transactional
    def destroy() {
        def principal = springSecurityService.principal
        User user = User.get(principal.id)
        if (user.authorities.contains(Role.findByAuthority(AuthKeys.ADMIN))) {
            def data = request.JSON.data
            if (data.type && data.id) {
                ServiceGroup serviceGroup = ServiceGroup.get(data.id)
                if (serviceGroup) {
                    final session = sessionFactory.currentSession
                    final String query = "select ticket_services_id from  ticket_service where service_id = $serviceGroup.id limit 1"
                    final sqlQuery = session.createSQLQuery(query)
                    final ticketByService = sqlQuery.with {
                        list()
                    }
                    if (ticketByService) {
                        response.status = 422
                        render([errors: message(code: "service.in.tickets")] as JSON)
                    } else {
                        ServiceToGroup.deleteAll(ServiceToGroup.findAllByGroup(serviceGroup))
                        serviceGroup.delete(flush: true)
                        Service.search().createIndexAndWait()
                        response.status = 204
                        render([data: 0] as JSON)
                    }
                } else {
                    response.status = 422
                    render([errors: g.message(code: "service.get.user.not.found")] as JSON)
                }
            } else {
                response.status = 422
                render([errors: g.message(code: "service.get.id.null")] as JSON)
            }
        } else {
            response.status = 422
            render([errors: g.message(code: "service.delete.not.admin")] as JSON)
        }
    }
}
