package com.h2osis.model.ajax

import com.h2osis.model.Service
import com.h2osis.model.ServiceGroup
import com.h2osis.model.ServiceToGroup
import grails.converters.JSON
import grails.transaction.Transactional

class ServiceGroupAjaxController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

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
