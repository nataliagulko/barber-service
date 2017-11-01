import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
	attrs: {
		masters: { serialize: true },
		serviceToGroup: { serialize: true }
	}
});
