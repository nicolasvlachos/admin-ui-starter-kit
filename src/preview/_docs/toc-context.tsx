import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export interface TocEntry {
	id: string;
	title: string;
}

interface TocContextValue {
	entries: TocEntry[];
	register: (entry: TocEntry) => void;
}

const TocContext = createContext<TocContextValue | null>(null);

export function TocProvider({ children }: { children: ReactNode }) {
	const [entries, setEntries] = useState<TocEntry[]>([]);

	const register = useCallback((entry: TocEntry) => {
		setEntries((prev) => {
			if (prev.some((e) => e.id === entry.id)) return prev;
			return [...prev, entry];
		});
	}, []);

	const value = useMemo(() => ({ entries, register }), [entries, register]);
	return <TocContext.Provider value={value}>{children}</TocContext.Provider>;
}

export function useToc(): TocContextValue {
	const ctx = useContext(TocContext);
	if (!ctx) {
		// Outside a DocsPage — return a no-op so Section is safe to render anywhere.
		return { entries: [], register: () => {} };
	}
	return ctx;
}
