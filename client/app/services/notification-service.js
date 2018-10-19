import Service, { inject as service } from '@ember/service';

export default Service.extend({
    toast: service(),

    showInfoMessage(message, title = '', options = {}) {
        const toast = this.toast;
        toast.info(message, title, options);
    },

    showErrorMessage(message, title = '', options = {}) {
        const toast = this.toast;
        toast.error(message, title, options);
    },

    showSuccessMessage(message, title = '', options = {}) {
        const toast = this.toast;
        toast.success(message, title, options);
    },

    showWarningMessage(message, title = '', options = {}) {
        const toast = this.toast;
        toast.warning(message, title, options);
    },

    removeToast(item) {
        const toast = this.toast;
        toast.remove(item);
    },

    removeAllToasts() {
        const toast = this.toast;
        toast.remove();
    }
});
