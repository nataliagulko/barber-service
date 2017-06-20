package com.h2osis.model.rest

import com.h2osis.model.Business

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class BusinessController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond Business.list(params), model:[businessInstanceCount: Business.count()]
    }

    def show(Business businessInstance) {
        respond businessInstance
    }

    def create() {
        respond new Business(params)
    }

    @Transactional
    def save(Business businessInstance) {
        if (businessInstance == null) {
            notFound()
            return
        }

        if (businessInstance.hasErrors()) {
            respond businessInstance.errors, view:'create'
            return
        }

        businessInstance.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'business.label', default: 'Business'), businessInstance.id])
                redirect businessInstance
            }
            '*' { respond businessInstance, [status: CREATED] }
        }
    }

    def edit(Business businessInstance) {
        respond businessInstance
    }

    @Transactional
    def update(Business businessInstance) {
        if (businessInstance == null) {
            notFound()
            return
        }

        if (businessInstance.hasErrors()) {
            respond businessInstance.errors, view:'edit'
            return
        }

        businessInstance.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'Business.label', default: 'Business'), businessInstance.id])
                redirect businessInstance
            }
            '*'{ respond businessInstance, [status: OK] }
        }
    }

    @Transactional
    def delete(Business businessInstance) {

        if (businessInstance == null) {
            notFound()
            return
        }

        businessInstance.delete flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'Business.label', default: 'Business'), businessInstance.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'business.label', default: 'Business'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
