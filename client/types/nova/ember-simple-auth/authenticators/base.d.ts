declare module 'ember-simple-auth/authenticators/base' {
    import EmberObject from '@ember/object';
    import Evented from '@ember/object/evented';
    import RSVP from 'rsvp';

    class Base extends EmberObject.extend(Evented) {
        authenticate(...args: any[]): RSVP.Promise<string>;
        invalidate(...args: any[]): RSVP.Promise<string>;
        restore(data: object): RSVP.Promise<string>;
    }

    export = Base;
}
