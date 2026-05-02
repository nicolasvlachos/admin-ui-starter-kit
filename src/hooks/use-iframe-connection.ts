import { useCallback, useEffect, useMemo, useRef } from 'react';

type ResizeMessage = { type: 'resize'; height: number; id: string };

type RequestResizeMessage = { type: 'requestResize'; id?: string };

export type UseIframeConnectionOptions = { extraPadding?: number };

const isIframeContext = () => {
	if (typeof window === 'undefined') return false;
	try {
		return window.self !== window.top;
	} catch {
		return true;
	}
};

const getReferrerOrigin = () => {
	if (typeof document === 'undefined') return null;
	const referrer = document.referrer;
	if (!referrer) return null;
	try {
		return new URL(referrer).origin;
	} catch {
		return null;
	}
};

// Loop detection constants
const MAX_CONSECUTIVE_SMALL_INCREASES = 6;
const SMALL_THRESHOLD = 20;
const COOLDOWN_MS = 800;

export const useIframeConnection = (id: string, options?: UseIframeConnectionOptions) => {
	const isEmbedded = useMemo(() => isIframeContext(), []);
	const extraPadding = options?.extraPadding ?? 16;

	// Stable refs — avoid re-creating callbacks when id/extraPadding change
	const idRef = useRef(id);
	idRef.current = id;
	const extraPaddingRef = useRef(extraPadding);
	extraPaddingRef.current = extraPadding;
	const targetOriginRef = useRef<string>(getReferrerOrigin() ?? '*');

	const lastSentHeightRef = useRef<number | null>(null);
	const rafRef = useRef<number | null>(null);
	const consecutiveSmallIncreasesRef = useRef(0);
	const loopDetectedRef = useRef(false);
	const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const calculateHeight = useCallback(() => {
		if (typeof document === 'undefined' || typeof window === 'undefined') return 0;

		const body = document.body;
		const html = document.documentElement;

		// scrollHeight only — offsetHeight/clientHeight feed back into parent iframe
		// height adjustments and cause infinite resize loops.
		const scrollHeight = Math.max(body?.scrollHeight ?? 0, html?.scrollHeight ?? 0);
		return Math.ceil(scrollHeight + extraPaddingRef.current);
	}, []);

	const resetLoopDetection = useCallback(() => {
		consecutiveSmallIncreasesRef.current = 0;
		loopDetectedRef.current = false;
	}, []);

	const sendHeightToParent = useCallback(() => {
		if (!isEmbedded) return;
		if (typeof window === 'undefined') return;
		if (!window.parent || window.parent === window) return;

		const height = calculateHeight();
		if (height <= 0) return;
		if (lastSentHeightRef.current === height) return;

		// Loop detection: flag when we see many consecutive small upward
		// increments — the signature of a feedback loop where parent resize
		// causes scrollHeight to grow by a few pixels each cycle.
		const lastSent = lastSentHeightRef.current;

		if (lastSent !== null) {
			const delta = height - lastSent;

			if (delta > 0 && delta <= SMALL_THRESHOLD) {
				consecutiveSmallIncreasesRef.current++;
				if (
					consecutiveSmallIncreasesRef.current >=
					MAX_CONSECUTIVE_SMALL_INCREASES
				) {
					loopDetectedRef.current = true;
				}
			} else {
				// Significant or downward change — legitimate content resize
				resetLoopDetection();
			}
		}

		// Cooldown: reset loop detection after activity settles so a brief
		// loop doesn't permanently block future legitimate resizes.
		if (cooldownTimerRef.current !== null) {
			clearTimeout(cooldownTimerRef.current);
		}
		cooldownTimerRef.current = setTimeout(() => {
			resetLoopDetection();
			cooldownTimerRef.current = null;
		}, COOLDOWN_MS);

		if (loopDetectedRef.current) {
			return;
		}

		lastSentHeightRef.current = height;

		const message: ResizeMessage = { type: 'resize', height, id: idRef.current };

		try {
			window.parent.postMessage(message, targetOriginRef.current || '*');
		} catch {
			// ignore — blocked cross-origin contexts
		}
	}, [isEmbedded, calculateHeight, resetLoopDetection]);

	const scheduleResize = useCallback(() => {
		if (!isEmbedded) return;
		if (typeof window === 'undefined') return;
		if (rafRef.current !== null) return;

		rafRef.current = window.requestAnimationFrame(() => {
			rafRef.current = null;
			sendHeightToParent();
		});
	}, [isEmbedded, sendHeightToParent]);

	// Listen for parent messages (origin handshake, resize requests)
	useEffect(() => {
		if (!isEmbedded) return;
		if (typeof window === 'undefined') return;

		const handleMessage = (event: MessageEvent) => {
			if (event.source !== window.parent) return;

			const data = event.data as unknown;
			if (!data || typeof data !== 'object') return;

			const type = (data as { type?: unknown }).type;

			if (type === 'shopOrigin') {
				const origin =
					typeof event.origin === 'string' && event.origin !== ''
						? event.origin
						: null;
				if (origin) {
					targetOriginRef.current = origin;
				}
				scheduleResize();
				return;
			}

			if (type === 'requestResize') {
				const msg = data as RequestResizeMessage;
				if (!msg.id || msg.id === idRef.current) scheduleResize();
			}
		};

		window.addEventListener('message', handleMessage);

		// Notify parent that we're ready
		try {
			window.parent?.postMessage({ type: 'iframeReady', id: idRef.current }, '*');
		} catch {
			// ignore
		}

		return () => window.removeEventListener('message', handleMessage);
	}, [isEmbedded, scheduleResize]);

	// Observe DOM changes to trigger height recalculation
	useEffect(() => {
		if (!isEmbedded) return;
		if (typeof window === 'undefined' || typeof document === 'undefined') return;

		scheduleResize();

		window.addEventListener('resize', scheduleResize);
		window.addEventListener('load', scheduleResize);

		let resizeObserver: ResizeObserver | null = null;
		if (typeof ResizeObserver !== 'undefined') {
			resizeObserver = new ResizeObserver(() => scheduleResize());
			if (document.documentElement)
				resizeObserver.observe(document.documentElement);
			if (document.body) resizeObserver.observe(document.body);
		}

		let mutationObserver: MutationObserver | null = null;
		if (typeof MutationObserver !== 'undefined' && document.body) {
			mutationObserver = new MutationObserver(() => scheduleResize());
			mutationObserver.observe(document.body, {
				attributes: true,
				childList: true,
				subtree: true,
				characterData: true,
			});
		}

		return () => {
			window.removeEventListener('resize', scheduleResize);
			window.removeEventListener('load', scheduleResize);
			resizeObserver?.disconnect();
			mutationObserver?.disconnect();
			if (rafRef.current !== null) {
				window.cancelAnimationFrame(rafRef.current);
				rafRef.current = null;
			}
			if (cooldownTimerRef.current !== null) {
				clearTimeout(cooldownTimerRef.current);
				cooldownTimerRef.current = null;
			}
		};
	}, [isEmbedded, scheduleResize]);

	return { isEmbedded, sendHeightToParent } as const;
};
