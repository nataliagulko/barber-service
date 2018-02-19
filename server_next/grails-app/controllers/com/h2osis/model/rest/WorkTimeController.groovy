package com.h2osis.model.rest

import com.h2osis.model.WorkTime

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class WorkTimeController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond WorkTime.list(params), model:[workTimeInstanceCount: WorkTime.count()]
    }

    def show(WorkTime workTimeInstance) {
        respond workTimeInstance
    }

    def create() {
        respond new WorkTime(params)
    }

    @Transactional
    def save(WorkTime workTimeInstance) {
        if (workTimeInstance == null) {
            notFound()
            return
        }

        if (workTimeInstance.hasErrors()) {
            respond workTimeInstance.errors, view:'create'
            return
        }

        workTimeInstance.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'workTime.label', default: 'WorkTime'), workTimeInstance.id])
                redirect workTimeInstance
            }
            '*' { respond workTimeInstance, [status: CREATED] }
        }
    }

    def edit(WorkTime workTimeInstance) {
        respond workTimeInstance
    }

    @Transactional
    def update(WorkTime workTimeInstance) {
        if (workTimeInstance == null) {
            notFound()
            return
        }

        if (workTimeInstance.hasErrors()) {
            respond workTimeInstance.errors, view:'edit'
            return
        }

        workTimeInstance.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'WorkTime.label', default: 'WorkTime'), workTimeInstance.id])
                redirect workTimeInstance
            }
            '*'{ respond workTimeInstance, [status: OK] }
        }
    }

    @Transactional
    def delete(WorkTime workTimeInstance) {

        if (workTimeInstance == null) {
            notFound()
            return
        }

        workTimeInstance.delete flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'WorkTime.label', default: 'WorkTime'), workTimeInstance.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'workTime.label', default: 'WorkTime'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
