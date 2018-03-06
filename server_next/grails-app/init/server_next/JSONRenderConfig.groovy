package server_next

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
                attrs['master'] = it.master
                attrs['comment'] = it.comment

                def relationships = [:]
                def mastersDetails = [:]
                mastersDetails['data'] = it.master
                relationships['masters'] = mastersDetails

                returnArray['relationships'] = relationships
                returnArray['attributes'] = attrs
                return returnArray
            }
        }


        JSON.createNamedConfig('worktimes') {
            it.registerObjectMarshaller(WorkTime) {
                def returnArray = [:]
                returnArray['id'] = it.id
                returnArray['type'] = 'workTime'

                def attrs = [:]
                attrs['timeFrom'] = it.timeFrom
                attrs['timeTo'] = it.timeTo
                attrs['master'] = it.master
                attrs['dayOfWeek'] = it.dayOfWeek

                def relationships = [:]
                def mastersDetails = [:]
                mastersDetails['data'] = it.master
                relationships['masters'] = mastersDetails

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
                attrs['master'] = it.master

                def relationships = [:]
                def mastersDetails = [:]
                it.master.password = null
                mastersDetails['data'] = it.master
                relationships['masters'] = mastersDetails

                returnArray['relationships'] = relationships
                returnArray['attributes'] = attrs
                return returnArray
            }
        }
    }
}