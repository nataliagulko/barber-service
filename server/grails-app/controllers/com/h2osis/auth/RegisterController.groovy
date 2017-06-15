package com.h2osis.auth

import com.h2osis.constant.AuthKeys
import com.h2osis.constant.SMSMessages
import com.h2osis.model.Business
import com.h2osis.utils.BarberSMSService
import com.h2osis.utils.BarberSecurityService
import grails.converters.JSON

import static org.springframework.http.HttpStatus.OK

class RegisterController {

    BarberSecurityService barberSecurityService
    def springSecurityService
    BarberSMSService barberSMSService

    def index() {
        render(view: "index.gsp")
    }

    def ajaxCheckLogin() {
        def res = false;
        if (User.findByPhone(params.phone)) {
            res = true
        }
        render(res)
    }

    def register() {

        if (params.password == null || params.password2 == "" ||
                params.phone == null || params.phone == "") {
            render(view: "index",
                    model: [login: params.login, secondname: params.secondname, firstname: params.firstname, passowrd: params.passowrd, regErrorMessage: g.message(code: 'auth.login.empty.err'),
                            phone: params.phone, email: params.email])
        } else if (params.password != params.password2) {
            render(view: "index",
                    model: [login: params.login, secondname: params.secondname, firstname: params.firstname, passowrd: params.passowrd, regErrorMessage: g.message(code: 'auth.reg.pass2.fail'),
                            phone: params.phone, email: params.email])
        } else if (!User.findByPhone(params.phone)) {
            User user = new User(username: params.login,
                    password: params.password,
                    email: params.email,
                    secondname: params.secondname,
                    firstname: params.firstname,
                    phone: params.phone).save(flush: true)


            if (params.businessId) {
                Business business = Business.get(params.businessId)
                if (business) {
                    if (params.userRole) {
                        business.addToClients(user)
                    } else if (params.masterRole) {
                        business.addToMasters(user)
                    }
                    business.save(flush: true)
                }
            }
            String authority = params.masterRole ? AuthKeys.ADMIN : (params.userRole ? AuthKeys.USER : null)
            if (authority) {
                Role role = Role.findByAuthority(authority)
                new UserRole(user: user, role: role).save(flush: true);
            }
            User.search().createIndexAndWait()
            redirect(controller: 'main', action: 'index')
        } else {
            render(view: "index",
                    model: [login: params.login, secondname: params.secondname, firstname: params.firstname, passowrd: params.passowrd, regErrorMessage: g.message(code: 'auth.login.not.iniq'),
                            phone: params.phone, email: params.email])
        }
    }

    def createChangePassRequest() {
        def principal = springSecurityService.principal
        User user = null
        String authorities = springSecurityService?.authentication?.authorities?.toString()
        if (authorities.contains("ROLE_USER") ||
                authorities.contains("ROLE_ADMIN")) {
            user = User.get(principal.id)
        }
        if (!user) {
            user = User.findByPhone(params.phone)
        }
        String code = barberSecurityService.generator((('A'..'Z') + ('0'..'9')).join(), 6)
        System.out.print("CODE for $user.phone: $code")
        String smsSendResult = barberSMSService.saveSendMsg(user, SMSMessages.passChangeMsg.concat(code))
        if (smsSendResult) {
            render([error: smsSendResult] as JSON)
        }
        ChangePassRequest changePassRequest = new ChangePassRequest(userId: user.id, pass: params.pass, code: code)
        changePassRequest.save(flush: true)
        render([id: changePassRequest.id, code: code] as JSON)
    }

    def submitChangePassRequest() {
        ChangePassRequest changePassRequest = ChangePassRequest.get(params.requestId)
        if (changePassRequest.code == params.code) {
            User user = User.get(changePassRequest.userId)
            user.setPassword(changePassRequest.pass)//encodePassword внутри применит криптографию
            user.save(flush: true)
            changePassRequest.delete(flush: true)
            render([status: 'ok'] as JSON)
        }
        render([msg: 'Неверный код. Попробуйте еще раз'] as JSON)
    }

    def changePassword() {
        def principal = springSecurityService.principal
        User user = null
        String authorities = springSecurityService?.authentication?.authorities?.toString()
        if (authorities.contains("ROLE_USER") ||
                authorities.contains("ROLE_ADMIN")) {
            user = User.get(principal.id)
        }
        if (!user) {
            user = User.findByPhone(params.phone)
        }
        render(view: "changePassword", model: [phone: user?.phone])
    }
}
