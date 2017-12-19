import DS from 'ember-data';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
	name: validator('presence', true),
	cost: validator('number', {
		allowString: true,
		gt: 0
	}),
	time: validator('number', {
		allowString: true,
		gt: 0
	}),
	masters: validator('has-many')
});

export default DS.Model.extend(Validations, {
	name: DS.attr('string'),
	cost: DS.attr('number', {
		defaultValue() { return 0; }
	}),
	time: DS.attr('number', {
		defaultValue() { return 0; }
	}),
	partOfList: DS.attr('boolean'),
	extension: DS.attr('string'),
	extensionShort: Ember.computed('extension', function() {
		let ext = this.get('extension').split("."),
			short = ext[ext.length - 1];

		return short;
	}),
	masters: DS.hasMany('master'),
	serviceToGroup: DS.belongsTo("serviceToGroup", { inverse: null }),
});
