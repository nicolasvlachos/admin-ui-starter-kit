import { useCallback, useMemo, useState } from 'react';

type UseSharedResourceCardOptions<TResource, TSuggestion> = {
    resource: TResource | null;
    hasResource: boolean;
    mapInitialSelected: (resource: TResource | null) => TSuggestion | null;
    onConfirmSelection: (selection: TSuggestion) => void | Promise<void>;
    isConfirmDisabled?: (selection: TSuggestion | null) => boolean;
    onDialogOpen?: (selection: TSuggestion | null) => void;
    onDialogClose?: () => void;
    /** Called when `onConfirmSelection` throws. Library DEV-logs the error;
     *  consumer wires telemetry. */
    onError?: (error: unknown, selection: TSuggestion) => void;
};

export function useSharedResourceCard<TResource, TSuggestion>({
    resource,
    hasResource,
    mapInitialSelected,
    onConfirmSelection,
    isConfirmDisabled,
    onDialogOpen,
    onDialogClose,
    onError,
}: UseSharedResourceCardOptions<TResource, TSuggestion>) {
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [selectedSuggestion, setSelectedSuggestion] =
        useState<TSuggestion | null>(null);

    const openSelector = useCallback(() => {
        const initial = mapInitialSelected(resource);
        setSelectedSuggestion(initial);
        setIsSelectorOpen(true);
        onDialogOpen?.(initial);
    }, [mapInitialSelected, onDialogOpen, resource]);

    const closeSelector = useCallback(() => {
        if (isConfirming) {
            return;
        }

        setIsSelectorOpen(false);
        setSelectedSuggestion(null);
        onDialogClose?.();
    }, [isConfirming, onDialogClose]);

    const canConfirmSelection = useMemo(() => {
        if (selectedSuggestion === null) {
            return false;
        }

        if (!isConfirmDisabled) {
            return true;
        }

        return !isConfirmDisabled(selectedSuggestion);
    }, [isConfirmDisabled, selectedSuggestion]);

    const confirmSelection = useCallback(async () => {
        if (
            isConfirming ||
            !canConfirmSelection ||
            selectedSuggestion === null
        ) {
            return;
        }

        setIsConfirming(true);

        try {
            await onConfirmSelection(selectedSuggestion);
            setIsSelectorOpen(false);
            setSelectedSuggestion(null);
            onDialogClose?.();
        } catch (error) {
            if (import.meta.env?.DEV) {
	            console.error(
	                'SharedResourceCard confirmation failed:',
	                error,
	            );
            }
            onError?.(error, selectedSuggestion);
        } finally {
            setIsConfirming(false);
        }
    }, [
        canConfirmSelection,
        isConfirming,
        onConfirmSelection,
        onDialogClose,
        onError,
        selectedSuggestion,
    ]);

    return useMemo(
        () => ({
            resource,
            hasResource,
            isSelectorOpen,
            isConfirming,
            selectedSuggestion,
            setSelectedSuggestion,
            openSelector,
            closeSelector,
            confirmSelection,
            canConfirmSelection,
        }),
        [
            canConfirmSelection,
            closeSelector,
            confirmSelection,
            hasResource,
            isConfirming,
            isSelectorOpen,
            openSelector,
            resource,
            selectedSuggestion,
        ],
    );
}
