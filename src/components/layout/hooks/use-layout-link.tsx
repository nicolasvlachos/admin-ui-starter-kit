import { useMemo } from 'react';

import {
	resolveLayoutLinkRenderer,
	type LayoutLinkRenderer,
	type LayoutNavigationAdapter,
} from '../layout.types';

export function useLayoutLinkRenderer({
	renderLink,
	LinkComponent,
}: LayoutNavigationAdapter = {}): LayoutLinkRenderer {
	return useMemo(
		() => resolveLayoutLinkRenderer({ renderLink, LinkComponent }),
		[renderLink, LinkComponent],
	);
}
