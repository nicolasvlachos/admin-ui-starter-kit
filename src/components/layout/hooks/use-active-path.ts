import { useCallback } from 'react';

import { isPathMatch, toPath } from '../sidebar/sidebar.utils';

export function useActivePath(currentUrl = '/') {
	return useCallback(
		(href?: string) => !!href && isPathMatch(currentUrl, toPath(href)),
		[currentUrl],
	);
}
