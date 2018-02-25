package com.h2osis.utils

import grails.transaction.Transactional

@Transactional
class BarberSecurityService {

    def generator = { String alphabet, int n ->
        new Random().with {
            (1..n).collect { alphabet[ nextInt( alphabet.length() ) ] }.join()
        }
    }
}
