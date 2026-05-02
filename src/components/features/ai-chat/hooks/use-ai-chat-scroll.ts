/**
 * useAiChatScroll — auto-stick-to-bottom scroll behaviour for chat
 * conversations. Detects when the user has scrolled away from the latest
 * message and pauses auto-scroll until they return.
 *
 * Returns:
 *   - `containerRef` — attach to the scroll viewport.
 *   - `endRef`       — attach to a sentinel at the very bottom.
 *   - `isAtBottom`   — true when the viewport is pinned to the latest content.
 *   - `scrollToBottom` — imperatively scroll to the sentinel.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseAiChatScrollOptions {
	/** Distance (px) from bottom counted as "at bottom". */
	threshold?: number;
	/** Re-evaluate on these dependencies (typically the message count). */
	dependency?: unknown;
	/** Disable auto-scroll-on-update behaviour. */
	disableAutoScroll?: boolean;
}

export interface UseAiChatScrollReturn {
	containerRef: React.RefObject<HTMLDivElement | null>;
	endRef: React.RefObject<HTMLDivElement | null>;
	isAtBottom: boolean;
	scrollToBottom: (behavior?: ScrollBehavior) => void;
}

export function useAiChatScroll({
	threshold = 80,
	dependency,
	disableAutoScroll = false,
}: UseAiChatScrollOptions = {}): UseAiChatScrollReturn {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const endRef = useRef<HTMLDivElement | null>(null);
	const [isAtBottom, setIsAtBottom] = useState(true);

	const scrollToBottom = useCallback(
		(behavior: ScrollBehavior = 'smooth') => {
			endRef.current?.scrollIntoView({ behavior, block: 'end' });
		},
		[],
	);

	// Track scroll position so we can pause auto-scroll when the user reads up.
	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const onScroll = () => {
			const distance = el.scrollHeight - el.clientHeight - el.scrollTop;
			setIsAtBottom(distance <= threshold);
		};
		onScroll();
		el.addEventListener('scroll', onScroll, { passive: true });
		return () => el.removeEventListener('scroll', onScroll);
	}, [threshold]);

	// Auto-scroll when content updates and the user is pinned at the bottom.
	useEffect(() => {
		if (disableAutoScroll) return;
		if (!isAtBottom) return;
		// Use rAF so we wait for layout to settle after the new content paints.
		const id = window.requestAnimationFrame(() => scrollToBottom('auto'));
		return () => window.cancelAnimationFrame(id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dependency, disableAutoScroll]);

	return { containerRef, endRef, isAtBottom, scrollToBottom };
}
