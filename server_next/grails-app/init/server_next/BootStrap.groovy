package server_next

import com.h2osis.auth.Role
import com.h2osis.auth.User
import com.h2osis.auth.UserRole
import com.h2osis.constant.AuthKeys
import com.h2osis.constant.TicketStatus
import com.h2osis.model.Business
import com.h2osis.model.Holiday
import com.h2osis.model.Service
import com.h2osis.model.ServiceGroup
import com.h2osis.model.ServiceToGroup
import com.h2osis.model.Ticket
import com.h2osis.model.WorkTime
import com.h2osis.sm.SMObjectType
import com.h2osis.sm.SMTransition
import grails.plugin.springsecurity.SpringSecurityService
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat
import grails.util.Environment
import grails.converters.JSON


class BootStrap {

    SpringSecurityService springSecurityService

    def init = { servletContext ->

        if (!SMTransition.count()) {
            new SMTransition(objectType: SMObjectType.ticket, stateFrom: TicketStatus.NEW, stateTo: TicketStatus.ACCEPTED).save(flush: true)
            new SMTransition(objectType: SMObjectType.ticket, stateFrom: TicketStatus.ACCEPTED, stateTo: TicketStatus.COMPLETED).save(flush: true)
            new SMTransition(objectType: SMObjectType.ticket, stateFrom: TicketStatus.NEW, stateTo: TicketStatus.REJECTED).save(flush: true)
        }

        if (!Role.count()) {
            new Role(authority: AuthKeys.MASTER, description: "admin").save(flush: true)
            new Role(authority: AuthKeys.CLIENT, description: "user").save(flush: true)
            new Role(authority: AuthKeys.ROOT, description: "root").save(flush: true)
            new Role(authority: AuthKeys.SUPER_MASTER, description: "super_master").save(flush: true)
        }

        if (Environment.current == Environment.PRODUCTION) {
            if (!User.count() && !UserRole.count()) {
                User user = new User(username: "shustikov.s", password: "Barber161006", email: "b.barberovic@gmail.com", phone: "+7(922)277-03-00").save(flush: true)
                Role role = Role.findByAuthority(AuthKeys.MASTER)
                new UserRole(user: user, role: role).save(flush: true)
            }

            if (!Business.count()) {
                Business business = new Business(name: 'Шустиков С. А.', phone: "+7(922)277-03-00", address: "с. Усть-Кулом")
                business.addToMasters(User.findByUsername("shustikov.s"))
                business.save(flush: true)
            }
        } else {

            if (!User.count()) {
                User user = new User(username: "nnogieva", password: "123", email: "sokolovep@gmail.com", firstname: "natalya", secondname: "nogieva", phone: "+7(904)238-79-70").save(flush: true)
                Role role = Role.findByAuthority(AuthKeys.MASTER)
                new UserRole(user: user, role: role).save(flush: true)

                User testMaster = new User(username: "master", password: "123", email: "sokolovep@gmail.com", fio: "fio", phone: "+7(912)114-79-90").save(flush: true)
                new UserRole(user: testMaster, role: role).save(flush: true)

                WorkTime wt1 = new WorkTime(timeFrom: '10:00', timeTo: '18:00', dayOfWeek: 0)
                wt1.setMaster(User.findByUsername('master'))
                wt1.save(flush: true)
                WorkTime wt2 = new WorkTime(timeFrom: '10:00', timeTo: '18:00', dayOfWeek: 1)
                wt2.setMaster(User.findByUsername('master'))
                wt2.save(flush: true)
                WorkTime wt3 = new WorkTime(timeFrom: '10:00', timeTo: '18:00', dayOfWeek: 2)
                wt3.setMaster(User.findByUsername('master'))
                wt3.save(flush: true)
                WorkTime wt4 = new WorkTime(timeFrom: '10:00', timeTo: '18:00', dayOfWeek: 3)
                wt4.setMaster(User.findByUsername('master'))
                wt4.save(flush: true)
                WorkTime wt6 = new WorkTime(timeFrom: '10:00', timeTo: '18:00', dayOfWeek: 5)
                wt6.setMaster(User.findByUsername('master'))
                wt6.save(flush: true)
                WorkTime wt7 = new WorkTime(timeFrom: '10:00', timeTo: '18:00', dayOfWeek: 6)
                wt7.setMaster(User.findByUsername('master'))
                wt7.save(flush: true)

                WorkTime wt8 = new WorkTime(timeFrom: '9:00', timeTo: '18:00', dayOfWeek: 0)
                wt8.setMaster(User.findByUsername('nnogieva'))
                wt8.save(flush: true)
                WorkTime wt9 = new WorkTime(timeFrom: '11:00', timeTo: '15:00', dayOfWeek: 6)
                wt9.setMaster(User.findByUsername('nnogieva'))
                wt9.save(flush: true)

                DateTime date = DateTimeFormat.forPattern("yyyy-MM-dd").parseDateTime("2016-09-13")
                new Holiday(master: User.findByUsername('master'), comment: "trololo! partyhard!!",
                        dateFrom: date.toDate(), dateTo: date.withDayOfMonth(date.dayOfMonth + 14).toDate()).save(flush: true)

                DateTime date1 = DateTimeFormat.forPattern("yyyy-MM-dd").parseDateTime("2016-09-16")
                new Holiday(master: User.findByUsername('nnogieva'), comment: "0",
                        dateFrom: date1.toDate(), dateTo: date1.withDayOfMonth(date.dayOfMonth + 14).toDate()).save(flush: true)

                User root = new User(username: "root", password: "ijbjxzzi", email: "sokolovep@gmail.com", fio: "fio", phone: "+7(000)000-00-00").save(flush: true)
                role = Role.findByAuthority(AuthKeys.ROOT)
                new UserRole(user: root, role: role).save(flush: true)
            }
            if (!User.findByUsername("root")) {
                if (!Role.findByAuthority(AuthKeys.ROOT)) {
                    new Role(authority: AuthKeys.ROOT, description: "root").save(flush: true)
                }
                User root = new User(username: "root", password: "ijbjxzzi", email: "sokolovep@gmail.com", fio: "fio", phone: "+7(000)000-00-00").save(flush: true)
                Role role = Role.findByAuthority(AuthKeys.ROOT)
                new UserRole(user: root, role: role).save(flush: true)
            }

            if (!Business.count()) {
                Business business = new Business(name: 'Test Inc.', inn: "111000101123", phone: "+7(900)000-00-00", address: "ул. Центральная, д. 00, оф. 00", email: "email@email.com")
                business.save(flush: true)
                //business.addToMasters(User.findByUsername("master"))
                //business.addToMasters(User.findByUsername("nnogieva"))
                business.save(flush: true)
            }

            if (!Service.count()) {
                Service service = new Service(name: 'test service', cost: 250, time: 40, partOfList: false)
                service.addToMasters(User.findByUsername('master'))
                service.save(flush: true)
            }

            //Service.search().createIndexAndWait()
            //Ticket.search().createIndexAndWait()
        }

        //User.search().createIndexAndWait()
        //Business.search().createIndexAndWait()

        //init json render

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
                returnArray['attributes'] = attrs

                return returnArray
            }

            it.registerObjectMarshaller(Holiday) {
                def holidayReturn = [:]
                holidayReturn['id'] = it.id
                holidayReturn['type'] = 'holiday'
                return holidayReturn
            }

            it.registerObjectMarshaller(WorkTime) {
                def workTimeReturn = [:]
                workTimeReturn['id'] = it.id
                workTimeReturn['type'] = 'workTime'
                return workTimeReturn
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
        new JSONRenderConfig().init()
        new SecConfig().init()
        springSecurityService.clearCachedRequestmaps()
    }
    def destroy = {
    }
}
