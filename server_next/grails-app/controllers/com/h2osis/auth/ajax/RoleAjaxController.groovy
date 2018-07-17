package com.h2osis.auth.ajax

import com.h2osis.auth.Role
import grails.converters.JSON

class RoleAjaxController {

    def springSecurityService
    static allowedMethods = [choose: ['POST', 'GET']]

    def get(params) {
        def errors = []
		def data = params
        if (data && data.id) {
            Role role = Role.get(data.id)
            if (role) {
                JSON.use('roles') {
                    render([data: role] as JSON)
                }
            } else {
                errors.add([
                        "status": 422,
                        "detail": g.message(code: "role.not.found"),
                        "source": [
                                "pointer": "data"
                        ]
                ])
                response.status = 422
                render([errors: errors] as JSON)
            }
        } else {
            def query = request.JSON.query
            if (query && query.authority) {
                Role role = Role.findByAuthority(query.authority)
                if (role) {
                    JSON.use('roles') {
                        render([data: role] as JSON)
                    }
                } else {
                    errors.add([
                            "status": 422,
                            "detail": g.message(code: "role.not.found"),
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
                        "detail": g.message(code: "role.id.not.found"),
                        "source": [
                                "pointer": "data"
                        ]
                ])
                response.status = 422
                render([errors: errors] as JSON)
            }
        }
    }

    def list() {
        def errors = []
        List<Role> roleList = Role.all
        if (roleList) {
            JSON.use('roles') {
                render([data: roleList] as JSON)
            }
        } else {
            errors.add([
                    "status": 422,
                    "detail": g.message(code: "role.not.found"),
                    "source": [
                            "pointer": "data"
                    ]
            ])
            response.status = 422
            render([errors: errors] as JSON)
        }
    }
}
