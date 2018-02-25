package com.h2osis.sm

import grails.transaction.Transactional

@Transactional
class SMManagerService {

    def getTransitions(String objectType, String state) {
        return SMTransition.findAllByObjectTypeAndStateFrom(objectType, state)
    }

    def getObjectTransitions(String objectType, Long objectId) {
        if (SMObjectState.countByObjectId(objectId)) {
            return SMTransition.
                    findAllByObjectTypeAndStateFrom(objectType, SMObjectState.findByObjectTypeAndObjectId(objectType, objectId)?.state)
        } else {
            return null
        }
    }

    def isAbleTrans(String objectType, String from, String to) {
        def transCount = SMTransition.countByObjectTypeAndStateFromAndStateTo(objectType, from, to)
        return (transCount != null && transCount > 0)
    }

    def transObject(String objectType, Long objectId, String state) {
        if (SMObjectState.countByObjectId(objectId)) {
            SMObjectState objectState = SMObjectState.findByObjectIdAndObjectType(objectId, objectType)
            if (isAbleTrans(objectType, objectState.state, state)) {
                objectState.setState(state)
                objectState.save(flush: true)
                return objectState.id
            } else {
                return null
            }
        } else {
            SMObjectState objectState = new SMObjectState()
            objectState.setObjectId(objectId)
            objectState.setState(state)
            objectState.setObjectType(objectType)
            objectState.save(flush: true)
            return objectState.id
        }
    }

    def transObject(String objectType, Long objectId, String state, Boolean flash) {
        if (SMObjectState.countByObjectId(objectId)) {
            SMObjectState objectState = SMObjectState.findByObjectIdAndObjectType(objectId, objectType)
            if (isAbleTrans(objectType, objectState.state, state)) {
                objectState.setState(state)
                objectState.save(flush: flash)
                return objectState.id
            } else {
                return null
            }
        } else {
            SMObjectState objectState = new SMObjectState()
            objectState.setObjectId(objectId)
            objectState.setState(state)
            objectState.setObjectType(objectType)
            objectState.save(flush: flash)
            return objectState.id
        }
    }
}
