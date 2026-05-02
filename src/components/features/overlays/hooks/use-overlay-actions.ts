import { useCallback, useMemo, useState } from 'react';

import { useStrings, type StringsProp } from '@/lib/strings';

import {
	defaultOverlayStrings,
	type OverlayStrings,
} from '../overlays.strings';
import type {
	ButtonVariant,
	OverlayActionProps,
	OverlayTone,
} from '../overlays.types';

export interface UseOverlayActionsOptions
	extends Pick<
		OverlayActionProps,
		| 'onConfirm'
		| 'onAsyncConfirm'
		| 'closeOnAsyncComplete'
		| 'confirmVariant'
		| 'isLoading'
		| 'formId'
	> {
	closeDialog: () => void;
	onCancel?: () => void;
	customStrings?: StringsProp<OverlayStrings>;
	emphasis?: boolean;
	tone?: OverlayTone;
	/** Called when `onAsyncConfirm` throws. Library DEV-logs the error;
	 *  consumer wires telemetry. */
	onError?: (error: unknown) => void;
}

export interface UseOverlayActionsReturn {
	strings: OverlayStrings;
	isExecuting: boolean;
	handleConfirm: () => Promise<void>;
	handleCancel: () => void;
	finalConfirmVariant: ButtonVariant;
	confirmButtonOnClick: (() => Promise<void>) | undefined;
	effectiveLoading: boolean;
}

export function useOverlayActions({
	closeDialog,
	onConfirm,
	onAsyncConfirm,
	closeOnAsyncComplete = true,
	confirmVariant = 'primary',
	isLoading = false,
	formId,
	onCancel,
	customStrings,
	emphasis = false,
	tone = 'default',
	onError,
}: UseOverlayActionsOptions): UseOverlayActionsReturn {
	const strings = useStrings(defaultOverlayStrings, customStrings);

	const [isExecuting, setIsExecuting] = useState(false);

	const handleConfirm = useCallback(async () => {
		if (onConfirm) {
			onConfirm();
			closeDialog();
			return;
		}

		if (onAsyncConfirm) {
			setIsExecuting(true);
			try {
				await onAsyncConfirm();
				if (closeOnAsyncComplete) {
					closeDialog();
				}
			} catch (error) {
				if (import.meta.env?.DEV) {
					console.error('Overlay async confirm failed:', error);
				}
				onError?.(error);
			} finally {
				setIsExecuting(false);
			}
			return;
		}

		closeDialog();
	}, [onConfirm, onAsyncConfirm, closeOnAsyncComplete, closeDialog, onError]);

	const handleCancel = useCallback(() => {
		onCancel?.();
		closeDialog();
	}, [onCancel, closeDialog]);

	const handleFormSubmit = useCallback(async () => {
		if (!formId) {
			return;
		}

		const form = document.getElementById(formId);

		if (!(form instanceof HTMLFormElement)) {
			return;
		}

		form.requestSubmit();
	}, [formId]);

	const finalConfirmVariant = useMemo<ButtonVariant>(() => {
		if (!emphasis) return confirmVariant ?? 'primary';
		if (tone === 'error') return 'error';
		if (tone === 'warning') return 'warning';
		if (tone === 'success') return 'success';
		return confirmVariant ?? 'primary';
	}, [emphasis, tone, confirmVariant]);

	const confirmButtonOnClick = formId ? handleFormSubmit : handleConfirm;

	return {
		strings,
		isExecuting,
		handleConfirm,
		handleCancel,
		finalConfirmVariant,
		confirmButtonOnClick,
		effectiveLoading: isExecuting || isLoading,
	};
}
