import Component from '@ember/component';
import { inject } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
    classNames: ['form-inline'],
	constants: inject("constants-service"),
	timeMask: readOnly("constants.TIME_MASK"),

    change() {
        const item = this.workTime;
        item.wasChanged = true;
    }
});
