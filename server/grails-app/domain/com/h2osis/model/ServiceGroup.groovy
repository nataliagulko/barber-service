package com.h2osis.model

class ServiceGroup extends Service {
    static hasMany = [services: Service, serviceToGroups: ServiceToGroup]
    static transients = ['services', 'serviceToGroups']

    static constraints = {
    }

    def getServices() {
        if (id) {
            Set<ServiceToGroup> serviceToGroupSet = ServiceToGroup.findAllByGroup(this)
            if (serviceToGroupSet) {
                return serviceToGroupSet
            }
        }
        return null
    }

    def getServiceToGroups() {
        if (id) {
            List<ServiceToGroup> serviceToGroupList = ServiceToGroup.findAllByGroup(this)
            if (serviceToGroupList) {
                return serviceToGroupList
            }
        }
    }
}
