package com.h2osis.model

import com.h2osis.auth.User

class Business {

    String name
    String inn
    String description
    String phone
    String address
    String email
    String mode

    String smsCentrLogin
    String smsCentrPass
    
    static hasMany = [masters: User, clients: User] // ссыль на мастеров и клиентов


    static mapping = {
        masters joinTable: [name: "business_master", key: "business_masters_id"]
        clients joinTable: [name: "business_client", key: "business_clients_id"]
    }

    static constraints = {
        name nullable: false
        inn nullable: true
        address nullable: false
        phone nullable: true, widget: "phone"
        email nullable: true
        description nullable: true
        masters nullable: true, minSize: 0
        clients nullable: true, minSize: 0
        mode nullable: true, maxSize: 255
        smsCentrLogin blank: true, nullable: true
        smsCentrPass blank: true, nullable: true
    }

    static search = {
        name index: 'tokenized'
        inn index: 'tokenized'
        description index: 'tokenized'
        masters indexEmbedded: [depth: 1]
    }

    String toString() {
        return name
    }
}
