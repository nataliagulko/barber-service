package com.h2osis.model.ajax

import com.h2osis.auth.Role
import com.h2osis.auth.User
import com.h2osis.constant.AuthKeys
import com.h2osis.model.Service
import com.h2osis.model.ServiceGroup
import com.h2osis.model.ServiceToGroup
import com.h2osis.utils.SearchService
import grails.converters.JSON
import grails.transaction.Transactional

class ServiceAjaxController {

    def springSecurityService
    SearchService searchService
    static allowedMethods = [choose: ['POST', 'GET']]
    def sessionFactory

    def get() {
        def errors = []
        def data = request.JSON.data
        if (data.id) {
            Service service = Service.get(data.id)
            if (service) {
                JSON.use('services') {
                    render([data: service] as JSON)
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

    def find() {
        if (params.value) {
            String value = params.value
            List<Service> serviceList = searchService.serviceSearch(value)
            if (serviceList) {
                if (params.master) {
                    serviceList = serviceList.findAll {
                        it.masters.id.contains(params.master)
                    }
                }
                JSON.use('services') {
                    render([data: serviceList] as JSON)
                }
            } else {
                render([errors: g.message(code: "service.fine.not.found")] as JSON)
            }
        } else {
            render([errors: g.message(code: "find.value.null")] as JSON)
        }
    }

    def create() {
        def errors = []
        def principal = springSecurityService.principal
        User currentUser = User.get(principal.id)
        if (currentUser.authorities.contains(Role.findByAuthority(AuthKeys.ADMIN))) {
            def data = request.JSON.data
            def attrs = data.attributes
            if (data.type && data.type == "service" && attrs.name && attrs.cost && attrs.time) {
                Service service = new Service(name: attrs.name, cost: attrs.cost, time: attrs.time, partOfList: attrs.partOfList)
                if (data.relationships.masters) {
                    List mastersIdsList = new ArrayList<Long>()
                    data.relationships.masters.data.id.each {
                        it -> mastersIdsList.add(it)
                    }
                    Set<User> masters = new HashSet<User>()
                    masters.addAll(User.findAllByIdInList(mastersIdsList))
                    service.setMasters(masters)
                }
                service.save(flush: true)
                Service.search().createIndexAndWait()
                JSON.use('services') {
                    render([data: service] as JSON)
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
        def principal = springSecurityService.principal
        User user = User.get(principal.id)
        if (user.authorities.contains(Role.findByAuthority(AuthKeys.ADMIN))) {
            def data = request.JSON.data
            def attrs = data.attributes
            if (data.id) {
                Service service = Service.get(data.id)
                if (service) {
                    if (attrs.cost) {
                        service.setCost(attrs.cost)
                    }
                    if (attrs.time) {
                        service.setTime(attrs.time)
                    }
                    if (attrs.name) {
                        service.setName(attrs.name)
                    }
                    if (data.relationships.masters) {
                        List mastersIdsList = new ArrayList<Long>()
                        data.relationships.masters.data.id.each {
                            it -> mastersIdsList.add(it)
                        }
                        Set<User> masters = new HashSet<User>()
                        masters.addAll(User.findAllByIdInList(mastersIdsList))
                        service.setMasters(masters)
                    }
                    service.save(flush: true)
                    Service.search().createIndexAndWait()
                    JSON.use('services') {
                        render([data: service] as JSON)
                    }
                } else {
                    render([errors: g.message(code: "service.create.params.null")] as JSON)
                }

            } else {
                render([errors: g.message(code: "service.create.params.null")] as JSON)
            }
        } else {
            render([errors: g.message(code: "service.create.not.admin")] as JSON)
        }
    }

    @Transactional
    def destroy() {
        def principal = springSecurityService.principal
        User user = User.get(principal.id)
        if (user.authorities.contains(Role.findByAuthority(AuthKeys.ADMIN))) {
            def data = request.JSON.data
            if (data.type && data.id) {
                Service service = Service.get(data.id)
                if (service) {
                    if (ServiceToGroup.countByService(service)) {
                        ServiceGroup parent = ServiceToGroup.findByService(service).group
                        response.status = 422
                        render([errors: message(code: "serviceGroup.service.is.subservice", args: [parent.name, parent.id])] as JSON)
                    } else {
                        final session = sessionFactory.currentSession
                        final String query = "select ticket_services_id from  ticket_service where service_id = $service.id limit 1"
                        final sqlQuery = session.createSQLQuery(query)
                        final ticketByService = sqlQuery.with {
                            list()
                        }
                        if(ticketByService){
                            response.status = 422
                            render([errors: message(code: "service.in.tickets")] as JSON)
                        }else {
                            if (service.class == com.h2osis.model.ServiceGroup.class) {
                                ServiceGroup serviceGroup = ServiceGroup.get(data.id)
                                ServiceToGroup.deleteAll(ServiceToGroup.findAllByGroup(serviceGroup))
                            }
                            service.delete(flush: true)
                            Service.search().createIndexAndWait()
                            response.status = 204
                            render([data: 0] as JSON)
                        }
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

    def list() {
        List<Service> serviceList = Service.createCriteria().list {
            def query = request.JSON.query
            if (query) {
                if (query.name) {
                    eq("name", query.name)
                }
                if (query.cost) {
                    eq("cost", Float.parseFloat(query.cost))
                }
                if (query.time) {
                    eq("time", Long.parseLong(query.time))
                }
                if (query.masterId) {
                    masters {
                        idEq(User.get(query.masterId)?.id)
                    }
                }
                if (query.max && query.offset) {
                    Integer max = Integer.parseInt(query.max)
                    Integer offset = Integer.parseInt(query.offset)
                    maxResults(max)
                    firstResult(offset)
                }
                if (query.partOfList) {
                    if (query.partOfList == true) {
                        eq("partOfList", true)
                    } else {
                        or {
                            eq("partOfList", false)
                            isNull("partOfList")
                        }
                    }
                }
            }

            order("name", "asc")
        }
        if (serviceList) {
            def query = request.JSON.query

            if (query && query.onlySimpleService == true) {
                serviceList = serviceList.findAll {
                    (it.class == Service.class)
                }
            }
            JSON.use('services') {
                render([data: serviceList] as JSON)
            }
        } else {
            render([errors: g.message(code: "service.fine.not.found")] as JSON)
        }
    }
}
