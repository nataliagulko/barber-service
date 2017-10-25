import ApplicationSerializer from './application';
import SaveRelationshipsMixin from 'ember-data-save-relationships';

export default ApplicationSerializer.extend(SaveRelationshipsMixin, {
	attrs: {
		masters: { serialize: true },
		subservices: { serialize: true }
	}
});
