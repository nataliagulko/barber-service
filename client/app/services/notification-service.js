import Ember from 'ember';

export default Ember.Service.extend({
    toast: Ember.inject.service(),

    showInfoMessage(message, title = '', options = {}) {
        const toast = this.get('toast');
        toast.info(message, title, options);
    },

    showErrorMessage(message, title = '', options = {}) {
        const toast = this.get('toast');
        toast.error(message, title, options);
    },

    showSuccessMessage(message, title = '', options = {}) {
        const toast = this.get('toast');
        toast.success(message, title, options);
    },

    showWarningMessage(message, title = '', options = {}) {
        const toast = this.get('toast');
        toast.warning(message, title, options);
    },

    removeToast(item) {
        const toast = this.get('toast');
        toast.remove(item);
    },

    removeAllToasts() {
        const toast = this.get('toast');
        toast.remove();
    }
});
