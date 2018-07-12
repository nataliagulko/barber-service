package com.h2osis.model

class ServiceGroup extends Service {
    static hasMany = [services: Service, serviceToGroups: ServiceToGroup]
    static transients = ['services', 'serviceToGroups']

    static constraints = {
    }

    def updateFields() {
        Long allTime = 0L
        Long allCost = 0L
        if (this.id) {
            Set<Service> services = ServiceToGroup.findAllByGroup(this)
            if (services) {
                services.each {
                    allTime += it.service.time
                    allTime += it.serviceTimeout
                    allCost += it.service.cost
                }
            }
        }
        time = allTime
        cost = allCost
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
