import { useCallback, useState } from 'react';

export interface UseResourceSelectorActionOptions<TResource = unknown> {
	onSelect?: (resource: TResource) => void;
	onOpenChange?: (open: boolean) => void;
}

export interface UseResourceSelectorActionReturn<TResource = unknown> {
	open: boolean;
	selectedResource: TResource | null;
	openSelector: () => void;
	closeSelector: () => void;
	selectResource: (resource: TResource) => void;
	setOpen: (open: boolean) => void;
}

export function useResourceSelectorAction<TResource = unknown>(
	options: UseResourceSelectorActionOptions<TResource> = {},
): UseResourceSelectorActionReturn<TResource> {
	const { onSelect, onOpenChange } = options;
	const [open, setOpenState] = useState(false);
	const [selectedResource, setSelectedResource] = useState<TResource | null>(null);

	const setOpen = useCallback((nextOpen: boolean) => {
		setOpenState(nextOpen);
		onOpenChange?.(nextOpen);
	}, [onOpenChange]);

	const openSelector = useCallback(() => setOpen(true), [setOpen]);
	const closeSelector = useCallback(() => setOpen(false), [setOpen]);

	const selectResource = useCallback((resource: TResource) => {
		setSelectedResource(resource);
		onSelect?.(resource);
		setOpen(false);
	}, [onSelect, setOpen]);

	return {
		open,
		selectedResource,
		openSelector,
		closeSelector,
		selectResource,
		setOpen,
	};
}
