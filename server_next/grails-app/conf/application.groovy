import com.h2osis.constant.AuthKeys

// Added by the Spring Security Core plugin:
grails.plugin.springsecurity.userLookup.userDomainClassName = 'com.h2osis.auth.User'
grails.plugin.springsecurity.userLookup.authorityJoinClassName = 'com.h2osis.auth.UserRole'
grails.plugin.springsecurity.userLookup.usernamePropertyName = 'phone'
grails.plugin.springsecurity.authority.className = 'com.h2osis.auth.Role'
grails.plugin.springsecurity.requestMap.className = 'com.h2osis.auth.NovaRequestMap'
grails.plugin.springsecurity.securityConfigType = 'Requestmap'
grails.plugin.springsecurity.controllerAnnotations.staticRules = [
		[pattern: '/',               access: ['permitAll']],
		[pattern: '/error',          access: ['permitAll']],
		[pattern: '/index',          access: ['permitAll']],
		[pattern: '/index.gsp',      access: ['permitAll']],
		[pattern: '/shutdown',       access: ['permitAll']],
		[pattern: '/assets/**',      access: ['permitAll']],
		[pattern: '/**/js/**',       access: ['permitAll']],
		[pattern: '/**/css/**',      access: ['permitAll']],
		[pattern: '/**/images/**',   access: ['permitAll']],
		[pattern: '/**/favicon.ico', access: ['permitAll']]

]

//grails.plugin.springsecurity.filterChain.chainMap = [
//		[pattern: '/assets/**',      filters: 'none'],
//		[pattern: '/**/js/**',       filters: 'none'],
//		[pattern: '/**/css/**',      filters: 'none'],
//		[pattern: '/**/images/**',   filters: 'none'],
//		[pattern: '/**/favicon.ico', filters: 'none'],
//		[pattern: '/api/**',    filters: 'JOINED_FILTERS,-exceptionTranslationFilter,-authenticationProcessingFilter,-securityContextPersistenceFilter'], // Stateless chain
//		[pattern: '/data/**',   filters: 'JOINED_FILTERS,-exceptionTranslationFilter,-authenticationProcessingFilter,-securityContextPersistenceFilter'], // Stateless chain
//		[pattern: '/**',        filters: 'JOINED_FILTERS,-restTokenValidationFilter,-restExceptionTranslationFilter']   // Traditional chain
//]


//grails.plugin.springsecurity.ui.register.postRegisterUrl = '/main/'
//grails.plugin.springsecurity.successHandler.defaultTargetUrl = '/main/'
//grails.plugin.springsecurity.successHandler.alwaysUseDefault = true

cors.headers = [
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': '*'
]

grails.plugin.springsecurity.filterChain.chainMap = [
		[pattern: '/userAjax/create', filters: 'anonymousAuthenticationFilter,restExceptionTranslationFilter,filterInvocationInterceptor'],
		[pattern: '/api/**',  filters: 'JOINED_FILTERS,-exceptionTranslationFilter,-authenticationProcessingFilter,-securityContextPersistenceFilter,-rememberMeAuthenticationFilter'],  // Stateless chain
		[pattern:'/**',  filters: 'JOINED_FILTERS,-exceptionTranslationFilter,-authenticationProcessingFilter,-securityContextPersistenceFilter,-rememberMeAuthenticationFilter']  // Stateless chain
		// '/**': 'JOINED_FILTERS,-restTokenValidationFilter,-restExceptionTranslationFilter'                                                                          // Traditional chain
]

grails.plugin.springsecurity.rest.token.validation.enableAnonymousAccess = true
grails.plugin.springsecurity.rest.login.active=true
grails.plugin.springsecurity.rest.login.failureStatusCode=400
grails.plugin.springsecurity.rest.token.validation.active=true

grails.plugin.springsecurity.logout.postOnly=false

