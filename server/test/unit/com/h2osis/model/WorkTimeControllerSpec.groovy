package com.h2osis.model

import com.h2osis.auth.User
import com.h2osis.model.rest.WorkTimeController
import grails.test.mixin.Mock
import grails.test.mixin.TestFor
import spock.lang.Specification

@TestFor(WorkTimeController)
@Mock([WorkTime, User])
class WorkTimeControllerSpec extends Specification {

    def populateValidParams(params) {
        assert params != null
        // TODO: Populate valid properties like...
        params["timeFrom"] = "9:00"
        params["timeTo"] = '18:00'
        params["dayOfWeek"] = 1
        User user = new User(username: "h2osis", password: "123", email: "sokolovep@gmail.com", fio: "h2osis", phone: "123").save(flush: true)
        params["master"] = User.findByUsername("h2osis")
    }

    void "Test the index action returns the correct model"() {

        when: "The index action is executed"
        controller.index()

        then: "The model is correct"
        !model.workTimeInstanceList
        model.workTimeInstanceCount == 0
    }

    void "Test the create action returns the correct model"() {
        when: "The create action is executed"
        controller.create()

        then: "The model is correctly created"
        model.workTimeInstance != null
    }

    void "Test the save action correctly persists an instance"() {

        when: "The save action is executed with an invalid instance"
        request.contentType = FORM_CONTENT_TYPE
        request.method = 'POST'
        def workTime = new WorkTime()
        workTime.validate()
        controller.save(workTime)

        then: "The create view is rendered again with the correct model"
        model.workTimeInstance != null
        view == 'create'

        when: "The save action is executed with a valid instance"
        response.reset()
        populateValidParams(params)
        workTime = new WorkTime(params)

        controller.save(workTime)

        then: "A redirect is issued to the show action"
        response.redirectedUrl == '/workTime/show/1'
        controller.flash.message != null
        WorkTime.count() == 1
    }

    void "Test that the show action returns the correct model"() {
        when: "The show action is executed with a null domain"
        controller.show(null)

        then: "A 404 error is returned"
        response.status == 404

        when: "A domain instance is passed to the show action"
        populateValidParams(params)
        def workTime = new WorkTime(params)
        controller.show(workTime)

        then: "A model is populated containing the domain instance"
        model.workTimeInstance == workTime
    }

    void "Test that the edit action returns the correct model"() {
        when: "The edit action is executed with a null domain"
        controller.edit(null)

        then: "A 404 error is returned"
        response.status == 404

        when: "A domain instance is passed to the edit action"
        populateValidParams(params)
        def workTime = new WorkTime(params)
        controller.edit(workTime)

        then: "A model is populated containing the domain instance"
        model.workTimeInstance == workTime
    }

    void "Test the update action performs an update on a valid domain instance"() {
        when: "Update is called for a domain instance that doesn't exist"
        request.contentType = FORM_CONTENT_TYPE
        request.method = 'PUT'
        controller.update(null)

        then: "A 404 error is returned"
        response.redirectedUrl == '/workTime/index'
        flash.message != null


        when: "An invalid domain instance is passed to the update action"
        response.reset()
        def workTime = new WorkTime()
        workTime.validate()
        controller.update(workTime)

        then: "The edit view is rendered again with the invalid instance"
        view == 'edit'
        model.workTimeInstance == workTime

        when: "A valid domain instance is passed to the update action"
        response.reset()
        populateValidParams(params)
        workTime = new WorkTime(params).save(flush: true)
        controller.update(workTime)

        then: "A redirect is issues to the show action"
        response.redirectedUrl == "/workTime/show/$workTime.id"
        flash.message != null
    }

    void "Test that the delete action deletes an instance if it exists"() {
        when: "The delete action is called for a null instance"
        request.contentType = FORM_CONTENT_TYPE
        request.method = 'DELETE'
        controller.delete(null)

        then: "A 404 is returned"
        response.redirectedUrl == '/workTime/index'
        flash.message != null

        when: "A domain instance is created"
        response.reset()
        populateValidParams(params)
        def workTime = new WorkTime(params).save(flush: true)

        then: "It exists"
        WorkTime.count() == 1

        when: "The domain instance is passed to the delete action"
        controller.delete(workTime)

        then: "The instance is deleted"
        WorkTime.count() == 0
        response.redirectedUrl == '/workTime/index'
        flash.message != null
    }
}
