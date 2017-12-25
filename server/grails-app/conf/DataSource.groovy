dataSource {
    pooled = true
    jmxExport = true
    logSql = true
}
hibernate {
    cache.use_second_level_cache = true
    cache.use_query_cache = false
    cache.region.factory_class = 'org.hibernate.cache.SingletonEhCacheRegionFactory' // Hibernate 3
//    cache.region.factory_class = 'org.hibernate.cache.ehcache.SingletonEhCacheRegionFactory' // Hibernate 4
    singleSession = true // configure OSIV singleSession mode
    flush.mode = 'manual' // OSIV session flush mode outside of transactional context
    //hibernate.search.default.indexBase = '/var/lib/openshift/594b85c80c1e66674f00010f/app-root/data'
}

// environment specific settings
environments {
    test {
        dataSource {
            dbCreate = "update"
            url = "jdbc:h2:mem:testDb;MVCC=TRUE;LOCK_TIMEOUT=10000;DB_CLOSE_ON_EXIT=FALSE"
        }
    }
    production {

        hibernate {
            // hibernate search configuration:
            //search.default.directory_provider = 'ram'
           // search.default.indexBase =  '/app-root/data'
        }
        dataSource {
            dataSource.dbCreate = "update"
            dataSource.driverClassName = "com.mysql.jdbc.Driver"
//dataSource.url="jdbc:mysql://localhost:3306/barber"
            dataSource.username = "userL1V"
            dataSource.password = "plQyPDaARyYUuahp"
            logSql = true
            dbCreate = "update" // one of 'create', 'create-drop', 'update', 'validate', ''
            url = "jdbc:mysql://mysql:3306/barbers"
        }

//        dataSource {
//            dataSource.dbCreate="update"
//            dataSource.driverClassName="com.mysql.jdbc.Driver"
//            dataSource.username="userL1V"
//            dataSource.password="plQyPDaARyYUuahp"
//            logSql = true
//            url = "jdbc:mysql://mysql:3306/barbers"
//        }
    }
}
