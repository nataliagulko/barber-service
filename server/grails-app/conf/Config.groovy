// locations to search for config files that get merged into the main config;
// config files can be ConfigSlurper scripts, Java properties files, or classes
// in the classpath in ConfigSlurper format

// grails.config.locations = [ "classpath:${appName}-config.properties",
//                             "classpath:${appName}-config.groovy",
//                             "file:${userHome}/.grails/${appName}-config.properties",
//                             "file:${userHome}/.grails/${appName}-config.groovy"]

// if (System.properties["${appName}.config.location"]) {
//    grails.config.locations << "file:" + System.properties["${appName}.config.location"]
// }
grails.config.locations = ["file:${userHome}/nova/nova-config.groovy"]

grails.project.groupId = appName // change this to alter the default package name and Maven publishing destination

// The ACCEPT header will not be used for content negotiation for user agents containing the following strings (defaults to the 4 major rendering engines)
grails.mime.disable.accept.header.userAgents = ['Gecko', 'WebKit', 'Presto', 'Trident']
grails.mime.types = [ // the first one is the default format
                      all          : '*/*', // 'all' maps to '*' or the first available format in withFormat
                      atom         : 'application/atom+xml',
                      css          : 'text/css',
                      csv          : 'text/csv',
                      form         : 'application/x-www-form-urlencoded',
                      html         : ['text/html', 'application/xhtml+xml'],
                      js           : 'text/javascript',
                      json         : ['application/json', 'text/json'],
                      multipartForm: 'multipart/form-data',
                      rss          : 'application/rss+xml',
                      text         : 'text/plain',
                      hal          : ['application/hal+json', 'application/hal+xml'],
                      xml          : ['text/xml', 'application/xml']
]

// URL Mapping Cache Max Size, defaults to 5000
//grails.urlmapping.cache.maxsize = 1000

// Legacy setting for codec used to encode data with ${}
grails.views.default.codec = "html"

// The default scope for controllers. May be prototype, session or singleton.
// If unspecified, controllers are prototype scoped.
grails.controllers.defaultScope = 'singleton'

// GSP settings
grails {
    views {
        gsp {
            encoding = 'UTF-8'
            htmlcodec = 'xml' // use xml escaping instead of HTML4 escaping
            codecs {
                expression = 'html' // escapes values inside ${}
                scriptlet = 'html' // escapes output from scriptlets in GSPs
                taglib = 'none' // escapes output from taglibs
                staticparts = 'none' // escapes output from static template parts
            }
        }
        // escapes all not-encoded output at final stage of outputting
        // filteringCodecForContentType.'text/html' = 'html'
    }
}


grails.converters.encoding = "UTF-8"
// scaffolding templates configuration
grails.scaffolding.templates.domainSuffix = 'Instance'

// Set to false to use the new Grails 1.2 JSONBuilder in the render method
grails.json.legacy.builder = false
// enabled native2ascii conversion of i18n properties files
grails.enable.native2ascii = true
// packages to include in Spring bean scanning
grails.spring.bean.packages = []
// whether to disable processing of multi part requests
grails.web.disable.multipart = false

// request parameters to mask when logging exceptions
grails.exceptionresolver.params.exclude = ['password']

// configure auto-caching of queries by default (if false you can cache individual queries with 'cache: true')
grails.hibernate.cache.queries = false

// configure passing transaction's read-only attribute to Hibernate session, queries and criterias
// set "singleSession = false" OSIV mode in hibernate configuration after enabling
grails.hibernate.pass.readonly = false
// configure passing read-only to OSIV session by default, requires "singleSession = false" OSIV mode
grails.hibernate.osiv.readonly = false

def baseURL
def appName = "barber-site"
environments {
    development {
        grails.logging.jul.usebridge = true
        baseURL = "http://localhost:8090/${appName}"
    }
    production {
        grails.logging.jul.usebridge = false
        baseURL = "http://xn--b1algqmgf3b.xn--p1ai"
    }
}

// log4j configuration
log4j.main = {
    // Example of changing the log pattern for the default console appender:
    //
    //appenders {
    //    console name:'stdout', layout:pattern(conversionPattern: '%c{2} %m%n')
    //}

    error 'org.codehaus.groovy.grails.web.servlet',        // controllers
            'org.codehaus.groovy.grails.web.pages',          // GSP
            'org.codehaus.groovy.grails.web.sitemesh',       // layouts
            'org.codehaus.groovy.grails.web.mapping.filter', // URL mapping
            'org.codehaus.groovy.grails.web.mapping',        // URL mapping
            'org.codehaus.groovy.grails.commons',            // core / classloading
            'org.codehaus.groovy.grails.plugins',            // plugins
            'org.codehaus.groovy.grails.orm.hibernate',      // hibernate integration
            'org.springframework',
            'org.hibernate',
            'net.sf.ehcache.hibernate'
}

grails.plugin.springsecurity.userLookup.userDomainClassName = 'com.h2osis.auth.User'
grails.plugin.springsecurity.userLookup.authorityJoinClassName = 'com.h2osis.auth.UserRole'
grails.plugin.springsecurity.userLookup.usernamePropertyName = 'phone'
grails.plugin.springsecurity.authority.className = 'com.h2osis.auth.Role'
grails.plugin.springsecurity.ui.register.defaultRoleNames = [AuthKeys.USER]
grails.plugin.springsecurity.oauth.registration.roleNames = [AuthKeys.USER]
//grails.plugin.springsecurity.ui.register.postRegisterUrl = '/main/'
grails.plugin.springsecurity.successHandler.defaultTargetUrl = '/main/'
grails.plugin.springsecurity.successHandler.alwaysUseDefault = true

grails.plugin.springsecurity.securityConfigType = "InterceptUrlMap"
grails.plugin.springsecurity.interceptUrlMap = [
        '/main'                 : ["ROLE_ADMIN", "ROLE_USER"],
        '/main/index'           : ["ROLE_ADMIN", "ROLE_USER"],
        '/main/'                : ["ROLE_ADMIN", "ROLE_USER"],
        '/user/**'              : ["ROLE_ADMIN", "ROLE_USER"],
        '/userAjax/get'         : ["ROLE_ADMIN", "ROLE_USER"],
        '/userAjax/save'        : ["ROLE_ADMIN", "ROLE_USER"],
        '/userAjax/find'        : ["ROLE_ADMIN", "ROLE_USER"],
        '/userAjax/block'       : ["ROLE_ADMIN"],
        '/userAjax/getWorktimes': ["ROLE_ADMIN", "ROLE_USER"],
        '/userAjax/getHolidays' : ["ROLE_ADMIN", "ROLE_USER"],
        '/userAjax/getHolidaysJson' : ["ROLE_ADMIN", "ROLE_USER"],
        '/userAjax/saveWorkTime'    : ["ROLE_ADMIN"],
        '/userAjax/saveHoliday' : ["ROLE_ADMIN"],
        '/userAjax/deleteWorkTime'  : ["ROLE_ADMIN"],
        '/userAjax/deleteHoliday'   : ["ROLE_ADMIN"],
        '/userAjax/saveByPhone' : ["ROLE_ADMIN", "ROLE_USER"],
        '/userAjax/blockUser'   : ["ROLE_ADMIN"],
        '/userAjax/unBlockUser' : ["ROLE_ADMIN"],
        '/userAjax/create'      : ["permitAll"],

        '/clientAjax/get'         : ["ROLE_ADMIN", "ROLE_USER"],
        '/clientAjax/update'        : ["ROLE_ADMIN", "ROLE_USER"],
        '/clientAjax/find'        : ["ROLE_ADMIN", "ROLE_USER"],
        '/clientAjax/block'       : ["ROLE_ADMIN"],
        '/clientAjax/getWorktimes': ["ROLE_ADMIN", "ROLE_USER"],
        '/clientAjax/getHolidays' : ["ROLE_ADMIN", "ROLE_USER"],
        '/clientAjax/getHolidaysJson' : ["ROLE_ADMIN", "ROLE_USER"],
        '/clientAjax/saveWorkTime'    : ["ROLE_ADMIN"],
        '/clientAjax/saveHoliday' : ["ROLE_ADMIN"],
        '/clientAjax/deleteWorkTime'  : ["ROLE_ADMIN"],
        '/clientAjax/deleteHoliday'   : ["ROLE_ADMIN"],
        '/clientAjax/destroy'   : ["ROLE_ADMIN"],
        '/clientAjax/saveByPhone' : ["ROLE_ADMIN", "ROLE_USER"],
        '/clientAjax/blockUser'   : ["ROLE_ADMIN"],
        '/clientAjax/unBlockUser' : ["ROLE_ADMIN"],
        '/clientAjax/create'      : ["permitAll"],
        '/clientAjax/list'      : ["permitAll"],

        '/masterAjax/get'         : ["ROLE_ADMIN", "ROLE_USER"],
        '/masterAjax/update'        : ["ROLE_ADMIN", "ROLE_USER"],
        '/masterAjax/find'        : ["ROLE_ADMIN", "ROLE_USER"],
        '/masterAjax/destroy'        : ["ROLE_ADMIN", "ROLE_USER"],
        '/masterAjax/block'       : ["ROLE_ADMIN"],
        '/masterAjax/getWorktimes': ["ROLE_ADMIN", "ROLE_USER"],
        '/masterAjax/getHolidays' : ["ROLE_ADMIN", "ROLE_USER"],
        '/masterAjax/getHolidaysJson' : ["ROLE_ADMIN", "ROLE_USER"],
        '/masterAjax/saveWorkTime'    : ["ROLE_ADMIN"],
        '/masterAjax/saveHoliday' : ["ROLE_ADMIN"],
        '/masterAjax/deleteWorkTime'  : ["ROLE_ADMIN"],
        '/masterAjax/deleteHoliday'   : ["ROLE_ADMIN"],
        '/masterAjax/destroy'   : ["ROLE_ADMIN"],
        '/masterAjax/saveByPhone' : ["ROLE_ADMIN", "ROLE_USER"],
        '/masterAjax/blockUser'   : ["ROLE_ADMIN"],
        '/masterAjax/unBlockUser' : ["ROLE_ADMIN"],
        '/masterAjax/create'      : ["permitAll"],
        '/masterAjax/list'      : ["permitAll"],

        '/serviceAjax/**'       : ["ROLE_ADMIN", "ROLE_USER"],
        '/ticketAjax/**'        : ["ROLE_ADMIN", "ROLE_USER"],
        '/workTimeAjax/**'      : ["ROLE_ADMIN", "ROLE_USER"],
        '/holidayAjax/**'      : ["ROLE_ADMIN", "ROLE_USER"],        
        '/businessAjax/**'      : ["ROLE_ADMIN", "ROLE_USER"],
        '/service/**'           : ["ROLE_ADMIN", "ROLE_USER"],
        '/serviceGroup/**'      : ["ROLE_ADMIN", "ROLE_USER"],
        '/serviceGroupAjax/**'  : ["ROLE_ADMIN", "ROLE_USER"],
        '/serviceToGroupAjax/**'  : ["ROLE_ADMIN", "ROLE_USER"],
        '/slotAjax/**'          : ["ROLE_ADMIN", "ROLE_USER"],
        '/ticket/**'            : ["ROLE_ADMIN", "ROLE_USER"],
        '/worktime/**'          : ["ROLE_ADMIN", "ROLE_USER"],
        '/business/**'          : ["ROLE_ADMIN", "ROLE_USER"],
        '/searchable/**'        : ["ROLE_ADMIN", "ROLE_USER"],
        '/springSecurityOAuth/**': ["ROLE_ADMIN", "ROLE_USER"],
        '/UtilsAjax/**': ["ROLE_ROOT"],

        '/**/js/**'                 : ['permitAll'],
        '/**/css/**'                : ['permitAll'],
        '/**/images/**'             : ['permitAll'],
        '/**/tmpls/**'              : ['permitAll'],
        '/**/libraries/**'          : ['permitAll'],
        '/**/favicon.ico'           : ['permitAll'],
        '/login/**'                 : ['permitAll'],
        '/logout/**'                : ['permitAll'],
        '/oauth/**'                 : ['permitAll'],
        '/register/**'              : ['permitAll'],
        '/user/changePassword/**'   : ['permitAll'],
        '**/fonts/**'               : ['permitAll'],
        '/**/assets/**'             : ['permitAll']
]

oauth {
    debug = true
    providers {
        vkontakte {
            api = org.scribe.builder.api.VkontakteApi
            key = '5589429'
            secret = 'SPJR0iEzF3AVkmLIzjwp'
            successUri = "${baseURL}/oauth/vkontakte/success"
            failureUri = '/oauth/vkontakte/error'
            callback = "${baseURL}/oauth/vkontakte/callback"
            scope = "email"
        }
    }
}

grails.plugin.springsecurity.ui.password.validationRegex = '^([a-zA-Z0-9]+)$'
grails.plugin.springsecurity.ui.password.minLength = 6
grails.plugin.springsecurity.ui.password.maxLength = 20

grails.resources.adhoc.includes = ['/images/**', '/css/**', '/js/**', '/fonts/**', '/javascripts/**', '/scss/**', '/stylesheets/**', '/less/**', '/tmpls/**']
grails.gorm.failOnError = true

grails.databinding.dateFormats = ["dd.MM.yyyy", "yyyy-MM-dd HH:mm:ss.S", "yyyy-MM-dd HH:mm:ss"]

grails.plugins.twitterbootstrap.fixtaglib = true

cors.headers = [
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*'
]

grails.plugin.springsecurity.filterChain.chainMap = [
        '/userAjax/create': 'anonymousAuthenticationFilter,restExceptionTranslationFilter,filterInvocationInterceptor',
        '/api/**': 'JOINED_FILTERS,-exceptionTranslationFilter,-authenticationProcessingFilter,-securityContextPersistenceFilter,-rememberMeAuthenticationFilter',  // Stateless chain
        '/**': 'JOINED_FILTERS,-exceptionTranslationFilter,-authenticationProcessingFilter,-securityContextPersistenceFilter,-rememberMeAuthenticationFilter',  // Stateless chain
       // '/**': 'JOINED_FILTERS,-restTokenValidationFilter,-restExceptionTranslationFilter'                                                                          // Traditional chain
]
rest {
    token {
        validation {
            enableAnonymousAccess = true
        }
    }
}
grails.plugin.springsecurity.rest.login.active=true
grails.plugin.springsecurity.rest.login.failureStatusCode=401
grails.plugin.springsecurity.rest.token.validation.active=true

grails.plugin.springsecurity.logout.postOnly=false