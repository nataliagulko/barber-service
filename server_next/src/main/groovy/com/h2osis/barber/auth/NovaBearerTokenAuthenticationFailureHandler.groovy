package com.h2osis.barber.auth


import grails.plugin.springsecurity.rest.token.AccessToken
import grails.plugin.springsecurity.rest.token.bearer.BearerTokenReader
import groovy.util.logging.Slf4j
import org.springframework.security.core.AuthenticationException
import org.springframework.security.web.authentication.AuthenticationFailureHandler

import javax.servlet.ServletException
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

/**
 * Handles authentication failure when BearerToken authentication is enabled.
 */
@Slf4j
class NovaBearerTokenAuthenticationFailureHandler implements AuthenticationFailureHandler {

    BearerTokenReader tokenReader = new BearerTokenReader()

    /**
     * Sends the proper response code and headers, as defined by RFC6750.
     *
     * @param request
     * @param response
     * @param e
     * @throws IOException
     * @throws ServletException
     */
    @Override
    void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException e) throws IOException, ServletException {

        String headerValue
        AccessToken accessToken = tokenReader.findToken(request)

        if (accessToken) {
            headerValue = 'Bearer error="invalid_token"'
        } else {
            headerValue = 'Bearer'
        }

        response.addHeader('WWW-Authenticate', headerValue)
        response.status =  HttpServletResponse.SC_UNAUTHORIZED
        PrintWriter writer = response.getWriter()
        writer.print(e.toString())
        writer.close()

        log.debug "Sending status code ${response.status} and header WWW-Authenticate: ${response.getHeader('WWW-Authenticate')}"
    }
}
