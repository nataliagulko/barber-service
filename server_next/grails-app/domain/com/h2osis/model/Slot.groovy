package com.h2osis.model

import com.h2osis.auth.User

class Slot {

    String start // время С
    String end // время ПО
    Date slotDate
    User master


    static constraints = {
        slotDate nullable: true
        master nullable: true
    }

    String toString() {
        return start.concat(' - ').concat(end).concat(" (").concat(master).concat(" ").concat(slotDate).concat(")")
    }
}
