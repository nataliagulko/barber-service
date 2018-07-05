import DS from 'ember-data';
import { validator, buildValidations } from 'ember-cp-validations';
import { computed } from '@ember/object';

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
	masters: [
		validator('has-many'),
		validator('presence', true)
	]
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
	extensionShort: computed('extension', function () {
		const ext = this.get('extension').split(".");

		return ext[ext.length - 1];
	}),
	masters: DS.hasMany('master'),
});
