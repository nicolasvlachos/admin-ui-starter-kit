import { useEffect } from 'react';

export interface UseCommandShortcutOptions {
	key: string;
	enabled?: boolean;
	onTrigger?: () => void;
	preventDefault?: boolean;
}

export function useCommandShortcut({
	key,
	enabled = true,
	onTrigger,
	preventDefault = true,
}: UseCommandShortcutOptions) {
	useEffect(() => {
		if (!enabled || !onTrigger || typeof document === 'undefined') return;

		const handler = (event: KeyboardEvent) => {
			if (!(event.metaKey || event.ctrlKey)) return;
			if (event.key.toLowerCase() !== key.toLowerCase()) return;
			if (preventDefault) event.preventDefault();
			onTrigger();
		};

		document.addEventListener('keydown', handler);
		return () => document.removeEventListener('keydown', handler);
	}, [enabled, key, onTrigger, preventDefault]);
}
