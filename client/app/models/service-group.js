import DS from 'ember-data';
import Service from './service';

export default Service.extend({
	serviceToGroups: DS.hasMany("serviceToGroup", { inverse: null }),
});
