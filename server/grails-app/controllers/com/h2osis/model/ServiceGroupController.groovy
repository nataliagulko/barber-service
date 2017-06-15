package com.h2osis.model



import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class ServiceGroupController {

    static allowedMethods = [save: "POST", update: "PUT", delete: ["GET", "POST"]]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond ServiceGroup.list(params), model:[serviceGroupInstanceCount: ServiceGroup.count()]
    }

    def show(ServiceGroup serviceGroupInstance) {
        respond serviceGroupInstance
    }

    def create() {
        respond new ServiceGroup(params)
    }

    @Transactional
    def save(ServiceGroup serviceGroupInstance) {
        if (serviceGroupInstance == null) {
            notFound()
            return
        }

        if (serviceGroupInstance.hasErrors()) {
            respond serviceGroupInstance.errors, view:'create'
            return
        }

        serviceGroupInstance.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'serviceGroup.label', default: 'ServiceGroup'), serviceGroupInstance.id])
                redirect serviceGroupInstance
            }
            '*' { respond serviceGroupInstance, [status: CREATED] }
        }
    }

    def edit(ServiceGroup serviceGroupInstance) {
        respond serviceGroupInstance
    }

    @Transactional
    def update(ServiceGroup serviceGroupInstance) {
        if (serviceGroupInstance == null) {
            notFound()
            return
        }

        if (serviceGroupInstance.hasErrors()) {
            respond serviceGroupInstance.errors, view:'edit'
            return
        }

        serviceGroupInstance.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'ServiceGroup.label', default: 'ServiceGroup'), serviceGroupInstance.id])
                redirect serviceGroupInstance
            }
            '*'{ respond serviceGroupInstance, [status: OK] }
        }
    }

    @Transactional
    def delete(ServiceGroup serviceGroupInstance) {

        if (serviceGroupInstance == null) {
            notFound()
            return
        }
        
        try {

            Set<ServiceToGroup> linksToDelete = ServiceToGroup.findAllByGroup(serviceGroupInstance)
            if(linksToDelete){
                linksToDelete.each {
                    it.delete(flush: true)
                }
            }
            serviceGroupInstance.delete flush:true

            flash.message = g.message(code: 'default.deleted.message',
                    args: [message(code: 'ServiceGroup.label', default: 'Service'), serviceGroupInstance.id])

            redirect(controller: 'service', action: 'index')

        } catch (Exception e) {
            render(view: "../login/denied")
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'serviceGroup.label', default: 'ServiceGroup'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
