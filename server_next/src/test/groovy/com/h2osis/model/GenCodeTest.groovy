package com.h2osis.model

import org.junit.Assert
import org.junit.Test

class GenCodeTest {

    @Test
    void testGenCode(){
       String code = Business.getCode("Ромашко")
        System.out.print(code)
        Assert.assertTrue(code.equals("Romasko"))

    }


}
