package com.h2osis.model

import com.h2osis.auth.Role
import com.h2osis.auth.User
import com.h2osis.constant.AuthKeys
import com.h2osis.utils.SearchService
import grails.converters.JSON
import org.codehaus.groovy.grails.web.json.JSONArray

class ServiceRestController {

    def springSecurityService
    SearchService searchService
    static allowedMethods = [choose: ['POST', 'GET']]

    def get() {
        if (params.id) {
            Service service = Service.get(params.id)
            if (service) {
                render(service as JSON)
            } else {
                render([msg: g.message(code: "service.get.user.not.found")] as JSON)
            }
        } else {
            render([msg: g.message(code: "service.get.id.null")] as JSON)
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
                render(serviceList as JSON)
            } else {
                render([msg: g.message(code: "service.fine.not.found")] as JSON)
            }
        } else {
            render([msg: g.message(code: "find.value.null")] as JSON)
        }
    }

    def create() {
        def principal = springSecurityService.principal
        User user = User.get(principal.id)
        if (user.authorities.contains(Role.findByAuthority(AuthKeys.ADMIN))) {
            if (params.name && params.cost && params.time) {
                Service service = new Service(name: params.name, cost: params.cost, time: params.time)
                service.addToMasters(user)
                service.save(flush: true)
                Service.search().createIndexAndWait()
                render(service as JSON)
            } else {
                render([msg: g.message(code: "service.create.params.null")] as JSON)
            }
        } else {
            render([msg: g.message(code: "service.create.not.admin")] as JSON)
        }
    }

    def update() {
        def principal = springSecurityService.principal
        User user = User.get(principal.id)
        if (user.authorities.contains(Role.findByAuthority(AuthKeys.ADMIN))) {
            if (params.id) {
                Service service = Service.get(params.id)
                if (service) {
                    if (params.cost) {
                        service.setCost(Long.parseLong(params.cost))
                    }
                    if (params.time) {
                        service.setTime(Long.parseLong(params.time))
                    }
                    if (params.name) {
                        service.setName(params.name)
                    }
                    if (params.masters) {
                        JSONArray mastersJSON = JSON.parse(params.masters)
                        List mastersList = new ArrayList<Long>()
                        mastersJSON.each {
                            mastersList.add(new Integer(it).longValue())
                        }
                        Set<User> masters = new HashSet<User>()
                        masters.addAll(User.findAllByIdInList(mastersList))
                        service.setMasters(masters)
                    }
                    service.save(flush: true)
                    Service.search().createIndexAndWait()
                    render(service as JSON)
                } else {
                    render([msg: g.message(code: "service.create.params.null")] as JSON)
                }

            } else {
                render([msg: g.message(code: "service.create.params.null")] as JSON)
            }
        } else {
            render([msg: g.message(code: "service.create.not.admin")] as JSON)
        }
    }

    def delete() {
        def principal = springSecurityService.principal
        User user = User.get(principal.id)
        if (user.authorities.contains(Role.findByAuthority(AuthKeys.ADMIN))) {
            if (params.id) {
                Service service = Service.get(params.id)
                if (service) {
                    service.delete(flush: true)
                    Service.search().createIndexAndWait()
                    render([code: 0] as JSON)
                } else {
                    render([msg: g.message(code: "service.get.user.not.found")] as JSON)
                }
            } else {
                render([msg: g.message(code: "service.get.id.null")] as JSON)
            }
        } else {
            render([msg: g.message(code: "service.delete.not.admin")] as JSON)
        }
    }

    def list() {
        List<Service> serviceList = Service.createCriteria().list {
            if (params.name) {
                eq("name", params.name)
            }
            if (params.cost) {
                eq("cost", Float.parseFloat(params.cost))
            }
            if (params.time) {
                eq("time", Long.parseLong(params.time))
            }
            if (params.master) {
                masters {
                    idEq(User.get(params.master)?.id)
                }
            }
            if (params.max && params.offset) {
                Integer max = params.getInt('max')
                Integer offset = params.getInt('offset')
                maxResults(max)
                firstResult(offset)
            }
            if (params.partOfList) {
                if (params.partOfList == true) {
                    eq("partOfList", true)
                } else {
                    or {
                        eq("partOfList", false)
                        isNull("partOfList")
                    }
                }
            }

            order("name", "asc")
        }
        if (serviceList) {
            if (params.onlySimpleService == true) {
                serviceList = serviceList.findAll {
                    (it.class == Service.class)
                }
            }
            render(view: "/service/serviceList", model: [service: serviceList])
        } else {
            render([msg: g.message(code: "service.fine.not.found")] as JSON)
        }
    }

}
