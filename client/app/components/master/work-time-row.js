import Component from '@ember/component';

export default Component.extend({
    classNames: ['form-inline'],

    change() {
        const item = this.get("workTime");
        item.wasChanged = true;
    }
});
