package com.h2osis.model.ajax

import com.h2osis.auth.Role
import com.h2osis.auth.User
import com.h2osis.auth.UserRole
import constant.AuthKeys
import com.h2osis.model.UsersService
import com.h2osis.utils.BarberSecurityService
import com.h2osis.utils.NovaUtilsService
import com.h2osis.utils.SearchService
import grails.converters.JSON

class ClientAjaxController {

    SearchService searchService
    def springSecurityService
    BarberSecurityService barberSecurityService
    UsersService usersService
    NovaUtilsService novaUtilsService
    static allowedMethods = [choose: ['POST', 'GET']]

    def create() {
        def data = request.JSON.data
        def attrs = data.attributes
        def errors = []
        if (attrs.phone && attrs.firstname) {
                def result = usersService.createUser(attrs)
                if (result instanceof User) {
                    //result.setPassword(null)
                    Role role = Role.findByAuthority(AuthKeys.CLIENT)
                    new UserRole(user: result, role: role).save(flush: true);
                    JSON.use('clients') {
                        render([data: result] as JSON)
                    }
                } else {
                    errors.add([
                        "status": 422,
                        "detail": result,
                        "source": [
                                "pointer": "data"
                        ]
                    ])
                    response.status = 422
                    render([errors: errors] as JSON)
                }
        } else {
            errors.add([
                        "status": 422,
                        "detail": g.message(code: "user.phone.null"),
                        "source": [
                                "pointer": "data"
                        ]
                    ])
            response.status = 422
            render([errors: errors] as JSON)
        }
    }

    def get(params) {
		def errors = []
        def data = params
        if (data.id) {
            User user = User.get(data.id)
            if (user) {
                user.setPassword(null)
                //render([user: user, holidays: Holiday.findAllByMaster(user), worktTmesMap: worktTmesMap] as JSON)
                JSON.use('clients') {
                    render([data: user] as JSON)
                }
            } else {
				errors.add([
                        "status": 422,
                        "detail": g.message(code: "user.get.user.not.found"),
                        "source": [
                                "pointer": "data"
                        ]
                    ])
                    response.status = 422
                    render([errors: errors] as JSON)
            }
        } else if (data && data.phone) {
			User user = User.findByPhone(data.phone)
			if(!user){
				user = User.findByPhone(novaUtilsService.getFullPhone(data.phone))
			}
			if (user) {
				user.setPassword(null)
				JSON.use('clients') {
					render([data: user] as JSON)
				}
			} else {
				// render([errors:
								// novaUtilsService.getErrorsSingleArrayJSON(g.message(code: "user.get.user.by.phone.not.found"))] as JSON)
				errors.add([
					"status": 422,
					"detail": g.message(code: "user.get.user.by.phone.not.found"),
					"source": [
							"pointer": "data"
					]
				])
				response.status = 422
				render([errors: errors] as JSON)
			}
		} else {
			render([errors: novaUtilsService.getErrorsSingleArrayJSON(g.message(code: "user.get.id.null"))] as JSON)
		}
    }

    def update() {
        def data = request.JSON.data
        if (data.id) {
            User user = User.get(data.id)
            if (user) {
                usersService.saveUser(data.attributes, user)
                JSON.use('clients') {
                    render([data: user] as JSON)
                }
            } else {
                render([errors: { g.message(code: "user.get.user.not.found") }] as JSON)
            }
        } else {
            render([errors: { g.message(code: "user.get.id.null") }] as JSON)
        }
    }

    def find(params) {
        if (params.value) {
            String value = params.value
            List<User> listOfUsers = searchService.userSearch(value)
            if (listOfUsers) {
                listOfUsers.each { it -> it.setPassword(null) }
                render(listOfUsers as JSON)
            } else {
                render([msg: g.message(code: "user.fine.not.found")] as JSON)
            }
        } else {
            render([msg: g.message(code: "find.value.null")] as JSON)
        }
    }

    def list() {
        List<User> userList = UserRole.findAllByRole(Role.findByAuthority("ROLE_USER")).user
        if (userList) {
            JSON.use('clients') {
                render([data: userList] as JSON)
            }
        } else {
            render([errors: g.message(code: "user.fine.not.found")] as JSON)
        }
    }

    def destroy(params) {
        def data = params
        if (data.id) {
            User user = User.get(data.id)
            if (user) {
                user.setEnabled(false)
                user.save(flush: true)
                render([errors: []] as JSON)

            } else {
                render([errors: { g.message(code: "user.get.user.not.found") }] as JSON)
            }
        } else {
            render([errors: { g.message(code: "user.get.id.null") }] as JSON)
        }
    }
}
