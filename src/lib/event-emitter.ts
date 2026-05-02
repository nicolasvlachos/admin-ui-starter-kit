type Listener = (...args: unknown[]) => void;

class EventEmitter {
	private listeners = new Map<string, Set<Listener>>();

	on(eventName: string, listener: Listener): () => void {
		const listeners = this.listeners.get(eventName) ?? new Set<Listener>();
		listeners.add(listener);
		this.listeners.set(eventName, listeners);

		return () => {
			listeners.delete(listener);
			if (listeners.size === 0) this.listeners.delete(eventName);
		};
	}

	emit(eventName: string, ...args: unknown[]) {
		this.listeners.get(eventName)?.forEach((listener) => listener(...args));
	}
}

export default new EventEmitter();
