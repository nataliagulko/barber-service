import DS from 'ember-data';

export default DS.Model.extend({
	master: DS.belongsTo('master'),
	start: DS.attr(),
    end: DS.attr(),
	slotDate: DS.attr()    
});
