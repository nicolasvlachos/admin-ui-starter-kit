/**
 * Reusable hooks for DataTable consumers building custom toolbars or chrome.
 *
 * The default `DataTableToolbar` already wires these internally; expose them
 * for consumers that need horizontal-scroll arrows / dense toggle in a
 * custom layout (e.g. inside a hero banner above the table).
 */
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

const SCROLL_AMOUNT_DEFAULT = 300;

/**
 * Locate the actual horizontally-scrollable element inside a `tableArea`
 * wrapper. The shadcn-style Table primitive renders a
 * `<div data-slot="table-container" class="overflow-x-auto">` we target.
 */
export function getDataTableScrollContainer(
	tableArea: HTMLDivElement | null,
): HTMLDivElement | null {
	if (!tableArea) return null;
	return tableArea.querySelector<HTMLDivElement>('[data-slot="table-container"]');
}

export interface UseDataTableScrollStateReturn {
	canScrollLeft: boolean;
	canScrollRight: boolean;
	scrollBy: (delta: number) => void;
	scrollLeft: () => void;
	scrollRight: () => void;
}

/**
 * Track horizontal-overflow state for a DataTable wrapper. Returns booleans
 * for whether each scroll direction is available, plus helpers to nudge the
 * scroll container by a fixed amount.
 *
 * Pass the same `RefObject<HTMLDivElement>` you pass to `<DataTable>` as
 * `tableAreaRef`.
 */
export function useDataTableScrollState(
	tableAreaRef: RefObject<HTMLDivElement | null>,
	options: { stepPx?: number; deps?: ReadonlyArray<unknown> } = {},
): UseDataTableScrollStateReturn {
	const { stepPx = SCROLL_AMOUNT_DEFAULT, deps = [] } = options;
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);
	const rafRef = useRef(0);

	const measure = useCallback(() => {
		const el = getDataTableScrollContainer(tableAreaRef.current);
		if (!el) {
			setCanScrollLeft(false);
			setCanScrollRight(false);
			return;
		}
		const { scrollLeft, scrollWidth, clientWidth } = el;
		setCanScrollLeft(scrollLeft > 1);
		setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
	}, [tableAreaRef]);

	useEffect(() => {
		const timerId = window.setTimeout(() => {
			const el = getDataTableScrollContainer(tableAreaRef.current);
			if (!el) return;

			measure();

			const handleScroll = () => {
				cancelAnimationFrame(rafRef.current);
				rafRef.current = requestAnimationFrame(measure);
			};

			el.addEventListener('scroll', handleScroll, { passive: true });
			const ro = new ResizeObserver(measure);
			ro.observe(el);
			if (el.firstElementChild) ro.observe(el.firstElementChild);

			return () => {
				el.removeEventListener('scroll', handleScroll);
				cancelAnimationFrame(rafRef.current);
				ro.disconnect();
			};
		}, 0);

		return () => window.clearTimeout(timerId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tableAreaRef, measure, ...deps]);

	const scrollBy = useCallback(
		(delta: number) => {
			getDataTableScrollContainer(tableAreaRef.current)?.scrollBy({
				left: delta,
				behavior: 'smooth',
			});
		},
		[tableAreaRef],
	);

	const scrollLeft = useCallback(() => scrollBy(-stepPx), [scrollBy, stepPx]);
	const scrollRight = useCallback(() => scrollBy(stepPx), [scrollBy, stepPx]);

	return { canScrollLeft, canScrollRight, scrollBy, scrollLeft, scrollRight };
}

/**
 * localStorage-backed boolean state for the dense / comfortable toggle.
 * `null` storageKey disables persistence (the value is purely in-memory).
 */
export function usePersistentDensity(
	storageKey: string | null,
	defaultDense = false,
): [boolean, (next: boolean) => void] {
	const initial = (() => {
		if (!storageKey || typeof window === 'undefined') return defaultDense;
		try {
			const raw = window.localStorage.getItem(storageKey);
			if (raw === '1') return true;
			if (raw === '0') return false;
			return defaultDense;
		} catch {
			return defaultDense;
		}
	})();

	const [dense, setDenseState] = useState(initial);

	const setDense = useCallback(
		(next: boolean) => {
			setDenseState(next);
			if (storageKey && typeof window !== 'undefined') {
				try {
					window.localStorage.setItem(storageKey, next ? '1' : '0');
				} catch {
					/* ignore quota / disabled-storage errors */
				}
			}
		},
		[storageKey],
	);

	return [dense, setDense];
}
