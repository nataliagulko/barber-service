package com.h2osis.model.rest

class MainController {

    def springSecurityService
    static allowedMethods = [choose: ['POST', 'GET']]

    def index() {}
}
