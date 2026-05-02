// src/hooks/useEventListener.ts
import { useEffect } from 'react';
import eventEmitter from '@/lib/event-emitter';


export function useEventListener<T = unknown>(
	eventName: string,
	callback: (data?: T) => void,
) {
	useEffect(() => {
		// Subscribe to the event
		// noinspection UnnecessaryLocalVariableJS
		const unsubscribe = eventEmitter.on(eventName, (...args: unknown[]) => {
			callback(args[0] as T | undefined);
		});

		// Unsubscribe when the component unmounts
		return unsubscribe;
	}, [eventName, callback]);
}

// Export the emitter for triggering events
export const emitEvent = <T = unknown>(eventName: string, data?: T) => {
	eventEmitter.emit(eventName, data);
};
