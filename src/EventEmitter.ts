// Generic type for an event map where each key has a listener signature
// biome-ignore lint/suspicious/noExplicitAny: 
type EventMap = Record<string, (...args: any[]) => void>;

class EventEmitter<T extends EventMap> {
	events: { [K in keyof T]?: T[K][] } = {};
	enableLogging = false;

	log(...args: unknown[]) {
		if (this.enableLogging) {
			console.log(...args);
		}
	}

	on<K extends keyof T>(event: K, listener: T[K]): void {
		if (!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push(listener);
	}

	off<K extends keyof T>(event: K, listener: T[K]): void {
		const listeners = this.events[event];
		if (!listeners) return;
		this.events[event] = listeners.filter((l) => l !== listener);
	}

	emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): void {
		this.log("Emitting event:", event, "with args:", ...args);
		const listeners = this.events[event];
		if (!listeners) return;
		for (const listener of listeners) {
			listener(...args);
		}
	}
}

export default EventEmitter;
