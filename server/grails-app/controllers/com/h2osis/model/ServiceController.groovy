package com.h2osis.model

import grails.transaction.Transactional

import static org.springframework.http.HttpStatus.*

@Transactional(readOnly = true)
class ServiceController {

    static allowedMethods = [save: "POST", update: "PUT", delete: ["GET", "POST"]]

    //ссыль на фабрику сессий
    def sessionFactory

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        params.sort = "name"
        render(view: "index",  model: [serviceInstanceList:  Service.list(params), serviceInstanceCount: Service.count()])
    }

    def show(Service serviceInstance) {
        respond serviceInstance
    }

    def create() {
        respond new Service(params)
    }

    @Transactional
    def save(Service serviceInstance) {
        if (serviceInstance == null) {
            notFound()
            return
        }

        if (serviceInstance.hasErrors()) {
            respond serviceInstance.errors, view: 'create'
            return
        }

        serviceInstance.save flush: true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'service.label', default: 'Service'), serviceInstance.id])
                redirect serviceInstance
            }
            '*' { respond serviceInstance, [status: CREATED] }
        }
    }

    def edit(Service serviceInstance) {
        respond serviceInstance
    }

    @Transactional
    def update(Service serviceInstance) {
        if (serviceInstance == null) {
            notFound()
            return
        }

        if (serviceInstance.hasErrors()) {
            respond serviceInstance.errors, view: 'edit'
            return
        }

        serviceInstance.save flush: true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'Service.label', default: 'Service'), serviceInstance.id])
                redirect serviceInstance
            }
            '*' { respond serviceInstance, [status: OK] }
        }
    }

    @Transactional
    def delete(Service serviceInstance) {

        if (serviceInstance == null) {
            notFound()
            return
        }

        try {
            serviceInstance.delete flush: true

            flash.message = g.message(code: 'default.deleted.message',
                    args: [message(code: 'Service.label', default: 'Service'), serviceInstance.id])

            redirect(action: 'index')

        } catch (Exception e) {
            render(view: "../login/denied")
        }

    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'service.label', default: 'Service'), params.id])
                redirect action: "index", method: "GET"
            }
            '*' { render status: NOT_FOUND }
        }
    }
    
    def pricelist(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        params.sort = "name"
        render(view: "pricelist",  model: [serviceInstanceList:  Service.getOnlySubServices(params, sessionFactory)?.findAll {
            (it.class == Service.class)
        }, serviceInstanceCount: Service.count()])
    }
}
