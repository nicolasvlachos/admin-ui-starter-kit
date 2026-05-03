import { Fragment, isValidElement, type ReactNode } from 'react';

/**
 * Predicate used by SmartCard subregions to decide whether each slot
 * warrants rendering its wrapper. Numbers (incl. `0`) and JSX always
 * render; falsy / empty-string content is treated as absent. Fragments
 * recurse into their children.
 */
export function hasRenderableContent(content?: ReactNode): boolean {
	if (content === null || content === undefined) return false;
	if (typeof content === 'boolean') return false;
	if (typeof content === 'string') return content.trim().length > 0;
	if (typeof content === 'number' || typeof content === 'bigint') return true;
	if (Array.isArray(content)) return content.some(hasRenderableContent);
	if (isValidElement<{ children?: ReactNode }>(content)) {
		if (content.type === Fragment) return hasRenderableContent(content.props.children);
		return true;
	}
	return true;
}
