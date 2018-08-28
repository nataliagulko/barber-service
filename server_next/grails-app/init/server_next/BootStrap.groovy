package server_next

import com.h2osis.auth.Role
import com.h2osis.auth.User
import com.h2osis.auth.UserRole
import constant.AuthKeys
import constant.TicketStatus
import com.h2osis.model.Business
import com.h2osis.model.Holiday
import com.h2osis.model.Service
import com.h2osis.model.WorkTime
import com.h2osis.sm.SMObjectType
import com.h2osis.sm.SMTransition
import grails.plugin.springsecurity.SpringSecurityService
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat
import grails.util.Environment

class BootStrap {

    SpringSecurityService springSecurityService

    def init = { servletContext ->

        if (!SMTransition.count()) {
            new SMTransition(objectType: SMObjectType.ticket, stateFrom: TicketStatus.NEW, stateTo: TicketStatus.ACCEPTED).save(flush: true)
            new SMTransition(objectType: SMObjectType.ticket, stateFrom: TicketStatus.ACCEPTED, stateTo: TicketStatus.COMPLETED).save(flush: true)
            new SMTransition(objectType: SMObjectType.ticket, stateFrom: TicketStatus.NEW, stateTo: TicketStatus.REJECTED).save(flush: true)
        }

        if (!Role.findByAuthority(AuthKeys.MASTER)) {
            new Role(authority: AuthKeys.MASTER, description: "admin").save(flush: true)
        }
        if (!Role.findByAuthority(AuthKeys.CLIENT)) {
            new Role(authority: AuthKeys.CLIENT, description: "user").save(flush: true)
        }
        if (!Role.findByAuthority(AuthKeys.ROOT)) {
            new Role(authority: AuthKeys.ROOT, description: "root").save(flush: true)
        }
        if (!Role.findByAuthority(AuthKeys.SUPER_MASTER)) {
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


        new JSONRenderConfig().init()
        new SecConfig().init()
        springSecurityService.clearCachedRequestmaps()
    }
    def destroy = {
    }
}
