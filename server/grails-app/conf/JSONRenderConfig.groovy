import com.h2osis.model.Holiday
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
    }
}