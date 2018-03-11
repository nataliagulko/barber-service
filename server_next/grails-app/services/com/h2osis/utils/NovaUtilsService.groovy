package com.h2osis.utils

class NovaUtilsService {

    def getFullPhone(String phone) {
        String res = phone
        try {
            if (res.startsWith("8")) {
                res = res.substring(1, res.length())
            }
            res = "+7("
                    .concat(res.substring(0, 3))
                    .concat(")")
                    .concat(res.substring(3, 6))
                    .concat("-")
                    .concat(res.substring(6,8))
                    .concat("-")
                    .concat(res.substring(8,10))
            //+7(912)114 - 79 - 90
        }catch (Exception e){
            return  res
        }
        return res
    }

    def getErrorsSingleArrayJSON(String err) {
        return Collections.singletonList(err)
    }

}
