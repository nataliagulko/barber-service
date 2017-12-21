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
                        service.setCost(Long.parseLong(attrs.cost))
                    }
                    if (attrs.time) {
                        service.setTime(Long.parseLong(attrs.time))
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
                    render([data: service] as JSON)
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
                        render([errors: g.message(code: "serviceGroup.service.is.subservice")] as JSON)
                    } else {
                        if (service.class == com.h2osis.model.ServiceGroup.class) {
                            ServiceGroup serviceGroup = ServiceGroup.get(data.id)
                            ServiceToGroup.deleteAll(ServiceToGroup.findAllByGroup(serviceGroup))
                        }
                        service.delete(flush: true)
                        Service.search().createIndexAndWait()
                        render([data: 0] as JSON)
                    }
                } else {
                    render([errors: g.message(code: "service.get.user.not.found")] as JSON)
                }
            } else {
                render([errors: g.message(code: "service.get.id.null")] as JSON)
            }
        } else {
            render([errors: g.message(code: "service.delete.not.admin")] as JSON)
        }
    }

    def list() {
        List<Service> serviceList = Service.createCriteria().list {
            def data = request.JSON.data
            def query = request.JSON.query
            if (data) {
                def attrs = data.attributes

                if (attrs.name) {
                    eq("name", attrs.name)
                }
                if (attrs.cost) {
                    eq("cost", Float.parseFloat(attrs.cost))
                }
                if (attrs.time) {
                    eq("time", Long.parseLong(attrs.time))
                }
                if (query.master) {
                    masters {
                        idEq(User.get(query.master)?.id)
                    }
                }
                if (data.max && data.offset) {
                    Integer max = Integer.parseInt(data.max)
                    Integer offset = Integer.parseInt(data.offset)
                    maxResults(max)
                    firstResult(offset)
                }
                if (attrs.partOfList) {
                    if (attrs.partOfList == true) {
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
