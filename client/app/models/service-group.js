import DS from 'ember-data';
import Service from './service';

export default Service.extend({
	servicesToGroups: DS.hasMany("serviceToGroup"),
});
