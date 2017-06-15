package com.h2osis.utils

import com.h2osis.auth.User
import grails.transaction.Transactional
import h2osis.barber.sms.SMSSender

@Transactional
class BarberSMSService {

    def springSecurityService
    SMSSender sender = new SMSSender()

    def saveSendMsg(User user, String msg) {
        def principal = springSecurityService.principal
        String authorities = springSecurityService?.authentication?.authorities?.toString()
        if (authorities && (authorities.contains("ROLE_USER") ||
                authorities.contains("ROLE_ADMIN")) && User.get(principal.id).smsCentrLogin && User.get(principal.id).currentUser.smsCentrPass) {
            User currentUser = User.get(principal.id)
            saveSendMsg(currentUser.smsCentrLogin, currentUser.smsCentrPass, user, msg)
        } else {
            String phone = user.phone.replaceAll("\\+7", "8").replaceAll('\\(', '').replaceAll("\\)", "")
            try {
                sender.send_sms(phone, msg, 0, "", "", 0, "", "maxsms=3");
            } catch (Exception e) {
                log.error(e)
                return e.toString()
            }
        }
        return null
    }

    def saveSendMsg(String login, String pass, User user, String msg) {
        String phone = user.phone.replaceAll("\\+7", "8").replaceAll('\\(', '').replaceAll("\\)", "")
        try {
            SMSSender customSender = new SMSSender(login, pass)
            customSender.send_sms(phone, msg, 0, "", "", 0, "", "maxsms=3");
        } catch (Exception e) {
            log.error(e)
            return e.toString()
        }
        return null
    }

    def saveSendMsg(SMSSender customSender, User user, String msg) {
        String phone = user.phone.replaceAll("\\+7", "8").replaceAll('\\(', '').replaceAll("\\)", "")
        customSender.send_sms(phone, msg, 0, "", "", 0, "", "maxsms=3");
        return null
    }

    def saveSendMsgs(List<User> users, String msg) {
        def principal = springSecurityService.principal
        String authorities = springSecurityService?.authentication?.authorities?.toString()
        if (authorities && (authorities.contains("ROLE_USER") ||
                authorities.contains("ROLE_ADMIN")) && User.get(principal.id).smsCentrLogin && User.get(principal.id).currentUser.smsCentrPass) {
            User currentUser = User.get(principal.id)
            SMSSender customSender = new SMSSender(currentUser.smsCentrLogin, currentUser.smsCentrPass)
            List<User> sendedList = new ArrayList<User>()
            users.each {
                try {
                    saveSendMsg(customSender, it, msg)
                    sendedList.add(it)
                } catch (Exception e) {
                    return users.minus(sendedList)?.toString().concat(e?.toString())
                }
            }

        } else {
            List<User> sendedList = new ArrayList<User>()
            users.each {
                String phone = it.phone.replaceAll("\\+7", "8").replaceAll('\\(', '').replaceAll("\\)", "")
                try {
                    sender.send_sms(phone, msg, 0, "", "", 0, "", "maxsms=3");
                    sendedList.add(it)
                } catch (Exception e) {
                    return users.minus(sendedList)?.toString().concat(e?.toString())
                }
            }
        }
        return null
    }
}
