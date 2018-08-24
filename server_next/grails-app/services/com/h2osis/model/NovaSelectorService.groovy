package com.h2osis.model

import com.h2osis.auth.User
import grails.gorm.transactions.Transactional

@Transactional
class NovaSelectorService {

    def getCoMasters(User master) {
        Collection<User> masters = new HashSet<User>()
        def mastersBuf = master?.business?.masters
        if(mastersBuf && !mastersBuf.isEmpty()){
            masters.addAll(mastersBuf)
        }
        return masters
    }

    def getCoMastersServices(User master){
        Set<User> coMasters = getCoMasters(master)
        return Service.createCriteria().list {
            masters {
                'in'('id', coMasters.id)
            }

        }
    }


}
