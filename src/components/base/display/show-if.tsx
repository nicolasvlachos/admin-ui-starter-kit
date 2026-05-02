/**
 * ShowIf — conditional render gate. Returns `children` when `when` is truthy,
 * otherwise the optional `fallback`. Useful for inline presentation logic
 * where a ternary would be noisier than a self-explanatory tag.
 */
import type { ReactNode } from 'react';

export type ShowIfProps = { when: boolean; children: ReactNode; fallback?: ReactNode };

export function ShowIf({ when, children, fallback = null }: ShowIfProps) {
	if (when) return children;
	if (fallback) return fallback;
	return null;
}

ShowIf.displayName = 'ShowIf';

export default ShowIf;

