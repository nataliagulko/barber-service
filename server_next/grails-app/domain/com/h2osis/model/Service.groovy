package com.h2osis.model

import com.h2osis.auth.User

class Service {

    String name // название услуги
    Float cost // стоимость в рублях
    Long time // время выполнения в минутах
    Boolean partOfList // в составе группы услуг
    static hasMany = [masters: User] // парикмахеры, предоставляющие услугу

    static constraints = {
        name nullable: false
        cost nullable: false
        time nullable: false
        partOfList nullable: true
        masters nullable: false, minSize: 1
    }

    static search = {
        name index: 'tokenized'
        cost index: 'tokenized'
        time index: 'tokenized'
        masters indexEmbedded: [depth: 1]
    }

    String toString() {
        return name
    }

    static def getOnlySubServices(def params, def sessionFactory){
        final session = sessionFactory.currentSession
        // Запрос с выборкой айди, учитывая класс
        final String query = 'select id from service'
        query +=' where class like "com.h2osis.model.Service"'
        if(params.sort) {
            query += " order by $params.sort"
        }
        if(params.offset && params.max) {
            query += " limit $params.offset, $params.max"
        }
        // создадим запрос
        final sqlQuery = session.createSQLQuery(query)
        final queryResults = sqlQuery.with {
            list()
        }
        final List<Long> results = queryResults.collect { it }
        return Service.findAllByIdInList(results)
    }
}
