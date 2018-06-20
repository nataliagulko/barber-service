package server_next

import com.h2osis.auth.Role
import com.h2osis.model.Business
import com.h2osis.model.Holiday
import com.h2osis.model.Service
import com.h2osis.model.ServiceGroup
import com.h2osis.model.ServiceToGroup
import com.h2osis.model.Slot
import com.h2osis.model.Ticket
import com.h2osis.model.WorkTime
import com.h2osis.auth.User
import grails.converters.JSON

/**
 * Created by esokolov on 21.12.2017.
 */
class JSONRenderConfig {
    def init = {

        JSON.createNamedConfig('users') {
            it.registerObjectMarshaller(User) {
                def returnArray = [:]
                returnArray['id'] = it.id
                returnArray['type'] = 'client'

                def attrs = [:]
                attrs['phone'] = it.phone
                attrs['firstname'] = it.firstname
                attrs['secondname'] = it.secondname
                attrs['username'] = it.username
                attrs['email'] = it.email
                attrs['masterTZ'] = it.masterTZ
                attrs['role'] = it.role.authority
                attrs['business'] = it.business.name
                returnArray['attributes'] = attrs
                return returnArray
            }
        }

        JSON.createNamedConfig('masters') {
            it.registerObjectMarshaller(User) {
                def returnArray = [:]
                returnArray['id'] = it.id
                returnArray['type'] = 'master'

                def attrs = [:]
                returnArray['id'] = it.id
                attrs['phone'] = it.phone
                attrs['firstname'] = it.firstname
                attrs['secondname'] = it.secondname
                attrs['username'] = it.username
                attrs['email'] = it.email
                attrs['masterTZ'] = it.masterTZ
                attrs['role'] = it.role

                def relationships = [:]
                def businessDetails = [:]
                businessDetails['data'] = it.business
                relationships['business'] = businessDetails

                def roleDetails = [:]
                roleDetails['data'] = it.role
                relationships['role'] = roleDetails


                returnArray['relationships'] = relationships
                returnArray['attributes'] = attrs

                return returnArray
            }

            it.registerObjectMarshaller(Business) {
                def businessReturn = [:]
                businessReturn['id'] = it.id
                businessReturn['type'] = 'business'
                return businessReturn
            }
            it.registerObjectMarshaller(Role) {
                def roleReturn = [:]
                roleReturn['id'] = it.id
                roleReturn['type'] = 'role'
                return roleReturn
            }
        }

        JSON.createNamedConfig('clients') {
            it.registerObjectMarshaller(User) {
                def returnArray = [:]
                returnArray['id'] = it.id
                returnArray['type'] = 'client'

                def attrs = [:]
                attrs['phone'] = it.phone
                attrs['firstname'] = it.firstname
                attrs['secondname'] = it.secondname
                attrs['username'] = it.username
                attrs['email'] = it.email
                attrs['masterTZ'] = it.masterTZ
                returnArray['attributes'] = attrs
                return returnArray
            }
        }

        JSON.createNamedConfig('services') {
            it.registerObjectMarshaller(Service) {
                def returnArray = [:]
                returnArray['id'] = it.id
                returnArray['type'] = 'service'

                def attrs = [:]
                attrs['name'] = it.name
                attrs['cost'] = it.cost
                attrs['time'] = it.time
                attrs['partOfList'] = it.partOfList
                attrs['extension'] = it.class

                def relationships = [:]

                def mastersDetails = [:]
                mastersDetails['data'] = it.masters
                relationships['masters'] = mastersDetails

                returnArray['relationships'] = relationships

                returnArray['attributes'] = attrs
                return returnArray
            }

            it.registerObjectMarshaller(User) {
                def returnArray = [:]
                returnArray['id'] = it.id
                returnArray['type'] = 'master'
                return returnArray
            }
        }

        JSON.createNamedConfig('serviceGroups') {
            it.registerObjectMarshaller(ServiceGroup) {
                def returnArray = [:]
                returnArray['id'] = it.id
                returnArray['type'] = 'service-group'

                def attrs = [:]
                attrs['name'] = it.name
                attrs['cost'] = it.cost
                attrs['time'] = it.time
                attrs['partOfList'] = it.partOfList

                def relationships = [:]

                def mastersDetails = [:]
                mastersDetails['data'] = it.masters
                relationships['masters'] = mastersDetails

                def serviceToGroupsDetails = [:]
                serviceToGroupsDetails['data'] = it.serviceToGroups
                relationships['serviceToGroups'] = serviceToGroupsDetails

                returnArray['relationships'] = relationships

                returnArray['attributes'] = attrs
                return returnArray
            }

            it.registerObjectMarshaller(User) {
                def returnArray = [:]
                returnArray['id'] = it.id
                returnArray['type'] = 'master'
                return returnArray
            }

            it.registerObjectMarshaller(ServiceToGroup) {
                def returnArray = [:]
                returnArray['id'] = it.id
                returnArray['type'] = 'service-to-group'
                return returnArray
            }
        }

        JSON.createNamedConfig('serviceToGroups') {
            it.registerObjectMarshaller(ServiceToGroup) {
                def returnArray = [:]
                returnArray['id'] = it.id
                returnArray['type'] = 'service-to-group'

                def attrs = [:]
                attrs['serviceOrder'] = it.serviceOrder
                attrs['serviceTimeout'] = it.serviceTimeout
                returnArray['attributes'] = attrs

                def relationships = [:]

                def serviceDetails = [:]
                def serviceData = [:]
                serviceData['id'] = it.service.id
                serviceData['type'] = 'service'
                serviceDetails['data'] = serviceData
                relationships['service'] = serviceDetails

                def serviceGroupDetails = [:]
                def serviceGroupData = [:]
                serviceGroupData['id'] = it.group.id
                serviceGroupData['type'] = 'service-group'
                serviceGroupDetails['data'] = serviceGroupData
                relationships['serviceGroup'] = serviceGroupDetails

                returnArray['relationships'] = relationships

                return returnArray
            }

            it.registerObjectMarshaller(Service) {
                def returnArray = [:]
                returnArray['id'] = it.id
                returnArray['type'] = 'service'
                return returnArray
            }

            it.registerObjectMarshaller(ServiceGroup) {
                def returnArray = [:]
                returnArray['id'] = it.id
                returnArray['type'] = 'service-group'
                return returnArray
            }
        }

        JSON.createNamedConfig('tickets') {
            it.registerObjectMarshaller(Ticket) {
                def returnArray = [:]
                returnArray['id'] = it.id
                returnArray['type'] = 'ticket'

                def attrs = [:]
                attrs['ticketDate'] = it.ticketDate.format("yyyy-MM-dd HH:mm:ss.S")
                attrs['time'] = it.time
                attrs['status'] = it.status
                attrs['comment'] = it.comment
                attrs['guid'] = it.guid
                attrs['type'] = it.type
                attrs['cost'] = it.cost
                attrs['duration'] = it.duration

                def relationships = [:]

                def userDetails = [:]
                def userData = [:]
                userData['id'] = it.user.id
                userData['type'] = 'client'
                userDetails['data'] = userData
                relationships['client'] = userDetails

                def masterDetails = [:]
                def masterData = [:]
                masterData['id'] = it.master.id
                masterData['type'] = 'master'
                masterDetails['data'] = masterData
                relationships['master'] = masterDetails

                def servicesDetails = [:]
                servicesDetails['data'] = it.services
                relationships['services'] = servicesDetails

                returnArray['relationships'] = relationships

                returnArray['attributes'] = attrs
                return returnArray
            }

            it.registerObjectMarshaller(User) {
                def returnArray = [:]
                returnArray['id'] = it.id
                returnArray['type'] = 'client'
                return returnArray
            }

            it.registerObjectMarshaller(Service) {
                def returnArray = [:]
                returnArray['id'] = it.id
                returnArray['type'] = 'service'
                return returnArray
            }
        }

        JSON.createNamedConfig('holidays') {
            it.registerObjectMarshaller(Holiday) {
                def returnArray = [:]
                returnArray['id'] = it.id
                returnArray['type'] = 'holiday'

                def attrs = [:]
                attrs['dateFrom'] = it.dateFrom
                attrs['dateTo'] = it.dateTo
                attrs['comment'] = it.comment

                def relationships = [:]
                def masterDetails = [:]
                masterDetails['id'] = it.master.id
                masterDetails['type'] = 'master'
                relationships['masters'] = masterDetails

                returnArray['relationships'] = relationships
                returnArray['attributes'] = attrs
                return returnArray
            }
        }


        JSON.createNamedConfig('worktimes') {
            it.registerObjectMarshaller(WorkTime) {
                def returnArray = [:]
                returnArray['id'] = it.id
                returnArray['type'] = 'work-time'

                def attrs = [:]
                attrs['timeFrom'] = it.timeFrom
                attrs['timeTo'] = it.timeTo
                attrs['dayOfWeek'] = it.dayOfWeek

                def relationships = [:]

                def masterDetails = [:]
                masterDetails['id'] = it.master.id
                masterDetails['type'] = 'master'
                relationships['master'] = masterDetails

                returnArray['relationships'] = relationships
                returnArray['attributes'] = attrs
                return returnArray
            }
        }

        JSON.createNamedConfig('slots') {
            it.registerObjectMarshaller(Slot) {
                def returnArray = [:]
                returnArray['id'] = it.id
                returnArray['type'] = 'slot'

                def attrs = [:]
                attrs['start'] = it.start
                attrs['end'] = it.end
                attrs['slotDate'] = it.slotDate

                def relationships = [:]

                def masterDetails = [:]
                masterDetails['id'] = it.master.id
                masterDetails['type'] = 'master'
                relationships['master'] = masterDetails

                returnArray['relationships'] = relationships
                returnArray['attributes'] = attrs
                return returnArray
            }
        }

        JSON.createNamedConfig('business') {
            it.registerObjectMarshaller(Business) {
                def returnArray = [:]
                returnArray['id'] = it.id
                returnArray['type'] = 'business'

                def attrs = [:]

                attrs['name'] = it.name
                attrs['inn'] = it.inn
                attrs['description'] = it.description
                attrs['phone'] = it.phone
                attrs['address'] = it.address
                attrs['email'] = it.email
                attrs['mode'] = it.mode

                def relationships = [:]

                def mastersDetails = [:]
                mastersDetails['data'] = it.masters
                relationships['masters'] = mastersDetails
                
                returnArray['relationships'] = relationships
                returnArray['attributes'] = attrs
                return returnArray
            }

            it.registerObjectMarshaller(User) {
                def returnArray = [:]
                returnArray['id'] = it.id
                returnArray['type'] = 'master'
                return returnArray
            }
        }
    }
}