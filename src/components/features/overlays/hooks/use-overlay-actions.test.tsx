// @vitest-environment jsdom

import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useOverlayActions } from './use-overlay-actions';

describe('useOverlayActions', () => {
	it('submits the target form when a formId is provided', async () => {
		const form = document.createElement('form');
		form.id = 'orders-exports-csv-dialog';

		const requestSubmit = vi.fn();
		Object.defineProperty(form, 'requestSubmit', {
			value: requestSubmit,
			configurable: true,
		});

		document.body.appendChild(form);

		const { result } = renderHook(() =>
			useOverlayActions({
				closeDialog: vi.fn(),
				formId: 'orders-exports-csv-dialog',
			}),
		);

		await result.current.confirmButtonOnClick?.();

		expect(requestSubmit).toHaveBeenCalledTimes(1);

		form.remove();
	});
});
