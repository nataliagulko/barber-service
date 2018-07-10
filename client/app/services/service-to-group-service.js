import Service from '@ember/service';
import { inject } from '@ember/service';
import $ from 'jquery';

export default Service.extend({
    store: inject("store"),
    servicesToGroup: [],
    serviceToGroupTimeout: 0,
    isRowAddingDisabled: false,

    addServiceToGroup: function () {
        let servicesToGroup = this.get("servicesToGroup");
        const serviceToGroupRecord = this.get("store").createRecord("serviceToGroup");

        servicesToGroup.pushObject(serviceToGroupRecord);
        this._changeIsRowAddingDisabled();
    },

    showSubservices: function (serviceGroup, _this) {
        let servicesToGroup = serviceGroup
            .get("servicesToGroup")
            .toArray();

        if (servicesToGroup.get("length") > 0) {
            servicesToGroup = servicesToGroup.sortBy("serviceOrder");
            this.set("servicesToGroup", servicesToGroup);
        } else {
            this.set("servicesToGroup", []);
            _this.send("addServiceToGroup");
        }
    },

    selectSubservice: function (serviceToGroup, subservice, serviceGroup) {
        if (typeof subservice === "undefined") {
            return;
        }

        serviceToGroup.set("service", subservice);
        this._calculateServiceGroupCostAndTime(serviceGroup);
        this._changeIsRowAddingDisabled();
    },

    _calculateServiceGroupCostAndTime: function (serviceGroup) {
        const servicesToGroup = this.get("servicesToGroup");

        let serviceGroupCost = 0,
            serviceGroupTime = 0;

        servicesToGroup.forEach(function (serviceToGroup) {
            let innerService = serviceToGroup.get("service");

            serviceGroupCost += innerService.get("cost");
            serviceGroupTime += innerService.get("time");
        });

        serviceGroup.set("cost", Number(serviceGroupCost));
        serviceGroup.set("time", Number(serviceGroupTime));
    },

    _changeIsRowAddingDisabled: function () {
        // if subservices not chosen
        // if servicesToGroup list is empty

        let isRowAddingDisabled = this.get("isRowAddingDisabled"),
            servicesToGroup = this.get("servicesToGroup");

        if (servicesToGroup.length > 0) {
            isRowAddingDisabled = false;
        } else {
            isRowAddingDisabled = true;
        }

        this.set("isRowAddingDisabled", isRowAddingDisabled);
    },

    removeServiceToGroup: function (record, serviceGroup) {
        let servicesToGroup = this.get("servicesToGroup");

        servicesToGroup.removeObject(record);
        record.destroyRecord("serviceToGroup");

        this._calculateServiceGroupCostAndTime(serviceGroup);
        this._changeIsRowAddingDisabled();
    },

    reorderSubservices: function (subservicesOrderedArr) {
        this.set("servicesToGroup", subservicesOrderedArr);
    },

    inputServiceToGroupTimeout: function (serviceGroup) {
        let serviceGroupTime = serviceGroup.get("time"),
            // previous saved summary of timeouts:
            serviceToGroupTimeout = this.get("serviceToGroupTimeout"),
            // current summary of timeouts
            serviceTimeout = 0,
            $timeouts = $("[name=serviceTimeout]");

        $timeouts.each(function (ind, elem) {
            serviceTimeout += Number(elem.value);
        });

        // subtract previous timeouts
        serviceGroupTime -= serviceToGroupTimeout;
        // add current timeouts
        serviceGroupTime += serviceTimeout;
        // save current timeouts
        serviceToGroupTimeout = serviceTimeout;
        serviceGroup.set("time", serviceGroupTime);
        this.set("serviceToGroupTimeout", serviceToGroupTimeout);
    },
});
