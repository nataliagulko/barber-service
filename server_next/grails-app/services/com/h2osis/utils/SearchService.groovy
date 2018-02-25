package com.h2osis.utils

import com.h2osis.auth.User
import com.h2osis.model.Business
import com.h2osis.model.Service
import com.h2osis.model.Ticket
import grails.transaction.Transactional

@Transactional
class SearchService {

    def serviceSearch(String value) {
        return Service.search().list {
            should {
                fuzzy "name", value
                fuzzy "cost", value
                fuzzy "time", value
                fuzzy "masters.firstname", value
                fuzzy "masters.secondname", value
                fuzzy "masters.username", value
                fuzzy "masters.email", value
                fuzzy "masters.phone", value
            }
        }
    }

    def ticketSearch(String value) {
        return Ticket.search().list {
            should {
                fuzzy "comment", value
                fuzzy "status", value

                try {
                    fuzzy "date", Date.parse(value)
                }catch (Exception e){

                }

                fuzzy "services.name", value
                fuzzy "services.cost", value
                fuzzy "services.time", value

                fuzzy "master.firstname", value
                fuzzy "master.phone", value
                fuzzy "master.secondname", value
                fuzzy "master.username", value
                fuzzy "master.email", value

                fuzzy "user.username", value
                fuzzy "user.email", value
                fuzzy "user.phone", value
                fuzzy "user.firstname", value
                fuzzy "user.secondname", value
            }
        }
    }

    def userSearch(String value) {
        return User.search().list {
            should {
                fuzzy "firstname", value
                fuzzy "secondname", value
                fuzzy "username", value
                fuzzy "email", value
                fuzzy "phone", value
            }
        }
    }

    def businessSearch(String value) {
        return Business.search().list {
            should {
                fuzzy "name", value
                fuzzy "inn", value
                fuzzy "description", value

                fuzzy "masters.firstname", value
                fuzzy "masters.secondname", value
                fuzzy "masters.username", value
                fuzzy "masters.email", value
                fuzzy "masters.phone", value
            }
        }
    }

}
