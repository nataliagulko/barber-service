package com.h2osis.model

import com.h2osis.auth.User
import com.ibm.icu.text.Transliterator

class Business {

    String name
    String inn
    String description
    String phone
    String address
    String email
    String mode
    String guid
    String code

    String smsCentrLogin
    String smsCentrPass
    
    static hasMany = [masters: User, clients: User] // ссыль на мастеров и клиентов


    static mapping = {
        masters joinTable: [name: "business_master", key: "business_masters_id"]
        clients joinTable: [name: "business_client", key: "business_clients_id"]
    }

    static constraints = {
        name nullable: false
        code nullable: false
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

    static String getCode(String name){
        return  Transliterator.getInstance("Any-Latin; NFD; [^\\p{Alnum}] Remove")
                .transliterate(name)
                ?.replaceAll(' ','_')
    }
}
