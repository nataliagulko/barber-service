package com.h2osis.model

class ServiceGroup extends Service {
    ServiceToGroup serviceToGroups

    static constraints = {
        serviceToGroups nullable: true
    }
}
