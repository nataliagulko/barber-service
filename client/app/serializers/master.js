import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
	attrs: {
		services: { serialize: true },
		//subservices: { serialize: true }
	}
});
