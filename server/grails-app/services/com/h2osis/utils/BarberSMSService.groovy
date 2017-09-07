package com.h2osis.utils

import com.h2osis.auth.User
import com.h2osis.model.Business
import com.h2osis.model.Ticket
import grails.transaction.Transactional
import grails.util.Environment
import h2osis.barber.sms.SMSSender
import org.apache.commons.lang.StringUtils

@Transactional
class BarberSMSService {

    def springSecurityService
    SMSSender sender = new SMSSender()

    def saveSendMsg(User user, String msg) {
        def principal = springSecurityService.principal
        String authorities = springSecurityService?.authentication?.authorities?.toString()
        List<Business> curOrgs = null
        if(authorities
                && (authorities.contains("ROLE_USER") || authorities.contains("ROLE_ADMIN"))) {
            curOrgs = Business.createCriteria().list() {
                isNotNull('smsCentrLogin')
                masters {
                    eq('id', principal.id)
                }

            }
        }

        if (authorities
                && (authorities.contains("ROLE_USER") || authorities.contains("ROLE_ADMIN"))
                && curOrgs) {
            Business org = curOrgs.first()
            saveSendMsg(org.smsCentrLogin, org.smsCentrPass, user, msg)
        } else {
            String phone = user.phone.replaceAll("\\+7", "8").replaceAll('\\(', '').replaceAll("\\)", "")
            try {
                if (Environment.current == Environment.PRODUCTION) {
                    sender.send_sms(phone, msg, 0, "", "", 0, "", "maxsms=3");
                } else {
                    println phone.concat(" ").concat(msg)
                }
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
            if (Environment.current == Environment.PRODUCTION) {
                SMSSender customSender = new SMSSender(login, pass)
                customSender.send_sms(phone, msg, 0, "", "", 0, "", "maxsms=3");
            } else {
                println phone.concat(" ").concat(msg)
            }
        } catch (Exception e) {
            log.error(e)
            return e.toString()
        }
        return null
    }

    def saveSendMsg(SMSSender customSender, User user, String msg) {
        String phone = user.phone.replaceAll("\\+7", "8").replaceAll('\\(', '').replaceAll("\\)", "")
        if (Environment.current == Environment.PRODUCTION) {
            customSender.send_sms(phone, msg, 0, "", "", 0, "", "maxsms=3");
        } else {
            println phone.concat(" ").concat(msg)
        }
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

    def sendTicketUpdateSMS(Ticket ticketInstance) {
        String ticketDate = ticketInstance.ticketDate.format('dd.MM.yyyy')
        String sms = "Ваша запись на $ticketDate в $ticketInstance.time изменена. \n"
        if (ticketInstance.isDirty("status")) {
            sms = sms.concat("Новый статус: ".concat(Ticket.getStatusTextByCode(ticketInstance.status)).concat("\n"))
        }
        if(ticketInstance.isDirty("services")){
            sms = sms.concat("Новые услуги: ").concat(StringUtils.join(ticketInstance.services.name, ", ")).concat("\n")
        }
        if(ticketInstance.isDirty("comment")){
            sms = sms.concat("Новый комментарий: ").concat(ticketInstance.comment).concat("\n")
        }
        if(ticketInstance.isDirty("ticketDate") || ticketInstance.isDirty("time")) {
            sms = sms.concat("Новые дата и время: ").concat(ticketInstance.ticketDate.format("dd.MM.yyyy"))
                    .concat(" ").concat(ticketInstance.time).concat("\n")
        }

        saveSendMsg(ticketInstance.user, sms)
    }

    def sendTicketCreateSMS(Ticket ticketInstance) {
        String sms = "Спасибо за запись!".concat("\n")
        sms = sms.concat("Жду вас ".concat(ticketInstance.ticketDate.format("dd.MM.yyyy"))).concat(" в ").concat(ticketInstance.time).concat("\n")
        sms = sms.concat("На услуги: ").concat(StringUtils.join(ticketInstance.services.name, ", "))
        saveSendMsg(ticketInstance.user, sms)
    }
}
