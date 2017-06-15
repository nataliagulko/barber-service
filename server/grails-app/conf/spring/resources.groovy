// Place your Spring DSL code here
import grails.plugin.springsecurity.SpringSecurityUtils
beans = {
    authenticationSuccessHandler(h2osis.barber.auth.BarberAuthSuccessHandler) {
        def conf = SpringSecurityUtils.securityConfig
        requestCache = ref('requestCache')
        defaultTargetUrl = conf.successHandler.defaultTargetUrl
        alwaysUseDefaultTargetUrl = conf.successHandler.alwaysUseDefault
        targetUrlParameter = conf.successHandler.targetUrlParameter
        useReferer = conf.successHandler.useReferer
        redirectStrategy = ref('redirectStrategy')
    }
}
