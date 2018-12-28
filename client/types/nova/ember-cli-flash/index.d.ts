import EmberObject from '@ember/object';
import Evented from '@ember/object/evented';
import Service from '@ember/service';

type Partial<T> = { [K in keyof T]?: T[K] };
interface MessageOptions {
	type: string;
	priority: number;
	timeout: number;
	sticky: boolean;
	showProgress: boolean;
	extendedTimeout: number;
	destroyOnClick: boolean;
	onDestroy: () => void;
}
interface CustomMessageInfo extends Partial<MessageOptions> {
	message: string;
}
interface FlashFunction {
	(message: string, options?: Partial<MessageOptions>): FlashMessageService;
}

declare class FlashObject extends EmberObject {
	exiting: boolean;
	exitTimer: number;
	isExitable: boolean;
	initializedTime: number;
	destroyMessage(): void;
	exitMessage(): void;
	preventExit(): void;
	allowExit(): void;
	timerTask(): void;
	exitTimerTask(): void;
}

export default class FlashMessageService extends Service {
	success: FlashFunction;
	warning: FlashFunction;
	info: FlashFunction;
	danger: FlashFunction;
	alert: FlashFunction;
	secondary: FlashFunction;
	add(messageInfo: CustomMessageInfo): FlashMessageService;
	clearMessages(): FlashMessageService;
	registerTypes(types: string[]): FlashMessageService;
	getFlashObject(): FlashObject;
}

declare module 'ember-cli-flash/services/flash-messages' {
	export = FlashMessageService
}

declare module '@ember/service' {
	interface Registry {
		flash: FlashMessageService;
	}
}