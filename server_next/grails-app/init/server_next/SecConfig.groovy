package server_next

import com.h2osis.auth.NovaRequestMap

class SecConfig {

    def init = {

        for (String url in [
                '/error',
                '/**/js/**',
                '/**/css/**',
                '/**/images/**',
                '/**/tmpls/**',
                '/**/libraries/**',
                '/**/libraries/**',
                '/**/favicon.ico',
                '/api/login/**',
                '/api/logout/**',
                '/login/**',
                '/logout/**',
                '/oauth/**',
                '/register/**',
                '/user/changePassword/**',
                '**/fonts/**',
                '/**/assets/**',
                '/masterAjax/create',
                '/masterAjax/list',
                '/clientAjax/list',
                '/userAjax/create',
                '/clientAjax/create']) {
            new NovaRequestMap(url: url, configAttribute: 'permitAll').save(flush: true)
        }

        for (String url in [
                '/serviceAjax/**',
                '/ticketAjax/**',
                '/worktimeAjax/**',
                '/holidayAjax/**',
                '/businessAjax/**',
                '/service/**',
                '/serviceGroup/**',
                '/serviceGroupAjax/**',
                '/serviceToGroupAjax/**',
                '/ticket/**',
                '/worktime/**',
                '/business/**',
                '/searchable/**',
                '/springSecurityOAuth/**',
                '/main',
                '/main/index',
                '/main/',
                '/user/**',
                '/userAjax/get',
                '/userAjax/save',
                '/userAjax/find',
                '/userAjax/getWorktimes',
                '/userAjax/getHolidays',
                '/userAjax/getHolidaysJson',
                '/userAjax/saveByPhone',
                '/clientAjax/get',
                '/clientAjax/update',
                '/clientAjax/find',
                '/clientAjax/getWorktimes',
                '/clientAjax/getHolidays',
                '/clientAjax/getHolidaysJson',
                '/clientAjax/saveByPhone',
                '/masterAjax/get',
                '/masterAjax/update',
                '/masterAjax/find',
                '/masterAjax/destroy',
                '/masterAjax/getWorktimes',
                '/masterAjax/getHolidays',
                '/masterAjax/getHolidaysJson',
                '/masterAjax/saveByPhone'
        ]) {
            new NovaRequestMap(url: url, configAttribute: ["ROLE_ADMIN", "ROLE_USER"]).save(flush: true)
        }

        for (String url in [
                '/userAjax/block',
                '/userAjax/saveWorkTime',
                '/userAjax/saveHoliday',
                '/userAjax/deleteWorkTime',
                '/userAjax/deleteHoliday',
                '/userAjax/blockUser',
                '/userAjax/unBlockUser',
                '/clientAjax/block',
                '/clientAjax/saveWorkTime',
                '/clientAjax/saveHoliday',
                '/clientAjax/deleteWorkTime',
                '/clientAjax/deleteHoliday',
                '/clientAjax/destroy',
                '/clientAjax/blockUser',
                '/clientAjax/unBlockUser',
                '/masterAjax/block',
                '/masterAjax/saveWorkTime',
                '/masterAjax/saveHoliday',
                '/masterAjax/deleteWorkTime',
                '/masterAjax/deleteHoliday',
                '/masterAjax/destroy',
                '/masterAjax/blockUser',
                '/masterAjax/unBlockUser',
        ]) {
            new NovaRequestMap(url: url, configAttribute: "ROLE_ADMIN").save(flush: true)
        }
    }
}
