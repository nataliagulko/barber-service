package com.h2osis.utils

import grails.transaction.Transactional

@Transactional
class ScriptsService {

    def runScript(String script, String method, Boolean isStatic) {

        try {
            ClassLoader gcl = new GroovyClassLoader()
            Class clazz = gcl.parseClass(script)

            def result
            if (isStatic) {
                result = clazz."$method"()
            } else {
                def inst = clazz.newInstance()
                result = inst."$method"()
            }

            return result

        } catch (Exception e) {
            return e.toString() && !e.toString().isEmpty()?e.toString():(e.stackTrace?.toString())
        }
    }
}
