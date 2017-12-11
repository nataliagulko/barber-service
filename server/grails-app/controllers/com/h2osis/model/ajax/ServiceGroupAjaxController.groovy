package com.h2osis.model.ajax

import com.h2osis.model.Service
import com.h2osis.model.ServiceGroup
import com.h2osis.model.ServiceToGroup
import grails.converters.JSON
import grails.transaction.Transactional
import com.h2osis.auth.User
import com.h2osis.auth.Role
import com.h2osis.constant.AuthKeys
import org.codehaus.groovy.grails.web.json.JSONArray

class ServiceGroupAjaxController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]
    def springSecurityService

    def create() {
        def errors = []
        def principal = springSecurityService.principal
        User user = User.get(principal.id)
        if (user.authorities.contains(Role.findByAuthority(AuthKeys.ADMIN))) {
            def data = request.JSON.data
            def attrs = data.attributes
            if (data.type && data.type == "service-group" && attrs.name && attrs.cost && attrs.time) {
                ServiceGroup serviceGroup = new ServiceGroup(name: attrs.name, cost: attrs.cost, time: attrs.time)
                serviceGroup.addToMasters(user)
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
}
