package server_next

import com.h2osis.auth.NovaRequestMap
import com.h2osis.constant.AuthKeys

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
                '/clientAjax/create',
                '/ticketAjax/create',
                '/businessAjax/create',
                '/slotAjax/**']) {
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
                '/searchable/**',
                '/springSecurityOAuth/**',
                '/userAjax/get',
                '/userAjax/save',
                '/userAjax/find',
                '/clientAjax/get',
                '/clientAjax/update',
                '/clientAjax/find',
                '/masterAjax/get',
                '/masterAjax/update',
                '/masterAjax/find',
                '/masterAjax/destroy',
        ]) {
            new NovaRequestMap(url: url, configAttribute: [AuthKeys.MASTER, AuthKeys.CLIENT, AuthKeys.SUPER_MASTER]).save(flush: true)
        }

        for (String url in [
                '/clientAjax/destroy',
                '/masterAjax/destroy',
                '/masterAjax/clientStatistic',
                '/masterAjax/payStatistic',
        ]) {
            new NovaRequestMap(url: url, configAttribute: [AuthKeys.MASTER, AuthKeys.SUPER_MASTER]).save(flush: true)
        }
    }
}
