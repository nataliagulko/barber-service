package server_next

import com.h2osis.model.Business
import com.h2osis.model.Holiday
import com.h2osis.model.Slot
import com.h2osis.model.WorkTime
import grails.converters.JSON

/**
 * Created by esokolov on 21.12.2017.
 */
class JSONRenderConfig {
    def init = {
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
        }
    }
}