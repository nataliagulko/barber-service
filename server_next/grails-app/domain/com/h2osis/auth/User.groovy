package com.h2osis.auth

import com.h2osis.constant.AuthKeys
import com.h2osis.model.Business

class User {

    transient springSecurityService

    String username
    String password
    String email
    String firstname
    String secondname
    String phone
    String masterTZ

    String smsCentrLogin
    String smsCentrPass


    boolean enabled = true
    boolean accountExpired
    boolean accountLocked
    boolean passwordExpired

    static hasMany = [oAuthIDs: OAuthID, masters: User]
    static hasOne = [business: Business, role: Role]
    static transients = ['springSecurityService', 'masters', 'business', 'role']

    static constraints = {
        phone blank: false, nullable: false, unique: true, widget: "phone"
        username blank: true, nullable: true
        firstname blank: true, nullable: true
        secondname blank: true, nullable: true
        email blank: true, nullable: true
        password blank: false, display: false
        enabled display: false
        accountExpired display: false
        accountLocked display: false
        passwordExpired display: false
        oAuthIDs display: false

        smsCentrLogin blank: true, nullable: true
        smsCentrPass blank: true, nullable: true
        masterTZ blank: true, nullable: true
    }

    static search = {
        username index: 'tokenized'
        email index: 'tokenized'
        firstname index: 'tokenized'
        secondname index: 'tokenized'
        phone index: 'tokenized'
    }


    static mapping = {
        password column: '`password`'
    }

    Set<Role> getAuthorities() {
        UserRole.findAllByUser(this).collect { it.role }
    }

    def beforeInsert() {
        encodePassword()
    }

    def beforeUpdate() {
        if (isDirty('password')) {
            encodePassword()
        }
    }

    protected void encodePassword() {
        password = springSecurityService?.passwordEncoder ? springSecurityService.encodePassword(password) : password
    }

    String toString() {
        if (firstname != null && secondname != null) {
            return firstname.concat(' ').concat(secondname)
        } else {
            return phone
        }
    }

    static def getMasters() {
        Set<UserRole> userRoleSet = UserRole.findAllByRole(Role.findByAuthority("ROLE_ADMIN"))
        if (userRoleSet) {
            return userRoleSet.user
        } else {
            return null
        }
    }

    def getMasterTZAct() {
        return this.masterTZ ? this.masterTZ : "Asia/Baghdad"
    }

    def getRole() {
        if (this.authorities != null && !this.authorities.isEmpty() && (this.authorities.authority.contains(AuthKeys.CLIENT) ||
                this.authorities.authority.contains(AuthKeys.MASTER) ||
                this.authorities.authority.contains(AuthKeys.SUPER_MASTER))) {
            return Role.findAllByAuthority(this.authorities.toList().get(0).authority)
        } else {
            return null
        }
    }

    def getBusiness() {
        List<Business> userOrgs = Business.createCriteria().list() {
            masters {
                eq('id', this.id)
            }
        }
        if(userOrgs!=null && !userOrgs.isEmpty()){
            return userOrgs.first()
        }else {
            return null
        }
    }

}
