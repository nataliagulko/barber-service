package com.h2osis.model.ajax

import com.h2osis.utils.ScriptsService
import grails.converters.JSON

class UtilsAjaxController {

    ScriptsService scriptsService

    def runScript() {

        def scriptResult = scriptsService.runScript(params.script, params.method, params.getBoolean("isStatic"))
        render([scriptResult: scriptResult] as JSON)

    }
}
