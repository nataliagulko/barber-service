package com.h2osis.auth

class Role {

    String authority
    String description

    static mapping = {
        cache true
    }

    static constraints = {
        authority nullable: false, blank: false, unique: true
        description nullable: true
    }
}
