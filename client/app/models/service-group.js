import DS from 'ember-data';
import Service from './service';

export default Service.extend({
	servicesToGroup: DS.hasMany("serviceToGroup"),
});
