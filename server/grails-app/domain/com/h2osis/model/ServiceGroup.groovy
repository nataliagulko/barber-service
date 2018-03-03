package com.h2osis.model

class ServiceGroup extends Service {
    static hasMany = [services: Service, servicesToGroup: ServiceToGroup]
    static transients = ['services', 'servicesToGroup']

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

    def getServicesToGroup() {
        if (id) {
            List<ServiceToGroup> serviceToGroupList = ServiceToGroup.findAllByGroup(this)
            if (serviceToGroupList) {
                return serviceToGroupList
            }
        }
    }
}
